// Tiny DOM builder. All text goes through createTextNode → no XSS.
// Usage:
//   el('div', { class: 'foo', data: { id: 'x' }, onClick: handler }, 'text', el('span', {}, 'bar'))
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'data' && typeof v === 'object') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k in node && typeof node[k] !== 'function') node[k] = v;
    else node.setAttribute(k, v);
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    node.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

// Replace all children of `parent` with new nodes.
export function replace(parent, ...nodes) {
  parent.replaceChildren(...nodes.flat(Infinity).filter(Boolean));
}
