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