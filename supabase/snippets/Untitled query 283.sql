-- ============================================================
-- TEST 3: NEGATIVE VALIDATIONS AND DATA PROTECTION
-- LOCAL DATABASE ONLY
-- ============================================================

begin;

-- Generate a unique fictional token hash for this test.
select set_config(
  'rsvp_test.token_hash',
  md5(gen_random_uuid()::text) ||
  md5(gen_random_uuid()::text),
  true
);


-- Create fictional wedding and invitation.
with test_wedding as (

  insert into public.weddings (
    slug,
    couple_names,
    event_date,
    rsvp_deadline
  )
  values (
    'qa-negative-' || gen_random_uuid()::text,
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
  current_setting('rsvp_test.token_hash'),
  2
from test_wedding;


-- Execute operations as service_role.
set local role service_role;


do $test$

declare
  v_hash text := current_setting('rsvp_test.token_hash');
  v_result jsonb;
  v_error text;
  v_state text;

begin

  -- ----------------------------------------------------------
  -- Establish a valid RSVP
  -- ----------------------------------------------------------

  v_result := public.submit_rsvp(
    v_hash,
    'accepted',
    array['Ana López', 'Luis López'],
    null,
    0
  );

  if v_result->>'result' is distinct from 'created' then
    raise exception 'SETUP FAILED: Initial RSVP';
  end if;


  -- ----------------------------------------------------------
  -- TEST A: Accepted without guests
  -- ----------------------------------------------------------

  begin

    perform public.submit_rsvp(
      v_hash,
      'accepted',
      array[]::text[],
      null,
      1
    );

    raise exception 'TEST A FAILED: Request was accepted';

  exception when others then

    get stacked diagnostics v_error = MESSAGE_TEXT;

    if v_error is distinct from
       'Accepted RSVP requires at least one guest' then

      raise exception 'TEST A FAILED: %', v_error;

    end if;

  end;


  -- ----------------------------------------------------------
  -- TEST B: Exceed maximum guest count
  -- ----------------------------------------------------------

  begin

    perform public.submit_rsvp(
      v_hash,
      'accepted',
      array['Ana', 'Luis', 'Pedro'],
      null,
      1
    );

    raise exception 'TEST B FAILED: Request was accepted';

  exception when others then

    get stacked diagnostics v_error = MESSAGE_TEXT;

    if v_error is distinct from
       'Guest count exceeds invitation limit' then

      raise exception 'TEST B FAILED: %', v_error;

    end if;

  end;


  -- ----------------------------------------------------------
  -- TEST C: Declined RSVP with guests
  -- ----------------------------------------------------------

  begin

    perform public.submit_rsvp(
      v_hash,
      'declined',
      array['Ana'],
      null,
      1
    );

    raise exception 'TEST C FAILED: Request was accepted';

  exception when others then

    get stacked diagnostics v_error = MESSAGE_TEXT;

    if v_error is distinct from
       'Declined RSVP cannot contain guests' then

      raise exception 'TEST C FAILED: %', v_error;

    end if;

  end;


  -- ----------------------------------------------------------
  -- TEST D: Empty guest name
  -- ----------------------------------------------------------

  begin

    perform public.submit_rsvp(
      v_hash,
      'accepted',
      array['Ana', '   '],
      null,
      1
    );

    raise exception 'TEST D FAILED: Request was accepted';

  exception when others then

    get stacked diagnostics v_error = MESSAGE_TEXT;

    if v_error is distinct from
       'Guest name cannot be empty' then

      raise exception 'TEST D FAILED: %', v_error;

    end if;

  end;


  -- ----------------------------------------------------------
  -- TEST E: Message exceeds 1000 characters
  -- ----------------------------------------------------------

  begin

    perform public.submit_rsvp(
      v_hash,
      'accepted',
      array['Ana', 'Luis'],
      repeat('x', 1001),
      1
    );

    raise exception 'TEST E FAILED: Request was accepted';

  exception when others then

    get stacked diagnostics v_error = MESSAGE_TEXT;

    if v_error is distinct from
       'RSVP message exceeds 1000 characters' then

      raise exception 'TEST E FAILED: %', v_error;

    end if;

  end;


  -- ----------------------------------------------------------
  -- TEST F: Stale version
  -- ----------------------------------------------------------

  begin

    perform public.submit_rsvp(
      v_hash,
      'declined',
      array[]::text[],
      null,
      0
    );

    raise exception 'TEST F FAILED: Request was accepted';

  exception when others then

    get stacked diagnostics
      v_error = MESSAGE_TEXT,
      v_state = RETURNED_SQLSTATE;

    if v_state is distinct from 'P4090' then

      raise exception
        'TEST F FAILED: Expected P4090, got %: %',
        v_state,
        v_error;

    end if;

  end;


  -- ----------------------------------------------------------
  -- TEST G: Protect submitted_at
  -- ----------------------------------------------------------

  begin

    update public.rsvps
    set submitted_at = submitted_at - interval '1 second'
    where invitation_id = (
      select id
      from public.invitations
      where access_token_hash = v_hash
    );

    raise exception 'TEST G FAILED: Timestamp was modified';

  exception when others then

    get stacked diagnostics v_error = MESSAGE_TEXT;

    if v_error is distinct from
       'RSVP submitted_at cannot be modified after creation' then

      raise exception 'TEST G FAILED: %', v_error;

    end if;

  end;


  raise notice 'All seven negative tests passed';

end;

$test$;


-- Restore original role.
reset role;


-- ------------------------------------------------------------
-- VERIFY DATABASE STATE AFTER REJECTED REQUESTS
-- ------------------------------------------------------------

select
  r.status,
  r.version,

  (
    select count(*)
    from public.guests g
    where g.rsvp_id = r.id
  ) as guest_count,

  (
    select count(*)
    from private.sheet_sync_jobs j
    where j.rsvp_id = r.id
  ) as sync_job_count

from public.rsvps r

join public.invitations i
  on i.id = r.invitation_id

where i.access_token_hash =
  current_setting('rsvp_test.token_hash');


-- Remove all fictional data.
rollback;