/* =========================================================================
   MFG Advisory — Supabase configuration
   =========================================================================
   Fill in MFG_SUPABASE_URL and MFG_SUPABASE_ANON_KEY with your own Supabase
   project's values to enable cloud storage for the admin panel (so edits
   are shared across devices/browsers and survive clearing browser data).

   Leave both empty (as below) and everything still works — the site and
   admin panel automatically fall back to the browser's LocalStorage. The
   only difference is that LocalStorage edits are only visible in the same
   browser on the same device where they were saved.

   Where to find these values in Supabase:
   1. Create a free project at https://supabase.com
   2. Go to Project Settings → API
   3. Copy "Project URL" into MFG_SUPABASE_URL
   4. Copy the "anon public" key into MFG_SUPABASE_ANON_KEY
   5. Run the SQL in /supabase/schema.sql (see that file) in the Supabase
      SQL editor to create the required "content" table and storage bucket.
   ========================================================================= */

window.MFG_SUPABASE_URL = '';
window.MFG_SUPABASE_ANON_KEY = '';
window.MFG_SUPABASE_STORAGE_BUCKET = 'mfg-media';
