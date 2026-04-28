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
