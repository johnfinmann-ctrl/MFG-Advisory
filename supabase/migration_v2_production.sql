-- =========================================================================
-- MFG Advisory — Fase 2: Produktionsklar database
-- =========================================================================
-- Kør i Supabase SQL Editor, i denne rækkefølge:
--   1. Denne fil (migration_v2_production.sql)
--   2. seed_v2_production.sql
--
-- Denne fil erstatter det tidligere generiske "content"-nøgle/værdi-system
-- (schema.sql) med rigtige, strukturerede tabeller og en reel
-- administrator-rolle håndhævet af Row Level Security.
--
-- Kør IKKE det gamle schema.sql igen efter denne fil — de er ikke beregnet
-- til at bruges sammen. Se README-admin.md for den fulde overgangsplan.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 0. Fælles: opdaterings-tidsstempel-trigger (genbruges af alle tabeller)
-- -------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- -------------------------------------------------------------------------
-- 1. Administratorer
-- -------------------------------------------------------------------------
-- En bruger bliver KUN administrator ved at have en række her, knyttet til
-- deres auth.users-id. At oprette en Supabase Auth-bruger alene giver ikke
-- adgang til noget som helst.
create table if not exists admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;

-- En administrator må se listen af administratorer (til fx at bekræfte egen
-- adgang) — men aldrig ændre den fra browseren. Tilføjelse af nye
-- administratorer sker af dig i Supabase-dashboardet (se README), ikke fra
-- adminpanelet.
drop policy if exists "admins can read admin_users" on admin_users;
create policy "admins can read admin_users" on admin_users
  for select
  using (auth.uid() = user_id);

-- Hjælpefunktion, som alle øvrige RLS-politikker bruger til at spørge:
-- "er den nuværende bruger en godkendt administrator?"
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from admin_users where user_id = auth.uid()
  );
$$;

-- -------------------------------------------------------------------------
-- 2. Cases
-- -------------------------------------------------------------------------
create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  teaser text,
  challenge text,
  responsibility text,
  approach text,
  result text,
  mfg_help text,
  key_figures text,
  image_path text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id)
);

create index if not exists cases_status_idx on cases (status);
create index if not exists cases_sort_order_idx on cases (sort_order);

drop trigger if exists trg_cases_updated_at on cases;
create trigger trg_cases_updated_at before update on cases
for each row execute function set_updated_at();

alter table cases enable row level security;

drop policy if exists "public read published cases" on cases;
create policy "public read published cases" on cases
  for select using (status = 'published');

drop policy if exists "admins read all cases" on cases;
create policy "admins read all cases" on cases
  for select using (is_admin());

drop policy if exists "admins insert cases" on cases;
create policy "admins insert cases" on cases
  for insert with check (is_admin());

drop policy if exists "admins update cases" on cases;
create policy "admins update cases" on cases
  for update using (is_admin()) with check (is_admin());

drop policy if exists "admins delete cases" on cases;
create policy "admins delete cases" on cases
  for delete using (is_admin());

-- -------------------------------------------------------------------------
-- 3. Foredrag (talks)
-- -------------------------------------------------------------------------
create table if not exists talks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  teaser text,
  description text,
  target_group text,
  duration text,
  format text,
  image_path text,
  video_url text,
  document_path text,
  cta_text text default 'Forespørg på foredraget',
  cta_url text default 'kontakt.html',
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id)
);

create index if not exists talks_status_idx on talks (status);
create index if not exists talks_sort_order_idx on talks (sort_order);

drop trigger if exists trg_talks_updated_at on talks;
create trigger trg_talks_updated_at before update on talks
for each row execute function set_updated_at();

alter table talks enable row level security;

drop policy if exists "public read published talks" on talks;
create policy "public read published talks" on talks
  for select using (status = 'published');

drop policy if exists "admins read all talks" on talks;
create policy "admins read all talks" on talks
  for select using (is_admin());

drop policy if exists "admins insert talks" on talks;
create policy "admins insert talks" on talks
  for insert with check (is_admin());

drop policy if exists "admins update talks" on talks;
create policy "admins update talks" on talks
  for update using (is_admin()) with check (is_admin());

drop policy if exists "admins delete talks" on talks;
create policy "admins delete talks" on talks
  for delete using (is_admin());

-- -------------------------------------------------------------------------
-- 4. Testimonials
-- -------------------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title_company text,
  quote text not null,
  direction text,
  photo_path text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id)
);

create index if not exists testimonials_status_idx on testimonials (status);

drop trigger if exists trg_testimonials_updated_at on testimonials;
create trigger trg_testimonials_updated_at before update on testimonials
for each row execute function set_updated_at();

alter table testimonials enable row level security;

drop policy if exists "public read published testimonials" on testimonials;
create policy "public read published testimonials" on testimonials
  for select using (status = 'published');

drop policy if exists "admins read all testimonials" on testimonials;
create policy "admins read all testimonials" on testimonials
  for select using (is_admin());

drop policy if exists "admins insert testimonials" on testimonials;
create policy "admins insert testimonials" on testimonials
  for insert with check (is_admin());

drop policy if exists "admins update testimonials" on testimonials;
create policy "admins update testimonials" on testimonials
  for update using (is_admin()) with check (is_admin());

drop policy if exists "admins delete testimonials" on testimonials;
create policy "admins delete testimonials" on testimonials
  for delete using (is_admin());

-- -------------------------------------------------------------------------
-- 5. Sidetekster og indstillinger (page_content)
-- -------------------------------------------------------------------------
-- Erstatter de tidligere løse "data-edit"-nøgler. Én række = ét felt på én
-- sektion af én side. "status" styrer, om feltet er offentligt synligt
-- (stort set alt sidetekst er "published" med det samme — der er sjældent
-- brug for kladdetilstand på fx et telefonnummer, men muligheden er der).
create table if not exists page_content (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  section text not null,
  field text not null,
  value text,
  content_type text not null default 'text' check (content_type in ('text', 'html', 'richtext', 'image_path', 'url', 'number', 'boolean')),
  status text not null default 'published' check (status in ('draft', 'published')),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id),
  unique (page, section, field)
);

create index if not exists page_content_page_idx on page_content (page);

drop trigger if exists trg_page_content_updated_at on page_content;
create trigger trg_page_content_updated_at before update on page_content
for each row execute function set_updated_at();

alter table page_content enable row level security;

drop policy if exists "public read published page_content" on page_content;
create policy "public read published page_content" on page_content
  for select using (status = 'published');

drop policy if exists "admins read all page_content" on page_content;
create policy "admins read all page_content" on page_content
  for select using (is_admin());

drop policy if exists "admins insert page_content" on page_content;
create policy "admins insert page_content" on page_content
  for insert with check (is_admin());

drop policy if exists "admins update page_content" on page_content;
create policy "admins update page_content" on page_content
  for update using (is_admin()) with check (is_admin());

drop policy if exists "admins delete page_content" on page_content;
create policy "admins delete page_content" on page_content
  for delete using (is_admin());

-- -------------------------------------------------------------------------
-- 6. SEO-metadata (adskilt fra almindelige sidetekster, som krævet)
-- -------------------------------------------------------------------------
create table if not exists seo_metadata (
  id uuid primary key default gen_random_uuid(),
  page text unique not null,
  title text,
  meta_description text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_path text,
  status text not null default 'published' check (status in ('draft', 'published')),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

drop trigger if exists trg_seo_metadata_updated_at on seo_metadata;
create trigger trg_seo_metadata_updated_at before update on seo_metadata
for each row execute function set_updated_at();

alter table seo_metadata enable row level security;

drop policy if exists "public read published seo_metadata" on seo_metadata;
create policy "public read published seo_metadata" on seo_metadata
  for select using (status = 'published');

drop policy if exists "admins read all seo_metadata" on seo_metadata;
create policy "admins read all seo_metadata" on seo_metadata
  for select using (is_admin());

drop policy if exists "admins insert seo_metadata" on seo_metadata;
create policy "admins insert seo_metadata" on seo_metadata
  for insert with check (is_admin());

drop policy if exists "admins update seo_metadata" on seo_metadata;
create policy "admins update seo_metadata" on seo_metadata
  for update using (is_admin()) with check (is_admin());

drop policy if exists "admins delete seo_metadata" on seo_metadata;
create policy "admins delete seo_metadata" on seo_metadata
  for delete using (is_admin());

-- -------------------------------------------------------------------------
-- 7. Storage (billeder og dokumenter)
-- -------------------------------------------------------------------------
-- Bemærk: buckets kan ikke oprettes med ren SQL i alle Supabase-versioner.
-- Denne blok bruger storage.buckets-tabellen direkte, hvilket virker i
-- SQL Editor. Hvis det fejler i din version, opret bucketsene manuelt i
-- Storage-fanen i stedet (se README) — navnene skal matche præcis.
insert into storage.buckets (id, name, public)
values
  ('case-images', 'case-images', true),
  ('talk-images', 'talk-images', true),
  ('editorial-images', 'editorial-images', true)
on conflict (id) do nothing;

-- Offentligheden må læse filer i alle tre buckets (billeder skal jo vises
-- på de offentlige sider) — men kun administratorer må uploade/erstatte/slette.
drop policy if exists "public read case-images" on storage.objects;
create policy "public read case-images" on storage.objects
  for select using (bucket_id = 'case-images');

drop policy if exists "admins write case-images" on storage.objects;
create policy "admins write case-images" on storage.objects
  for insert with check (bucket_id = 'case-images' and is_admin());

drop policy if exists "admins update case-images" on storage.objects;
create policy "admins update case-images" on storage.objects
  for update using (bucket_id = 'case-images' and is_admin());

drop policy if exists "admins delete case-images" on storage.objects;
create policy "admins delete case-images" on storage.objects
  for delete using (bucket_id = 'case-images' and is_admin());

drop policy if exists "public read talk-images" on storage.objects;
create policy "public read talk-images" on storage.objects
  for select using (bucket_id = 'talk-images');

drop policy if exists "admins write talk-images" on storage.objects;
create policy "admins write talk-images" on storage.objects
  for insert with check (bucket_id = 'talk-images' and is_admin());

drop policy if exists "admins update talk-images" on storage.objects;
create policy "admins update talk-images" on storage.objects
  for update using (bucket_id = 'talk-images' and is_admin());

drop policy if exists "admins delete talk-images" on storage.objects;
create policy "admins delete talk-images" on storage.objects
  for delete using (bucket_id = 'talk-images' and is_admin());

drop policy if exists "public read editorial-images" on storage.objects;
create policy "public read editorial-images" on storage.objects
  for select using (bucket_id = 'editorial-images');

drop policy if exists "admins write editorial-images" on storage.objects;
create policy "admins write editorial-images" on storage.objects
  for insert with check (bucket_id = 'editorial-images' and is_admin());

drop policy if exists "admins update editorial-images" on storage.objects;
create policy "admins update editorial-images" on storage.objects
  for update using (bucket_id = 'editorial-images' and is_admin());

drop policy if exists "admins delete editorial-images" on storage.objects;
create policy "admins delete editorial-images" on storage.objects
  for delete using (bucket_id = 'editorial-images' and is_admin());

-- =========================================================================
-- Efter denne fil: kør seed_v2_production.sql for at indsætte det
-- eksisterende standardindhold (cases, foredrag, testimonials, sidetekster,
-- SEO). Se README-admin.md for hele rækkefølgen, inkl. oprettelse af
-- Mortens administrator-bruger.
-- =========================================================================
