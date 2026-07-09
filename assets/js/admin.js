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

  const EXTRA_SECTIONS = [
    { section: 'global', label: 'Globalt / Kontakt' },
    { section: 'seo', label: 'SEO-data' },
    { section: 'testimonials', label: 'Testimonials' },
    { section: 'settings', label: 'Indstillinger' }
  ];

  let fieldsBySection = {}; // section -> [ {key, label, type, defaultValue, tag} ]
  let savedContent = {};    // key -> saved value (from store)
  let dirty = {};           // key -> new value pending save

  // ---------------- Auth ----------------
  async function sha256Hex(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function checkPin(pin) {
    const stored = savedContent['admin-pin-hash'];
    if (!stored) {
      return pin === 'mfg2026'; // first-run default
    }
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

  // ---------------- Field discovery ----------------
  function fieldTypeFor(tag, text) {
    if (tag === 'img') return 'image';
    if ((text || '').length > 70) return 'textarea';
    return 'text';
  }

  function humanLabel(key) {
    return key
      .replace(/^seo-/, 'SEO — ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  async function discoverFields() {
    fieldsBySection = {};
    PAGES.forEach(p => { fieldsBySection[p.section] = []; });
    fieldsBySection.global = [];
    fieldsBySection.seo = [];

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

      const editEls = doc.querySelectorAll('[data-edit]');
      editEls.forEach(el => {
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
        } else {
          fieldsBySection[page.section].push(field);
        }
      });

      const hrefEls = doc.querySelectorAll('[data-edit-href]');
      hrefEls.forEach(el => {
        const key = el.getAttribute('data-edit-href');
        if (seen.has(key)) return;
        seen.add(key);
        const field = { key, label: humanLabel(key), type: 'text', defaultValue: el.getAttribute('href'), tag: 'a-href' };
        fieldsBySection.global.push(field);
      });
    }
  }

  // ---------------- Rendering ----------------
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
    const tagType = field.type === 'textarea' ? 'textarea' : 'input type="text"';
    const closeTag = field.type === 'textarea' ? 'textarea' : 'input';
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

  function escapeHtml(s) { return (s || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
  function escapeAttr(s) { return (s || '').replace(/"/g, '&quot;'); }

  function renderSection(section, label) {
    const fields = fieldsBySection[section] || [];
    let html = `<h2>${label}</h2>`;

    if (section === 'home') html += `<p class="section-sub">Hero, The MFG Compass™-tekster og forsidens afsluttende CTA.</p>`;
    if (section === 'seo') html += `<p class="section-sub">Titel og meta-beskrivelse for hver side (vises i Google og faneblade).</p>`;
    if (section === 'global') html += `<p class="section-sub">Telefon, e-mail, CVR og LinkedIn — bruges automatisk alle steder på hjemmesiden.</p>`;

    if (section === 'testimonials') {
      html += renderTestimonialsSection();
      return html;
    }
    if (section === 'settings') {
      html += renderSettingsSection();
      return html;
    }

    if (fields.length === 0) {
      html += `<p class="section-sub">Ingen felter fundet.</p>`;
    }

    fields.forEach(f => {
      html += f.type === 'image' ? renderImageField(f) : renderTextField(f);
    });

    html += `
      <div class="save-bar">
        <span class="save-status" id="saveStatus-${section}"></span>
        <button class="btn btn-primary" data-save-section="${section}">Gem ændringer</button>
      </div>`;
    return html;
  }

  // ---------------- Testimonials (new content type — not yet displayed on the public site) ----------------
  function getTestimonials() {
    try {
      const raw = savedContent['testimonials'];
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function renderTestimonialsSection() {
    const items = getTestimonials();
    let html = `
      <div class="banner">
        <strong>Bemærk:</strong> Testimonials gemmes og administreres her, men vises endnu ikke på hjemmesiden — det nuværende design har ingen testimonial-sektion.
        Sig til, hvis du vil have en tilføjet (det er en designændring, som denne opgave bevidst ikke laver automatisk).
      </div>
      <div id="testimonialsList">`;
    items.forEach((t, i) => {
      html += `
        <div class="testi-card" data-testi-index="${i}">
          <button class="btn btn-danger btn-sm testi-remove" data-remove-testi="${i}">Fjern</button>
          <div class="testi-row">
            <div>
              <label>Navn</label>
              <input type="text" data-testi-field="name" data-testi-index="${i}" value="${escapeAttr(t.name || '')}">
            </div>
            <div>
              <label>Rolle / virksomhed</label>
              <input type="text" data-testi-field="role" data-testi-index="${i}" value="${escapeAttr(t.role || '')}">
            </div>
            <div>
              <label>Citat</label>
              <textarea data-testi-field="quote" data-testi-index="${i}">${escapeHtml(t.quote || '')}</textarea>
            </div>
          </div>
        </div>`;
    });
    html += `</div>
      <button class="btn btn-outline btn-sm" id="addTestiBtn">+ Tilføj testimonial</button>
      <div class="save-bar">
        <span class="save-status" id="saveStatus-testimonials"></span>
        <button class="btn btn-primary" data-save-section="testimonials">Gem testimonials</button>
      </div>`;
    return html;
  }

  // ---------------- Settings ----------------
  function renderSettingsSection() {
    const backend = window.MFGStore.backend();
    return `
      <div class="banner">
        Aktiv lagring: <strong>${backend === 'supabase' ? 'Supabase (delt på tværs af enheder)' : 'LocalStorage (kun denne browser/enhed)'}</strong>.
        Udfyld <code>assets/js/supabase-config.js</code> for at slå Supabase til.
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

  // ---------------- Save logic ----------------
  async function saveSection(section, btn) {
    const statusEl = document.getElementById('saveStatus-' + section);
    btn.disabled = true;
    btn.textContent = 'Gemmer …';

    try {
      if (section === 'testimonials') {
        const items = [];
        document.querySelectorAll('#testimonialsList .testi-card').forEach(card => {
          const idx = card.getAttribute('data-testi-index');
          const name = card.querySelector('[data-testi-field="name"]').value.trim();
          const role = card.querySelector('[data-testi-field="role"]').value.trim();
          const quote = card.querySelector('[data-testi-field="quote"]').value.trim();
          if (name || quote) items.push({ name, role, quote });
        });
        await window.MFGStore.setMany({ testimonials: JSON.stringify(items) });
        savedContent['testimonials'] = JSON.stringify(items);
      } else {
        const updates = {};
        const container = document.querySelector(`[data-save-section="${section}"]`).closest('.admin-section');

        container.querySelectorAll('[data-field-key]').forEach(inp => {
          updates[inp.getAttribute('data-field-key')] = inp.value;
        });

        // Handle any pending image uploads for this section
        const imageInputs = container.querySelectorAll('[data-image-key]');
        for (const inp of imageInputs) {
          if (inp.files && inp.files[0]) {
            const key = inp.getAttribute('data-image-key');
            const url = await window.MFGStore.uploadImage(inp.files[0]);
            updates[key] = url;
          }
        }

        await window.MFGStore.setMany(updates);
        Object.assign(savedContent, updates);
      }

      statusEl.textContent = 'Gemt ✓';
      setTimeout(() => { statusEl.textContent = ''; }, 3000);
    } catch (e) {
      console.error(e);
      statusEl.textContent = 'Fejl ved gem — se konsollen.';
      statusEl.style.color = '#b3402f';
    } finally {
      btn.disabled = false;
      btn.textContent = section === 'testimonials' ? 'Gem testimonials' : 'Gem ændringer';
    }
  }

  // ---------------- Navigation ----------------
  function renderNav() {
    const nav = document.getElementById('adminNav');
    const withGlobal = [
      { section: 'global', label: 'Globalt / Kontakt' },
      ...PAGES.map(p => ({ section: p.section, label: p.label })),
      { section: 'seo', label: 'SEO-data' },
      { section: 'testimonials', label: 'Testimonials' },
      { section: 'settings', label: 'Indstillinger' }
    ];
    nav.innerHTML = withGlobal.map((s, i) =>
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
    const order = [
      { section: 'global', label: 'Globalt / Kontakt' },
      ...PAGES.map(p => ({ section: p.section, label: p.label })),
      { section: 'seo', label: 'SEO-data' },
      { section: 'testimonials', label: 'Testimonials' },
      { section: 'settings', label: 'Indstillinger' }
    ];
    container.innerHTML = order.map((s, i) =>
      `<div class="admin-section ${i === 0 ? 'active' : ''}" id="section-${s.section}">${renderSection(s.section, s.label)}</div>`
    ).join('');

    // Wire up save buttons
    container.querySelectorAll('[data-save-section]').forEach(btn => {
      btn.addEventListener('click', () => saveSection(btn.getAttribute('data-save-section'), btn));
    });

    // Wire up image preview-on-select
    container.querySelectorAll('[data-image-key]').forEach(inp => {
      inp.addEventListener('change', () => {
        if (inp.files && inp.files[0]) {
          const reader = new FileReader();
          reader.onload = () => { inp.closest('.img-field').querySelector('img').src = reader.result; };
          reader.readAsDataURL(inp.files[0]);
        }
      });
    });

    // Testimonials: add / remove rows
    const addBtn = document.getElementById('addTestiBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const items = getTestimonials();
        items.push({ name: '', role: '', quote: '' });
        savedContent['testimonials'] = JSON.stringify(items);
        document.getElementById('section-testimonials').innerHTML = '<h2>Testimonials</h2>' + renderTestimonialsSection();
        rewireTestimonials();
      });
    }
    rewireTestimonials();

    // Settings actions
    wireSettings();
  }

  function rewireTestimonials() {
    document.querySelectorAll('[data-remove-testi]').forEach(btn => {
      btn.addEventListener('click', () => {
        const items = getTestimonials();
        items.splice(parseInt(btn.getAttribute('data-remove-testi'), 10), 1);
        savedContent['testimonials'] = JSON.stringify(items);
        document.getElementById('section-testimonials').innerHTML = '<h2>Testimonials</h2>' + renderTestimonialsSection();
        rewireTestimonials();
        const addBtn = document.getElementById('addTestiBtn');
        if (addBtn) addBtn.addEventListener('click', () => {
          const items2 = getTestimonials();
          items2.push({ name: '', role: '', quote: '' });
          savedContent['testimonials'] = JSON.stringify(items2);
          document.getElementById('section-testimonials').innerHTML = '<h2>Testimonials</h2>' + renderTestimonialsSection();
          rewireTestimonials();
        });
      });
    });
    const save = document.querySelector('[data-save-section="testimonials"]');
    if (save) save.addEventListener('click', () => saveSection('testimonials', save));
  }

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
    // Ensure we have savedContent loaded before checking (so a custom PIN set earlier is respected)
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

  // Auto-boot if already authed this session
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
