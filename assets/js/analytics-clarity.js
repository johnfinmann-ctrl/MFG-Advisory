/* =========================================================================
   MFG Advisory — Microsoft Clarity: indlæsning + event tracking
   =========================================================================
   - Indlæser KUN Microsoft Clarity (ingen Plausible, ingen Google Analytics).
   - Indlæses KUN efter samtykke til statistik-cookies (styres af
     cookie-consent.js) og KUN hvis et Project ID er udfyldt i
     assets/js/clarity-config.js.
   - Scriptet indsættes højst én gang, uanset hvor mange gange funktionen
     kaldes (guard via window.__mfgClarityLoaded).
   - Event-lytterne herunder er altid tilkoblet (harmløse no-ops, hvis
     Clarity ikke er indlæst endnu) — så snart samtykke gives og Clarity
     starter, begynder de allerede tilkoblede handlinger at blive sporet.
   ========================================================================= */

(function () {
  window.__mfgClarityLoaded = window.__mfgClarityLoaded || false;

  function loadClarity(projectId) {
    if (!projectId || window.__mfgClarityLoaded) return;
    window.__mfgClarityLoaded = true;

    // Officiel Microsoft Clarity-snippet (uændret, kun indsat i en funktion)
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', projectId);
  }
  window.MFGLoadClarity = loadClarity;

  function track(eventName) {
    if (window.clarity) {
      try { window.clarity('event', eventName); } catch (e) { /* fejl i tracking må aldrig stoppe siden */ }
    }
  }

  function isExternalLink(a) {
    try {
      const url = new URL(a.href, window.location.href);
      return url.hostname && url.hostname !== window.location.hostname;
    } catch (e) {
      return false;
    }
  }

  // Generisk: ethvert element med data-clarity-event="..." spores automatisk
  // under det angivne navn — også elementer, der indsættes dynamisk efter
  // sideindlæsning (fx den mobile sticky bookingknap). Ægte event-delegation
  // på document, så rækkefølgen af scripts ikke har betydning.
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-clarity-event]');
    if (el) track(el.getAttribute('data-clarity-event'));
  });

  document.addEventListener('DOMContentLoaded', function () {
    // Telefon- og mail-klik
    document.querySelectorAll('a[href^="tel:"]').forEach(a => {
      a.addEventListener('click', () => track('phone_click'));
    });
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      a.addEventListener('click', () => track('mail_click'));
    });

    // "Book en strategisk samtale" / "Book en samtale" — alle CTA-knapper til kontakt.html
    document.querySelectorAll('a.btn[href*="kontakt.html"]').forEach(a => {
      a.addEventListener('click', () => track('book_strategisk_samtale_click'));
    });

    // Kontaktformular sendt
    const kontaktForm = document.getElementById('kontaktForm');
    if (kontaktForm) {
      kontaktForm.addEventListener('submit', () => track('kontaktformular_sendt'));
    }

    // Compass: de fire retninger + centrum
    const compassMap = {
      'compass-direction--people': 'compass_mennesker_click',
      'compass-direction--leadership': 'compass_ledelse_click',
      'compass-direction--culture': 'compass_kultur_click',
      'compass-direction--business': 'compass_forretning_click'
    };
    Object.keys(compassMap).forEach(cls => {
      const el = document.querySelector('.' + cls);
      if (el) el.addEventListener('click', () => track(compassMap[cls]));
    });
    const compassCenter = document.querySelector('.compass-center');
    if (compassCenter) {
      compassCenter.addEventListener('click', () => track('compass_center_click'));
    }

    // PDF-downloads og eksterne links (dækker bl.a. case-PDF'er og Nordic Operations-linket)
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (/\.pdf(\?.*)?$/i.test(href)) {
        a.addEventListener('click', () => track('pdf_download'));
      } else if (isExternalLink(a)) {
        a.addEventListener('click', () => track('external_link_click'));
      }
    });
  });
})();
