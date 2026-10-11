-- =========================================================
-- BODA EDGARD
-- Initial Database Schema
-- =========================================================


-- =========================================================
-- 1. ENUMS
-- =========================================================

create type public.rsvp_status as enum (
  'accepted',
  'declined'
);

create type public.sync_status as enum (
  'pending',
  'processing',
  'synced',
  'failed'
);

-- =========================================================
-- 2. WEDDINGS
-- =========================================================

create table public.weddings (
  id uuid primary key default gen_random_uuid(),

  slug text not null unique,
  couple_names text not null,

  event_date timestamptz not null,
  rsvp_deadline timestamptz not null,

  timezone text not null default 'America/Mexico_City',

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint weddings_slug_not_empty
    check (length(trim(slug)) > 0),

  constraint weddings_couple_names_not_empty
    check (length(trim(couple_names)) > 0),

  constraint weddings_deadline_before_event
    check (rsvp_deadline < event_date)
);


-- =========================================================
-- 3. WEDDING ADMINS
-- =========================================================

create table public.wedding_admins (
    id uuid primary key default gen_random_uuid(),

    wedding_id uuid not null
        references public.weddings(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    role text not null default 'admin',

    created_at timestamptz not null default now(),

    constraint wedding_admins_unique_membership
        unique (wedding_id, user_id),

    constraint wedding_admins_role_valid
        check (role in ('owner', 'admin', 'viewer'))
);

create index wedding_admins_user_id_idx
  on public.wedding_admins(user_id);

-- =========================================================
-- 4. INVITATIONS
-- =========================================================

create table public.invitations (
  id uuid primary key default gen_random_uuid(),

  wedding_id uuid not null
    references public.weddings(id)
    on delete cascade,

  household_name text not null,
  contact_name text,

  contact_email text,
  contact_phone text,

  access_token_hash text not null unique,

  max_guests smallint not null default 1,

  is_active boolean not null default true,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint invitations_household_name_not_empty
    check (length(trim(household_name)) > 0),

  constraint invitations_max_guests_valid
    check (max_guests between 1 and 20)
);

create index invitations_wedding_id_idx
  on public.invitations(wedding_id);


-- =========================================================
-- 5. RSVPS
-- =========================================================

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),

  invitation_id uuid not null unique
    references public.invitations(id)
    on delete cascade,

  status public.rsvp_status not null,
  
  version integer not null default 1,

  message text,

  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()

  constraint rsvps_version_valid
    check (version >= 1)

);

-- =========================================================
-- 6. GUESTS
-- =========================================================


create table public.guests (
    id uuid primary key default gen_random_uuid(),

    rsvp_id uuid not null
        references public.rsvps(id)
        on delete cascade,

    full_name text not null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint guests_full_name_not_empty
        check (length(trim(full_name)) > 0),
    
    constraint guests_full_name_length
        check (length(trim(full_name)) <= 120)
);

create index guests_rsvp_id_idx
    on public.guests(rsvp_id);

-- =========================================================
-- 7. PRIVATE SCHEMA
-- =========================================================

create schema if not exists private;

revoke all on schema private from public;


-- =========================================================
-- 8. SHEET SYNC JOBS
-- =========================================================

create table private.sheet_sync_jobs (
    id uuid primary key default gen_random_uuid(),

    rsvp_id uuid not null
        references public.rsvps(id)
        on delete cascade,

    rsvp_version integer not null,

    status public.sync_status not null default 'pending',

    attempts smallint not null default 0,

    next_attempt_at timestamptz not null default now(),
    last_attempt_at timestamptz,
    locked_at timestamptz,

    last_error text,

    created_at timestamptz not null default now(),
    processed_at timestamptz,

    constraint sheet_sync_jobs_rsvp_version_valid
        check (rsvp_version >= 1),
    
    constraint sheet_sync_jobs_attempts_valid
        check (attempts >= 0),

    constraint sheet_sync_jobs_unique_version
        unique (rsvp_id, rsvp_version)
);

create index sheet_sync_jobs_pending_idx
    on private.sheet_sync_jobs(status, next_attempt_at)
    where status in ('pending', 'failed');

alter table private.sheet_sync_jobs
    enable row level security;


-- =========================================================
-- 9. UPDATED_AT TRIGGER
-- =========================================================

create function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger set_weddings_updated_at
    before update on public.weddings
    for each row 
    execute function private.set_updated_at();

create trigger set_invitations_updated_at
    before update on public.invitations
    for each row
    execute function private.set_updated_at();

create trigger set_rsvps_updated_at
    before update on public.rsvps
    for each row
    execute function private.set_updated_at();

create trigger set_guests_updated_at
    before update on public.guests
    for each row
    execute function private.set_updated_at();


-- =========================================================
-- 10. ROW LEVEL SECURITY
-- =========================================================

alter table public.weddings
    enable row level security;

alter table public.wedding_admins
    enable row level security;

alter table public.invitations
    enable row level security;

alter table public.rsvps
    enable row level security;

alter table public.guests
    enable row level security;


-- =========================================================
-- 11. DATABASE PRIVILEGES
-- =========================================================

revoke all on table public.weddings
    from anon, authenticated;

revoke all on table public.wedding_admins
    from anon, authenticated;

revoke all on table public.invitations
    from anon, authenticated;

revoke all on table public.rsvps
    from anon, authenticated;   

revoke all on table public.guests
    from anon, authenticated;


-- =========================================================
-- 12. DEFAULT PRIVILEGES
-- =========================================================

alter default privileges for role postgres
in schema public
revoke select, insert, update, delete
on tables
from anon, authenticated;

alter default privileges for role postgres
in schema public
revoke execute
on functions
from public;

revoke all
on function private.set_updated_at()
from public;


