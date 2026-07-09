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

  // Contact form: uses a real mail service (Formspree/Resend) when an endpoint
  // has been saved under Admin → Indstillinger; otherwise falls back to a
  // prefilled mailto link so the form always works, even with zero setup.
  const kf = document.getElementById('kontaktForm');
  if(kf){
    kf.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = kf.name.value.trim();
      const email = kf.email.value.trim();
      const message = kf.message.value.trim();
      const submitBtn = kf.querySelector('button[type="submit"]');
      const statusEl = kf.querySelector('.kf-status') || (() => {
        const p = document.createElement('p');
        p.className = 'kf-status';
        p.style.cssText = 'font-size:.82rem;margin-top:10px';
        kf.appendChild(p);
        return p;
      })();

      let endpoint = '';
      try {
        if (window.MFGStore) {
          const content = await window.MFGStore.getAll();
          endpoint = content['config-form-endpoint'] || '';
        }
      } catch (err) { /* fall through to mailto */ }

      if (endpoint) {
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sender …'; }
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
          });
          if (res.ok) {
            statusEl.textContent = 'Tak — din besked er sendt.';
            statusEl.style.color = 'var(--copper-light)';
            kf.reset();
          } else {
            throw new Error('Endpoint svarede ' + res.status);
          }
        } catch (err) {
          console.warn('MFG contact form: endpoint submission failed, falling back to mailto.', err);
          openMailto(name, email, message);
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send besked'; }
        }
      } else {
        openMailto(name, email, message);
      }
    });
  }

  function openMailto(name, email, message){
    const subject = encodeURIComponent('Henvendelse fra ' + name + ' via mfgadvisory.dk');
    const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = 'mailto:morten@mfgadvisory.dk?subject=' + subject + '&body=' + body;
  }
})();
