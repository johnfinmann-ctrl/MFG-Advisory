/* =========================================================================
   MFG Advisory — Cookie consent + gated analytics
   =========================================================================
   Shows a small banner until the visitor chooses "Kun nødvendige" or
   "Accepter alle". Analytics (configured under Admin → Indstillinger) is
   only ever loaded after explicit "Accepter alle" consent — never before,
   and never if no analytics provider/ID has been configured.
   ========================================================================= */

(function () {
  const CONSENT_KEY = 'mfg_cookie_consent'; // 'all' | 'necessary'

  function getConsent() {
    return localStorage.getItem(CONSENT_KEY);
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
  }

  function loadAnalytics(provider, id) {
    if (!provider || provider === 'none' || !id) return;

    if (provider === 'plausible') {
      const s = document.createElement('script');
      s.defer = true;
      s.setAttribute('data-domain', id);
      s.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(s);
    }

    if (provider === 'ga') {
      const s1 = document.createElement('script');
      s1.async = true;
      s1.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      document.head.appendChild(s1);

      const s2 = document.createElement('script');
      s2.textContent =
        "window.dataLayer = window.dataLayer || [];" +
        "function gtag(){dataLayer.push(arguments);}" +
        "gtag('js', new Date());" +
        "gtag('config', '" + id.replace(/'/g, '') + "');";
      document.head.appendChild(s2);
    }
  }

  async function maybeLoadAnalyticsIfConsented() {
    if (getConsent() !== 'all') return;
    if (!window.MFGStore) return;
    try {
      const content = await window.MFGStore.getAll();
      loadAnalytics(content['config-analytics-provider'], content['config-analytics-id']);
    } catch (e) {
      console.warn('MFG cookie-consent: could not read analytics config', e);
    }
  }

  function renderBanner() {
    const bar = document.createElement('div');
    bar.className = 'cookie-banner';
    bar.innerHTML =
      '<p>Vi bruger nødvendige cookies for at hjemmesiden fungerer, og — kun med dit samtykke — analytics-cookies for at forstå trafik. Læs mere på <a href="kontakt.html">kontaktsiden</a>.</p>' +
      '<div class="cookie-banner-actions">' +
        '<button class="btn btn-ghost btn-sm" id="cookieNecessaryBtn">Kun nødvendige</button>' +
        '<button class="btn btn-copper btn-sm" id="cookieAcceptBtn">Accepter alle</button>' +
      '</div>';
    document.body.appendChild(bar);

    document.getElementById('cookieNecessaryBtn').addEventListener('click', () => {
      setConsent('necessary');
      bar.remove();
    });
    document.getElementById('cookieAcceptBtn').addEventListener('click', () => {
      setConsent('all');
      bar.remove();
      maybeLoadAnalyticsIfConsented();
    });
  }

  if (!getConsent()) {
    renderBanner();
  } else {
    maybeLoadAnalyticsIfConsented();
  }
})();
