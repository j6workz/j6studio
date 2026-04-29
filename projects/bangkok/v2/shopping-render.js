// Native UI render for shopping data — no markdown shown to user.
// Build polished cards from structured data in data/shopping.js.

import { el } from './dom.js';
import { shoppingFor } from './data/shopping.js';

const HALAL_LABELS = {
  safe: { label: '✓ Halal-safe', cls: 'halal-safe' },
  non: { label: '⚠ Non-halal', cls: 'halal-non' },
  unknown: { label: '? Ask stall', cls: 'halal-unknown' }
};

const FOR_LABELS = {
  her: { label: 'For Ferina', cls: 'for-her' },
  him: { label: 'For J6', cls: 'for-him' },
  both: { label: 'Both', cls: 'for-both' }
};

function itemCard(item) {
  const halal = HALAL_LABELS[item.halal] || HALAL_LABELS.unknown;
  const target = FOR_LABELS[item.for] || FOR_LABELS.both;
  return el('div', { class: 'shop-item' },
    el('div', { class: 'shop-item-head' },
      el('div', { class: 'shop-item-name' }, item.name),
      el('div', { class: 'shop-item-price' }, item.price)
    ),
    el('div', { class: 'shop-item-what' }, item.what),
    el('div', { class: 'shop-item-tags' },
      el('span', { class: `shop-tag ${halal.cls}` }, halal.label),
      el('span', { class: `shop-tag ${target.cls}` }, target.label)
    ),
    item.note ? el('div', { class: 'shop-item-note' }, '💡 ' + item.note) : null
  );
}

function sectionCard(section) {
  return el('details', { class: 'shop-section', open: true },
    el('summary', { class: 'shop-section-head' }, section.title),
    el('div', { class: 'shop-section-body' },
      section.items.map(itemCard),
      section.note ? el('div', { class: 'shop-section-note' }, '📌 ' + section.note) : null
    )
  );
}

function bargainBlock(tips) {
  if (!tips || !tips.length) return null;
  return el('div', { class: 'shop-bargain' },
    el('h4', {}, '💬 Bargaining rules'),
    el('ul', {}, tips.map(t => el('li', {}, t)))
  );
}

export function renderShoppingContent(anchorId) {
  const data = shoppingFor(anchorId);
  if (!data) {
    return [el('p', { class: 'shop-empty' }, 'No shopping guide for this location yet.')];
  }
  return [
    el('div', { class: 'shop-hero' },
      el('div', { class: 'shop-hero-emoji' }, data.emoji),
      el('div', { class: 'shop-hero-info' },
        el('div', { class: 'shop-hero-title' }, data.title),
        el('div', { class: 'shop-hero-tagline' }, data.tagline),
        el('div', { class: 'shop-hero-meta' },
          el('span', {}, '🕐 ' + data.hours),
          el('span', {}, '🚉 ' + data.transport)
        )
      )
    ),
    data.protip ? el('div', { class: 'shop-protip' }, '⭐ ' + data.protip) : null,
    el('div', { class: 'shop-sections' }, data.sections.map(sectionCard)),
    bargainBlock(data.bargain)
  ];
}
