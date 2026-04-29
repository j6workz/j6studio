// Structured shopping data — one entry per anchor.id.
// Rendered as native UI cards inside the app, NOT raw markdown.
// Each item: { name, what, price, halal: 'safe' | 'non' | 'unknown', for: ['her','him','both'], note? }

export const shopping = {
  terminal21: {
    title: "Terminal 21 Asok",
    emoji: "🏬",
    hours: "10:00–22:00 daily",
    transport: "BTS Nana → Asok (2 stops). Exit BTS directly into mall.",
    tagline: "Themed mall — each floor is a different global city.",
    protip: "Pick up Tourist Privilege Card at info counter (G floor) for store discounts. Free, takes 2 min.",
    sections: [
      { title: "G — Rome (entry, basics)", items: [
        { name: "Daiso", what: "Japanese variety store, travel organizers, gifts", price: "60 THB/item", halal: "safe", for: "both" },
        { name: "Watsons / Boots", what: "Sunscreen, toiletries, basics", price: "varies", halal: "safe", for: "both" },
        { name: "Madame Heng soap", what: "Thai natural glycerin soap bars", price: "60–150 THB", halal: "safe", for: "both", note: "Take-home gift" },
        { name: "ChaTraMue Thai Tea counter", what: "Original Thai iced milk tea — the brand others copy", price: "30–50 THB", halal: "safe", for: "both" },
      ]},
      { title: "F1 — Tokyo (women's fashion)", items: [
        { name: "Local Thai indie brands", what: "Flowy linen co-ords, oversized tees", price: "200–500 THB", halal: "safe", for: "her", note: "Sizes only up to XL–2XL. Skip if Ferina needs larger — go Krungthong." },
        { name: "Korean-style fits", what: "Casual cotton sets", price: "400–900 THB", halal: "safe", for: "her" },
      ]},
      { title: "F2 — London (men's + sportswear)", items: [
        { name: "Decathlon", what: "Sports gear, running shoes, gym wear — cheaper than KL", price: "varies", halal: "safe", for: "him" },
        { name: "Local menswear", what: "Cotton/linen shirts, casual pants", price: "200–700 THB", halal: "safe", for: "him", note: "XL Thai = Malaysian L–XL fits" },
        { name: "Tomato Jeans", what: "Affordable jeans, decent quality", price: "400–700 THB", halal: "safe", for: "him" },
      ]},
      { title: "F3 — Istanbul (accessories + cosmetics)", items: [
        { name: "Eveandboy", what: "Thai cosmetics megastore — Mistine, Snail White, Karmart", price: "varies, all cheaper than airport", halal: "safe", for: "her" },
        { name: "Mistine BB Cream", what: "Tinted moisturizer", price: "90–150 THB", halal: "safe", for: "her", note: "Same/cheaper than KL" },
        { name: "Snail White moisturiser", what: "Korean-style snail mucin cream", price: "250–400 THB", halal: "safe", for: "her" },
        { name: "Karmart Cathy Doll serum", what: "Affordable serums", price: "150–250 THB", halal: "safe", for: "her" },
        { name: "Bioré UV Aqua Rich sunscreen", what: "Daily SPF50 — Bangkok-grade UV", price: "100 THB", halal: "safe", for: "both" },
        { name: "Korean accessories", what: "Earrings, rings, necklaces", price: "100–300 THB", halal: "safe", for: "her" },
      ]},
      { title: "F5 — Pier 21 Food Court", items: [
        { name: "Pad See Ew", what: "Wide flat noodles, soy sauce, egg, protein. Better than tourist spots", price: "55–70 THB", halal: "unknown", for: "both", note: "Say 'mai sai moo' (no pork) — most use pork-free broth on request" },
        { name: "Tom Kha Gai", what: "Coconut chicken soup", price: "60–80 THB", halal: "unknown", for: "both" },
        { name: "Mango Sticky Rice", what: "Generous portion", price: "60–80 THB", halal: "safe", for: "both" },
        { name: "Som Tum", what: "Green papaya salad. Say 'mai phet' for not spicy", price: "50–60 THB", halal: "safe", for: "both" },
        { name: "Cha Yen", what: "Thai iced tea", price: "25–35 THB", halal: "safe", for: "both" },
      ], note: "Pre-paid card system: load 100–300 THB at counter, refund unused." }
    ],
    bargain: null
  },

  jodd_fairs: {
    title: "Jodd Fairs Ratchada",
    emoji: "🌙",
    hours: "17:00–01:00 daily",
    transport: "MRT Sukhumvit → Thailand Cultural Centre (Exit 4). 3 min walk.",
    tagline: "1,500+ outdoor stalls. Non-halal heavy — pick stalls carefully.",
    protip: "Last 30 min before closing (00:30–01:00) = best haggle window.",
    sections: [
      { title: "🍴 Food (eat in this order)", items: [
        { name: "Make Me Mango", what: "Fresh mango smoothie with chunks", price: "80 THB", halal: "safe", for: "both" },
        { name: "Toro Fries", what: "Massive fried potato spirals + sauces", price: "100 THB", halal: "safe", for: "both" },
        { name: "Madam Luck", what: "Halal Thai stall — rice dishes, look for green halal sign in front area", price: "60–90 THB", halal: "safe", for: "both" },
        { name: "Korean fried chicken (halal-marked)", what: "Several stalls with green stickers", price: "120–200 THB", halal: "safe", for: "both" },
        { name: "Grilled seafood", what: "Live tank stalls — fish, prawns, shellfish. Say 'mai sai butter' for plain", price: "150–350 THB", halal: "safe", for: "both" },
        { name: "Mango sticky rice", what: "Many vendors throughout", price: "60–80 THB", halal: "safe", for: "both" },
        { name: "Leng Zabb volcano ribs", what: "Iconic but PORK", price: "180–300 THB", halal: "non", for: "him", note: "Ask for chicken (ไก่) version if Ferina wants to try the format" },
      ]},
      { title: "👕 Clothing + accessories", items: [
        { name: "Linen / cotton tops", what: "Look for 'ลินิน' stalls. Most go to L/XL, some 2XL", price: "150–300 THB", halal: "safe", for: "her" },
        { name: "Elephant pants", what: "Wide-leg breathable pattern pants — actually useful in KL too", price: "100–200 THB", halal: "safe", for: "both" },
        { name: "Tote bags / canvas bags", what: "Printed Thai designs, useful", price: "80–150 THB", halal: "safe", for: "both" },
        { name: "Handmade earrings", what: "Beaded, resin, shell designs", price: "80–200 THB/pair", halal: "safe", for: "her" },
        { name: "Beaded bracelets", what: "Strung on the spot — customizable", price: "80–150 THB", halal: "safe", for: "her" },
        { name: "100 THB shop", what: "Look for 'ทุกอย่าง 100' signs — flat-rate clothing rummage", price: "100 THB flat", halal: "safe", for: "both" },
      ]}
    ],
    bargain: [
      "Clothing: start at 70% of asking. Rarely below 60%.",
      "Smile throughout — moment you look annoyed, price goes up.",
      "Food stalls: never bargain.",
      "Last 30 min = best deals."
    ]
  },

  soi_nana_arab: {
    title: "Soi Nana / Soi 3 (Little Arabia)",
    emoji: "🥙",
    hours: "Most shops + pharmacies daytime; restaurants 24/7",
    transport: "5–8 min walk along Sukhumvit from hotel. No BTS needed.",
    tagline: "Halal pharmacies, modest fashion, halal grocery — only place in central Bangkok with this concentration.",
    protip: "Watson's at corner of Soi 3 = full pharmacy + cosmetics in one stop.",
    sections: [
      { title: "💊 Pharmacy basics", items: [
        { name: "Watson's Sukhumvit Soi 3", what: "Sunscreen, basics, halal-marked toiletries", price: "varies", halal: "safe", for: "both" },
        { name: "Boots Sukhumvit 7", what: "Larger imported brand selection", price: "varies", halal: "safe", for: "both" },
      ]},
      { title: "🧕 Halal-specific items hard to find elsewhere", items: [
        { name: "Hijab pins, modest fashion accessories", what: "Small shops on Soi 3", price: "100–500 THB", halal: "safe", for: "her" },
        { name: "Oud-based perfumes, miswak sticks", what: "Arabic toiletries", price: "100–500 THB", halal: "safe", for: "both" },
        { name: "Date snacks (medjool, ajwa)", what: "Boxed dates, better selection than supermarkets", price: "200–500 THB/box", halal: "safe", for: "both" },
        { name: "Madinah Halal Mart (Soi 3/1)", what: "Halal-certified meats, frozen dim sum, dates, ajwa", price: "100–800 THB", halal: "safe", for: "both" },
        { name: "Yemeni/Egyptian sweets", what: "Knafeh kits, baklava packs", price: "150–400 THB", halal: "safe", for: "both" },
      ]}
    ],
    bargain: null
  },

  krungthong_plaza: {
    title: "Krungthong Plaza (plus-size mall)",
    emoji: "👗",
    hours: "~09:00–18:00 (some stalls from 08:00). Go before 17:00.",
    transport: "BTS Phrom Phong/Chidlom + 8 min walk. Or Grab from Wat Pho ~25 min, 150 THB.",
    tagline: "Bangkok's only dedicated plus-size mall. 4 floors, 600+ shops, sizes S–8XL.",
    protip: "Wear thin stretchy clothes — most stalls have no fitting rooms. Wholesale kicks in at 2–3 pieces same stall: ask 'tho rai song chin?'",
    sections: [
      { title: "F1 — Casual everyday tops, basics", items: [
        { name: "Linen-blend tees", what: "Ask 'sai lin-in mai?' (is this linen?)", price: "150–250 THB", halal: "safe", for: "her", note: "Most affordable floor" },
        { name: "Plain tops, flowy blouses", what: "Bust 44–52 inch standard stock", price: "150–300 THB", halal: "safe", for: "her" },
      ]},
      { title: "F2 — Mixed fashion + Fat Boys (men!)", items: [
        { name: "Fat Boys (Room 2027–2029)", what: "Men's plus-size XXL–7XL, English-speaking staff", price: "300–600 THB", halal: "safe", for: "him", note: "J6's stop if Uniqlo doesn't fit. Hawaii shirts 350–550, plain shirts 300–500." },
        { name: "Muenfun Shop", what: "Trendy plus-size — bodycon, bold prints. Bust 44–48 in", price: "300–600 THB", halal: "safe", for: "her" },
        { name: "No's Bra", what: "Plus-size bras + shapewear, Western sizes — only reliable spot in Bangkok", price: "varies", halal: "safe", for: "her" },
        { name: "Wide-leg trousers", what: "Linen and cotton blends", price: "300–500 THB", halal: "safe", for: "her" },
        { name: "Linen co-ord sets", what: "Top + pants matched", price: "500–900 THB", halal: "safe", for: "her" },
      ]},
      { title: "F3 — Dresses, evening, kaftans", items: [
        { name: "Baifern Shop", what: "Cocktail dresses, special occasion, chest 40–48 in", price: "500–1,200 THB", halal: "safe", for: "her" },
        { name: "Kaftans (food court area)", what: "Loose breathable travel dresses — modest-friendly, wear in KL too", price: "300–600 THB", halal: "safe", for: "her", note: "Halal-modest friendly" },
        { name: "Maxi dresses (batik/printed)", what: "Floor-length in regional fabrics", price: "350–600 THB", halal: "safe", for: "her" },
      ]},
      { title: "F4 — Trendy/chic plus-size", items: [
        { name: "Netnechaar", what: "Cute chic styles, sizes 32–42 in (smaller end of plus)", price: "300–700 THB", halal: "safe", for: "her" },
        { name: "Vanilla", what: "Comfortable casual-smart", price: "300–600 THB", halal: "safe", for: "her" },
        { name: "Pleated skirts/blouses", what: "Very on-trend", price: "300–500 THB", halal: "safe", for: "her" },
      ]}
    ],
    bargain: [
      "2–3 pieces same stall = wholesale price kicks in (~10–20% off).",
      "Cash only — most stalls don't take card. ATM inside.",
      "Staff size you by eye — let them help.",
    ]
  },

  iconsiam: {
    title: "ICONSIAM + SookSiam",
    emoji: "🌊",
    hours: "10:00–22:00. SookSiam same hours. Fountain show 19:00 / 20:00 / 21:00.",
    transport: "BTS Nana → Saphan Taksin → Sathorn Pier → free ICONSIAM shuttle boat (every 10 min).",
    tagline: "Riverside mega-mall + indoor floating market recreating all 77 Thai provinces.",
    protip: "Catch 19:00 fountain on riverside G-floor terrace — get there 18:45, fills fast.",
    sections: [
      { title: "🍴 SookSiam food (G floor — halal-safe)", items: [
        { name: "Pad Thai Thipsamai (halal certified)", what: "Legendary 1939 brand. Order egg-wrapped (Pad Thai ho khai) — signature", price: "80–120 THB", halal: "safe", for: "both", note: "Must-try" },
        { name: "Khao Yam (southern rice salad)", what: "Light herbal, halal-safe", price: "60–80 THB", halal: "safe", for: "both" },
        { name: "Rotee", what: "Thai-Muslim flatbread + sweet dipping sauce", price: "40–60 THB", halal: "safe", for: "both" },
        { name: "Mango sticky rice (multiple stalls)", what: "Standard sweet", price: "60–80 THB", halal: "safe", for: "both" },
        { name: "Fresh coconut water", what: "Served in shell", price: "50–70 THB", halal: "safe", for: "both" },
        { name: "Northern sai oua sausage", what: "Herbal pork sausage — non-halal", price: "80–120 THB", halal: "non", for: "him" },
      ]},
      { title: "🛍 SookSiam buys (G floor)", items: [
        { name: "Thai silk scarves (North zone)", what: "Handwoven, real (not tourist replica)", price: "250–800 THB", halal: "safe", for: "both", note: "Best gift" },
        { name: "Mudmee handwoven cotton fabric (NE/Isaan zone)", what: "Distinctive Thai pattern", price: "300–1,200 THB/m", halal: "safe", for: "both" },
        { name: "Benjarong ceramics (Central zone)", what: "Royal-style porcelain, decorative", price: "300–1,500 THB", halal: "safe", for: "both" },
        { name: "Herbal balms / Prai cream / Ya dom", what: "Better quality than market stalls", price: "80–300 THB", halal: "safe", for: "both" },
        { name: "Thai coconut sugar", what: "Caramel-like, cooking ingredient", price: "80–150 THB/pack", halal: "safe", for: "both" },
        { name: "Nam prik chilli paste packs", what: "Vacuum sealed — safe to fly", price: "60–120 THB", halal: "safe", for: "both" },
        { name: "Kratip rattan boxes", what: "Woven rice containers — beautiful gift", price: "100–300 THB", halal: "safe", for: "both" },
      ]},
      { title: "💎 ICONSIAM main floors", items: [
        { name: "Uniqlo (F1)", what: "AIRism tees 390 THB, linen shirts 790 THB. Sizes to 3XL", price: "390–990 THB", halal: "safe", for: "both" },
        { name: "ICONCRAFT (F4)", what: "Thai designer crafts, hand-painted bags 350–700, jewellery 300–1,200", price: "200–1,200 THB", halal: "safe", for: "her" },
        { name: "THANN (multiple floors)", what: "Premium Thai spa — Aromatic Wood shower gel is the loved one", price: "300–1,200 THB", halal: "safe", for: "both", note: "Best gift item" },
        { name: "Karmakamet (F2–3 area)", what: "Luxury Thai home fragrance, sachets, diffusers", price: "300–1,500 THB", halal: "safe", for: "her" },
        { name: "Apple Store (F2)", what: "Thailand's first official. Same global Apple pricing", price: "varies", halal: "safe", for: "both" },
      ]},
      { title: "🇯🇵 Takashimaya (F4)", items: [
        { name: "Japanese cosmetics (SHISEIDO, SK-II)", what: "Similar to MY duty-free", price: "varies", halal: "safe", for: "her" },
        { name: "Japanese supermarket basement", what: "Japan-only snacks, instant noodles", price: "varies", halal: "unknown", for: "both" },
      ]}
    ],
    bargain: null
  },

  chatuchak: {
    title: "Chatuchak Weekend Market",
    emoji: "🛍",
    hours: "Sat–Sun 09:00–18:00. Your hard exit: 11:30 (heat).",
    transport: "MRT Kamphaeng Phet Exit 2 (better than BTS Mo Chit — drops you right at Zone 2). Walk 3–5 min following the crowd.",
    tagline: "15,000 stalls across 27 sections. Bargaining required. Cash only.",
    protip: "Photograph the section map at Gate 2 entrance — your nav tool. Yellow-with-red signs = section numbers. Take pics of stall numbers — you WILL get lost (this is fine).",
    sections: [
      { title: "Sec 2–4 — Women's fashion (start here)", items: [
        { name: "Linen co-ord sets", what: "Most popular regional buy", price: "300–600 THB", halal: "safe", for: "her", note: "Sizes mostly S–XL only. Limited 2XL+." },
        { name: "Boho/flowy blouses", what: "Breezy summer fits", price: "200–400 THB", halal: "safe", for: "her" },
        { name: "Wide-leg linen pants", what: "Thai market staple", price: "250–450 THB", halal: "safe", for: "her" },
        { name: "Vintage-style dresses", what: "Unique pieces, won't find in KL", price: "200–500 THB", halal: "safe", for: "her" },
        { name: "Graphic tees (Thai script/art)", what: "Cool unique pieces", price: "150–300 THB", halal: "safe", for: "both" },
        { name: "Vintage/second-hand", what: "Mixed racks — Japanese tourists come for these", price: "100–400 THB", halal: "safe", for: "both" },
      ]},
      { title: "Sec 5–6 — Shoes, bags, accessories", items: [
        { name: "Sandals (woven, leather-look)", what: "Try before buying — Thai sizing small", price: "200–500 THB", halal: "safe", for: "both" },
        { name: "Canvas totes", what: "Practical daily use", price: "150–300 THB", halal: "safe", for: "both" },
        { name: "Woven rattan bags", what: "Distinctive Thai look", price: "300–700 THB", halal: "safe", for: "her" },
        { name: "Woven straw hats", what: "Functional in heat", price: "100–250 THB", halal: "safe", for: "both" },
        { name: "Hair accessories", what: "Claw clips, headbands, scrunchies", price: "50–200 THB", halal: "safe", for: "her" },
      ]},
      { title: "Sec 7 — Art, paintings, prints (unique)", items: [
        { name: "Original Thai art prints", what: "By local artists — wall-art quality", price: "200–600 THB", halal: "safe", for: "both", note: "Won't find anywhere else" },
        { name: "Custom pet portrait", what: "On-spot or commission. Show clear photo", price: "390–700 THB", halal: "safe", for: "both" },
        { name: "Watercolour temple prints", what: "Bangkok scenes", price: "300–800 THB", halal: "safe", for: "both" },
        { name: "Hand-painted wooden signs", what: "Kitchen/wall décor", price: "200–500 THB", halal: "safe", for: "both" },
      ]},
      { title: "Sec 8–11 — Handicrafts, woodwork", items: [
        { name: "Carved wooden elephants", what: "Iconic Thai souvenir", price: "100–500 THB", halal: "safe", for: "both" },
        { name: "Lacquerware bowls/trays", what: "Traditional finish", price: "200–800 THB", halal: "safe", for: "both" },
        { name: "Folding paper lanterns", what: "Pack flat", price: "100–300 THB", halal: "safe", for: "both" },
        { name: "Cushion covers (Thai fabric)", what: "Home accent", price: "200–500 THB", halal: "safe", for: "her" },
        { name: "Celadon ceramics (Sec 11/13/15)", what: "Distinctive jade-green Thai glaze", price: "200–600 THB", halal: "safe", for: "both" },
      ]},
      { title: "🍴 Sec 16/Soi 24 — Saman Islam (HALAL FOOD STOP)", items: [
        { name: "Beef biryani", what: "Saman Islam signature", price: "80–120 THB", halal: "safe", for: "both", note: "Eat here at 10:30 before crowds" },
        { name: "Beef noodle soup", what: "Clear or thick broth", price: "70–100 THB", halal: "safe", for: "both" },
        { name: "Halal Pad Thai", what: "Different from default — confirm with stall", price: "60–80 THB", halal: "safe", for: "both" },
        { name: "Murtabak", what: "Stuffed flatbread", price: "60–90 THB", halal: "safe", for: "both" },
        { name: "Thai Muslim curry rice", what: "Regional specialty", price: "70–100 THB", halal: "safe", for: "both" },
      ], note: "Whole zone halal-dedicated. Look for ฮาลาล signs. Backup: MIXT Chatuchak (next-door mall) has halal food court + prayer room." },
      { title: "Sec 26 — Handmade jewellery", items: [
        { name: "Silver rings", what: "Local design", price: "200–500 THB", halal: "safe", for: "her" },
        { name: "Resin/epoxy earrings", what: "Flowers/patterns encased — very popular Thai export", price: "150–350 THB/pair", halal: "safe", for: "her" },
        { name: "Beaded bracelets (made on spot)", what: "Custom strung", price: "80–200 THB", halal: "safe", for: "her" },
        { name: "Wire-wrapped stone pendants", what: "Bohemian style", price: "150–400 THB", halal: "safe", for: "her" },
      ]},
      { title: "🥥 Throughout — Coconut Ice Cream", items: [
        { name: "Coconut ice cream in shell", what: "Look for stalls with young coconuts displayed. Iconic Bangkok street food", price: "70 THB", halal: "safe", for: "both", note: "+ toppings 10–20 THB. UNMISSABLE." },
      ]}
    ],
    bargain: [
      "Start at 60–70% of asking (NOT 50% — too aggressive, will offend).",
      "Buy 2+ same stall = 10–20% off leverage.",
      "Smile throughout. Annoyed face = price up.",
      "Never bargain at food stalls.",
      "Walk-away tactic works ~60% of the time.",
      "First sale of day (9:00–9:30) — vendors want good luck, more flexible."
    ]
  },

  platinum_mall: {
    title: "Platinum Fashion Mall (Pratunam)",
    emoji: "🧥",
    hours: "09:00–20:00 daily",
    transport: "BTS Chidlom or Ratchathewi → 10 min walk. Connected by skywalk to Pratunam Market.",
    tagline: "5 floors fully AC, 2,000+ stalls, biggest fashion wholesale mall in SE Asia. Storm-proof.",
    protip: "Wholesale: 3 pieces same shop = 10–20% off. Always ask 'tho rai sam chin?'",
    sections: [
      { title: "G–F2 — Mainstream women's (S–L)", items: [
        { name: "Standard Thai fashion wholesale", what: "Tops, dresses, skirts", price: "150–500 THB", halal: "safe", for: "her", note: "Skip if Ferina priority is fit — go F3" },
      ]},
      { title: "F3 — Plus-size women ⭐", items: [
        { name: "Linen sets", what: "Sizes 2XL–6XL standard", price: "350–700 THB", halal: "safe", for: "her" },
        { name: "Wide-leg trousers", what: "Various fabrics", price: "250–450 THB", halal: "safe", for: "her" },
        { name: "Cotton blouses", what: "Daily wear", price: "200–400 THB", halal: "safe", for: "her" },
        { name: "Maxi dresses", what: "Modest-friendly cuts", price: "350–600 THB", halal: "safe", for: "her" },
      ]},
      { title: "F4 — Plus-size men + accessories", items: [
        { name: "Men's plus-size shirts (XXL–4XL)", what: "Cotton/linen options", price: "250–500 THB", halal: "safe", for: "him" },
        { name: "Bags wholesale", what: "Canvas tote 80 THB if buying 3+", price: "80–350 THB", halal: "safe", for: "both" },
        { name: "Hair accessories, hijab pins", what: "Modest fashion accessories", price: "varies", halal: "safe", for: "her" },
      ]},
      { title: "F5 — Fabric by metre + tailors", items: [
        { name: "Linen fabric", what: "By the metre", price: "150–300 THB/m", halal: "safe", for: "both" },
        { name: "Cotton prints", what: "Patterned by metre", price: "100–250 THB/m", halal: "safe", for: "both" },
        { name: "Same-day alterations", what: "Tailors fix bought items", price: "50–150 THB each", halal: "safe", for: "both" },
      ]},
      { title: "🍴 F6 food court", items: [
        { name: "Local Thai meals", what: "Limited halal labelling — ask each counter", price: "60–120 THB", halal: "unknown", for: "both", note: "Better: walk to Pratunam Market food street where halal Indian-Thai stalls cluster." },
      ]}
    ],
    bargain: ["3 pieces same stall = wholesale price.", "Cash only most stalls.", "Wholesale buyers crowd Wed/Thu."]
  },

  mbk: {
    title: "MBK Center",
    emoji: "👔",
    hours: "10:00–22:00",
    transport: "BTS National Stadium Exit 4 → directly into MBK via skywalk. Or 5-min covered walk from Siam Paragon.",
    tagline: "Less polished than Paragon. Plus-size men's, phone accessories, budget electronics, Thai snacks supermarket.",
    protip: "Skip F2/3/5 — same as Terminal 21 quality but messier. Worth it: F4 souvenirs, F6 Dr Zu + Tops supermarket.",
    sections: [
      { title: "F1 — Phone accessories, watches, sunglasses", items: [
        { name: "Phone cases, charger cables", what: "Anker/Baseus knock-offs but functional", price: "80–250 THB", halal: "safe", for: "both" },
        { name: "Polarised sunglasses", what: "Decent quality for the heat", price: "200–500 THB", halal: "safe", for: "both" },
      ]},
      { title: "F4 — Souvenirs (densest souvenir floor central Bangkok)", items: [
        { name: "Elephant figurines", what: "Cheaper at Chatuchak but here in AC", price: "80–500 THB", halal: "safe", for: "both" },
        { name: "Thai magnets (bulk)", what: "Last-minute gift quantity", price: "30–60 THB each", halal: "safe", for: "both" },
        { name: "Buddha amulets, Khon mask replicas, mini tuk-tuks", what: "Standard tourist range", price: "varies", halal: "safe", for: "both" },
      ]},
      { title: "F6 — Dr Zu + Tops supermarket ⭐", items: [
        { name: "Dr Zu", what: "LEGENDARY men's plus-size XXL–4XL. Cotton/linen shirts, cargo shorts, casual pants. English-speaking", price: "300–800 THB", halal: "safe", for: "him", note: "J6's primary stop if Uniqlo doesn't fit" },
        { name: "Tops supermarket", what: "Thai snacks in larger packs. Mama instant noodles 30-pack carton 500–600, Lay's Thai flavours, dried squid, kaffir lime sweets", price: "varies", halal: "safe", for: "both" },
      ]},
      { title: "🍴 F6 food court", items: [
        { name: "Quick Thai meals", what: "Halal counter signposted", price: "50–100 THB", halal: "safe", for: "both" },
      ]}
    ],
    bargain: null
  },

  siam_paragon: {
    title: "Siam Paragon",
    emoji: "💎",
    hours: "10:00–22:00. Your window: 12:00–13:50, leave 13:50 sharp.",
    transport: "BTS Siam Exit 3–5. Connected via covered walkway.",
    tagline: "Premium mall. Best for take-home food gifts (B1) and one premium souvenir piece.",
    protip: "Get Tourist Privilege Card at info counter (M or G floor) — 5–10% off select shops. VAT refund eligible if spend ≥ 2,000 THB single day — fill form at shop, process at airport.",
    sections: [
      { title: "B1 — Gourmet Market (FOOD GIFTS) ⭐", items: [
        { name: "Thai curry paste sets (Mae Ploy, Maesri)", what: "Vacuum-packed, safe to fly. Red/green/panang/massaman. SETS = best value", price: "60–300 THB", halal: "safe", for: "both", note: "Best cooking gift to bring back" },
        { name: "Tom Yum paste", what: "Same brands", price: "50–100 THB", halal: "safe", for: "both" },
        { name: "Cha Tra Mue Thai tea powder", what: "Original brand. Tin makes 30+ cups", price: "200–350 THB", halal: "safe", for: "both" },
        { name: "Mango sticky rice mix", what: "Dry pack, make at home", price: "80–150 THB", halal: "safe", for: "both" },
        { name: "Coconut palm sugar blocks", what: "Excellent cooking ingredient", price: "100–200 THB", halal: "safe", for: "both" },
        { name: "Dried mango/lychee", what: "Airline-safe", price: "120–300 THB/bag", halal: "safe", for: "both" },
        { name: "Doi Chaang single-origin coffee", what: "Real Thai mountain coffee", price: "200–500 THB / 200g", halal: "safe", for: "both", note: "Best coffee gift from Thailand" },
        { name: "Otop coconut wafer rolls", what: "Green/gold tin packaging", price: "80–200 THB/pack", halal: "safe", for: "both" },
      ]},
      { title: "F1 — NaRaYa flagship + luxury", items: [
        { name: "NaRaYa bow tote bags", what: "Signature Thai fabric bag — colourful patterns", price: "400–900 THB", halal: "safe", for: "her", note: "Iconic souvenir for women" },
        { name: "NaRaYa crossbody bags", what: "Practical for travel", price: "300–700 THB", halal: "safe", for: "her" },
        { name: "NaRaYa pouches/clutches", what: "Best mid-range gift items", price: "150–400 THB", halal: "safe", for: "her" },
        { name: "NaRaYa coin pouches/card holders", what: "Cheap thoughtful gifts", price: "80–200 THB", halal: "safe", for: "her" },
      ]},
      { title: "F3 — Jim Thompson silk + THANN", items: [
        { name: "Jim Thompson silk scarves", what: "Genuine handwoven Thai silk — luxury", price: "1,200–3,000 THB", halal: "safe", for: "her", note: "Real silk: hold to light, iridescent. Fake polyester looks flat. Budget version at Chatuchak Sec 7/8 800–1,500 THB." },
        { name: "Jim Thompson silk-cotton men's shirts", what: "One quality piece > many cheap", price: "1,500–2,500 THB", halal: "safe", for: "him" },
        { name: "Jim Thompson silk pouches", what: "Luxury gift wrap", price: "400–900 THB", halal: "safe", for: "her" },
        { name: "THANN Aromatic Wood set (gel + lotion)", what: "Premium Thai spa", price: "800–1,200 THB", halal: "safe", for: "both" },
      ]},
      { title: "F4 — Boots pharmacy + electronics", items: [
        { name: "Thai herbal supplements", what: "Ginseng, turmeric, moringa", price: "200–500 THB", halal: "safe", for: "both" },
        { name: "Vitamin D, B12, fish oil", what: "Cheaper than KL pharmacy", price: "150–400 THB", halal: "safe", for: "both" },
        { name: "Melatonin", what: "Sleep aid", price: "200–400 THB", halal: "safe", for: "both" },
      ]},
      { title: "Eveandboy (BTS concourse) — Thai cosmetics", items: [
        { name: "Mistine Wonder Full CC Cushion", what: "Daily complexion", price: "199 THB", halal: "safe", for: "her" },
        { name: "Mistine Aqua BB Cream", what: "Light coverage", price: "139 THB", halal: "safe", for: "her" },
        { name: "Mistine Expert Eyeliner", what: "Daily liner", price: "89 THB", halal: "safe", for: "her" },
        { name: "Snail White cream (50ml)", what: "Korean-style mucin", price: "350 THB", halal: "safe", for: "her" },
        { name: "Snail Secretion Serum", what: "Step up from cream", price: "450–650 THB", halal: "safe", for: "her" },
        { name: "Karmart Cathy Doll BB serum", what: "Affordable serums", price: "199 THB", halal: "safe", for: "her" },
        { name: "Karmart lip tints", what: "Many shades", price: "99–149 THB", halal: "safe", for: "her" },
      ]}
    ],
    bargain: null
  }
};

export function shoppingFor(anchorId) {
  return shopping[anchorId] || null;
}
