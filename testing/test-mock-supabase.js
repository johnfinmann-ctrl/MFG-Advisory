/* =========================================================================
   TEST-HJÆLP (indgår IKKE i leverancen) — en simuleret Supabase-klient,
   der efterligner den rigtige klients API (from/select/eq/order/insert/
   update/delete/auth/storage), understøttet af almindelige JS-arrays i
   hukommelsen. Bruges udelukkende til at teste admin.js' og
   content-loader.js' egen logik grundigt uden et rigtigt Supabase-projekt.
   ========================================================================= */

window.__MOCK_DB__ = {
  admin_users: [{ user_id: 'admin-uid-1' }],
  cases: [
    { id: 'c1', slug: 'mennesker-case-1', title: 'Produktionsvirksomhed, ca. 60 medarbejdere', category: 'mennesker', teaser: 'Kortere time-to-hire.', challenge: '', responsibility: '', approach: '', result: '', mfg_help: '', key_figures: '', image_path: null, status: 'published', sort_order: 1, updated_at: new Date().toISOString() },
    { id: 'c2', slug: 'ledelse-case-1', title: 'Ejerledet handelsvirksomhed', category: 'ledelse', teaser: 'Hurtigere beslutninger.', challenge: '', responsibility: '', approach: '', result: '', mfg_help: '', key_figures: '', image_path: null, status: 'published', sort_order: 2, updated_at: new Date().toISOString() }
  ],
  talks: [
    { id: 't1', slug: 'ledelse-der-skaber-retning', title: 'Ledelse, der skaber retning', category: 'ledelse', teaser: 'Et foredrag om tydelig ledelse.', description: '', target_group: '', duration: '', format: '', image_path: null, video_url: '', document_path: null, cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', status: 'published', sort_order: 1, is_featured: true, updated_at: new Date().toISOString() },
    { id: 't2', slug: 'kultur-skabes-gennem-handling', title: 'Kultur skabes gennem handling', category: 'kultur', teaser: 'Et foredrag om adfærd og vaner.', description: '', target_group: '', duration: '', format: '', image_path: null, video_url: '', document_path: null, cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', status: 'published', sort_order: 2, is_featured: false, updated_at: new Date().toISOString() }
  ],
  testimonials: [],
  page_content: [
    { id: 'p1', page: 'index', section: 'hero', field: 'hero-title', value: 'Når mennesker lykkes,<br>følger resultaterne med', content_type: 'html', status: 'published' },
    { id: 'p2', page: 'index', section: 'hero', field: 'hero-body', value: "Vi hjælper ejerledere og SMV'er...", content_type: 'text', status: 'published' },
    { id: 'p3', page: 'kontakt', section: 'hero', field: 'kontakt-hero-title', value: 'Vi skaber resultater...', content_type: 'text', status: 'published' }
  ],
  seo_metadata: [
    { id: 's1', page: 'index', title: 'MFG Advisory — The MFG Compass™', meta_description: 'Test description', status: 'published' }
  ]
};

window.__MOCK_AUTH_STATE__ = {
  get session() {
    try { return JSON.parse(localStorage.getItem('__mock_sb_session__')); } catch (e) { return null; }
  },
  set session(v) {
    if (v) localStorage.setItem('__mock_sb_session__', JSON.stringify(v));
    else localStorage.removeItem('__mock_sb_session__');
  }
};
window.__MOCK_USERS__ = { 'morten@mfgadvisory.dk': { password: 'RigtigtKodeord123', id: 'admin-uid-1' }, 'ikke-admin@example.com': { password: 'password123', id: 'nonadmin-uid-2' } };

(function () {
  function queryBuilder(table) {
    let filters = [];
    let orderCol = null;
    let selectCols = '*';
    let mode = 'select';
    let insertPayload = null;
    let updatePayload = null;
    let single = false;
    let maybeSingle = false;

    function applyFilters(rows) {
      let out = rows;
      filters.forEach(f => { out = out.filter(r => String(r[f.col]) === String(f.val)); });
      return out;
    }

    const builder = {
      select(cols) { selectCols = cols || '*'; return builder; },
      eq(col, val) { filters.push({ col, val }); return builder; },
      order(col) { orderCol = col; return builder; },
      insert(payload) { mode = 'insert'; insertPayload = payload; return builder; },
      update(payload) { mode = 'update'; updatePayload = payload; return builder; },
      delete() { mode = 'delete'; return builder; },
      single() { single = true; return builder; },
      maybeSingle() { maybeSingle = true; return builder; },
      then(resolve) {
        // Executed lazily like a thenable, mimicking supabase-js's PostgrestBuilder
        try {
          const db = window.__MOCK_DB__[table] || (window.__MOCK_DB__[table] = []);
          if (mode === 'select') {
            let rows = applyFilters(db);
            if (orderCol) rows = [...rows].sort((a, b) => (a[orderCol] || 0) - (b[orderCol] || 0));
            if (single) return resolve({ data: rows[0] || null, error: rows[0] ? null : { message: 'Not found' } });
            if (maybeSingle) return resolve({ data: rows[0] || null, error: null });
            return resolve({ data: rows, error: null });
          }
          if (mode === 'insert') {
            const row = Object.assign({ id: 'new-' + Date.now() + Math.random().toString(36).slice(2, 6), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, insertPayload);
            db.push(row);
            return resolve({ data: single ? row : [row], error: null });
          }
          if (mode === 'update') {
            const rows = applyFilters(db);
            rows.forEach(r => Object.assign(r, updatePayload, { updated_at: new Date().toISOString() }));
            return resolve({ data: rows, error: null });
          }
          if (mode === 'delete') {
            const toDelete = applyFilters(db);
            toDelete.forEach(r => { const idx = db.indexOf(r); if (idx >= 0) db.splice(idx, 1); });
            return resolve({ data: toDelete, error: null });
          }
        } catch (e) {
          return resolve({ data: null, error: { message: e.message } });
        }
      }
    };
    return builder;
  }

  const mockClient = {
    from(table) { return queryBuilder(table); },
    auth: {
      async signInWithPassword({ email, password }) {
        const u = window.__MOCK_USERS__[email];
        if (!u || u.password !== password) return { data: null, error: { message: 'Invalid credentials' } };
        const user = { id: u.id, email };
        window.__MOCK_AUTH_STATE__.session = { user };
        return { data: { user, session: { user } }, error: null };
      },
      async getSession() {
        return { data: { session: window.__MOCK_AUTH_STATE__.session } };
      },
      async signOut() {
        window.__MOCK_AUTH_STATE__.session = null;
        return { error: null };
      },
      async resetPasswordForEmail(email) {
        return { error: null };
      },
      async updateUser({ password }) {
        return { error: null };
      },
      onAuthStateChange() { /* no-op for tests */ }
    },
    storage: {
      from(bucket) {
        return {
          async upload(path) { return { data: { path }, error: null }; },
          getPublicUrl(path) { return { data: { publicUrl: 'https://mock.supabase.co/storage/v1/object/public/' + bucket + '/' + path } }; }
        };
      }
    }
  };

  window.supabase = { createClient: () => mockClient };
})();
