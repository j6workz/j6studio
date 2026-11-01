import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const N = 3600;

// ---------- small math helpers ----------
function gauss(){
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function lerp(a, b, t){ return a + (b - a) * t; }
function smoothstep(t){ t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
}

// ---------- figure primitives: simple elegant silhouettes drawn as vector
// paths (not emoji/images), composed into per-chapter scenes below ----------
function drawMale(ctx, cx, cy, s){
  const headR = s * 0.09, headCY = cy - s * 0.42;
  ctx.beginPath(); ctx.arc(cx, headCY, headR, 0, Math.PI*2); ctx.fill();
  const shoulderW = s*0.17, waistW = s*0.12, torsoTop = headCY + headR*1.15, torsoBot = cy + s*0.02;
  ctx.beginPath();
  ctx.moveTo(cx-shoulderW, torsoTop); ctx.lineTo(cx+shoulderW, torsoTop);
  ctx.lineTo(cx+waistW, torsoBot); ctx.lineTo(cx-waistW, torsoBot);
  ctx.closePath(); ctx.fill();
  const legGap = s*0.015, legBot = cy + s*0.44;
  ctx.beginPath();
  ctx.moveTo(cx-waistW, torsoBot); ctx.lineTo(cx-legGap, torsoBot);
  ctx.lineTo(cx-legGap-s*0.02, legBot); ctx.lineTo(cx-waistW-s*0.03, legBot);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx+legGap, torsoBot); ctx.lineTo(cx+waistW, torsoBot);
  ctx.lineTo(cx+waistW+s*0.03, legBot); ctx.lineTo(cx+legGap+s*0.02, legBot);
  ctx.closePath(); ctx.fill();
  const armW = s*0.045;
  ctx.beginPath();
  ctx.moveTo(cx-shoulderW, torsoTop); ctx.lineTo(cx-shoulderW+armW, torsoTop);
  ctx.lineTo(cx-shoulderW+armW*0.3, torsoBot-s*0.02); ctx.lineTo(cx-shoulderW-armW*0.4, torsoBot-s*0.02);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx+shoulderW-armW, torsoTop); ctx.lineTo(cx+shoulderW, torsoTop);
  ctx.lineTo(cx+shoulderW+armW*0.4, torsoBot-s*0.02); ctx.lineTo(cx+shoulderW-armW*0.3, torsoBot-s*0.02);
  ctx.closePath(); ctx.fill();
}

function drawFemale(ctx, cx, cy, s){
  const headR = s*0.085, headCY = cy - s*0.42;
  ctx.beginPath(); ctx.ellipse(cx, headCY+headR*0.25, headR*1.25, headR*1.55, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx, headCY, headR, 0, Math.PI*2); ctx.fill();
  const shoulderW = s*0.13, waistW = s*0.09, torsoTop = headCY+headR*1.35, waistY = cy-s*0.06;
  ctx.beginPath();
  ctx.moveTo(cx-shoulderW, torsoTop); ctx.lineTo(cx+shoulderW, torsoTop);
  ctx.lineTo(cx+waistW, waistY); ctx.lineTo(cx-waistW, waistY);
  ctx.closePath(); ctx.fill();
  const hemW = s*0.24, hemY = cy + s*0.44;
  ctx.beginPath();
  ctx.moveTo(cx-waistW, waistY); ctx.lineTo(cx+waistW, waistY);
  ctx.lineTo(cx+hemW, hemY); ctx.lineTo(cx-hemW, hemY);
  ctx.closePath(); ctx.fill();
  const armW = s*0.04;
  ctx.beginPath();
  ctx.moveTo(cx-shoulderW, torsoTop); ctx.lineTo(cx-shoulderW+armW, torsoTop);
  ctx.lineTo(cx-shoulderW+armW*0.2, waistY); ctx.lineTo(cx-shoulderW-armW*0.5, waistY);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx+shoulderW-armW, torsoTop); ctx.lineTo(cx+shoulderW, torsoTop);
  ctx.lineTo(cx+shoulderW+armW*0.5, waistY); ctx.lineTo(cx+shoulderW-armW*0.2, waistY);
  ctx.closePath(); ctx.fill();
}

function drawCat(ctx, cx, cy, s){
  ctx.beginPath(); ctx.ellipse(cx, cy+s*0.12, s*0.22, s*0.3, 0, 0, Math.PI*2); ctx.fill();
  const headCY = cy - s*0.18, headR = s*0.16;
  ctx.beginPath(); ctx.arc(cx, headCY, headR, 0, Math.PI*2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx-headR*0.7, headCY-headR*0.6); ctx.lineTo(cx-headR*1.3, headCY-headR*1.6); ctx.lineTo(cx-headR*0.1, headCY-headR*0.9);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx+headR*0.7, headCY-headR*0.6); ctx.lineTo(cx+headR*1.3, headCY-headR*1.6); ctx.lineTo(cx+headR*0.1, headCY-headR*0.9);
  ctx.closePath(); ctx.fill();
  ctx.lineWidth = s*0.07; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx+s*0.2, cy+s*0.32);
  ctx.quadraticCurveTo(cx+s*0.42, cy+s*0.1, cx+s*0.3, cy-s*0.12);
  ctx.stroke();
}

function drawHouse(ctx, cx, cy, s){
  const w = s*0.5, h = s*0.4, roofH = s*0.32;
  const baseY = cy + h*0.5, topY = baseY - h;
  ctx.beginPath();
  ctx.moveTo(cx-w*0.5, topY); ctx.lineTo(cx+w*0.5, topY); ctx.lineTo(cx+w*0.5, baseY); ctx.lineTo(cx-w*0.5, baseY);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx-w*0.62, topY); ctx.lineTo(cx, topY-roofH); ctx.lineTo(cx+w*0.62, topY);
  ctx.closePath(); ctx.fill();
}

function drawDomeArch(ctx, cx, cy, s){
  const w = s*0.5, topY = cy - s*0.52, baseY = cy + s*0.3;
  ctx.beginPath();
  ctx.moveTo(cx-w/2, baseY);
  ctx.lineTo(cx-w/2, cy-s*0.05);
  ctx.quadraticCurveTo(cx-w/2, topY, cx, topY-s*0.04);
  ctx.quadraticCurveTo(cx+w/2, topY, cx+w/2, cy-s*0.05);
  ctx.lineTo(cx+w/2, baseY);
  ctx.closePath(); ctx.fill();
}

function drawHeart(ctx, cx, cy, s){
  ctx.beginPath();
  ctx.moveTo(cx, cy - s*0.12);
  ctx.bezierCurveTo(cx - s*0.24, cy - s*0.4, cx - s*0.44, cy - s*0.02, cx, cy + s*0.26);
  ctx.bezierCurveTo(cx + s*0.44, cy - s*0.02, cx + s*0.24, cy - s*0.4, cx, cy - s*0.12);
  ctx.closePath(); ctx.fill();
}

function drawMugSmall(ctx, cx, cy, s){
  roundRect(ctx, cx-s*0.15, cy-s*0.09, s*0.26, s*0.22, s*0.035); ctx.fill();
  ctx.lineWidth = s*0.04;
  ctx.beginPath(); ctx.arc(cx+s*0.15, cy+s*0.02, s*0.09, -Math.PI*0.5, Math.PI*0.5); ctx.stroke();
}

function drawScreenFrame(ctx, cx, cy, s){
  ctx.lineWidth = s*0.035;
  roundRect(ctx, cx-s*0.22, cy-s*0.3, s*0.44, s*0.56, s*0.04);
  ctx.stroke();
  drawHeart(ctx, cx, cy, s*0.4);
}

// ---------- per-chapter scenes, composed from the primitives above ----------
const SCENE_W = 300, SCENE_H = 460;

const SCENES = {
  // ch1 — "A Match, Almost Missed": two figures, far apart, not yet together
  apart(ctx){
    drawMale(ctx, SCENE_W*0.27, SCENE_H*0.56, 220);
    drawFemale(ctx, SCENE_W*0.73, SCENE_H*0.56, 210);
  },
  // ch2 — "We Finally Met": standing close, facing each other
  together(ctx){
    drawMale(ctx, SCENE_W*0.41, SCENE_H*0.54, 250);
    drawFemale(ctx, SCENE_W*0.6, SCENE_H*0.54, 235);
  },
  // ch3 — "Falling, Quietly and Surely": together, with a heart forming above them
  togetherHeart(ctx){
    drawMale(ctx, SCENE_W*0.41, SCENE_H*0.58, 230);
    drawFemale(ctx, SCENE_W*0.6, SCENE_H*0.58, 215);
    drawHeart(ctx, SCENE_W*0.5, SCENE_H*0.2, 140);
  },
  // ch4 — "Our Weekend Kitchen": together, a mug between them
  togetherMug(ctx){
    drawMale(ctx, SCENE_W*0.33, SCENE_H*0.54, 240);
    drawFemale(ctx, SCENE_W*0.68, SCENE_H*0.54, 225);
    drawMugSmall(ctx, SCENE_W*0.505, SCENE_H*0.47, 130);
  },
  // ch5 — "Fireflies, and a Calico Named KuaCham": together, cat at their feet
  togetherCat(ctx){
    drawMale(ctx, SCENE_W*0.39, SCENE_H*0.4, 220);
    drawFemale(ctx, SCENE_W*0.63, SCENE_H*0.4, 208);
    drawCat(ctx, SCENE_W*0.51, SCENE_H*0.82, 170);
  },
  // ch6 — "Meeting My Family, From Miles Away": me on one side, family on a screen
  videoCall(ctx){
    drawMale(ctx, SCENE_W*0.29, SCENE_H*0.52, 240);
    drawScreenFrame(ctx, SCENE_W*0.65, SCENE_H*0.46, 250);
  },
  // ch7 — "Our Family Kept Growing": the couple, surrounded by four cats
  family(ctx){
    drawCat(ctx, SCENE_W*0.3, SCENE_H*0.25, 155);
    drawCat(ctx, SCENE_W*0.7, SCENE_H*0.25, 155);
    drawCat(ctx, SCENE_W*0.3, SCENE_H*0.78, 155);
    drawCat(ctx, SCENE_W*0.7, SCENE_H*0.78, 155);
    drawMale(ctx, SCENE_W*0.42, SCENE_H*0.52, 200);
    drawFemale(ctx, SCENE_W*0.59, SCENE_H*0.52, 190);
  },
  // ch8 — "Home, At Last": the couple standing before a house
  homeCouple(ctx){
    drawHouse(ctx, SCENE_W*0.5, SCENE_H*0.35, 300);
    drawMale(ctx, SCENE_W*0.41, SCENE_H*0.76, 220);
    drawFemale(ctx, SCENE_W*0.6, SCENE_H*0.76, 210);
  },
  // ch9 — "The Nikah": the couple standing under a dome arch — the grand finale
  nikahCouple(ctx){
    drawDomeArch(ctx, SCENE_W*0.5, SCENE_H*0.35, 300);
    drawMale(ctx, SCENE_W*0.41, SCENE_H*0.75, 210);
    drawFemale(ctx, SCENE_W*0.6, SCENE_H*0.75, 200);
  },
  // RSVP / footer — calm, a single heart
  heartCalm(ctx){
    drawHeart(ctx, SCENE_W*0.5, SCENE_H*0.5, 220);
  }
};

// maps the same formation keys the HTML/CSS already use (data-formation) to a scene
const FORMATION_SCENE = {
  twoClusters: 'apart', converge: 'together', bloom: 'togetherHeart', nest: 'togetherMug',
  fireflies: 'togetherCat', bridge: 'videoCall', flock: 'family', arch: 'homeCouple',
  star: 'nikahCouple', calm: 'heartCalm', scatter: null
};

const TINTS = {
  tension:  0x8a9478,
  meet:     0xd9bb7c,
  love:     0xe3ad86,
  kitchen:  0xe8c088,
  firefly:  0xdccb7e,
  family:   0xb9c69a,
  flock:    0xe6c17a,
  home:     0xc9a86a,
  nikah:    0xe3cea0,
  rsvp:     0xe3cea0
};

// ---------- rasterize a scene into a particle position array ----------
function sampleScene(sceneFn, count){
  const arr = new Float32Array(count * 3);
  if (!sceneFn){
    // no figure for this state — loose ambient dust (used only for the hero's idle moment)
    for (let i = 0; i < count; i++){
      const theta = Math.acos(2 * Math.random() - 1), phi = 2 * Math.PI * Math.random();
      const r = 3.2 * Math.cbrt(Math.random());
      arr[i*3]   = Math.sin(theta) * Math.cos(phi) * r;
      arr[i*3+1] = Math.sin(theta) * Math.sin(phi) * r;
      arr[i*3+2] = Math.cos(theta) * r;
    }
    return arr;
  }

  const c = document.createElement('canvas');
  c.width = SCENE_W; c.height = SCENE_H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  sceneFn(ctx);

  const img = ctx.getImageData(0, 0, SCENE_W, SCENE_H).data;
  const validX = [], validY = [];
  for (let py = 0; py < SCENE_H; py++){
    for (let px = 0; px < SCENE_W; px++){
      if (img[(py * SCENE_W + px) * 4 + 3] > 40){ validX.push(px); validY.push(py); }
    }
  }

  const worldW = 6.0, worldH = 9.25;
  const n = validX.length;
  for (let i = 0; i < count; i++){
    let px, py;
    if (n > 0){
      const r = (Math.random() * n) | 0;
      px = validX[r] + (Math.random() - 0.5);
      py = validY[r] + (Math.random() - 0.5);
    } else { px = SCENE_W/2; py = SCENE_H/2; }
    arr[i*3]   = (px / SCENE_W - 0.5) * worldW;
    arr[i*3+1] = -(py / SCENE_H - 0.5) * worldH;
    arr[i*3+2] = gauss() * 0.3;
  }
  return arr;
}

function makeSpriteTexture(){
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.8, 'rgba(255,255,255,0.4)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

// ---------- scene setup ----------
let renderer, threeScene, camera, points, geometry, currentPositions;
let FORMATIONS = {};
const canvas = document.getElementById('scene');

function init(){
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch (e) {
    return false;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x2b3524, 1);

  threeScene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 11);
  camera.lookAt(0, 0, 0);

  // precompute every formation's particle positions once, up front
  Object.keys(FORMATION_SCENE).forEach((key) => {
    const sceneFn = FORMATION_SCENE[key] ? SCENES[FORMATION_SCENE[key]] : null;
    FORMATIONS[key] = sampleScene(sceneFn, N);
  });

  currentPositions = new Float32Array(N * 3);
  currentPositions.set(FORMATIONS.scatter);

  geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.095,
    map: makeSpriteTexture(),
    color: new THREE.Color(TINTS.nikah),
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  points = new THREE.Points(geometry, material);
  threeScene.add(points);
  return true;
}

// ---------- scroll-driven keyframes ----------
let keyframes = []; // [{center, formation, tint}]

function buildKeyframes(){
  keyframes = [];
  keyframes.push({ center: 0, formation: 'scatter', tint: 'nikah' }); // hero idle state — undefined, before the story begins
  document.querySelectorAll('[data-formation]').forEach((el) => {
    const center = el.offsetTop + el.offsetHeight / 2;
    keyframes.push({ center, formation: el.getAttribute('data-formation'), tint: el.getAttribute('data-tint') || 'nikah' });
  });
  const hero = document.getElementById('hero');
  if (hero) keyframes[0].center = hero.offsetTop + hero.offsetHeight * 0.15;
}

function findBracket(focus){
  if (focus <= keyframes[0].center) return [keyframes[0], keyframes[0], 0];
  for (let i = 0; i < keyframes.length - 1; i++){
    const a = keyframes[i], b = keyframes[i+1];
    if (focus >= a.center && focus <= b.center){
      const span = b.center - a.center;
      const t = span > 0 ? (focus - a.center) / span : 1;
      return [a, b, t];
    }
  }
  const last = keyframes[keyframes.length - 1];
  return [last, last, 0];
}

const _colorA = new THREE.Color();
const _colorB = new THREE.Color();

function render(){
  requestAnimationFrame(render);
  if (!renderer) return;

  const focus = window.scrollY + window.innerHeight * 0.5;
  const [a, b, tRaw] = findBracket(focus);
  const t = smoothstep(tRaw);

  const posA = FORMATIONS[a.formation] || FORMATIONS.scatter;
  const posB = FORMATIONS[b.formation] || FORMATIONS.scatter;
  for (let i = 0; i < N * 3; i++){
    currentPositions[i] = lerp(posA[i], posB[i], t);
  }
  geometry.attributes.position.needsUpdate = true;

  _colorA.set(TINTS[a.tint] || TINTS.nikah);
  _colorB.set(TINTS[b.tint] || TINTS.nikah);
  points.material.color.copy(_colorA).lerp(_colorB, t);

  points.rotation.y += 0.0007;
  points.rotation.x = Math.sin(Date.now() * 0.00004) * 0.05;

  renderer.render(threeScene, camera);
}

function onResize(){
  if (!renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  buildKeyframes();
}

if (init()){
  buildKeyframes();
  window.addEventListener('resize', onResize);
  window.addEventListener('load', buildKeyframes);
  setTimeout(buildKeyframes, 800); // catch late font-swap reflow
  render();
} else {
  const wrap = document.getElementById('canvas-wrap');
  if (wrap) wrap.style.display = 'none';
}
