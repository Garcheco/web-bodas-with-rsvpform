select
  r.status,
  r.version,
  r.message,

  array(
    select g.full_name
    from public.guests g
    where g.rsvp_id = r.id
    order by g.full_name
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

where i.access_token_hash = repeat('9', 64);

----------------------------------------------------------------

begin;

delete from public.weddings w
where w.slug = 'qa-rsvp-concurrency-20261012'
  and exists (
    select 1
    from public.invitations i
    where i.wedding_id = w.id
      and i.access_token_hash = repeat('9', 64)
      and i.household_name = 'QA concurrencia'
  );

commit;

-------------------------------------------------------------------------------

select count(*) as remaining_invitations
from public.invitations
where access_token_hash = repeat('9', 64);