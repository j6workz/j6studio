const KEY = 'bangkok-v2-state';
const initial = {
  weather: 'sunny',
  doneIds: [],
  currentDay: 1,
  gpsLast: null,
  signedInUser: null
};

const listeners = new Set();
let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...initial };
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return { ...initial };
  }
}

function persist() {
  try {
    const { weather, doneIds, currentDay, gpsLast } = state;
    localStorage.setItem(KEY, JSON.stringify({ weather, doneIds, currentDay, gpsLast }));
  } catch {}
}

export function getState() { return state; }
export function setState(patch) {
  state = { ...state, ...patch };
  persist();
  for (const fn of listeners) fn(state);
}
export function subscribe(fn) {
  listeners.add(fn);
  fn(state);
  return () => listeners.delete(fn);
}

export function setWeather(w) { setState({ weather: w }); }
export function markDone(slotId) {
  if (!state.doneIds.includes(slotId)) {
    setState({ doneIds: [...state.doneIds, slotId] });
  }
}
export function unmarkDone(slotId) {
  setState({ doneIds: state.doneIds.filter(id => id !== slotId) });
}
export function setCurrentDay(d) { setState({ currentDay: d }); }
export function setGps(p) { setState({ gpsLast: { ...p, ts: Date.now() } }); }
