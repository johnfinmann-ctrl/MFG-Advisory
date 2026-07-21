-- =========================================================================
-- MFG Advisory — Supabase schema
-- =========================================================================
-- Run this once in your Supabase project's SQL editor
-- (Project → SQL Editor → New query → paste all of this → Run).
--
-- After running it, copy your Project URL and "anon public" API key
-- (Project Settings → API) into assets/js/supabase-config.js.
-- =========================================================================

-- 1) Table that stores every editable piece of content as a simple
--    key/value pair. The "key" matches the data-edit attribute in the
--    HTML (e.g. "hero-title", "mennesker-case-title", "contact-phone").
--    A few keys hold JSON (stored as plain text) rather than a single
--    string value:
--      "cases"        — array of {title, industry, customer, hideCustomer,
--                        challenge, solution, result, direction, direction2,
--                        image, pdf, gallery[], ctaText, ctaLink}
--      "testimonials" — array of {name, title, company, quote, direction,
--                        image, logo}
--      "solutions"    — array of {direction, title, teaser, long, challenges,
--                        approach, results, image, icon, relatedCase,
--                        ctaText, ctaLink, published, displayMode} — the
--                        admin-created "løsningskort" on the four direction pages
--      "om-competencies" / "om-certifications" — array of strings
--    These are parsed/stringified in assets/js/admin.js and
--    assets/js/content-loader.js — the table itself doesn't need to know
--    about their internal shape, it's still just one text value per key.
create table if not exists content (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every write
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_content_updated_at on content;
create trigger trg_content_updated_at
before update on content
for each row execute function set_updated_at();

-- 2) Row Level Security
-- IMPORTANT — read this:
-- This project has no separate backend/server, so the admin panel talks
-- to Supabase directly using the public "anon" key, which is visible in
-- the browser. That means these policies necessarily allow the anon key
-- to read AND write. The admin panel's PIN code is the only gate on
-- *who sees the editor*, not a real database-level authentication layer.
-- This is an accepted, documented trade-off for a no-backend static site.
-- If you need stronger protection later, the standard upgrade path is:
-- add Supabase Auth (real user login) and rewrite these policies to
-- require an authenticated session for INSERT/UPDATE/DELETE.
alter table content enable row level security;

drop policy if exists "public read" on content;
create policy "public read" on content
  for select using (true);

drop policy if exists "public write" on content;
create policy "public write" on content
  for insert with check (true);

drop policy if exists "public update" on content;
create policy "public update" on content
  for update using (true);

drop policy if exists "public delete" on content;
create policy "public delete" on content
  for delete using (true);

-- 3) Storage bucket for uploaded images (portrait photo, future images).
-- If this fails with "already exists", that's fine — it means it's already set up.
insert into storage.buckets (id, name, public)
values ('mfg-media', 'mfg-media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'mfg-media');

drop policy if exists "public upload media" on storage.objects;
create policy "public upload media" on storage.objects
  for insert with check (bucket_id = 'mfg-media');
