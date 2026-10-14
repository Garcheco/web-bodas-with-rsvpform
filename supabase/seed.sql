-- =====================================================
-- SEED DATA: Wedding RSVP
-- SOLO PARA DESARROLLO LOCAL
-- =====================================================

-- 1. Crear boda ficticia
insert into public.weddings (
  slug,
  couple_names,
  event_date,
  rsvp_deadline
)
values (
  'boda-demo-local',
  'Alex y Sam',
  '2027-12-20 18:00:00-06',
  '2027-12-01 23:59:59-06'
);


-- 2. Crear invitaciones ficticias
insert into public.invitations (
  wedding_id,
  household_name,
  access_token_hash,
  max_guests
)
select
  w.id,
  v.household_name,
  encode(
    sha256(convert_to(v.test_token, 'UTF8')),
    'hex'
  ),
  v.max_guests

from public.weddings w

cross join (
  values
    ('Familia García', 'local-test-garcia', 4),
    ('Ana López', 'local-test-ana', 1),
    ('Familia Pérez', 'local-test-perez', 2)
) as v(
  household_name,
  test_token,
  max_guests
)

where w.slug = 'boda-demo-local';