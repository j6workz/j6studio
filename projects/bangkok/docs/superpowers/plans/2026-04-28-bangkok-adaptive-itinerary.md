# Bangkok Adaptive Itinerary v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page adaptive Bangkok itinerary at `https://balawedsnaga.j6.studio/projects/bangkok/v2/` that adjusts to live weather, GPS location, and time, with two-phone state sync via Firebase.

**Architecture:** Static HTML + vanilla JS (ES modules), no build step. UI rendered via a `createElement`-based DOM builder (no string-to-HTML, no XSS surface). Pure-logic modules unit-tested via a browser test page. State synced to Firestore behind a Google sign-in whitelisted to two emails. Hosted on GitHub Pages from `j6workz/j6studio:main`, folder `projects/bangkok/v2/`.

**Tech Stack:** Vanilla JavaScript (ES2022 modules), Firebase JS SDK 10.x via CDN, Geolocation API, localStorage. No npm, no bundler, no framework.

**Trip dates:** 30 Apr – 2 May 2026. Plan must be implementable inside 2 days.

---

## File structure

```
projects/bangkok/v2/
├── index.html                 # adaptive shell (UI)
├── style.css                  # design tokens + components (extends v1 palette)
├── app.js                     # entry: bootstraps, wires events
├── state.js                   # state object, localStorage, sync wiring
├── firebase.js                # Firebase init + Google auth + Firestore CRUD
├── geo.js                     # Haversine, nearest-anchor (pure)
├── time.js                    # active-slot computation (pure)
├── dom.js                     # tiny createElement helper (`el()`)
├── render.js                  # DOM renderers (return Element nodes)
├── data/
│   ├── anchors.js             # ~22 spot definitions
│   ├── slots.js               # 3-day plan with primary + alts
│   └── transports.js          # ~45 pre-computed pair routes
└── test/
    ├── index.html             # test runner page
    └── test.js                # pure-function tests (geo + time)
```

**Responsibility per file:**
- `index.html` — DOM skeleton: top bar, day tabs, timeline container, Now-what sheet, sign-in overlay
- `style.css` — all visual styling; extends design tokens from existing v1 `index.html`
- `app.js` — orchestration only; imports everything, registers event listeners on DOMContentLoaded
- `state.js` — single source of truth for runtime state; reads/writes localStorage and Firestore
- `firebase.js` — isolated Firebase concerns; exposes `signIn()`, `signOut()`, `subscribeState()`, `writeState()`
- `geo.js` — pure functions: `haversineKm(a, b)`, `nearestAnchor(point, anchors)`, `withinKm(point, anchors, km)`
- `time.js` — pure functions: `activeSlot(slots, now, doneIds, day)`, `parseHHMM(str)`, `formatClock(date)`
- `dom.js` — `el(tag, props, ...children)` helper that builds DOM trees safely (text auto-escaped via `createTextNode`)
- `render.js` — pure functions returning `Element` nodes for each component (slot, transport, now-what)
- `data/*.js` — static ES module exports of plain objects/arrays
- `test/test.js` — assert helper + tests for `geo.js` and `time.js`

**Why this split:** `geo.js` and `time.js` are pure → unit-testable without DOM. `firebase.js` isolates the only stateful external dep. `render.js` builds DOM via `createElement` so all dynamic text routes through `createTextNode` — no XSS surface. `state.js` is the only mutable hub.

---

## Phase 1 — Static shell + data

### Task 1: Create v2 folder and HTML skeleton

**Files:**
- Create: `projects/bangkok/v2/index.html`

- [ ] **Step 1: Create the directories**

```bash
mkdir -p /Users/jawaharmariselvam/projects/j6.studio/projects/bangkok/v2/data
mkdir -p /Users/jawaharmariselvam/projects/j6.studio/projects/bangkok/v2/test
```

- [ ] **Step 2: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#1E1C18">
  <title>Bangkok · Adaptive</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@400;500;700&display=swap">
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div id="signin" class="signin" aria-hidden="false">
    <div class="signin-card">
      <h1>Bangkok Trip</h1>
      <p>Sign in to sync state across both phones.</p>
      <button id="signin-btn" type="button">Continue with Google</button>
      <p id="signin-error" class="signin-error" hidden></p>
    </div>
  </div>

  <header class="topbar">
    <div class="topbar-left">
      <button class="weather-btn" data-weather="sunny" aria-pressed="false" title="Sunny">☀️</button>
      <button class="weather-btn" data-weather="cloudy" aria-pressed="false" title="Cloudy">☁️</button>
      <button class="weather-btn" data-weather="storm" aria-pressed="false" title="Storm">⛈</button>
    </div>
    <div class="topbar-center">
      <span id="clock" class="clock">--:--</span>
    </div>
    <div class="topbar-right">
      <button id="where-pill" class="where-pill" type="button">Pick area</button>
      <button id="signout-btn" class="signout-btn" type="button" hidden>↗</button>
    </div>
  </header>

  <div id="banner" class="banner" hidden></div>

  <nav class="day-tabs" role="tablist" aria-label="Day selector">
    <button class="day-tab" data-day="1" role="tab" aria-selected="false">Thu 30 Apr</button>
    <button class="day-tab" data-day="2" role="tab" aria-selected="false">Fri 1 May</button>
    <button class="day-tab" data-day="3" role="tab" aria-selected="false">Sat 2 May</button>
  </nav>

  <main id="timeline" class="timeline" aria-live="polite"></main>

  <aside id="nowwhat" class="nowwhat" aria-label="Current decision">
    <button id="nowwhat-toggle" class="nowwhat-toggle" type="button" aria-expanded="false">Now what?</button>
    <div id="nowwhat-body" class="nowwhat-body" hidden></div>
  </aside>

  <dialog id="area-picker" class="area-picker">
    <h3>Where are you right now?</h3>
    <div class="area-grid"></div>
    <button data-close type="button">Close</button>
  </dialog>

  <dialog id="nearby" class="nearby">
    <h3>Nearby</h3>
    <ul id="nearby-list" class="nearby-list"></ul>
    <button data-close type="button">Close</button>
  </dialog>

  <script type="module" src="./app.js"></script>
</body>
</html>
```

- [ ] **Step 3: Open in browser**

Open `file:///Users/jawaharmariselvam/projects/j6.studio/projects/bangkok/v2/index.html` in Chrome.

Expected: blank page, console 404s for `style.css` and `app.js` (next tasks fix).

- [ ] **Step 4: Commit**

```bash
cd /Users/jawaharmariselvam/projects/j6.studio
git add projects/bangkok/v2/index.html
git commit -m "bangkok: scaffold v2 HTML shell"
```

---

### Task 2: Write `style.css`

**Files:**
- Create: `projects/bangkok/v2/style.css`

- [ ] **Step 1: Write the file**

```css
:root {
  --cream: #F5F0E8;
  --warm-white: #FDFAF5;
  --charcoal: #1E1C18;
  --mid: #5A5548;
  --faint: #B8B0A0;
  --gold: #C9A84C;
  --gold-light: #F0DFA0;
  --gold-pale: #FBF6E6;
  --rust: #B85C38;
  --teal: #2A7D6F;
  --teal-light: #E6F5F2;
  --sky: #3B7FB5;
  --sky-light: #E6F1FA;
  --border: #DDD8CC;
  --serif: 'Cormorant Garamond', Georgia, serif;
  --sans: 'DM Sans', system-ui, sans-serif;
  --shadow-md: 0 8px 24px rgba(0,0,0,.10);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--sans);
  background: var(--cream);
  color: var(--charcoal);
  line-height: 1.6;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
  padding-bottom: 96px;
}
.hidden { display: none !important; }

.signin {
  position: fixed; inset: 0;
  background: var(--charcoal);
  display: flex; align-items: center; justify-content: center;
  padding: 32px;
  z-index: 200;
}
.signin-card {
  background: var(--warm-white);
  border-radius: 16px;
  padding: 40px 28px;
  max-width: 360px;
  text-align: center;
}
.signin-card h1 { font-family: var(--serif); font-size: 36px; font-weight: 300; margin-bottom: 12px; }
.signin-card p { color: var(--mid); margin-bottom: 24px; font-size: 14px; }
.signin-card button {
  background: var(--charcoal); color: var(--warm-white);
  border: none; border-radius: 999px;
  padding: 14px 28px; font-size: 14px; font-weight: 500;
  cursor: pointer; width: 100%;
}
.signin-error { color: var(--rust); font-size: 13px; margin-top: 16px; }

.topbar {
  position: sticky; top: 0; z-index: 100;
  background: rgba(245,240,232,.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
  display: grid; grid-template-columns: auto 1fr auto;
  gap: 8px; align-items: center;
  padding: 10px 16px;
}
.topbar-left { display: flex; gap: 4px; }
.weather-btn {
  background: transparent; border: 1px solid transparent;
  font-size: 18px; padding: 4px 8px; border-radius: 8px;
  cursor: pointer; opacity: .4;
}
.weather-btn[aria-pressed="true"] { opacity: 1; border-color: var(--gold); background: var(--gold-pale); }
.topbar-center { text-align: center; }
.clock { font-family: var(--serif); font-size: 18px; font-style: italic; color: var(--mid); }
.topbar-right { display: flex; gap: 6px; align-items: center; }
.where-pill {
  background: var(--warm-white); border: 1px solid var(--border);
  border-radius: 999px; padding: 6px 12px;
  font-size: 12px; font-weight: 500; color: var(--mid);
  cursor: pointer; max-width: 180px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.signout-btn { background: transparent; border: 1px solid var(--border); border-radius: 8px; padding: 4px 8px; font-size: 12px; cursor: pointer; }

.banner {
  background: #FEF3E2; color: #7A4A0A;
  border-bottom: 1px solid #E07B39;
  padding: 8px 16px; font-size: 13px; text-align: center;
}

.day-tabs {
  display: flex; gap: 4px; padding: 12px 16px;
  overflow-x: auto; scrollbar-width: none;
  background: var(--cream); border-bottom: 1px solid var(--border);
}
.day-tabs::-webkit-scrollbar { display: none; }
.day-tab {
  background: var(--warm-white); border: 1px solid var(--border);
  border-radius: 999px; padding: 8px 16px;
  font-size: 13px; font-weight: 500; color: var(--mid);
  cursor: pointer; white-space: nowrap;
}
.day-tab[aria-selected="true"] { background: var(--charcoal); color: var(--warm-white); border-color: var(--charcoal); }

.timeline { max-width: 720px; margin: 0 auto; padding: 16px; }

.slot {
  background: var(--warm-white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  position: relative;
  transition: opacity .2s;
}
.slot.is-active { box-shadow: var(--shadow-md); border-color: var(--gold); }
.slot.is-done { opacity: .55; }
.slot.is-storm-blocked .slot-primary { opacity: .45; }

.slot-time { font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
.slot-primary { display: flex; gap: 12px; align-items: flex-start; }
.slot-emoji { font-size: 22px; flex-shrink: 0; }
.slot-info { flex: 1; min-width: 0; }
.slot-name { font-family: var(--serif); font-size: 18px; font-weight: 600; margin-bottom: 2px; }
.slot-meta { font-size: 12px; color: var(--mid); margin-bottom: 6px; }
.slot-notes { font-size: 13px; color: var(--mid); line-height: 1.6; margin-bottom: 8px; }
.slot-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; }
.tag { font-size: 10px; font-weight: 500; letter-spacing: .04em; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; }
.tag-halal-friendly { background: #EAF6EE; color: #2A7D3F; }
.tag-non-halal { background: #FDE9E5; color: var(--rust); }
.tag-plus-size { background: #F5EEF8; color: #6A3D8E; }
.tag-indoor { background: var(--sky-light); color: var(--sky); }
.tag-must-see { background: var(--gold-pale); color: #8A6A10; }

.slot-actions { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.slot-actions button { background: var(--warm-white); border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
.slot-actions a { font-size: 12px; color: var(--sky); text-decoration: none; }
.slot-actions .btn-done { background: var(--charcoal); color: var(--warm-white); border-color: var(--charcoal); }
.slot-actions .btn-storm-alt { background: var(--rust); color: var(--warm-white); border-color: var(--rust); }

.slot-alts { margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--border); }
.slot-alts summary { font-size: 12px; color: var(--mid); cursor: pointer; }
.slot-alt { margin-top: 8px; padding: 10px; background: var(--cream); border-radius: 8px; font-size: 13px; }

.slot-transport { margin-top: 12px; padding: 10px 12px; background: var(--sky-light); border-radius: 8px; font-size: 12px; color: #2A5070; }
.slot-transport-head { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--sky); font-weight: 500; margin-bottom: 4px; }
.slot-transport-step { padding-left: 14px; position: relative; line-height: 1.5; }
.slot-transport-step::before { content: '→'; position: absolute; left: 0; color: var(--sky); }
.slot-transport-meta { margin-top: 4px; font-size: 11px; color: var(--mid); }
.slot-transport.is-storm { background: #FDE9E5; color: var(--rust); }

.nowwhat { position: fixed; bottom: 0; left: 0; right: 0; background: var(--charcoal); color: var(--warm-white); z-index: 90; }
.nowwhat-toggle { width: 100%; background: var(--charcoal); color: var(--gold); border: none; padding: 12px; font-size: 13px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; }
.nowwhat-body { padding: 16px; padding-top: 0; }
.nowwhat-active { font-family: var(--serif); font-size: 18px; margin-bottom: 8px; }
.nowwhat-transport { font-size: 12px; color: rgba(255,255,255,.7); margin-bottom: 12px; }
.nowwhat-buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.nowwhat-buttons button { background: rgba(255,255,255,.1); color: var(--warm-white); border: 1px solid rgba(255,255,255,.15); border-radius: 8px; padding: 10px 4px; font-size: 11px; font-weight: 500; cursor: pointer; }

dialog { border: none; border-radius: 16px; padding: 0; max-width: 90vw; width: 360px; }
dialog::backdrop { background: rgba(0,0,0,.4); }
.area-picker, .nearby { padding: 20px; }
.area-picker h3, .nearby h3 { font-family: var(--serif); font-size: 22px; font-weight: 400; margin-bottom: 12px; }
.area-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
.area-grid button { background: var(--warm-white); border: 1px solid var(--border); border-radius: 10px; padding: 12px; font-size: 13px; cursor: pointer; }
.nearby-list { list-style: none; max-height: 60vh; overflow-y: auto; margin-bottom: 16px; }
.nearby-list li { padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
.nearby-list li:last-child { border-bottom: none; }
.nearby-list strong { display: block; font-family: var(--serif); font-weight: 600; }
.nearby-list em { color: var(--mid); font-style: normal; font-size: 12px; }

@media (max-width: 480px) {
  .topbar { grid-template-columns: auto 1fr auto; }
  .where-pill { max-width: 120px; font-size: 11px; }
  .clock { font-size: 16px; }
  .timeline { padding: 12px; }
  .nowwhat-buttons { grid-template-columns: repeat(2, 1fr); }
}
```

- [ ] **Step 2: Reload the browser tab; styled top bar and tabs visible**

- [ ] **Step 3: Commit**

```bash
git add projects/bangkok/v2/style.css
git commit -m "bangkok: add v2 styles"
```

---

### Task 3: `dom.js` — `el()` builder

**Files:**
- Create: `projects/bangkok/v2/dom.js`

- [ ] **Step 1: Write the file**

```js
// Tiny DOM builder. All text goes through createTextNode → no XSS.
// Usage:
//   el('div', { class: 'foo', data: { id: 'x' }, onClick: handler }, 'text', el('span', {}, 'bar'))
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'data' && typeof v === 'object') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k in node && typeof node[k] !== 'function') node[k] = v;
    else node.setAttribute(k, v);
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    node.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

// Replace all children of `parent` with new nodes.
export function replace(parent, ...nodes) {
  parent.replaceChildren(...nodes.flat(Infinity).filter(Boolean));
}
```

- [ ] **Step 2: Smoke test in console**

```js
import('./dom.js').then(({ el }) => {
  const x = el('div', { class: 'test' }, 'hello ', el('strong', {}, 'world'));
  console.log(x.outerHTML);  // <div class="test">hello <strong>world</strong></div>
});
```

- [ ] **Step 3: Commit**

```bash
git add projects/bangkok/v2/dom.js
git commit -m "bangkok: dom builder helper"
```

---

### Task 4: `data/anchors.js`

**Files:**
- Create: `projects/bangkok/v2/data/anchors.js`

- [ ] **Step 1: Write the file**

```js
// All spots referenced in the trip. Each anchor appears in at most 2 slots.
// `weather`: outdoor / indoor / either — drives storm-toggle behaviour.
// `category`: temple / mall / market / food / spa / culture / transit / shopping
// `tags`: halal_friendly | non_halal | plus_size | must_see | indoor

export const anchors = [
  { id: "hotel", name: "lyf Sukhumvit 8", coords: { lat: 13.7398, lon: 100.5567 },
    weather: "indoor", duration_min: 30, category: "transit", tags: [],
    cost_thb: 0, hours: "24/7",
    notes: "Base. Soi 8, 5 min walk to Nana BTS. Drop bags, freshen up, communal lounge.",
    gmaps_url: "https://maps.google.com/?q=lyf+Sukhumvit+8", emoji: "🛏" },
  { id: "dmk_airport", name: "Don Mueang Airport (DMK)", coords: { lat: 13.9126, lon: 100.6068 },
    weather: "indoor", duration_min: 90, category: "transit", tags: [],
    cost_thb: 0, hours: "24/7",
    notes: "AirAsia hub. AK893 BKK→KUL departs DMK. Check in 60 min before.",
    gmaps_url: "https://maps.google.com/?q=Don+Mueang+Airport", emoji: "✈️" },
  { id: "soi_nana_arab", name: "Soi Nana / Soi 3 (Little Arabia)", coords: { lat: 13.7407, lon: 100.5566 },
    weather: "either", duration_min: 90, category: "food", tags: ["halal_friendly", "must_see"],
    cost_thb: 0, hours: "many 24/7",
    notes: "Halal Middle Eastern street. Petra (Yemeni mandi), Al Hussain (biryani), Nefertiti (Egyptian), Bamboo (Lebanese), Sofra (Turkish).",
    gmaps_url: "https://maps.google.com/?q=Soi+Nana+Sukhumvit+3+Bangkok", emoji: "🥙" },
  { id: "terminal21", name: "Terminal 21 Asok", coords: { lat: 13.7373, lon: 100.5602 },
    weather: "indoor", duration_min: 90, category: "mall", tags: ["indoor"],
    cost_thb: 0, hours: "10:00–22:00",
    notes: "Themed mall (Rome/Tokyo/London floors). Pier 21 food court 5F has cheap authentic Thai. Connected to Asok BTS.",
    gmaps_url: "https://maps.google.com/?q=Terminal+21+Asok", emoji: "🏬" },
  { id: "moga_emquartier", name: "MOGA Aveda — EmQuartier", coords: { lat: 13.7305, lon: 100.5697 },
    weather: "indoor", duration_min: 120, category: "spa", tags: ["indoor"],
    cost_thb: 4500, hours: "10:00–21:00",
    notes: "Aveda partner Japanese salon. Cut + Invati thinning treatment combo realistic 3,800–6,500 THB. Book on Line ahead.",
    gmaps_url: "https://maps.google.com/?q=MOGA+EmQuartier", emoji: "✂️" },
  { id: "jodd_fairs", name: "Jodd Fairs Ratchada", coords: { lat: 13.7707, lon: 100.5689 },
    weather: "outdoor", duration_min: 120, category: "market", tags: ["non_halal"],
    cost_thb: 0, hours: "17:00–01:00 daily",
    notes: "1,500+ stalls. Volcano ribs (pork, non-halal), grilled seafood, mango sticky rice. Trendy clothes 100–300 THB.",
    gmaps_url: "https://maps.google.com/?q=Jodd+Fairs+Ratchada", emoji: "🌙" },
  { id: "grand_palace", name: "Grand Palace + Wat Phra Kaew", coords: { lat: 13.7500, lon: 100.4914 },
    weather: "outdoor", duration_min: 120, category: "temple", tags: ["must_see"],
    cost_thb: 500, hours: "08:30–15:30",
    notes: "Most sacred site. Strict dress code (covered shoulders + knees). Emerald Buddha. Allow 1.5–2 hr.",
    gmaps_url: "https://maps.google.com/?q=Grand+Palace+Bangkok", emoji: "🏛" },
  { id: "wat_pho", name: "Wat Pho — Reclining Buddha", coords: { lat: 13.7465, lon: 100.4927 },
    weather: "outdoor", duration_min: 90, category: "temple", tags: ["must_see"],
    cost_thb: 300, hours: "08:00–19:30",
    notes: "46m Reclining Buddha. Birthplace of Thai massage — 30min 300 THB / 1hr 420 THB walk-in on grounds.",
    gmaps_url: "https://maps.google.com/?q=Wat+Pho", emoji: "🙏" },
  { id: "wat_arun", name: "Wat Arun — Temple of Dawn", coords: { lat: 13.7437, lon: 100.4889 },
    weather: "outdoor", duration_min: 60, category: "temple", tags: [],
    cost_thb: 100, hours: "08:00–18:00",
    notes: "Porcelain-covered prang across river. Cross-river ferry 5 THB from Tha Tien.",
    gmaps_url: "https://maps.google.com/?q=Wat+Arun", emoji: "⛩️" },
  { id: "wat_saket", name: "Wat Saket (Golden Mount)", coords: { lat: 13.7536, lon: 100.5061 },
    weather: "outdoor", duration_min: 60, category: "temple", tags: [],
    cost_thb: 100, hours: "07:00–19:00",
    notes: "300-step climb to golden chedi. Best photo of old Bangkok at sunset. 10 min tuk-tuk from Wat Pho.",
    gmaps_url: "https://maps.google.com/?q=Wat+Saket+Golden+Mount", emoji: "🌄" },
  { id: "iconsiam", name: "ICONSIAM", coords: { lat: 13.7263, lon: 100.5106 },
    weather: "indoor", duration_min: 180, category: "mall", tags: ["halal_friendly", "indoor", "must_see"],
    cost_thb: 0, hours: "10:00–22:00",
    notes: "Riverside mega-mall. SookSiam indoor floating market. Free fountain show 19:00/20:00/21:00. Free shuttle from Sathorn Pier. Pad Thai Thipsamai (halal certified).",
    gmaps_url: "https://maps.google.com/?q=ICONSIAM", emoji: "🌊" },
  { id: "chatuchak", name: "Chatuchak Weekend Market", coords: { lat: 13.7997, lon: 100.5500 },
    weather: "outdoor", duration_min: 240, category: "market", tags: ["halal_friendly"],
    cost_thb: 0, hours: "Sat–Sun 09:00–18:00",
    notes: "15,000 stalls, 27 sections. Saman Islam Sec 16/Soi 24 = halal Thai. Bring 3,000–4,000 THB cash.",
    gmaps_url: "https://maps.google.com/?q=Chatuchak+Weekend+Market", emoji: "🛍" },
  { id: "krungthong_plaza", name: "Krungthong Plaza (plus-size mall)", coords: { lat: 13.7424, lon: 100.5450 },
    weather: "indoor", duration_min: 120, category: "shopping", tags: ["plus_size", "indoor"],
    cost_thb: 0, hours: "09:00–18:00",
    notes: "4 floors of plus-size only. Up to 5XL–7XL women, 54-inch waist men. Chidlom BTS + 8 min walk. Tops 200–500 THB.",
    gmaps_url: "https://maps.google.com/?q=Krungthong+Plaza+Bangkok", emoji: "👗" },
  { id: "platinum_mall", name: "Platinum Fashion Mall (Pratunam)", coords: { lat: 13.7510, lon: 100.5408 },
    weather: "indoor", duration_min: 180, category: "shopping", tags: ["plus_size", "indoor"],
    cost_thb: 0, hours: "09:00–20:00",
    notes: "5 floors / 2,000 stalls. Floor 3–4 plus-size women up to 6XL. Linen/cotton breezy 200–600 THB.",
    gmaps_url: "https://maps.google.com/?q=Platinum+Fashion+Mall", emoji: "🧥" },
  { id: "mbk", name: "MBK Center (Floor 6 — Dr Zu)", coords: { lat: 13.7445, lon: 100.5298 },
    weather: "indoor", duration_min: 90, category: "shopping", tags: ["plus_size", "indoor"],
    cost_thb: 0, hours: "10:00–22:00",
    notes: "Dr Zu shop F6 = plus-size men XXL–4XL cotton/linen 300–800 THB. National Stadium BTS.",
    gmaps_url: "https://maps.google.com/?q=MBK+Center", emoji: "👔" },
  { id: "siam_paragon", name: "Siam Paragon", coords: { lat: 13.7461, lon: 100.5346 },
    weather: "indoor", duration_min: 120, category: "mall", tags: ["halal_friendly", "indoor"],
    cost_thb: 0, hours: "10:00–22:00",
    notes: "Premium mall. Uniqlo (linen 790 THB, sizes to 3XL), Naraya bags 300–800 THB, Jim Thompson silk.",
    gmaps_url: "https://maps.google.com/?q=Siam+Paragon", emoji: "💎" },
  { id: "jim_thompson_house", name: "Jim Thompson House", coords: { lat: 13.7493, lon: 100.5286 },
    weather: "indoor", duration_min: 90, category: "culture", tags: ["indoor"],
    cost_thb: 250, hours: "10:00–17:00",
    notes: "Traditional Thai house museum + silk story. 10 min walk from National Stadium BTS. AC garden, calm.",
    gmaps_url: "https://maps.google.com/?q=Jim+Thompson+House", emoji: "🏯" },
  { id: "talat_noi", name: "Talat Noi + Lhong 1919", coords: { lat: 13.7373, lon: 100.5093 },
    weather: "either", duration_min: 120, category: "culture", tags: [],
    cost_thb: 0, hours: "Lhong 1919 closes 18:00",
    notes: "Thai-Chinese heritage. Murals, So Heng Tai 200-yr mansion, riverside cafés in old warehouses.",
    gmaps_url: "https://maps.google.com/?q=Talat+Noi+Bangkok", emoji: "🎨" },
  { id: "thipsamai_iconsiam", name: "Pad Thai Thipsamai (ICONSIAM branch)", coords: { lat: 13.7263, lon: 100.5106 },
    weather: "indoor", duration_min: 45, category: "food", tags: ["halal_friendly", "must_see"],
    cost_thb: 0, hours: "10:00–22:00",
    notes: "Legendary 1939 pad Thai, now halal certified. Inside ICONSIAM. Wrapped-in-egg version 80–120 THB.",
    gmaps_url: "https://maps.google.com/?q=Thipsamai+ICONSIAM", emoji: "🍜" },
  { id: "saman_islam_chatuchak", name: "Saman Islam (Chatuchak Sec 16)", coords: { lat: 13.8003, lon: 100.5495 },
    weather: "outdoor", duration_min: 30, category: "food", tags: ["halal_friendly"],
    cost_thb: 0, hours: "Sat–Sun 09:00–17:00",
    notes: "Halal Thai inside Chatuchak. Biryani, beef noodle soup. 80–150 THB. Section 16 / Soi 24.",
    gmaps_url: "https://maps.google.com/?q=Saman+Islam+Chatuchak", emoji: "🍛" },
  { id: "bts_nana", name: "Nana BTS", coords: { lat: 13.7404, lon: 100.5556 },
    weather: "indoor", duration_min: 5, category: "transit", tags: ["indoor"],
    cost_thb: 0, hours: "06:00–24:00",
    notes: "Closest BTS to hotel. Sukhumvit Line. Direct to Mo Chit (Chatuchak), Phrom Phong (EmQuartier).",
    gmaps_url: "https://maps.google.com/?q=Nana+BTS", emoji: "🚈" },
  { id: "bts_asok", name: "Asok BTS / Sukhumvit MRT", coords: { lat: 13.7373, lon: 100.5602 },
    weather: "indoor", duration_min: 5, category: "transit", tags: ["indoor"],
    cost_thb: 0, hours: "06:00–24:00",
    notes: "BTS + MRT interchange. Connected to Terminal 21. 2 MRT stops to Jodd Fairs.",
    gmaps_url: "https://maps.google.com/?q=Asok+BTS", emoji: "🚉" }
];

export function anchorById(id) { return anchors.find(a => a.id === id); }
```

- [ ] **Step 2: Verify in console**

```js
import('./data/anchors.js').then(m => console.log(m.anchors.length, m.anchorById('wat_pho').name));
```

Expected: 22 (or your final count) and `"Wat Pho — Reclining Buddha"`.

- [ ] **Step 3: Commit**

```bash
git add projects/bangkok/v2/data/anchors.js
git commit -m "bangkok: anchor data"
```

---

### Task 5: `data/slots.js`

**Files:**
- Create: `projects/bangkok/v2/data/slots.js`

- [ ] **Step 1: Write the file**

```js
// 3-day plan. Each anchor appears in at most 2 slots (1 primary + 1 alt).
// time_start / time_end are "HH:MM" 24h.
// alt_ids surface when storm toggle is on, or via Swap button.

export const slots = [
  // === Day 1 — Thu 30 Apr ===
  { id: "d1_arrive", day: 1, time_start: "07:00", time_end: "09:00",
    primary_id: "dmk_airport", alt_ids: [],
    notes: "Land DMK, clear immigration, Grab to hotel ~250–400 THB / 30–45 min.",
    prev_slot_id: null },
  { id: "d1_checkin", day: 1, time_start: "09:00", time_end: "12:00",
    primary_id: "hotel", alt_ids: [],
    notes: "Drop bags, nap 3–4 hr (non-negotiable after redeye). Lobby lounge if room not ready.",
    prev_slot_id: "d1_arrive" },
  { id: "d1_lunch", day: 1, time_start: "12:30", time_end: "14:00",
    primary_id: "soi_nana_arab", alt_ids: ["terminal21"],
    notes: "Lunch on Soi 11 area or Soi 3 (halal). 80–200 THB/pax. Hydrate hard.",
    prev_slot_id: "d1_checkin" },
  { id: "d1_salon", day: 1, time_start: "14:30", time_end: "17:00",
    primary_id: "moga_emquartier", alt_ids: ["terminal21"],
    notes: "Pre-booked MOGA Aveda. While she's there, J6 grab beard trim at Soi 3–11 barber 150–250 THB.",
    prev_slot_id: "d1_lunch" },
  { id: "d1_dinner", day: 1, time_start: "18:30", time_end: "21:30",
    primary_id: "soi_nana_arab", alt_ids: ["jodd_fairs", "iconsiam"],
    notes: "Storm-safe dinner walking distance. Petra (Yemeni mandi) or Al Hussain (biryani). Skip Jodd Fairs Day 1 unless energy good.",
    prev_slot_id: "d1_salon" },
  { id: "d1_sleep", day: 1, time_start: "22:00", time_end: "23:30",
    primary_id: "hotel", alt_ids: [],
    notes: "Bed by 22:30. Big temple day tomorrow.",
    prev_slot_id: "d1_dinner" },

  // === Day 2 — Fri 1 May ===
  { id: "d2_breakfast", day: 2, time_start: "07:30", time_end: "08:00",
    primary_id: "hotel", alt_ids: [],
    notes: "Quick breakfast. Pack water + small umbrella + sun hat.",
    prev_slot_id: "d1_sleep" },
  { id: "d2_grand_palace", day: 2, time_start: "08:30", time_end: "11:00",
    primary_id: "grand_palace", alt_ids: ["talat_noi"],
    notes: "Be at gate 08:30 sharp. Allow 1.5–2 hr. Storm alt: Talat Noi heritage walk.",
    prev_slot_id: "d2_breakfast" },
  { id: "d2_wat_pho", day: 2, time_start: "11:15", time_end: "13:00",
    primary_id: "wat_pho", alt_ids: [],
    notes: "Walk 5 min from Grand Palace. Reclining Buddha + 1 hr Thai massage on grounds 420 THB.",
    prev_slot_id: "d2_grand_palace" },
  { id: "d2_wat_arun", day: 2, time_start: "13:15", time_end: "14:30",
    primary_id: "wat_arun", alt_ids: ["wat_saket"],
    notes: "Cross-river ferry from Tha Tien 5 THB. Skip climb if heat brutal.",
    prev_slot_id: "d2_wat_pho" },
  { id: "d2_lunch", day: 2, time_start: "14:30", time_end: "15:30",
    primary_id: "soi_nana_arab", alt_ids: ["thipsamai_iconsiam"],
    notes: "Riverside Thai or Grab back to hotel area for halal. Or shift to Thipsamai pad Thai later.",
    prev_slot_id: "d2_wat_arun" },
  { id: "d2_rest", day: 2, time_start: "15:30", time_end: "17:30",
    primary_id: "hotel", alt_ids: ["krungthong_plaza"],
    notes: "Mandatory rest. Or storm-proof shopping at Krungthong Plaza (plus-size mall, AC).",
    prev_slot_id: "d2_lunch" },
  { id: "d2_iconsiam", day: 2, time_start: "18:00", time_end: "21:30",
    primary_id: "iconsiam", alt_ids: ["jodd_fairs"],
    notes: "BTS to Saphan Taksin → free shuttle. SookSiam, fountain show 19:00 (best). Dinner Thipsamai or food court.",
    prev_slot_id: "d2_rest" },

  // === Day 3 — Sat 2 May ===
  { id: "d3_breakfast", day: 3, time_start: "07:45", time_end: "08:30",
    primary_id: "hotel", alt_ids: [],
    notes: "Check out, store bags at front desk (free). Big breakfast. Comfortable shoes.",
    prev_slot_id: "d2_iconsiam" },
  { id: "d3_chatuchak", day: 3, time_start: "09:00", time_end: "12:30",
    primary_id: "chatuchak", alt_ids: ["platinum_mall", "krungthong_plaza"],
    notes: "BTS Nana → Mo Chit direct ~30 min 44 THB. Bring 3,000–4,000 THB cash. Halal lunch Saman Islam Sec 16. Storm alt: Platinum Mall.",
    prev_slot_id: "d3_breakfast" },
  { id: "d3_siam", day: 3, time_start: "12:45", time_end: "14:30",
    primary_id: "siam_paragon", alt_ids: ["mbk", "jim_thompson_house"],
    notes: "BTS Mo Chit → Siam ~10 min. Last shopping (Uniqlo linen, Naraya, Jim Thompson). Lunch food hall.",
    prev_slot_id: "d3_chatuchak" },
  { id: "d3_collect", day: 3, time_start: "14:45", time_end: "15:30",
    primary_id: "hotel", alt_ids: [],
    notes: "BTS to Nana, collect bags, repack Chatuchak haul into check-in luggage.",
    prev_slot_id: "d3_siam" },
  { id: "d3_airport", day: 3, time_start: "15:30", time_end: "18:45",
    primary_id: "dmk_airport", alt_ids: [],
    notes: "Grab to DMK ~30–45 min (Sat traffic +15 min). Counter close 17:45 for AK893 18:45.",
    prev_slot_id: "d3_collect" }
];

export function slotsByDay(day) { return slots.filter(s => s.day === day); }
export function slotById(id) { return slots.find(s => s.id === id); }
```

- [ ] **Step 2: Verify**

```js
import('./data/slots.js').then(m => console.log(m.slots.length, m.slotsByDay(2).map(s => s.id)));
```

Expected: 17 total, 7 Day-2 ids.

- [ ] **Step 3: Commit**

```bash
git add projects/bangkok/v2/data/slots.js
git commit -m "bangkok: slot data (3-day plan)"
```

---

### Task 6: `data/transports.js`

**Files:**
- Create: `projects/bangkok/v2/data/transports.js`

- [ ] **Step 1: Write the file**

```js
// Pre-computed transitions. Keyed by `from→to`.
// `storm_alt` is wet-weather fallback (usually Grab door-to-door).

export const transports = [
  { key: "dmk_airport→hotel",
    primary: { steps: ["Grab car door-to-door, ~30–45 min, 250–400 THB"], duration_min: 40, cost_thb: 350 },
    storm_alt: null },
  { key: "hotel→soi_nana_arab",
    primary: { steps: ["Walk 5–8 min along Sukhumvit"], duration_min: 7, cost_thb: 0 },
    storm_alt: null },
  { key: "soi_nana_arab→hotel",
    primary: { steps: ["Walk 5–8 min back"], duration_min: 7, cost_thb: 0 },
    storm_alt: null },
  { key: "hotel→terminal21",
    primary: { steps: ["Walk to Nana BTS, 5 min", "Sukhumvit Line → Asok, 2 stops, ~5 min, 16 THB", "Connected directly to mall"], duration_min: 12, cost_thb: 16 },
    storm_alt: { steps: ["Grab car ~10 min, 60–90 THB"], duration_min: 10, cost_thb: 75 } },
  { key: "soi_nana_arab→terminal21",
    primary: { steps: ["Walk to Nana BTS, 3 min", "BTS → Asok, 2 stops, 16 THB"], duration_min: 10, cost_thb: 16 },
    storm_alt: { steps: ["Grab ~5 min, 50–80 THB"], duration_min: 6, cost_thb: 65 } },
  { key: "terminal21→moga_emquartier",
    primary: { steps: ["BTS Asok → Phrom Phong, 1 stop, 16 THB", "Connected to EmQuartier"], duration_min: 8, cost_thb: 16 },
    storm_alt: { steps: ["Grab ~10 min, 80–120 THB"], duration_min: 12, cost_thb: 100 } },
  { key: "hotel→moga_emquartier",
    primary: { steps: ["Walk to Nana BTS, 5 min", "BTS → Phrom Phong, 3 stops, ~7 min, 26 THB", "Connected to EmQuartier"], duration_min: 15, cost_thb: 26 },
    storm_alt: { steps: ["Grab ~15 min, 100–150 THB"], duration_min: 15, cost_thb: 125 } },
  { key: "moga_emquartier→hotel",
    primary: { steps: ["BTS Phrom Phong → Nana, 3 stops, 26 THB", "Walk 5 min"], duration_min: 15, cost_thb: 26 },
    storm_alt: { steps: ["Grab ~15 min, 100–150 THB"], duration_min: 15, cost_thb: 125 } },
  { key: "moga_emquartier→soi_nana_arab",
    primary: { steps: ["BTS Phrom Phong → Nana, 3 stops, 26 THB", "Walk 3 min to Soi 3"], duration_min: 12, cost_thb: 26 },
    storm_alt: { steps: ["Grab ~12 min, 90–130 THB"], duration_min: 12, cost_thb: 110 } },
  { key: "soi_nana_arab→jodd_fairs",
    primary: { steps: ["Walk to Asok, 8 min", "MRT Sukhumvit → Thailand Cultural Centre, 2 stops, ~6 min, 23 THB", "Exit 4, walk 3 min"], duration_min: 20, cost_thb: 23 },
    storm_alt: { steps: ["Grab ~20 min, 120–180 THB"], duration_min: 25, cost_thb: 150 } },
  { key: "hotel→jodd_fairs",
    primary: { steps: ["BTS Nana → Asok 1 stop", "MRT → Thailand Cultural Centre, 2 stops, 23 THB", "Exit 4, walk 3 min"], duration_min: 25, cost_thb: 39 },
    storm_alt: { steps: ["Grab ~20 min, 130–180 THB"], duration_min: 25, cost_thb: 155 } },
  { key: "jodd_fairs→hotel",
    primary: { steps: ["MRT Thailand Cultural Centre → Sukhumvit, 23 THB", "Walk to BTS Nana or Grab 30–50 THB"], duration_min: 25, cost_thb: 50 },
    storm_alt: { steps: ["Grab ~20 min, 140–200 THB"], duration_min: 25, cost_thb: 170 } },
  { key: "hotel→grand_palace",
    primary: { steps: ["Walk to Nana BTS, 5 min", "Sukhumvit Line → Saphan Taksin, 6 stops, ~20 min, 44 THB", "Walk to Sathorn Pier, 3 min", "Orange-flag boat → Tha Chang (N9), ~25 min, 16 THB", "Walk to gate, 2 min"], duration_min: 55, cost_thb: 60 },
    storm_alt: { steps: ["Grab door-to-door, ~45 min, 350–500 THB"], duration_min: 45, cost_thb: 425 } },
  { key: "grand_palace→wat_pho",
    primary: { steps: ["Walk south 5 min, 600 m"], duration_min: 5, cost_thb: 0 },
    storm_alt: null },
  { key: "wat_pho→wat_arun",
    primary: { steps: ["Walk 10 min south to Tha Tien Pier", "Cross-river ferry → Wat Arun, 5 THB, ~3 min"], duration_min: 15, cost_thb: 5 },
    storm_alt: null },
  { key: "wat_pho→wat_saket",
    primary: { steps: ["Tuk-tuk ~10 min, 80–120 THB", "Or Grab ~12 min, 80 THB"], duration_min: 12, cost_thb: 100 },
    storm_alt: { steps: ["Grab ~15 min, 100–140 THB"], duration_min: 15, cost_thb: 120 } },
  { key: "wat_arun→hotel",
    primary: { steps: ["Cross-river ferry back, 5 THB", "Grab from Tha Tien to hotel, ~30–40 min, 150–250 THB"], duration_min: 40, cost_thb: 200 },
    storm_alt: { steps: ["Grab ~40 min, 200–280 THB"], duration_min: 45, cost_thb: 240 } },
  { key: "wat_arun→soi_nana_arab",
    primary: { steps: ["Cross-river ferry, 5 THB", "Grab to Soi Nana, ~35 min, 180–250 THB"], duration_min: 40, cost_thb: 220 },
    storm_alt: { steps: ["Grab ~40 min, 220–300 THB"], duration_min: 45, cost_thb: 260 } },
  { key: "hotel→iconsiam",
    primary: { steps: ["Walk to Nana BTS, 5 min", "Sukhumvit Line → Saphan Taksin, 6 stops, 44 THB", "Walk to Sathorn Pier, 3 min", "Free ICONSIAM shuttle boat (every 10 min, 5 min ride)"], duration_min: 35, cost_thb: 44 },
    storm_alt: { steps: ["Grab ~30 min, 200–280 THB"], duration_min: 35, cost_thb: 240 } },
  { key: "iconsiam→hotel",
    primary: { steps: ["Free shuttle to Sathorn Pier", "BTS Saphan Taksin → Nana, 6 stops, 44 THB", "Walk 5 min"], duration_min: 35, cost_thb: 44 },
    storm_alt: { steps: ["Grab ~35 min, 220–300 THB"], duration_min: 40, cost_thb: 260 } },
  { key: "hotel→chatuchak",
    primary: { steps: ["Walk to Nana BTS, 5 min", "Sukhumvit Line → Mo Chit (terminus), ~30 min, 44 THB", "Walk to entrance, 3 min"], duration_min: 38, cost_thb: 44 },
    storm_alt: { steps: ["Grab ~30 min, 250–350 THB"], duration_min: 35, cost_thb: 300 } },
  { key: "chatuchak→siam_paragon",
    primary: { steps: ["BTS Mo Chit → Siam, ~10 min, 25 THB"], duration_min: 12, cost_thb: 25 },
    storm_alt: { steps: ["Grab ~25 min, 150–220 THB"], duration_min: 30, cost_thb: 185 } },
  { key: "chatuchak→platinum_mall",
    primary: { steps: ["BTS Mo Chit → Chitlom, ~12 min, 32 THB", "Walk 10 min to Platinum"], duration_min: 25, cost_thb: 32 },
    storm_alt: { steps: ["Grab ~25 min, 150–220 THB"], duration_min: 30, cost_thb: 185 } },
  { key: "siam_paragon→hotel",
    primary: { steps: ["BTS Siam → Nana, ~10 min, 32 THB", "Walk 5 min"], duration_min: 15, cost_thb: 32 },
    storm_alt: { steps: ["Grab ~20 min, 120–180 THB"], duration_min: 25, cost_thb: 150 } },
  { key: "siam_paragon→jim_thompson_house",
    primary: { steps: ["BTS Siam → National Stadium, 1 stop, 16 THB", "Walk 10 min"], duration_min: 15, cost_thb: 16 },
    storm_alt: { steps: ["Grab ~10 min, 70–110 THB"], duration_min: 12, cost_thb: 90 } },
  { key: "siam_paragon→mbk",
    primary: { steps: ["Covered walkway from Siam Paragon to MBK, ~5 min"], duration_min: 7, cost_thb: 0 },
    storm_alt: null },
  { key: "hotel→dmk_airport",
    primary: { steps: ["Grab car ~30–60 min, 250–400 THB. Saturday afternoon add buffer."], duration_min: 50, cost_thb: 350 },
    storm_alt: null },
  { key: "krungthong_plaza→hotel",
    primary: { steps: ["Walk to Chidlom BTS, 8 min", "Sukhumvit Line → Nana, 2 stops, 16 THB"], duration_min: 18, cost_thb: 16 },
    storm_alt: { steps: ["Grab ~12 min, 80–120 THB"], duration_min: 15, cost_thb: 100 } },
  { key: "hotel→krungthong_plaza",
    primary: { steps: ["Walk to Nana BTS, 5 min", "Sukhumvit Line → Chidlom, 2 stops, 16 THB", "Walk 8 min"], duration_min: 18, cost_thb: 16 },
    storm_alt: { steps: ["Grab ~12 min, 80–120 THB"], duration_min: 15, cost_thb: 100 } }
];

export function transportFor(fromId, toId) {
  return transports.find(t => t.key === `${fromId}→${toId}`) || null;
}
```

- [ ] **Step 2: Verify**

```js
import('./data/transports.js').then(m => console.log(m.transportFor('hotel','grand_palace').primary.steps.length));
```

Expected: 5.

- [ ] **Step 3: Commit**

```bash
git add projects/bangkok/v2/data/transports.js
git commit -m "bangkok: transport data"
```

---

## Phase 2 — Pure utilities (TDD)

### Task 7: Test runner

**Files:**
- Create: `projects/bangkok/v2/test/index.html`
- Create: `projects/bangkok/v2/test/test.js`

- [ ] **Step 1: Write `test/index.html`**

```html
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>v2 tests</title>
<style>body{font:14px ui-monospace,monospace;padding:20px;background:#1E1C18;color:#FDFAF5}.pass{color:#5EBA7D}.fail{color:#E07B39}h2{margin-top:20px;color:#C9A84C}#out{white-space:pre}</style>
</head><body>
<h1>Bangkok v2 — pure-fn tests</h1>
<div id="out"></div>
<script type="module" src="./test.js"></script>
</body></html>
```

- [ ] **Step 2: Write `test/test.js` (assert helper only — tests added in later tasks)**

```js
const out = document.getElementById('out');
let passed = 0, failed = 0;

export function group(name) {
  const h = document.createElement('h2');
  h.textContent = name;
  out.appendChild(h);
}
export function assert(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  const div = document.createElement('div');
  div.className = ok ? 'pass' : 'fail';
  if (ok) {
    passed++;
    div.textContent = `✓ ${label}`;
  } else {
    failed++;
    div.textContent = `✗ ${label}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`;
  }
  out.appendChild(div);
}
export function done() {
  const div = document.createElement('div');
  div.style.marginTop = '20px';
  div.textContent = `${passed} passed · ${failed} failed`;
  out.appendChild(div);
}
```

- [ ] **Step 3: Open `test/index.html` in browser**

Expected: empty test page with title.

- [ ] **Step 4: Commit**

```bash
git add projects/bangkok/v2/test/
git commit -m "bangkok: browser test runner"
```

---

### Task 8: `geo.js` — Haversine

**Files:**
- Create: `projects/bangkok/v2/geo.js`
- Modify: `projects/bangkok/v2/test/test.js`

- [ ] **Step 1: Append tests to `test/test.js`**

```js
import { haversineKm, nearestAnchor, withinKm } from '../geo.js';

group('geo.haversineKm');
assert('hotel → Grand Palace ≈ 7 km',
  Math.round(haversineKm({lat:13.7398,lon:100.5567},{lat:13.7500,lon:100.4914})),
  7);
assert('same point = 0',
  haversineKm({lat:13.74,lon:100.55},{lat:13.74,lon:100.55}),
  0);

group('geo.nearestAnchor');
const sample = [
  { id:'a', coords:{lat:13.74,lon:100.55} },
  { id:'b', coords:{lat:13.80,lon:100.55} },
  { id:'c', coords:{lat:13.75,lon:100.56} }
];
assert('nearest to (13.741, 100.551) is a',
  nearestAnchor({lat:13.741,lon:100.551}, sample).id,
  'a');

group('geo.withinKm');
assert('within 10km from (13.74,100.55) returns a then c',
  withinKm({lat:13.74,lon:100.55}, sample, 10).map(x=>x.id),
  ['a','c']);

done();
```

- [ ] **Step 2: Reload tests — expect failure (404 on `../geo.js`)**

- [ ] **Step 3: Write `geo.js`**

```js
const R = 6371;
const toRad = d => d * Math.PI / 180;

export function haversineKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function nearestAnchor(point, anchors) {
  let best = null, bestD = Infinity;
  for (const a of anchors) {
    const d = haversineKm(point, a.coords);
    if (d < bestD) { bestD = d; best = a; }
  }
  return best;
}

export function withinKm(point, anchors, km) {
  return anchors
    .map(a => ({ a, d: haversineKm(point, a.coords) }))
    .filter(x => x.d <= km)
    .sort((x, y) => x.d - y.d)
    .map(x => x.a);
}
```

- [ ] **Step 4: Reload tests — expect 4 ✓**

- [ ] **Step 5: Commit**

```bash
git add projects/bangkok/v2/geo.js projects/bangkok/v2/test/test.js
git commit -m "bangkok: geo utilities (haversine, nearest, within)"
```

---

### Task 9: `time.js` — active-slot computation

**Files:**
- Create: `projects/bangkok/v2/time.js`
- Modify: `projects/bangkok/v2/test/test.js`

- [ ] **Step 1: In `test/test.js`, replace the final `done();` line with this block then `done();`**

```js
import { parseHHMM, activeSlot, formatClock } from '../time.js';

group('time.parseHHMM');
assert('"08:30" → 510', parseHHMM('08:30'), 510);
assert('"00:00" → 0', parseHHMM('00:00'), 0);

group('time.formatClock');
assert('formatClock returns HH:MM',
  formatClock(new Date(2026, 3, 30, 14, 5)),
  '14:05');

group('time.activeSlot');
const fakeSlots = [
  { id:'s1', day:1, time_start:'08:00', time_end:'10:00' },
  { id:'s2', day:1, time_start:'10:00', time_end:'12:00' },
  { id:'s3', day:1, time_start:'12:30', time_end:'14:00' }
];
const t = (h, m) => new Date(2026, 3, 30, h, m);

assert('09:30 day 1 → s1', activeSlot(fakeSlots, t(9,30), [], 1)?.id, 's1');
assert('11:00 day 1 → s2', activeSlot(fakeSlots, t(11,0), [], 1)?.id, 's2');
assert('done s1 + 09:30 → s2', activeSlot(fakeSlots, t(9,30), ['s1'], 1)?.id, 's2');
assert('14:30 fall-behind → s1', activeSlot(fakeSlots, t(14,30), [], 1)?.id, 's1');
assert('all done → null', activeSlot(fakeSlots, t(11,0), ['s1','s2','s3'], 1), null);
```

- [ ] **Step 2: Reload — expect failure**

- [ ] **Step 3: Write `time.js`**

```js
export function parseHHMM(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}

export function formatClock(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function activeSlot(slots, now, doneIds, day) {
  const remaining = slots.filter(s => s.day === day && !doneIds.includes(s.id));
  if (remaining.length === 0) return null;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const inWindow = remaining.find(s => {
    const start = parseHHMM(s.time_start);
    const end = parseHHMM(s.time_end) + 30;
    return nowMin >= start && nowMin <= end;
  });
  return inWindow || remaining[0];
}
```

- [ ] **Step 4: Reload — expect 11 ✓ total**

- [ ] **Step 5: Commit**

```bash
git add projects/bangkok/v2/time.js projects/bangkok/v2/test/test.js
git commit -m "bangkok: time utilities (parse, format, active slot)"
```

---

## Phase 3 — State + render (local-only)

### Task 10: `state.js` — runtime state

**Files:**
- Create: `projects/bangkok/v2/state.js`

- [ ] **Step 1: Write the file**

```js
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
```

- [ ] **Step 2: Smoke-test in console**

```js
import('./state.js').then(({ setWeather, getState, subscribe }) => {
  const off = subscribe(s => console.log('state:', s.weather, s.doneIds));
  setWeather('storm');
  setWeather('sunny');
  off();
});
```

Expected: 3 logs.

- [ ] **Step 3: Commit**

```bash
git add projects/bangkok/v2/state.js
git commit -m "bangkok: state module"
```

---

### Task 11: `render.js` — slot, transport, now-what

**Files:**
- Create: `projects/bangkok/v2/render.js`

- [ ] **Step 1: Write the file**

```js
import { el } from './dom.js';
import { anchorById } from './data/anchors.js';
import { transportFor } from './data/transports.js';
import { slotById } from './data/slots.js';

const TAG_LABELS = {
  halal_friendly: 'Halal-friendly',
  non_halal: 'Non-halal',
  plus_size: 'Plus-size',
  indoor: 'Indoor',
  must_see: 'Must-see'
};

function tagsBlock(tags = []) {
  if (!tags.length) return null;
  return el('div', { class: 'slot-tags' },
    tags.map(t => el('span', { class: `tag tag-${t.replace('_', '-')}` }, TAG_LABELS[t] || t))
  );
}

function transportBlock(fromId, toId, isStorm) {
  if (!fromId || fromId === toId) return null;
  const t = transportFor(fromId, toId);
  if (!t) {
    return el('div', { class: 'slot-transport' },
      el('div', { class: 'slot-transport-head' }, '→ Get there'),
      el('div', { class: 'slot-transport-step' },
        'Open ',
        el('a', { href: `https://maps.google.com/?q=${encodeURIComponent(toId)}`, target: '_blank' }, 'Google Maps'),
        ' for route'
      )
    );
  }
  const route = isStorm && t.storm_alt ? t.storm_alt : t.primary;
  const label = isStorm && t.storm_alt ? 'Storm route' : 'Get there';
  const cls = 'slot-transport' + (isStorm && t.storm_alt ? ' is-storm' : '');
  return el('div', { class: cls },
    el('div', { class: 'slot-transport-head' }, `→ ${label}`),
    route.steps.map(s => el('div', { class: 'slot-transport-step' }, s)),
    el('div', { class: 'slot-transport-meta' }, `~${route.duration_min} min · ~${route.cost_thb} THB`)
  );
}

function anchorBlock(anchor) {
  if (!anchor) return el('div', { class: 'slot-info' }, el('div', { class: 'slot-name' }, 'Unknown'));
  const meta = (anchor.cost_thb ? `${anchor.cost_thb} THB · ` : '') + `${anchor.duration_min} min · ${anchor.hours}`;
  return [
    el('div', { class: 'slot-emoji' }, anchor.emoji),
    el('div', { class: 'slot-info' },
      el('div', { class: 'slot-name' }, anchor.name),
      el('div', { class: 'slot-meta' }, meta),
      el('div', { class: 'slot-notes' }, anchor.notes),
      tagsBlock(anchor.tags)
    )
  ];
}

function altsBlock(alt_ids) {
  if (!alt_ids.length) return null;
  const summary = el('summary', {}, `${alt_ids.length} alternative${alt_ids.length > 1 ? 's' : ''}`);
  const items = alt_ids.map(id => {
    const a = anchorById(id);
    return el('div', { class: 'slot-alt' },
      el('strong', {}, `${a?.name || id} ${a?.emoji || ''}`),
      el('br'),
      el('span', { class: 'slot-meta' }, a?.notes || '')
    );
  });
  return el('details', { class: 'slot-alts' }, summary, items);
}

export function renderSlot(slot, ctx) {
  const { weather, doneIds, activeId } = ctx;
  const primary = anchorById(slot.primary_id);
  const isDone = doneIds.includes(slot.id);
  const isActive = slot.id === activeId;
  const isStorm = weather === 'storm';
  const isStormBlocked = isStorm && primary?.weather === 'outdoor' && slot.alt_ids.length > 0;

  const prevSlot = slot.prev_slot_id ? slotById(slot.prev_slot_id) : null;
  const fromId = prevSlot ? prevSlot.primary_id : null;

  const cls = 'slot' +
    (isActive ? ' is-active' : '') +
    (isDone ? ' is-done' : '') +
    (isStormBlocked ? ' is-storm-blocked' : '');

  return el('article', { class: cls, data: { slotId: slot.id } },
    el('div', { class: 'slot-time' }, `${slot.time_start} – ${slot.time_end}`),
    transportBlock(fromId, slot.primary_id, isStorm),
    el('div', { class: 'slot-primary' }, anchorBlock(primary)),
    slot.notes ? el('p', { class: 'slot-notes', style: { marginTop: '8px' } }, slot.notes) : null,
    altsBlock(slot.alt_ids),
    el('div', { class: 'slot-actions' },
      el('button', { class: 'btn-done', data: { action: 'done', slotId: slot.id } }, isDone ? '↺ Undo' : '✓ Done'),
      slot.alt_ids.length ? el('button', { data: { action: 'swap', slotId: slot.id } }, '↻ Swap') : null,
      isStormBlocked ? el('button', { class: 'btn-storm-alt', data: { action: 'storm-alt', slotId: slot.id } }, '⛈ Storm alt') : null,
      primary ? el('a', { href: primary.gmaps_url, target: '_blank' }, '📍 Maps') : null
    )
  );
}

export function renderTimeline(slots, ctx) {
  return slots.map(s => renderSlot(s, ctx));
}

export function renderNowWhat(activeSlotData) {
  if (!activeSlotData) {
    return [el('p', { style: { color: 'rgba(255,255,255,.6)' } }, 'All slots done for today. 🎉')];
  }
  const a = anchorById(activeSlotData.primary_id);
  const noteSnippet = activeSlotData.notes ? activeSlotData.notes.slice(0, 80) + '…' : '';
  return [
    el('div', { class: 'nowwhat-active' }, `${a?.emoji || ''} ${a?.name || activeSlotData.primary_id}`),
    el('div', { class: 'nowwhat-transport' }, `${activeSlotData.time_start} – ${activeSlotData.time_end} · ${noteSnippet}`),
    el('div', { class: 'nowwhat-buttons' },
      el('button', { data: { action: 'scroll-active' } }, 'Plan'),
      el('button', { data: { action: 'swap-active' } }, 'Swap'),
      el('button', { data: { action: 'done-active' } }, 'Done'),
      el('button', { data: { action: 'open-nearby' } }, 'Nearby')
    )
  ];
}
```

- [ ] **Step 2: Commit (visual rendering tested via app.js next)**

```bash
git add projects/bangkok/v2/render.js
git commit -m "bangkok: render module (slot/transport/now-what via createElement)"
```

---

### Task 12: `app.js` — wire static render

**Files:**
- Create: `projects/bangkok/v2/app.js`

- [ ] **Step 1: Write the entry-point**

```js
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
```

- [ ] **Step 2: Open `index.html`** — sign-in is shown but ignore for now (we'll temporarily skip it — proceed to next step).

- [ ] **Step 3: Temporarily hide sign-in for local testing**

In `index.html`, replace `<div id="signin" class="signin" aria-hidden="false">` with `<div id="signin" class="signin hidden" aria-hidden="true">`.

Reload. The app body should render: top bar, day tabs, full timeline.

Expected:
- Day tabs switch
- Weather toggle highlights and applies overlay to outdoor slots in storm mode
- Done button toggles slot done/undo
- Swap cycles alternates
- Storm alt button appears on outdoor slots when storm is on
- Pick area pill opens modal; selecting one updates pill text

- [ ] **Step 4: Commit**

```bash
git add projects/bangkok/v2/app.js projects/bangkok/v2/index.html
git commit -m "bangkok: app entry — render orchestration, day/weather/done/swap"
```

---

## Phase 4 — GPS + Nearby

### Task 13: GPS watch

**Files:**
- Modify: `projects/bangkok/v2/app.js`

- [ ] **Step 1: Add GPS code at the bottom of `app.js`**

```js
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
```

- [ ] **Step 2: Test**

Reload. Browser prompts for location. Allow → "Where am I" pill shows nearest anchor + distance. Deny → banner appears with fallback instruction.

- [ ] **Step 3: Commit**

```bash
git add projects/bangkok/v2/app.js
git commit -m "bangkok: GPS watch with banner fallback"
```

---

### Task 14: Nearby sheet + Now-what actions

**Files:**
- Modify: `projects/bangkok/v2/app.js`

- [ ] **Step 1: Add `openNearby` and Now-what click handler at the end of `app.js`**

```js
function openNearby() {
  const s = getState();
  if (!s.gpsLast) {
    showBanner('Set location first via "Pick area".');
    return;
  }
  const within = withinKm(s.gpsLast, anchors, 1.5)
    .filter(a => s.weather !== 'storm' || a.weather !== 'outdoor');

  const items = within.length === 0
    ? [el('li', {}, 'No anchors within 1.5 km. Try Pick area.')]
    : within.map(a => {
        const km = Math.round(haversineKm(s.gpsLast, a.coords) * 10) / 10;
        const meta = `${km} km · ${a.duration_min} min · ${a.cost_thb ? a.cost_thb + ' THB' : 'free'}`;
        return el('li', {},
          el('strong', {}, `${a.emoji} ${a.name}`),
          el('em', {}, meta),
          el('br'),
          el('a', { href: a.gmaps_url, target: '_blank' }, 'Open in Maps')
        );
      });
  replace(nearbyList, ...items);
  nearbyDialog.querySelector('[data-close]').onclick = () => nearbyDialog.close();
  nearbyDialog.showModal();
}

nowWhatBody.addEventListener('click', e => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const s = getState();
  const active = activeSlot(slots, new Date(), s.doneIds, s.currentDay);
  if (action === 'open-nearby') openNearby();
  else if (action === 'scroll-active' && active) {
    document.querySelector(`[data-slot-id="${active.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (action === 'done-active' && active) {
    markDone(active.id);
  } else if (action === 'swap-active' && active && active.alt_ids.length) {
    const cur = swapState.get(active.id);
    const next = typeof cur === 'number' ? (cur + 1) % (active.alt_ids.length + 1) : 0;
    if (next === active.alt_ids.length) swapState.delete(active.id); else swapState.set(active.id, next);
    rerender();
  }
});
```

- [ ] **Step 2: Test**

- Allow GPS or use Pick area to set "Asok"
- Expand Now-what → 4 buttons render
- Tap Nearby → sheet of anchors within 1.5 km
- Toggle storm → reopen Nearby → outdoor anchors filtered out
- Tap Plan → scrolls to active slot
- Tap Done → marks active slot done

- [ ] **Step 3: Commit**

```bash
git add projects/bangkok/v2/app.js
git commit -m "bangkok: nearby sheet + now-what action buttons"
```

---

## Phase 5 — Firebase

### Task 15: Firebase project setup (manual operator task)

**No code changes; checklist for the human operator.**

- [ ] **Step 1:** Go to https://console.firebase.google.com → "Add project" → name `bkk-itinerary-2026` → accept defaults → **disable** Google Analytics.

- [ ] **Step 2:** Build → **Authentication** → Sign-in method → enable **Google** provider → support email `j6rockz@gmail.com` → Save.

- [ ] **Step 3:** Build → **Firestore Database** → Create database → region `asia-southeast1` (Singapore) → start in **production mode** → Save.

- [ ] **Step 4:** Firestore → **Rules** tab → replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trips/bkk-2026/{doc=**} {
      allow read, write: if request.auth != null && request.auth.token.email in [
        "j6rockz@gmail.com",
        "ferinakhansanabilah@gmail.com"
      ];
    }
  }
}
```

Click **Publish**.

- [ ] **Step 5:** Project settings (⚙) → General → Your apps → Add app → Web (`</>`) → register name `bangkok-v2` → skip Hosting → copy the `firebaseConfig` block. Looks like:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "bkk-itinerary-2026.firebaseapp.com",
  projectId: "bkk-itinerary-2026",
  storageBucket: "bkk-itinerary-2026.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

- [ ] **Step 6:** Authentication → Settings → **Authorized domains** → add `balawedsnaga.j6.studio`.

- [ ] **Step 7:** Save the `firebaseConfig` snippet for Task 16.

---

### Task 16: `firebase.js`

**Files:**
- Create: `projects/bangkok/v2/firebase.js`

- [ ] **Step 1: Write the file (paste your config from Task 15)**

```js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut as fbSignOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  getFirestore, doc, setDoc, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// === PASTE YOUR firebaseConfig FROM TASK 15 ===
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "bkk-itinerary-2026.firebaseapp.com",
  projectId: "bkk-itinerary-2026",
  storageBucket: "bkk-itinerary-2026.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
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
```

- [ ] **Step 2: Verify import resolves**

In console on `index.html`:

```js
import('./firebase.js').then(m => console.log(Object.keys(m)));
```

Expected: `['onAuth','signIn','signOut','subscribeState','writeState']`.

- [ ] **Step 3: Commit**

```bash
git add projects/bangkok/v2/firebase.js
git commit -m "bangkok: firebase module — auth + firestore"
```

---

### Task 17: Sign-in screen + auth gating

**Files:**
- Modify: `projects/bangkok/v2/app.js`
- Modify: `projects/bangkok/v2/index.html`

- [ ] **Step 1: Re-enable sign-in on `index.html`**

Change `<div id="signin" class="signin hidden" aria-hidden="true">` back to `<div id="signin" class="signin" aria-hidden="false">`.

- [ ] **Step 2: Add the import to the top of `app.js`**

```js
import { onAuth, signIn, signOut } from './firebase.js';
```

- [ ] **Step 3: Add wiring at the bottom of `app.js`**

```js
const signinEl = $('#signin');
const signinBtn = $('#signin-btn');
const signinError = $('#signin-error');
const signoutBtn = $('#signout-btn');

function showSignin(errorMsg) {
  signinEl.classList.remove('hidden');
  signinEl.setAttribute('aria-hidden', 'false');
  if (errorMsg) {
    signinError.textContent = errorMsg;
    signinError.hidden = false;
  } else {
    signinError.hidden = true;
  }
}
function hideSignin() {
  signinEl.classList.add('hidden');
  signinEl.setAttribute('aria-hidden', 'true');
}

signinBtn.addEventListener('click', async () => {
  signinBtn.disabled = true;
  try { await signIn(); }
  catch (e) { showSignin('Sign-in failed: ' + (e.message || e.code)); }
  finally { signinBtn.disabled = false; }
});

signoutBtn.addEventListener('click', () => signOut());

onAuth(user => {
  if (!user) {
    showSignin();
    setState({ signedInUser: null });
    return;
  }
  if (user.error === 'not_authorised') {
    showSignin(`"${user.email}" not on whitelist. Sign in with the right account.`);
    signOut();
    return;
  }
  hideSignin();
  signoutBtn.hidden = false;
  setState({ signedInUser: user });
});
```

- [ ] **Step 4: Test**

Reload. Sign-in card shown. Tap "Continue with Google" → popup → after success, card disappears, app loads. Try non-whitelisted account → error shown.

- [ ] **Step 5: Commit**

```bash
git add projects/bangkok/v2/app.js projects/bangkok/v2/index.html
git commit -m "bangkok: sign-in screen + whitelist gate"
```

---

### Task 18: Firestore sync

**Files:**
- Modify: `projects/bangkok/v2/app.js`

- [ ] **Step 1: Add the imports at the top of `app.js`**

Change the firebase import to:

```js
import { onAuth, signIn, signOut, subscribeState, writeState } from './firebase.js';
```

- [ ] **Step 2: Add sync wiring at the end of `app.js`**

```js
let unsubscribeRemote = null;
let applyingRemote = false;
let lastPushed = '';

subscribe(state => {
  // Subscribe to remote when signed in
  if (state.signedInUser && !unsubscribeRemote) {
    unsubscribeRemote = subscribeState(remote => {
      if (!remote) return;
      applyingRemote = true;
      const patch = {};
      if (remote.weather && remote.weather !== getState().weather) patch.weather = remote.weather;
      if (Array.isArray(remote.doneIds) && JSON.stringify(remote.doneIds) !== JSON.stringify(getState().doneIds)) patch.doneIds = remote.doneIds;
      if (Object.keys(patch).length) setState(patch);
      applyingRemote = false;
    });
  } else if (!state.signedInUser && unsubscribeRemote) {
    unsubscribeRemote();
    unsubscribeRemote = null;
  }

  // Push local mutations to remote
  if (applyingRemote) return;
  if (!state.signedInUser) return;
  const payload = JSON.stringify({ weather: state.weather, doneIds: state.doneIds });
  if (payload === lastPushed) return;
  lastPushed = payload;
  writeState({ weather: state.weather, doneIds: state.doneIds }, state.signedInUser.email);
});
```

- [ ] **Step 3: Test cross-phone sync**

- Open the app in two browser windows (or two phones). Sign in with both whitelisted accounts.
- Toggle weather to "storm" on phone A → within ~1 sec, phone B updates to storm.
- Click Done on phone B → phone A greys it.

- [ ] **Step 4: Commit**

```bash
git add projects/bangkok/v2/app.js
git commit -m "bangkok: firestore bidirectional sync"
```

---

## Phase 6 — Deploy + verify

### Task 19: Deploy to GitHub Pages

- [ ] **Step 1: Verify clean working tree**

```bash
cd /Users/jawaharmariselvam/projects/j6.studio
git status
```

Expected: all `projects/bangkok/v2/` commits present, working tree clean.

- [ ] **Step 2: Push**

```bash
git push origin main
```

Expected: push succeeds; GitHub builds Pages within ~60–90 sec.

- [ ] **Step 3: Verify live**

Open `https://balawedsnaga.j6.studio/projects/bangkok/v2/` on a phone.

Expected:
- Sign-in card shown
- After signing in, app loads
- All UI elements work (weather, day tabs, GPS, nearby)
- Both phones sync state in <1 sec

- [ ] **Step 4: Diagnose if broken:**
- Module 404 → file paths case-sensitive on Pages; check filenames
- Firebase auth fails → confirm `balawedsnaga.j6.studio` is in Authorized Domains
- Firestore writes silently fail → check Rules in console
- Sign-in popup blocked → some browsers block popups; instruct user to allow

- [ ] **Step 5: Add to Home Screen**

Phone Safari → Share → "Add to Home Screen". Bookmark icon = quick launch.

---

### Task 20: Pre-trip dry run (manual)

- [ ] **Step 1: UI smoke test** — go through every interaction:

  - Sign in (Google)
  - Weather: tap each of 3 buttons → outdoor slots react under storm
  - Day tabs: each switches the timeline
  - GPS: allow → "Where am I" pill updates
  - GPS: deny on a different device → banner shows; Pick area works
  - Now-what: expand → 4 buttons functional (Plan / Swap / Done / Nearby)
  - Slot card: Done toggles; Swap cycles; Storm-alt swaps to indoor
  - Maps deep-link → opens Google Maps app
  - Nearby sheet shows anchors within 1.5 km

- [ ] **Step 2: Two-phone sync verification**

  - Sign in on her phone with her email
  - Toggle weather on yours → her screen updates
  - Mark slot done on hers → yours greys

- [ ] **Step 3: Browser back-button doesn't break the app**

- [ ] **Step 4: Lock phone → unlock → state persists (localStorage + Firestore)**

- [ ] **Step 5: File any bugs found as follow-up; decide fix-now vs ship-now**

---

## Out-of-scope follow-ups (post-trip)

- PWA install (manifest.json + service worker)
- Live weather API auto-detect
- Editable slots/anchors via UI
- Multi-trip support
- Push notifications

---

## Spec coverage check

Re-read every spec section. Each maps to at least one task:

| Spec section | Task |
|---|---|
| Static shell (index.html) | 1 |
| Design tokens / styles | 2 |
| `dom.js` builder helper | 3 |
| anchors data | 4 |
| slots data | 5 |
| transports data | 6 |
| Test runner | 7 |
| `geo.js` Haversine + nearest + within | 8 |
| `time.js` parse + format + active slot | 9 |
| `state.js` localStorage + listeners | 10 |
| `render.js` slot/transport/now-what | 11 |
| Day tabs + weather + Done wiring | 12 |
| GPS watch + banner fallback | 13 |
| Nearby sheet + now-what actions | 14 |
| Firebase project + rules + config | 15 |
| `firebase.js` auth + Firestore CRUD | 16 |
| Sign-in + whitelist gate | 17 |
| Firestore bidirectional sync | 18 |
| Deploy | 19 |
| Pre-trip dry run | 20 |

All sections covered. No placeholders. Type/method names consistent across tasks (`getState/setState/subscribe`, `signIn/signOut/onAuth/subscribeState/writeState`, `el/replace`, `haversineKm/nearestAnchor/withinKm`, `parseHHMM/formatClock/activeSlot`, `anchorById/slotsByDay/slotById/transportFor`).
