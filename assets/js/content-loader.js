/* =========================================================================
   MFG Advisory — Content Loader (runs on every public page)
   =========================================================================
   The HTML already contains the default, designed copy — this script only
   OVERWRITES elements where the admin panel has saved a change, so the
   site works perfectly even if this script fails to load or the store is
   empty. Nothing here changes layout, styling, or structure.

   In addition to simple text/image overrides, this file also renders three
   admin-managed *lists* on top of the existing markup, reusing the site's
   existing component classes (no new visual language):
     - om-competencies / om-certifications  → pill lists on Om Morten
     - cases                                → extra case cards on Cases
     - testimonials                         → testimonial cards on Cases
   ========================================================================= */

(function () {
  const DIRECTION_META = {
    mennesker:  { icon: 'i-people',     label: 'Mennesker' },
    ledelse:    { icon: 'i-leadership', label: 'Ledelse' },
    kultur:     { icon: 'i-culture',    label: 'Kultur' },
    forretning: { icon: 'i-growth',     label: 'Forretning' }
  };

  function applyValue(el, value) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'img') {
      el.setAttribute('src', value);
    } else if (tag === 'title') {
      el.textContent = value;
    } else if (tag === 'meta') {
      el.setAttribute('content', value);
    } else {
      el.textContent = value;
    }
  }

  function syncTelMailto(key, value) {
    if (key === 'contact-phone') {
      const digits = value.replace(/[^\d+]/g, '');
      document.querySelectorAll('a[href^="tel:"]').forEach(a => a.setAttribute('href', 'tel:' + digits));
    }
    if (key === 'contact-email') {
      document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.setAttribute('href', 'mailto:' + value));
    }
  }

  function escapeHtml(s) {
    return (s || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  }

  function parseJsonArray(raw) {
    if (!raw) return null;
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : null;
    } catch (e) {
      return null;
    }
  }

  function renderCredList(key, value) {
    const container = document.querySelector('[data-cred-list="' + CSS.escape(key) + '"]');
    if (!container) return;
    const items = parseJsonArray(value);
    if (!items) return; // no saved override — leave the designed defaults in place
    container.innerHTML = items.map(t => '<span class="cred">' + escapeHtml(t) + '</span>').join('');
  }

  function renderCases(value) {
    const container = document.querySelector('[data-cases-list]');
    if (!container) return;
    const items = parseJsonArray(value);
    if (!items || items.length === 0) return;

    container.innerHTML = items.map(c => {
      const dir = DIRECTION_META[c.direction] || DIRECTION_META.mennesker;
      const img = c.image ? '<img src="' + c.image + '" alt="">' : '';
      return (
        '<div class="case-teaser">' +
          img +
          '<span class="ct-tag"><svg class="icon"><use href="#' + dir.icon + '"/></svg> ' + dir.label + '</span>' +
          '<h4>' + escapeHtml(c.title || '') + '</h4>' +
          '<p>' + escapeHtml(c.industry || '') + '</p>' +
          '<details class="insight case-teaser-details">' +
            '<summary>Se udfordring, løsning og resultat</summary>' +
            '<div class="insight-body">' +
              '<strong>Udfordring:</strong> ' + escapeHtml(c.challenge || '') + '<br>' +
              '<strong>Løsning:</strong> ' + escapeHtml(c.solution || '') + '<br>' +
              '<strong>Resultat:</strong> ' + escapeHtml(c.result || '') +
            '</div>' +
          '</details>' +
        '</div>'
      );
    }).join('');
  }

  function renderTestimonials(value) {
    const container = document.querySelector('[data-testimonials-list]');
    const section = document.getElementById('testimonialsSection');
    if (!container) return;
    const items = parseJsonArray(value);
    if (!items || items.length === 0) return;

    container.innerHTML = items.map(t => {
      const dir = DIRECTION_META[t.direction] || DIRECTION_META.mennesker;
      const img = t.image ? '<img src="' + t.image + '" alt="" class="testimonial-avatar">' : '';
      return (
        '<div class="case-teaser">' +
          img +
          '<span class="ct-tag"><svg class="icon"><use href="#' + dir.icon + '"/></svg> ' + dir.label + '</span>' +
          '<p style="font-style:italic">"' + escapeHtml(t.quote || '') + '"</p>' +
          '<h4 style="font-size:1rem">' + escapeHtml(t.name || '') + '</h4>' +
          '<span class="ct-link" style="cursor:default">' + escapeHtml(t.role || '') + '</span>' +
        '</div>'
      );
    }).join('');
    if (section) section.style.display = '';
  }

  function apply(content) {
    Object.keys(content).forEach(key => {
      const value = content[key];
      if (value === undefined || value === null) return;

      document.querySelectorAll('[data-edit="' + CSS.escape(key) + '"]').forEach(el => applyValue(el, value));
      document.querySelectorAll('[data-edit-href="' + CSS.escape(key) + '"]').forEach(el => el.setAttribute('href', value));

      syncTelMailto(key, value);

      if (key === 'om-competencies' || key === 'om-certifications') renderCredList(key, value);
      if (key === 'cases') renderCases(value);
      if (key === 'testimonials') renderTestimonials(value);
    });
  }

  if (!window.MFGStore) {
    console.warn('MFG content-loader: content-store.js not loaded — showing default content only.');
    return;
  }

  window.MFGStore.getAll()
    .then(apply)
    .catch(err => console.warn('MFG content-loader: could not load saved content, showing defaults.', err));
})();

