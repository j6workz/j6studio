(function(){
  const GREENS = ['#4A6B41', '#223A28', '#8FAE7D', '#5C7A52'];
  const FLOWERS = [['#C85C6B', '#6b1f28'], ['#D9A441', '#8B2E3C'], ['#E8A0A0', '#b5556a'], ['#9FB46A', '#4a5a2a']];
  const NS = 'http://www.w3.org/2000/svg';

  function leafMarkup(fill, x, y, rot, scale){
    return `<use href="#leafV" fill="${fill}" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${scale.toFixed(2)})"/>`;
  }
  function flowerMarkup(fill, cfill, x, y, rot, scale){
    return `<use href="#flower" fill="${fill}" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${scale.toFixed(2)})"/>` +
           `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2.6*scale).toFixed(1)}" fill="${cfill}"/>`;
  }
  function budMarkup(fill, x, y, rot, scale){
    return `<use href="#bud" fill="${fill}" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${scale.toFixed(2)})"/>`;
  }

  // full ring wreath — used for photo-frame style circles
  function wreath(R, leafCount, seed){
    let out = '';
    for (let i = 0; i < leafCount; i++){
      const a = (i / leafCount) * 360 + seed;
      const rad = a * Math.PI / 180;
      const x = Math.cos(rad) * R, y = Math.sin(rad) * R;
      const g = GREENS[i % GREENS.length];
      out += leafMarkup(g, x, y, a + 90 + (i % 2 ? 9 : -9), 0.82 + (i % 3) * 0.08);
    }
    [20, 110, 200, 290].forEach((a, idx) => {
      const rad = a * Math.PI / 180;
      const x = Math.cos(rad) * (R * 0.92), y = Math.sin(rad) * (R * 0.92);
      const [f, c] = FLOWERS[idx % FLOWERS.length];
      out += flowerMarkup(f, c, x, y, a, 1.0);
    });
    return out;
  }

  // corner spray — a cluster of leaves + flowers radiating from one corner
  function cornerSpray(variant){
    const seed = variant * 37;
    let out = '';
    const leaves = [
      [-20, 10, -25, 1.1], [5, 0, 5, 1.3], [25, 15, 30, 0.9],
      [-30, -15, -55, 0.8], [15, -25, 50, 0.7], [-5, 25, -10, 0.75]
    ];
    leaves.forEach(([x, y, rot, s], i) => {
      out += leafMarkup(GREENS[(i + variant) % GREENS.length], x, y, rot + (seed % 10), s);
    });
    out += flowerMarkup(FLOWERS[variant % FLOWERS.length][0], FLOWERS[variant % FLOWERS.length][1], -10, -20, 10, 1.05);
    out += flowerMarkup(FLOWERS[(variant + 1) % FLOWERS.length][0], FLOWERS[(variant + 1) % FLOWERS.length][1], 20, -5, -20, 0.82);
    out += budMarkup('#E8A0A0', -25, 20, 100, 1);
    return out;
  }

  // a wide bouquet / divider spray
  function bouquetDivider(){
    let out = '';
    const n = 11;
    for (let i = 0; i < n; i++){
      const t = i / (n - 1);
      const x = (t - 0.5) * 260;
      const fan = (t - 0.5) * 140;
      const h = 60 - Math.abs(t - 0.5) * 70;
      out += leafMarkup(GREENS[i % GREENS.length], x, -h * 0.4, fan, 0.9 + (i % 3) * 0.08);
    }
    [[-90, -10], [-30, -28], [30, -28], [90, -10], [0, -36]].forEach(([x, y], idx) => {
      const [f, c] = FLOWERS[idx % FLOWERS.length];
      out += flowerMarkup(f, c, x, y, (idx - 2) * 12, 1.05);
    });
    return out;
  }

  // small leaf-wrapped icons for the love-story timeline
  function storyIcon(type){
    const wrap = (inner, fill) => `<g>${inner}` +
      leafMarkup(GREENS[1], -22, 16, -30, 0.5) +
      leafMarkup(GREENS[2], 20, -18, 40, 0.45) + `</g>`;

    if (type === 'spark'){
      return wrap(`<g fill="${FLOWERS[1][0]}"><path d="M0,0 Q3,-3 0,-17 Q-3,-3 0,0 M0,0 Q3,3 17,0 Q3,-3 0,0 M0,0 Q-3,3 0,17 Q3,3 0,0 M0,0 Q-3,-3 -17,0 Q-3,3 0,0" transform="scale(0.9)"/></g>`);
    }
    if (type === 'heart'){
      return wrap(`<path fill="${FLOWERS[0][0]}" d="M0,-4 C-5,-11 -14,-7 -14,1 C-14,9 -6,14 0,19 C6,14 14,9 14,1 C14,-7 5,-11 0,-4 Z"/>`);
    }
    if (type === 'mug'){
      return wrap(`<g fill="none" stroke="${GREENS[0]}" stroke-width="2.4"><rect x="-11" y="-9" width="18" height="17" rx="2.5" fill="${GREENS[3]}" stroke="none"/><path d="M7,-4 a6,6 0 0 1 0,11"/></g>`);
    }
    if (type === 'cat'){
      return wrap(`<g fill="${GREENS[1]}"><ellipse cx="0" cy="6" rx="10" ry="13"/><circle cx="0" cy="-9" r="8"/><path d="M-6,-14 L-10,-24 L-1,-17 Z"/><path d="M6,-14 L10,-24 L1,-17 Z"/></g>`);
    }
    if (type === 'screen'){
      return wrap(`<g><rect x="-13" y="-16" width="26" height="30" rx="3" fill="none" stroke="${GREENS[0]}" stroke-width="2.2"/><path fill="${FLOWERS[0][0]}" d="M0,-4 C-3,-8 -9,-5 -9,0 C-9,5 -4,8 0,11 C4,8 9,5 9,0 C9,-5 3,-8 0,-4 Z" transform="scale(0.6)"/></g>`);
    }
    if (type === 'home'){
      return wrap(`<g fill="${GREENS[0]}"><rect x="-11" y="-2" width="22" height="18"/><path d="M-14,-2 L0,-18 L14,-2 Z"/></g>`);
    }
    return '';
  }

  function fillSvg(el, markup, viewBoxOverride){
    if (viewBoxOverride) el.setAttribute('viewBox', viewBoxOverride);
    el.innerHTML = markup;
  }

  function init(){
    document.querySelectorAll('[data-wreath]').forEach((el) => fillSvg(el, wreath(110, 22, Math.random() * 20)));
    document.querySelectorAll('#coverWreath, #verseWreath, #footerWreath').forEach((el) => fillSvg(el, wreath(110, 22, 5)));
    document.querySelectorAll('[data-spray]').forEach((el) => fillSvg(el, cornerSpray(parseInt(el.getAttribute('data-spray'), 10))));
    document.querySelectorAll('#bouquetDivider').forEach((el) => fillSvg(el, bouquetDivider()));
    document.querySelectorAll('[data-icon]').forEach((el) => fillSvg(el, storyIcon(el.getAttribute('data-icon'))));
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
