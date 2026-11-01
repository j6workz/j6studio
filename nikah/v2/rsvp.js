import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAt20QdTZTO0bTW06Qu8ln-Nxzklwf1p7o",
  authDomain: "rendezvous-now.firebaseapp.com",
  projectId: "rendezvous-now",
  storageBucket: "rendezvous-now.firebasestorage.app",
  messagingSenderId: "615898334762",
  appId: "1:615898334762:web:8ab7c05a746d2e81d7a553"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById('rsvpForm');
const submitBtn = document.getElementById('rsvpSubmit');
const status = document.getElementById('rsvpStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const name = (fd.get('name') || '').toString().trim();
  const attending = fd.get('attending');
  const guestsRaw = (fd.get('guests') || '').toString().trim();
  const guests = guestsRaw ? Math.max(0, Math.min(20, parseInt(guestsRaw, 10) || 0)) : (attending === 'yes' ? 1 : 0);
  const phone = (fd.get('phone') || '').toString().trim();
  const message = (fd.get('message') || '').toString().trim();

  if (!name || !attending) return;

  const t = window.i18nText || ((k) => k);
  submitBtn.disabled = true;
  submitBtn.textContent = t('rsvp.submitting');
  status.className = 'rsvp-status';

  try {
    await addDoc(collection(db, 'rsvps'), {
      name, attending, guests, phone, message,
      source: 'v2',
      submitted_at: serverTimestamp()
    });
    form.reset();
    form.style.display = 'none';
    status.textContent = t(attending === 'yes' ? 'rsvp.thanks.yes' : 'rsvp.thanks.no').replace('{name}', name);
    status.classList.add('show', 'ok');
  } catch (err) {
    status.textContent = t('rsvp.error');
    status.classList.add('show', 'err');
    submitBtn.disabled = false;
    submitBtn.textContent = t('rsvp.submit');
  }
});
