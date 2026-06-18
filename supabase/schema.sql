-- Lead storage for the AI lead assistant (Phase 3).
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  name        text,
  inquiry_type text,
  detail      text,
  session_id  text,
  created_at  timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Row Level Security: keep the table private. The /api/lead route writes with
-- the service_role key, which bypasses RLS — so no public insert policy is
-- needed (and none is given, to keep anonymous writes out).
alter table public.leads enable row level security;
