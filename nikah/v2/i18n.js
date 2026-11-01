(function(){
  const STRINGS = {
    en: {
      'nav.v1': '← Simple version',
      'hero.eyebrow': 'A story before the Nikah',
      'hero.scroll': 'SCROLL TO BEGIN',

      'ch1.eyebrow': 'CHAPTER ONE',
      'ch1.title': 'A Match, Almost Missed',
      'ch1.body': "We matched on a dating app — but she wasn't so sure about meeting a stranger. So I called her, and gently talked her into saying yes.",

      'ch2.eyebrow': '20 APRIL 2025',
      'ch2.title': 'We Finally Met',
      'ch2.body': "What began as a simple meeting became the start of everything. We've counted this as our day one ever since.",

      'ch3.eyebrow': 'THE WEEKS AFTER',
      'ch3.title': 'Falling, Quietly and Surely',
      'ch3.body': 'We kept meeting. Somewhere in those weeks, without either of us announcing it, we had already fallen in love.',

      'ch4.eyebrow': 'EVERY WEEKEND',
      'ch4.title': 'Our Weekend Kitchen',
      'ch4.body': "Every weekend she'd come over to Kuala Lumpur, and we'd cook together. She bakes the best cakes and bread — I've gotten a little (sikit) fat on her love, and I regret nothing.",

      'ch5.eyebrow': 'AUGUST 2025 · MALAYSIA',
      'ch5.title': 'Fireflies, and a Calico Named KuaCham',
      'ch5.body': 'We went out one night to watch fireflies — and came home with our first rescue, a calico we named KuaCham. Our little family had begun.',

      'ch6.eyebrow': 'SIX MONTHS IN',
      'ch6.title': 'Meeting My Family, From Miles Away',
      'ch6.body': 'I introduced Ferina to my family in India over a video call — across the distance, but never far from their hearts.',

      'ch7.eyebrow': 'DEC 2025 – JUL 2026',
      'ch7.title': 'Our Family Kept Growing',
      'ch7.body': 'Jessy joined us next, then Creamy, then Yuzu — each one a new reason to love each other more. Four cats, one home, endless love.',

      'ch8.eyebrow': 'SEPTEMBER 2026 · INDIA',
      'ch8.title': 'Home, At Last',
      'ch8.body': 'I brought Ferina to India for my housewarming, and she met my family in person for the first time. Everyone fell for her just as I had — that\'s when we knew it was time.',

      'ch9.eyebrow': '11 NOVEMBER 2026 · JAKARTA',
      'ch9.title': 'The Nikah',
      'ch9.body': 'With gratitude to Allah and the blessings of both our families, we begin our forever.',

      'events.akad.title': 'Akad Nikah',
      'events.akad.when': 'Wednesday, 11 November 2026 · 11:00 AM WIB',
      'events.reception.title': 'Reception',
      'events.reception.when': 'Wednesday, 11 November 2026 · 12:00 PM – 3:00 PM WIB',

      'rsvp.eyebrow': 'KINDLY RESPOND BY 8 NOVEMBER',
      'rsvp.heading': 'RSVP',
      'rsvp.lead': "Let us know if you'll be able to join us — it helps us plan the day.",
      'rsvp.name.label': 'Full name',
      'rsvp.name.placeholder': 'Your name',
      'rsvp.attending.label': 'Will you be attending?',
      'rsvp.attending.yes': '✓ Joyfully attending',
      'rsvp.attending.no': "Can't make it",
      'rsvp.guests.label': 'Number of guests (including you)',
      'rsvp.guests.placeholder': 'e.g. 2',
      'rsvp.phone.label': 'Phone / WhatsApp',
      'rsvp.phone.placeholder': 'For updates, optional',
      'rsvp.message.label': 'Message to the couple (optional)',
      'rsvp.message.placeholder': 'Leave us a note...',
      'rsvp.submit': 'Send RSVP',
      'rsvp.submitting': 'Sending...',
      'rsvp.note': 'Your response goes straight to us — thank you for letting us know.',
      'rsvp.thanks.yes': "Thank you, {name}! We can't wait to celebrate with you. 🤍",
      'rsvp.thanks.no': "Thank you for letting us know, {name}. You'll be missed!",
      'rsvp.error': 'Something went wrong sending your RSVP — please try again, or message us directly.',

      'footer.eyebrow': 'THE COUNTDOWN BEGINS',
      'footer.days': 'DAYS', 'footer.hours': 'HOURS', 'footer.mins': 'MINUTES', 'footer.secs': 'SECONDS',
      'footer.note': "With Allah's blessing and our families' love, we can't wait to celebrate this day with you.",
      'doc.title': 'Jawahar & Ferina — Our Story'
    },
    id: {
      'nav.v1': '← Versi sederhana',
      'hero.eyebrow': 'Sebuah kisah sebelum akad',
      'hero.scroll': 'GULIR UNTUK MEMULAI',

      'ch1.eyebrow': 'BAB SATU',
      'ch1.title': 'Pertemuan yang Hampir Tak Terjadi',
      'ch1.body': 'Kami bertemu lewat aplikasi kencan — tapi dia ragu untuk bertemu orang asing. Jadi aku meneleponnya, dan perlahan meyakinkannya untuk bilang iya.',

      'ch2.eyebrow': '20 APRIL 2025',
      'ch2.title': 'Akhirnya Kami Bertemu',
      'ch2.body': 'Yang awalnya hanya pertemuan biasa, menjadi awal dari segalanya. Sejak itu, kami menganggap hari ini sebagai hari pertama kami.',

      'ch3.eyebrow': 'MINGGU-MINGGU SETELAHNYA',
      'ch3.title': 'Jatuh Cinta, Perlahan namun Pasti',
      'ch3.body': 'Kami terus bertemu. Entah sejak kapan, tanpa kami sadari, kami sudah jatuh cinta.',

      'ch4.eyebrow': 'SETIAP AKHIR PEKAN',
      'ch4.title': 'Dapur Akhir Pekan Kami',
      'ch4.body': 'Setiap akhir pekan dia datang ke Kuala Lumpur, dan kami memasak bersama. Dia pandai membuat kue dan roti — aku jadi sedikit gemuk karena cintanya, dan aku tidak menyesalinya sama sekali.',

      'ch5.eyebrow': 'AGUSTUS 2025 · MALAYSIA',
      'ch5.title': 'Kunang-Kunang, dan Seekor Kucing Calico Bernama KuaCham',
      'ch5.body': 'Suatu malam kami pergi menonton kunang-kunang — dan pulang membawa kucing penyelamatan pertama kami, seekor calico yang kami beri nama KuaCham. Keluarga kecil kami pun dimulai.',

      'ch6.eyebrow': 'ENAM BULAN KEMUDIAN',
      'ch6.title': 'Mengenalkan Keluargaku, dari Jarak Jauh',
      'ch6.body': 'Aku mengenalkan Ferina kepada keluargaku di India lewat panggilan video — jauh secara jarak, namun tak pernah jauh dari hati mereka.',

      'ch7.eyebrow': 'DES 2025 – JUL 2026',
      'ch7.title': 'Keluarga Kami Terus Bertambah',
      'ch7.body': 'Jessy bergabung bersama kami, lalu Creamy, lalu Yuzu — masing-masing menjadi alasan baru untuk semakin mencintai satu sama lain. Empat kucing, satu rumah, cinta tanpa batas.',

      'ch8.eyebrow': 'SEPTEMBER 2026 · INDIA',
      'ch8.title': 'Akhirnya, Pulang ke Rumah',
      'ch8.body': 'Aku membawa Ferina ke India untuk acara syukuran rumah baruku, dan dia bertemu keluargaku secara langsung untuk pertama kalinya. Semua orang jatuh hati padanya, sama seperti aku — saat itulah kami tahu, sudah waktunya.',

      'ch9.eyebrow': '11 NOVEMBER 2026 · JAKARTA',
      'ch9.title': 'Akad Nikah',
      'ch9.body': 'Dengan rasa syukur kepada Allah dan restu dari kedua keluarga kami, kami memulai perjalanan selamanya.',

      'events.akad.title': 'Akad Nikah',
      'events.akad.when': 'Rabu, 11 November 2026 · 11:00 WIB',
      'events.reception.title': 'Resepsi',
      'events.reception.when': 'Rabu, 11 November 2026 · 12:00 – 15:00 WIB',

      'rsvp.eyebrow': 'MOHON KONFIRMASI SEBELUM 8 NOVEMBER',
      'rsvp.heading': 'RSVP',
      'rsvp.lead': 'Beri tahu kami jika Anda bisa hadir — ini akan membantu kami mempersiapkan acara.',
      'rsvp.name.label': 'Nama lengkap',
      'rsvp.name.placeholder': 'Nama Anda',
      'rsvp.attending.label': 'Apakah Anda akan hadir?',
      'rsvp.attending.yes': '✓ Dengan senang hati hadir',
      'rsvp.attending.no': 'Tidak bisa hadir',
      'rsvp.guests.label': 'Jumlah tamu (termasuk Anda)',
      'rsvp.guests.placeholder': 'misalnya 2',
      'rsvp.phone.label': 'Telepon / WhatsApp',
      'rsvp.phone.placeholder': 'Untuk info lebih lanjut, opsional',
      'rsvp.message.label': 'Pesan untuk pengantin (opsional)',
      'rsvp.message.placeholder': 'Tulis pesan untuk kami...',
      'rsvp.submit': 'Kirim RSVP',
      'rsvp.submitting': 'Mengirim...',
      'rsvp.note': 'Jawaban Anda akan langsung sampai ke kami — terima kasih sudah memberi tahu kami.',
      'rsvp.thanks.yes': 'Terima kasih, {name}! Kami tidak sabar untuk merayakan bersama Anda. 🤍',
      'rsvp.thanks.no': 'Terima kasih sudah memberi tahu kami, {name}. Anda akan sangat dirindukan!',
      'rsvp.error': 'Maaf, terjadi kesalahan saat mengirim RSVP Anda — silakan coba lagi, atau hubungi kami langsung.',

      'footer.eyebrow': 'HITUNG MUNDUR DIMULAI',
      'footer.days': 'HARI', 'footer.hours': 'JAM', 'footer.mins': 'MENIT', 'footer.secs': 'DETIK',
      'footer.note': 'Dengan izin Allah dan restu kedua keluarga, kami tidak sabar untuk merayakan hari ini bersama Anda.',
      'doc.title': 'Jawahar & Ferina — Kisah Kami'
    }
  };

  let currentLocale = 'en';
  function t(key){ return (STRINGS[currentLocale] && STRINGS[currentLocale][key]) || STRINGS.en[key] || key; }
  window.i18nText = t;

  function applyLocale(lang){
    if (!STRINGS[lang]) lang = 'en';
    currentLocale = lang;
    document.documentElement.lang = lang;
    document.title = t('doc.title');
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('.lang-toggle button').forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }
  window.applyNikahLocale = applyLocale;

  function setLocale(lang, persist){
    applyLocale(lang);
    if (persist) { try { localStorage.setItem('nikah_locale', lang); } catch(e){} }
  }

  document.querySelectorAll('.lang-toggle button').forEach(function(btn){
    btn.addEventListener('click', function(){ setLocale(btn.getAttribute('data-lang'), true); });
  });

  let saved = null;
  try { saved = localStorage.getItem('nikah_locale'); } catch(e){}
  if (saved === 'en' || saved === 'id') {
    applyLocale(saved);
  } else {
    const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'en').toLowerCase();
    applyLocale(browserLang.startsWith('id') ? 'id' : 'en');

    const ctrl = new AbortController();
    const timeout = setTimeout(function(){ ctrl.abort(); }, 2500);
    fetch('https://get.geojs.io/v1/ip/country.json', { signal: ctrl.signal })
      .then(function(r){ return r.json(); })
      .then(function(data){
        clearTimeout(timeout);
        if (data && data.country === 'ID') applyLocale('id');
      })
      .catch(function(){});
  }
})();
