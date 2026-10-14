-- ============================================================
-- TEST 5: TRANSACTION ATOMICITY AND ROLLBACK
-- LOCAL DATABASE ONLY
-- ============================================================

begin;

-- 1. Generate a unique fictional token hash.

select set_config(
  'rsvp_test.atomicity_hash',
  md5(gen_random_uuid()::text) ||
  md5(gen_random_uuid()::text),
  true
);


-- 2. Create fictional wedding and invitation.

with test_wedding as (
  insert into public.weddings (
    slug,
    couple_names,
    event_date,
    rsvp_deadline
  )
  values (
    'qa-atomicity-' || gen_random_uuid()::text,
    'Boda de prueba',
    now() + interval '30 days',
    now() + interval '7 days'
  )
  returning id
)
insert into public.invitations (
  wedding_id,
  household_name,
  access_token_hash,
  max_guests
)
select
  id,
  'Familia de prueba',
  current_setting('rsvp_test.atomicity_hash'),
  4
from test_wedding;


-- 3. Create the initial RSVP as service_role.

set local role service_role;

do $test$
declare
  v_result jsonb;
begin

  v_result := public.submit_rsvp(
    current_setting('rsvp_test.atomicity_hash'),
    'accepted',
    array['Ana López', 'Luis López'],
    'Mensaje original',
    0
  );

  if v_result->>'result' is distinct from 'created'
     or (v_result->>'version')::integer is distinct from 1 then

    raise exception 'SETUP FAILED: Initial RSVP';

  end if;

end;
$test$;

reset role;


-- 4. Artificially reserve sync job version 2.
-- This intentionally creates the condition for a future
-- unique constraint violation.

insert into private.sheet_sync_jobs (
  rsvp_id,
  rsvp_version
)
select
  r.id,
  2
from public.rsvps r
join public.invitations i
  on i.id = r.invitation_id
where i.access_token_hash =
  current_setting('rsvp_test.atomicity_hash');


-- 5. Attempt to update the RSVP.
-- The synchronization job insertion must fail.

set local role service_role;

do $test$
declare
  v_constraint text;
begin

  begin

    perform public.submit_rsvp(
      current_setting('rsvp_test.atomicity_hash'),
      'accepted',
      array[
        'Ana López',
        'Luis López',
        'Pedro López'
      ],
      'Mensaje modificado',
      1
    );

    raise exception
      'TEST FAILED: Update unexpectedly succeeded';

  exception
    when unique_violation then

      get stacked diagnostics
        v_constraint = CONSTRAINT_NAME;

      if v_constraint is distinct from
         'sheet_sync_jobs_unique_version' then

        raise exception
          'TEST FAILED: Unexpected unique constraint: %',
          v_constraint;

      end if;

      raise notice
        'Expected sync job failure detected';

  end;

end;
$test$;

reset role;


-- 6. Verify that the original RSVP was preserved.

with test_state as (
  select
    r.status,
    r.version,
    r.message,
    array(
      select g.full_name
      from public.guests g
      where g.rsvp_id = r.id
      order by g.full_name collate "C"
    ) as guests,
    array(
      select j.rsvp_version
      from private.sheet_sync_jobs j
      where j.rsvp_id = r.id
      order by j.rsvp_version
    ) as sync_job_versions
  from public.rsvps r
  join public.invitations i
    on i.id = r.invitation_id
  where i.access_token_hash =
    current_setting('rsvp_test.atomicity_hash')
)
select
  status,
  version,
  message,
  guests,
  sync_job_versions,
  case
    when status = 'accepted'
     and version = 1
     and message = 'Mensaje original'
     and guests = array[
       'Ana López',
       'Luis López'
     ]::text[]
     and sync_job_versions = array[1, 2]::integer[]
    then 'PASS'
    else 'FAIL'
  end as atomicity_test
from test_state;


-- 7. Remove all fictional data.

rollback;