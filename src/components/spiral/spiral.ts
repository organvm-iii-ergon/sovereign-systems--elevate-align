/**
 * Sovereign Systems Spiral — Three.js 3D Helix Renderer
 *
 * Tapered helix with 3D orb meshes that visibly spin, orbit their
 * helix anchor points, and breathe with emissive pulsing. Per-phase
 * procedural textures and normal maps. Per-orb particle auras and
 * ambient atmospheric particles create a fluid, gaseous, underwater
 * feel. Helix extends far beyond visible nodes and dissolves into
 * fog for a truly infinite illusion. Never-repeating motion via
 * layered sine waves at irrational frequency ratios.
 * Works on both desktop (mouse) and mobile (touch).
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NodeData {
  id: number;
  name: string;
  phase: string;
  emoji: string;
  tagline: string;
  color: string;
  status: 'live' | 'locked';
  url: string;
}

interface OrbAnimParams {
  breathFreq: number;
  breathAmp: number;
  breathPhase: number;
  emissiveBase: number;
  emissiveAmp: number;
  emissiveFreq: number;
  emissivePhase: number;
  rotRateX: number;
  rotRateY: number;
  rotRateZ: number;
  rotPhaseX: number;
  rotPhaseY: number;
  rotPhaseZ: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  orbitNormal: THREE.Vector3;
  orbitBinormal: THREE.Vector3;
  driftFreqs: [number, number, number, number, number, number];
}

interface AuraParam {
  radiusBase: number;
  theta0: number;
  phi0: number;
  orbitSpeed: number;
  driftFreq: number;
  driftAmp: number;
  phase: number;
  brightnessBase: number;
  brightnessFreq: number;
}

interface AmbientParam {
  driftFreqX: number;
  driftFreqY: number;
  driftFreqZ: number;
  driftAmpX: number;
  driftAmpY: number;
  driftAmpZ: number;
  phase: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TURNS = 3.5;
const HELIX_HEIGHT = 20;
const PATH_STEPS = 512;
const PATH_EXTEND = 0.85;            // 85% extra above/below — truly infinite
const BG_COLOR = 0x0a2d33;
const FOG_DENSITY = 0.050;           // dissolves endpoints into background
const ORB_RADIUS = 0.4;
const ORB_SEGMENTS = 32;
const CLICK_THRESHOLD = 8;           // px — drag vs. click (mouse)
const TAP_THRESHOLD = 30;            // px — drag vs. tap (touch)

const PHASE_HEX: Record<string, number> = {
  ELEVATE: 0x119a9e,
  ALIGN:   0x8cc5d3,
  UNLOCK:  0x3dbfc4,
};

// Micro-motion amplitudes (3x increase — visible at camera distance 22)
const DRIFT_AMP = 0.18;
const DRIFT_AMP_Y = 0.12;

// Orbital motion
const ORBIT_RADIUS_MIN = 0.30;
const ORBIT_RADIUS_MAX = 0.55;
const ORBIT_SPEED_MIN = 0.25;
const ORBIT_SPEED_MAX = 0.55;

// Per-orb aura particles
const AURA_PARTICLES_PER_ORB = 12;
const AURA_RADIUS_MIN = 0.5;
const AURA_RADIUS_MAX = 1.2;
const AURA_PARTICLE_SIZE = 0.08;

// Ambient atmosphere
const AMBIENT_PARTICLE_COUNT = 150;
const AMBIENT_VOLUME_RADIUS = 15;
const AMBIENT_VOLUME_HEIGHT = 30;
const AMBIENT_PARTICLE_SIZE = 0.05;

// Phase-specific material overrides
const PHASE_MAT: Record<string, {
  roughness: number;
  metalness: number;
  clearcoatRoughness: number;
  iridescence: number;
  iridescenceIOR: number;
  sheen: number;
  sheenRoughness: number;
  normalStrength: number;
}> = {
  ELEVATE: {
    roughness: 0.2,
    metalness: 0.05,
    clearcoatRoughness: 0.15,
    iridescence: 0.15,
    iridescenceIOR: 1.3,
    sheen: 0,
    sheenRoughness: 0,
    normalStrength: 0.3,
  },
  ALIGN: {
    roughness: 0.1,
    metalness: 0.15,
    clearcoatRoughness: 0.05,
    iridescence: 0,
    iridescenceIOR: 1.3,
    sheen: 0.5,
    sheenRoughness: 0.3,
    normalStrength: 0.25,
  },
  UNLOCK: {
    roughness: 0.05,
    metalness: 0.25,
    clearcoatRoughness: 0.02,
    iridescence: 0.4,
    iridescenceIOR: 1.5,
    sheen: 0,
    sheenRoughness: 0,
    normalStrength: 0.4,
  },
};

// Phase-specific animation: per-axis rotation speeds
const PHASE_ANIM: Record<string, {
  breathFreq: number;
  breathAmp: number;
  emissiveAmpLive: number;
  emissiveAmpLocked: number;
  emissiveFreq: number;
  rotRateX: number;
  rotRateY: number;
  rotRateZ: number;
}> = {
  ELEVATE: { breathFreq: 0.3, breathAmp: 0.035, emissiveAmpLive: 0.15, emissiveAmpLocked: 0.04, emissiveFreq: 0.25, rotRateX: 0.15, rotRateY: 0.40, rotRateZ: 0.10 },
  ALIGN:   { breathFreq: 0.45, breathAmp: 0.025, emissiveAmpLive: 0.12, emissiveAmpLocked: 0.03, emissiveFreq: 0.35, rotRateX: 0.35, rotRateY: 0.25, rotRateZ: 0.45 },
  UNLOCK:  { breathFreq: 0.6, breathAmp: 0.015, emissiveAmpLive: 0.10, emissiveAmpLocked: 0.03, emissiveFreq: 0.5, rotRateX: 0.10, rotRateY: 1.20, rotRateZ: 0.08 },
};

// ---------------------------------------------------------------------------
// Seeded PRNG (mulberry32)
// ---------------------------------------------------------------------------

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Procedural texture generators
// ---------------------------------------------------------------------------

function generatePhaseTexture(phase: string, seed: number): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const rng = mulberry32(seed * 7919 + 13);

  ctx.fillStyle = '#d8d8d8';
  ctx.fillRect(0, 0, size, size);

  if (phase === 'ELEVATE') {
    for (let i = 0; i < 40; i++) {
      const x = rng() * size;
      const y = rng() * size;
      const r = 8 + rng() * 40;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.08 + rng() * 0.12})`);
      grad.addColorStop(0.6, `rgba(200, 230, 230, ${0.04 + rng() * 0.06})`);
      grad.addColorStop(1, 'rgba(180, 220, 220, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 15; i++) {
      const x = rng() * size;
      const y = rng() * size;
      const r = 2 + rng() * 5;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + rng() * 0.1})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (phase === 'ALIGN') {
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 25; i++) {
      const cx = rng() * size;
      const cy = rng() * size;
      const r = 30 + rng() * 60;
      const startAngle = rng() * Math.PI * 2;
      const sweep = 0.5 + rng() * 2.5;
      ctx.strokeStyle = `rgba(220, 235, 245, ${0.06 + rng() * 0.08})`;
      ctx.lineWidth = 3 + rng() * 12;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, startAngle + sweep);
      ctx.stroke();
    }
    for (let i = 0; i < 12; i++) {
      const x = rng() * size;
      const y = rng() * size;
      const r = 15 + rng() * 35;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(230, 240, 250, ${0.06 + rng() * 0.06})`);
      grad.addColorStop(1, 'rgba(200, 220, 240, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  } else {
    for (let i = 0; i < 30; i++) {
      const x = rng() * size;
      const y = rng() * size;
      const angle = rng() * Math.PI * 2;
      const len = 20 + rng() * 60;
      ctx.strokeStyle = `rgba(240, 250, 255, ${0.06 + rng() * 0.1})`;
      ctx.lineWidth = 1 + rng() * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
    for (let i = 0; i < 20; i++) {
      const x = rng() * size;
      const y = rng() * size;
      const r = 1 + rng() * 3;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + rng() * 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 8; i++) {
      const cx = rng() * size;
      const cy = rng() * size;
      const sides = 3 + Math.floor(rng() * 4);
      const rad = 10 + rng() * 30;
      const startA = rng() * Math.PI * 2;
      ctx.strokeStyle = `rgba(220, 240, 250, ${0.04 + rng() * 0.06})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let s = 0; s <= sides; s++) {
        const a = startA + (s / sides) * Math.PI * 2;
        const px = cx + Math.cos(a) * rad;
        const py = cy + Math.sin(a) * rad;
        s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function generatePhaseNormalMap(phase: string, seed: number): THREE.CanvasTexture {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const rng = mulberry32(seed * 6271 + 37);

  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, size, size);

  if (phase === 'ELEVATE') {
    for (let i = 0; i < 20; i++) {
      const cx = rng() * size;
      const cy = rng() * size;
      const r = 5 + rng() * 15;
      const strength = 20 + rng() * 30;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      const hi = Math.round(128 + strength * 0.3);
      const lo = Math.round(128 - strength * 0.2);
      grad.addColorStop(0, `rgb(${hi}, ${hi}, 255)`);
      grad.addColorStop(0.7, `rgb(${lo}, ${lo}, 240)`);
      grad.addColorStop(1, 'rgb(128, 128, 255)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (phase === 'ALIGN') {
    for (let i = 0; i < 12; i++) {
      const y0 = rng() * size;
      const amplitude = 5 + rng() * 15;
      const freq = 0.02 + rng() * 0.04;
      const strength = 15 + rng() * 25;
      const width = 3 + rng() * 6;
      const phase0 = rng() * 6;
      for (let x = 0; x < size; x++) {
        const yOff = Math.sin(x * freq + phase0) * amplitude;
        const y = y0 + yOff;
        const nx = Math.round(128 + Math.cos(x * freq + phase0) * strength * 0.5);
        const ny = Math.round(128 + Math.sin(x * freq + phase0) * strength);
        ctx.fillStyle = `rgb(${nx}, ${ny}, 245)`;
        ctx.fillRect(x, Math.round(y), 1, Math.round(width));
      }
    }
  } else {
    for (let i = 0; i < 18; i++) {
      const x0 = rng() * size;
      const y0 = rng() * size;
      const angle = rng() * Math.PI * 2;
      const len = 15 + rng() * 40;
      const strength = 25 + rng() * 35;
      const nx = Math.round(128 + Math.sin(angle) * strength);
      const ny = Math.round(128 - Math.cos(angle) * strength);
      ctx.strokeStyle = `rgb(${nx}, ${ny}, 235)`;
      ctx.lineWidth = 2 + rng() * 3;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 + Math.cos(angle) * len, y0 + Math.sin(angle) * len);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ---------------------------------------------------------------------------
// Soft dot texture for particle systems (shared)
// ---------------------------------------------------------------------------

function createSoftDotTexture(): THREE.CanvasTexture {
  const size = 32;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

// ---------------------------------------------------------------------------
// Helix path builder
// ---------------------------------------------------------------------------

function buildHelixPath(): THREE.Vector3[] {
  const totalRange = 1 + 2 * PATH_EXTEND;
  const totalSteps = Math.ceil(PATH_STEPS * totalRange);
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= totalSteps; i++) {
    const p = -PATH_EXTEND + (i / totalSteps) * totalRange;
    const theta = p * Math.PI * 2 * TURNS;
    const r = 2.5 + Math.sin(Math.max(0, Math.min(1, p)) * Math.PI) * 3.5;
    points.push(new THREE.Vector3(
      r * Math.cos(theta),
      p * HELIX_HEIGHT - HELIX_HEIGHT / 2,
      r * Math.sin(theta),
    ));
  }
  return points;
}

function nodePathIndex(t: number, pathLength: number): number {
  const totalRange = 1 + 2 * PATH_EXTEND;
  const normalized = (t + PATH_EXTEND) / totalRange;
  return Math.min(Math.floor(normalized * (pathLength - 1)), pathLength - 1);
}

// ---------------------------------------------------------------------------
// Emoji sprite
// ---------------------------------------------------------------------------

function makeEmojiSprite(emoji: string): THREE.Sprite {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.font = `${Math.round(size * 0.7)}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.setScalar(0.45);
  return sprite;
}

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

export function initSpiral(
  container: HTMLElement,
  nodes: NodeData[],
): () => void {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG_COLOR);
  scene.fog = new THREE.FogExp2(BG_COLOR, FOG_DENSITY);

  const w = container.clientWidth;
  const h = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
  camera.position.set(0, 2, 22);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.6;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cursor = 'grab';
  renderer.domElement.style.touchAction = 'none';

  // --- Lighting ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const keyLight = new THREE.PointLight(0x119a9e, 2.2, 60);
  keyLight.position.set(8, 12, 15);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0xc9a96e, 1.0, 40);
  fillLight.position.set(-6, -4, -10);
  scene.add(fillLight);

  // --- Controls ---
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;
  controls.enablePan = false;
  controls.minDistance = 8;
  controls.maxDistance = 40;

  // --- Build helix path ---
  const path = buildHelixPath();

  // Phase-colored line with vertex fade at extensions
  const geo = new THREE.BufferGeometry().setFromPoints(path);
  const vColors = new Float32Array(path.length * 3);
  const phaseC = {
    ELEVATE: new THREE.Color(PHASE_HEX.ELEVATE),
    ALIGN: new THREE.Color(PHASE_HEX.ALIGN),
    UNLOCK: new THREE.Color(PHASE_HEX.UNLOCK),
  };
  const totalRange = 1 + 2 * PATH_EXTEND;
  for (let i = 0; i < path.length; i++) {
    const p = -PATH_EXTEND + (i / path.length) * totalRange;
    const c = p < 5 / 13 ? phaseC.ELEVATE : p < 11 / 13 ? phaseC.ALIGN : phaseC.UNLOCK;

    // Cubic fade at extensions — line dissolves before fog boundary
    let fade = 1.0;
    if (p < 0) {
      fade = Math.max(0, (p + PATH_EXTEND) / PATH_EXTEND);
      fade = fade * fade * fade;
    } else if (p > 1) {
      fade = Math.max(0, 1 - (p - 1) / PATH_EXTEND);
      fade = fade * fade * fade;
    }

    vColors[i * 3] = c.r * fade;
    vColors[i * 3 + 1] = c.g * fade;
    vColors[i * 3 + 2] = c.b * fade;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(vColors, 3));
  scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.45,
  })));

  // --- Orb meshes ---
  const sharedGeo = new THREE.SphereGeometry(ORB_RADIUS, ORB_SEGMENTS, ORB_SEGMENTS);
  const orbMeshes: THREE.Mesh[] = [];
  const orbGroups: THREE.Group[] = [];
  const basePositions: THREE.Vector3[] = [];
  const disposables: THREE.Material[] = [];
  const texturesToDispose: THREE.Texture[] = [];
  const animParams: OrbAnimParams[] = [];
  const nodeColorList: THREE.Color[] = [];
  const UP = new THREE.Vector3(0, 1, 0);

  nodes.forEach((node, i) => {
    const t = nodes.length > 1 ? i / (nodes.length - 1) : 0;
    const idx = nodePathIndex(t, path.length);
    const pos = path[idx].clone();

    const live = node.status === 'live';
    const nodeColor = new THREE.Color(node.color);
    nodeColorList.push(nodeColor);
    const phase = node.phase;
    const pm = PHASE_MAT[phase] || PHASE_MAT.ELEVATE;
    const pa = PHASE_ANIM[phase] || PHASE_ANIM.ELEVATE;

    const albedoTex = generatePhaseTexture(phase, i);
    const normalTex = generatePhaseNormalMap(phase, i);
    texturesToDispose.push(albedoTex, normalTex);

    const sheenColor = new THREE.Color(node.color).lerp(new THREE.Color(0xffffff), 0.4);

    const mat = new THREE.MeshPhysicalMaterial({
      color: nodeColor,
      map: albedoTex,
      normalMap: normalTex,
      normalScale: new THREE.Vector2(pm.normalStrength, pm.normalStrength),
      emissive: nodeColor,
      emissiveIntensity: live ? 0.85 : 0.2,
      metalness: pm.metalness,
      roughness: pm.roughness,
      transparent: true,
      opacity: live ? 0.85 : 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: pm.clearcoatRoughness,
      iridescence: pm.iridescence,
      iridescenceIOR: pm.iridescenceIOR,
      sheen: pm.sheen,
      sheenColor: sheenColor,
      sheenRoughness: pm.sheenRoughness,
    });
    disposables.push(mat);

    const mesh = new THREE.Mesh(sharedGeo, mat);
    mesh.userData = node;

    const group = new THREE.Group();
    group.position.copy(pos);
    group.add(mesh);

    const emoji = makeEmojiSprite(node.emoji);
    group.add(emoji);

    scene.add(group);
    orbMeshes.push(mesh);
    orbGroups.push(group);
    basePositions.push(pos);

    // Helix tangent, normal, binormal for orbital plane
    const idxPrev = Math.max(0, idx - 1);
    const idxNext = Math.min(path.length - 1, idx + 1);
    const tangent = new THREE.Vector3().subVectors(path[idxNext], path[idxPrev]).normalize();
    const normal = new THREE.Vector3().crossVectors(tangent, UP).normalize();
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

    // Per-node animation parameters
    const nodeRng = mulberry32(i * 3571 + 17);
    const seed = i * 2.39;
    animParams.push({
      breathFreq: pa.breathFreq * (0.85 + nodeRng() * 0.3),
      breathAmp: pa.breathAmp,
      breathPhase: seed * 1.7,
      emissiveBase: live ? 0.85 : 0.2,
      emissiveAmp: live ? pa.emissiveAmpLive : pa.emissiveAmpLocked,
      emissiveFreq: pa.emissiveFreq * (0.9 + nodeRng() * 0.2),
      emissivePhase: seed * 2.1,
      rotRateX: pa.rotRateX * (0.85 + nodeRng() * 0.3),
      rotRateY: pa.rotRateY * (0.85 + nodeRng() * 0.3),
      rotRateZ: pa.rotRateZ * (0.85 + nodeRng() * 0.3),
      rotPhaseX: nodeRng() * Math.PI * 2,
      rotPhaseY: nodeRng() * Math.PI * 2,
      rotPhaseZ: nodeRng() * Math.PI * 2,
      orbitRadius: ORBIT_RADIUS_MIN + nodeRng() * (ORBIT_RADIUS_MAX - ORBIT_RADIUS_MIN),
      orbitSpeed: ORBIT_SPEED_MIN + nodeRng() * (ORBIT_SPEED_MAX - ORBIT_SPEED_MIN),
      orbitPhase: nodeRng() * Math.PI * 2,
      orbitNormal: normal,
      orbitBinormal: binormal,
      driftFreqs: [
        0.47 + i * 0.013, 0.31 + i * 0.009,
        0.35 + i * 0.011, 0.23 + i * 0.007,
        0.40 + i * 0.015, 0.29 + i * 0.008,
      ],
    });
  });

  // --- Per-orb aura particles (single Points object, 1 draw call) ---
  const softDotTex = createSoftDotTexture();
  texturesToDispose.push(softDotTex);

  const TOTAL_AURA = nodes.length * AURA_PARTICLES_PER_ORB;
  const auraPositions = new Float32Array(TOTAL_AURA * 3);
  const auraColors = new Float32Array(TOTAL_AURA * 3);
  const auraGeometry = new THREE.BufferGeometry();
  auraGeometry.setAttribute('position', new THREE.BufferAttribute(auraPositions, 3));
  auraGeometry.setAttribute('color', new THREE.BufferAttribute(auraColors, 3));

  const auraParams: AuraParam[] = [];

  nodes.forEach((node, i) => {
    const particleRng = mulberry32(i * 7919 + 41);
    const live = node.status === 'live';
    const visibleCount = live ? AURA_PARTICLES_PER_ORB : Math.floor(AURA_PARTICLES_PER_ORB / 2);

    for (let j = 0; j < AURA_PARTICLES_PER_ORB; j++) {
      const visible = j < visibleCount;
      auraParams.push({
        radiusBase: visible ? AURA_RADIUS_MIN + particleRng() * (AURA_RADIUS_MAX - AURA_RADIUS_MIN) : 0,
        theta0: particleRng() * Math.PI * 2,
        phi0: particleRng() * Math.PI,
        orbitSpeed: 0.15 + particleRng() * 0.4,
        driftFreq: 0.3 + particleRng() * 0.5,
        driftAmp: 0.1 + particleRng() * 0.2,
        phase: particleRng() * Math.PI * 2,
        brightnessBase: live ? (0.7 + particleRng() * 0.3) : (0.25 + particleRng() * 0.15),
        brightnessFreq: 0.4 + particleRng() * 0.6,
      });

      // Hide excess particles for locked orbs
      if (!visible) {
        const bufIdx = (i * AURA_PARTICLES_PER_ORB + j) * 3;
        auraPositions[bufIdx + 1] = -1000;
      }
    }
  });

  const auraMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    map: softDotTex,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    size: AURA_PARTICLE_SIZE,
  });
  disposables.push(auraMaterial);
  scene.add(new THREE.Points(auraGeometry, auraMaterial));

  // --- Ambient atmosphere (second Points object, 1 draw call) ---
  const ambientPositions = new Float32Array(AMBIENT_PARTICLE_COUNT * 3);
  const ambientBasePositions = new Float32Array(AMBIENT_PARTICLE_COUNT * 3);
  const ambientColors = new Float32Array(AMBIENT_PARTICLE_COUNT * 3);
  const ambientGeometry = new THREE.BufferGeometry();
  const ambientRng = mulberry32(9999);
  const ambientParams: AmbientParam[] = [];
  const phaseColors = [new THREE.Color(PHASE_HEX.ELEVATE), new THREE.Color(PHASE_HEX.ALIGN), new THREE.Color(PHASE_HEX.UNLOCK)];

  for (let j = 0; j < AMBIENT_PARTICLE_COUNT; j++) {
    const idx = j * 3;
    ambientBasePositions[idx] = (ambientRng() - 0.5) * 2 * AMBIENT_VOLUME_RADIUS;
    ambientBasePositions[idx + 1] = (ambientRng() - 0.5) * 2 * AMBIENT_VOLUME_HEIGHT;
    ambientBasePositions[idx + 2] = (ambientRng() - 0.5) * 2 * AMBIENT_VOLUME_RADIUS;
    ambientPositions[idx] = ambientBasePositions[idx];
    ambientPositions[idx + 1] = ambientBasePositions[idx + 1];
    ambientPositions[idx + 2] = ambientBasePositions[idx + 2];

    const pc = phaseColors[Math.floor(ambientRng() * 3)];
    const dim = 0.25 + ambientRng() * 0.25;
    ambientColors[idx] = pc.r * dim;
    ambientColors[idx + 1] = pc.g * dim;
    ambientColors[idx + 2] = pc.b * dim;

    ambientParams.push({
      driftFreqX: 0.02 + ambientRng() * 0.04,
      driftFreqY: 0.01 + ambientRng() * 0.02,
      driftFreqZ: 0.02 + ambientRng() * 0.04,
      driftAmpX: 0.3 + ambientRng() * 0.7,
      driftAmpY: 0.2 + ambientRng() * 0.5,
      driftAmpZ: 0.3 + ambientRng() * 0.7,
      phase: ambientRng() * Math.PI * 2,
    });
  }

  ambientGeometry.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
  ambientGeometry.setAttribute('color', new THREE.BufferAttribute(ambientColors, 3));

  const ambientMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    map: softDotTex,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    size: AMBIENT_PARTICLE_SIZE,
  });
  disposables.push(ambientMaterial);
  scene.add(new THREE.Points(ambientGeometry, ambientMaterial));

  // --- Tooltip ---
  const tip = document.createElement('div');
  tip.style.cssText = `
    position:absolute;display:none;padding:6px 12px;
    background:rgba(7,30,34,0.88);color:#e8e4df;
    border:1px solid rgba(17,154,158,0.3);border-radius:6px;
    font:13px/1.3 Inter,system-ui,sans-serif;pointer-events:none;
    z-index:100;backdrop-filter:blur(6px);
    box-shadow:0 4px 12px rgba(0,0,0,0.3);
  `;
  container.style.position = 'relative';
  container.appendChild(tip);

  // --- Raycaster & interaction ---
  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered: THREE.Mesh | null = null;
  let downX = 0;
  let downY = 0;
  let downPointerType = 'mouse';

  function setPointer(ex: number, ey: number): void {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.x = ((ex - r.left) / r.width) * 2 - 1;
    pointer.y = -((ey - r.top) / r.height) * 2 + 1;
  }

  function onPointerMove(e: PointerEvent): void {
    if (e.pointerType === 'touch') return;

    setPointer(e.clientX, e.clientY);
    ray.setFromCamera(pointer, camera);
    const hits = ray.intersectObjects(orbMeshes);
    const rect = renderer.domElement.getBoundingClientRect();

    if (hits.length > 0) {
      const hitMesh = hits[0].object as THREE.Mesh;
      if (hovered !== hitMesh) {
        if (hovered) hovered.scale.setScalar(1);
        hovered = hitMesh;
        hitMesh.scale.setScalar(1.2);
        const data = hitMesh.userData as NodeData;
        tip.textContent = data.status === 'locked'
          ? `${data.emoji} ${data.name} — locked`
          : `${data.emoji} ${data.name}`;
        tip.style.display = 'block';
      }
      tip.style.left = (e.clientX - rect.left + 15) + 'px';
      tip.style.top = (e.clientY - rect.top - 10) + 'px';
      renderer.domElement.style.cursor = 'pointer';
    } else if (hovered) {
      hovered.scale.setScalar(1);
      hovered = null;
      tip.style.display = 'none';
      renderer.domElement.style.cursor = 'grab';
    }
  }

  function onPointerDown(e: PointerEvent): void {
    downX = e.clientX;
    downY = e.clientY;
    downPointerType = e.pointerType;
    if (e.pointerType !== 'touch') {
      renderer.domElement.style.cursor = 'grabbing';
    }
  }

  function onPointerUp(e: PointerEvent): void {
    if (e.pointerType !== 'touch') {
      renderer.domElement.style.cursor = hovered ? 'pointer' : 'grab';
    }
    const threshold = downPointerType === 'touch' ? TAP_THRESHOLD : CLICK_THRESHOLD;
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > threshold) return;

    setPointer(e.clientX, e.clientY);
    ray.setFromCamera(pointer, camera);
    const hits = ray.intersectObjects(orbMeshes);
    if (hits.length > 0) {
      const data = hits[0].object.userData as NodeData;
      if (data.status === 'live') {
        window.location.href = data.url;
      }
    }
  }

  function onResize(): void {
    const ww = container.clientWidth;
    const hh = container.clientHeight;
    camera.aspect = ww / hh;
    camera.updateProjectionMatrix();
    renderer.setSize(ww, hh);
  }

  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  window.addEventListener('resize', onResize);

  // --- Animation loop ---
  // Reduced-motion: dampen all animation for vestibular accessibility
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionScale = prefersReducedMotion ? 0.05 : 1.0;

  if (prefersReducedMotion) {
    controls.autoRotate = false;
  }

  const clock = new THREE.Clock();
  let frame = 0;
  const cameraDir = new THREE.Vector3();

  function loop(): void {
    frame = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();

    orbGroups.forEach((group, i) => {
      const ap = animParams[i];
      const mesh = group.children[0] as THREE.Mesh;
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      const seed = i * 2.39;
      const df = ap.driftFreqs;
      const nc = nodeColorList[i];

      // 1. Orbital motion + layered drift (scaled by reduced-motion preference)
      const orbitAngle = t * ap.orbitSpeed * motionScale + ap.orbitPhase;
      const orbX = Math.cos(orbitAngle) * ap.orbitRadius * motionScale;
      const orbY = Math.sin(orbitAngle) * ap.orbitRadius * motionScale;

      group.position.x = basePositions[i].x
        + ap.orbitNormal.x * orbX + ap.orbitBinormal.x * orbY
        + Math.sin(t * df[0] + seed) * DRIFT_AMP
        + Math.sin(t * df[1] + seed * 1.7) * DRIFT_AMP * 0.4;
      group.position.y = basePositions[i].y
        + ap.orbitNormal.y * orbX + ap.orbitBinormal.y * orbY
        + Math.sin(t * df[2] + seed * 1.3) * DRIFT_AMP_Y
        + Math.sin(t * df[3] + seed * 2.1) * DRIFT_AMP_Y * 0.3;
      group.position.z = basePositions[i].z
        + ap.orbitNormal.z * orbX + ap.orbitBinormal.z * orbY
        + Math.cos(t * df[4] + seed * 0.7) * DRIFT_AMP
        + Math.cos(t * df[5] + seed * 1.1) * DRIFT_AMP * 0.4;

      // 2. Breathing scale (skip if hovered)
      if (mesh !== hovered) {
        const breath = 1.0 + Math.sin(t * ap.breathFreq + ap.breathPhase) * ap.breathAmp;
        mesh.scale.setScalar(breath);
      }

      // 3. Emissive pulsing
      mat.emissiveIntensity = ap.emissiveBase
        + Math.sin(t * ap.emissiveFreq + ap.emissivePhase) * ap.emissiveAmp;

      // 4. Multi-axis rotation (VISIBLE spinning, dampened for reduced-motion)
      mesh.rotation.x = t * ap.rotRateX * motionScale + ap.rotPhaseX;
      mesh.rotation.y = t * ap.rotRateY * motionScale + ap.rotPhaseY;
      mesh.rotation.z = t * ap.rotRateZ * motionScale + ap.rotPhaseZ;

      // 5. Emoji sprite: camera-facing + bob
      const emoji = group.children[1];
      if (emoji) {
        cameraDir.copy(camera.position).sub(group.position).normalize();
        const bob = Math.sin(t * 0.7 + seed * 1.5) * 0.025;
        emoji.position.copy(cameraDir.multiplyScalar(ORB_RADIUS + 0.08));
        emoji.position.y += bob;
      }

      // 6. Per-orb aura particles
      for (let j = 0; j < AURA_PARTICLES_PER_ORB; j++) {
        const pIdx = i * AURA_PARTICLES_PER_ORB + j;
        const pp = auraParams[pIdx];
        if (pp.radiusBase === 0) continue;

        const bufIdx = pIdx * 3;
        const r = pp.radiusBase + Math.sin(t * pp.driftFreq + pp.phase) * pp.driftAmp;
        const theta = pp.theta0 + t * pp.orbitSpeed;
        const phi = pp.phi0 + t * pp.orbitSpeed * 0.37;

        auraPositions[bufIdx] = group.position.x + r * Math.sin(phi) * Math.cos(theta);
        auraPositions[bufIdx + 1] = group.position.y + r * Math.cos(phi);
        auraPositions[bufIdx + 2] = group.position.z + r * Math.sin(phi) * Math.sin(theta);

        const bright = pp.brightnessBase + Math.sin(t * pp.brightnessFreq + pp.phase) * 0.3;
        auraColors[bufIdx] = nc.r * bright;
        auraColors[bufIdx + 1] = nc.g * bright;
        auraColors[bufIdx + 2] = nc.b * bright;
      }
    });

    // Flush aura buffers
    auraGeometry.attributes.position.needsUpdate = true;
    auraGeometry.attributes.color.needsUpdate = true;

    // Ambient atmosphere drift
    for (let j = 0; j < AMBIENT_PARTICLE_COUNT; j++) {
      const idx = j * 3;
      const ap = ambientParams[j];
      ambientPositions[idx] = ambientBasePositions[idx] + Math.sin(t * ap.driftFreqX + ap.phase) * ap.driftAmpX;
      ambientPositions[idx + 1] = ambientBasePositions[idx + 1] + Math.sin(t * ap.driftFreqY + ap.phase * 1.3) * ap.driftAmpY;
      ambientPositions[idx + 2] = ambientBasePositions[idx + 2] + Math.cos(t * ap.driftFreqZ + ap.phase * 0.7) * ap.driftAmpZ;
    }
    ambientGeometry.attributes.position.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);
  }
  loop();

  // --- Cleanup ---
  return () => {
    cancelAnimationFrame(frame);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('resize', onResize);
    controls.dispose();
    disposables.forEach(m => m.dispose());
    texturesToDispose.forEach(tex => tex.dispose());
    sharedGeo.dispose();
    geo.dispose();
    auraGeometry.dispose();
    ambientGeometry.dispose();
    renderer.dispose();
    tip.remove();
    renderer.domElement.remove();
  };
}
