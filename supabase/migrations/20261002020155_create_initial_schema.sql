-- =========================================================
-- BODA EDGARD
-- Initial database schema
-- =========================================================

-- =========================================================
-- 1. ENUMS
-- =========================================================

create type public.rsvp_status as enum (
  'accepted',
  'declined'
);

-- =========================================================
-- 2. WEDDINGS
-- =========================================================

create table public.weddings (
  id uuid not null primary key default gen_random_uuid(),
  name text not null,
  date timestamptz not null,
  location text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);