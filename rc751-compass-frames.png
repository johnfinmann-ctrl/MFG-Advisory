/* =========================================================================
   MFG Advisory — Content Store
   =========================================================================
   A tiny key/value content store used by both the public site
   (content-loader.js) and the admin panel (admin.js).

   Storage backend:
     - If window.MFG_SUPABASE_URL and MFG_SUPABASE_ANON_KEY are set
       (see assets/js/supabase-config.js), all reads/writes go to a
       Supabase table called "content" (key text primary key, value text).
     - Otherwise everything transparently falls back to the browser's
       LocalStorage under the key "mfg_content".

   This file intentionally has zero dependencies and no build step, so it
   can be dropped straight onto GitHub Pages.
   ========================================================================= */

(function (global) {
  const LOCAL_KEY = 'mfg_content';

  function supabaseConfigured() {
    return !!(global.MFG_SUPABASE_URL && global.MFG_SUPABASE_ANON_KEY);
  }

  function supabaseHeaders(extra) {
    return Object.assign({
      'apikey': global.MFG_SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + global.MFG_SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    }, extra || {});
  }

  // ---- LocalStorage backend ----
  function localGetAll() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn('MFGStore: could not read LocalStorage', e);
      return {};
    }
  }

  function localSetMany(obj) {
    const current = localGetAll();
    Object.assign(current, obj);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(current));
    return Promise.resolve();
  }

  function localReset() {
    localStorage.removeItem(LOCAL_KEY);
    return Promise.resolve();
  }

  // ---- Supabase backend ----
  async function supabaseGetAll() {
    const url = global.MFG_SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/content?select=key,value';
    const res = await fetch(url, { headers: supabaseHeaders() });
    if (!res.ok) throw new Error('Supabase read failed: ' + res.status);
    const rows = await res.json();
    const map = {};
    rows.forEach(r => { map[r.key] = r.value; });
    return map;
  }

  async function supabaseSetMany(obj) {
    const url = global.MFG_SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/content?on_conflict=key';
    const rows = Object.keys(obj).map(key => ({ key: key, value: obj[key] }));
    const res = await fetch(url, {
      method: 'POST',
      headers: supabaseHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
      body: JSON.stringify(rows)
    });
    if (!res.ok) throw new Error('Supabase write failed: ' + res.status);
  }

  async function supabaseReset() {
    const url = global.MFG_SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/content?key=neq.__never__';
    const res = await fetch(url, { method: 'DELETE', headers: supabaseHeaders() });
    if (!res.ok) throw new Error('Supabase reset failed: ' + res.status);
  }

  async function supabaseUploadImage(file) {
    const bucket = global.MFG_SUPABASE_STORAGE_BUCKET || 'mfg-media';
    const path = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const url = global.MFG_SUPABASE_URL.replace(/\/$/, '') + '/storage/v1/object/' + bucket + '/' + path;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': global.MFG_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + global.MFG_SUPABASE_ANON_KEY,
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: file
    });
    if (!res.ok) throw new Error('Supabase storage upload failed: ' + res.status);
    return global.MFG_SUPABASE_URL.replace(/\/$/, '') + '/storage/v1/object/public/' + bucket + '/' + path;
  }

  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ---- Public API (with automatic fallback on any Supabase error) ----
  const MFGStore = {
    backend() {
      return supabaseConfigured() ? 'supabase' : 'localstorage';
    },

    async getAll() {
      if (supabaseConfigured()) {
        try {
          return await supabaseGetAll();
        } catch (e) {
          console.warn('MFGStore: Supabase read failed, falling back to LocalStorage', e);
          return localGetAll();
        }
      }
      return localGetAll();
    },

    async setMany(obj) {
      // Always mirror into LocalStorage too, so a temporary Supabase outage
      // never loses an edit the person just made.
      await localSetMany(obj);
      if (supabaseConfigured()) {
        await supabaseSetMany(obj);
      }
    },

    async resetAll() {
      await localReset();
      if (supabaseConfigured()) {
        try { await supabaseReset(); } catch (e) { console.warn('MFGStore: Supabase reset failed', e); }
      }
    },

    async uploadImage(file) {
      if (supabaseConfigured()) {
        try {
          return await supabaseUploadImage(file);
        } catch (e) {
          console.warn('MFGStore: Supabase storage upload failed, embedding image as base64 instead', e);
        }
      }
      return fileToDataURL(file);
    }
  };

  global.MFGStore = MFGStore;
})(window);
