-- =========================================================================
-- MFG Advisory — Foredrag ("talks") migration
-- =========================================================================
-- Kør denne fil i Supabase SQL Editor (Project → SQL Editor → New query →
-- indsæt hele filen → Run), EFTER du allerede har kørt supabase/schema.sql.
--
-- VIGTIGT — læs dette, før du kører den:
-- Denne tabel har en STRENGERE sikkerhedsmodel end den generiske "content"-
-- tabel i schema.sql. "content" tillader skrivning med den offentlige
-- anon-nøgle, fordi adminpanelets PIN-kode kun er en visuel/UI-spærre, ikke
-- en rigtig login-session i Supabase.
--
-- "talks" er bygget rigtigt fra start: offentligheden må kun LÆSE udgivne
-- foredrag, og kun en RIGTIGT AUTENTIFICERET Supabase-bruger (via Supabase
-- Auth) må oprette, redigere eller slette. Det betyder helt konkret:
--
--   ► Med det nuværende adminpanel (PIN-kode, ingen Supabase-login) KAN
--     admin IKKE skrive direkte til denne tabel, hvis Supabase er
--     tilsluttet — kun læse de udgivne rækker, ligesom alle andre.
--   ► Derfor bruger admin-CRUD'en til Foredrag i denne leverance stadig
--     den eksisterende content-store (samme LocalStorage/"content"-tabel-
--     mekanisme som Cases og Testimonials), præcis som resten af sitet
--     fungerer i dag.
--   ► Denne tabel er det korrekte, sikre fundament, der er klar til brug,
--     den dag adminpanelet får en rigtig Supabase Auth-login. Fra da af
--     kan indholdet flyttes fra content-store'en over i denne tabel uden
--     at ændre sikkerhedsmodellen.
--
-- Kort sagt: dette er IKKE endnu den aktive datakilde for Foredrag-siden —
-- det er den fremtidssikrede, korrekt afspærrede tabel, opgaven bad om.
-- =========================================================================

create table if not exists talks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  category text,
  excerpt text,
  body text,
  target_audience text,
  participant_outcomes text,
  topics text,
  duration text,
  format text,
  image_url text,
  video_url text,
  document_url text,
  cta_text text default 'Forespørg på foredraget',
  cta_url text default 'kontakt.html',
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists talks_status_idx on talks (status);
create index if not exists talks_sort_order_idx on talks (sort_order);

-- Keep updated_at current on every write, and stamp published_at the first
-- time a talk's status becomes "published".
create or replace function set_talks_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  if new.status = 'published' and (old.status is distinct from 'published') and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_talks_updated_at on talks;
create trigger trg_talks_updated_at
before update on talks
for each row execute function set_talks_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table talks enable row level security;

-- Public (anon key, i.e. every visitor) may only ever READ rows whose
-- status is "published" — drafts and archived talks are invisible to them,
-- and they can never write, update, or delete anything.
drop policy if exists "public read published talks" on talks;
create policy "public read published talks" on talks
  for select
  using (status = 'published');

-- Only a real, authenticated Supabase user (Supabase Auth session — NOT
-- just "has the anon key") may create, edit, or delete talks. Until this
-- project adds real admin login via Supabase Auth, nothing (including the
-- current PIN-based admin panel) can write to this table — which is the
-- intended, secure default.
drop policy if exists "authenticated manage talks" on talks;
create policy "authenticated manage talks" on talks
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Explicitly confirm: no anonymous write policy exists. The service role
-- key (which bypasses RLS entirely) must never be used in the browser —
-- it is not referenced anywhere in this project's client-side code.
