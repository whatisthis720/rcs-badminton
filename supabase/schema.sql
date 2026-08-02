-- Rc's — Racquets Cult — Bookings Schema
-- Run this once in Supabase: Project → SQL Editor → New Query → paste → Run

create table bookings (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  student_phone text not null,
  student_email text,
  membership_tier text not null check (membership_tier in ('Individual', 'Group')),
  session_date date not null,
  session_time time not null,
  status text not null default 'pending' check (status in ('confirmed', 'pending', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

-- Row Level Security: locked down by default.
-- Only Rc (the one admin account, identified by email) can read/write bookings.
-- The public website never talks to this table directly — only the admin page does.
alter table bookings enable row level security;

create policy "Admin full access"
  on bookings
  for all
  using (auth.jwt() ->> 'email' = 'rcsbadminton@gmail.com')
  with check (auth.jwt() ->> 'email' = 'rcsbadminton@gmail.com');

-- Helpful index for the admin calendar view, sorted by upcoming sessions
create index bookings_session_date_idx on bookings (session_date, session_time);
