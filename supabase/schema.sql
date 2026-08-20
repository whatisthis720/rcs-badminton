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

-- Row Level Security:
-- Admin (identified by email) has full access for all operations.
-- Public website submits membership applications with status 'pending' (insert-only).
alter table bookings enable row level security;

create policy "Admin full access"
  on bookings
  for all
  using (auth.jwt() ->> 'email' = 'rcsbadminton@gmail.com')
  with check (auth.jwt() ->> 'email' = 'rcsbadminton@gmail.com');

create policy "Public insert access"
  on bookings
  for insert
  with check (true);

-- Helpful index for the admin calendar view, sorted by upcoming sessions
create index bookings_session_date_idx on bookings (session_date, session_time);
