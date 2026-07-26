/* =========================================================================
   MFG Advisory — Offentlig datahentning (Fase 2)
   =========================================================================
   Alle funktioner her henter UDELUKKENDE offentliggjort indhold direkte fra
   Supabase (styret af Row Level Security — ikke af klientkode). Hvis
   Supabase ikke kan nås, kastes en fejl videre til kalderen, som SKAL vise
   en tydelig fejltilstand og IKKE en tom side (se content-loader.js).

   Der caches i hukommelsen for det aktuelle sidevisning, så vi ikke henter
   det samme indhold flere gange på én side.
   ========================================================================= */

(function () {
  const cache = {};

  async function fetchTable(table, extraQuery) {
    if (!window.MFGSupabase) throw new Error('Supabase er ikke konfigureret.');
    const cacheKey = table + '|' + (extraQuery || '');
    if (cache[cacheKey]) return cache[cacheKey];

    let query = window.MFGSupabase.from(table).select('*').eq('status', 'published');
    if (table === 'talks' || table === 'cases' || table === 'testimonials') {
      query = query.order('sort_order', { ascending: true });
    }
    const { data, error } = await query;
    if (error) throw error;
    cache[cacheKey] = data || [];
    return cache[cacheKey];
  }

  async function getCases() {
    return fetchTable('cases');
  }

  async function getTalks() {
    return fetchTable('talks');
  }

  async function getFeaturedTalks(limit) {
    const all = await getTalks();
    return all.filter(t => t.is_featured).slice(0, limit || 3);
  }

  async function getTestimonials() {
    return fetchTable('testimonials');
  }

  async function getPageContent(page) {
    const cacheKey = 'page_content|' + page;
    if (cache[cacheKey]) return cache[cacheKey];
    if (!window.MFGSupabase) throw new Error('Supabase er ikke konfigureret.');
    const { data, error } = await window.MFGSupabase
      .from('page_content')
      .select('field, value, content_type')
      .eq('page', page)
      .eq('status', 'published');
    if (error) throw error;
    const map = {};
    (data || []).forEach(row => { map[row.field] = row.value; });
    cache[cacheKey] = map;
    return map;
  }

  async function getSeo(page) {
    const cacheKey = 'seo|' + page;
    if (cache[cacheKey]) return cache[cacheKey];
    if (!window.MFGSupabase) throw new Error('Supabase er ikke konfigureret.');
    const { data, error } = await window.MFGSupabase
      .from('seo_metadata')
      .select('*')
      .eq('page', page)
      .eq('status', 'published')
      .maybeSingle();
    if (error) throw error;
    cache[cacheKey] = data || null;
    return cache[cacheKey];
  }

  window.MFGPublicData = { getCases, getTalks, getFeaturedTalks, getTestimonials, getPageContent, getSeo };
})();
