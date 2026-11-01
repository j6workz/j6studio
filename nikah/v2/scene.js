import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const N = 2200;

// ---------- small math helpers ----------
function gauss(){
  // Box-Muller
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function randomDir(){
  const theta = Math.acos(2 * Math.random() - 1);
  const phi = 2 * Math.PI * Math.random();
  return [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta)];
}
function lerp(a, b, t){ return a + (b - a) * t; }
function smoothstep(t){ t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

// ---------- formation generators: each returns a Float32Array(N*3) ----------
function fGaussianBlobs(centers, std){
  const arr = new Float32Array(N * 3);
  const per = Math.floor(N / centers.length);
  for (let i = 0; i < N; i++){
    const c = centers[Math.min(centers.length - 1, Math.floor(i / per))];
    arr[i*3]   = c[0] + gauss() * std;
    arr[i*3+1] = c[1] + gauss() * std;
    arr[i*3+2] = c[2] + gauss() * std;
  }
  return arr;
}

function twoClusters(){ return fGaussianBlobs([[-2.6,0,0],[2.6,0,0]], 0.85); }
function converge(){ return fGaussianBlobs([[0,0,0]], 1.05); }

function bloom(){
  const arr = new Float32Array(N * 3);
  for (let i = 0; i < N; i++){
    const [x,y,z] = randomDir();
    const r = 2.5 * (0.82 + Math.random() * 0.32);
    arr[i*3] = x*r; arr[i*3+1] = y*r; arr[i*3+2] = z*r;
  }
  return arr;
}

function nest(){
  const arr = new Float32Array(N * 3);
  const turns = 3.2;
  for (let i = 0; i < N; i++){
    const t = i / N;
    const strand = i % 2;
    const angle = t * Math.PI * 2 * turns + (strand ? Math.PI : 0);
    const radius = 1.55 + Math.sin(t * Math.PI) * 0.25;
    arr[i*3]   = Math.cos(angle) * radius + gauss() * 0.08;
    arr[i*3+1] = lerp(-2.3, 2.3, t) + gauss() * 0.08;
    arr[i*3+2] = Math.sin(angle) * radius + gauss() * 0.08;
  }
  return arr;
}

function fireflies(){
  const arr = new Float32Array(N * 3);
  for (let i = 0; i < N; i++){
    arr[i*3]   = gauss() * 2.3;
    arr[i*3+1] = gauss() * 1.3;
    arr[i*3+2] = gauss() * 2.3;
  }
  return arr;
}

function bridge(){
  const arr = new Float32Array(N * 3);
  const nLeft = Math.floor(N * 0.38), nRight = Math.floor(N * 0.38);
  for (let i = 0; i < N; i++){
    if (i < nLeft){
      arr[i*3] = -3.1 + gauss()*0.55; arr[i*3+1] = gauss()*0.55; arr[i*3+2] = gauss()*0.55;
    } else if (i < nLeft + nRight){
      arr[i*3] = 3.1 + gauss()*0.55; arr[i*3+1] = gauss()*0.55; arr[i*3+2] = gauss()*0.55;
    } else {
      const t = Math.random();
      arr[i*3] = lerp(-2.6, 2.6, t) + gauss()*0.12;
      arr[i*3+1] = gauss() * 0.25;
      arr[i*3+2] = gauss() * 0.25;
    }
  }
  return arr;
}

function flock(){
  const arr = new Float32Array(N * 3);
  const centers = [[0,0,0],[1.3,0.6,0.4],[-1.1,0.7,-0.3],[0.4,-1.0,0.6],[-0.6,-0.8,-0.5]];
  const per = Math.floor(N / centers.length);
  for (let i = 0; i < N; i++){
    const c = centers[Math.min(centers.length - 1, Math.floor(i / per))];
    arr[i*3]   = c[0] + gauss() * 0.45;
    arr[i*3+1] = c[1] + gauss() * 0.45;
    arr[i*3+2] = c[2] + gauss() * 0.45;
  }
  return arr;
}

function arch(){
  const arr = new Float32Array(N * 3);
  for (let i = 0; i < N; i++){
    const t = Math.random();
    const angle = t * Math.PI; // 0..PI, upper half
    const R = 2.6 + gauss() * 0.22;
    arr[i*3]   = Math.cos(angle) * R;
    arr[i*3+1] = Math.sin(angle) * R - 0.4;
    arr[i*3+2] = gauss() * 0.4;
  }
  return arr;
}

function star(){
  const arr = new Float32Array(N * 3);
  for (let i = 0; i < N; i++){
    const theta = Math.random() * Math.PI * 2;
    const rEdge = 2.5 * (0.46 + 0.54 * Math.abs(Math.cos(4 * theta)));
    const r = rEdge * (0.7 + Math.random() * 0.32);
    arr[i*3]   = Math.cos(theta) * r;
    arr[i*3+1] = Math.sin(theta) * r;
    arr[i*3+2] = gauss() * 0.3;
  }
  return arr;
}

function calm(){
  const arr = new Float32Array(N * 3);
  for (let i = 0; i < N; i++){
    const [x,y,z] = randomDir();
    const r = 2.9 * Math.cbrt(Math.random());
    arr[i*3] = x*r; arr[i*3+1] = y*r; arr[i*3+2] = z*r;
  }
  return arr;
}

const FORMATIONS = { twoClusters, converge, bloom, nest, fireflies, bridge, flock, arch, star, calm };

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

// ---------- scene setup ----------
let renderer, scene, camera, points, geometry, currentPositions;
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

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);

  // precompute every formation once
  Object.keys(FORMATIONS).forEach((name) => { FORMATIONS[name] = { gen: FORMATIONS[name], pos: FORMATIONS[name]() }; });

  currentPositions = new Float32Array(N * 3);
  currentPositions.set(FORMATIONS.calm.pos);

  geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.11,
    map: makeSpriteTexture(),
    color: new THREE.Color(TINTS.nikah),
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
  return true;
}

function makeSpriteTexture(){
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

// ---------- scroll-driven keyframes ----------
let keyframes = []; // [{center, formation, tint}]

function buildKeyframes(){
  keyframes = [];
  keyframes.push({ center: 0, formation: 'calm', tint: 'nikah' }); // hero idle state
  document.querySelectorAll('[data-formation]').forEach((el) => {
    const center = el.offsetTop + el.offsetHeight / 2;
    keyframes.push({ center, formation: el.getAttribute('data-formation'), tint: el.getAttribute('data-tint') || 'nikah' });
  });
  // anchor the hero's start a bit above the first real chapter so it holds briefly
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

function render(){
  requestAnimationFrame(render);
  if (!renderer) return;

  const focus = window.scrollY + window.innerHeight * 0.5;
  const [a, b, tRaw] = findBracket(focus);
  const t = smoothstep(tRaw);

  const posA = FORMATIONS[a.formation].pos;
  const posB = FORMATIONS[b.formation].pos;
  for (let i = 0; i < N * 3; i++){
    currentPositions[i] = lerp(posA[i], posB[i], t);
  }
  geometry.attributes.position.needsUpdate = true;

  const colorA = new THREE.Color(TINTS[a.tint] || TINTS.nikah);
  const colorB = new THREE.Color(TINTS[b.tint] || TINTS.nikah);
  points.material.color.copy(colorA).lerp(colorB, t);

  points.rotation.y += 0.0009;
  points.rotation.x = Math.sin(Date.now() * 0.00005) * 0.08;

  renderer.render(scene, camera);
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
