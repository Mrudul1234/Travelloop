-- TRAVELLOOP Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  bio text,
  language text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trips table
create table if not exists trips (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  slug text unique,
  cover_photo text,
  start_date date,
  end_date date,
  total_budget numeric default 0,
  spent_budget numeric default 0,
  travel_style text[],
  status text default 'draft',
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Stops (cities in trip)
create table if not exists stops (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references trips(id) on delete cascade not null,
  city_name text not null,
  city_name_hindi text,
  state text,
  lat numeric,
  lng numeric,
  cover_photo text,
  days integer default 1,
  position integer default 0,
  created_at timestamptz default now()
);

-- Activities (within stops)
create table if not exists activities (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references trips(id) on delete cascade not null,
  stop_id uuid references stops(id) on delete cascade not null,
  name text not null,
  name_hindi text,
  type text default 'sightseeing',
  time text,
  day_number integer default 1,
  duration_min integer default 60,
  cost_inr numeric default 0,
  description text,
  notes text,
  photo_url text,
  position integer default 0,
  created_at timestamptz default now()
);

-- Expenses / Budget items
create table if not exists expenses (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references trips(id) on delete cascade not null,
  name text not null,
  amount numeric not null,
  category text default 'misc',
  date date,
  notes text,
  created_at timestamptz default now()
);

-- Packing checklist
create table if not exists checklist_items (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references trips(id) on delete cascade not null,
  name text not null,
  category text default 'misc',
  checked boolean default false,
  created_at timestamptz default now()
);

-- Trip notes
create table if not exists trip_notes (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references trips(id) on delete cascade not null,
  stop_id uuid references stops(id) on delete set null,
  title text,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies
alter table profiles enable row level security;
alter table trips enable row level security;
alter table stops enable row level security;
alter table activities enable row level security;
alter table expenses enable row level security;
alter table checklist_items enable row level security;
alter table trip_notes enable row level security;

-- Profiles: users can read/write their own
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Trips: users own their trips, public trips readable by all
create policy "Users can manage own trips" on trips for all using (auth.uid() = user_id);
create policy "Public trips are viewable" on trips for select using (is_public = true);

-- Stops: users who own the trip can manage stops
create policy "Trip owners manage stops" on stops for all using (
  exists (select 1 from trips where trips.id = stops.trip_id and trips.user_id = auth.uid())
);

-- Activities
create policy "Trip owners manage activities" on activities for all using (
  exists (select 1 from trips where trips.id = activities.trip_id and trips.user_id = auth.uid())
);

-- Expenses
create policy "Trip owners manage expenses" on expenses for all using (
  exists (select 1 from trips where trips.id = expenses.trip_id and trips.user_id = auth.uid())
);

-- Checklist items
create policy "Trip owners manage checklist" on checklist_items for all using (
  exists (select 1 from trips where trips.id = checklist_items.trip_id and trips.user_id = auth.uid())
);

-- Trip notes
create policy "Trip owners manage notes" on trip_notes for all using (
  exists (select 1 from trips where trips.id = trip_notes.trip_id and trips.user_id = auth.uid())
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
