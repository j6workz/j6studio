(function(){
  // ---------- guest name from ?to= query param ----------
  const params = new URLSearchParams(window.location.search);
  const guestRaw = (params.get('to') || '').trim();
  const guestNameEl = document.getElementById('guestName');
  if (guestNameEl){
    guestNameEl.textContent = guestRaw ? guestRaw.slice(0, 80) : (window.i18nText ? window.i18nText('cover.guestFallback') : 'Tamu Undangan');
  }
  window.renikahGuestName = guestRaw;

  // ---------- door / cover open ----------
  const cover = document.getElementById('cover');
  const openBtn = document.getElementById('openBtn');
  if (openBtn && cover){
    openBtn.addEventListener('click', () => {
      cover.classList.add('open');
      document.body.classList.remove('locked');
      setTimeout(() => { cover.style.display = 'none'; }, 1100);
    });
  }

  // ---------- countdown ----------
  const target = new Date('2026-11-11T11:00:00+07:00').getTime();
  function tick(){
    const diff = Math.max(0, target - Date.now());
    const d = document.getElementById('cd-days'), h = document.getElementById('cd-hours'),
          m = document.getElementById('cd-mins'), s = document.getElementById('cd-secs');
    if (d) d.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    if (h) h.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    if (m) m.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    if (s) s.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  tick(); setInterval(tick, 1000);

  // ---------- scroll reveal ----------
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));

  // ---------- copy bank account number ----------
  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn){
    copyBtn.addEventListener('click', async () => {
      const accNum = document.querySelector('.bank-row .acc-num');
      const text = accNum ? accNum.textContent.replace(/-/g, '') : '';
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.classList.add('copied');
        const original = copyBtn.textContent;
        copyBtn.textContent = window.i18nText ? window.i18nText('gift.copied') : 'Tersalin!';
        setTimeout(() => { copyBtn.classList.remove('copied'); copyBtn.textContent = original; }, 1800);
      } catch (e) { /* clipboard unavailable — silently ignore */ }
    });
  }
})();
