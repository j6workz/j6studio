import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut as fbSignOut
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import {
  getFirestore, doc, setDoc, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAt20QdTZTO0bTW06Qu8ln-Nxzklwf1p7o",
  authDomain: "rendezvous-now.firebaseapp.com",
  projectId: "rendezvous-now",
  storageBucket: "rendezvous-now.firebasestorage.app",
  messagingSenderId: "615898334762",
  appId: "1:615898334762:web:8ab7c05a746d2e81d7a553"
};

const ALLOWED_EMAILS = ['j6rockz@gmail.com', 'ferinakhansanabilah@gmail.com'];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const STATE_DOC = doc(db, 'trips/bkk-2026/state/main');

export function onAuth(cb) {
  return onAuthStateChanged(auth, user => {
    if (!user) return cb(null);
    if (!ALLOWED_EMAILS.includes(user.email)) {
      cb({ error: 'not_authorised', email: user.email });
      return;
    }
    cb({ email: user.email, displayName: user.displayName, photoURL: user.photoURL });
  });
}

export async function signIn() {
  await signInWithPopup(auth, provider);
}

export async function signOut() {
  await fbSignOut(auth);
}

export function subscribeState(onUpdate) {
  return onSnapshot(STATE_DOC, snap => {
    if (snap.exists()) onUpdate(snap.data());
    else onUpdate(null);
  });
}

let writeTimer = null;
export function writeState(patch, byEmail) {
  clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    setDoc(STATE_DOC, {
      ...patch,
      last_updated_by: byEmail,
      last_updated_at: serverTimestamp()
    }, { merge: true });
  }, 500);
}
