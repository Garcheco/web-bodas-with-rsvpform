-- ============================================================
-- TEST 2: RSVP VERSIONING AND IDEMPOTENCY
-- LOCAL DATABASE ONLY
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1. Create fictional wedding and invitation
-- ------------------------------------------------------------

with test_wedding as (

  insert into public.weddings (
    slug,
    couple_names,
    event_date,
    rsvp_deadline
  )
  values (
    'qa-versioning-' || gen_random_uuid()::text,
    'Boda de prueba de versiones',
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
  repeat('e', 64),
  4
from test_wedding;


-- ------------------------------------------------------------
-- 2. Execute test as service_role
-- ------------------------------------------------------------

set local role service_role;

do $test$

declare

  v_first jsonb;
  v_updated jsonb;
  v_retry jsonb;
  v_declined jsonb;

begin

  -- TEST A: First response

  v_first := public.submit_rsvp(
    repeat('e', 64),
    'accepted'::public.rsvp_status,
    array['Ana López', 'Luis López'],
    'Confirmamos asistencia',
    0
  );

  if v_first->>'result' is distinct from 'created'
     or (v_first->>'version')::integer is distinct from 1 then

    raise exception 'TEST A FAILED: First RSVP';

  end if;


  -- TEST B: Add a guest

  v_updated := public.submit_rsvp(
    repeat('e', 64),
    'accepted'::public.rsvp_status,
    array['Ana López', 'Luis López', 'Pedro López'],
    'Confirmamos asistencia',
    1
  );

  if v_updated->>'result' is distinct from 'updated'
     or (v_updated->>'version')::integer is distinct from 2 then

    raise exception 'TEST B FAILED: RSVP update';

  end if;


  -- TEST C: Retry identical request
  -- The old expected_version is intentional.

  v_retry := public.submit_rsvp(
    repeat('e', 64),
    'accepted'::public.rsvp_status,
    array['Ana López', 'Luis López', 'Pedro López'],
    'Confirmamos asistencia',
    1
  );

  if v_retry->>'result' is distinct from 'unchanged'
     or (v_retry->>'version')::integer is distinct from 2 then

    raise exception 'TEST C FAILED: Idempotent retry';

  end if;


  -- TEST D: Decline invitation

  v_declined := public.submit_rsvp(
    repeat('e', 64),
    'declined'::public.rsvp_status,
    array[]::text[],
    null,
    2
  );

  if v_declined->>'result' is distinct from 'updated'
     or (v_declined->>'version')::integer is distinct from 3 then

    raise exception 'TEST D FAILED: Declined RSVP';

  end if;


  -- TEST E: submitted_at must never change

  if v_first->>'submitted_at'
     is distinct from v_declined->>'submitted_at' then

    raise exception 'TEST E FAILED: submitted_at changed';

  end if;


  -- TEST F: Reject stale modification

  begin

    perform public.submit_rsvp(
      repeat('e', 64),
      'accepted'::public.rsvp_status,
      array['Ana López'],
      'Intento con versión antigua',
      1
    );

    raise exception
      'TEST F FAILED: Stale version was accepted';

  exception
    when sqlstate 'P4090' then
      null; -- Expected conflict

  end;

end;

$test$;


-- ------------------------------------------------------------
-- 3. Restore role for verification
-- ------------------------------------------------------------

reset role;


-- ------------------------------------------------------------
-- 4. Verify final database state
-- ------------------------------------------------------------

select

  r.status,
  r.version,
  r.submitted_at,
  r.updated_at,

  (
    select count(*)
    from public.guests g
    where g.rsvp_id = r.id
  ) as guest_count,

  (
    select count(*)
    from private.sheet_sync_jobs j
    where j.rsvp_id = r.id
  ) as sync_job_count,

  (
    select array_agg(
      j.rsvp_version
      order by j.rsvp_version
    )
    from private.sheet_sync_jobs j
    where j.rsvp_id = r.id
  ) as sync_job_versions

from public.rsvps r

join public.invitations i
  on i.id = r.invitation_id

where i.access_token_hash = repeat('e', 64);


-- ------------------------------------------------------------
-- 5. Remove all test data
-- ------------------------------------------------------------

rollback;