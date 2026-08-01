/* =========================================================================
   MFG Advisory — Cookie consent + gated analytics
   =========================================================================
   Shows a small banner until the visitor chooses "Kun nødvendige" or
   "Accepter alle". Microsoft Clarity (configured in
   assets/js/clarity-config.js) is only ever loaded after explicit
   "Accepter alle" consent — never before, and never if no Project ID has
   been configured. No Plausible or Google Analytics is used.
   ========================================================================= */

(function () {
  const CONSENT_KEY = 'mfg_cookie_consent'; // 'all' | 'necessary'

  function getConsent() {
    return localStorage.getItem(CONSENT_KEY);
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
  }

  function maybeLoadAnalyticsIfConsented() {
    if (getConsent() !== 'all') return;
    if (typeof window.MFGLoadClarity !== 'function') return;
    window.MFGLoadClarity(window.MFG_CLARITY_PROJECT_ID);
  }

  function renderBanner() {
    const bar = document.createElement('div');
    bar.className = 'cookie-banner';
    bar.innerHTML =
      '<p>Jeg bruger nødvendige cookies for at hjemmesiden fungerer, og — kun med dit samtykke — analytics-cookies for at forstå trafik. Læs mere på <a href="kontakt.html">kontaktsiden</a>.</p>' +
      '<div class="cookie-banner-actions">' +
        '<button class="btn btn-ghost btn-sm" id="cookieNecessaryBtn">Kun nødvendige</button>' +
        '<button class="btn btn-copper btn-sm" id="cookieAcceptBtn">Accepter alle</button>' +
      '</div>';
    document.body.appendChild(bar);
    document.body.classList.add('cookie-banner-open');

    document.getElementById('cookieNecessaryBtn').addEventListener('click', () => {
      setConsent('necessary');
      bar.remove();
      document.body.classList.remove('cookie-banner-open');
    });
    document.getElementById('cookieAcceptBtn').addEventListener('click', () => {
      setConsent('all');
      bar.remove();
      document.body.classList.remove('cookie-banner-open');
      maybeLoadAnalyticsIfConsented();
    });
  }

  if (!getConsent()) {
    renderBanner();
  } else {
    maybeLoadAnalyticsIfConsented();
  }
})();
