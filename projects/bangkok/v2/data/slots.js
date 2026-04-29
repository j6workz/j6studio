// 3-day plan. Each anchor appears in at most 2 slots (1 primary + 1 alt).
// time_start / time_end are "HH:MM" 24h.
// alt_ids surface when storm toggle is on, or via Swap button.
//
// Times calibrated to Open-Meteo hourly forecast for 30 Apr–2 May 2026
// (pulled 29 Apr 2026). Day 2 explicitly delays outdoor temples until 11:00
// because 9 AM forecast = 8.4 mm heavy rain. Wat Arun moved to golden hour.

export const slots = [
  // === Day 1 — Thu 30 Apr ===
  { id: "d1_arrive", day: 1, time_start: "07:00", time_end: "09:00",
    primary_id: "dmk_airport", alt_ids: [],
    notes: "Land DMK, clear immigration, Grab to GLOW Sukhumvit 5 ~250–400 THB / 30–45 min. Weather: 28°C feels 35, dry.",
    prev_slot_id: null },
  { id: "d1_checkin", day: 1, time_start: "09:00", time_end: "12:00",
    primary_id: "hotel", alt_ids: [],
    notes: "GLOW Soi 5 — pre-confirmed early check-in (you messaged ahead). If room not ready: lobby + 24hr desk hold bags, freshen in lobby toilet. Pool opens ~07:00 but skip — sleep first. Nap 3–4 hr non-negotiable. Weather: 32–34°C feels 37–39, UV 4–8.",
    prev_slot_id: "d1_arrive" },
  { id: "d1_lunch", day: 1, time_start: "12:30", time_end: "14:00",
    primary_id: "soi_nana_arab", alt_ids: ["terminal21"],
    notes: "Halal Soi 3 — Petra (Yemeni mandi), Al Hussain (biryani), Bamboo (Lebanese). 80–280 THB pp. Hydrate hard. Weather: 33°C feels 38, UV 8 peak.",
    prev_slot_id: "d1_checkin" },
  { id: "d1_salon", day: 1, time_start: "14:30", time_end: "17:00",
    primary_id: "green_pastures", alt_ids: ["boy_rikyu", "terminal21"],
    notes: "Pre-booked Green Pastures (Korean + Aveda). Cut+blow 1,000–1,200 THB OR cut+Aveda thinning combo 2,500–3,500 THB. J6: beard trim Soi 3–11 barber 150–250 THB. Weather: 35°C feels 41 outside, AC inside.",
    prev_slot_id: "d1_lunch" },
  { id: "d1_dinner", day: 1, time_start: "18:30", time_end: "21:00",
    primary_id: "soi_nana_arab", alt_ids: ["jodd_fairs", "iconsiam"],
    notes: "Halal Soi 3 — Nefertiti (Egyptian), Sofra (Turkish), Al-Salam (lamb mandi). 250–350 THB pp. Storm cells start 21:00. Weather: 31°C feels 36, dry.",
    prev_slot_id: "d1_salon" },
  { id: "d1_sleep", day: 1, time_start: "21:30", time_end: "23:30",
    primary_id: "hotel", alt_ids: [],
    notes: "Bed by 22:30. Big temple day tomorrow — wake 06:30. Weather: 30°C feels 35, TStorm cells overhead.",
    prev_slot_id: "d1_dinner" },

  // === Day 2 — Fri 1 May ===
  { id: "d2_breakfast", day: 2, time_start: "06:30", time_end: "07:30",
    primary_id: "hotel", alt_ids: [],
    notes: "Hotel café or 7-Eleven. Pack water, umbrella, sun hat, raincoat. Weather: 24°C feels 30, light drizzle.",
    prev_slot_id: "d1_sleep" },
  { id: "d2_indoor_wait", day: 2, time_start: "07:30", time_end: "10:30",
    primary_id: "hotel", alt_ids: ["terminal21", "krungthong_plaza"],
    notes: "⚠️ DO NOT go to Grand Palace yet. 9 AM forecast = 8.4 mm heavy rain. Stay AC. Plan B: Terminal 21 opens 10:00. Weather: 24–26°C feels 29–31, 41% rain peak.",
    prev_slot_id: "d2_breakfast" },
  { id: "d2_grand_palace", day: 2, time_start: "11:00", time_end: "13:00",
    primary_id: "grand_palace", alt_ids: ["talat_noi", "wat_saket"],
    notes: "Rain easing, post-shower. Allow 1.5–2 hr. Strict dress code (covered shoulders + knees). 500 THB pp. Scam alert: ignore 'palace closed' touts. Weather: 28–30°C feels 35–37, drizzle clearing, UV 8 climbing.",
    prev_slot_id: "d2_indoor_wait" },
  { id: "d2_wat_pho", day: 2, time_start: "13:15", time_end: "14:30",
    primary_id: "wat_pho", alt_ids: [],
    notes: "Walk 5 min south. Reclining Buddha + 1 hr Thai massage 420 THB on grounds (peak-heat shelter). 300 THB entry. 108 coin bowls — bring small change. Weather: 30–31°C feels 38–39, drizzle, UV 9 peak.",
    prev_slot_id: "d2_grand_palace" },
  { id: "d2_rest", day: 2, time_start: "14:30", time_end: "16:00",
    primary_id: "krungthong_plaza", alt_ids: ["hotel", "platinum_mall"],
    notes: "3 options: (a) Krungthong shopping (plus-size, AC); (b) GLOW rooftop pool — drizzle washes off + best break of trip; (c) hotel room rest if drained. All storm-proof. Pool dip is the splurge play. Weather: 31–32°C feels 38, drizzle 73–76%.",
    prev_slot_id: "d2_wat_pho" },
  { id: "d2_wat_arun", day: 2, time_start: "16:30", time_end: "17:45",
    primary_id: "wat_arun", alt_ids: ["wat_saket"],
    notes: "Golden hour, cooler, post-rain. Cross-river ferry Tha Tien 5 THB. 100 THB entry. Closes 18:00. Skip climb if steps slick. Storm alt: Wat Saket 300 stairs (closes 19:00, partly covered). Weather: 31°C feels 36, rain easing 41%, UV 3.",
    prev_slot_id: "d2_rest" },
  { id: "d2_iconsiam", day: 2, time_start: "18:30", time_end: "21:30",
    primary_id: "iconsiam", alt_ids: ["jodd_fairs"],
    notes: "Cross-river ferry → Sathorn Pier → free ICONSIAM shuttle. 19:00 fountain (riverside terrace, free). SookSiam ground floor. Thipsamai pad Thai (halal certified) 80–120 THB. Weather: 28–30°C feels 34–36, dry. Best window of day.",
    prev_slot_id: "d2_wat_arun" },

  // === Day 3 — Sat 2 May ===
  { id: "d3_breakfast", day: 3, time_start: "07:00", time_end: "08:00",
    primary_id: "hotel", alt_ids: [],
    notes: "Check out of GLOW. 24hr front desk holds bags free until 14:30. Big breakfast at hotel or 7-Eleven Soi 5. Comfortable walking shoes. Last pool dip if you woke early. Weather: 26°C feels 33, dry, TStorm cells overhead.",
    prev_slot_id: "d2_iconsiam" },
  { id: "d3_chatuchak", day: 3, time_start: "09:00", time_end: "11:30",
    primary_id: "chatuchak", alt_ids: ["platinum_mall", "krungthong_plaza"],
    notes: "BTS Nana → Mo Chit direct ~30 min 44 THB. Bring 3,000–4,000 THB cash. Halal: Saman Islam Sec 16 / Soi 24. ⚠️ HARD EXIT 11:30 — 12:00 hits feels 41. Storm alt: Platinum Mall (AC, plus-size F3–F4). Weather: 30–32°C feels 37–40 climbing, UV 4–8.",
    prev_slot_id: "d3_breakfast" },
  { id: "d3_siam", day: 3, time_start: "12:00", time_end: "14:00",
    primary_id: "siam_paragon", alt_ids: ["mbk", "jim_thompson_house"],
    notes: "BTS Mo Chit → Siam ~10 min 25 THB. AC through peak heat. Lunch food hall (halal options). Last shopping: Uniqlo linen, Naraya bags, Jim Thompson silk. Leave by 13:50. Weather: 33°C feels 41 outside (worst hour), then 30°C with rain by 13:00.",
    prev_slot_id: "d3_chatuchak" },
  { id: "d3_collect", day: 3, time_start: "14:00", time_end: "14:30",
    primary_id: "hotel", alt_ids: [],
    notes: "BTS Siam → Nana, collect bags, repack Chatuchak haul into check-in luggage. Quick freshen. Weather: 31°C feels 37, rain easing.",
    prev_slot_id: "d3_siam" },
  { id: "d3_airport", day: 3, time_start: "14:30", time_end: "18:45",
    primary_id: "dmk_airport", alt_ids: [],
    notes: "⚠️ Leave hotel 14:30 sharp. Saturday DMK 60–90 min realistic, NOT 45. Counter closes 17:45 for AK893 18:45. Grab 300–450 THB. Weather: 30–31°C feels 35, light rain possible.",
    prev_slot_id: "d3_collect" }
];

export function slotsByDay(day) { return slots.filter(s => s.day === day); }
export function slotById(id) { return slots.find(s => s.id === id); }
