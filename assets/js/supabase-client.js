/* =========================================================================
   MFG Advisory — Supabase-klient (Fase 2)
   =========================================================================
   Initialiserer én delt Supabase-klient ud fra window.MFG_SUPABASE_URL og
   MFG_SUPABASE_ANON_KEY (se assets/js/supabase-config.js).

   Bruger den lokalt medfølgende assets/js/vendor/supabase.js — IKKE en
   ekstern CDN — så sitet ikke er afhængigt af tredjeparts oppetid, og kan
   køre uden internetadgang til andet end selve Supabase-projektet.

   window.MFGSupabase er null, hvis URL/nøgle mangler, så både de
   offentlige sider og adminpanelet kan tjekke for det og vise en tydelig
   fejltilstand i stedet for at fejle stille.
   ========================================================================= */

(function () {
  if (!window.MFG_SUPABASE_URL || !window.MFG_SUPABASE_ANON_KEY) {
    window.MFGSupabase = null;
    console.warn('MFG: Supabase er ikke konfigureret endnu (se assets/js/supabase-config.js).');
    return;
  }
  if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
    window.MFGSupabase = null;
    console.error('MFG: Supabase-klientbiblioteket (assets/js/vendor/supabase.js) kunne ikke indlæses.');
    return;
  }
  window.MFGSupabase = window.supabase.createClient(
    window.MFG_SUPABASE_URL,
    window.MFG_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );
})();
