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
    forretning: { icon: 'i-growth',     label: 'Forretning' },
    forretningsudvikling: { icon: 'i-growth', label: 'Forretningsudvikling' }
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

  function renderCases(value) {
    const container = document.querySelector('[data-cases-list]');
    if (!container) return;
    const items = (parseJsonArray(value) || [])
      .filter(c => c.status === 'published')
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    if (!items.length) return;

    caseModalData = items;

    container.innerHTML = items.map((c, idx) => {
      const dir = DIRECTION_META[c.category] || DIRECTION_META.mennesker;
      const img = c.image_url ? '<img src="' + c.image_url + '" alt="' + escapeHtml(c.title || '') + '" loading="lazy">' : '';
      const figuresLine = Array.isArray(c.key_figures) && c.key_figures.length
        ? '<div class="case-card-figures">' + c.key_figures.slice(0, 3).map(f =>
            '<span><strong>' + escapeHtml(f.value) + '</strong>' + escapeHtml(f.label) + '</span>'
          ).join('') + '</div>'
        : '';
      return (
        '<div class="case-teaser talk-card" data-case-category="' + escapeHtml(c.category || '') + '">' +
          img +
          '<span class="ct-tag"><svg class="icon"><use href="#' + dir.icon + '"/></svg> ' + dir.label + '</span>' +
          '<h4>' + escapeHtml(c.title || '') + '</h4>' +
          '<p>' + escapeHtml(c.teaser || '') + '</p>' +
          figuresLine +
          '<div class="talk-card-actions">' +
            '<button class="ct-link" type="button" data-open-case="' + idx + '" data-clarity-event="case_read_more_click">Læs hele casen →</button>' +
            '<a class="btn btn-ghost btn-sm" href="' + (c.cta_url || 'kontakt.html') + '" data-clarity-event="case_book_click">Book en samtale</a>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    container.querySelectorAll('[data-open-case]').forEach(btn => {
      btn.addEventListener('click', () => {
        openCaseModal(caseModalData[parseInt(btn.getAttribute('data-open-case'), 10)]);
        if (window.clarity) { try { window.clarity('event', 'case_card_click'); } catch (e) {} }
      });
    });

    initCaseFilters();
  }

  function initCaseFilters() {
    const filterBar = document.getElementById('caseFilters');
    if (!filterBar) return;
    if (filterBar.dataset.wired) return;
    filterBar.dataset.wired = '1';
    filterBar.querySelectorAll('.talk-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.talk-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const wanted = btn.getAttribute('data-filter');
        document.querySelectorAll('[data-cases-list] .talk-card').forEach(card => {
          const cat = card.getAttribute('data-case-category');
          const show = wanted === 'alle' || cat === wanted;
          card.classList.toggle('is-hidden-by-filter', !show);
        });
        if (window.clarity) { try { window.clarity('event', 'case_filter_' + wanted + '_click'); } catch (e) {} }
      });
    });
  }

  function renderFeaturedCases(value) {
    const container = document.querySelector('[data-featured-cases-list]');
    if (!container) return;
    const items = (parseJsonArray(value) || [])
      .filter(c => c.status === 'published' && c.is_featured)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .slice(0, 3);
    if (!items.length) return;

    container.innerHTML = items.map(c => {
      const dir = DIRECTION_META[c.category] || DIRECTION_META.mennesker;
      const img = c.image_url ? '<img src="' + c.image_url + '" alt="' + escapeHtml(c.title || '') + '" loading="lazy">' : '';
      return (
        '<a class="case-teaser talk-card" href="cases.html">' +
          img +
          '<span class="ct-tag"><svg class="icon"><use href="#' + dir.icon + '"/></svg> ' + dir.label + '</span>' +
          '<h4>' + escapeHtml(c.title || '') + '</h4>' +
          '<p>' + escapeHtml(c.teaser || '') + '</p>' +
        '</a>'
      );
    }).join('');
  }

  function openCaseModal(c) {
    const modal = document.getElementById('caseModal');
    if (!modal || !c) return;
    const dir = DIRECTION_META[c.category] || DIRECTION_META.mennesker;
    const img = c.image_url ? '<img src="' + c.image_url + '" alt="' + escapeHtml(c.title || '') + '" class="case-modal-img" loading="lazy">' : '';
    const orgLine = c.org_type ? '<p class="case-customer">' + escapeHtml(c.org_type) + '</p>' : '';

    const approachList = Array.isArray(c.approach) && c.approach.length
      ? '<h4 style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-light)">Sådan greb jeg det an</h4>' +
        '<ul class="talk-focus-list">' + c.approach.map(a => '<li>' + escapeHtml(a) + '</li>').join('') + '</ul>'
      : '';

    const figuresHtml = Array.isArray(c.key_figures) && c.key_figures.length
      ? '<div class="case-steps" style="margin-top:20px">' +
          c.key_figures.slice(0, 3).map(f => '<div class="case-step"><span class="k">' + escapeHtml(f.label) + '</span><p>' + escapeHtml(f.value) + '</p></div>').join('') +
        '</div>'
      : '';

    const insightsHtml = Array.isArray(c.insights) && c.insights.length
      ? '<div class="talk-takeaway"><span class="k">Central indsigt</span>' + c.insights.slice(0, 2).map(i => escapeHtml(i)).join(' · ') + '</div>'
      : '';

    const mfgHelpHtml = c.mfg_help
      ? '<h4 style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-light)">Sådan kan MFG Advisory hjælpe</h4>' +
        '<p>' + escapeHtml(c.mfg_help) + '</p>'
      : '';

    modal.querySelector('.case-modal-body').innerHTML =
      img +
      '<span class="ct-tag"><svg class="icon"><use href="#' + dir.icon + '"/></svg> ' + dir.label + '</span>' +
      '<h3>' + escapeHtml(c.title || '') + '</h3>' +
      orgLine +
      '<p class="case-modal-industry">' + escapeHtml(c.teaser || '') + '</p>' +
      '<h4 style="margin-top:20px;font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-light)">Udfordringen</h4>' +
      '<p>' + escapeHtml(c.challenge || '') + '</p>' +
      '<h4 style="margin-top:20px;font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-light)">Mit ansvar</h4>' +
      '<p>' + escapeHtml(c.responsibility || '') + '</p>' +
      approachList +
      figuresHtml +
      '<h4 style="margin-top:20px;font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-light)">Resultatet</h4>' +
      '<p>' + escapeHtml(c.result || '') + '</p>' +
      insightsHtml +
      mfgHelpHtml +
      '<div class="case-modal-footer">' +
        '<span></span>' +
        '<a class="btn btn-copper" href="' + (c.cta_url || 'kontakt.html') + '" data-clarity-event="case_book_click">' + escapeHtml(c.cta_text || 'Book en strategisk samtale') + '</a>' +
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

  function renderTalks(value) {
    const container = document.querySelector('[data-talks-list]');
    if (!container) return;
    const items = (parseJsonArray(value) || [])
      .filter(t => t.status === 'published')
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    if (!items.length) return;

    talkModalData = items;

    container.innerHTML = items.map((t, idx) => {
      const cat = talkCategoryMeta(t.category);
      const img = t.image_url ? '<img src="' + t.image_url + '" alt="' + escapeHtml(t.title || '') + '" loading="lazy">' : '';
      return (
        '<div class="case-teaser talk-card" data-talk-category="' + escapeHtml(t.category || '') + '">' +
          img +
          '<span class="ct-tag"><svg class="icon"><use href="#' + cat.icon + '"/></svg> ' + cat.label + '</span>' +
          '<h4>' + escapeHtml(t.title || '') + '</h4>' +
          '<p>' + escapeHtml(t.teaser || '') + '</p>' +
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

    initTalkFilters();
  }

  function initTalkFilters() {
    const filterBar = document.getElementById('talkFilters');
    if (!filterBar) return;
    if (filterBar.dataset.wired) return;
    filterBar.dataset.wired = '1';
    filterBar.querySelectorAll('.talk-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.talk-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const wanted = btn.getAttribute('data-filter');
        document.querySelectorAll('.talk-card').forEach(card => {
          const cat = card.getAttribute('data-talk-category');
          const show = wanted === 'alle' || cat === wanted;
          card.classList.toggle('is-hidden-by-filter', !show);
        });
        if (window.clarity) { try { window.clarity('event', 'talk_filter_' + wanted + '_click'); } catch (e) {} }
      });
    });
  }

  function talkInquiryLink(t) {
    const subject = 'Forespørgsel på foredrag: ' + (t.title || '');
    return (t.cta_url || 'kontakt.html') + '?emne=' + encodeURIComponent(subject);
  }

  function renderFeaturedTalks(value) {
    const container = document.querySelector('[data-featured-talks-list]');
    if (!container) return;
    const items = (parseJsonArray(value) || [])
      .filter(t => t.status === 'published' && t.is_featured)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .slice(0, 3);
    if (!items.length) return;

    container.innerHTML = items.map(t => {
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
    const img = t.image_url ? '<img src="' + t.image_url + '" alt="' + escapeHtml(t.title || '') + '" class="case-modal-img" loading="lazy">' : '';
    const subtitleHtml = t.subtitle ? '<p class="case-customer">' + escapeHtml(t.subtitle) + '</p>' : '';

    const focusList = Array.isArray(t.focus) && t.focus.length
      ? '<h4 style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-light)">Foredraget sætter fokus på</h4>' +
        '<ul class="talk-focus-list">' + t.focus.map(f => '<li>' + escapeHtml(f) + '</li>').join('') + '</ul>'
      : '';

    const takeawayHtml = t.takeaway
      ? '<div class="talk-takeaway"><span class="k">Deltagerne får med sig</span>' + escapeHtml(t.takeaway) + '</div>'
      : '';

    const videoHtml = t.video_url
      ? '<p style="margin-top:16px"><a class="ct-link" href="' + t.video_url + '" target="_blank" rel="noopener">Se video →</a></p>'
      : '';
    const docHtml = t.document_url
      ? '<a href="' + t.document_url + '" target="_blank" rel="noopener" class="ct-link">Åbn program (PDF) →</a>'
      : '';

    modal.querySelector('.case-modal-body').innerHTML =
      img +
      '<span class="ct-tag"><svg class="icon"><use href="#' + cat.icon + '"/></svg> ' + cat.label + '</span>' +
      '<h3>' + escapeHtml(t.title || '') + '</h3>' +
      subtitleHtml +
      '<p class="case-modal-industry">' + escapeHtml(t.teaser || '') + '</p>' +
      focusList +
      takeawayHtml +
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

  const DEFAULT_TALKS = window.MFG_DEFAULT_TALKS || [];
  const TALKS_DATA_VERSION = 'v3-13talks-kultur-loftet';
  const DEFAULT_CASES = window.MFG_DEFAULT_CASES || [];
  const CASES_DATA_VERSION = 'v6-11cases-company-names';

  async function seedTalksIfNeeded(content) {
    const storedVersion = content['talks_data_version'];
    const hasCurrentData = content.talks && storedVersion === TALKS_DATA_VERSION;
    if (hasCurrentData) return content;

    // Enten er der slet ingen foredrag gemt endnu, ELLER det, der ligger i
    // browserens gemte data, er fra en ældre version af datamodellen (fx det
    // tidligere 7-foredrags-skema uden felterne "focus"/"takeaway"). I begge
    // tilfælde overskriver vi med den aktuelle standarddata, så alle 12
    // foredrag altid vises med fuldt indhold — uanset hvad der måtte ligge
    // tilbage fra tidligere besøg på sitet.
    if (!window.MFGStore) return content;
    try {
      const value = JSON.stringify(DEFAULT_TALKS);
      await window.MFGStore.setMany({ talks: value, 'talks_data_version': TALKS_DATA_VERSION });
      content.talks = value;
      content['talks_data_version'] = TALKS_DATA_VERSION;
    } catch (e) {
      console.warn('MFG content-loader: could not seed default talks', e);
      content.talks = JSON.stringify(DEFAULT_TALKS);
    }
    return content;
  }

  async function seedCasesIfNeeded(content) {
    const storedVersion = content['cases_data_version'];
    const hasCurrentData = content.cases && storedVersion === CASES_DATA_VERSION;
    if (hasCurrentData) return content;

    // Samme princip som foredragene: enten mangler cases helt, eller det,
    // der ligger gemt, er fra en tidligere, mindre datamodel (fx de fire
    // gamle eksempel-cases uden fokuspunkter/nøgletal/indsigter). I begge
    // tilfælde overskriver vi med de aktuelle 11 cases.
    if (!window.MFGStore) return content;
    try {
      const value = JSON.stringify(DEFAULT_CASES);
      await window.MFGStore.setMany({ cases: value, 'cases_data_version': CASES_DATA_VERSION });
      content.cases = value;
      content['cases_data_version'] = CASES_DATA_VERSION;
    } catch (e) {
      console.warn('MFG content-loader: could not seed default cases', e);
      content.cases = JSON.stringify(DEFAULT_CASES);
    }
    return content;
  }

  function apply(content) {
    Object.keys(content).forEach(key => {
      const value = content[key];
      if (value === undefined || value === null) return;

      document.querySelectorAll('[data-edit="' + CSS.escape(key) + '"]').forEach(el => applyValue(el, value));
      document.querySelectorAll('[data-edit-href="' + CSS.escape(key) + '"]').forEach(el => el.setAttribute('href', value));

      syncTelMailto(key, value);

      if (key === 'om-competencies' || key === 'om-certifications') renderCredList(key, value);
      if (key === 'cases') { renderCases(value); renderFeaturedCases(value); }
      if (key === 'testimonials') renderTestimonials(value);
      if (key === 'solutions') renderSolutions(value);
      if (key === 'talks') { renderTalks(value); renderFeaturedTalks(value); }
      if (key === 'favicon-img') applyFavicon(value);
      if (key === 'footer-cvr') applyCvrVisibility(value);
    });
  }

  if (!window.MFGStore) {
    console.warn('MFG content-loader: content-store.js not loaded — showing default content only.');
    initCaseModal();
    initTalkModal();
    return;
  }

  initCaseModal();
  initTalkModal();

  window.MFGStore.getAll()
    .then(seedTalksIfNeeded)
    .then(seedCasesIfNeeded)
    .then(apply)
    .catch(err => console.warn('MFG content-loader: could not load saved content, showing defaults.', err));
})();

