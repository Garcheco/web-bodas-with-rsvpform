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


