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

  // Cosmetic needle rotation when a compass direction is chosen (brief flourish before navigation)
  const needle = document.getElementById('needle');
  document.querySelectorAll('.dir-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(needle) needle.style.transform = 'translate(-50%,-100%) rotate('+btn.dataset.angle+'deg)';
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
