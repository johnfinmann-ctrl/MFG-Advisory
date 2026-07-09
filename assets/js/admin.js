/* =========================================================================
   MFG Advisory — Admin Panel logic
   =========================================================================
   How field discovery works:
   Rather than hand-maintaining a duplicate list of every editable field
   (which would drift out of sync with the real pages), this script fetches
   each public HTML page, parses it, and reads every [data-edit] /
   [data-edit-href] element directly from the real markup. That list *is*
   the source of truth — if a data-edit attribute exists on the site, it
   automatically appears here; nothing more needs to be maintained by hand.

   Cases and Testimonials are richer, repeatable content (title, industry,
   challenge/solution/result, image, linked Compass direction) and are
   managed as JSON arrays under the "cases" / "testimonials" keys, edited
   here with add/remove row UIs — the same pattern as the simple fields,
   just one level deeper.
   ========================================================================= */

(function () {
  const PAGES = [
    { file: 'index.html', section: 'home', label: 'Forside' },
    { file: 'mennesker.html', section: 'mennesker', label: 'Mennesker' },
    { file: 'ledelse.html', section: 'ledelse', label: 'Ledelse' },
    { file: 'kultur.html', section: 'kultur', label: 'Kultur' },
    { file: 'forretning.html', section: 'forretning', label: 'Forretning' },
    { file: 'cases.html', section: 'cases', label: 'Cases' },
    { file: 'om-morten.html', section: 'om', label: 'Om Morten' },
    { file: 'kontakt.html', section: 'kontakt', label: 'Kontakt' }
  ];

  const GLOBAL_KEYS = ['contact-phone', 'contact-email', 'footer-cvr', 'footer-copyright', 'social-linkedin'];
  const COMPASS_KEYS_PREFIX = ['compass-', 'teaser-'];

  const NAV_ORDER = [
    { section: 'dashboard', label: 'Dashboard' },
    { section: 'home', label: 'Forside' },
    { section: 'kompasset', label: 'Kompasset' },
    { section: 'mennesker', label: 'Mennesker' },
    { section: 'ledelse', label: 'Ledelse' },
    { section: 'kultur', label: 'Kultur' },
    { section: 'forretning', label: 'Forretning' },
    { section: 'cases', label: 'Cases' },
    { section: 'testimonials', label: 'Testimonials' },
    { section: 'om', label: 'Om Morten' },
    { section: 'kontakt', label: 'Kontakt' },
    { section: 'seo', label: 'SEO' },
    { section: 'settings', label: 'Indstillinger' }
  ];

  const DIRECTIONS = [
    { value: 'mennesker', label: 'Mennesker' },
    { value: 'ledelse', label: 'Ledelse' },
    { value: 'kultur', label: 'Kultur' },
    { value: 'forretning', label: 'Forretning' }
  ];

  let fieldsBySection = {};
  let savedContent = {};

  // ---------------- Auth ----------------
  async function sha256Hex(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function checkPin(pin) {
    const stored = savedContent['admin-pin-hash'];
    if (!stored) return pin === 'mfg2026';
    return (await sha256Hex(pin)) === stored;
  }

  async function setPin(newPin) {
    const hash = await sha256Hex(newPin);
    await window.MFGStore.setMany({ 'admin-pin-hash': hash });
    savedContent['admin-pin-hash'] = hash;
  }

  function showApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').classList.add('visible');
    sessionStorage.setItem('mfg_admin_authed', '1');
  }

  // ---------------- Helpers ----------------
  function escapeHtml(s) { return (s || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
  function escapeAttr(s) { return (s || '').replace(/"/g, '&quot;'); }

  function humanLabel(key) {
    return key.replace(/^seo-/, 'SEO — ').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function jsonArray(key, fallback) {
    const raw = savedContent[key];
    if (!raw) return fallback || [];
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : (fallback || []);
    } catch (e) { return fallback || []; }
  }

  // ---------------- Field discovery ----------------
  function fieldTypeFor(tag, text) {
    if (tag === 'img') return 'image';
    if ((text || '').length > 70) return 'textarea';
    return 'text';
  }

  async function discoverFields() {
    fieldsBySection = {};
    PAGES.forEach(p => { fieldsBySection[p.section] = []; });
    fieldsBySection.global = [];
    fieldsBySection.seo = [];
    fieldsBySection.kompasset = [];

    const seen = new Set();

    for (const page of PAGES) {
      let html;
      try {
        html = await fetch(page.file).then(r => r.text());
      } catch (e) {
        console.warn('Admin: could not fetch', page.file, e);
        continue;
      }
      const doc = new DOMParser().parseFromString(html, 'text/html');

      doc.querySelectorAll('[data-edit]').forEach(el => {
        const key = el.getAttribute('data-edit');
        if (seen.has(key)) return;
        seen.add(key);

        const tag = el.tagName.toLowerCase();
        const defaultValue = tag === 'img' ? el.getAttribute('src')
          : tag === 'meta' ? el.getAttribute('content')
          : el.textContent.trim();

        const field = { key, label: humanLabel(key), type: fieldTypeFor(tag, defaultValue), defaultValue, tag };

        if (GLOBAL_KEYS.includes(key)) {
          fieldsBySection.global.push(field);
        } else if (key.startsWith('seo-')) {
          field.type = key.endsWith('description') ? 'textarea' : 'text';
          fieldsBySection.seo.push(field);
        } else if (COMPASS_KEYS_PREFIX.some(p => key.startsWith(p)) && page.section === 'home') {
          fieldsBySection.kompasset.push(field);
        } else {
          fieldsBySection[page.section].push(field);
        }
      });

      doc.querySelectorAll('[data-edit-href]').forEach(el => {
        const key = el.getAttribute('data-edit-href');
        if (seen.has(key)) return;
        seen.add(key);
        fieldsBySection.global.push({ key, label: humanLabel(key), type: 'text', defaultValue: el.getAttribute('href'), tag: 'a-href' });
      });
    }
  }

  // ---------------- Simple field rendering ----------------
  function fieldValue(field) {
    return Object.prototype.hasOwnProperty.call(savedContent, field.key) ? savedContent[field.key] : field.defaultValue;
  }

  function renderImageField(field) {
    const val = fieldValue(field);
    return `
      <div class="field-card">
        <label>${field.label} <span class="field-key">${field.key}</span></label>
        <div class="img-field">
          <img src="${val}" alt="">
          <div class="img-controls">
            <input type="file" accept="image/*" data-image-key="${field.key}">
            <div class="field-note">Nyt billede erstatter det nuværende med det samme efter "Gem ændringer".</div>
          </div>
        </div>
      </div>`;
  }

  function renderTextField(field) {
    const val = fieldValue(field);
    if (field.type === 'textarea') {
      return `
        <div class="field-card">
          <label>${field.label} <span class="field-key">${field.key}</span></label>
          <textarea data-field-key="${field.key}">${escapeHtml(val)}</textarea>
        </div>`;
    }
    return `
      <div class="field-card">
        <label>${field.label} <span class="field-key">${field.key}</span></label>
        <input type="text" data-field-key="${field.key}" value="${escapeAttr(val)}">
      </div>`;
  }

  function renderSimpleFields(fields) {
    return fields.map(f => f.type === 'image' ? renderImageField(f) : renderTextField(f)).join('');
  }

  function saveBar(section, label) {
    return `
      <div class="save-bar">
        <span class="save-status" id="saveStatus-${section}"></span>
        <button class="btn btn-primary" data-save-section="${section}">${label || 'Gem ændringer'}</button>
      </div>`;
  }

  // ---------------- Dashboard ----------------
  function renderDashboard() {
    const cases = jsonArray('cases');
    const testimonials = jsonArray('testimonials');
    const backend = window.MFGStore.backend();
    return `
      <p class="section-sub">Overblik over hjemmesidens indhold.</p>
      <div class="field-card">
        <label>Lagring</label>
        <p>${backend === 'supabase' ? 'Supabase (delt på tværs af enheder)' : 'LocalStorage (kun denne browser/enhed)'}</p>
      </div>
      <div class="field-card">
        <label>Indhold</label>
        <p>${cases.length} ekstra case(s) · ${testimonials.length} testimonial(s) oprettet i adminpanelet.</p>
      </div>
      <div class="field-card">
        <label>Genveje</label>
        <p><a href="index.html" target="_blank" rel="noopener">Se forsiden ↗</a> &nbsp;·&nbsp;
        <a href="cases.html" target="_blank" rel="noopener">Se Cases-siden ↗</a> &nbsp;·&nbsp;
        <a href="kontakt.html" target="_blank" rel="noopener">Se Kontakt-siden ↗</a></p>
      </div>
    `;
  }

  // ---------------- Cases (rich CRUD) ----------------
  function renderCasesSection() {
    const simple = fieldsBySection.cases || [];
    let html = `<p class="section-sub">Faste tekster på Cases-siden, samt cases I selv opretter (uden kode).</p>`;
    html += renderSimpleFields(simple);
    html += saveBar('cases-simple', 'Gem tekster');

    html += `<h3 style="margin:32px 0 6px">Cases (oprettet i admin)</h3>
      <p class="section-sub">Vises automatisk nederst på Cases-siden.</p>
      <div id="casesList">${renderCaseRows(jsonArray('cases'))}</div>
      <button class="btn btn-outline btn-sm" id="addCaseBtn">+ Tilføj case</button>
      ${saveBar('cases-list', 'Gem cases')}`;
    return html;
  }

  function directionOptions(selected) {
    return DIRECTIONS.map(d => `<option value="${d.value}" ${d.value === selected ? 'selected' : ''}>${d.label}</option>`).join('');
  }

  function renderCaseRows(items) {
    if (items.length === 0) return `<p class="section-sub">Ingen cases oprettet endnu.</p>`;
    return items.map((c, i) => `
      <div class="testi-card" data-case-index="${i}">
        <button class="btn btn-danger btn-sm testi-remove" data-remove-case="${i}">Fjern</button>
        <div class="testi-row">
          <div>
            <label>Titel</label>
            <input type="text" data-case-field="title" data-case-index="${i}" value="${escapeAttr(c.title || '')}">
          </div>
          <div>
            <label>Branche</label>
            <input type="text" data-case-field="industry" data-case-index="${i}" value="${escapeAttr(c.industry || '')}">
          </div>
          <div>
            <label>Tilknyttet Compass-retning</label>
            <select data-case-field="direction" data-case-index="${i}">${directionOptions(c.direction)}</select>
          </div>
          <div>
            <label>Billede</label>
            <input type="file" accept="image/*" data-case-image="${i}">
          </div>
          <div class="full">
            <label>Udfordring</label>
            <textarea data-case-field="challenge" data-case-index="${i}">${escapeHtml(c.challenge || '')}</textarea>
          </div>
          <div class="full">
            <label>Løsning</label>
            <textarea data-case-field="solution" data-case-index="${i}">${escapeHtml(c.solution || '')}</textarea>
          </div>
          <div class="full">
            <label>Resultat</label>
            <textarea data-case-field="result" data-case-index="${i}">${escapeHtml(c.result || '')}</textarea>
          </div>
        </div>
      </div>`).join('');
  }

  function collectCasesFromDOM() {
    const items = jsonArray('cases');
    document.querySelectorAll('#casesList .testi-card').forEach(card => {
      const idx = parseInt(card.getAttribute('data-case-index'), 10);
      const item = items[idx] || {};
      card.querySelectorAll('[data-case-field]').forEach(inp => {
        item[inp.getAttribute('data-case-field')] = inp.value.trim();
      });
      items[idx] = item;
    });
    return items;
  }

  // ---------------- Testimonials (rich CRUD) ----------------
  function renderTestimonialsSection() {
    let html = `
      <div class="banner">Testimonials vises automatisk nederst på Cases-siden, når mindst én er oprettet.</div>
      <div id="testimonialsList">${renderTestimonialRows(jsonArray('testimonials'))}</div>
      <button class="btn btn-outline btn-sm" id="addTestiBtn">+ Tilføj testimonial</button>
      ${saveBar('testimonials', 'Gem testimonials')}`;
    return html;
  }

  function renderTestimonialRows(items) {
    if (items.length === 0) return `<p class="section-sub">Ingen testimonials oprettet endnu.</p>`;
    return items.map((t, i) => `
      <div class="testi-card" data-testi-index="${i}">
        <button class="btn btn-danger btn-sm testi-remove" data-remove-testi="${i}">Fjern</button>
        <div class="testi-row">
          <div>
            <label>Navn</label>
            <input type="text" data-testi-field="name" data-testi-index="${i}" value="${escapeAttr(t.name || '')}">
          </div>
          <div>
            <label>Titel / virksomhed</label>
            <input type="text" data-testi-field="role" data-testi-index="${i}" value="${escapeAttr(t.role || '')}">
          </div>
          <div>
            <label>Tilknyttet Compass-retning</label>
            <select data-testi-field="direction" data-testi-index="${i}">${directionOptions(t.direction)}</select>
          </div>
          <div>
            <label>Billede / logo</label>
            <input type="file" accept="image/*" data-testi-image="${i}">
          </div>
          <div class="full">
            <label>Citat</label>
            <textarea data-testi-field="quote" data-testi-index="${i}">${escapeHtml(t.quote || '')}</textarea>
          </div>
        </div>
      </div>`).join('');
  }

  function collectTestimonialsFromDOM() {
    const items = jsonArray('testimonials');
    document.querySelectorAll('#testimonialsList .testi-card').forEach(card => {
      const idx = parseInt(card.getAttribute('data-testi-index'), 10);
      const item = items[idx] || {};
      card.querySelectorAll('[data-testi-field]').forEach(inp => {
        item[inp.getAttribute('data-testi-field')] = inp.value.trim();
      });
      items[idx] = item;
    });
    return items;
  }

  // ---------------- Om Morten: competencies / certifications ----------------
  function renderCredListEditor(key, title) {
    const items = jsonArray(key);
    let html = `<div class="field-card"><label>${title}</label>`;
    html += `<div id="credList-${key}">`;
    items.forEach((v, i) => {
      html += `<div style="display:flex;gap:8px;margin-bottom:8px">
        <input type="text" data-cred-key="${key}" data-cred-index="${i}" value="${escapeAttr(v)}" style="flex:1">
        <button class="btn btn-danger btn-sm" data-remove-cred="${key}:${i}">Fjern</button>
      </div>`;
    });
    html += `</div>
      <button class="btn btn-outline btn-sm" data-add-cred="${key}">+ Tilføj</button>
    </div>`;
    return html;
  }

  function collectCredListFromDOM(key) {
    const items = [];
    document.querySelectorAll(`[data-cred-key="${key}"]`).forEach(inp => {
      if (inp.value.trim()) items.push(inp.value.trim());
    });
    return items;
  }

  // ---------------- Om Morten section (simple fields + cred lists) ----------------
  function renderOmSection() {
    let html = renderSimpleFields(fieldsBySection.om || []);
    html += renderCredListEditor('om-competencies', 'Kompetencer');
    html += renderCredListEditor('om-certifications', 'Certificeringer');
    html += saveBar('om', 'Gem ændringer');
    return html;
  }

  // ---------------- Settings ----------------
  function renderSettingsSection() {
    const backend = window.MFGStore.backend();
    const formEndpoint = savedContent['config-form-endpoint'] || '';
    const analyticsProvider = savedContent['config-analytics-provider'] || 'none';
    const analyticsId = savedContent['config-analytics-id'] || '';

    return `
      <div class="banner">
        Aktiv lagring: <strong>${backend === 'supabase' ? 'Supabase' : 'LocalStorage (kun denne enhed)'}</strong>.
        Udfyld <code>assets/js/supabase-config.js</code> for at slå Supabase til.
      </div>

      <div class="field-card">
        <label>Kontaktformular — mailservice-endpoint</label>
        <p class="field-note" style="margin-bottom:10px">
          Indsæt dit Formspree- eller Resend-endpoint (fx <code>https://formspree.io/f/xxxxabcd</code>).
          Er feltet tomt, bruger formularen fortsat den nuværende mailto-løsning.
        </p>
        <input type="text" id="formEndpointInput" placeholder="https://formspree.io/f/xxxxabcd" value="${escapeAttr(formEndpoint)}">
        <button class="btn btn-outline btn-sm" id="saveFormEndpointBtn" style="margin-top:10px">Gem endpoint</button>
      </div>

      <div class="field-card">
        <label>Analytics</label>
        <p class="field-note" style="margin-bottom:10px">Vælg udbyder og indsæt dit Site-ID / Measurement-ID. Indlæses først, når en besøgende har accepteret analytics-cookies.</p>
        <select id="analyticsProviderSelect" style="margin-bottom:10px">
          <option value="none" ${analyticsProvider === 'none' ? 'selected' : ''}>Ingen</option>
          <option value="plausible" ${analyticsProvider === 'plausible' ? 'selected' : ''}>Plausible</option>
          <option value="ga" ${analyticsProvider === 'ga' ? 'selected' : ''}>Google Analytics</option>
        </select>
        <input type="text" id="analyticsIdInput" placeholder="fx mfgadvisory.dk eller G-XXXXXXX" value="${escapeAttr(analyticsId)}">
        <button class="btn btn-outline btn-sm" id="saveAnalyticsBtn" style="margin-top:10px">Gem analytics-indstillinger</button>
      </div>

      <div class="field-card">
        <label>Skift admin-kode</label>
        <input type="password" id="newPin1" placeholder="Ny kode" style="margin-bottom:8px">
        <input type="password" id="newPin2" placeholder="Gentag ny kode">
        <div class="field-note" id="pinChangeMsg"></div>
        <button class="btn btn-outline btn-sm" id="changePinBtn" style="margin-top:10px">Gem ny kode</button>
      </div>

      <div class="field-card">
        <label>Backup</label>
        <p class="field-note" style="margin-bottom:10px">Eksportér alt gemt indhold som en JSON-fil, eller genindlæs en tidligere eksport.</p>
        <button class="btn btn-outline btn-sm" id="exportBtn">Eksportér JSON</button>
        <input type="file" id="importFile" accept="application/json" style="display:none">
        <button class="btn btn-outline btn-sm" id="importBtn">Importér JSON</button>
      </div>

      <div class="field-card">
        <label>Nulstil</label>
        <p class="field-note" style="margin-bottom:10px">Fjerner alle gemte ændringer og viser hjemmesidens oprindelige standardtekster igen.</p>
        <button class="btn btn-danger btn-sm" id="resetBtn">Nulstil alt indhold</button>
      </div>
    `;
  }

  // ---------------- Section dispatch ----------------
  function renderSection(section, label) {
    if (section === 'dashboard') return `<h2>${label}</h2>` + renderDashboard();
    if (section === 'cases') return `<h2>${label}</h2>` + renderCasesSection();
    if (section === 'testimonials') return `<h2>${label}</h2>` + renderTestimonialsSection();
    if (section === 'om') return `<h2>${label}</h2>` + renderOmSection();
    if (section === 'settings') return `<h2>${label}</h2>` + renderSettingsSection();

    let html = `<h2>${label}</h2>`;
    if (section === 'home') html += `<p class="section-sub">Hero-tekst og forsidens afsluttende CTA.</p>`;
    if (section === 'kompasset') html += `<p class="section-sub">Compass-tekster og de fire retningers korte intro på forsiden.</p>`;
    if (section === 'seo') html += `<p class="section-sub">Titel og meta-beskrivelse for hver side (vises i Google og faneblade).</p>`;
    if (section === 'global') html += `<p class="section-sub">Telefon, e-mail, CVR og LinkedIn — bruges automatisk alle steder på hjemmesiden.</p>`;

    const fields = fieldsBySection[section] || [];
    if (fields.length === 0) html += `<p class="section-sub">Ingen felter fundet.</p>`;
    html += renderSimpleFields(fields);
    html += saveBar(section);
    return html;
  }

  // ---------------- Save logic ----------------
  async function saveSection(section, btn) {
    const statusEl = document.getElementById('saveStatus-' + section);
    btn.disabled = true;
    const originalLabel = btn.textContent;
    btn.textContent = 'Gemmer …';

    try {
      if (section === 'testimonials') {
        const items = collectTestimonialsFromDOM();
        for (const inp of Array.from(document.querySelectorAll('[data-testi-image]'))) {
          if (inp.files && inp.files[0]) {
            const idx = parseInt(inp.getAttribute('data-testi-image'), 10);
            items[idx].image = await window.MFGStore.uploadImage(inp.files[0]);
          }
        }
        await window.MFGStore.setMany({ testimonials: JSON.stringify(items) });
        savedContent['testimonials'] = JSON.stringify(items);
        document.getElementById('section-testimonials').innerHTML = renderSection('testimonials', 'Testimonials');
        wireDynamicSections();
      } else if (section === 'cases-list') {
        const items = collectCasesFromDOM();
        for (const inp of Array.from(document.querySelectorAll('[data-case-image]'))) {
          if (inp.files && inp.files[0]) {
            const idx = parseInt(inp.getAttribute('data-case-image'), 10);
            items[idx].image = await window.MFGStore.uploadImage(inp.files[0]);
          }
        }
        await window.MFGStore.setMany({ cases: JSON.stringify(items) });
        savedContent['cases'] = JSON.stringify(items);
        document.getElementById('section-cases').innerHTML = renderSection('cases', 'Cases');
        wireDynamicSections();
      } else if (section === 'om') {
        const updates = {};
        document.querySelectorAll('#section-om [data-field-key]').forEach(inp => { updates[inp.getAttribute('data-field-key')] = inp.value; });
        const imgInputs = document.querySelectorAll('#section-om [data-image-key]');
        for (const inp of imgInputs) {
          if (inp.files && inp.files[0]) updates[inp.getAttribute('data-image-key')] = await window.MFGStore.uploadImage(inp.files[0]);
        }
        updates['om-competencies'] = JSON.stringify(collectCredListFromDOM('om-competencies'));
        updates['om-certifications'] = JSON.stringify(collectCredListFromDOM('om-certifications'));
        await window.MFGStore.setMany(updates);
        Object.assign(savedContent, updates);
      } else {
        const sectionKey = section === 'cases-simple' ? 'cases' : section;
        const container = document.getElementById('section-' + sectionKey) || document.querySelector(`[data-save-section="${section}"]`).closest('.admin-section');
        const updates = {};
        container.querySelectorAll('[data-field-key]').forEach(inp => { updates[inp.getAttribute('data-field-key')] = inp.value; });
        const imageInputs = container.querySelectorAll('[data-image-key]');
        for (const inp of imageInputs) {
          if (inp.files && inp.files[0]) updates[inp.getAttribute('data-image-key')] = await window.MFGStore.uploadImage(inp.files[0]);
        }
        await window.MFGStore.setMany(updates);
        Object.assign(savedContent, updates);
      }

      // Re-query the status element: for cases/testimonials/om we just replaced
      // the section's innerHTML above, which detaches the original statusEl.
      const freshStatusEl = document.getElementById('saveStatus-' + section) || statusEl;
      if (freshStatusEl) {
        freshStatusEl.textContent = 'Gemt ✓';
        freshStatusEl.style.color = '';
        setTimeout(() => { freshStatusEl.textContent = ''; }, 3000);
      }
    } catch (e) {
      console.error(e);
      const freshStatusEl = document.getElementById('saveStatus-' + section) || statusEl;
      if (freshStatusEl) { freshStatusEl.textContent = 'Fejl ved gem — se konsollen.'; freshStatusEl.style.color = '#b3402f'; }
    } finally {
      const freshBtn = document.querySelector(`[data-save-section="${section}"]`);
      if (freshBtn) { freshBtn.disabled = false; freshBtn.textContent = originalLabel; }
    }
  }

  // ---------------- Dynamic list wiring (cases / testimonials / cred lists) ----------------
  function wireDynamicSections() {
    const addCaseBtn = document.getElementById('addCaseBtn');
    if (addCaseBtn) {
      addCaseBtn.addEventListener('click', () => {
        const items = jsonArray('cases');
        items.push({ title: '', industry: '', challenge: '', solution: '', result: '', direction: 'mennesker', image: '' });
        savedContent['cases'] = JSON.stringify(items);
        document.getElementById('section-cases').innerHTML = renderSection('cases', 'Cases');
        wireDynamicSections();
      });
    }
    document.querySelectorAll('[data-remove-case]').forEach(btn => {
      btn.addEventListener('click', () => {
        const items = jsonArray('cases');
        items.splice(parseInt(btn.getAttribute('data-remove-case'), 10), 1);
        savedContent['cases'] = JSON.stringify(items);
        document.getElementById('section-cases').innerHTML = renderSection('cases', 'Cases');
        wireDynamicSections();
      });
    });

    const addTestiBtn = document.getElementById('addTestiBtn');
    if (addTestiBtn) {
      addTestiBtn.addEventListener('click', () => {
        const items = jsonArray('testimonials');
        items.push({ name: '', role: '', quote: '', direction: 'mennesker', image: '' });
        savedContent['testimonials'] = JSON.stringify(items);
        document.getElementById('section-testimonials').innerHTML = renderSection('testimonials', 'Testimonials');
        wireDynamicSections();
      });
    }
    document.querySelectorAll('[data-remove-testi]').forEach(btn => {
      btn.addEventListener('click', () => {
        const items = jsonArray('testimonials');
        items.splice(parseInt(btn.getAttribute('data-remove-testi'), 10), 1);
        savedContent['testimonials'] = JSON.stringify(items);
        document.getElementById('section-testimonials').innerHTML = renderSection('testimonials', 'Testimonials');
        wireDynamicSections();
      });
    });

    document.querySelectorAll('[data-add-cred]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-add-cred');
        const items = collectCredListFromDOM(key);
        items.push('');
        savedContent[key] = JSON.stringify(items);
        document.getElementById('section-om').innerHTML = renderSection('om', 'Om Morten');
        wireDynamicSections();
      });
    });
    document.querySelectorAll('[data-remove-cred]').forEach(btn => {
      btn.addEventListener('click', () => {
        const [key, idxStr] = btn.getAttribute('data-remove-cred').split(':');
        const items = collectCredListFromDOM(key);
        items.splice(parseInt(idxStr, 10), 1);
        savedContent[key] = JSON.stringify(items);
        document.getElementById('section-om').innerHTML = renderSection('om', 'Om Morten');
        wireDynamicSections();
      });
    });

    wireSaveButtons();
    wireImagePreviews();
  }

  function wireSaveButtons() {
    document.querySelectorAll('[data-save-section]').forEach(btn => {
      const clone = btn.cloneNode(true);
      btn.replaceWith(clone);
    });
    document.querySelectorAll('[data-save-section]').forEach(btn => {
      btn.addEventListener('click', () => saveSection(btn.getAttribute('data-save-section'), btn));
    });
  }

  function wireImagePreviews() {
    document.querySelectorAll('[data-image-key]').forEach(inp => {
      inp.addEventListener('change', () => {
        if (inp.files && inp.files[0]) {
          const reader = new FileReader();
          reader.onload = () => { inp.closest('.img-field').querySelector('img').src = reader.result; };
          reader.readAsDataURL(inp.files[0]);
        }
      });
    });
  }

  // ---------------- Settings actions ----------------
  function wireSettings() {
    const changePinBtn = document.getElementById('changePinBtn');
    if (changePinBtn) {
      changePinBtn.addEventListener('click', async () => {
        const p1 = document.getElementById('newPin1').value;
        const p2 = document.getElementById('newPin2').value;
        const msg = document.getElementById('pinChangeMsg');
        if (p1.length < 4) { msg.textContent = 'Koden skal være mindst 4 tegn.'; msg.style.color = '#b3402f'; return; }
        if (p1 !== p2) { msg.textContent = 'De to koder er ikke ens.'; msg.style.color = '#b3402f'; return; }
        await setPin(p1);
        msg.textContent = 'Ny kode gemt.'; msg.style.color = '#2e7d4f';
        document.getElementById('newPin1').value = '';
        document.getElementById('newPin2').value = '';
      });
    }

    const saveFormEndpointBtn = document.getElementById('saveFormEndpointBtn');
    if (saveFormEndpointBtn) {
      saveFormEndpointBtn.addEventListener('click', async () => {
        const val = document.getElementById('formEndpointInput').value.trim();
        await window.MFGStore.setMany({ 'config-form-endpoint': val });
        savedContent['config-form-endpoint'] = val;
        saveFormEndpointBtn.textContent = 'Gemt ✓';
        setTimeout(() => { saveFormEndpointBtn.textContent = 'Gem endpoint'; }, 2000);
      });
    }

    const saveAnalyticsBtn = document.getElementById('saveAnalyticsBtn');
    if (saveAnalyticsBtn) {
      saveAnalyticsBtn.addEventListener('click', async () => {
        const provider = document.getElementById('analyticsProviderSelect').value;
        const id = document.getElementById('analyticsIdInput').value.trim();
        await window.MFGStore.setMany({ 'config-analytics-provider': provider, 'config-analytics-id': id });
        savedContent['config-analytics-provider'] = provider;
        savedContent['config-analytics-id'] = id;
        saveAnalyticsBtn.textContent = 'Gemt ✓';
        setTimeout(() => { saveAnalyticsBtn.textContent = 'Gem analytics-indstillinger'; }, 2000);
      });
    }

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        const all = await window.MFGStore.getAll();
        const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'mfg-advisory-content-backup.json';
        a.click();
      });
    }

    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    if (importBtn) {
      importBtn.addEventListener('click', () => importFile.click());
      importFile.addEventListener('change', async () => {
        const file = importFile.files[0];
        if (!file) return;
        const text = await file.text();
        try {
          const obj = JSON.parse(text);
          await window.MFGStore.setMany(obj);
          alert('Indhold importeret. Siden genindlæses.');
          location.reload();
        } catch (e) {
          alert('Kunne ikke læse filen som gyldig JSON.');
        }
      });
    }

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (!confirm('Er du sikker? Alle gemte ændringer fjernes, og hjemmesiden viser igen standardteksterne.')) return;
        await window.MFGStore.resetAll();
        alert('Nulstillet. Siden genindlæses.');
        location.reload();
      });
    }
  }

  // ---------------- Navigation & layout ----------------
  function renderNav() {
    const nav = document.getElementById('adminNav');
    nav.innerHTML = NAV_ORDER.map((s, i) =>
      `<button data-section-btn="${s.section}" class="${i === 0 ? 'active' : ''}">${s.label}</button>`
    ).join('');

    nav.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        nav.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById('section-' + btn.getAttribute('data-section-btn')).classList.add('active');
      });
    });
  }

  function renderAllSections() {
    const container = document.getElementById('sectionsContainer');
    container.innerHTML = NAV_ORDER.map((s, i) =>
      `<div class="admin-section ${i === 0 ? 'active' : ''}" id="section-${s.section}">${renderSection(s.section, s.label)}</div>`
    ).join('');

    wireDynamicSections();
    wireSettings();
  }

  // ---------------- Boot ----------------
  async function boot() {
    document.getElementById('backendPill').textContent =
      window.MFGStore.backend() === 'supabase' ? 'Supabase' : 'LocalStorage (denne enhed)';

    savedContent = await window.MFGStore.getAll();
    await discoverFields();
    renderNav();
    renderAllSections();
  }

  document.getElementById('pinSubmit').addEventListener('click', submitPin);
  document.getElementById('pinInput').addEventListener('keydown', e => { if (e.key === 'Enter') submitPin(); });

  async function submitPin() {
    const pin = document.getElementById('pinInput').value;
    const errEl = document.getElementById('loginError');
    errEl.textContent = 'Tjekker …';
    if (!savedContent || Object.keys(savedContent).length === 0) {
      savedContent = await window.MFGStore.getAll();
    }
    const ok = await checkPin(pin);
    if (ok) {
      errEl.textContent = '';
      showApp();
      boot();
    } else {
      errEl.textContent = 'Forkert kode.';
    }
  }

  (async function initialLoad() {
    savedContent = await window.MFGStore.getAll();
    if (sessionStorage.getItem('mfg_admin_authed') === '1') {
      showApp();
      boot();
    }
  })();

  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('mfg_admin_authed');
    location.reload();
  });
})();
