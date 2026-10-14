-- ============================================================
-- TEST 1: FIRST RSVP AND IDEMPOTENT RETRY
-- LOCAL DATABASE ONLY
-- ============================================================

begin;

-- 1. Create fictional wedding and invitation.

with test_wedding as (
  insert into public.weddings (
    slug,
    couple_names,
    event_date,
    rsvp_deadline
  )
  values (
    'qa-rsvp-' || gen_random_uuid()::text,
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
  repeat('d', 64),
  4
from test_wedding;


-- 2. Execute RSVP using service_role.

set local role service_role;

select public.submit_rsvp(
  repeat('d', 64),
  'accepted'::public.rsvp_status,
  array[
    '  Ana   López  ',
    'Luis López'
  ]::text[],
  'Confirmamos asistencia',
  0
) as first_submission;


-- 3. Retry the exact same request.

select public.submit_rsvp(
  repeat('d', 64),
  'accepted'::public.rsvp_status,
  array[
    '  Ana   López  ',
    'Luis López'
  ]::text[],
  'Confirmamos asistencia',
  0
) as identical_retry;


-- 4. Restore original role for verification.

reset role;


-- 5. Verify stored data.

select
  r.status,
  r.version,
  r.submitted_at,
  r.updated_at,

  (
    select array_agg(g.full_name order by g.full_name)
    from public.guests g
    where g.rsvp_id = r.id
  ) as guests,

  (
    select count(*)
    from private.sheet_sync_jobs j
    where j.rsvp_id = r.id
  ) as sync_job_count

from public.rsvps r

join public.invitations i
  on i.id = r.invitation_id

where i.access_token_hash = repeat('d', 64);


-- 6. Remove all fictional data and changes.

rollback;