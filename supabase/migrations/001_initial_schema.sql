-- ============================================================
-- Pastel Royalty — Gallery OS by TMOS13
-- ============================================================

-- Artists
create table public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text,
  medium text,
  location text,
  website text,
  featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Artworks
create table public.artworks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  title text not null,
  slug text not null unique,
  year integer,
  medium text,
  dimensions text,
  price_range text,
  status text not null default 'available' check (status in ('available', 'sold', 'nfs', 'on_hold')),
  description text,
  blurhash text,
  aspect_ratio numeric(6,4),
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Exhibitions
create table public.exhibitions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  type text not null default 'group' check (type in ('solo', 'group', 'fair', 'offsite')),
  start_date date,
  end_date date,
  location text,
  description text,
  status text not null default 'upcoming' check (status in ('current', 'past', 'upcoming')),
  featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Exhibition ↔ Artwork join
create table public.exhibition_artworks (
  id uuid primary key default gen_random_uuid(),
  exhibition_id uuid not null references public.exhibitions(id) on delete cascade,
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  sort_order integer default 0,
  unique(exhibition_id, artwork_id)
);

-- Exhibition ↔ Artist join (for group shows without specific artworks yet)
create table public.exhibition_artists (
  id uuid primary key default gen_random_uuid(),
  exhibition_id uuid not null references public.exhibitions(id) on delete cascade,
  artist_id uuid not null references public.artists(id) on delete cascade,
  sort_order integer default 0,
  unique(exhibition_id, artist_id)
);

-- Images (separate from artworks — one artwork can have multiple views)
create table public.images (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid references public.artworks(id) on delete cascade,
  exhibition_id uuid references public.exhibitions(id) on delete cascade,
  artist_id uuid references public.artists(id) on delete cascade,
  role text not null default 'primary' check (role in ('primary', 'detail', 'installation', 'portrait', 'hero')),
  original_path text not null,
  display_path text,
  thumb_path text,
  width integer,
  height integer,
  blurhash text,
  alt_text text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Inquiries (the revenue moment)
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid references public.artworks(id) on delete set null,
  exhibition_id uuid references public.exhibitions(id) on delete set null,
  artist_id uuid references public.artists(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text,
  source_page text,
  source_context text, -- "Inquired about Camellias I by Rob Ventura"
  status text not null default 'new' check (status in ('new', 'responded', 'closed', 'archived')),
  responded_at timestamptz,
  created_at timestamptz default now()
);

-- Contacts (mailing list + CRM)
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null unique,
  phone text,
  type text default 'collector' check (type in ('collector', 'designer', 'institution', 'press', 'other')),
  source text, -- 'inquiry', 'newsletter', 'manual'
  subscribed boolean default true,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Page content (editable without deploy)
create table public.page_content (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  section text not null,
  content jsonb not null default '{}',
  sort_order integer default 0,
  updated_at timestamptz default now(),
  unique(page, section)
);

-- ============================================================
-- Indexes
-- ============================================================

create index idx_artworks_artist on public.artworks(artist_id);
create index idx_artworks_status on public.artworks(status);
create index idx_artworks_slug on public.artworks(slug);
create index idx_artists_slug on public.artists(slug);
create index idx_artists_featured on public.artists(featured) where featured = true;
create index idx_exhibitions_slug on public.exhibitions(slug);
create index idx_exhibitions_status on public.exhibitions(status);
create index idx_exhibitions_featured on public.exhibitions(featured) where featured = true;
create index idx_images_artwork on public.images(artwork_id);
create index idx_images_exhibition on public.images(exhibition_id);
create index idx_images_role on public.images(role);
create index idx_inquiries_status on public.inquiries(status);
create index idx_inquiries_artwork on public.inquiries(artwork_id);
create index idx_contacts_email on public.contacts(email);
create index idx_page_content_page on public.page_content(page);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.artists enable row level security;
alter table public.artworks enable row level security;
alter table public.exhibitions enable row level security;
alter table public.exhibition_artworks enable row level security;
alter table public.exhibition_artists enable row level security;
alter table public.images enable row level security;
alter table public.inquiries enable row level security;
alter table public.contacts enable row level security;
alter table public.page_content enable row level security;

-- Public read access for published content
create policy "Public read artists" on public.artists for select using (true);
create policy "Public read artworks" on public.artworks for select using (true);
create policy "Public read exhibitions" on public.exhibitions for select using (true);
create policy "Public read exhibition_artworks" on public.exhibition_artworks for select using (true);
create policy "Public read exhibition_artists" on public.exhibition_artists for select using (true);
create policy "Public read images" on public.images for select using (true);
create policy "Public read page_content" on public.page_content for select using (true);

-- Inquiries: anyone can insert (the form), only auth can read
create policy "Anyone can submit inquiry" on public.inquiries for insert with check (true);
create policy "Auth read inquiries" on public.inquiries for select using (auth.role() = 'authenticated');
create policy "Auth update inquiries" on public.inquiries for update using (auth.role() = 'authenticated');

-- Contacts: anyone can insert (newsletter signup), only auth can read/update
create policy "Anyone can subscribe" on public.contacts for insert with check (true);
create policy "Auth read contacts" on public.contacts for select using (auth.role() = 'authenticated');
create policy "Auth update contacts" on public.contacts for update using (auth.role() = 'authenticated');

-- Admin write policies (authenticated users = gallery admin)
create policy "Auth write artists" on public.artists for all using (auth.role() = 'authenticated');
create policy "Auth write artworks" on public.artworks for all using (auth.role() = 'authenticated');
create policy "Auth write exhibitions" on public.exhibitions for all using (auth.role() = 'authenticated');
create policy "Auth write exhibition_artworks" on public.exhibition_artworks for all using (auth.role() = 'authenticated');
create policy "Auth write exhibition_artists" on public.exhibition_artists for all using (auth.role() = 'authenticated');
create policy "Auth write images" on public.images for all using (auth.role() = 'authenticated');
create policy "Auth write page_content" on public.page_content for all using (auth.role() = 'authenticated');

-- ============================================================
-- Updated_at triggers
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger artists_updated_at before update on public.artists
  for each row execute function public.handle_updated_at();
create trigger artworks_updated_at before update on public.artworks
  for each row execute function public.handle_updated_at();
create trigger exhibitions_updated_at before update on public.exhibitions
  for each row execute function public.handle_updated_at();
create trigger contacts_updated_at before update on public.contacts
  for each row execute function public.handle_updated_at();
create trigger page_content_updated_at before update on public.page_content
  for each row execute function public.handle_updated_at();

-- ============================================================
-- Views (convenience)
-- ============================================================

create or replace view public.current_exhibitions as
  select * from public.exhibitions where status = 'current' order by start_date desc;

create or replace view public.featured_artists as
  select * from public.artists where featured = true order by sort_order;

create or replace view public.available_artworks as
  select a.*, ar.name as artist_name, ar.slug as artist_slug
  from public.artworks a
  join public.artists ar on ar.id = a.artist_id
  where a.status = 'available'
  order by a.sort_order;
