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

  let caseModalData = [];

  function renderCases(value) {
    const container = document.querySelector('[data-cases-list]');
    if (!container) return;
    const items = parseJsonArray(value);
    if (!items || items.length === 0) return;

    caseModalData = items;

    container.innerHTML = items.map((c, idx) => {
      const dir = DIRECTION_META[c.direction] || DIRECTION_META.mennesker;
      const dir2 = c.direction2 ? DIRECTION_META[c.direction2] : null;
      const img = c.image ? '<img src="' + c.image + '" alt="" loading="lazy">' : '';
      const tags =
        '<span class="ct-tag"><svg class="icon"><use href="#' + dir.icon + '"/></svg> ' + dir.label + '</span>' +
        (dir2 ? ' <span class="ct-tag"><svg class="icon"><use href="#' + dir2.icon + '"/></svg> ' + dir2.label + '</span>' : '');
      const customerLine = (c.customer && !c.hideCustomer) ? '<p class="case-customer">' + escapeHtml(c.customer) + '</p>' : '';
      return (
        '<button class="case-teaser case-teaser-btn" data-open-case="' + idx + '" type="button">' +
          img +
          tags +
          '<h4>' + escapeHtml(c.title || '') + '</h4>' +
          customerLine +
          '<p>' + escapeHtml(c.industry || '') + '</p>' +
          '<span class="ct-link">Se hele casen →</span>' +
        '</button>'
      );
    }).join('');

    container.querySelectorAll('[data-open-case]').forEach(btn => {
      btn.addEventListener('click', () => openCaseModal(caseModalData[parseInt(btn.getAttribute('data-open-case'), 10)]));
    });
  }

  function openCaseModal(c) {
    const modal = document.getElementById('caseModal');
    if (!modal || !c) return;
    const dir = DIRECTION_META[c.direction] || DIRECTION_META.mennesker;
    const dir2 = c.direction2 ? DIRECTION_META[c.direction2] : null;
    const img = c.image ? '<img src="' + c.image + '" alt="" class="case-modal-img" loading="lazy">' : '';
    const customerLine = (c.customer && !c.hideCustomer) ? '<p class="case-customer">' + escapeHtml(c.customer) + '</p>' : '';
    const pdfLink = c.pdf ? '<a href="' + c.pdf + '" target="_blank" rel="noopener" class="ct-link">Åbn case-dokument (PDF) →</a>' : '';
    const gallery = Array.isArray(c.gallery) && c.gallery.length
      ? '<div class="case-gallery">' + c.gallery.map(g => '<img src="' + g + '" alt="" loading="lazy">').join('') + '</div>'
      : '';

    modal.querySelector('.case-modal-body').innerHTML =
      img +
      '<span class="ct-tag"><svg class="icon"><use href="#' + dir.icon + '"/></svg> ' + dir.label + '</span>' +
      (dir2 ? ' <span class="ct-tag"><svg class="icon"><use href="#' + dir2.icon + '"/></svg> ' + dir2.label + '</span>' : '') +
      '<h3>' + escapeHtml(c.title || '') + '</h3>' +
      customerLine +
      '<p class="case-modal-industry">' + escapeHtml(c.industry || '') + '</p>' +
      '<div class="case-steps" style="margin-top:20px">' +
        '<div class="case-step"><span class="k">Udfordring</span><p>' + escapeHtml(c.challenge || '') + '</p></div>' +
        '<div class="case-step"><span class="k">Løsning</span><p>' + escapeHtml(c.solution || '') + '</p></div>' +
        '<div class="case-step"><span class="k">Resultat</span><p>' + escapeHtml(c.result || '') + '</p></div>' +
      '</div>' +
      gallery +
      '<div class="case-modal-footer">' +
        (pdfLink || '<span></span>') +
        '<a class="btn btn-copper" href="' + (c.ctaLink || 'kontakt.html') + '">' + escapeHtml(c.ctaText || 'Book en samtale') + '</a>' +
      '</div>';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.case-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeCaseModal() {
    const modal = document.getElementById('caseModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initCaseModal() {
    const modal = document.getElementById('caseModal');
    if (!modal) return;
    modal.querySelector('.case-modal-close').addEventListener('click', closeCaseModal);
    modal.querySelector('.case-modal-backdrop').addEventListener('click', closeCaseModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCaseModal(); });
  }

  function renderTestimonials(value) {
    const container = document.querySelector('[data-testimonials-list]');
    const section = document.getElementById('testimonialsSection');
    if (!container) return;
    const items = parseJsonArray(value);
    if (!items || items.length === 0) return;

    container.innerHTML = items.map(t => {
      const dir = DIRECTION_META[t.direction] || DIRECTION_META.mennesker;
      const img = t.image ? '<img src="' + t.image + '" alt="" class="testimonial-avatar" loading="lazy">' : '';
      const logo = t.logo ? '<img src="' + t.logo + '" alt="" class="testimonial-logo" loading="lazy">' : '';
      const roleLine = [t.title, t.company].filter(Boolean).map(escapeHtml).join(', ');
      return (
        '<div class="case-teaser">' +
          img +
          '<span class="ct-tag"><svg class="icon"><use href="#' + dir.icon + '"/></svg> ' + dir.label + '</span>' +
          '<p style="font-style:italic">"' + escapeHtml(t.quote || '') + '"</p>' +
          '<h4 style="font-size:1rem">' + escapeHtml(t.name || '') + '</h4>' +
          '<span class="ct-link" style="cursor:default">' + roleLine + '</span>' +
          logo +
        '</div>'
      );
    }).join('');
    if (section) section.style.display = '';
  }

  function applyFavicon(url) {
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach(link => {
      link.setAttribute('href', url);
    });
  }

  function renderSolutions(value) {
    const container = document.querySelector('[data-solutions-target]');
    if (!container) return;
    const currentDirection = container.getAttribute('data-solutions-target');
    const items = parseJsonArray(value);
    if (!items || items.length === 0) return;

    const visible = items.filter(s => s.direction === currentDirection && s.published !== false);
    if (visible.length === 0) return;

    const wrap = document.createElement('div');
    wrap.innerHTML = visible.map(s => {
      const icon = s.icon || 'i-people';
      const img = s.image ? '<img src="' + s.image + '" alt="" loading="lazy" style="width:100%;height:120px;object-fit:cover;border-radius:var(--radius);margin-bottom:12px">' : '';

      if (s.displayMode === 'link') {
        return (
          '<a class="svc-card" href="' + (s.ctaLink || 'kontakt.html') + '" style="display:block;text-decoration:none">' +
            img +
            '<h4>' + escapeHtml(s.title || '') + '</h4>' +
            '<p>' + escapeHtml(s.teaser || '') + '</p>' +
            '<span class="ct-link" style="display:inline-block;margin-top:10px">' + escapeHtml(s.ctaText || 'Læs mere') + ' →</span>' +
          '</a>'
        );
      }

      return (
        '<div class="svc-card svc-card--accordion">' +
          '<button class="svc-toggle" aria-expanded="false">' +
            '<span class="svc-toggle-text">' +
              '<h4>' + escapeHtml(s.title || '') + '</h4>' +
              '<p class="svc-teaser">' + escapeHtml(s.teaser || '') + '</p>' +
            '</span>' +
            '<span class="svc-toggle-action">Læs mere <svg class="icon svc-chevron"><use href="#' + icon + '"/></svg></span>' +
          '</button>' +
          '<div class="svc-detail">' +
            img +
            '<p>' + escapeHtml(s.long || '') + '</p>' +
            '<div class="svc-detail-grid">' +
              '<div><span class="svc-detail-label">Typiske udfordringer</span><p>' + escapeHtml(s.challenges || '') + '</p></div>' +
              '<div><span class="svc-detail-label">MFG&#39;s tilgang</span><p>' + escapeHtml(s.approach || '') + '</p></div>' +
              '<div><span class="svc-detail-label">Forventede resultater</span><p>' + escapeHtml(s.results || '') + '</p></div>' +
            '</div>' +
            '<div class="svc-detail-footer">' +
              (s.relatedCase ? '<a href="' + s.relatedCase + '" class="ct-link">Se relateret case →</a>' : '<span></span>') +
              '<a class="btn btn-copper btn-sm" href="' + (s.ctaLink || 'kontakt.html') + '">' + escapeHtml(s.ctaText || 'Book en samtale') + '</a>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    Array.from(wrap.children).forEach(node => container.appendChild(node));

    // Wire up accordion toggles for the newly-inserted cards (main.js already
    // ran its own wiring pass before these existed).
    container.querySelectorAll('.svc-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.svc-card--accordion');
        const isOpen = card.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        const actionLabel = btn.querySelector('.svc-toggle-action');
        if (actionLabel) actionLabel.childNodes[0].textContent = isOpen ? 'Luk ' : 'Læs mere ';
      });
    });
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
      if (key === 'solutions') renderSolutions(value);
      if (key === 'favicon-img') applyFavicon(value);
    });
  }

  if (!window.MFGStore) {
    console.warn('MFG content-loader: content-store.js not loaded — showing default content only.');
    initCaseModal();
    return;
  }

  initCaseModal();

  window.MFGStore.getAll()
    .then(apply)
    .catch(err => console.warn('MFG content-loader: could not load saved content, showing defaults.', err));
})();

