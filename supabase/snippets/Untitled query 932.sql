-- ============================================================
-- TEST 6: CONCURRENCY - PREPARE FIXTURE
-- LOCAL DATABASE ONLY
-- ============================================================

begin;

-- Abort safely if this test fixture already exists.
do $$
begin
  if exists (
    select 1
    from public.invitations
    where access_token_hash = repeat('9', 64)
  )
  or exists (
    select 1
    from public.weddings
    where slug = 'qa-rsvp-concurrency-20261012'
  ) then
    raise exception 'Concurrency test fixture already exists';
  end if;
end;
$$;

-- Create fictional wedding and invitation.
with test_wedding as (
  insert into public.weddings (
    slug,
    couple_names,
    event_date,
    rsvp_deadline
  )
  values (
    'qa-rsvp-concurrency-20261012',
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
  'QA concurrencia',
  repeat('9', 64),
  4
from test_wedding;

-- Create initial RSVP.
set local role service_role;

select public.submit_rsvp(
  repeat('9', 64),
  'accepted',
  array['Ana López', 'Luis López'],
  'Estado inicial',
  0
) as initial_rsvp;

-- Make fixture visible to both database connections.
commit;