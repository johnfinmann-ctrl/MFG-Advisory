(function(){
  // Load the external icon sprite (assets/icons/icons.svg) and inject it inline so
  // <svg><use href="#i-name"/></svg> references throughout the page resolve.
  // Requires being served over http(s) — e.g. GitHub Pages or a local dev server —
  // since fetch() of local files is blocked under the file:// protocol.
  fetch('assets/icons/icons.svg')
    .then(r => r.text())
    .then(svgText => {
      const wrap = document.createElement('div');
      wrap.setAttribute('hidden', '');
      wrap.innerHTML = svgText;
      document.body.insertBefore(wrap, document.body.firstChild);
    })
    .catch(() => {
      console.warn('MFG icon sprite could not be loaded (assets/icons/icons.svg). Icons will be blank if opened via file:// — serve the project over http(s) instead.');
    });

  const PAGES = ['mennesker','ledelse','kultur','forretning','cases','om','kontakt'];
  const needle = document.getElementById('needle');

  function showPage(name){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    const el = document.getElementById('page-'+name);
    if(el) el.classList.add('active');
  }

  function setActiveNav(name){
    document.querySelectorAll('.main-nav a, .logo').forEach(a=>{
      a.classList.toggle('active', a.dataset.nav === name);
    });
  }

  function route(){
    const raw = (location.hash || '').replace('#','');
    if(PAGES.includes(raw)){
      showPage(raw);
      setActiveNav(raw);
      window.scrollTo(0,0);
    } else {
      showPage('home');
      setActiveNav('home');
      if(raw){
        setTimeout(()=>{
          const el = document.getElementById(raw);
          if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
        }, 60);
      }
    }
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('DOMContentLoaded', route);
  route();

  // Cosmetic needle rotation when a compass direction is chosen
  document.querySelectorAll('.dir-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(needle) needle.style.transform = 'translate(-50%,-100%) rotate('+btn.dataset.angle+'deg)';
    });
  });

  // Case teasers: navigate to the subpage, then scroll to the specific case card
  document.querySelectorAll('.case-teaser').forEach(link=>{
    link.addEventListener('click', ()=>{
      const caseId = link.dataset.case;
      if(!caseId) return;
      setTimeout(()=>{
        const el = document.getElementById(caseId);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }, 120);
    });
  });

  // Contact form: build a prefilled mailto (no backend yet — swap for a real form service later)
  const kf = document.getElementById('kontaktForm');
  if(kf){
    kf.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = kf.name.value.trim();
      const email = kf.email.value.trim();
      const message = kf.message.value.trim();
      const subject = encodeURIComponent('Henvendelse fra ' + name + ' via mfgadvisory.dk');
      const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = 'mailto:morten@mfgadvisory.dk?subject=' + subject + '&body=' + body;
    });
  }
})();
