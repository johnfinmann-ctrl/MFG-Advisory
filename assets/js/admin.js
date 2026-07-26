/* =========================================================================
   MFG Advisory — Adminpanel (Fase 2: produktionsklar Supabase-version)
   =========================================================================
   Erstatter helt det tidligere PIN-baserede system. Login sker nu via
   Supabase Authentication (e-mail + adgangskode), og adgang til selve
   adminpanelet kræver derudover en godkendt række i "admin_users"-tabellen
   — håndhævet af Row Level Security i databasen, ikke kun skjult i denne fil.
   ========================================================================= */

(function () {
  const sb = () => window.MFGSupabase;

  let currentUser = null;
  let isConfirmedAdmin = false;

  const PAGES = [
    { key: 'index', label: 'Forside' },
    { key: 'mennesker', label: 'Mennesker' },
    { key: 'ledelse', label: 'Ledelse' },
    { key: 'kultur', label: 'Kultur' },
    { key: 'forretning', label: 'Forretning' },
    { key: 'foredrag', label: 'Foredrag (tekster)' },
    { key: 'cases', label: 'Cases (tekster)' },
    { key: 'om-morten', label: 'Om Morten' },
    { key: 'kontakt', label: 'Kontakt' },
    { key: 'mfg-compass', label: 'The MFG Compass™ (side)' }
  ];

  const TALK_CATEGORIES = [
    { value: 'ledelse', label: 'Ledelse' },
    { value: 'kultur', label: 'Kultur' },
    { value: 'mennesker', label: 'Mennesker' },
    { value: 'forretning', label: 'Forretningsudvikling' },
    { value: 'psykologisk-tryghed', label: 'Psykologisk tryghed' },
    { value: 'tilknytning', label: 'Tilknytning' },
    { value: 'compass', label: 'The MFG Compass™' }
  ];
  const CASE_CATEGORIES = [
    { value: 'mennesker', label: 'Mennesker' },
    { value: 'ledelse', label: 'Ledelse' },
    { value: 'kultur', label: 'Kultur' },
    { value: 'forretning', label: 'Forretning' }
  ];

  // ---------------- Helpers ----------------
  function escapeHtml(s) { return (s == null ? '' : String(s)).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
  function escapeAttr(s) { return (s == null ? '' : String(s)).replace(/"/g, '&quot;'); }
  function humanLabel(key) { return key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
  function fmtDate(iso) {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleString('da-DK', { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return iso; }
  }

  function toast(msg, kind) {
    let el = document.getElementById('mfgToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'mfgToast';
      el.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:3000;padding:12px 18px;border-radius:8px;' +
        'font-size:.85rem;box-shadow:0 8px 24px rgba(0,0,0,.2);transition:opacity .3s;color:#fff';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.background = kind === 'error' ? '#7a2e2e' : '#2e7d32';
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = '0'; }, 3200);
  }

  // ---------------- Auth ----------------
  function showLoginBox(which) {
    document.getElementById('loginBox').style.display = which === 'login' ? 'block' : 'none';
    document.getElementById('forgotBox').style.display = which === 'forgot' ? 'block' : 'none';
    document.getElementById('notAdminBox').style.display = which === 'notadmin' ? 'block' : 'none';
  }

  async function login() {
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = '';
    if (!email || !password) { errorEl.textContent = 'Udfyld både e-mail og adgangskode.'; return; }
    if (!sb()) { errorEl.textContent = 'Supabase er ikke konfigureret (se assets/js/supabase-config.js).'; return; }

    const { data, error } = await sb().auth.signInWithPassword({ email, password });
    if (error) {
      errorEl.textContent = 'Forkert e-mail eller adgangskode.';
      return;
    }
    await afterAuthResolved(data.user);
  }

  async function checkAdminRole(user) {
    const { data, error } = await sb().from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
    if (error) { console.warn('MFG admin: kunne ikke tjekke admin-rolle', error); return false; }
    return !!data;
  }

  async function afterAuthResolved(user) {
    currentUser = user;
    isConfirmedAdmin = await checkAdminRole(user);
    if (!isConfirmedAdmin) {
      showLoginBox('notadmin');
      return;
    }
    showApp();
    document.getElementById('loggedInAsLabel').textContent = user.email;
    boot();
  }

  async function logout() {
    if (sb()) await sb().auth.signOut();
    currentUser = null;
    isConfirmedAdmin = false;
    document.getElementById('adminApp').classList.remove('visible');
    document.getElementById('loginScreen').style.display = 'flex';
    showLoginBox('login');
    document.getElementById('emailInput').value = '';
    document.getElementById('passwordInput').value = '';
  }

  async function requestPasswordReset() {
    const email = document.getElementById('forgotEmailInput').value.trim();
    const errorEl = document.getElementById('forgotError');
    const successEl = document.getElementById('forgotSuccess');
    errorEl.textContent = '';
    successEl.style.display = 'none';
    if (!email) { errorEl.textContent = 'Indtast din e-mail.'; return; }
    if (!sb()) { errorEl.textContent = 'Supabase er ikke konfigureret.'; return; }

    const redirectTo = window.location.origin + window.location.pathname.replace('admin.html', 'reset-password.html');
    const { error } = await sb().auth.resetPasswordForEmail(email, { redirectTo });
    if (error) { errorEl.textContent = 'Kunne ikke sende link: ' + error.message; return; }
    successEl.textContent = 'Hvis kontoen findes, er der sendt en mail med et nulstillingslink.';
    successEl.style.display = 'block';
  }

  function showApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').classList.add('visible');
  }

  // ---------------- Generic table CRUD ----------------
  async function fetchAll(table, orderCol) {
    let q = sb().from(table).select('*');
    if (orderCol) q = q.order(orderCol, { ascending: true });
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }

  async function insertRow(table, row) {
    row.created_by = currentUser.id;
    row.updated_by = currentUser.id;
    const { data, error } = await sb().from(table).insert(row).select().single();
    if (error) throw error;
    return data;
  }

  async function updateRow(table, id, patch) {
    patch.updated_by = currentUser.id;
    const { error } = await sb().from(table).update(patch).eq('id', id);
    if (error) throw error;
  }

  async function deleteRow(table, id) {
    const { error } = await sb().from(table).delete().eq('id', id);
    if (error) throw error;
  }

  async function uploadFile(bucket, file) {
    const path = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const { error } = await sb().storage.from(bucket).upload(path, file, { upsert: false });
    if (error) throw error;
    const { data } = sb().storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  function slugify(s) {
    return (s || '')
      .toLowerCase()
      .replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || ('item-' + Date.now());
  }

  // ---------------- Dashboard ----------------
  async function renderDashboard() {
    const [cases, talks, testimonials] = await Promise.all([
      fetchAll('cases'), fetchAll('talks'), fetchAll('testimonials')
    ]);
    const pubCases = cases.filter(c => c.status === 'published').length;
    const pubTalks = talks.filter(t => t.status === 'published').length;
    const pubTesti = testimonials.filter(t => t.status === 'published').length;
    return `
      <p class="section-sub">Overblik over hjemmesidens indhold — hentet direkte fra Supabase.</p>
      <div class="field-card">
        <label>Lagring</label>
        <p>Supabase PostgreSQL (delt på tværs af alle enheder og browsere)</p>
      </div>
      <div class="field-card">
        <label>Indhold</label>
        <p>${cases.length} case(s) (${pubCases} udgivet) · ${talks.length} foredrag (${pubTalks} udgivet) · ${testimonials.length} testimonial(s) (${pubTesti} udgivet)</p>
      </div>
      <div class="field-card">
        <label>Logget ind som</label>
        <p>${escapeHtml(currentUser.email)}</p>
      </div>
      <div class="field-card">
        <label>Genveje</label>
        <p><a href="index.html" target="_blank" rel="noopener">Se forsiden ↗</a> &nbsp;·&nbsp;
        <a href="cases.html" target="_blank" rel="noopener">Se Cases-siden ↗</a> &nbsp;·&nbsp;
        <a href="foredrag.html" target="_blank" rel="noopener">Se Foredrag-siden ↗</a> &nbsp;·&nbsp;
        <a href="kontakt.html" target="_blank" rel="noopener">Se Kontakt-siden ↗</a></p>
      </div>
    `;
  }

  // ---------------- Cases ----------------
  let casesCache = [];

  async function renderCasesSection() {
    casesCache = await fetchAll('cases', 'sort_order');
    return `
      <p class="section-sub">Cases vist på Cases-siden. Kun status "Udgivet" er synlig for besøgende.</p>
      <div id="casesList">${renderCaseRows()}</div>
      <button class="btn btn-outline btn-sm" id="addCaseBtn">+ Tilføj case</button>
    `;
  }

  function renderCaseRows() {
    if (!casesCache.length) return '<p class="section-sub">Ingen cases oprettet endnu.</p>';
    return casesCache.map((c, pos) => `
      <div class="testi-card" data-case-id="${c.id}">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px">
          <div style="display:flex;gap:6px;align-items:center">
            <button class="btn btn-outline btn-sm" data-case-move-up="${c.id}" ${pos === 0 ? 'disabled' : ''}>↑</button>
            <button class="btn btn-outline btn-sm" data-case-move-down="${c.id}" ${pos === casesCache.length - 1 ? 'disabled' : ''}>↓</button>
            <span class="field-note">Sidst opdateret: ${fmtDate(c.updated_at)}</span>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-outline btn-sm" data-case-save="${c.id}">Gem</button>
            <button class="btn btn-danger btn-sm" data-case-delete="${c.id}">Slet</button>
          </div>
        </div>
        <div class="testi-row">
          <div><label>Titel</label><input type="text" data-cf="title" value="${escapeAttr(c.title)}"></div>
          <div><label>Kategori</label><select data-cf="category">${CASE_CATEGORIES.map(cc => `<option value="${cc.value}" ${cc.value === c.category ? 'selected' : ''}>${cc.label}</option>`).join('')}</select></div>
          <div><label>Status</label><select data-cf="status">
            <option value="draft" ${c.status === 'draft' ? 'selected' : ''}>Kladde</option>
            <option value="published" ${c.status === 'published' ? 'selected' : ''}>Udgivet</option>
          </select></div>
          <div><label>Billede</label><input type="file" accept="image/*" data-cf-image="1">${c.image_path ? '<div class="field-note">Billede er uploadet.</div>' : ''}</div>
          <div class="full"><label>Kort beskrivelse (teaser)</label><textarea data-cf="teaser">${escapeHtml(c.teaser)}</textarea></div>
          <div class="full"><label>Udfordring</label><textarea data-cf="challenge">${escapeHtml(c.challenge)}</textarea></div>
          <div class="full"><label>Vores ansvar</label><textarea data-cf="responsibility">${escapeHtml(c.responsibility)}</textarea></div>
          <div class="full"><label>Tilgang</label><textarea data-cf="approach">${escapeHtml(c.approach)}</textarea></div>
          <div class="full"><label>Resultat</label><textarea data-cf="result">${escapeHtml(c.result)}</textarea></div>
          <div class="full"><label>Sådan hjalp MFG</label><textarea data-cf="mfg_help">${escapeHtml(c.mfg_help)}</textarea></div>
          <div class="full"><label>Nøgletal (valgfrit)</label><textarea data-cf="key_figures">${escapeHtml(c.key_figures)}</textarea></div>
        </div>
      </div>
    `).join('');
  }

  function wireCases() {
    const addBtn = document.getElementById('addCaseBtn');
    if (addBtn) addBtn.addEventListener('click', async () => {
      try {
        const nextOrder = casesCache.length ? Math.max(...casesCache.map(c => c.sort_order || 0)) + 1 : 1;
        await insertRow('cases', { slug: slugify('case-' + Date.now()), title: 'Ny case', category: 'mennesker', status: 'draft', sort_order: nextOrder });
        toast('Case oprettet som kladde.');
        await refreshSection('cases');
      } catch (e) { toast('Kunne ikke oprette case: ' + e.message, 'error'); }
    });

    document.querySelectorAll('[data-case-save]').forEach(btn => btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-case-save');
      const card = document.querySelector(`.testi-card[data-case-id="${id}"]`);
      const patch = {};
      card.querySelectorAll('[data-cf]').forEach(inp => { patch[inp.getAttribute('data-cf')] = inp.value; });
      if (patch.status === 'published') patch.published_at = new Date().toISOString();
      try {
        const fileInput = card.querySelector('[data-cf-image]');
        if (fileInput && fileInput.files && fileInput.files[0]) {
          patch.image_path = await uploadFile('case-images', fileInput.files[0]);
        }
        await updateRow('cases', id, patch);
        toast('Case gemt.');
        await refreshSection('cases');
      } catch (e) { toast('Kunne ikke gemme: ' + e.message, 'error'); }
    }));

    document.querySelectorAll('[data-case-delete]').forEach(btn => btn.addEventListener('click', async () => {
      if (!confirm('Slet denne case permanent? Kan ikke fortrydes.')) return;
      try {
        await deleteRow('cases', btn.getAttribute('data-case-delete'));
        toast('Case slettet.');
        await refreshSection('cases');
      } catch (e) { toast('Kunne ikke slette: ' + e.message, 'error'); }
    }));

    document.querySelectorAll('[data-case-move-up], [data-case-move-down]').forEach(btn => btn.addEventListener('click', async () => {
      const up = btn.hasAttribute('data-case-move-up');
      const id = btn.getAttribute(up ? 'data-case-move-up' : 'data-case-move-down');
      const pos = casesCache.findIndex(c => c.id === id);
      const swapWith = up ? pos - 1 : pos + 1;
      if (swapWith < 0 || swapWith >= casesCache.length) return;
      try {
        const a = casesCache[pos], b = casesCache[swapWith];
        await updateRow('cases', a.id, { sort_order: b.sort_order });
        await updateRow('cases', b.id, { sort_order: a.sort_order });
        await refreshSection('cases');
      } catch (e) { toast('Kunne ikke ændre rækkefølge: ' + e.message, 'error'); }
    }));
  }

  // ---------------- Foredrag ----------------
  let talksCache = [];

  async function renderForedragSection() {
    talksCache = await fetchAll('talks', 'sort_order');
    return `
      <p class="section-sub">Foredrag vist på foredrag.html og som "fremhævet" på forsiden. Kun status "Udgivet" er synlig for besøgende.</p>
      <div id="foredragList">${renderTalkRows()}</div>
      <button class="btn btn-outline btn-sm" id="addForedragBtn">+ Tilføj foredrag</button>
    `;
  }

  function renderTalkRows() {
    if (!talksCache.length) return '<p class="section-sub">Ingen foredrag oprettet endnu.</p>';
    return talksCache.map((t, pos) => `
      <div class="testi-card" data-talk-id="${t.id}">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px">
          <div style="display:flex;gap:6px;align-items:center">
            <button class="btn btn-outline btn-sm" data-talk-move-up="${t.id}" ${pos === 0 ? 'disabled' : ''}>↑</button>
            <button class="btn btn-outline btn-sm" data-talk-move-down="${t.id}" ${pos === talksCache.length - 1 ? 'disabled' : ''}>↓</button>
            <button class="btn btn-outline btn-sm" data-talk-preview="${t.id}">Forhåndsvis</button>
            <span class="field-note">Opdateret: ${fmtDate(t.updated_at)}</span>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-outline btn-sm" data-talk-save="${t.id}">Gem</button>
            <button class="btn btn-danger btn-sm" data-talk-delete="${t.id}">Slet</button>
          </div>
        </div>
        <details>
        <summary style="cursor:pointer;font-weight:600;margin-bottom:12px">${escapeHtml(t.title || '(uden titel)')}</summary>
        <div class="testi-row">
          <div><label>Titel</label><input type="text" data-tf="title" value="${escapeAttr(t.title)}"></div>
          <div><label>Kategori</label><select data-tf="category">${TALK_CATEGORIES.map(cc => `<option value="${cc.value}" ${cc.value === t.category ? 'selected' : ''}>${cc.label}</option>`).join('')}</select></div>
          <div><label>Status</label><select data-tf="status">
            <option value="draft" ${t.status === 'draft' ? 'selected' : ''}>Kladde</option>
            <option value="published" ${t.status === 'published' ? 'selected' : ''}>Udgivet</option>
          </select></div>
          <div><label>Sortering</label><input type="number" data-tf="sort_order" value="${t.sort_order || 0}"></div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:22px">
            <input type="checkbox" style="width:auto" data-tf="is_featured" ${t.is_featured ? 'checked' : ''} id="tf-feat-${t.id}">
            <label for="tf-feat-${t.id}" style="margin:0;text-transform:none;font-weight:400;font-size:.82rem">Fremhævet (forsiden)</label>
          </div>
          <div><label>Varighed</label><input type="text" data-tf="duration" value="${escapeAttr(t.duration)}" placeholder="valgfrit"></div>
          <div><label>Format</label><input type="text" data-tf="format" value="${escapeAttr(t.format)}" placeholder="valgfrit"></div>
          <div><label>Billede</label><input type="file" accept="image/*" data-tf-image="1">${t.image_path ? '<div class="field-note">Uploadet.</div>' : ''}</div>
          <div><label>Video-link</label><input type="text" data-tf="video_url" value="${escapeAttr(t.video_url)}" placeholder="valgfrit"></div>
          <div><label>PDF / program</label><input type="file" accept="application/pdf" data-tf-doc="1">${t.document_path ? '<div class="field-note">Uploadet.</div>' : ''}</div>
          <div><label>CTA-tekst</label><input type="text" data-tf="cta_text" value="${escapeAttr(t.cta_text || 'Forespørg på foredraget')}"></div>
          <div><label>CTA-link</label><input type="text" data-tf="cta_url" value="${escapeAttr(t.cta_url || 'kontakt.html')}"></div>
          <div class="full"><label>Kort beskrivelse (teaser)</label><textarea data-tf="teaser">${escapeHtml(t.teaser)}</textarea></div>
          <div class="full"><label>Fuld beskrivelse (valgfrit)</label><textarea data-tf="description">${escapeHtml(t.description)}</textarea></div>
          <div class="full"><label>Målgruppe (valgfrit)</label><textarea data-tf="target_group">${escapeHtml(t.target_group)}</textarea></div>
        </div>
        <div class="talk-preview" id="talkPreview-${t.id}" style="display:none;margin-top:14px;padding:14px;background:#f7f4ee;border-radius:8px"></div>
        </details>
      </div>
    `).join('');
  }

  function wireForedrag() {
    const addBtn = document.getElementById('addForedragBtn');
    if (addBtn) addBtn.addEventListener('click', async () => {
      try {
        const nextOrder = talksCache.length ? Math.max(...talksCache.map(t => t.sort_order || 0)) + 1 : 1;
        await insertRow('talks', { slug: slugify('foredrag-' + Date.now()), title: 'Nyt foredrag', category: 'ledelse', status: 'draft', sort_order: nextOrder, is_featured: false, cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html' });
        toast('Foredrag oprettet som kladde.');
        await refreshSection('foredrag');
      } catch (e) { toast('Kunne ikke oprette: ' + e.message, 'error'); }
    });

    document.querySelectorAll('[data-talk-save]').forEach(btn => btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-talk-save');
      const card = document.querySelector(`.testi-card[data-talk-id="${id}"]`);
      const patch = {};
      card.querySelectorAll('[data-tf]').forEach(inp => {
        const f = inp.getAttribute('data-tf');
        if (f === 'is_featured') patch[f] = inp.checked;
        else if (f === 'sort_order') patch[f] = parseInt(inp.value, 10) || 0;
        else patch[f] = inp.value;
      });
      if (patch.status === 'published') patch.published_at = new Date().toISOString();
      try {
        const img = card.querySelector('[data-tf-image]');
        if (img && img.files && img.files[0]) patch.image_path = await uploadFile('talk-images', img.files[0]);
        const doc = card.querySelector('[data-tf-doc]');
        if (doc && doc.files && doc.files[0]) patch.document_path = await uploadFile('talk-images', doc.files[0]);
        await updateRow('talks', id, patch);
        toast('Foredrag gemt.');
        await refreshSection('foredrag');
      } catch (e) { toast('Kunne ikke gemme: ' + e.message, 'error'); }
    }));

    document.querySelectorAll('[data-talk-delete]').forEach(btn => btn.addEventListener('click', async () => {
      if (!confirm('Slet dette foredrag permanent? Kan ikke fortrydes.')) return;
      try {
        await deleteRow('talks', btn.getAttribute('data-talk-delete'));
        toast('Foredrag slettet.');
        await refreshSection('foredrag');
      } catch (e) { toast('Kunne ikke slette: ' + e.message, 'error'); }
    }));

    document.querySelectorAll('[data-talk-move-up], [data-talk-move-down]').forEach(btn => btn.addEventListener('click', async () => {
      const up = btn.hasAttribute('data-talk-move-up');
      const id = btn.getAttribute(up ? 'data-talk-move-up' : 'data-talk-move-down');
      const pos = talksCache.findIndex(t => t.id === id);
      const swapWith = up ? pos - 1 : pos + 1;
      if (swapWith < 0 || swapWith >= talksCache.length) return;
      try {
        const a = talksCache[pos], b = talksCache[swapWith];
        await updateRow('talks', a.id, { sort_order: b.sort_order });
        await updateRow('talks', b.id, { sort_order: a.sort_order });
        await refreshSection('foredrag');
      } catch (e) { toast('Kunne ikke ændre rækkefølge: ' + e.message, 'error'); }
    }));

    document.querySelectorAll('[data-talk-preview]').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-talk-preview');
      const card = document.querySelector(`.testi-card[data-talk-id="${id}"]`);
      const get = f => { const el = card.querySelector(`[data-tf="${f}"]`); return el ? el.value : ''; };
      const box = document.getElementById('talkPreview-' + id);
      box.innerHTML = `<strong>${escapeHtml(get('title'))}</strong><p>${escapeHtml(get('teaser'))}</p>${get('description') ? '<p>' + escapeHtml(get('description')) + '</p>' : ''}`;
      box.style.display = box.style.display === 'none' ? 'block' : 'none';
    }));
  }

  // ---------------- Testimonials ----------------
  let testiCache = [];

  async function renderTestimonialsSection() {
    testiCache = await fetchAll('testimonials', 'sort_order');
    return `
      <p class="section-sub">Kundeudtalelser vist på Cases-siden.</p>
      <div id="testimonialsListEl">${renderTestiRows()}</div>
      <button class="btn btn-outline btn-sm" id="addTestiBtn">+ Tilføj testimonial</button>
    `;
  }

  function renderTestiRows() {
    if (!testiCache.length) return '<p class="section-sub">Ingen testimonials oprettet endnu.</p>';
    return testiCache.map(t => `
      <div class="testi-card" data-testi-id="${t.id}">
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:10px">
          <button class="btn btn-outline btn-sm" data-testi-save="${t.id}">Gem</button>
          <button class="btn btn-danger btn-sm" data-testi-delete="${t.id}">Slet</button>
        </div>
        <div class="testi-row">
          <div><label>Navn</label><input type="text" data-tef="name" value="${escapeAttr(t.name)}"></div>
          <div><label>Titel/virksomhed</label><input type="text" data-tef="title_company" value="${escapeAttr(t.title_company)}"></div>
          <div><label>Retning</label><select data-tef="direction">${CASE_CATEGORIES.map(cc => `<option value="${cc.value}" ${cc.value === t.direction ? 'selected' : ''}>${cc.label}</option>`).join('')}</select></div>
          <div><label>Status</label><select data-tef="status">
            <option value="draft" ${t.status === 'draft' ? 'selected' : ''}>Kladde</option>
            <option value="published" ${t.status === 'published' ? 'selected' : ''}>Udgivet</option>
          </select></div>
          <div><label>Foto</label><input type="file" accept="image/*" data-tef-photo="1">${t.photo_path ? '<div class="field-note">Uploadet.</div>' : ''}</div>
          <div class="full"><label>Citat</label><textarea data-tef="quote">${escapeHtml(t.quote)}</textarea></div>
        </div>
      </div>
    `).join('');
  }

  function wireTestimonials() {
    const addBtn = document.getElementById('addTestiBtn');
    if (addBtn) addBtn.addEventListener('click', async () => {
      try {
        const nextOrder = testiCache.length ? Math.max(...testiCache.map(t => t.sort_order || 0)) + 1 : 1;
        await insertRow('testimonials', { name: 'Nyt navn', quote: '', direction: 'mennesker', status: 'draft', sort_order: nextOrder });
        toast('Testimonial oprettet som kladde.');
        await refreshSection('testimonials');
      } catch (e) { toast('Kunne ikke oprette: ' + e.message, 'error'); }
    });

    document.querySelectorAll('[data-testi-save]').forEach(btn => btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-testi-save');
      const card = document.querySelector(`.testi-card[data-testi-id="${id}"]`);
      const patch = {};
      card.querySelectorAll('[data-tef]').forEach(inp => { patch[inp.getAttribute('data-tef')] = inp.value; });
      if (patch.status === 'published') patch.published_at = new Date().toISOString();
      try {
        const photo = card.querySelector('[data-tef-photo]');
        if (photo && photo.files && photo.files[0]) patch.photo_path = await uploadFile('editorial-images', photo.files[0]);
        await updateRow('testimonials', id, patch);
        toast('Testimonial gemt.');
        await refreshSection('testimonials');
      } catch (e) { toast('Kunne ikke gemme: ' + e.message, 'error'); }
    }));

    document.querySelectorAll('[data-testi-delete]').forEach(btn => btn.addEventListener('click', async () => {
      if (!confirm('Slet denne testimonial permanent?')) return;
      try {
        await deleteRow('testimonials', btn.getAttribute('data-testi-delete'));
        toast('Testimonial slettet.');
        await refreshSection('testimonials');
      } catch (e) { toast('Kunne ikke slette: ' + e.message, 'error'); }
    }));
  }

  // ---------------- Sidetekster (page_content) ----------------
  let pageContentCache = {};

  async function renderPageTextSection(pageKey) {
    const { data, error } = await sb().from('page_content').select('*').eq('page', pageKey).order('section');
    if (error) throw error;
    pageContentCache[pageKey] = data || [];
    if (!data || !data.length) {
      return `<p class="section-sub">Ingen tekstfelter fundet for "${escapeHtml(pageKey)}" endnu. Kør seed-filen, eller opret felter direkte i Supabase.</p>`;
    }
    const bySection = {};
    data.forEach(row => { (bySection[row.section] = bySection[row.section] || []).push(row); });

    let html = `<p class="section-sub">Tekster på denne side. Ændringer er synlige for besøgende, så snart du gemmer.</p>`;
    Object.keys(bySection).forEach(section => {
      html += `<h3 style="margin:24px 0 8px;font-size:1rem;color:var(--a-text-mid)">${humanLabel(section)}</h3>`;
      bySection[section].forEach(row => {
        const isLong = (row.value || '').length > 90;
        html += `
          <div class="field-card">
            <label>${humanLabel(row.field)}</label>
            ${isLong
              ? `<textarea data-pc-id="${row.id}">${escapeHtml(row.value)}</textarea>`
              : `<input type="text" data-pc-id="${row.id}" value="${escapeAttr(row.value)}">`}
          </div>`;
      });
    });
    html += `<button class="btn btn-primary" id="savePageText-${pageKey}" data-save-page-text="${pageKey}">Gem tekster</button>
             <span class="field-note" id="pageTextStatus-${pageKey}" style="margin-left:12px"></span>`;
    return html;
  }

  function wirePageText(pageKey) {
    const btn = document.querySelector(`[data-save-page-text="${pageKey}"]`);
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const statusEl = document.getElementById('pageTextStatus-' + pageKey);
      statusEl.textContent = 'Gemmer …';
      const rows = pageContentCache[pageKey] || [];
      try {
        for (const row of rows) {
          const inp = document.querySelector(`[data-pc-id="${row.id}"]`);
          if (!inp) continue;
          if (inp.value !== row.value) {
            await updateRow('page_content', row.id, { value: inp.value });
          }
        }
        statusEl.textContent = 'Gemt ✓ (' + new Date().toLocaleTimeString('da-DK') + ')';
        toast('Tekster gemt.');
      } catch (e) {
        statusEl.textContent = '';
        toast('Kunne ikke gemme: ' + e.message, 'error');
      }
    });
  }

  // ---------------- SEO ----------------
  async function renderSeoSection() {
    const { data, error } = await sb().from('seo_metadata').select('*').order('page');
    if (error) throw error;
    if (!data || !data.length) return '<p class="section-sub">Ingen SEO-data fundet. Kør seed-filen.</p>';
    return `
      <p class="section-sub">Title og meta-beskrivelse pr. side. Adskilt fra almindelige sidetekster.</p>
      ${data.map(row => `
        <div class="field-card" data-seo-id="${row.id}">
          <label>${humanLabel(row.page)} — Title</label>
          <input type="text" data-seof="title" value="${escapeAttr(row.title)}">
          <label style="margin-top:12px">Meta-beskrivelse</label>
          <textarea data-seof="meta_description">${escapeHtml(row.meta_description)}</textarea>
          <button class="btn btn-outline btn-sm" style="margin-top:10px" data-seo-save="${row.id}">Gem</button>
        </div>
      `).join('')}
    `;
  }

  function wireSeo() {
    document.querySelectorAll('[data-seo-save]').forEach(btn => btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-seo-save');
      const card = document.querySelector(`[data-seo-id="${id}"]`);
      const patch = {};
      card.querySelectorAll('[data-seof]').forEach(inp => { patch[inp.getAttribute('data-seof')] = inp.value; });
      try {
        await updateRow('seo_metadata', id, patch);
        toast('SEO gemt.');
      } catch (e) { toast('Kunne ikke gemme: ' + e.message, 'error'); }
    }));
  }

  // ---------------- Indstillinger ----------------
  async function renderSettingsSection() {
    return await renderPageTextSectionForKey('settings');
  }

  async function renderPageTextSectionForKey(pageKey) {
    return await renderPageTextSection(pageKey);
  }

  // ---------------- Navigation / boot ----------------
  const SECTION_RENDERERS = {
    dashboard: renderDashboard,
    cases: renderCasesSection,
    foredrag: renderForedragSection,
    testimonials: renderTestimonialsSection,
    seo: renderSeoSection,
    settings: renderSettingsSection
  };
  const SECTION_WIRERS = {
    cases: wireCases,
    foredrag: wireForedrag,
    testimonials: wireTestimonials,
    seo: wireSeo,
    settings: () => wirePageText('settings')
  };

  function navItems() {
    return [{ key: 'dashboard', label: 'Dashboard' }]
      .concat(PAGES.map(p => ({ key: p.key, label: p.label, isPage: true })))
      .concat([
        { key: 'foredrag', label: 'Foredrag (indhold)' },
        { key: 'cases', label: 'Cases (indhold)' },
        { key: 'testimonials', label: 'Testimonials' },
        { key: 'seo', label: 'SEO' },
        { key: 'settings', label: 'Indstillinger' }
      ]);
  }

  async function renderSection(key, isPage) {
    try {
      if (isPage) return await renderPageTextSection(key);
      if (SECTION_RENDERERS[key]) return await SECTION_RENDERERS[key]();
      return '<p class="section-sub">Ukendt sektion.</p>';
    } catch (e) {
      return `<p class="section-sub" style="color:#b23b3b">Kunne ikke hente data: ${escapeHtml(e.message)}</p>`;
    }
  }

  async function refreshSection(key, isPage) {
    const container = document.getElementById('section-' + key);
    if (!container) return;
    container.innerHTML = `<h2>${container.querySelector('h2') ? container.querySelector('h2').textContent : ''}</h2>` + await renderSection(key, isPage);
    if (isPage) wirePageText(key);
    else if (SECTION_WIRERS[key]) SECTION_WIRERS[key]();
  }

  function renderNav() {
    const nav = document.getElementById('adminNav');
    const items = navItems();
    nav.innerHTML = items.map((s, i) =>
      `<button data-section-btn="${s.key}" data-is-page="${!!s.isPage}" class="${i === 0 ? 'active' : ''}">${s.label}</button>`
    ).join('');
    nav.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        nav.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-section-btn');
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById('section-' + key).classList.add('active');
      });
    });
  }

  async function renderAllSections() {
    const container = document.getElementById('sectionsContainer');
    const items = navItems();
    container.innerHTML = items.map((s, i) => `<div class="admin-section ${i === 0 ? 'active' : ''}" id="section-${s.key}"><h2>${s.label}</h2><div class="loading-row">Indlæser …</div></div>`).join('');

    for (const s of items) {
      const html = await renderSection(s.key, s.isPage);
      const sectionEl = document.getElementById('section-' + s.key);
      sectionEl.innerHTML = `<h2>${s.label}</h2>` + html;
      if (s.isPage) wirePageText(s.key);
      else if (SECTION_WIRERS[s.key]) SECTION_WIRERS[s.key]();
    }
  }

  async function boot() {
    renderNav();
    await renderAllSections();
  }

  // ---------------- Wire up login screen ----------------
  document.getElementById('loginSubmit').addEventListener('click', login);
  document.getElementById('passwordInput').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
  document.getElementById('emailInput').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
  document.getElementById('forgotPasswordLink').addEventListener('click', () => showLoginBox('forgot'));
  document.getElementById('backToLoginLink').addEventListener('click', () => showLoginBox('login'));
  document.getElementById('forgotSubmit').addEventListener('click', requestPasswordReset);
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('notAdminLogoutBtn').addEventListener('click', logout);

  // ---------------- Session check on load ----------------
  (async function initialLoad() {
    if (!window.MFGSupabase) {
      document.getElementById('loginError').textContent = 'Supabase er ikke konfigureret endnu — se README-admin.md.';
      return;
    }
    const { data } = await window.MFGSupabase.auth.getSession();
    if (data && data.session && data.session.user) {
      await afterAuthResolved(data.session.user);
    }
    window.MFGSupabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        document.getElementById('adminApp').classList.remove('visible');
        document.getElementById('loginScreen').style.display = 'flex';
        showLoginBox('login');
      }
    });
  })();
})();
