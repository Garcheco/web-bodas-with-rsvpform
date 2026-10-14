select
  has_table_privilege(
    'service_role',
    'public.invitations',
    'UPDATE'
  ) as table_update_allowed,

  has_column_privilege(
    'service_role',
    'public.invitations',
    'updated_at',
    'UPDATE'
  ) as column_update_allowed;

  select
  count(*) as messages_exceeding_limit
from public.rsvps
where char_length(message) > 1000;


select
  n.nspname as schema_name,
  p.proname as function_name,
  case
    when p.prosecdef then 'DEFINER'
    else 'INVOKER'
  end as security_mode
from pg_proc p
join pg_namespace n
  on n.oid = p.pronamespace
where p.proname = 'submit_rsvp';


select
  has_function_privilege(
    'anon',
    'public.submit_rsvp(text,public.rsvp_status,text[],text,integer)',
    'EXECUTE'
  ) as anon_allowed,

  has_function_privilege(
    'authenticated',
    'public.submit_rsvp(text,public.rsvp_status,text[],text,integer)',
    'EXECUTE'
  ) as authenticated_allowed,

  has_function_privilege(
    'service_role',
    'public.submit_rsvp(text,public.rsvp_status,text[],text,integer)',
    'EXECUTE'
  ) as service_role_allowed;

  ----------------

  with function_definition as (
  select pg_get_functiondef(
    'public.submit_rsvp(text,public.rsvp_status,text[],text,integer)'::regprocedure
  ) as definition
)
select

  -- Verify submitted_at protection.
  exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.rsvps'::regclass
      and tgname = 'prevent_rsvps_submitted_at_change'
      and tgenabled in ('O', 'A')
  ) as submitted_at_protected,

  -- Verify message length constraint.
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.rsvps'::regclass
      and conname = 'rsvps_message_length'
  ) as message_constraint_exists,

  -- Verify message validation exists in stored function.
  (
    definition like '%RSVP message exceeds 1000 characters%'
  ) as message_validation_exists,

  -- Verify synchronization job creation exists.
  (
    definition like '%insert into private.sheet_sync_jobs%'
  ) as sync_job_creation_exists,

  -- Verify service role permissions.
  has_schema_privilege(
    'service_role',
    'private',
    'USAGE'
  ) as private_schema_access,

  has_table_privilege(
    'service_role',
    'private.sheet_sync_jobs',
    'INSERT'
  ) as sync_job_insert_allowed

from function_definition;