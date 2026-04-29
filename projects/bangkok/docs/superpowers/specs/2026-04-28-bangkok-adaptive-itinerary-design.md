# Bangkok Adaptive Itinerary — Design Spec

**Date:** 2026-04-28
**Trip dates:** 30 Apr – 2 May 2026
**Travellers:** J6 + GF (2 pax)
**Status:** Design approved, pending user review of this doc.

## Overview

A single-page adaptive trip itinerary for Bangkok that helps the couple make spontaneous-but-tracked decisions in real time. The page reads three pieces of state — current weather (manual toggle), current location (GPS), and current time — and surfaces the right next step plus the right transport option. State syncs across both phones via Firebase.

This replaces the current static [index.html](../../../index.html) v1 page, which lives on as a backup.

## Goals

1. Eliminate decision paralysis: at any moment, one tap reveals "what to do next" with transport pre-planned.
2. Adapt to live conditions: storm vs sun changes which spots surface; GPS proximity ranks options.
3. Stay tracked: the planned timeline is always visible; "Done" advances slot state.
4. Two-phone sync: state is shared so either phone shows the same view.
5. Work offline-resilient: GPS, weather toggle, transport data, slot data all function without network. Maps deep-links and Firebase sync require network.

## Non-goals (YAGNI)

- Multi-trip support (hardcoded to one trip doc).
- Account management UI beyond Google sign-in/out.
- Editing slots, anchors, or transports from the UI (data files are edited in code and redeployed).
- Auto-routing inside the app — Google Maps deep-links handle that.
- Live weather API — manual toggle is more accurate (you can see if it's actually raining where you are).
- Push notifications.
- Conflict resolution beyond last-write-wins (fine for two trusted users).

## Architecture

Static single-page app. Vanilla JS, no framework, no build step. Hosted on GitHub Pages.

**Repo:** `git@github.com:j6workz/j6studio.git`
**Branch:** `main` (Pages source per repo settings: `main` / `(root)`)
**Custom domain:** `balawedsnaga.j6.studio` (set in repo Settings → Pages)
**Deploy convention:** `projects/<name>/` — already proven by existing `projects/workvivo-chat-favorites-extension/` which serves at `https://balawedsnaga.j6.studio/projects/workvivo-chat-favorites-extension/`

In-repo path:

```
j6studio/                           # repo root, main branch
  projects/
    bangkok/
      index.html                    # v1 static page (kept as backup)
      v2/
        index.html                  # adaptive shell
        app.js                      # state, render, GPS, sync logic
        firebase.js                 # Firebase init + auth + Firestore CRUD
        style.css                   # extends v1 design tokens
        data/
          anchors.js                # ~22 spot definitions
          slots.js                  # 3-day plan with primary + alts
          transports.js             # ~45 pre-computed transition pairs
```

Live URLs:
- v1: `https://balawedsnaga.j6.studio/projects/bangkok/`
- v2: `https://balawedsnaga.j6.studio/projects/bangkok/v2/`

**Workspace:** Everything (v1 page, v2 source, specs, plans) lives directly inside the `j6studio` repo at `projects/bangkok/`. Local working path: `/Users/jawaharmariselvam/projects/j6.studio/projects/bangkok/` (folder name retains the dot for legacy reasons; remote points to renamed `j6studio` repo). Push `main` to deploy.

**Note on URL aesthetics:** the public URL contains `balawedsnaga` (a wedding site subdomain currently using this Pages site). Acceptable for a private trip planner shared between two phones; switch to a dedicated subdomain (e.g. `bangkok.j6.studio`) later if desired.

## Data model

Three in-code data tables, exported as JS objects.

### `anchors[]` — every spot

```js
{
  id: "wat_pho",
  name: "Wat Pho",
  coords: { lat: 13.7465, lon: 100.4927 },
  weather: "outdoor" | "indoor" | "either",
  duration_min: 90,
  category: "temple" | "mall" | "market" | "food" | "spa" | "culture" | "transit",
  tags: ["halal_friendly", "plus_size", "non_halal", "must_see"],
  cost_thb: 300,                          // entry per pax, 0 if free
  hours: "08:00–19:30",
  notes: "Reclining Buddha. Massage on grounds 300 THB.",
  gmaps_url: "https://maps.google.com/?q=...",
  emoji: "🛏"
}
```

Each anchor appears in **at most 2 slots** across the whole 3-day plan (1 primary + 1 alternative). Enforced by hand at data-entry time.

### `slots[]` — the planned itinerary

```js
{
  id: "d2_morning_temples",
  day: 2,                                 // 1=Thu 30 Apr, 2=Fri 1 May, 3=Sat 2 May
  time_start: "08:30",
  time_end: "13:00",
  primary_id: "grand_palace",
  alt_ids: ["wat_saket", "jim_thompson_house"],
  notes: "Best weather day. Hit early before heat.",
  prev_slot_id: "d2_breakfast"            // for transport lookup
}
```

### `transports[]` — pre-computed transitions

Keyed by `from_id + "→" + to_id`. ~45 pairs covering all primary-to-primary and primary-to-alt transitions actually possible in the plan.

```js
{
  key: "asok→grand_palace",
  primary: {
    steps: [
      "Walk to Asok BTS, ~5 min",
      "Sukhumvit Line → Saphan Taksin, 6 stops, ~20 min, 44 THB",
      "Walk to Sathorn Pier, ~3 min",
      "Orange-flag Chao Phraya boat → Tha Chang (N9), ~25 min, 16 THB",
      "Walk to gate, ~2 min"
    ],
    duration_min: 55,
    cost_thb: 60
  },
  storm_alt: {
    steps: ["Grab car door-to-door"],
    duration_min: 45,
    cost_thb: 450
  }
}
```

## State

### Per-trip (synced via Firestore)

```
trips/bkk-2026/state {
  weather: "sunny" | "cloudy" | "storm",
  done_ids: ["d1_arrival", "d1_lunch", ...],
  last_updated_by: "<email>",
  last_updated_at: <timestamp>
}
```

### Per-device (localStorage only)

- `gps_last`: `{ lat, lon, ts }` — refreshed every 60 s while page open
- `auth_user`: cached after Google sign-in

## UI flow

### Sign-in screen (first load)

Single "Continue with Google" button. After successful auth, the app checks email against the Firestore-rules whitelist. Non-whitelisted accounts see "Not authorised."

### Main view

**Sticky top bar** (always visible):
- Weather toggle: 3 emoji buttons ☀️ ☁️ ⛈ (active state highlighted)
- Live clock (hh:mm, updates every minute)
- "Where am I" pill: nearest anchor + distance, GPS-fed; tap to refresh

**Day tabs:** Thu 30 / Fri 1 / Sat 2 — pill-style.

**Day timeline** (scrollable, default view of selected day):

Each slot card shows:
- Time block (e.g. `08:30–13:00`)
- Primary anchor block (name, emoji, cost, duration, brief notes)
- Inline transport block (Standard density: route steps, duration, cost) showing how to get there from the previous slot's location
- Tag badges (halal-friendly, plus-size, indoor, non-halal)
- "Alternatives" collapsible (1–2 alt anchors with their own transport blocks)
- "Done" check button → marks `done_ids[]`, syncs

When `weather === "storm"`:
- Outdoor primary cards get a grey overlay
- A "Storm alt →" button appears, swapping the displayed primary to the slot's first indoor alt for this session (visual only, doesn't mutate slot data)

### "Now what?" bottom sheet (sticky, collapsible)

Computes the *active* slot from current clock + `done_ids[]`. Shows:
- Active slot title
- Transport from current GPS position to the active anchor (closest matching pre-computed pair, or fallback "Open in Google Maps")
- Four buttons:
  - **Plan** → scrolls timeline to active slot
  - **Swap** → cycles through alts for this slot (visual only)
  - **Done** → marks complete, advances active slot
  - **Nearby** → opens a sheet listing all anchors within 1.5 km of GPS, filtered by current weather, sorted by fit (weather match, then proximity, then time-fits-remaining)

## State logic

### Active-slot computation

```
active = first slot where:
  slot.day === selected_day
  AND slot.id NOT IN done_ids
  AND now() <= slot.time_end + 30min grace
```

If none match (e.g. user fell behind), active = first un-done slot of the day.

### Weather effect

Toggling weather:
- Re-renders all slot cards with overlay/swap-button logic
- Updates the Nearby sheet's filter
- Writes to Firestore (debounced 500 ms)

### GPS effect

GPS update every 60 s while page open:
- Recomputes nearest anchor for "Where am I" pill
- Refreshes the active-slot transport card
- Updates Nearby sheet ordering

### Manual "Done"

Pushes slot id to `done_ids[]` in Firestore. Realtime listener on the other phone updates within ~1 s.

## Backend — Firebase

### Setup

- New Firebase project: `bkk-itinerary-2026`
- Enable: Authentication (Google provider), Firestore (Native mode)
- Public web config copied into `firebase.js` (anon key is fine to commit; security is in Firestore rules)

### Firestore rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trips/bkk-2026/{doc=**} {
      allow read, write: if request.auth.token.email in [
        "j6rockz@gmail.com",
        "ferinakhansanabilah@gmail.com"
      ];
    }
  }
}
```

Both emails confirmed by user.

### Cost

Firebase free tier: 50K reads/day, 20K writes/day, 1 GB storage. Estimated trip usage: <100 reads, <50 writes total. Zero risk of paid charges.

## Error handling

- **GPS denied / unavailable**: "Where am I" pill becomes a 6-button row of manual area picks (Hotel, Asok, Old City, ICONSIAM, Chatuchak, Siam). Nearby sheet uses the manual pick instead.
- **localStorage blocked**: Falls back to in-memory state (lost on refresh). A small banner warns once.
- **Firestore offline**: Firebase SDK queues writes, replays when network returns. UI shows a tiny "syncing…" indicator.
- **Auth fails / non-whitelisted email**: Shows "Not authorised — sign in with the right account" with a sign-out button.
- **No internet at all**: Page still renders from cache (browser default). Toggles work locally; sync resumes when online.
- **Transport pair not found** for a from→to combination: Card shows "Open route in Google Maps" deep-link as fallback.

## Security

- Firestore rules whitelist only the two emails. No other Google account can read or write.
- Anon Firebase web key is public by design. Security is enforced server-side by rules.
- No payment, location history, or personal data beyond what's already in this trip plan.
- After 2 May 2026, the Firestore project can be deleted from Firebase console (or kept as memorabilia — costs nothing on free tier).

## Inputs needed from user before build

1. **Girlfriend's Google account email** for the Firestore whitelist.
2. **GitHub Pages path / domain** confirmation: which subfolder of which repo, and the live URL pattern.
3. **Confirmation that the existing static `index.html` should remain at the root** (v2 lives in `/v2/`).

## Build phases (for implementation plan)

The implementation plan (next document) will break work into:
1. Static shell + data tables + visual styling
2. State engine (clock-based active slot, weather toggle, done tracking) — local only
3. GPS + Nearby sheet
4. Firebase auth + Firestore sync
5. Polish: storm overlay, transport fallbacks, error banners
6. Pre-trip dry-run on phone, both accounts

## Out of scope (re-stated for clarity)

- Multi-trip / multi-user-pair support
- Live weather API integration
- Push notifications
- Editable slots/anchors via UI
- Native app
- Offline-first PWA install (could be a phase 7 if you like the v2)
