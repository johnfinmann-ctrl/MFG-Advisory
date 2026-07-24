/* =========================================================================
   MFG Advisory — Fast bookingknap på mobil
   =========================================================================
   Vises kun under 768px. Bruger IntersectionObserver til at holde øje med
   alt, den ikke må overlappe eller gentage:
     - cookiebanneret (via body.cookie-banner-open, sat af cookie-consent.js)
     - alle eksisterende "Book en samtale"-agtige knapper på siden
     - footeren
     - en eventuel kontaktformular
     - Mortens portrætsektion på forsiden
   Den vises kun, når INGEN af disse er synlige i viewport — dvs. kun på
   almindelige tekstsektioner, hvor den reelt tilfører værdi.
   ========================================================================= */

(function () {
  function init() {
    if (document.querySelector('.mobile-sticky-cta')) return; // undgå dobbelt-indsættelse

    const btn = document.createElement('a');
    btn.className = 'mobile-sticky-cta btn btn-copper';
    btn.href = 'kontakt.html';
    btn.textContent = 'Book en samtale';
    btn.setAttribute('data-clarity-event', 'mobile_sticky_booking_click');
    document.body.appendChild(btn);

    // Elementer, der — hvis synlige i viewport — betyder at sticky-CTA'en skal skjules
    const watchedVisible = new Set();

    function refresh() {
      const cookieOpen = document.body.classList.contains('cookie-banner-open');
      const menuOpen = document.querySelector('.nav-wrap.menu-open');
      const shouldHide = cookieOpen || !!menuOpen || watchedVisible.size > 0;
      btn.classList.toggle('is-hidden', shouldHide);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          watchedVisible.add(entry.target);
        } else {
          watchedVisible.delete(entry.target);
        }
      });
      refresh();
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0 });

    function watch(el) { if (el) io.observe(el); }

    // Eksisterende "primære" bookingknapper på siden (ikke sticky-CTA'en selv)
    document.querySelectorAll('a.btn.btn-copper[href*="kontakt.html"]:not(.nav-quick-cta)').forEach(el => {
      if (el !== btn) watch(el);
    });

    watch(document.querySelector('footer'));
    watch(document.querySelector('#kontaktForm'));
    watch(document.querySelector('.meet-morten'));

    // Cookiebanneret styres via body-klassen (sat af cookie-consent.js) —
    // observeres direkte, så det virker uanset rækkefølgen, scripts kører i.
    const bodyObserver = new MutationObserver(refresh);
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'], childList: true });

    window.addEventListener('resize', refresh);
    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
