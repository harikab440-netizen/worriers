-- Supabase Migration: 20261113000001_initial_schema.sql
-- Campus Lost & Found Schema & RLS Setup

-- Extensions
create extension if not exists "pgcrypto";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 2 and 50),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. CAMPUS LOCATIONS TABLE
create table if not exists public.campus_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(trim(name)) > 0),
  is_active boolean not null default true,
  sort_order integer not null default 0
);

-- 3. LISTINGS TABLE
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('lost', 'found')),
  title text not null check (char_length(trim(title)) between 5 and 100),
  description text not null check (char_length(trim(description)) between 20 and 2000),
  category text not null check (category in (
    'Electronics',
    'Keys',
    'Wallets and cards',
    'Bags',
    'Clothing',
    'Books and stationery',
    'IDs and documents',
    'Jewelry and accessories',
    'Sports equipment',
    'Other'
  )),
  location_id uuid not null references public.campus_locations(id),
  location_detail text check (location_detail is null or char_length(trim(location_detail)) <= 120),
  occurred_on date not null,
  image_path text,
  status text not null default 'active' check (status in ('active', 'returned', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. CONTACT REQUESTS TABLE
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message text not null check (char_length(trim(message)) between 10 and 1000),
  reply_preference text not null check (reply_preference in ('in_app', 'email_notification')),
  status text not null default 'pending' check (status in ('pending', 'responded', 'closed')),
  owner_response text check (owner_response is null or char_length(trim(owner_response)) <= 2000),
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_listings_owner_id on public.listings(owner_id);
create index if not exists idx_listings_status on public.listings(status);
create index if not exists idx_listings_type on public.listings(type);
create index if not exists idx_listings_category on public.listings(category);
create index if not exists idx_listings_location_id on public.listings(location_id);
create index if not exists idx_listings_occurred_on on public.listings(occurred_on desc);
create index if not exists idx_listings_created_at on public.listings(created_at desc);

create index if not exists idx_contact_requests_listing_id on public.contact_requests(listing_id);
create index if not exists idx_contact_requests_sender_id on public.contact_requests(sender_id);
create index if not exists idx_contact_requests_status on public.contact_requests(status);
create index if not exists idx_contact_requests_created_at on public.contact_requests(created_at desc);

-- Trigger: Prevent sender from contacting their own listing
create or replace function public.check_contact_request_not_self()
returns trigger as $$
declare
  item_owner_id uuid;
begin
  select owner_id into item_owner_id from public.listings where id = NEW.listing_id;
  if item_owner_id is null then
    raise exception 'Listing not found';
  end if;
  if item_owner_id = NEW.sender_id then
    raise exception 'Listing owners cannot submit contact requests on their own listings';
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_check_contact_request_not_self on public.contact_requests;
create trigger trg_check_contact_request_not_self
  before insert on public.contact_requests
  for each row
  execute function public.check_contact_request_not_self();

-- Trigger: Automatically update updated_at timestamp
create or replace function public.set_updated_at()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

drop trigger if exists trg_listings_updated_at on public.listings;
create trigger trg_listings_updated_at
  before update on public.listings
  for each row
  execute function public.set_updated_at();

-- Trigger: Automatically create profile when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_display_name text;
begin
  raw_display_name := coalesce(
    NEW.raw_user_meta_data->>'display_name',
    split_part(NEW.email, '@', 1),
    'Campus User'
  );
  
  insert into public.profiles (id, display_name, created_at, updated_at)
  values (
    NEW.id,
    substr(trim(raw_display_name), 1, 50),
    now(),
    now()
  )
  on conflict (id) do nothing;
  
  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.campus_locations enable row level security;
alter table public.listings enable row level security;
alter table public.contact_requests enable row level security;

-- 1. Profiles Policies
-- Display names are public so listing viewers know who posted the item
create policy "Public can read profiles"
  on public.profiles
  for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2. Campus Locations Policies
create policy "Anyone can read active campus locations"
  on public.campus_locations
  for select
  using (is_active = true);

-- 3. Listings Policies
-- Public can view active listings; owners can view all of their own listings (regardless of status)
create policy "Anyone can read active listings or owners read their own"
  on public.listings
  for select
  using (status = 'active' or auth.uid() = owner_id);

create policy "Authenticated users can create listings"
  on public.listings
  for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "Owners can update their own listings"
  on public.listings
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete their own listings"
  on public.listings
  for delete
  to authenticated
  using (auth.uid() = owner_id);

-- 4. Contact Requests Policies
-- Senders can view their sent requests; listing owners can view received requests
create policy "Sender or listing owner can read contact requests"
  on public.contact_requests
  for select
  to authenticated
  using (
    sender_id = auth.uid()
    or exists (
      select 1 from public.listings
      where listings.id = contact_requests.listing_id
        and listings.owner_id = auth.uid()
    )
  );

-- Authenticated sender can create requests for other's active listing
create policy "Authenticated users can create contact requests"
  on public.contact_requests
  for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.listings
      where listings.id = contact_requests.listing_id
        and listings.owner_id != auth.uid()
        and listings.status = 'active'
    )
  );

-- Only listing owner can update status and response
create policy "Listing owner can update contact requests"
  on public.contact_requests
  for update
  to authenticated
  using (
    exists (
      select 1 from public.listings
      where listings.id = contact_requests.listing_id
        and listings.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.listings
      where listings.id = contact_requests.listing_id
        and listings.owner_id = auth.uid()
    )
  );

-- ==========================================
-- STORAGE BUCKET CONFIGURATION
-- ==========================================

-- Insert storage bucket for listing images if not exists
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS Policies
create policy "Listing images are publicly accessible"
  on storage.objects
  for select
  using (bucket_id = 'listing-images');

create policy "Authenticated users can upload listing images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'listing-images');

create policy "Users can delete their own uploaded images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'listing-images' and auth.uid() = owner);
