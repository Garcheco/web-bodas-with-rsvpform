-- ============================================================
-- TEST 4: INVITATION ACCESS AND DEADLINE VALIDATION
-- LOCAL DATABASE ONLY
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1. Generate unique test tokens
-- ------------------------------------------------------------

select
  set_config(
    'rsvp_test.inactive_invitation',
    md5(gen_random_uuid()::text) ||
    md5(gen_random_uuid()::text),
    true
  ),

  set_config(
    'rsvp_test.inactive_wedding',
    md5(gen_random_uuid()::text) ||
    md5(gen_random_uuid()::text),
    true
  ),

  set_config(
    'rsvp_test.expired_deadline',
    md5(gen_random_uuid()::text) ||
    md5(gen_random_uuid()::text),
    true
  );


-- ------------------------------------------------------------
-- 2. Create invitation marked as inactive
-- ------------------------------------------------------------

with test_wedding as (

  insert into public.weddings (
    slug,
    couple_names,
    event_date,
    rsvp_deadline
  )
  values (
    'qa-inactive-inv-' || gen_random_uuid()::text,
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
  max_guests,
  is_active
)

select
  id,
  'Invitación inactiva',
  current_setting('rsvp_test.inactive_invitation'),
  2,
  false
from test_wedding;


-- ------------------------------------------------------------
-- 3. Create invitation for an inactive wedding
-- ------------------------------------------------------------

with test_wedding as (

  insert into public.weddings (
    slug,
    couple_names,
    event_date,
    rsvp_deadline,
    is_active
  )
  values (
    'qa-inactive-wed-' || gen_random_uuid()::text,
    'Boda de prueba',
    now() + interval '30 days',
    now() + interval '7 days',
    false
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
  'Boda inactiva',
  current_setting('rsvp_test.inactive_wedding'),
  2
from test_wedding;


-- ------------------------------------------------------------
-- 4. Create invitation with expired deadline
-- ------------------------------------------------------------

with test_wedding as (

  insert into public.weddings (
    slug,
    couple_names,
    event_date,
    rsvp_deadline
  )
  values (
    'qa-expired-' || gen_random_uuid()::text,
    'Boda de prueba',
    now() + interval '30 days',
    now() - interval '1 day'
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
  'Invitación vencida',
  current_setting('rsvp_test.expired_deadline'),
  2
from test_wedding;


-- ------------------------------------------------------------
-- 5. Test as service_role
-- ------------------------------------------------------------

set local role service_role;

do $test$

declare
  v_error text;

begin

  -- TEST A: Inactive invitation

  begin

    perform public.submit_rsvp(
      current_setting('rsvp_test.inactive_invitation'),
      'accepted',
      array['Ana López'],
      null,
      0
    );

    raise exception 'TEST A FAILED: Request accepted';

  exception when others then

    get stacked diagnostics v_error = MESSAGE_TEXT;

    if v_error is distinct from 'Invitation is inactive' then
      raise exception 'TEST A FAILED: %', v_error;
    end if;

  end;


  -- TEST B: Inactive wedding

  begin

    perform public.submit_rsvp(
      current_setting('rsvp_test.inactive_wedding'),
      'accepted',
      array['Ana López'],
      null,
      0
    );

    raise exception 'TEST B FAILED: Request accepted';

  exception when others then

    get stacked diagnostics v_error = MESSAGE_TEXT;

    if v_error is distinct from 'Wedding is inactive' then
      raise exception 'TEST B FAILED: %', v_error;
    end if;

  end;


  -- TEST C: Expired deadline

  begin

    perform public.submit_rsvp(
      current_setting('rsvp_test.expired_deadline'),
      'accepted',
      array['Ana López'],
      null,
      0
    );

    raise exception 'TEST C FAILED: Request accepted';

  exception when others then

    get stacked diagnostics v_error = MESSAGE_TEXT;

    if v_error is distinct from 'RSVP deadline has passed' then
      raise exception 'TEST C FAILED: %', v_error;
    end if;

  end;


  -- TEST D: Unknown invitation token

  begin

    perform public.submit_rsvp(
      repeat('f', 64),
      'accepted',
      array['Ana López'],
      null,
      0
    );

    raise exception 'TEST D FAILED: Request accepted';

  exception when others then

    get stacked diagnostics v_error = MESSAGE_TEXT;

    if v_error is distinct from 'Invitation not found' then
      raise exception 'TEST D FAILED: %', v_error;
    end if;

  end;

  raise notice 'All four access validation tests passed';

end;

$test$;


-- ------------------------------------------------------------
-- 6. Restore role
-- ------------------------------------------------------------

reset role;


-- ------------------------------------------------------------
-- 7. Verify no RSVP was created
-- ------------------------------------------------------------

select
  count(*) as created_rsvps
from public.rsvps r
join public.invitations i
  on i.id = r.invitation_id
where i.access_token_hash in (
  current_setting('rsvp_test.inactive_invitation'),
  current_setting('rsvp_test.inactive_wedding'),
  current_setting('rsvp_test.expired_deadline')
);


-- ------------------------------------------------------------
-- 8. Roll back all fictional data
-- ------------------------------------------------------------

rollback;