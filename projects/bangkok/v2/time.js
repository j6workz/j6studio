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
