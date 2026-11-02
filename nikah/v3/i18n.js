(function(){
  const STRINGS = {
    id: {
      'doc.title': 'Jawahar & Ferina — Undangan Pernikahan',
      'nav.other': 'Versi lain →',
      'cover.to': 'Kepada Yth. Bapak/Ibu/Saudara/i',
      'cover.guestFallback': 'Tamu Undangan',
      'cover.open': '✦ Buka Undangan',
      'hero.eyebrow': 'Dengan restu kedua keluarga kami',
      'hero.date': '11 NOVEMBER 2026 · JAKARTA',
      'hero.scroll': 'GULIR',
      'verse.eyebrow': 'SEBUAH AYAT UNTUK AWAL KAMI',
      'verse.translation': '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."',
      'verse.citation': "QS. Ar-Rūm : 21",
      'verse.formal': "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan kami.",
      'profile.groom.parents': 'Putra dari Bapak [nama] & Ibu [nama]',
      'profile.bride.parents': 'Putri dari Bapak [nama] & Ibu [nama]',
      'countdown.eyebrow': 'MENUJU HARI BAHAGIA',
      'events.eyebrow': 'SIMPAN TANGGALNYA',
      'events.heading': 'Acara Pernikahan Kami',
      'events.akad.title': 'Akad Nikah',
      'events.akad.when': 'Rabu, 11 November 2026 · 11:00 WIB',
      'events.reception.title': 'Resepsi',
      'events.reception.when': 'Rabu, 11 November 2026 · 12:00 – 15:00 WIB',
      'events.mapBtn': 'Lihat Lokasi',
      'story.eyebrow': 'KISAH KAMI',
      'story.heading': 'Perjalanan Cinta Kami',
      'ch1.eyebrow': 'BAB SATU', 'ch1.title': 'Pertemuan yang Hampir Tak Terjadi',
      'ch1.body': 'Kami bertemu lewat aplikasi kencan — tapi dia ragu untuk bertemu orang asing. Jadi aku meneleponnya, dan perlahan meyakinkannya untuk bilang iya.',
      'ch2.eyebrow': '20 APRIL 2025', 'ch2.title': 'Akhirnya Kami Bertemu',
      'ch2.body': 'Yang awalnya hanya pertemuan biasa, menjadi awal dari segalanya. Sejak itu, kami menganggap hari ini sebagai hari pertama kami.',
      'ch3.eyebrow': 'MINGGU-MINGGU SETELAHNYA', 'ch3.title': 'Jatuh Cinta, Perlahan namun Pasti',
      'ch3.body': 'Kami terus bertemu. Entah sejak kapan, tanpa kami sadari, kami sudah jatuh cinta.',
      'ch4.eyebrow': 'SETIAP AKHIR PEKAN', 'ch4.title': 'Dapur Akhir Pekan Kami',
      'ch4.body': 'Setiap akhir pekan dia datang ke Kuala Lumpur, dan kami memasak bersama. Dia pandai membuat kue dan roti — aku jadi sedikit gemuk karena cintanya, dan aku tidak menyesalinya sama sekali.',
      'ch5.eyebrow': 'AGUSTUS 2025 · MALAYSIA', 'ch5.title': 'Kunang-Kunang, dan Seekor Kucing Calico Bernama KuaCham',
      'ch5.body': 'Suatu malam kami pergi menonton kunang-kunang — dan pulang membawa kucing penyelamatan pertama kami, seekor calico yang kami beri nama KuaCham.',
      'ch6.eyebrow': 'ENAM BULAN KEMUDIAN', 'ch6.title': 'Mengenalkan Keluargaku, dari Jarak Jauh',
      'ch6.body': 'Aku mengenalkan Ferina kepada keluargaku di India lewat panggilan video — jauh secara jarak, namun tak pernah jauh dari hati mereka.',
      'ch7.eyebrow': 'DES 2025 – JUL 2026', 'ch7.title': 'Keluarga Kami Terus Bertambah',
      'ch7.body': 'Jessy bergabung bersama kami, lalu Creamy, lalu Yuzu — empat kucing, satu rumah, cinta tanpa batas.',
      'ch8.eyebrow': 'SEPTEMBER 2026 · INDIA', 'ch8.title': 'Akhirnya, Pulang ke Rumah',
      'ch8.body': 'Aku membawa Ferina ke India untuk acara syukuran rumah baruku, dan dia bertemu keluargaku secara langsung untuk pertama kalinya. Saat itulah kami tahu, sudah waktunya.',
      'gift.eyebrow': 'TANDA KASIH',
      'gift.heading': 'Hadiah Pernikahan',
      'gift.body': 'Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.',
      'gift.copy': 'Salin', 'gift.copied': 'Tersalin!',
      'rsvp.eyebrow': 'MOHON KONFIRMASI SEBELUM 8 NOVEMBER',
      'rsvp.heading': 'Wishes & RSVP',
      'rsvp.lead': 'Beri tahu kami jika Anda bisa hadir, dan tinggalkan doa untuk kami.',
      'rsvp.countYes': 'Hadir', 'rsvp.countNo': 'Tidak Hadir',
      'rsvp.name.label': 'Nama lengkap', 'rsvp.name.placeholder': 'Nama Anda',
      'rsvp.attending.label': 'Apakah Anda akan hadir?',
      'rsvp.attending.yes': '✓ Hadir', 'rsvp.attending.no': 'Tidak bisa hadir',
      'rsvp.guests.label': 'Jumlah tamu (termasuk Anda)', 'rsvp.guests.placeholder': 'misalnya 2',
      'rsvp.phone.label': 'Telepon / WhatsApp', 'rsvp.phone.placeholder': 'Untuk info lebih lanjut, opsional',
      'rsvp.message.label': 'Ucapan & doa untuk pengantin', 'rsvp.message.placeholder': 'Tulis ucapan untuk kami...',
      'rsvp.submit': 'Kirim', 'rsvp.submitting': 'Mengirim...',
      'rsvp.note': 'Jawaban Anda akan langsung sampai ke kami — terima kasih.',
      'rsvp.loading': 'Memuat ucapan...', 'rsvp.empty': 'Jadilah yang pertama mengirim ucapan!',
      'rsvp.thanks.yes': 'Terima kasih, {name}! Kami tidak sabar untuk merayakan bersama Anda. 🤍',
      'rsvp.thanks.no': 'Terima kasih sudah memberi tahu kami, {name}. Anda akan sangat dirindukan!',
      'rsvp.error': 'Maaf, terjadi kesalahan — silakan coba lagi.',
      'footer.days': 'HARI', 'footer.hours': 'JAM', 'footer.mins': 'MENIT', 'footer.secs': 'DETIK',
      'footer.note': 'Dengan izin Allah dan restu kedua keluarga, kami tidak sabar untuk merayakan hari ini bersama Anda.'
    },
    en: {
      'doc.title': 'Jawahar & Ferina — Wedding Invitation',
      'nav.other': 'Other version →',
      'cover.to': 'Dear',
      'cover.guestFallback': 'Honoured Guest',
      'cover.open': '✦ Open Invitation',
      'hero.eyebrow': 'With the blessings of our families',
      'hero.date': '11 NOVEMBER 2026 · JAKARTA',
      'hero.scroll': 'SCROLL',
      'verse.eyebrow': 'A VERSE FOR OUR BEGINNING',
      'verse.translation': '"And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He placed between you affection and mercy. Indeed in that are signs for a people who reflect."',
      'verse.citation': "Qur'an, Surah Ar-Rūm 30:21",
      'verse.formal': "With prayers for Allah's mercy and blessing, we warmly invite you to attend our wedding.",
      'profile.groom.parents': 'Son of Mr. [name] & Mrs. [name]',
      'profile.bride.parents': 'Daughter of Mr. [name] & Mrs. [name]',
      'countdown.eyebrow': 'THE COUNTDOWN BEGINS',
      'events.eyebrow': 'SAVE THE DATE',
      'events.heading': 'Our Celebrations',
      'events.akad.title': 'Akad Nikah',
      'events.akad.when': 'Wednesday, 11 November 2026 · 11:00 AM WIB',
      'events.reception.title': 'Reception',
      'events.reception.when': 'Wednesday, 11 November 2026 · 12:00 PM – 3:00 PM WIB',
      'events.mapBtn': 'View Location',
      'story.eyebrow': 'OUR STORY',
      'story.heading': 'How We Fell in Love',
      'ch1.eyebrow': 'CHAPTER ONE', 'ch1.title': 'A Match, Almost Missed',
      'ch1.body': "We matched on a dating app — but she wasn't so sure about meeting a stranger. So I called her, and gently talked her into saying yes.",
      'ch2.eyebrow': '20 APRIL 2025', 'ch2.title': 'We Finally Met',
      'ch2.body': "What began as a simple meeting became the start of everything. We've counted this as our day one ever since.",
      'ch3.eyebrow': 'THE WEEKS AFTER', 'ch3.title': 'Falling, Quietly and Surely',
      'ch3.body': 'We kept meeting. Somewhere in those weeks, without either of us announcing it, we had already fallen in love.',
      'ch4.eyebrow': 'EVERY WEEKEND', 'ch4.title': 'Our Weekend Kitchen',
      'ch4.body': "Every weekend she'd come over to Kuala Lumpur, and we'd cook together. She bakes the best cakes and bread — I've gotten a little (sikit) fat on her love, and I regret nothing.",
      'ch5.eyebrow': 'AUGUST 2025 · MALAYSIA', 'ch5.title': 'Fireflies, and a Calico Named KuaCham',
      'ch5.body': 'We went out one night to watch fireflies — and came home with our first rescue, a calico we named KuaCham.',
      'ch6.eyebrow': 'SIX MONTHS IN', 'ch6.title': 'Meeting My Family, From Miles Away',
      'ch6.body': 'I introduced Ferina to my family in India over a video call — across the distance, but never far from their hearts.',
      'ch7.eyebrow': 'DEC 2025 – JUL 2026', 'ch7.title': 'Our Family Kept Growing',
      'ch7.body': 'Jessy joined us next, then Creamy, then Yuzu — four cats, one home, endless love.',
      'ch8.eyebrow': 'SEPTEMBER 2026 · INDIA', 'ch8.title': 'Home, At Last',
      'ch8.body': "I brought Ferina to India for my housewarming, and she met my family in person for the first time. That's when we knew it was time.",
      'gift.eyebrow': 'A TOKEN OF LOVE',
      'gift.heading': 'Wedding Gift',
      'gift.body': "Your blessing and prayers mean the world to us. But if you'd like to send a gift, you're welcome to do so cashlessly.",
      'gift.copy': 'Copy', 'gift.copied': 'Copied!',
      'rsvp.eyebrow': 'KINDLY RESPOND BY 8 NOVEMBER',
      'rsvp.heading': 'Wishes & RSVP',
      'rsvp.lead': "Let us know if you'll be able to join us, and leave us a wish.",
      'rsvp.countYes': 'Attending', 'rsvp.countNo': "Can't Attend",
      'rsvp.name.label': 'Full name', 'rsvp.name.placeholder': 'Your name',
      'rsvp.attending.label': 'Will you be attending?',
      'rsvp.attending.yes': '✓ Joyfully attending', 'rsvp.attending.no': "Can't make it",
      'rsvp.guests.label': 'Number of guests (including you)', 'rsvp.guests.placeholder': 'e.g. 2',
      'rsvp.phone.label': 'Phone / WhatsApp', 'rsvp.phone.placeholder': 'For updates, optional',
      'rsvp.message.label': 'Wishes & prayers for the couple', 'rsvp.message.placeholder': 'Leave us a note...',
      'rsvp.submit': 'Send', 'rsvp.submitting': 'Sending...',
      'rsvp.note': 'Your response goes straight to us — thank you.',
      'rsvp.loading': 'Loading wishes...', 'rsvp.empty': 'Be the first to leave a wish!',
      'rsvp.thanks.yes': "Thank you, {name}! We can't wait to celebrate with you. 🤍",
      'rsvp.thanks.no': "Thank you for letting us know, {name}. You'll be missed!",
      'rsvp.error': 'Something went wrong — please try again.',
      'footer.days': 'DAYS', 'footer.hours': 'HOURS', 'footer.mins': 'MINUTES', 'footer.secs': 'SECONDS',
      'footer.note': "With Allah's blessing and our families' love, we can't wait to celebrate this day with you."
    }
  };

  let currentLocale = 'id';
  function t(key){ return (STRINGS[currentLocale] && STRINGS[currentLocale][key]) || STRINGS.id[key] || key; }
  window.i18nText = t;

  function applyLocale(lang){
    if (!STRINGS[lang]) lang = 'id';
    currentLocale = lang;
    document.documentElement.lang = lang;
    document.title = t('doc.title');
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder'))); });
    document.querySelectorAll('.lang-toggle button').forEach((btn) => { btn.classList.toggle('active', btn.getAttribute('data-lang') === lang); });
    const guestNameEl = document.getElementById('guestName');
    if (guestNameEl && !window.renikahGuestName) guestNameEl.textContent = t('cover.guestFallback');
  }
  window.applyNikahLocale = applyLocale;

  function setLocale(lang, persist){
    applyLocale(lang);
    if (persist) { try { localStorage.setItem('nikah_locale', lang); } catch(e){} }
  }

  function wireToggle(){
    document.querySelectorAll('.lang-toggle button').forEach((btn) => {
      btn.addEventListener('click', () => setLocale(btn.getAttribute('data-lang'), true));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireToggle);
  else wireToggle();

  let saved = null;
  try { saved = localStorage.getItem('nikah_locale'); } catch(e){}
  if (saved === 'en' || saved === 'id') {
    applyLocale(saved);
  } else {
    const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'id').toLowerCase();
    applyLocale(browserLang.startsWith('en') ? 'en' : 'id');

    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 2500);
    fetch('https://get.geojs.io/v1/ip/country.json', { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data) => { clearTimeout(timeout); if (data && data.country === 'ID') applyLocale('id'); })
      .catch(() => {});
  }
})();
