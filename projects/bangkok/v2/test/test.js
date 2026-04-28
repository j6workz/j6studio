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