(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- guest name (?to=Name) ----------
  const guestEl = document.getElementById('guestName');
  if (guestEl && window.nikahGuestName) guestEl.textContent = window.nikahGuestName;

  // ---------- scroll reveal (started once the cover lifts) ----------
  document.querySelectorAll('[data-anim]').forEach((el) => {
    const d = parseInt(el.getAttribute('data-delay') || '0', 10);
    if (d) el.style.transitionDelay = d + 'ms';
  });
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting){ e.target.classList.add('in'); revealer.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  function startReveals(){
    document.querySelectorAll('[data-anim]').forEach((el) => revealer.observe(el));
  }

  // ---------- cover ----------
  const cover = document.getElementById('cover');
  document.getElementById('openBtn').addEventListener('click', () => {
    window.scrollTo(0, 0);
    cover.classList.add('open');
    document.body.classList.remove('locked');
    startReveals();
    setTimeout(() => { cover.style.display = 'none'; }, 1500);
  });

  // ---------- falling leaves & petals ----------
  if (!reduceMotion){
    const layer = document.getElementById('petals');
    const leaves = ['assets/leaf-a.webp', 'assets/leaf-b.webp'];
    for (let i = 0; i < 16; i++){
      const usePetal = i % 3 === 0;
      const el = usePetal ? document.createElement('i') : document.createElement('img');
      const size = usePetal ? 8 + Math.random() * 8 : 16 + Math.random() * 16;
      if (!usePetal){ el.src = leaves[i % leaves.length]; el.alt = ''; }
      el.style.left = (Math.random() * 100) + '%';
      el.style.width = size + 'px';
      if (usePetal) el.style.height = (size * 0.75) + 'px';
      el.style.opacity = (0.55 + Math.random() * 0.4).toFixed(2);
      el.style.setProperty('--dx', (Math.random() * 160 - 80).toFixed(0) + 'px');
      el.style.setProperty('--rot', (180 + Math.random() * 540).toFixed(0) + 'deg');
      el.style.animationDuration = (10 + Math.random() * 9).toFixed(1) + 's';
      el.style.animationDelay = (-Math.random() * 18).toFixed(1) + 's';
      layer.appendChild(el);
    }
  }

  // ---------- parallax on scenic backgrounds ----------
  const parallax = Array.from(document.querySelectorAll('.parallax'));
  const toTop = document.getElementById('toTop');
  let ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const vh = window.innerHeight;
      if (!reduceMotion){
        parallax.forEach((bg) => {
          const r = bg.parentElement.getBoundingClientRect();
          if (r.bottom < -100 || r.top > vh + 100) return;
          const offset = (r.top + r.height / 2 - vh / 2) * -0.18;
          bg.style.transform = `translate3d(0,${offset.toFixed(1)}px,0)`;
        });
      }
      toTop.classList.toggle('show', window.scrollY > 700);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---------- countdown ----------
  const target = new Date('2026-11-11T11:00:00+07:00').getTime();
  const ids = ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'].map((id) => document.getElementById(id));
  function tick(){
    const diff = Math.max(0, target - Date.now());
    const parts = [Math.floor(diff / 86400000), Math.floor(diff % 86400000 / 3600000), Math.floor(diff % 3600000 / 60000), Math.floor(diff % 60000 / 1000)];
    parts.forEach((v, i) => { ids[i].textContent = String(v).padStart(2, '0'); });
  }
  tick(); setInterval(tick, 1000);

  // ---------- add to Google Calendar (11:00–15:00 WIB = 04:00–08:00 UTC) ----------
  const cal = new URL('https://calendar.google.com/calendar/render');
  cal.searchParams.set('action', 'TEMPLATE');
  cal.searchParams.set('text', 'Akad Nikah & Resepsi — Jawahar & Ferina');
  cal.searchParams.set('dates', '20261111T040000Z/20261111T080000Z');
  cal.searchParams.set('location', 'KUA Kecamatan Kemayoran, Jakarta');
  cal.searchParams.set('details', 'Akad Nikah 11:00 WIB · KUA Kecamatan Kemayoran\nResepsi 12:00–15:00 WIB · Ayda Hotel, Jakarta\n' + location.href.split('?')[0]);
  document.getElementById('calBtn').href = cal.toString();

  // ---------- copy account number ----------
  const copyBtn = document.getElementById('copyBtn');
  copyBtn.addEventListener('click', async () => {
    const digits = document.getElementById('accNum').textContent.replace(/\D/g, '');
    try { await navigator.clipboard.writeText(digits); } catch (e) { return; }
    const label = copyBtn.querySelector('span');
    copyBtn.classList.add('done');
    label.textContent = window.i18nText('gift.copied');
    setTimeout(() => { copyBtn.classList.remove('done'); label.textContent = window.i18nText('gift.copy'); }, 1800);
  });

  // ---------- lightbox ----------
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  document.querySelectorAll('[data-full]').forEach((el) => {
    el.addEventListener('click', () => { lbImg.src = el.getAttribute('data-full'); lb.classList.add('show'); });
  });
  lb.addEventListener('click', () => lb.classList.remove('show'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lb.classList.remove('show'); });
})();
