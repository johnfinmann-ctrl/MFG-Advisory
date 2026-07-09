/* =========================================================================
   MFG Advisory — Content Loader (runs on every public page)
   =========================================================================
   The HTML already contains the default, designed copy — this script only
   OVERWRITES elements where the admin panel has saved a change, so the
   site works perfectly even if this script fails to load or the store is
   empty. Nothing here changes layout, styling, or structure.
   ========================================================================= */

(function () {
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

  function apply(content) {
    Object.keys(content).forEach(key => {
      const value = content[key];
      if (value === undefined || value === null) return;

      document.querySelectorAll('[data-edit="' + CSS.escape(key) + '"]').forEach(el => applyValue(el, value));
      document.querySelectorAll('[data-edit-href="' + CSS.escape(key) + '"]').forEach(el => el.setAttribute('href', value));

      syncTelMailto(key, value);
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
