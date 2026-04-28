import { slots, slotsByDay } from './data/slots.js';
import { anchors } from './data/anchors.js';
import { renderTimeline, renderNowWhat } from './render.js';
import { activeSlot, formatClock } from './time.js';
import { haversineKm, nearestAnchor, withinKm } from './geo.js';
import { el, replace } from './dom.js';
import {
  getState, setState, subscribe,
  setWeather, markDone, unmarkDone,
  setCurrentDay, setGps
} from './state.js';

const $ = sel => document.querySelector(sel);
const timeline = $('#timeline');
const clock = $('#clock');
const wherePill = $('#where-pill');
const banner = $('#banner');
const nowWhatBody = $('#nowwhat-body');
const nowWhatToggle = $('#nowwhat-toggle');
const nearbyDialog = $('#nearby');
const nearbyList = $('#nearby-list');
const areaPicker = $('#area-picker');

const swapState = new Map();

function applySwap(slot) {
  const idx = swapState.get(slot.id);
  if (idx === 'storm' && slot.alt_ids.length) return { ...slot, primary_id: slot.alt_ids[0] };
  if (typeof idx === 'number' && slot.alt_ids[idx]) return { ...slot, primary_id: slot.alt_ids[idx] };
  return slot;
}

function rerender() {
  const s = getState();
  const now = new Date();
  const todays = slotsByDay(s.currentDay).map(applySwap);
  const active = activeSlot(slots, now, s.doneIds, s.currentDay);

  document.querySelectorAll('.day-tab').forEach(t => {
    t.setAttribute('aria-selected', String(Number(t.dataset.day) === s.currentDay));
  });
  document.querySelectorAll('.weather-btn').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.weather === s.weather));
  });

  replace(timeline, ...renderTimeline(todays, {
    weather: s.weather,
    doneIds: s.doneIds,
    activeId: active?.id
  }));

  replace(nowWhatBody, ...renderNowWhat(active));

  if (s.gpsLast) {
    const near = nearestAnchor(s.gpsLast, anchors);
    const km = Math.round(haversineKm(s.gpsLast, near.coords) * 10) / 10;
    wherePill.textContent = `📍 ${near.name.split(' ')[0]} (~${km} km)`;
  } else {
    wherePill.textContent = 'Pick area';
  }
}

document.querySelectorAll('.day-tab').forEach(t => {
  t.addEventListener('click', () => setCurrentDay(Number(t.dataset.day)));
});

document.querySelectorAll('.weather-btn').forEach(b => {
  b.addEventListener('click', () => setWeather(b.dataset.weather));
});

timeline.addEventListener('click', e => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const slotId = btn.dataset.slotId;
  const action = btn.dataset.action;
  const s = getState();
  if (action === 'done') {
    if (s.doneIds.includes(slotId)) unmarkDone(slotId); else markDone(slotId);
  } else if (action === 'swap') {
    const slot = slots.find(x => x.id === slotId);
    if (!slot.alt_ids.length) return;
    const cur = swapState.get(slotId);
    const next = typeof cur === 'number' ? (cur + 1) % (slot.alt_ids.length + 1) : 0;
    if (next === slot.alt_ids.length) swapState.delete(slotId); else swapState.set(slotId, next);
    rerender();
  } else if (action === 'storm-alt') {
    swapState.set(slotId, 'storm');
    rerender();
  }
});

nowWhatToggle.addEventListener('click', () => {
  const opening = nowWhatBody.hidden;
  nowWhatBody.hidden = !opening;
  nowWhatToggle.setAttribute('aria-expanded', String(opening));
});

function tickClock() {
  clock.textContent = formatClock(new Date());
  rerender();
}
setInterval(tickClock, 60_000);
tickClock();

subscribe(rerender);

// === Pick area fallback ===
wherePill.addEventListener('click', openAreaPicker);

function openAreaPicker() {
  const grid = areaPicker.querySelector('.area-grid');
  const picks = ['hotel', 'bts_asok', 'grand_palace', 'iconsiam', 'chatuchak', 'siam_paragon'];
  const buttons = picks.map(id => {
    const a = anchors.find(x => x.id === id);
    return el('button', {
      data: { pick: id },
      onClick: () => {
        setGps({ lat: a.coords.lat, lon: a.coords.lon });
        areaPicker.close();
      }
    }, `${a.emoji} ${a.name.split(' ')[0]}`);
  });
  replace(grid, ...buttons);
  areaPicker.querySelector('[data-close]').onclick = () => areaPicker.close();
  areaPicker.showModal();
}

// === Default current day to today ===
(function setInitialDay() {
  const today = new Date();
  if (today.getFullYear() === 2026 && today.getMonth() === 3 && today.getDate() === 30) setCurrentDay(1);
  else if (today.getFullYear() === 2026 && today.getMonth() === 4 && today.getDate() === 1) setCurrentDay(2);
  else if (today.getFullYear() === 2026 && today.getMonth() === 4 && today.getDate() === 2) setCurrentDay(3);
})();

// === GPS watching ===
function showBanner(msg) {
  banner.textContent = msg;
  banner.hidden = false;
}
function hideBanner() {
  banner.hidden = true;
}

function startGps() {
  if (!navigator.geolocation) {
    showBanner('GPS not available. Use "Pick area" to set location.');
    return;
  }
  navigator.geolocation.watchPosition(
    pos => {
      setGps({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      hideBanner();
    },
    err => {
      const msg = err.code === 1 ? 'GPS denied. Use "Pick area" to set location.' : 'GPS unavailable.';
      showBanner(msg);
    },
    { enableHighAccuracy: false, maximumAge: 60_000, timeout: 15_000 }
  );
}

startGps();
