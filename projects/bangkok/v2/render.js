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
      primary ? el('a', { href: primary.gmaps_url, target: '_blank' }, '📍 Maps') : null,
      primary?.shopping_url ? el('a', { href: primary.shopping_url, target: '_blank' }, '📖 Shopping') : null
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
