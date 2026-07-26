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

  function applyCvrVisibility(value) {
    const wrap = document.getElementById('footerCvrWrap');
    if (!wrap) return;
    wrap.style.display = (value && value.trim()) ? 'inline' : 'none';
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
  let talkModalData = [];

  function renderCases(items) {
    const container = document.querySelector('[data-cases-list]');
    if (!container) return;
    if (!items || items.length === 0) return;

    caseModalData = items;

    container.innerHTML = items.map((c, idx) => {
      const dir = DIRECTION_META[c.category] || DIRECTION_META.mennesker;
      const img = c.image_path ? '<img src="' + c.image_path + '" alt="" loading="lazy">' : '';
      const tags = '<span class="ct-tag"><svg class="icon"><use href="#' + dir.icon + '"/></svg> ' + dir.label + '</span>';
      return (
        '<button class="case-teaser case-teaser-btn" data-open-case="' + idx + '" type="button">' +
          img +
          tags +
          '<h4>' + escapeHtml(c.title || '') + '</h4>' +
          '<p>' + escapeHtml(c.teaser || '') + '</p>' +
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
    const dir = DIRECTION_META[c.category] || DIRECTION_META.mennesker;
    const img = c.image_path ? '<img src="' + c.image_path + '" alt="" class="case-modal-img" loading="lazy">' : '';

    const rows = [
      ['Udfordring', c.challenge],
      ['Vores ansvar', c.responsibility],
      ['Tilgang', c.approach],
      ['Resultat', c.result],
      ['Sådan hjalp MFG', c.mfg_help],
      ['Nøgletal', c.key_figures]
    ].filter(([, v]) => v && String(v).trim().length > 0);
    const stepsHtml = rows.length
      ? '<div class="case-steps" style="margin-top:20px">' +
          rows.map(([label, v]) => '<div class="case-step"><span class="k">' + label + '</span><p>' + escapeHtml(v) + '</p></div>').join('') +
        '</div>'
      : '';

    modal.querySelector('.case-modal-body').innerHTML =
      img +
      '<span class="ct-tag"><svg class="icon"><use href="#' + dir.icon + '"/></svg> ' + dir.label + '</span>' +
      '<h3>' + escapeHtml(c.title || '') + '</h3>' +
      '<p class="case-modal-industry">' + escapeHtml(c.teaser || '') + '</p>' +
      stepsHtml +
      '<div class="case-modal-footer">' +
        '<span></span>' +
        '<a class="btn btn-copper" href="kontakt.html">Book en samtale</a>' +
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

  function renderTestimonials(items) {
    const container = document.querySelector('[data-testimonials-list]');
    const section = document.getElementById('testimonialsSection');
    if (!container) return;
    if (!items || items.length === 0) return;

    container.innerHTML = items.map(t => {
      const dir = DIRECTION_META[t.direction] || DIRECTION_META.mennesker;
      const img = t.photo_path ? '<img src="' + t.photo_path + '" alt="" class="testimonial-avatar" loading="lazy">' : '';
      return (
        '<div class="case-teaser">' +
          img +
          '<span class="ct-tag"><svg class="icon"><use href="#' + dir.icon + '"/></svg> ' + dir.label + '</span>' +
          '<p style="font-style:italic">"' + escapeHtml(t.quote || '') + '"</p>' +
          '<h4 style="font-size:1rem">' + escapeHtml(t.name || '') + '</h4>' +
          '<span class="ct-link" style="cursor:default">' + escapeHtml(t.title_company || '') + '</span>' +
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

  function talkCategoryMeta(cat) {
    const map = {
      ledelse: { icon: 'i-leadership', label: 'Ledelse' },
      kultur: { icon: 'i-culture', label: 'Kultur' },
      mennesker: { icon: 'i-people', label: 'Mennesker' },
      forretning: { icon: 'i-growth', label: 'Forretningsudvikling' },
      'psykologisk-tryghed': { icon: 'i-culture', label: 'Psykologisk tryghed' },
      tilknytning: { icon: 'i-people', label: 'Tilknytning' },
      compass: { icon: 'i-growth', label: 'The MFG Compass™' }
    };
    return map[cat] || { icon: 'i-growth', label: cat || '' };
  }

  function renderTalks(items) {
    const container = document.querySelector('[data-talks-list]');
    if (!container) return;
    if (!items || !items.length) return;

    talkModalData = items;

    container.innerHTML = items.map((t, idx) => {
      const cat = talkCategoryMeta(t.category);
      const img = t.image_path ? '<img src="' + t.image_path + '" alt="" loading="lazy">' : '';
      const metaBits = [t.target_group, t.format].filter(v => v && String(v).trim().length > 0);
      const metaLine = metaBits.length ? '<p class="talk-card-meta">' + escapeHtml(metaBits.join(' · ')) + '</p>' : '';
      return (
        '<div class="case-teaser talk-card">' +
          img +
          '<span class="ct-tag"><svg class="icon"><use href="#' + cat.icon + '"/></svg> ' + cat.label + '</span>' +
          '<h4>' + escapeHtml(t.title || '') + '</h4>' +
          '<p>' + escapeHtml(t.teaser || '') + '</p>' +
          metaLine +
          '<div class="talk-card-actions">' +
            '<button class="ct-link" type="button" data-open-talk="' + idx + '" data-clarity-event="talk_read_more_click">Læs mere →</button>' +
            '<a class="btn btn-ghost btn-sm" href="' + talkInquiryLink(t) + '" data-clarity-event="talk_inquiry_click">Forespørg</a>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    container.querySelectorAll('[data-open-talk]').forEach(btn => {
      btn.addEventListener('click', () => {
        openTalkModal(talkModalData[parseInt(btn.getAttribute('data-open-talk'), 10)]);
        if (window.clarity) { try { window.clarity('event', 'talk_card_click'); } catch (e) {} }
      });
    });
  }

  function talkInquiryLink(t) {
    const subject = 'Forespørgsel på foredrag: ' + (t.title || '');
    return (t.cta_url || 'kontakt.html') + '?emne=' + encodeURIComponent(subject);
  }

  function renderFeaturedTalks(items) {
    const container = document.querySelector('[data-featured-talks-list]');
    if (!container) return;
    const featured = (items || []).filter(t => t.is_featured).slice(0, 3);
    if (!featured.length) return;

    container.innerHTML = featured.map(t => {
      const cat = talkCategoryMeta(t.category);
      return (
        '<a class="case-teaser talk-card" href="foredrag.html">' +
          '<span class="ct-tag"><svg class="icon"><use href="#' + cat.icon + '"/></svg> ' + cat.label + '</span>' +
          '<h4>' + escapeHtml(t.title || '') + '</h4>' +
          '<p>' + escapeHtml(t.teaser || '') + '</p>' +
        '</a>'
      );
    }).join('');
  }

  function openTalkModal(t) {
    const modal = document.getElementById('talkModal');
    if (!modal || !t) return;
    const cat = talkCategoryMeta(t.category);
    const img = t.image_path ? '<img src="' + t.image_path + '" alt="" class="case-modal-img" loading="lazy">' : '';
    const full = t.description ? '<p style="margin-top:16px">' + escapeHtml(t.description) + '</p>' : '';

    const metaRows = [
      ['Målgruppe', t.target_group],
      ['Varighed', t.duration],
      ['Format', t.format]
    ].filter(([, v]) => v && String(v).trim().length > 0);

    const metaHtml = metaRows.length
      ? '<div class="case-steps" style="margin-top:20px">' +
          metaRows.map(([label, v]) => '<div class="case-step"><span class="k">' + label + '</span><p>' + escapeHtml(v) + '</p></div>').join('') +
        '</div>'
      : '';

    const videoHtml = t.video_url
      ? '<p style="margin-top:16px"><a class="ct-link" href="' + t.video_url + '" target="_blank" rel="noopener">Se video →</a></p>'
      : '';
    const docHtml = t.document_path
      ? '<a href="' + t.document_path + '" target="_blank" rel="noopener" class="ct-link">Åbn program (PDF) →</a>'
      : '';

    modal.querySelector('.case-modal-body').innerHTML =
      img +
      '<span class="ct-tag"><svg class="icon"><use href="#' + cat.icon + '"/></svg> ' + cat.label + '</span>' +
      '<h3>' + escapeHtml(t.title || '') + '</h3>' +
      '<p class="case-modal-industry">' + escapeHtml(t.teaser || '') + '</p>' +
      full +
      metaHtml +
      videoHtml +
      '<div class="case-modal-footer">' +
        (docHtml || '<span></span>') +
        '<a class="btn btn-copper" href="' + talkInquiryLink(t) + '" data-clarity-event="talk_inquiry_click">' + escapeHtml(t.cta_text || 'Forespørg på foredraget') + '</a>' +
      '</div>';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.case-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeTalkModal() {
    const modal = document.getElementById('talkModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initTalkModal() {
    const modal = document.getElementById('talkModal');
    if (!modal) return;
    modal.querySelector('.case-modal-close').addEventListener('click', closeTalkModal);
    modal.querySelector('.case-modal-backdrop').addEventListener('click', closeTalkModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTalkModal(); });
  }

  function currentPageKey() {
    const file = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
    return file === '' ? 'index' : file;
  }

  function showDataErrorBanner() {
    if (document.querySelector('.mfg-data-error-banner')) return;
    const bar = document.createElement('div');
    bar.className = 'mfg-data-error-banner';
    bar.setAttribute('role', 'status');
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2500;background:#7a2e2e;color:#fff;' +
      'padding:10px 18px;text-align:center;font-size:.82rem';
    bar.textContent = 'Kunne ikke hente det seneste indhold lige nu — du ser en tidligere gemt version af siden.';
    document.body.appendChild(bar);
  }

  async function applyPageContent() {
    const page = currentPageKey();
    const fields = await window.MFGPublicData.getPageContent(page);
    Object.keys(fields).forEach(key => {
      const value = fields[key];
      if (value === undefined || value === null) return;
      document.querySelectorAll('[data-edit="' + CSS.escape(key) + '"]').forEach(el => applyValue(el, value));
      document.querySelectorAll('[data-edit-href="' + CSS.escape(key) + '"]').forEach(el => el.setAttribute('href', value));
      syncTelMailto(key, value);
      if (key === 'om-competencies' || key === 'om-certifications') renderCredList(key, value);
      if (key === 'favicon-img') applyFavicon(value);
      if (key === 'footer-cvr') applyCvrVisibility(value);
      if (key === 'solutions_json') renderSolutions(value);
    });
    return fields;
  }

  async function applySeo() {
    const page = currentPageKey();
    const seo = await window.MFGPublicData.getSeo(page);
    if (!seo) return;
    if (seo.title) document.title = seo.title;
    if (seo.meta_description) {
      const m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute('content', seo.meta_description);
    }
    if (seo.canonical_url) {
      const c = document.querySelector('link[rel="canonical"]');
      if (c) c.setAttribute('href', seo.canonical_url);
    }
  }

  async function boot() {
    initCaseModal();
    initTalkModal();

    if (!window.MFGSupabase) {
      // Supabase er ikke konfigureret — siden viser den statiske standardtekst,
      // der allerede ligger i HTML'en. Det er en bevidst, sikker fallback,
      // ikke en fejl i sig selv.
      console.warn('MFG content-loader: Supabase er ikke konfigureret — viser statisk standardindhold.');
      return;
    }

    let hadError = false;
    const tasks = [applyPageContent().catch(e => { hadError = true; console.warn('MFG: page_content fejlede', e); })];

    if (document.querySelector('[data-cases-list]')) {
      tasks.push(window.MFGPublicData.getCases().then(renderCases).catch(e => { hadError = true; console.warn('MFG: cases fejlede', e); }));
    }
    if (document.querySelector('[data-talks-list], [data-featured-talks-list]')) {
      tasks.push(window.MFGPublicData.getTalks().then(items => { renderTalks(items); renderFeaturedTalks(items); }).catch(e => { hadError = true; console.warn('MFG: talks fejlede', e); }));
    }
    if (document.querySelector('[data-testimonials-list]')) {
      tasks.push(window.MFGPublicData.getTestimonials().then(renderTestimonials).catch(e => { hadError = true; console.warn('MFG: testimonials fejlede', e); }));
    }
    tasks.push(applySeo().catch(() => {}));

    await Promise.all(tasks);

    // Vis en diskret fejlbanner, hvis NOGET fejlede — men lad al allerede
    // synlig statisk tekst blive stående, så siden aldrig fremstår tom.
    if (hadError) showDataErrorBanner();
  }

  boot();
})();


