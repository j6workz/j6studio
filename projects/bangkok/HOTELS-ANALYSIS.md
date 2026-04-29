# AirAsia Hotels — Bangkok Sukhumvit Analysis

**Search:** 30 Apr → 2 May 2026 · 2 pax · location_id 178236 (Bangkok) · currency MYR
**Data pulled:** 29 Apr 2026 via `hotelsbe.apiairasia.com/bff/search/v2/hotels`
**Pages fetched:** 16 of 16+ (paginated by `page_number`, 75–93 hotels each, `has_more_hotels=true` continues until exhausted)
**Total hotels analyzed:** 1,366

---

## API endpoint map

| Endpoint | Purpose | Auth |
|---|---|---|
| `POST /hotelsa/access_token` | Mint x-auth JWT for hotel APIs | static API key + `agent_id: LemonADT_Prod` |
| `POST /hotelsa/getssrdata` | Special service requests (room features, etc) | channel_hash header |
| `GET /smartfill/v3/smartfill/{location_id}` | Location autocomplete / smartfill | Bearer JWT |
| `GET /bff/search/v2/hotels` ⭐ | Hotel search + paginated list | Bearer + x-auth + client-id |

**Critical query params for `/bff/search/v2/hotels`:**
- `currency`, `country_code`, `checkin`, `checkout`, `occupancy`
- `location_id` (Bangkok = 178236)
- `hotels_size` (page size, max 100)
- `page_number` (0-indexed)
- `big_member_id` (BIG loyalty unlocks member-only rates)
- `lemon_agent_id=LemonADT_Prod` + `channel=LEMON_DUTY_TRAVEL` (channel discounts)
- `mtype=T4` (search type, leave as-is)

**JWT token lifecycle:** ~15 min for `x-auth` (mint via `/hotelsa/access_token`). Bearer JWT for search ~15 min. Refresh token long-lived.

---

## Data dictionary — single hotel record

```jsonc
{
  "id": "<short_hex_string>",            // unique hotel id for booking flow
  "name": "Galleria 10 Hotel Bangkok",
  "is_hotel_selected": false,
  "headline": "Near Terminal 21 Shopping Mall",
  "location": {                           // WGS84 coords
    "lat": "13.736889",
    "lon": "100.557038"
  },
  "star_rating": {
    "rating": "4.0",                      // 0–5, official star classification
    "type": "Star"
  },
  "guest_rating": {
    "rating": "4.2",                      // 0–5, average user rating
    "count": 1000                         // review count
  },
  "gallery": {
    "images": [                           // hero + room + lobby etc
      {
        "id": "...:0",
        "caption": "Primary image",
        "hero_image": true,
        "category": { "id": "48", "name": "Featured Image" },
        "links": { "70px": "...", "350px": "...", "1000px": "..." }
      }
    ]
  },
  "prices": {
    "pay_at_hotel_available": false,
    "buy_now_pay_later_available": false,
    "rate": {
      "refundable": false,
      "member_only_rate": true,
      "member_only_rate_available": true,
      "lead_price": {
        "base_rate": { "currency": "MYR", "value": "159.83" }   // per night
      },
      "big_life": {
        "points_earn": 187,               // BIG loyalty points
        "multiplier": "0.5"
      },
      "amenities": [                      // included with this rate
        { "id": 64, "name": "Free WiFi" },
        { "id": 16, "name": "Free parking" }
      ]
    }
  },
  "amenities": [                          // hotel-level facilities
    { "id": 1, "name": "Free Wifi" },
    { "id": 17, "name": "24-hour front desk" }
  ],
  "tags": {},                             // promotional tags (mostly empty)
  "distance_from_poi": 3.62,              // km from search POI center
  "coupons": []                           // promo codes available
}
```

**Top-level response fields:**
- `page_number` — current 0-indexed page
- `has_more_hotels` — pagination flag (boolean)
- `default_locale_used` — fallback flag
- `hotels` — array (size matches `hotels_size` until last page)
- `stay_detail` — checkin/checkout/occupancy echo
- `aggregations` — facet counts (hotel_class buckets, etc)
- `filters` — `popular_filters` array, `price_filter: { min, max }`
- `flyer_discount` — boolean flag

---

## Top 10 matches near current hotel area (Sukhumvit Soi 4–11)

**Filters applied:** within 1.5 km of `lat 13.7398, lon 100.5567`, guest rating ≥ 4.0/5, star ≥ 3, RM 100–500/night, ≥ 50 reviews.
**Score formula:** `rating × 30 − km × 8 − price/10 + log(reviews) × 3 + stars × 2`.

| # | Hotel | ★ | ⭐ | Reviews | km | RM/night | RM 2 nights |
|---|---|---|---|---|---|---|---|
| 1 | **Citrus Sukhumvit 11 Bangkok** | 4.0 | 4.3 | 658 | 0.52 | 161 | 322 |
| 2 | **Galleria 10 Hotel Bangkok** ⭐ | 4.0 | 4.2 | 1,000 | 0.33 | 160 | 320 |
| 3 | The Dawin Hotel | 4.0 | 4.4 | 632 | 0.46 | 196 | 393 |
| 4 | Uno Express | 3.0 | 4.4 | 973 | 0.38 | 212 | 424 |
| 5 | Citadines Sukhumvit 11 Bangkok | 4.0 | 4.2 | 1,242 | 0.46 | 176 | 352 |
| 6 | The Pinnacle Sukhumvit 11 by LeFoyer | 4.0 | 4.2 | 731 | 0.43 | 166 | 331 |
| 7 | Travelodge Sukhumvit 11 | 4.0 | 4.4 | 1,186 | 0.58 | 233 | 466 |
| 8 | The Quarter Ploenchit by UHG | 4.0 | 4.4 | 295 | 0.79 | 180 | 361 |
| 9 | Aspira Sukhumvit | 3.5 | 4.0 | 4,044 | 0.17 | 175 | 349 |
| 10 | Solitaire Bangkok Sukhumvit 11 | 4.5 | 4.2 | 1,490 | 0.62 | 202 | 405 |

**Benchmark — currently planned:** lyf Sukhumvit 8 · 4.0★ · 4.1/5 (only 161 reviews) · 0.32 km · RM 188/night · **RM 376 / 2 nights**.

---

## Recommendations

### 🏆 The Perfect Hotel — **Galleria 10 Hotel Bangkok**

- **Why:** matches lyf on location (0.33 km, same Soi 4 area, 5-min walk to Soi 3 halal street, 5-min walk to Nana BTS), beats it on every other axis: higher guest rating (4.2 vs 4.1), 6× more reviews (1,000 vs 161), and **RM 56 cheaper for 2 nights**.
- **Cost:** RM 159.83/night × 2 = **RM 319.66** (vs lyf RM 376).
- **Star:** 4.0 (same as lyf).
- **Amenities:** Free WiFi, gym, luggage storage, free self parking, concierge, 24-hr front desk.
- **Rate type:** member-only (you have BIG ID 9999990021826223 — qualifies).
- **Headline:** "Near Terminal 21 Shopping Mall" — same anchor as lyf.
- **Catch:** non-refundable rate.

### 🥈 Highest-rated value — **Citrus Sukhumvit 11**

- **Why:** highest guest rating in our budget bracket (4.3/5, 658 reviews), 4 stars, free parking + WiFi + gym, RM 161/night.
- **Cost:** RM 161.02 × 2 = **RM 322.04**.
- **Catch:** 0.52 km from anchor (10-min walk vs 4-min for Galleria 10), non-refundable.
- **Pick this if:** rating is the #1 priority over distance.

### 🥉 Most popular / safest bet — **Aspira Sukhumvit**

- **Why:** **4,044 reviews** — far more data than any other option, 0.17 km from current spot (closest), member rate.
- **Cost:** RM 174.54 × 2 = **RM 349.08**.
- **Catch:** 3.5 stars only (lower than 4.0 picks), 4.0 guest rating (lower than top picks).
- **Pick this if:** you want the most validated choice and proximity matters most.

### 💡 Stay with **lyf Sukhumvit 8** if already booked

- Already chosen, decent ratings, broader amenity list (free parking, garden, luggage, dry cleaning), 4 stars.
- **Switching cost:** RM 56 saved with Galleria 10. 1 day before trip — switching now risks booking confirmation issues.
- **Recommendation:** if booking is already paid + confirmed, stay. Don't churn now.

---

## Halal-friendly assessment

All top picks are within **0.2–0.8 km of Soi 3 (Little Arabia)** — halal restaurants, pharmacies, mosques walking distance. No hotel needs to be "halal-certified" itself; the area handles it.

**Closest to Soi 3 (Arab Street):**
1. Aspira Sukhumvit — 0.17 km (≈ 2 min walk)
2. lyf Sukhumvit 8 — 0.32 km
3. Galleria 10 — 0.33 km
4. Uno Express — 0.38 km

---

## Bottom line

| Scenario | Pick |
|---|---|
| **Booking still flexible** | Galleria 10 Hotel Bangkok (saves RM 56, more reviews, same area) |
| **Already booked at lyf** | Stay. Don't churn 1 day before. |
| **Want highest rating** | Citrus Sukhumvit 11 (4.3/5) |
| **Want most validated by reviews** | Aspira Sukhumvit (4,044 reviews) |
| **Want refundable** | None of these are refundable on lead rate. Filter rate options on AirAsia site to find refundable variants (typically 10–20% premium). |

---

## ✅ Final decision — booked

**GLOW Sukhumvit 5 by Centropolis** — RM 175.24/night × 2 = **RM 350.48 total** (member rate via AirAsia BIG, non-refundable).

- 4 stars · 4.1/5 (154 reviews) · 0.47 km from Soi Nana area
- **Rooftop pool ✓** (chosen for this — original lyf had no pool)
- Coords: 13.743463, 100.55448 (Soi 5, west of Nana BTS)
- Amenities: Pool, Gym, Free WiFi, Free self parking, Dry cleaning, Concierge, 24-hr desk
- Saves ~RM 25 vs lyf and adds pool

**Trade-offs accepted:**
- +3-5 min walk to Soi 3 halal street vs lyf (5 min vs 2 min — still trivial)
- Smaller review sample (154 — same caveat as lyf had)
- Non-refundable

**App + plan updated:** anchors, transports, slots, TRIP-PLAN.md hotel header, Day 1 check-in, Day 2 rest pool option, Day 3 bag storage, hotel tips section, budget table.

**Booking links** (replace `{id}` with hotel id from data dictionary):
- Search URL pattern: `https://www.airasia.com/hotels/{id}/...`
- Or open AirAsia site, search Bangkok 30 Apr–2 May 2026, scroll to hotel name.

---

*Analysis generated from AirAsia hotels API. Token lifecycle is ~15 min — re-run via `/hotelsa/access_token` to refresh if querying again.*
