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
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export type SpiralVariant = 'symbols' | 'stars';

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

interface InnerParam {
  radiusBase: number;
  theta0: number;
  phi0: number;
  thetaSpeed: number;
  phiSpeed: number;
  breathFreq: number;
  breathAmp: number;
  twinkleFreq: number;
  twinklePhase: number;
  brightnessBase: number;
}

// Each node = a mini solar system. Planets orbit the central star (orb) at
// distinct radii, inclinations, speeds, and phases. Composition (count, sizes,
// colors, ring) is seeded by node.id so every node is structurally distinct.
interface PlanetParam {
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  inclination: number;          // tilt of orbital plane (rad)
  ascendingNode: number;        // longitude of ascending node (rad)
  size: number;                 // mesh scale
  spinSpeed: number;            // self-rotation rate
  hasRing: boolean;             // saturn-style ring around this planet
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TURNS = 3.5;
const HELIX_HEIGHT = 14;
const PATH_STEPS = 512;
const PATH_EXTEND = 0.85;            // 85% extra above/below — truly infinite
const BG_COLOR = 0x071e22;           // matches --color-ocean-900 (no seam with page)
const FOG_DENSITY = 0.05;            // dissolves endpoints into background
const ORB_RADIUS = 0.32;             // smaller — stars are points of light, not chunks
const ORB_SEGMENTS = 32;
const CLICK_THRESHOLD = 8;           // px — drag vs. click (mouse)
const TAP_THRESHOLD = 30;            // px — drag vs. tap (touch)

const PHASE_HEX: Record<string, number> = {
  ELEVATE: 0x119a9e,
  ALIGN:   0x8cc5d3,
  UNLOCK:  0x3dbfc4,
};

// Chakra-derived palette — root → crown — applied to nodes bottom-to-top via interpolation.
// 8 stops (was 7): added a second orange between root and sacral so the warm side gets
// more screen real estate, the indigo→violet stretch compresses to ~2 nodes instead of 3,
// and the crown is lightened (Maddie 2026-04-25: "another shade of orange instead of three
// purple, lighten the most top purple").
const CHAKRA_HEX: number[] = [
  0xff3b3b, // 1 root        — red
  0xff6a3c, // 2 root-sacral — red-orange (added)
  0xff9a3c, // 3 sacral      — orange
  0xffd23b, // 4 solar       — yellow
  0x4ed158, // 5 heart       — green
  0x3da9f5, // 6 throat      — sky blue
  0x6c4cd6, // 7 third eye   — indigo
  0xc97ce8, // 8 crown       — lightened violet
];

// Micro-motion amplitudes (3x increase — visible at camera distance 22)
const DRIFT_AMP = 0.18;
const DRIFT_AMP_Y = 0.12;

// Orbital motion
const ORBIT_RADIUS_MIN = 0.30;
const ORBIT_RADIUS_MAX = 0.55;
const ORBIT_SPEED_MIN = 0.25;
const ORBIT_SPEED_MAX = 0.55;

// Per-orb aura particles (orbit OUTSIDE each node)
const AURA_PARTICLES_PER_ORB = 12;
const AURA_RADIUS_MIN = 0.5;
const AURA_RADIUS_MAX = 1.2;
const AURA_PARTICLE_SIZE = 0.08;

// Per-orb inner shimmer particles (drift INSIDE each node's local volume —
// the "movement inside the containers like stars" effect)
const INNER_PARTICLES_PER_ORB = 6;
const INNER_RADIUS_MIN = 0.10;
const INNER_RADIUS_MAX = 0.32;
const INNER_PARTICLE_SIZE = 0.07;

// Per-orb planets — each node IS a mini solar system, contained INSIDE the
// shape itself. User 2026-04-25: "the solar system is contained within the
// shape itself" + "each universe is a season, or weather, different phases of
// matter, a color wheel — obviously logically applicable to its icon
// representing". Planets orbit at radii < ORB_RADIUS, rendered with additive
// emissive material so they glow THROUGH the orb's translucent (stars) /
// semi-translucent (symbols) surface like radiant interior bodies. Bloom
// amplifies them so each shape reads as a contained universe.
const PLANET_RADIUS_MIN = 0.018;
const PLANET_RADIUS_MAX = 0.045;
const PLANET_ORBIT_MIN = 0.08;          // inside the orb (ORB_RADIUS = 0.32)
const PLANET_ORBIT_MAX = 0.28;          // still inside ORB_RADIUS

// --- Per-node universe themes ---
// Each node's interior universe is tuned to its icon's symbolic meaning. The
// theme drives planet count, layout, palette, orbital speed, and ring chance.
// Themes are *iconological*: solid matter / fluid / fire / lunar / structure
// / bloom / cardinal / crystal — each one a phase of matter or weather that
// matches what the icon represents (sunburst → dawn, water teardrop → fluid,
// hexagram → structure, octahedron → crystal, ankh → eternal cycle, etc.).
type LayoutStyle = 'free' | 'pair' | 'cardinal' | 'sextet';
type InclinationStyle = 'random' | 'coplanar' | 'orthogonal' | 'cardinal';

interface NodeUniverse {
  theme: string;
  planetCount: number;
  speedMul: number;
  palette: number[];
  ringChance: number;
  layout: LayoutStyle;
  inclination: InclinationStyle;
}

// Per-node palettes — each one a chromatic mood matching the icon's meaning.
const PAL = {
  DAWN:    [0xff8a3c, 0xffd23b, 0xff6a3c, 0xffaa66],            // warm sunrise
  COOL:    [0x3da9f5, 0x6c4cd6, 0x4ed1c5, 0x5588ff],            // cool observation
  DUALITY: [0xeeeeee, 0x222a44, 0x9ba9d6, 0xc97ce8],            // light/dark contrast
  FIRE:    [0xff3b3b, 0xff8a3c, 0xffd23b, 0xff5050],            // hot plasma
  WATER:   [0x3da9f5, 0x4ed1c5, 0x66c8ff, 0x4dc7d6],            // blue-cyan-aqua
  SPRING:  [0x4ed158, 0xffaa66, 0xc97ce8, 0xff9aaa],            // bloom pinks/greens
  LUNAR:   [0xc9d4f5, 0x9ba9d6, 0xa0c8ff, 0x8896c4],            // moonlit silvers
  STRUCTURE:[0x6c4cd6, 0x4ed158, 0xffd23b, 0x3da9f5],            // 4 cardinal hues
  GOLD:    [0xffd23b, 0xffaa66, 0xc9a96e, 0xfff0aa],            // radiant golds
  CARDINAL:[0xff3b3b, 0xffd23b, 0x4ed158, 0x6c4cd6],            // 4 element fires
  CRYSTAL: [0x9be3ff, 0xc9a96e, 0xe4f0ff, 0xa0c8d6],            // mineral lights
  ETERNAL: [0xffd23b, 0xffaa66, 0xc9a96e, 0xc97ce8],            // ankh-gold + violet
};

// Map node.id → universe theme. Aligned with symbolGeometryFor() switch:
//   1 sunburst → dawn        2 eye → observation       3 yin-yang → duality
//   4 up-triangle → fire     5 teardrop → water        6 vesica piscis → spring (intersection bloom)
//   7 crescent → lunar       8 hexagram → structure (6 nodes)
//   9 lotus → spring         10 eye-in-triangle → gold (radiant clarity)
//   11 solar cross → cardinal (4-direction)             12 octahedron → crystal
//   13 ankh → eternal
const NODE_UNIVERSES: Record<number, NodeUniverse> = {
  1:  { theme: 'dawn',         planetCount: 4, speedMul: 1.20, palette: PAL.DAWN,      ringChance: 0.15, layout: 'free',     inclination: 'random'    },
  2:  { theme: 'observation',  planetCount: 3, speedMul: 0.55, palette: PAL.COOL,      ringChance: 0.35, layout: 'free',     inclination: 'coplanar'  },
  3:  { theme: 'duality',      planetCount: 2, speedMul: 0.90, palette: PAL.DUALITY,   ringChance: 0.00, layout: 'pair',     inclination: 'coplanar'  },
  4:  { theme: 'fire',         planetCount: 5, speedMul: 1.65, palette: PAL.FIRE,      ringChance: 0.05, layout: 'free',     inclination: 'random'    },
  5:  { theme: 'water',        planetCount: 4, speedMul: 0.65, palette: PAL.WATER,     ringChance: 0.20, layout: 'free',     inclination: 'coplanar'  },
  6:  { theme: 'intersection', planetCount: 2, speedMul: 0.80, palette: PAL.SPRING,    ringChance: 0.00, layout: 'pair',     inclination: 'coplanar'  },
  7:  { theme: 'lunar',        planetCount: 3, speedMul: 0.45, palette: PAL.LUNAR,     ringChance: 0.45, layout: 'free',     inclination: 'random'    },
  8:  { theme: 'structure',    planetCount: 6, speedMul: 0.95, palette: PAL.STRUCTURE, ringChance: 0.10, layout: 'sextet',   inclination: 'coplanar'  },
  9:  { theme: 'spring',       planetCount: 5, speedMul: 1.05, palette: PAL.SPRING,    ringChance: 0.20, layout: 'free',     inclination: 'random'    },
  10: { theme: 'clarity',      planetCount: 3, speedMul: 1.30, palette: PAL.GOLD,      ringChance: 0.30, layout: 'free',     inclination: 'coplanar'  },
  11: { theme: 'cardinal',     planetCount: 4, speedMul: 0.85, palette: PAL.CARDINAL,  ringChance: 0.00, layout: 'cardinal', inclination: 'coplanar'  },
  12: { theme: 'crystal',      planetCount: 4, speedMul: 1.00, palette: PAL.CRYSTAL,   ringChance: 0.55, layout: 'free',     inclination: 'orthogonal'},
  13: { theme: 'eternity',     planetCount: 5, speedMul: 1.10, palette: PAL.ETERNAL,   ringChance: 0.40, layout: 'free',     inclination: 'random'    },
};
function universeFor(nodeId: number): NodeUniverse {
  return NODE_UNIVERSES[nodeId] || NODE_UNIVERSES[1];
}

const PLANET_ORBIT_SPEED_MIN = 0.45;
const PLANET_ORBIT_SPEED_MAX = 1.65;

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
// Geometry builders — Variant A (sacred symbols) + Variant B (generative stars)
// ---------------------------------------------------------------------------

const EXTRUDE_DEFAULT = (outerR: number, depth: number, curveSegments = 16) => ({
  depth,
  bevelEnabled: true,
  bevelThickness: depth * 0.18,
  bevelSize: outerR * 0.06,
  bevelSegments: 4,
  curveSegments,
});

function extrudeShape(
  shape: THREE.Shape,
  outerR: number,
  depth: number,
  curveSegments = 8,
): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, EXTRUDE_DEFAULT(outerR, depth, curveSegments));
  geo.center();
  return geo;
}

// N-point regular star (used for sunburst, hexagram, lotus rosette)
function makeStarShape(outerR: number, innerR: number, points: number): THREE.Shape {
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

// 1. Sunburst — 12-ray solar emblem (Egyptian Ra / universal solar disc)
function makeSunburst(outerR: number, depth: number): THREE.ExtrudeGeometry {
  return extrudeShape(makeStarShape(outerR, outerR * 0.22, 12), outerR, depth);
}

// 2. Eye almond + pupil hole (Eye of Horus simplified — vesica almond + iris)
function makeEye(outerR: number, depth: number): THREE.ExtrudeGeometry {
  const w = outerR;
  const h = outerR * 0.55;
  const shape = new THREE.Shape();
  shape.moveTo(-w, 0);
  shape.quadraticCurveTo(-w * 0.5, h, 0, h);
  shape.quadraticCurveTo(w * 0.5, h, w, 0);
  shape.quadraticCurveTo(w * 0.5, -h, 0, -h);
  shape.quadraticCurveTo(-w * 0.5, -h, -w, 0);
  const pupil = new THREE.Path();
  pupil.absellipse(0, 0, outerR * 0.18, outerR * 0.18, 0, Math.PI * 2, false, 0);
  shape.holes.push(pupil);
  return extrudeShape(shape, outerR, depth, 12);
}

// 3. Yin-yang disc — circle with two small dot-holes (taegeuk dots)
function makeYinYang(outerR: number, depth: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, outerR * 0.95, outerR * 0.95, 0, Math.PI * 2, false, 0);
  const yang = new THREE.Path();
  yang.absellipse(0, outerR * 0.4, outerR * 0.18, outerR * 0.18, 0, Math.PI * 2, false, 0);
  const yin = new THREE.Path();
  yin.absellipse(0, -outerR * 0.4, outerR * 0.18, outerR * 0.18, 0, Math.PI * 2, false, 0);
  shape.holes.push(yang, yin);
  return extrudeShape(shape, outerR, depth, 24);
}

// 4. Upward triangle (Pythagorean fire / Hindu Manipura)
function makeUpwardTriangle(outerR: number, depth: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * outerR;
    const y = Math.sin(a) * outerR;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return extrudeShape(shape, outerR, depth);
}

// 5. Teardrop (water — Root Healing)
function makeTeardrop(outerR: number, depth: number): THREE.ExtrudeGeometry {
  const r = outerR * 0.7;
  const tip = outerR;
  const shape = new THREE.Shape();
  shape.moveTo(0, tip);
  shape.bezierCurveTo(r, tip * 0.4, r, -r * 0.6, 0, -r);
  shape.bezierCurveTo(-r, -r * 0.6, -r, tip * 0.4, 0, tip);
  return extrudeShape(shape, outerR, depth, 16);
}

// 6. Vesica piscis (mandorla — Christian/Hindu/Sufi mystical union, replaces generic heart)
function makeVesicaPiscis(outerR: number, depth: number): THREE.ExtrudeGeometry {
  const w = outerR * 0.55;
  const h = outerR;
  const shape = new THREE.Shape();
  shape.moveTo(0, h);
  shape.quadraticCurveTo(w, 0, 0, -h);
  shape.quadraticCurveTo(-w, 0, 0, h);
  return extrudeShape(shape, outerR, depth, 16);
}

// 7. Crescent moon (Islamic / lunar feminine)
function makeCrescent(outerR: number, depth: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, outerR * 0.95, outerR * 0.95, 0, Math.PI * 2, false, 0);
  const bite = new THREE.Path();
  bite.absellipse(outerR * 0.35, 0, outerR * 0.78, outerR * 0.78, 0, Math.PI * 2, false, 0);
  shape.holes.push(bite);
  return extrudeShape(shape, outerR, depth, 24);
}

// 8. Hexagram (Star of David / Hindu Anahata — coherence)
function makeHexagram(outerR: number, depth: number): THREE.ExtrudeGeometry {
  return extrudeShape(makeStarShape(outerR, outerR * 0.55, 6), outerR, depth);
}

// 9. Lotus rosette (Buddhist Sahasrara — awakening) — 8-point flower
function makeLotus(outerR: number, depth: number): THREE.ExtrudeGeometry {
  return extrudeShape(makeStarShape(outerR, outerR * 0.62, 8), outerR, depth, 12);
}

// 10. Eye-in-triangle (Egyptian / Masonic Eye of Providence)
function makeEyeInTriangle(outerR: number, depth: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * outerR;
    const y = Math.sin(a) * outerR;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const eye = new THREE.Path();
  eye.absellipse(0, -outerR * 0.05, outerR * 0.22, outerR * 0.22, 0, Math.PI * 2, false, 0);
  shape.holes.push(eye);
  return extrudeShape(shape, outerR, depth, 12);
}

// 11. Solar cross / sun-wheel (Celtic / pre-Christian — replaces generic equal-arm cross)
//     Disc with cross-shaped hole — silhouette reads as wheeled cross.
function makeSolarCross(outerR: number, depth: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, outerR * 0.95, outerR * 0.95, 0, Math.PI * 2, false, 0);
  const armW = outerR * 0.18;
  const armL = outerR * 0.78;
  const crossHole = new THREE.Path();
  crossHole.moveTo(-armW, armW);
  crossHole.lineTo(-armW, armL);
  crossHole.lineTo(armW, armL);
  crossHole.lineTo(armW, armW);
  crossHole.lineTo(armL, armW);
  crossHole.lineTo(armL, -armW);
  crossHole.lineTo(armW, -armW);
  crossHole.lineTo(armW, -armL);
  crossHole.lineTo(-armW, -armL);
  crossHole.lineTo(-armW, -armW);
  crossHole.lineTo(-armL, -armW);
  crossHole.lineTo(-armL, armW);
  crossHole.closePath();
  shape.holes.push(crossHole);
  return extrudeShape(shape, outerR, depth, 32);
}

// 12. Octahedron (sacred geometry — multifaceted truth)
function makeOctahedron(outerR: number): THREE.OctahedronGeometry {
  return new THREE.OctahedronGeometry(outerR * 1.05, 0);
}

// 13. Ankh (Egyptian "key of life") — loop + cross merged into one BufferGeometry.
// All three parts built in absolute coords (no auto-center), merged, then centered.
function makeAnkh(outerR: number, depth: number): THREE.BufferGeometry {
  // Loop sits above the cross with its center at y = +0.50
  const loopCY = outerR * 0.50;
  const loop = new THREE.Shape();
  loop.absellipse(0, loopCY, outerR * 0.42, outerR * 0.50, 0, Math.PI * 2, false, 0);
  const loopHole = new THREE.Path();
  loopHole.absellipse(0, loopCY, outerR * 0.20, outerR * 0.26, 0, Math.PI * 2, false, 0);
  loop.holes.push(loopHole);
  const loopGeo = new THREE.ExtrudeGeometry(loop, EXTRUDE_DEFAULT(outerR, depth, 20));

  // Vertical bar below the loop
  const vert = new THREE.Shape();
  const vw = outerR * 0.13;
  const vTop = outerR * 0.05;
  const vBot = -outerR * 0.95;
  vert.moveTo(-vw, vTop);
  vert.lineTo(vw, vTop);
  vert.lineTo(vw, vBot);
  vert.lineTo(-vw, vBot);
  vert.closePath();
  const vertGeo = new THREE.ExtrudeGeometry(vert, EXTRUDE_DEFAULT(outerR, depth, 4));

  // Horizontal cross-arms
  const horz = new THREE.Shape();
  const hw = outerR * 0.65;
  const hh = outerR * 0.13;
  const hY = -outerR * 0.20;
  horz.moveTo(-hw, hY + hh);
  horz.lineTo(hw, hY + hh);
  horz.lineTo(hw, hY - hh);
  horz.lineTo(-hw, hY - hh);
  horz.closePath();
  const horzGeo = new THREE.ExtrudeGeometry(horz, EXTRUDE_DEFAULT(outerR, depth, 4));

  const merged = mergeGeometries([loopGeo, vertGeo, horzGeo], false);
  loopGeo.dispose();
  vertGeo.dispose();
  horzGeo.dispose();
  if (!merged) throw new Error('ankh merge failed');
  merged.center();
  return merged;
}

// Variant A — fixed sacred-symbol mapping per node id (1..13)
function symbolGeometryFor(nodeId: number, outerR: number, depth: number): THREE.BufferGeometry {
  switch (nodeId) {
    case 1:  return makeSunburst(outerR, depth);
    case 2:  return makeEye(outerR, depth);
    case 3:  return makeYinYang(outerR, depth);
    case 4:  return makeUpwardTriangle(outerR, depth);
    case 5:  return makeTeardrop(outerR, depth);
    case 6:  return makeVesicaPiscis(outerR, depth);          // less-generic replacement for heart
    case 7:  return makeCrescent(outerR, depth);
    case 8:  return makeHexagram(outerR, depth);
    case 9:  return makeLotus(outerR, depth);
    case 10: return makeEyeInTriangle(outerR, depth);
    case 11: return makeSolarCross(outerR, depth);            // less-generic replacement for plain cross
    case 12: return makeOctahedron(outerR);
    case 13: return makeAnkh(outerR, depth);
    default: return makeSunburst(outerR, depth);
  }
}

// Variant B — generative star, deterministic per nodeId.
// Per-node: random point count (5–12), inner-radius ratio, twist, jitter, depth profile.
// All seeds are stable, so a given node always renders the same form across visits.
function generativeStarGeometry(nodeId: number, outerR: number, depth: number): THREE.ExtrudeGeometry {
  const rng = mulberry32(nodeId * 9173 + 401);
  const points = 5 + Math.floor(rng() * 8);            // 5..12 points
  const innerRatio = 0.28 + rng() * 0.32;              // 0.28..0.60
  const twist = (rng() - 0.5) * 0.45;                  // -0.22..+0.22 rad full sweep
  const jitter = 0.18;
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const isOuter = i % 2 === 0;
    const baseR = isOuter ? outerR : outerR * innerRatio;
    const r = baseR * (1 + (rng() - 0.5) * jitter);
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2 + twist * (i / (points * 2));
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: depth * (0.7 + rng() * 0.6),
    bevelEnabled: true,
    bevelThickness: depth * 0.22,
    bevelSize: outerR * 0.08,
    bevelSegments: 5,
    curveSegments: 16,
  });
  geo.center();
  return geo;
}

// ---------------------------------------------------------------------------
// Chakra color mapping — interpolates root→crown across N nodes (bottom→top)
// ---------------------------------------------------------------------------

function chakraColorForNode(i: number, total: number): THREE.Color {
  if (total <= 1) return new THREE.Color(CHAKRA_HEX[0]);
  const t = (i / (total - 1)) * (CHAKRA_HEX.length - 1); // 0..6
  const lo = Math.floor(t);
  const hi = Math.min(lo + 1, CHAKRA_HEX.length - 1);
  const f = t - lo;
  const a = new THREE.Color(CHAKRA_HEX[lo]);
  const b = new THREE.Color(CHAKRA_HEX[hi]);
  return a.lerp(b, f);
}

// ---------------------------------------------------------------------------
// Node label sprite — minimal typographic identifier
// ---------------------------------------------------------------------------
// Replaces the emoji-sprite scheme. Sleek uppercase Inter w/ wide tracking,
// soft drop-shadow for legibility against the ocean-900 background, lower
// opacity for locked nodes. Always camera-facing (Sprite billboard).

function makeLabelSprite(name: string, locked: boolean): THREE.Sprite {
  const dpr = Math.min(window.devicePixelRatio, 2);
  const w = 720;
  const h = 100;
  const c = document.createElement('canvas');
  c.width = w * dpr;
  c.height = h * dpr;
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  // Weight 400 reads cleaner than 300 at small sprite sizes; tracking still wide.
  ctx.font = '400 34px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ctx as any).letterSpacing = '0.22em';
  // Two-pass shadow for legibility: first a wide soft halo, then a tight ink shadow.
  ctx.shadowColor = 'rgba(7, 30, 34, 0.95)';
  ctx.shadowBlur = 18;
  ctx.fillStyle = 'rgba(7, 30, 34, 0)';
  ctx.fillText(name.toUpperCase(), w / 2, h / 2);
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = locked ? 'rgba(232, 228, 223, 0.62)' : 'rgba(248, 244, 238, 0.96)';
  ctx.fillText(name.toUpperCase(), w / 2, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    depthTest: false,                // labels float above all geometry
  });
  const sprite = new THREE.Sprite(mat);
  const worldWidth = 2.2;
  sprite.scale.set(worldWidth, worldWidth * (h / w), 1);
  return sprite;
}

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

export function initSpiral(
  container: HTMLElement,
  nodes: NodeData[],
  variant: SpiralVariant = 'symbols',
): () => void {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG_COLOR);
  scene.fog = new THREE.FogExp2(BG_COLOR, FOG_DENSITY);

  const w = container.clientWidth;
  const h = container.clientHeight;

  // Viewport-aware camera Z: pull in closer on mobile so nodes are legible
  // at the smaller viewport. Desktop V3 framing (Z=18) is preserved above 768px.
  const cameraZForViewport = (): number => (window.innerWidth < 768 ? 12 : 18);

  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
  camera.position.set(0, 0, cameraZForViewport());

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2.0;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cursor = 'grab';
  renderer.domElement.style.touchAction = 'none';

  // --- Post-processing: bloom for star-radiance ---
  // UnrealBloomPass amplifies the brightest emissive pixels (above threshold)
  // into a soft halo — what makes the nodes read as actual stars rather than
  // just colored shapes. Threshold tuned so only the emissive cores bloom,
  // keeping the helix line + ambient particles crisp.
  const composer = new EffectComposer(renderer);
  composer.setSize(w, h);
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(w, h),
    0.40,   // strength — subtle halo, not flooding bloom
    0.45,   // radius
    0.85,   // threshold — only the brightest pixels (cores) bloom; labels stay crisp
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  // --- Lighting ---
  scene.add(new THREE.AmbientLight(0xffffff, 1.0));
  const keyLight = new THREE.PointLight(0x119a9e, 2.2, 60);
  keyLight.position.set(8, 12, 15);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0xc9a96e, 1.0, 40);
  fillLight.position.set(-6, -4, -10);
  scene.add(fillLight);

  // --- Background substrate ---
  // Backside-facing sphere surrounds the camera. Base color is ocean-900
  // (matches scene.background, fog, and --color-ocean-900 page bg — no seam).
  // Three slow drifting aurora waves layered on top in subtle (~0.06 max)
  // amplitude paint endlessly-changing chromatic substrate. Maddie/user
  // 2026-04-25: "subtle layers of generative substrate colors that change
  // endlessly". Fog disabled on this material so the sky always reads as
  // the deep ocean the spiral hangs in, regardless of helix-line fog tinting.
  const bgUniforms = {
    uTime: { value: 0 },
    uBase: { value: new THREE.Color(BG_COLOR) },
  };
  const bgMaterial = new THREE.ShaderMaterial({
    uniforms: bgUniforms,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    fog: false,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorldDir;
      void main() {
        vUv = uv;
        vWorldDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uBase;
      varying vec2 vUv;
      varying vec3 vWorldDir;

      // Subtle chakra-spectrum hues for substrate drift. Keep saturation low
      // so the base (ocean-900) reads as the dominant tone everywhere.
      const vec3 SACRAL  = vec3(1.00, 0.40, 0.24);   // warm orange
      const vec3 HEART   = vec3(0.31, 0.82, 0.35);   // green
      const vec3 THROAT  = vec3(0.24, 0.66, 0.96);   // sky blue
      const vec3 INDIGO  = vec3(0.42, 0.30, 0.84);   // indigo
      const vec3 CROWN   = vec3(0.79, 0.49, 0.91);   // soft violet

      void main() {
        // Three independent slow waves, different spatial freqs + drift speeds.
        float t = uTime;
        float w1 = 0.5 + 0.5 * sin(vUv.y * 5.2 + t * 0.040 + vUv.x * 1.1);
        float w2 = 0.5 + 0.5 * sin(vUv.x * 3.7 - t * 0.027 + vUv.y * 1.6);
        float w3 = 0.5 + 0.5 * sin((vUv.x + vUv.y) * 2.4 + t * 0.060);
        float w4 = 0.5 + 0.5 * cos(vUv.y * 1.8 + t * 0.018 - vUv.x * 0.7);

        // Layered aurora colors. Each layer is a chakra mix modulated by a
        // wave so the chromatic identity drifts endlessly (no exact repeat
        // because the wave frequencies are coprime).
        vec3 layerA = mix(THROAT, INDIGO, w1);
        vec3 layerB = mix(HEART,  CROWN,  w2);
        vec3 layerC = mix(SACRAL, INDIGO, w3);

        vec3 aurora = layerA * 0.030
                    + layerB * 0.025
                    + layerC * 0.020;
        // Pole/equator falloff so the substrate concentrates near the horizon
        // (where the eye lingers) and fades toward zenith/nadir.
        float poleFalloff = 1.0 - pow(abs(vWorldDir.y), 2.5);
        aurora *= (0.55 + 0.45 * poleFalloff) * (0.7 + 0.3 * w4);

        gl_FragColor = vec4(uBase + aurora, 1.0);
      }
    `,
  });
  const bgGeometry = new THREE.SphereGeometry(80, 48, 24);
  const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
  bgMesh.renderOrder = -1000;     // before everything else
  scene.add(bgMesh);

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

  // Phase-colored line with vertex fade at extensions.
  // We retain BASE colors separately so the animation loop can multiply a
  // traveling-pulse mask on top — gives the spiral itself a sense of FLOW
  // (the connective tissue between nodes was previously inert; Maddie 2026-04-25
  // "the nodes & the spiral line i want it to have more life").
  const helixGeo = new THREE.BufferGeometry().setFromPoints(path);
  const helixBaseColors = new Float32Array(path.length * 3);
  const helixLiveColors = new Float32Array(path.length * 3);
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

    helixBaseColors[i * 3]     = c.r * fade;
    helixBaseColors[i * 3 + 1] = c.g * fade;
    helixBaseColors[i * 3 + 2] = c.b * fade;
    // Initialize live buffer at base; loop will modulate.
    helixLiveColors[i * 3]     = helixBaseColors[i * 3];
    helixLiveColors[i * 3 + 1] = helixBaseColors[i * 3 + 1];
    helixLiveColors[i * 3 + 2] = helixBaseColors[i * 3 + 2];
  }
  helixGeo.setAttribute('color', new THREE.BufferAttribute(helixLiveColors, 3));
  scene.add(new THREE.Line(helixGeo, new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
  })));

  // --- Orb meshes ---
  // Per Maddie's 2026-04-25 feedback, two variants ship side-by-side:
  //   variant='symbols'  →  13 unique sacred symbols spanning 8+ traditions
  //   variant='stars'    →  generative star structures with refracted-light material
  // Both honour the chakra-spectrum coloring (root→crown, bottom→top).
  const variantGeometries: THREE.BufferGeometry[] = [];
  const orbMeshes: THREE.Mesh[] = [];
  const orbGroups: THREE.Group[] = [];
  const basePositions: THREE.Vector3[] = [];
  const disposables: THREE.Material[] = [];
  const texturesToDispose: THREE.Texture[] = [];
  const animParams: OrbAnimParams[] = [];
  const nodeColorList: THREE.Color[] = [];
  const UP = new THREE.Vector3(0, 1, 0);

  // Per-node planet system — each entry is the planets orbiting that node.
  // Shared sphere/ring geometries (scaled per-instance) keep memory bounded.
  const planetMeshes: THREE.Mesh[][] = [];
  const planetParams: PlanetParam[][] = [];
  const planetRingMeshes: (THREE.Mesh | null)[][] = [];
  const sharedPlanetGeo = new THREE.SphereGeometry(1, 16, 12);
  const sharedRingGeo = new THREE.RingGeometry(1.4, 2.0, 32);

  nodes.forEach((node, i) => {
    const t = nodes.length > 1 ? i / (nodes.length - 1) : 0;
    const idx = nodePathIndex(t, path.length);
    const pos = path[idx].clone();

    const live = node.status === 'live';
    const nodeColor = chakraColorForNode(i, nodes.length);
    nodeColorList.push(nodeColor);
    const phase = node.phase;
    const pm = PHASE_MAT[phase] || PHASE_MAT.ELEVATE;
    const pa = PHASE_ANIM[phase] || PHASE_ANIM.ELEVATE;

    // Per-node geometry — symbol mapping or generative star, depending on variant
    const geo = variant === 'stars'
      // Thinner extrude so edge-on rotation doesn't read as a rectangle —
      // these are stars, not blocks. Depth 0.18 instead of 0.5.
      ? generativeStarGeometry(node.id, ORB_RADIUS, ORB_RADIUS * 0.18)
      : symbolGeometryFor(node.id, ORB_RADIUS, ORB_RADIUS * 0.18);
    variantGeometries.push(geo);

    const sheenColor = nodeColor.clone().lerp(new THREE.Color(0xffffff), 0.4);
    // Two emissive recipes:
    //   starsEmissive   — chakra color stays SATURATED (lerp 0.30) so each star
    //                     reads as its own distinct color even after bloom whitens
    //                     the core. Maddie 2026-04-25: "make the colors super
    //                     distinct / brighter" — was 0.55 (too washed).
    //   symbolsEmissive — keeps the bright-white core with a tint of chakra,
    //                     because the symbol silhouette already carries identity
    //                     and the white core lets the textures read clearly.
    const starsEmissive   = nodeColor.clone().lerp(new THREE.Color(0xffffff), 0.30);
    const symbolsEmissive = nodeColor.clone().lerp(new THREE.Color(0xffffff), 0.55);

    let mat: THREE.MeshPhysicalMaterial;
    if (variant === 'stars') {
      // Refracted-light-on-water aesthetic — Maddie's visual reference. Each star
      // is a translucent prism: light passes through, refracts at water-IOR, with
      // chromatic dispersion + iridescence painting per-node optical signatures.
      // Per-node param jitter (seeded by node.id) keeps every star optically distinct.
      const opticRng = mulberry32(node.id * 4513 + 211);
      mat = new THREE.MeshPhysicalMaterial({
        color: nodeColor,
        emissive: starsEmissive,                             // saturated chakra core (was washed white)
        emissiveIntensity: live ? 0.95 : 0.50,              // bumped — bloom + saturation = visible color
        metalness: 0.0,
        roughness: 0.06 + opticRng() * 0.08,
        transparent: true,
        opacity: live ? 0.95 : 0.78,
        transmission: 0.45 + opticRng() * 0.20,
        thickness: 0.45 + opticRng() * 0.50,
        ior: 1.33 + opticRng() * 0.20,
        dispersion: 0.6 + opticRng() * 1.8,
        attenuationColor: nodeColor,
        attenuationDistance: 1.2 + opticRng() * 1.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03 + opticRng() * 0.06,
        iridescence: 0.55 + opticRng() * 0.30,
        iridescenceIOR: 1.30 + opticRng() * 0.40,
        sheen: 0.7,
        sheenColor: sheenColor,
        sheenRoughness: 0.25,
      });
    } else {
      // Variant A — sacred symbols: keep the V3 chakra-orb material with
      // phase-driven texture maps so each tradition reads at silhouette + close-up.
      const albedoTex = generatePhaseTexture(phase, i);
      const normalTex = generatePhaseNormalMap(phase, i);
      texturesToDispose.push(albedoTex, normalTex);
      mat = new THREE.MeshPhysicalMaterial({
        color: nodeColor,
        map: albedoTex,
        normalMap: normalTex,
        normalScale: new THREE.Vector2(pm.normalStrength, pm.normalStrength),
        emissive: symbolsEmissive,                           // mostly white core with chakra tint
        emissiveIntensity: live ? 0.6 : 0.30,               // dialed back; bloom adds the radiance
        metalness: pm.metalness,
        roughness: pm.roughness,
        transparent: true,
        opacity: live ? 0.92 : 0.7,
        clearcoat: 1.0,
        clearcoatRoughness: pm.clearcoatRoughness,
        iridescence: pm.iridescence,
        iridescenceIOR: pm.iridescenceIOR,
        sheen: pm.sheen,
        sheenColor: sheenColor,
        sheenRoughness: pm.sheenRoughness,
      });
    }
    disposables.push(mat);

    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = node;
    // User 2026-04-25: "no more do we need the shape, the system below suggests
    // it". The contained interior universe (planets + their themed motion +
    // rings + dust) IS the node's identity now. The symbol/star geometry stays
    // in scene-graph as the click/hover target (it's the raycast surface that
    // makes nodes interactive) but is rendered invisible.
    mesh.visible = false;

    const group = new THREE.Group();
    group.position.copy(pos);
    group.add(mesh);

    const label = makeLabelSprite(node.name, !live);
    label.position.set(0, -(ORB_RADIUS + 0.55), 0);
    const labelMat = label.material as THREE.SpriteMaterial;
    if (labelMat.map) texturesToDispose.push(labelMat.map);
    disposables.push(labelMat);
    group.add(label);

    // --- Planet system for this node ---
    // Per-node universe is *iconologically themed*. The icon's meaning →
    // selects the universe (palette/layout/inclination/speed) so each node
    // is a coherent semantic system, not just a color-jittered template.
    const planetRng = mulberry32(node.id * 7919 + 401);
    const universe = universeFor(node.id);
    const palette: THREE.Color[] = universe.palette.map(hex => new THREE.Color(hex));

    // --- Central sun body ---
    // Now that the symbol shape is hidden, every system needs a focal point.
    // Tiny additive emissive sphere at the orb center — the "star" of this
    // contained universe, in the parent chakra colour.
    const sunMat = new THREE.MeshBasicMaterial({
      color: nodeColor.clone().lerp(new THREE.Color(0xffffff), 0.45),
      transparent: true,
      opacity: live ? 0.95 : 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    disposables.push(sunMat);
    const sun = new THREE.Mesh(sharedPlanetGeo, sunMat);
    sun.scale.setScalar(live ? 0.085 : 0.060);
    sun.renderOrder = 5;
    group.add(sun);

    // Layout-phase helper: how each planet is initially positioned around
    // the orbit. Determines whether the system reads as "free" (random
    // phases), "pair" (2 planets at 180° opposite), "cardinal" (4 at 90°),
    // or "sextet" (6 at 60° intervals).
    const layoutPhase = (p: number, n: number): number => {
      if (universe.layout === 'pair' && n === 2) return p === 0 ? 0 : Math.PI;
      if (universe.layout === 'cardinal') return (p / Math.max(1, n)) * Math.PI * 2;
      if (universe.layout === 'sextet') return (p / Math.max(1, n)) * Math.PI * 2;
      return planetRng() * Math.PI * 2;
    };

    // Inclination per universe theme — coplanar systems share an orbital
    // plane (read as a *disk*), random systems look 3D / chaotic, orthogonal
    // alternates 0/90° (crystalline / structured), cardinal sets each
    // planet on a different cardinal plane.
    const layoutInclination = (p: number, n: number): { incl: number; asc: number } => {
      switch (universe.inclination) {
        case 'coplanar':   return { incl: 0,                                    asc: 0 };
        case 'orthogonal': return { incl: (p % 2 === 0 ? 0 : Math.PI / 2),     asc: 0 };
        case 'cardinal':   return { incl: 0,                                    asc: (p / Math.max(1, n)) * Math.PI * 2 };
        case 'random':
        default:           return { incl: (planetRng() - 0.5) * Math.PI * 0.7, asc: planetRng() * Math.PI * 2 };
      }
    };

    const planetCount = universe.planetCount;
    const nodePlanets: THREE.Mesh[] = [];
    const nodePlanetParams: PlanetParam[] = [];
    const nodeRings: (THREE.Mesh | null)[] = [];
    for (let p = 0; p < planetCount; p++) {
      // Stagger orbit radii across the available range — closer-in and
      // further-out planets give visual depth to the system.
      const tRad = planetCount > 1 ? p / (planetCount - 1) : 0.5;
      const orbitRadius = PLANET_ORBIT_MIN + tRad * (PLANET_ORBIT_MAX - PLANET_ORBIT_MIN);
      const orbitSpeedRaw = PLANET_ORBIT_SPEED_MIN + planetRng() * (PLANET_ORBIT_SPEED_MAX - PLANET_ORBIT_SPEED_MIN);
      // Inner-orbit planets move faster (Kepler-ish) — modulated by universe.speedMul
      const keplerBoost = 1.0 + (1.0 - tRad) * 0.6;
      const orbitSpeed = orbitSpeedRaw * universe.speedMul * keplerBoost;
      const sizeBase    = PLANET_RADIUS_MIN + planetRng() * (PLANET_RADIUS_MAX - PLANET_RADIUS_MIN);
      const planetColor = palette[p % palette.length].clone();

      // Additive-blended emissive so the interior body GLOWS THROUGH the
      // orb's surface (translucent for stars, semi-translucent for symbols)
      // rather than getting depth-occluded by it. depthWrite:false + transparent
      // lets multiple bodies layer additively without z-fighting.
      const planetMat = new THREE.MeshBasicMaterial({
        color: planetColor.clone().lerp(new THREE.Color(0xffffff), 0.20),
        transparent: true,
        opacity: live ? 0.95 : 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposables.push(planetMat);

      const planet = new THREE.Mesh(sharedPlanetGeo, planetMat);
      planet.scale.setScalar(sizeBase);
      // Initial position on the orbital circle (loop will animate).
      planet.position.set(orbitRadius, 0, 0);
      // renderOrder so planets render after the orb mesh — additive blend
      // requires the source to render on top.
      planet.renderOrder = 5;
      group.add(planet);
      nodePlanets.push(planet);

      const inc = layoutInclination(p, planetCount);
      // Retrograde flip suppressed for structured layouts (cardinal/sextet/pair)
      // so the system reads as orderly rather than chaotic. Free + duality
      // systems can have mixed directions for visual interest.
      const allowRetrograde = universe.layout === 'free' || universe.layout === 'pair';
      const direction = allowRetrograde && planetRng() < 0.4 ? -1 : 1;

      const params: PlanetParam = {
        orbitRadius,
        orbitSpeed: orbitSpeed * direction,
        orbitPhase: layoutPhase(p, planetCount),
        inclination: inc.incl,
        ascendingNode: inc.asc,
        size: sizeBase,
        spinSpeed: (0.8 + planetRng() * 2.2) * (planetRng() < 0.5 ? -1 : 1),
        hasRing: planetRng() < universe.ringChance,
      };
      nodePlanetParams.push(params);

      // Optional saturn-style ring (~18% chance per planet).
      if (params.hasRing) {
        const ringMat = new THREE.MeshBasicMaterial({
          color: planetColor.clone().lerp(new THREE.Color(0xffffff), 0.45),
          transparent: true,
          opacity: live ? 0.85 : 0.40,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        disposables.push(ringMat);
        const ring = new THREE.Mesh(sharedRingGeo, ringMat);
        // Tilt ring slightly off the planet's equatorial plane for visibility
        ring.rotation.x = Math.PI / 2 + (planetRng() - 0.5) * 0.4;
        ring.renderOrder = 5;
        planet.add(ring);
        nodeRings.push(ring);
      } else {
        nodeRings.push(null);
      }
    }
    planetMeshes.push(nodePlanets);
    planetParams.push(nodePlanetParams);
    planetRingMeshes.push(nodeRings);

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

    // Per-node animation parameters.
    // `personality` walks 0..1 root→crown so each node has a chakra-coherent
    // motion signature visible at glance distance: root nodes feel rooted
    // (small orbit, slow rotation, gentle breath); crown nodes feel ethereal
    // (wide orbit, lively rotation, deeper breath). This is the missing piece
    // of "each node has its own environment & physics" — the per-node *physics
    // parameters* were already RNG-jittered, but uniformly. The personality
    // factor adds a *monotonic* gradient so the ascent up the spiral reads as
    // an evolution from grounded → ethereal.
    const nodeRng = mulberry32(i * 3571 + 17);
    const seed = i * 2.39;
    const personality = nodes.length > 1 ? i / (nodes.length - 1) : 0.5;
    const turbo = 0.55 + 1.00 * personality;             // 0.55 (root) → 1.55 (crown)
    const breathTurbo = 0.65 + 0.70 * personality;       // 0.65 → 1.35
    animParams.push({
      breathFreq: pa.breathFreq * (0.85 + nodeRng() * 0.3),
      breathAmp: pa.breathAmp * breathTurbo,
      breathPhase: seed * 1.7,
      emissiveBase: live ? 0.85 : 0.55,
      emissiveAmp: live ? pa.emissiveAmpLive : pa.emissiveAmpLocked,
      emissiveFreq: pa.emissiveFreq * (0.9 + nodeRng() * 0.2),
      emissivePhase: seed * 2.1,
      rotRateX: pa.rotRateX * (0.85 + nodeRng() * 0.3) * turbo,
      rotRateY: pa.rotRateY * (0.85 + nodeRng() * 0.3) * turbo,
      rotRateZ: pa.rotRateZ * (0.85 + nodeRng() * 0.3) * turbo,
      rotPhaseX: nodeRng() * Math.PI * 2,
      rotPhaseY: nodeRng() * Math.PI * 2,
      rotPhaseZ: nodeRng() * Math.PI * 2,
      orbitRadius: (ORBIT_RADIUS_MIN + nodeRng() * (ORBIT_RADIUS_MAX - ORBIT_RADIUS_MIN)) * turbo,
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

  // --- Inner shimmer particles (drift INSIDE each node — the "star core" effect) ---
  // 6 particles per orb, swirling on per-particle spherical paths inside the
  // node's local volume, additive-blended bright dots that twinkle. Bloom
  // amplifies these into shimmering star cores.
  const TOTAL_INNER = nodes.length * INNER_PARTICLES_PER_ORB;
  const innerPositions = new Float32Array(TOTAL_INNER * 3);
  const innerColors = new Float32Array(TOTAL_INNER * 3);
  const innerGeometry = new THREE.BufferGeometry();
  innerGeometry.setAttribute('position', new THREE.BufferAttribute(innerPositions, 3));
  innerGeometry.setAttribute('color', new THREE.BufferAttribute(innerColors, 3));

  const innerParams: InnerParam[] = [];
  nodes.forEach((node, i) => {
    const innerRng = mulberry32(node.id * 6131 + 53);
    const live = node.status === 'live';
    for (let j = 0; j < INNER_PARTICLES_PER_ORB; j++) {
      innerParams.push({
        radiusBase: INNER_RADIUS_MIN + innerRng() * (INNER_RADIUS_MAX - INNER_RADIUS_MIN),
        theta0: innerRng() * Math.PI * 2,
        phi0: innerRng() * Math.PI,
        thetaSpeed: (0.8 + innerRng() * 1.4) * (innerRng() < 0.5 ? -1 : 1),
        phiSpeed: (0.5 + innerRng() * 0.9) * (innerRng() < 0.5 ? -1 : 1),
        breathFreq: 0.6 + innerRng() * 1.0,
        breathAmp: 0.04 + innerRng() * 0.05,
        twinkleFreq: 1.2 + innerRng() * 2.4,
        twinklePhase: innerRng() * Math.PI * 2,
        brightnessBase: live ? (1.0 + innerRng() * 0.6) : (0.35 + innerRng() * 0.20),
      });
    }
  });

  const innerMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    map: softDotTex,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    size: INNER_PARTICLE_SIZE,
  });
  disposables.push(innerMaterial);
  scene.add(new THREE.Points(innerGeometry, innerMaterial));

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
        // Two-tier disclosure: label below the node always shows the name,
        // tooltip on hover surfaces the tagline (or lock state).
        tip.textContent = data.status === 'locked'
          ? `${data.tagline} — locked`
          : data.tagline;
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
        console.log(`[EA] action=spiral_node_click node=${data.id} name=${data.name} phase=${data.phase}`);
        window.location.href = data.url;
      }
    }
  }

  function onResize(): void {
    const ww = container.clientWidth;
    const hh = container.clientHeight;
    camera.aspect = ww / hh;
    camera.position.z = cameraZForViewport();
    camera.updateProjectionMatrix();
    renderer.setSize(ww, hh);
    composer.setSize(ww, hh);
    bloomPass.setSize(ww, hh);
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

    // Drive substrate shader uniform — generative bg layers update each frame.
    bgUniforms.uTime.value = t;

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

      // 5. Label sprite: subtle vertical bob, billboard handled by Sprite class
      const label = group.children[1];
      if (label) {
        const bob = Math.sin(t * 0.5 + seed * 1.2) * 0.02;
        label.position.y = -(ORB_RADIUS + 0.55) + bob;
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

      // 6.5. Per-orb PLANETS — local space, follow the parent group.
      // Each planet rides a tilted Keplerian-style circular orbit:
      //   x = r cos(θ)
      //   y = r sin(θ) sin(i)
      //   z = r sin(θ) cos(i)
      // then yaw by the ascending-node angle. The orbital plane is *stable*
      // per planet (so motion reads as orbit, not drift), but distinct per
      // planet so each "solar system" looks like a real system rather than
      // co-planar rings.
      const nodePlanetList = planetMeshes[i];
      const nodePlanetParamList = planetParams[i];
      for (let p = 0; p < nodePlanetList.length; p++) {
        const planet = nodePlanetList[p];
        const pp = nodePlanetParamList[p];
        const theta = pp.orbitPhase + t * pp.orbitSpeed * motionScale;
        const ct = Math.cos(theta);
        const st = Math.sin(theta);
        const ci = Math.cos(pp.inclination);
        const si = Math.sin(pp.inclination);
        const ca = Math.cos(pp.ascendingNode);
        const sa = Math.sin(pp.ascendingNode);

        // Position in orbital plane, then rotate by ascending node.
        const lx = pp.orbitRadius * ct;
        const ly = pp.orbitRadius * st * si;
        const lz = pp.orbitRadius * st * ci;

        planet.position.set(
          lx * ca - lz * sa,
          ly,
          lx * sa + lz * ca,
        );

        // Self-rotation so planets visibly spin (especially ringed ones).
        planet.rotation.y += pp.spinSpeed * 0.016 * motionScale;
      }

      // 7. Per-orb INNER shimmer particles (drift inside the star's local volume)
      for (let j = 0; j < INNER_PARTICLES_PER_ORB; j++) {
        const pIdx = i * INNER_PARTICLES_PER_ORB + j;
        const ip = innerParams[pIdx];
        const bufIdx = pIdx * 3;
        const tScaled = t * motionScale;

        const r = ip.radiusBase + Math.sin(tScaled * ip.breathFreq + ip.twinklePhase) * ip.breathAmp;
        const theta = ip.theta0 + tScaled * ip.thetaSpeed;
        const phi = ip.phi0 + tScaled * ip.phiSpeed;

        innerPositions[bufIdx]     = group.position.x + r * Math.sin(phi) * Math.cos(theta);
        innerPositions[bufIdx + 1] = group.position.y + r * Math.cos(phi);
        innerPositions[bufIdx + 2] = group.position.z + r * Math.sin(phi) * Math.sin(theta);

        // Twinkle: brightness oscillates per-particle so dots flicker like real stars
        const twinkle = ip.brightnessBase + Math.sin(tScaled * ip.twinkleFreq + ip.twinklePhase) * 0.45;
        const tint = Math.max(0.5, twinkle);
        innerColors[bufIdx]     = nc.r * tint;
        innerColors[bufIdx + 1] = nc.g * tint;
        innerColors[bufIdx + 2] = nc.b * tint;
      }
    });

    // Flush aura + inner buffers
    auraGeometry.attributes.position.needsUpdate = true;
    auraGeometry.attributes.color.needsUpdate = true;
    innerGeometry.attributes.position.needsUpdate = true;
    innerGeometry.attributes.color.needsUpdate = true;

    // Helix line traveling pulse — two phase-staggered waves walk the path
    // from bottom (root) → top (crown), modulating brightness so the spiral
    // reads as a flowing current rather than a static drawn line. Pulse
    // multiplier oscillates between ~0.55 and ~1.45 of base color.
    const pulseSpeed = 0.85;
    const waveK = 0.045;            // spatial frequency along path index
    for (let i = 0; i < path.length; i++) {
      const phase = t * pulseSpeed - i * waveK;
      const pulse = 1.0
        + 0.40 * Math.sin(phase)
        + 0.18 * Math.sin(phase * 2.3 + 1.7);
      const idx = i * 3;
      helixLiveColors[idx]     = helixBaseColors[idx]     * pulse;
      helixLiveColors[idx + 1] = helixBaseColors[idx + 1] * pulse;
      helixLiveColors[idx + 2] = helixBaseColors[idx + 2] * pulse;
    }
    helixGeo.attributes.color.needsUpdate = true;

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
    composer.render();
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
    variantGeometries.forEach(g => g.dispose());
    helixGeo.dispose();
    auraGeometry.dispose();
    innerGeometry.dispose();
    ambientGeometry.dispose();
    bgGeometry.dispose();
    bgMaterial.dispose();
    sharedPlanetGeo.dispose();
    sharedRingGeo.dispose();
    composer.dispose();
    renderer.dispose();
    tip.remove();
    renderer.domElement.remove();
  };
}
