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
import { type IconWorld, type ParticleBehavior, worldFor } from '../../data/icon-worlds';
import { primitiveFor, PHI, type MathPrimitive, type SymmetryType } from '../../data/sacred-geometry-primitives';
import { type Lens, modulatePrimitive } from '../../data/lens-geometry';

export type SpiralVariant = 'symbols' | 'stars';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NodeData {
  id: number;
  name: string;
  phase: string;
  pillarSlug: string;
  emoji: string;
  tagline: string;
  color: string;
  status: 'live' | 'locked';
  url: string;
  envVar: EnvVar;
  /** Spiral t-value (0..1) — computed from index at call site */
  t: number;
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
  semiMajor: number;            // a — half longest axis of elliptical orbit
  eccentricity: number;         // e — 0 = circle, 0.7 = highly elliptical
  argPeriapsis: number;         // ω — orientation of ellipse in its plane
  orbitSpeed: number;           // mean motion (rad/sec)
  orbitPhase: number;           // mean anomaly at t=0
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
const ORB_RADIUS = 0.58;             // big enough that the contained universe reads at spiral framing
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

// Materia particle field — physics-driven phase particles bouncing off the
// icon's exterior substrate. User 2026-04-25: "stars contained by bouncing
// off their env exterior substrate; icons naturally reach edges and keep
// form like birds or magnets or electronics". Each particle has thermal
// jitter (Brownian-like life) + gentle outward pressure (gas-like fill) +
// continuous raycast boundary collision against the icon's actual mesh
// surface (distributed across frames for perf). The icon shape emerges as
// the container the particles fill, not as a constraint pinned to springs.
const MATERIA_FIELD_PARTICLES = 600;
const MATERIA_FIELD_SIZE_MIN = 0.005;
const MATERIA_FIELD_SIZE_MAX = 0.026;
// Phase physics: gas diffuses fastest + bounces hardest; solid is dense + sluggish.
const PHASE_THERMAL = { solid: 0.05,  liquid: 0.20, gas: 0.55 };
const PHASE_DAMPING = { solid: 0.92,  liquid: 0.97, gas: 0.992 };
const PHASE_BOUNCE  = { solid: 0.50,  liquid: 0.70, gas: 0.95  };
// Outward radial pressure — pushes particles toward edges (gas wants to fill
// container). Stronger for gas, weaker for solid. Combined with boundary
// collision = particles distribute throughout icon volume.
const PHASE_PRESSURE = { solid: 0.10, liquid: 0.30, gas: 0.85 };
const IMPLODE_EXPLODE_FREQ = 0.32;              // rad/sec — slow breath cycle
const IMPLODE_EXPLODE_AMP = 0.18;               // gentler — bounce + pressure carry the visible motion
// Continuous icon-shape collision — distributed across frames for perf.
// Each frame, COLLISION_CHECK_FRACTION of particles per node get raycast-
// tested against the actual icon mesh; particles outside get snapped back
// to their last known inside position with reflected velocity.
const COLLISION_CHECK_FRACTION = 0.12;          // ~12% of particles per frame = ~8 fps full cycle

// Per-orb planets — each node IS a mini solar system, contained INSIDE the
// shape itself. User 2026-04-25: "the solar system is contained within the
// shape itself" + "each universe is a season, or weather, different phases of
// matter, a color wheel — obviously logically applicable to its icon
// representing". Planets orbit at radii < ORB_RADIUS, rendered with additive
// emissive material so they glow THROUGH the orb's translucent (stars) /
// semi-translucent (symbols) surface like radiant interior bodies. Bloom
// amplifies them so each shape reads as a contained universe.
// CONTAINMENT — the shape is the boundary; the universe cannot escape it.
const ORB_CONTAINMENT_R = 0.52;         // ORB_RADIUS (0.58) - small margin
const PLANET_RADIUS_MIN = 0.012;
const PLANET_RADIUS_MAX = 0.038;        // nano-to-macro spans 3.2x within bound
const PLANET_ORBIT_MIN = 0.04;          // close-in orbit
const PLANET_ORBIT_MAX = 0.20;          // raw max — clamped per-planet
const PLANET_ECCENTRICITY_MAX = 0.35;   // moderate ellipse — apoapsis stays bound
const PLANET_COUNT_BONUS_MAX = 4;       // RNG-jittered extra planets per system
const ORBIT_TRAIL_SEGMENTS = 96;        // smoothness of visible orbit ellipse

// --- Per-node universe themes ---
// Each node's interior universe is tuned to its icon's symbolic meaning. The
// theme drives planet count, layout, palette, orbital speed, and ring chance.
// Themes are *iconological*: solid matter / fluid / fire / lunar / structure
// / bloom / cardinal / crystal — each one a phase of matter or weather that
// matches what the icon represents (sunburst → dawn, water teardrop → fluid,
// hexagram → structure, octahedron → crystal, ankh → eternal cycle, etc.).
type LayoutStyle = 'free' | 'pair' | 'cardinal' | 'sextet';
type InclinationStyle = 'random' | 'coplanar' | 'orthogonal' | 'cardinal';

// PHASE — gas, liquid, solid. Each particle in a node's universe carries
// one phase. The phase determines physics behavior:
//   solid  — heavy, settles toward bottom (gravity), low elasticity bounce
//   liquid — medium gravity, fluid-like flow, moderate bounce
//   gas    — low gravity, high diffusion, high-elasticity bounce, fills empty
// User 2026-04-25: "icons are gas liquids solid universes — gas is wherever
// liquid and land aint". Multi-phase coexists in each node; phase MIX per
// materia (e.g., water = mostly liquid + some gas vapor + few solid sediment).
type PhasePhase = 'solid' | 'liquid' | 'gas';

interface PhaseParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  home: THREE.Vector3;       // spawn position inside icon — spring pulls back
  phase: PhasePhase;
  size: number;
  baseColor: THREE.Color;
}

interface PhaseMix { solid: number; liquid: number; gas: number; }

// Per-materia phase composition. Numbers are probabilities (sum to ~1.0).
const PHASE_MIX: Record<string, PhaseMix> = {
  plasma:  { solid: 0.00, liquid: 0.05, gas: 0.95 },   // mostly ionised gas
  fire:    { solid: 0.00, liquid: 0.10, gas: 0.90 },   // flame + sparks
  water:   { solid: 0.05, liquid: 0.65, gas: 0.30 },   // water + vapor + sediment
  ice:     { solid: 0.70, liquid: 0.20, gas: 0.10 },   // ice + meltwater + sublimation
  crystal: { solid: 0.85, liquid: 0.05, gas: 0.10 },   // mineral lattice + occlusion
  metal:   { solid: 0.90, liquid: 0.05, gas: 0.05 },   // dense matter, slow drift
  gas:     { solid: 0.00, liquid: 0.00, gas: 1.00 },   // pure diffusion
  organic: { solid: 0.30, liquid: 0.40, gas: 0.30 },   // balanced bloom mix
  lunar:   { solid: 0.60, liquid: 0.10, gas: 0.30 },   // dust + thin vapor
};

function pickPhase(rng: () => number, mix: PhaseMix): PhasePhase {
  const r = rng();
  if (r < mix.solid) return 'solid';
  if (r < mix.solid + mix.liquid) return 'liquid';
  return 'gas';
}

// MATERIA — the *substance* the universe is made of. Each chakra icon
// governs its env logic (universe theme + materia). Materia maps to
// concrete material parameters (size distribution, emissive intensity,
// central-body scale, dust density) so each node FEELS made of different
// stuff: plasma is bright + small, gas is diffuse + huge, crystal is
// precise + medium, ice is cool + ringed, etc.
type Materia =
  | 'plasma'   // high-energy ionised — brightest, smallest, hottest
  | 'fire'     // combustion — bright, varied size, dense dust
  | 'water'    // fluid — soft cyan, medium size, calm
  | 'ice'      // crystalline H2O — cool tint, precise, more rings
  | 'crystal'  // mineral — angular precision, big rings
  | 'metal'    // dense reflective — large bodies, fewer dust, low emissive
  | 'gas'      // diffuse — giant bodies, soft edges, lots of haze
  | 'organic'  // bloom matter — varied warm sizes, balanced
  | 'lunar';   // silvery body matter — calm, medium, low energy

interface MateriaSpec {
  sizeMul: number;        // overall size scaling for planets
  maxSizeMul: number;     // boost for the largest planets (giants)
  emissiveMul: number;    // emissive boost
  sunSize: number;        // central sun scale relative to default 0.085
  ringChanceMul: number;  // multiplier on universe.ringChance
  dustBoost: number;      // multiplier on inner-shimmer brightness
}

// Sizes are tuned so the LARGEST planet (size * sizeMul * maxSizeMul) plus
// its orbit apoapsis stays inside ORB_CONTAINMENT_R. Per-planet runtime
// clamp on semiMajor enforces this (so eccentric orbits adjust their
// semi-major axis inward when needed).
const MATERIA: Record<Materia, MateriaSpec> = {
  plasma:  { sizeMul: 0.80, maxSizeMul: 1.0, emissiveMul: 1.6, sunSize: 1.5, ringChanceMul: 0.5, dustBoost: 1.6 },
  fire:    { sizeMul: 0.85, maxSizeMul: 1.3, emissiveMul: 1.8, sunSize: 1.7, ringChanceMul: 0.3, dustBoost: 2.0 },
  water:   { sizeMul: 1.05, maxSizeMul: 1.0, emissiveMul: 0.65,sunSize: 0.9, ringChanceMul: 1.2, dustBoost: 0.9 },
  ice:     { sizeMul: 0.95, maxSizeMul: 1.0, emissiveMul: 0.85,sunSize: 0.9, ringChanceMul: 1.8, dustBoost: 1.3 },
  crystal: { sizeMul: 1.10, maxSizeMul: 1.0, emissiveMul: 0.55,sunSize: 0.7, ringChanceMul: 2.0, dustBoost: 0.5 },
  metal:   { sizeMul: 1.25, maxSizeMul: 1.3, emissiveMul: 0.45,sunSize: 0.75,ringChanceMul: 0.5, dustBoost: 0.3 },
  gas:     { sizeMul: 1.30, maxSizeMul: 1.5, emissiveMul: 0.50,sunSize: 1.3, ringChanceMul: 1.4, dustBoost: 1.4 },
  organic: { sizeMul: 1.05, maxSizeMul: 1.1, emissiveMul: 0.85,sunSize: 1.0, ringChanceMul: 0.8, dustBoost: 1.1 },
  lunar:   { sizeMul: 1.05, maxSizeMul: 1.0, emissiveMul: 0.70,sunSize: 1.0, ringChanceMul: 1.0, dustBoost: 0.7 },
};

const WORLD_SIZE_BIAS: Record<IconWorld['sizeBias'], number> = {
  micro: 0.74,
  mixed: 1.0,
  macro: 1.28,
};

const PHASE_GRAVITY_SCALE: Record<PhasePhase, number> = {
  solid: 1.15,
  liquid: 0.9,
  gas: 0.55,
};

const COHESION_PULL: Record<PhasePhase, number> = {
  solid: 1.9,
  liquid: 1.5,
  gas: 1.1,
};

const CHAOS_REPULSION: Record<PhasePhase, number> = {
  solid: 0.65,
  liquid: 0.95,
  gas: 1.35,
};

function phaseMixForWorld(world: IconWorld): PhaseMix {
  const solid = world.phaseMix.solid + world.phaseMix.plasma * 0.08;
  const liquid = world.phaseMix.liquid + world.phaseMix.plasma * 0.04;
  const gas = world.phaseMix.gas + world.phaseMix.plasma * 0.88;
  const total = solid + liquid + gas || 1;

  return {
    solid: solid / total,
    liquid: liquid / total,
    gas: gas / total,
  };
}

function blendWorldPalette(
  basePalette: THREE.Color[],
  accentPalette: number[],
  nodeColor: THREE.Color,
): THREE.Color[] {
  return accentPalette.map((accentHex, idx) => {
    const accent = new THREE.Color(accentHex ?? 0xffffff);
    const base = basePalette[idx % basePalette.length] ?? nodeColor;
    return base.clone().lerp(accent, 0.68).lerp(nodeColor, 0.18);
  });
}

function respawnChaosParticle(part: PhaseParticle, world: IconWorld): void {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 0.08;
  const lift = (Math.random() - 0.5) * 0.12;
  const burst = (0.18 + Math.random() * 0.45) * world.thermalAmpMul;

  part.pos.set(
    Math.cos(angle) * radius,
    lift,
    Math.sin(angle) * radius,
  );

  part.vel.set(
    Math.cos(angle) * burst + world.gravity.x * 0.15,
    lift * 1.6 + world.gravity.y * 0.25,
    Math.sin(angle) * burst + world.gravity.z * 0.15,
  );
}

function applyWorldBehaviorForce(
  behavior: ParticleBehavior,
  part: PhaseParticle,
  time: number,
  nodeIndex: number,
  partIndex: number,
  dt: number,
  motionScale: number,
  mode: 'cohesion' | 'chaos',
): void {
  const modeMul = mode === 'cohesion' ? 1.0 : 1.45;

  switch (behavior) {
    case 'floaty': {
      part.vel.y += Math.sin(time * 0.8 + partIndex * 0.17) * 0.05 * dt * motionScale * modeMul;
      break;
    }
    case 'crystalline': {
      const targetX = Math.sign(part.home.x || 1) * 0.18;
      const targetY = Math.round(part.home.y / 0.14) * 0.14;
      const targetZ = Math.sign(part.home.z || 1) * 0.18;
      const snap = (mode === 'cohesion' ? 1.4 : 0.75) * dt * motionScale;
      part.vel.x += (targetX - part.pos.x) * snap;
      part.vel.y += (targetY - part.pos.y) * snap;
      part.vel.z += (targetZ - part.pos.z) * snap;
      break;
    }
    case 'rising': {
      part.vel.y += (mode === 'cohesion' ? 0.18 : 0.34) * dt * motionScale;
      break;
    }
    case 'spiraling': {
      const swirl = (mode === 'cohesion' ? 0.55 : 1.15) * dt * motionScale;
      part.vel.x += -part.pos.z * swirl;
      part.vel.z += part.pos.x * swirl;
      part.vel.y += 0.05 * swirl;
      break;
    }
    case 'lattice': {
      const cell = 0.11;
      const targetX = Math.round(part.home.x / cell) * cell;
      const targetY = Math.round(part.home.y / cell) * cell;
      const targetZ = Math.round(part.home.z / cell) * cell;
      const snap = (mode === 'cohesion' ? 1.8 : 0.95) * dt * motionScale;
      part.vel.x += (targetX - part.pos.x) * snap;
      part.vel.y += (targetY - part.pos.y) * snap;
      part.vel.z += (targetZ - part.pos.z) * snap;
      break;
    }
    case 'tidal': {
      const wave = Math.sin(time * 0.9 + nodeIndex * 0.73 + partIndex * 0.031);
      part.vel.x += wave * 0.06 * dt * motionScale * modeMul;
      part.vel.z += Math.cos(time * 0.65 + partIndex * 0.029) * 0.04 * dt * motionScale * modeMul;
      break;
    }
    case 'radial-emission': {
      const rr = Math.hypot(part.pos.x, part.pos.y, part.pos.z) || 1e-6;
      const radial = (mode === 'cohesion' ? 0.08 : 0.24) * dt * motionScale;
      part.vel.x += (part.pos.x / rr) * radial;
      part.vel.y += (part.pos.y / rr) * radial;
      part.vel.z += (part.pos.z / rr) * radial;
      break;
    }
    case 'dual-gyre': {
      const dir = part.home.x >= 0 ? 1 : -1;
      const gyre = (mode === 'cohesion' ? 0.7 : 1.3) * dt * motionScale * dir;
      part.vel.x += -part.pos.z * gyre;
      part.vel.z += part.pos.x * gyre;
      part.vel.y += Math.sin(time * 1.1 + dir * partIndex * 0.05) * 0.03 * dt * motionScale;
      break;
    }
  }
}

interface NodeUniverse {
  theme: string;
  materia: Materia;
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
  1:  { theme: 'dawn',         materia: 'plasma',  planetCount: 4, speedMul: 1.20, palette: PAL.DAWN,      ringChance: 0.15, layout: 'free',     inclination: 'random'    },
  2:  { theme: 'observation',  materia: 'ice',     planetCount: 3, speedMul: 0.55, palette: PAL.COOL,      ringChance: 0.35, layout: 'free',     inclination: 'coplanar'  },
  3:  { theme: 'duality',      materia: 'metal',   planetCount: 2, speedMul: 0.90, palette: PAL.DUALITY,   ringChance: 0.00, layout: 'pair',     inclination: 'coplanar'  },
  4:  { theme: 'fire',         materia: 'fire',    planetCount: 5, speedMul: 1.65, palette: PAL.FIRE,      ringChance: 0.05, layout: 'free',     inclination: 'random'    },
  5:  { theme: 'water',        materia: 'water',   planetCount: 4, speedMul: 0.65, palette: PAL.WATER,     ringChance: 0.20, layout: 'free',     inclination: 'coplanar'  },
  6:  { theme: 'intersection', materia: 'organic', planetCount: 2, speedMul: 0.80, palette: PAL.SPRING,    ringChance: 0.00, layout: 'pair',     inclination: 'coplanar'  },
  7:  { theme: 'lunar',        materia: 'lunar',   planetCount: 3, speedMul: 0.45, palette: PAL.LUNAR,     ringChance: 0.45, layout: 'free',     inclination: 'random'    },
  8:  { theme: 'structure',    materia: 'crystal', planetCount: 6, speedMul: 0.95, palette: PAL.STRUCTURE, ringChance: 0.10, layout: 'sextet',   inclination: 'coplanar'  },
  9:  { theme: 'spring',       materia: 'organic', planetCount: 5, speedMul: 1.05, palette: PAL.SPRING,    ringChance: 0.20, layout: 'free',     inclination: 'random'    },
  10: { theme: 'clarity',      materia: 'gas',     planetCount: 3, speedMul: 1.30, palette: PAL.GOLD,      ringChance: 0.30, layout: 'free',     inclination: 'coplanar'  },
  11: { theme: 'cardinal',     materia: 'metal',   planetCount: 4, speedMul: 0.85, palette: PAL.CARDINAL,  ringChance: 0.00, layout: 'cardinal', inclination: 'coplanar'  },
  12: { theme: 'crystal',      materia: 'crystal', planetCount: 4, speedMul: 1.00, palette: PAL.CRYSTAL,   ringChance: 0.55, layout: 'free',     inclination: 'orthogonal'},
  13: { theme: 'eternity',     materia: 'plasma',  planetCount: 5, speedMul: 1.10, palette: PAL.ETERNAL,   ringChance: 0.40, layout: 'free',     inclination: 'random'    },
};
function universeFor(nodeId: number): NodeUniverse {
  return NODE_UNIVERSES[nodeId] || NODE_UNIVERSES[1];
}

const PLANET_ORBIT_SPEED_MIN = 0.45;
const PLANET_ORBIT_SPEED_MAX = 1.65;

// Ambient atmosphere — heavily populated so the space *between* systems is
// not a visual vacuum. User 2026-04-25: "empty space visually is a vacuum
// here as well — otherwise none look like anything at all". 4x density
// + larger volume so the helix sits in a populated cosmos.
const AMBIENT_PARTICLE_COUNT = 700;
const AMBIENT_VOLUME_RADIUS = 22;
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
// Lineage hash — deterministic uniqueness across all structural dimensions.
// Each planet's identity derives from nodeId + phase + pillarSlug + planetIdx
// + loadSalt. "Math proofs win" — physics-derived, not aesthetic.
// ---------------------------------------------------------------------------

function lineageHash(
  nodeId: number,
  phase: string,
  pillarSlug: string,
  planetIdx: number,
  loadSalt: number,
): number {
  let h = Math.imul(nodeId, 1664525);
  h = Math.imul(
    h ^
    phase.split('').reduce((a, c) => Math.imul(a ^ c.charCodeAt(0), 2654435761), 0),
    1664525,
  );
  h = Math.imul(
    h ^
    pillarSlug.split('').reduce((a, c) => Math.imul(a ^ c.charCodeAt(0), 2654435761), 0),
    1664525,
  );
  h = Math.imul(h ^ Math.imul(planetIdx, 6271), 1664525);
  h = Math.imul(h ^ loadSalt, 1664525);
  return (h ^ (h >>> 16)) >>> 0;
}

// Lens sequence — 7 traditions spanning Egyptian → Sanskrit → Greek → Christian
// → Jungian → Physics → Modern. NodeIndex mod 7 selects primary lens, phase
// deepens uniqueness within the phase band. Each lens transforms the ideal
// form's mathematical constraints differently (vertexCount, twist, scale, etc.).
const LENS_SEQUENCE: Lens[] = [
  'egyptian',
  'sanskrit-vedic',
  'greek-classical',
  'christian-mystical',
  'jungian',
  'physics-elemental',
  'modern-wellness',
];

function primaryLensForNode(nodeIndex: number, phase: string): Lens {
  const idx = nodeIndex % 7;
  const baseLens = LENS_SEQUENCE[idx];
  if (phase === 'ELEVATE') return idx % 2 === 0 ? baseLens : 'physics-elemental';
  if (phase === 'UNLOCK') return idx % 3 === 0 ? baseLens : 'greek-classical';
  return baseLens;
}

// Creation/destruction physics derivation.
// "one creates and one destroys, both are spectacular" — determined by energy
// density (emissiveMul/sizeMul), not aesthetics. High energy/mass = creation
// (radiation, expansion). Low = destruction (collapse, endurance, dissolution).
// Gas and organic are physics exceptions: gas fills all space (expansion
// = creation), organic = bloom/growth (creation).
function isCreationMateria(materia: Materia): boolean {
  const spec = MATERIA[materia];
  if (!spec) return false;
  const epm = spec.emissiveMul / spec.sizeMul;
  if (epm > 1.0) return true;
  if (materia === 'gas') return true;
  if (materia === 'organic') return true;
  return false;
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

// -----------------------------------------------------------------------------
// Proposal C — Mathematical Primitives Generative
// "We need to break the ideals into their primitives and figure out the mathemogic of it."
// Each node = ideal form (envVar) × all lenses × mathematical constraints. NOT fixed, NOT random.
// -----------------------------------------------------------------------------

function makeGeometryFromPrimitives(
  envVar: string,
  nodeId: number,
  outerR: number,
  depth: number,
  lens: Lens,
  hash: number,
): THREE.ExtrudeGeometry {
  const basePrim = PRIMITIVES[envVar as EnvVar];
  const modulated = modulatePrimitive(envVar as EnvVar, lens);
  const rng = mulberry32(hash);

  const vertexCount = Math.max(3, modulated.vertexCount + Math.floor((rng() - 0.5) * 4));
  const innerRatio = Math.max(
    0.1,
    Math.min(0.9, modulated.innerRatio + (rng() - 0.5) * 0.25),
  );
  const twist = Math.max(
    0,
    Math.min(1, modulated.twistFactor + (rng() - 0.5) * 0.3),
  );
  const scaleMul = modulated.scaleMul * (0.85 + rng() * 0.30);
  const fractalDepth = modulated.symmetry === 'fractal' ? 1 + Math.floor(rng() * 2) : 1;

  const shape = new THREE.Shape();

  for (let ring = 0; ring <= fractalDepth; ring++) {
    const ringScale =
      ring === 0 ? scaleMul : scaleMul * 0.65 * Math.pow(PHI, -ring * 0.5);
    const ringOffset = ring * (Math.PI / vertexCount) * 0.3;

    for (let i = 0; i < vertexCount * 2; i++) {
      const isOuter = i % 2 === 0;
      const baseR = isOuter
        ? outerR * ringScale
        : outerR * innerRatio * ringScale;

      const t = i / (vertexCount * 2);
      const angle =
        t * Math.PI * 2 - Math.PI / 2 + twist * t + ringOffset;

      const jitter = ring > 0 ? 0.08 : 0.12;
      const r = baseR * (1 + (rng() - 0.5) * jitter);

      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      if (ring === 0 && i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
  }

  shape.closePath();

  const modulatedDepth = depth * (0.7 + modulated.depthRatio * 0.5);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: modulatedDepth,
    bevelEnabled: true,
    bevelThickness: depth * 0.18,
    bevelSize: outerR * 0.06,
    bevelSegments: 4,
    curveSegments: 12,
  });

  geo.center();
  return geo;
}

// Import type for geometry generation
import type { EnvVar } from '../../data/hub.config';

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
    0.05,   // very subtle — bloom was washing all materia colors to white
    0.30,
    0.98,   // only the brightest extremes bloom
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

  // Per-node phase particle systems — each node gets its own list of
  // physics-simulated PhaseParticles plus geometry buffers for rendering.
  const nodePhaseParticles: PhaseParticle[][] = [];
  const nodePhasePositions: Float32Array[] = [];
  const nodePhaseColors: Float32Array[] = [];
  const nodePhaseGeometries: THREE.BufferGeometry[] = [];
  const nodeWorlds: IconWorld[] = [];

  // Legacy planet arrays — kept declared (empty) so animation loop's
  // forEach iterations are safe no-ops while the planet-system code is
  // disabled in favour of the phase-particle physics.
  const planetMeshes: THREE.Mesh[][] = [];
  const planetParams: PlanetParam[][] = [];
  const planetRingMeshes: (THREE.Mesh | null)[][] = [];
  const sharedPlanetGeo = new THREE.SphereGeometry(1, 8, 6);
  const sharedRingGeo = new THREE.RingGeometry(1.0, 1.2, 8);

  // Hoisted soft-dot texture — used by aura AND the per-node phase field.
  const softDotTex = createSoftDotTexture();
  texturesToDispose.push(softDotTex);

  // loadSalt fixed at init so every page load gives a fresh but stable unique
  // manifestation. Used by lineageHash for both icon geometry and planet RNG.
  const loadSalt = Math.floor(performance.now() * 1000) & 0xfffff;

  nodes.forEach((node, i) => {
    const t = nodes.length > 1 ? i / (nodes.length - 1) : 0;
    const idx = nodePathIndex(t, path.length);
    const pos = path[idx].clone();

    const live = node.status === 'live';
    const world = worldFor(node.id);
    nodeWorlds.push(world);
    const accentLeadHex =
      world.accentPalette[i % world.accentPalette.length]
      ?? world.accentPalette[0]
      ?? 0xffffff;
    const nodeColor = chakraColorForNode(i, nodes.length).lerp(new THREE.Color(accentLeadHex), 0.32);
    nodeColorList.push(nodeColor);
    const phase = node.phase;
    const pm = PHASE_MAT[phase] || PHASE_MAT.ELEVATE;
    const pa = PHASE_ANIM[phase] || PHASE_ANIM.ELEVATE;

    // Per-node geometry — symbol mapping or generative star, depending on variant.
    // Depth bumped 0.18 → 0.45 so the icon has real 3D INTERIOR volume — the
    // container that holds the universe. User 2026-04-25: "icon and inside
    // that 3dimensional perimeter a universe — the materia cant pass the icon's
    // substrate". Materia field below uses raycast inside-test against this
    // mesh so particles physically cannot escape the icon outline.
    //
    // PROPOSAL C (2026-04-26): Each node = ideal form (envVar) × lens × lineage
    // hash. Lens (structural position) transforms the mathematical constraints;
    // hash provides per-node unique jitter. NOT fixed shapes, NOT random.
    // "We fraction and factor" — 13 prime × 7 lenses = bounded possibility space.
    const nodeLens = primaryLensForNode(i, node.phase);
    const nodeHash = lineageHash(node.id, node.phase, node.pillarSlug, 0, loadSalt);
    const geo = variant === 'stars'
      ? generativeStarGeometry(node.id, ORB_RADIUS, ORB_RADIUS * 0.45)
      : makeGeometryFromPrimitives(node.envVar, node.id, ORB_RADIUS, ORB_RADIUS * 0.45, nodeLens, nodeHash);
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
    // User 2026-04-25 (revised): "each node is still an icon from the chakra —
    // that station rules its env logic; keep shape — make transparent". The
    // icon/symbol geometry returns as a *transparent vessel* — the chakra
    // station that governs the universe inside it. Material opacity dropped
    // to ~18% so the shape reads as a ghost outline / glass containment;
    // texture maps still convey identity at hover/close-up.
    // User 2026-04-25: "the container exterior is only a guide and is to be
    // removed". Vessel mesh hidden — the materia density (110 phase particles
    // bouncing inside the icon's substrate boundary) IS the icon's identity.
    // Mesh stays in scene-graph as the click/raycast target for interaction
    // and as the spawn-volume reference (raycast inside-test at init).
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
    // Per-node universe: iconologically themed character determines WHAT each
    // universe IS (materia, palette, layout, inclination). Lineage hash
    // determines HOW each planet manifests within that universe — unique per
    // planet via physics-seeded RNG. "one creates and one destroys, both are
    // spectacular" — physics (emissiveMul/sizeMul) determines which is which.
    const universe = universeFor(node.id);
    const materia = MATERIA[universe.materia];
    const creationSystem = isCreationMateria(universe.materia);
    const basePalette: THREE.Color[] = universe.palette.map((hex) => new THREE.Color(hex));
    const palette: THREE.Color[] = blendWorldPalette(basePalette, world.accentPalette, nodeColor);

    // (No central sun — it dominated bloom and obscured the system. The
    // contained particles ARE the universe.)

    const planetCount = universe.planetCount;
    const nodePlanets: THREE.Mesh[] = [];
    const nodePlanetParams: PlanetParam[] = [];
    const nodeRings: (THREE.Mesh | null)[] = [];

    for (let p = 0; p < planetCount; p++) {
      // Per-planet lineage RNG — unique seed from structural position.
      // nodeId + phase + pillarSlug + planetIdx + loadSalt = deterministic,
      // per-load, maximally unique. Every planet in every system is different.
      const planetHash = lineageHash(node.id, node.phase, node.pillarSlug, p, loadSalt);
      const planetRng = mulberry32(planetHash);

      // Stagger semi-major axis across the available range — inner + outer
      // planets give the system visible depth.
      const tRad = planetCount > 1 ? p / (planetCount - 1) : 0.5;
      const jitter = 1.0 + (planetRng() - 0.5) * 0.30;
      const semiMajorRaw =
        (PLANET_ORBIT_MIN + tRad * (PLANET_ORBIT_MAX - PLANET_ORBIT_MIN)) * jitter;
      // Eccentricity 0..PLANET_ECCENTRICITY_MAX; outer orbits tend more elliptical.
      const eccentricity =
        planetRng() * planetRng() * PLANET_ECCENTRICITY_MAX * (0.4 + tRad * 0.6);
      const argPeriapsis = planetRng() * Math.PI * 2;
      const orbitSpeedRaw =
        PLANET_ORBIT_SPEED_MIN + planetRng() * (PLANET_ORBIT_SPEED_MAX - PLANET_ORBIT_SPEED_MIN);
      // Kepler-ish: inner planets faster, outer planets slower (a^-3/2 hand-wave).
      const keplerBoost = Math.pow(0.55 / Math.max(0.1, semiMajorRaw), 0.5);
      const orbitSpeed = orbitSpeedRaw * universe.speedMul * keplerBoost;
      // Nano-to-macro size range — power-law biases toward smaller sizes;
      // outermost planet gets the materia's maxSizeMul boost for "giant" bodies.
      const sizeT = Math.pow(planetRng(), 1.6);
      const isGiant = p === planetCount - 1 && planetRng() < 0.55;
      const giantBoost = isGiant ? materia.maxSizeMul : 1.0;
      const sizeBase =
        (PLANET_RADIUS_MIN + sizeT * (PLANET_RADIUS_MAX - PLANET_RADIUS_MIN)) *
        materia.sizeMul *
        giantBoost;

      // CONTAINMENT CLAMP — apoapsis + planet body must stay inside ORB_CONTAINMENT_R.
      const safeSize = sizeBase * 1.45;
      const maxSemiMajor = Math.max(
        0.025,
        (ORB_CONTAINMENT_R - safeSize) / (1 + eccentricity),
      );
      const semiMajor = Math.min(semiMajorRaw, maxSemiMajor);

      // Unique color per planet: palette rotation + per-planet hue jitter so
      // no two planets in the same system are exact duplicates.
      const baseColor = palette[p % palette.length].clone();
      const hsl = { h: 0, s: 0, l: 0 };
      baseColor.getHSL(hsl);
      const planetColor = new THREE.Color().setHSL(
        (hsl.h + (planetRng() - 0.5) * 0.05 + 1) % 1,
        Math.min(1, hsl.s * (0.85 + planetRng() * 0.30)),
        Math.min(0.85, hsl.l * (0.85 + planetRng() * 0.30)),
      );

      // Creation/destruction material — physics determines role, not aesthetics.
      // "one creates and one destroys, both are spectacular." Creation (high
      // energy density) glows additively; destruction (collapse/endurance) is
      // dark and absorbing. Physics derivation: emissiveMul/sizeMul > 1.0, plus
      // gas (fills space = expansion = creation) and organic (bloom = creation).
      let planetMat: THREE.Material;
      if (creationSystem) {
        planetMat = new THREE.MeshBasicMaterial({
          color: planetColor.clone().lerp(new THREE.Color(0xffffff), 0.20),
          transparent: true,
          opacity: Math.min(1.0, (live ? 0.95 : 0.55) * materia.emissiveMul),
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
      } else {
        // Destruction: dark, absorbing, complementary hue. The void consuming light.
        const destHsl = { h: 0, s: 0, l: 0 };
        planetColor.getHSL(destHsl);
        const darkColor = new THREE.Color().setHSL(
          (destHsl.h + 0.5) % 1,
          Math.max(0, destHsl.s - 0.3),
          Math.max(0.05, destHsl.l - 0.4),
        );
        planetMat = new THREE.MeshStandardMaterial({
          color: darkColor,
          emissive: darkColor.clone().multiplyScalar(0.15),
          emissiveIntensity: live ? 0.3 : 0.1,
          roughness: 0.3,
          metalness: 0.4,
          transparent: true,
          opacity: Math.min(1.0, (live ? 0.85 : 0.45) * materia.emissiveMul),
          depthWrite: false,
        });
      }
      disposables.push(planetMat);

      const planet = new THREE.Mesh(sharedPlanetGeo, planetMat);
      planet.scale.setScalar(sizeBase);
      planet.position.set(semiMajor * (1 - eccentricity), 0, 0);
      planet.renderOrder = 5;
      group.add(planet);
      nodePlanets.push(planet);

      // Orbital geometry: inclination + ascending node from universe character.
      // Inclination styles: coplanar (disk), random (3D chaos), orthogonal
      // (0/90° alternating), cardinal (each planet on different cardinal plane).
      let incl = 0;
      let asc = 0;
      if (universe.inclination === 'random') {
        incl = (planetRng() - 0.5) * Math.PI * 0.7;
        asc = planetRng() * Math.PI * 2;
      } else if (universe.inclination === 'orthogonal') {
        incl = p % 2 === 0 ? 0 : Math.PI / 2;
      } else if (universe.inclination === 'cardinal') {
        asc = (p / Math.max(1, planetCount)) * Math.PI * 2;
      }
      // Retrograde suppression for structured layouts (pair/cardinal/sextet).
      const allowRetrograde = universe.layout === 'free';
      const direction = allowRetrograde && planetRng() < 0.4 ? -1 : 1;

      // Initial orbital phase: pair (180° apart), cardinal/sextet (even spread),
      // free (random from lineage hash).
      let orbitPhase = planetRng() * Math.PI * 2;
      if (universe.layout === 'pair' && planetCount === 2) {
        orbitPhase = p === 0 ? 0 : Math.PI;
      }

      const params: PlanetParam = {
        semiMajor,
        eccentricity,
        argPeriapsis,
        orbitSpeed: orbitSpeed * direction,
        orbitPhase,
        inclination: incl,
        ascendingNode: asc,
        size: sizeBase,
        spinSpeed: (0.8 + planetRng() * 2.2) * (planetRng() < 0.5 ? -1 : 1),
        hasRing: planetRng() < universe.ringChance * materia.ringChanceMul,
      };
      nodePlanetParams.push(params);

      // --- Visible orbital trail ---
      // Elliptical orbit path as an additive line. All orbits show trails
      // (math: trail is precomputed from stable orbital parameters, not from
      // real-time position — always visible regardless of eccentricity).
      const trailPts: THREE.Vector3[] = [];
      const b = semiMajor * Math.sqrt(Math.max(0, 1 - eccentricity * eccentricity));
      const cosWp = Math.cos(argPeriapsis);
      const sinWp = Math.sin(argPeriapsis);
      const ci0 = Math.cos(incl);
      const si0 = Math.sin(incl);
      const ca0 = Math.cos(asc);
      const sa0 = Math.sin(asc);
      for (let s = 0; s <= ORBIT_TRAIL_SEGMENTS; s++) {
        const ang = (s / ORBIT_TRAIL_SEGMENTS) * Math.PI * 2;
        const xe = semiMajor * (Math.cos(ang) - eccentricity);
        const ye = b * Math.sin(ang);
        const xr = xe * cosWp - ye * sinWp;
        const yr = xe * sinWp + ye * cosWp;
        const lx = xr;
        const ly = yr * si0;
        const lz = yr * ci0;
        trailPts.push(
          new THREE.Vector3(lx * ca0 - lz * sa0, ly, lx * sa0 + lz * ca0),
        );
      }
      const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPts);
      // Trail color: creation = bright additive; destruction = dark subtle trace.
      const trailColor = creationSystem
        ? planetColor.clone().lerp(new THREE.Color(0xffffff), 0.30)
        : planetColor.clone().lerp(new THREE.Color(0x000000), 0.40);
      const trailMat = new THREE.LineBasicMaterial({
        color: trailColor,
        transparent: true,
        opacity: live ? 0.18 + sizeT * 0.20 : 0.08,
        blending: creationSystem ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      });
      disposables.push(trailMat);
      const trail = new THREE.LineLoop(trailGeo, trailMat);
      trail.renderOrder = 4;
      group.add(trail);
      variantGeometries.push(trailGeo);

      // Saturn-style ring — same creation/destruction style as planet.
      if (params.hasRing) {
        const ringColor = creationSystem
          ? planetColor.clone().lerp(new THREE.Color(0xffffff), 0.45)
          : planetColor.clone().lerp(new THREE.Color(0x000000), 0.35);
        const ringMat = new THREE.MeshBasicMaterial({
          color: ringColor,
          transparent: true,
          opacity: live ? (creationSystem ? 0.85 : 0.70) : (creationSystem ? 0.40 : 0.25),
          side: THREE.DoubleSide,
          blending: creationSystem ? THREE.AdditiveBlending : THREE.NormalBlending,
          depthWrite: false,
        });
        disposables.push(ringMat);
        const ring = new THREE.Mesh(sharedRingGeo, ringMat);
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

    // --- Phase-particle physics field ---
    // Each particle has phase (gas/liquid/solid) drawn from the materia's
    // PHASE_MIX. Initial position is sampled INSIDE the icon's actual mesh
    // via raycast inside-test, so particles spawn within the substrate.
    // Per-frame physics (loop below): gravity by phase, central
    // implode/explode oscillation, container reflection bounce.
    const fieldRng = mulberry32(node.id * 9907 + 17 + loadSalt);
    const phaseMix = phaseMixForWorld(world);
    const worldSizeMul = WORLD_SIZE_BIAS[world.sizeBias];

    // Raycast setup for inside-test (mesh-local frame, mesh not yet in scene)
    mesh.matrixWorld.identity();
    geo.computeBoundingBox();
    const bbox = geo.boundingBox!;
    const bboxMin = bbox.min;
    const bboxRange = new THREE.Vector3().subVectors(bbox.max, bbox.min);
    const insideRaycaster = new THREE.Raycaster();
    const candidatePos = new THREE.Vector3();
    const probeDir = new THREE.Vector3(1, 0, 0);

    const particles: PhaseParticle[] = [];
    const fieldPositions = new Float32Array(MATERIA_FIELD_PARTICLES * 3);
    const fieldColors = new Float32Array(MATERIA_FIELD_PARTICLES * 3);

    let kept = 0;
    let attempts = 0;
    const maxAttempts = MATERIA_FIELD_PARTICLES * 12;
    while (kept < MATERIA_FIELD_PARTICLES && attempts < maxAttempts) {
      candidatePos.set(
        bboxMin.x + fieldRng() * bboxRange.x,
        bboxMin.y + fieldRng() * bboxRange.y,
        bboxMin.z + fieldRng() * bboxRange.z,
      );
      insideRaycaster.set(candidatePos, probeDir);
      const hits = insideRaycaster.intersectObject(mesh, false);
      attempts++;
      if (hits.length % 2 !== 1) continue;

      const phase = pickPhase(fieldRng, phaseMix);
      // Size: solids small+dense (stone-like), liquids medium, gases tiny+sparse
      const phaseSizeMul = phase === 'solid' ? 1.1 : phase === 'liquid' ? 0.85 : 0.55;
      const sizeT = Math.pow(fieldRng(), 1.6);
      const size = (MATERIA_FIELD_SIZE_MIN + sizeT * (MATERIA_FIELD_SIZE_MAX - MATERIA_FIELD_SIZE_MIN))
                 * materia.sizeMul * phaseSizeMul * worldSizeMul;

      // Color: palette + per-phase tint so phases READ distinctly inside one
      // node — Earth vs Saturn metaphor. Gas = brighter + desaturated (luminous
      // vapor). Solid = darker + more saturated (stone). Liquid = neutral mid.
      const baseCol = palette[kept % palette.length];
      const hsl = { h: 0, s: 0, l: 0 };
      baseCol.getHSL(hsl);
      const phaseLit = phase === 'gas' ? 0.18 : phase === 'solid' ? -0.18 : 0.02;
      const phaseSat = phase === 'gas' ? 0.65 : phase === 'solid' ? 1.10 : 0.95;
      const tinted = new THREE.Color().setHSL(
        (hsl.h + (fieldRng() - 0.5) * 0.06 + 1) % 1,
        Math.min(1, hsl.s * phaseSat * (0.85 + fieldRng() * 0.30)),
        Math.max(0.05, Math.min(0.95, (hsl.l + phaseLit) * (0.80 + fieldRng() * 0.40))),
      );

      // Initial velocity: small bias so particles have life from frame 1.
      // Phase determines magnitude (gas energetic, solid still).
      const vMag = phase === 'gas' ? 0.30 : phase === 'liquid' ? 0.15 : 0.04;
      const homePos = candidatePos.clone();
      particles.push({
        pos: candidatePos.clone(),
        vel: new THREE.Vector3(
          (fieldRng() - 0.5) * 2 * vMag + world.gravity.x * 0.12,
          (fieldRng() - 0.5) * 2 * vMag + world.gravity.y * 0.12,
          (fieldRng() - 0.5) * 2 * vMag + world.gravity.z * 0.12,
        ),
        home: homePos,
        phase,
        size,
        baseColor: tinted,
      });
      fieldPositions[kept * 3]     = candidatePos.x;
      fieldPositions[kept * 3 + 1] = candidatePos.y;
      fieldPositions[kept * 3 + 2] = candidatePos.z;
      fieldColors[kept * 3]        = tinted.r;
      fieldColors[kept * 3 + 1]    = tinted.g;
      fieldColors[kept * 3 + 2]    = tinted.b;
      kept++;
    }
    // Pad unused slots (raycast rejection couldn't fill — thin shape edges)
    for (let f = kept; f < MATERIA_FIELD_PARTICLES; f++) {
      particles.push({
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        home: new THREE.Vector3(),
        phase: 'gas',
        size: 0,
        baseColor: new THREE.Color(0, 0, 0),
      });
    }

    const fieldGeo = new THREE.BufferGeometry();
    fieldGeo.setAttribute('position', new THREE.BufferAttribute(fieldPositions, 3));
    fieldGeo.setAttribute('color', new THREE.BufferAttribute(fieldColors, 3));

    const avgFieldSize = MATERIA_FIELD_SIZE_MAX
                       * materia.sizeMul * (0.85 + materia.emissiveMul * 0.15);
    // Normal blending (NOT additive) — additive overlap was washing all
    // materia colors to white. Each particle preserves its color identity.
    // Slight alphaTest to keep dots crisp without depth-write z-conflicts.
    const fieldMat = new THREE.PointsMaterial({
      vertexColors: true,
      transparent: true,
      opacity: live ? 0.95 : 0.55,
      map: softDotTex,
      blending: THREE.NormalBlending,
      depthWrite: false,
      alphaTest: 0.05,
      sizeAttenuation: true,
      size: avgFieldSize * 5.5,
    });
    disposables.push(fieldMat);
    const fieldPoints = new THREE.Points(fieldGeo, fieldMat);
    fieldPoints.renderOrder = 4;
    group.add(fieldPoints);
    variantGeometries.push(fieldGeo);

    nodePhaseParticles.push(particles);
    nodePhasePositions.push(fieldPositions);
    nodePhaseColors.push(fieldColors);
    nodePhaseGeometries.push(fieldGeo);

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
  // (softDotTex is hoisted earlier — shared with materia field + inner shimmer)
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

  // --- Cartographic Coordinate Layer (The Fossil Record) ---
  // A subtle, low-opacity point cloud representing a global coordinate grid.
  // This satisfies the "literal map of earth history" directive.
  const COORD_COUNT = 800;
  const coordPositions = new Float32Array(COORD_COUNT * 3);
  const coordRng = mulberry32(7777);
  for (let j = 0; j < COORD_COUNT; j++) {
    const idx = j * 3;
    const r = AMBIENT_VOLUME_RADIUS * 1.2;
    const theta = coordRng() * Math.PI * 2;
    const phi = Math.acos(2 * coordRng() - 1);
    coordPositions[idx] = r * Math.sin(phi) * Math.cos(theta);
    coordPositions[idx + 1] = r * Math.cos(phi) * 0.8; // slightly flattened
    coordPositions[idx + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const coordGeo = new THREE.BufferGeometry();
  coordGeo.setAttribute('position', new THREE.BufferAttribute(coordPositions, 3));
  const coordMat = new THREE.PointsMaterial({
    color: 0xd4c4a8, // Parchment / Old-world gold
    transparent: true,
    opacity: 0.15,
    size: 0.05,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(coordMat);
  const coordPoints = new THREE.Points(coordGeo, coordMat);
  scene.add(coordPoints);

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

  // Reusable raycast helpers for per-frame icon-shape collision (used in
  // phase-particle physics). Allocated once outside the loop to avoid GC.
  const icRaycaster = new THREE.Raycaster();
  const icCandidatePos = new THREE.Vector3();
  const icProbeDir = new THREE.Vector3(1, 0, 0);

  // Variant-driven physics divergence — user 2026-04-25: "icons and stars
  // act opposite, to display a difference".
  //   symbols variant → spring force toward home (particles HOLD the icon
  //                     outline; rigid, structured, formal — like sculpture)
  //   stars variant   → no spring (particles bounce freely; explosive,
  //                     diffuse, gas-like — like a stellar nebula)
  const SYMBOL_SPRING_K = { solid: 6.0, liquid: 3.5, gas: 1.5 };
  const useSpring = variant === 'symbols';

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
        // Elliptical orbit (focus at origin). True angle from periapsis:
        //   x = a (cos E - e),  y = b sin E
        // Use mean-anomaly approximation (theta = E directly) — visually
        // indistinguishable from solving Kepler's equation, much cheaper.
        const theta = pp.orbitPhase + t * pp.orbitSpeed * motionScale;
        const b = pp.semiMajor * Math.sqrt(Math.max(0, 1 - pp.eccentricity * pp.eccentricity));
        const xe = pp.semiMajor * (Math.cos(theta) - pp.eccentricity);
        const ye = b * Math.sin(theta);
        // Rotate by argument of periapsis (orientation in orbital plane)
        const cosWp = Math.cos(pp.argPeriapsis);
        const sinWp = Math.sin(pp.argPeriapsis);
        const xr = xe * cosWp - ye * sinWp;
        const yr = xe * sinWp + ye * cosWp;
        // Apply inclination (tilt) + ascending node (yaw)
        const ci = Math.cos(pp.inclination);
        const si = Math.sin(pp.inclination);
        const ca = Math.cos(pp.ascendingNode);
        const sa = Math.sin(pp.ascendingNode);
        const lx = xr;
        const ly = yr * si;
        const lz = yr * ci;

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

      // 8. Per-orb PHASE-PARTICLE PHYSICS — gas/liquid/solid filling the icon
      // shape via thermal motion + outward pressure + boundary collision.
      // Icon shape emerges naturally because the icon mesh IS the container
      // (raycast collision against actual mesh, distributed across frames).
      const phaseList = nodePhaseParticles[i];
      const phasePos = nodePhasePositions[i];
      const phaseCol = nodePhaseColors[i];
      const phaseMesh = orbMeshes[i];                    // for raycast collision
      const node = nodes[i]!;
      const world = nodeWorlds[i] ?? worldFor(node.id);
      const dt = 1 / 60;
      // Implode/explode oscillation per node — different phase so they don't pulse in unison
      const ieT = t * IMPLODE_EXPLODE_FREQ + i * 0.45;
      const centralForce = Math.sin(ieT) * IMPLODE_EXPLODE_AMP;

      // Continuous icon-shape collision: rotate through particles ~8% per frame
      // so each particle is checked roughly every 12 frames (~5 Hz at 60fps).
      const collCount = Math.max(1, Math.floor(phaseList.length * COLLISION_CHECK_FRACTION));
      const collStart = (frame * 7919) % phaseList.length;     // pseudo-random rotation
      // Ensure mesh.matrixWorld matches the orb group's transform for raycast
      // (matrix has been updated by Three.js' render — we just need the inverse)
      // Actually the raycast probe will be in mesh-local space because we
      // construct the ray from local positions and intersect against the mesh
      // (Three.js handles matrixWorld inverse automatically).
      let solidX = 0;
      let solidY = 0;
      let solidZ = 0;
      let solidCount = 0;
      let liquidX = 0;
      let liquidY = 0;
      let liquidZ = 0;
      let liquidCount = 0;
      let gasX = 0;
      let gasY = 0;
      let gasZ = 0;
      let gasCount = 0;

      for (let j = 0; j < phaseList.length; j++) {
        const part = phaseList[j];
        if (part.size === 0) continue;
        switch (part.phase) {
          case 'solid':
            solidX += part.pos.x;
            solidY += part.pos.y;
            solidZ += part.pos.z;
            solidCount++;
            break;
          case 'liquid':
            liquidX += part.pos.x;
            liquidY += part.pos.y;
            liquidZ += part.pos.z;
            liquidCount++;
            break;
          case 'gas':
            gasX += part.pos.x;
            gasY += part.pos.y;
            gasZ += part.pos.z;
            gasCount++;
            break;
        }
      }

      const solidCX = solidCount ? solidX / solidCount : 0;
      const solidCY = solidCount ? solidY / solidCount : 0;
      const solidCZ = solidCount ? solidZ / solidCount : 0;
      const liquidCX = liquidCount ? liquidX / liquidCount : 0;
      const liquidCY = liquidCount ? liquidY / liquidCount : 0;
      const liquidCZ = liquidCount ? liquidZ / liquidCount : 0;
      const gasCX = gasCount ? gasX / gasCount : 0;
      const gasCY = gasCount ? gasY / gasCount : 0;
      const gasCZ = gasCount ? gasZ / gasCount : 0;

      const burstCycle = 3.2 + (node.id % 5) * 0.65;
      const burstPhase = (t + node.id * 0.83) % burstCycle;
      const burstWindow = !useSpring && burstPhase < 0.32 ? 1 - burstPhase / 0.32 : 0;
      const burstOriginX = Math.sin(node.id * 0.73 + t * 0.19) * 0.12;
      const burstOriginY = Math.cos(node.id * 1.11 + t * 0.13) * 0.10;
      const burstOriginZ = Math.sin(node.id * 1.91 + t * 0.17) * 0.12;
      const burstRadius = 0.24 + world.thermalAmpMul * 0.10;

      for (let j = 0; j < phaseList.length; j++) {
        const part = phaseList[j];
        if (part.size === 0) continue;
        const damp = useSpring
          ? PHASE_DAMPING[part.phase]
          : Math.min(0.998, PHASE_DAMPING[part.phase] + 0.012);
        const bounce = useSpring
          ? PHASE_BOUNCE[part.phase]
          : Math.min(0.98, PHASE_BOUNCE[part.phase] + 0.08);
        const thermalAmp = PHASE_THERMAL[part.phase] * world.thermalAmpMul * (useSpring ? 1.0 : 2.8);
        const pressure = PHASE_PRESSURE[part.phase] * (useSpring ? 0.55 : 1.1);
        const gravityScale = PHASE_GRAVITY_SCALE[part.phase] * (useSpring ? 1.0 : 1.35) * dt * motionScale;
        const centroidX = part.phase === 'solid' ? solidCX : part.phase === 'liquid' ? liquidCX : gasCX;
        const centroidY = part.phase === 'solid' ? solidCY : part.phase === 'liquid' ? liquidCY : gasCY;
        const centroidZ = part.phase === 'solid' ? solidCZ : part.phase === 'liquid' ? liquidCZ : gasCZ;

        part.vel.x += world.gravity.x * gravityScale;
        part.vel.y += world.gravity.y * gravityScale;
        part.vel.z += world.gravity.z * gravityScale;

        let neighborForceX = 0;
        let neighborForceY = 0;
        let neighborForceZ = 0;
        let alignX = 0;
        let alignY = 0;
        let alignZ = 0;
        let samples = 0;

        for (let s = 0; s < 4; s++) {
          const candidateIdx = (j + (s + 1) * (17 + i * 3) + frame * (s + 2)) % phaseList.length;
          const candidate = phaseList[candidateIdx];
          if (!candidate || candidate === part || candidate.size === 0) continue;

          const dx = candidate.pos.x - part.pos.x;
          const dy = candidate.pos.y - part.pos.y;
          const dz = candidate.pos.z - part.pos.z;
          const distSq = dx * dx + dy * dy + dz * dz + 0.0025;
          const affinity = candidate.phase === part.phase ? 1.15 : 0.6;
          const weight = affinity / (0.025 + distSq * (useSpring ? 12 : 7));

          if (useSpring) {
            neighborForceX += dx * weight;
            neighborForceY += dy * weight;
            neighborForceZ += dz * weight;
            alignX += candidate.vel.x;
            alignY += candidate.vel.y;
            alignZ += candidate.vel.z;
          } else {
            neighborForceX -= dx * weight;
            neighborForceY -= dy * weight;
            neighborForceZ -= dz * weight;
          }

          samples++;
        }

        if (useSpring) {
          part.vel.x += (centroidX - part.pos.x) * COHESION_PULL[part.phase] * 0.70 * dt * motionScale;
          part.vel.y += (centroidY - part.pos.y) * COHESION_PULL[part.phase] * 0.70 * dt * motionScale;
          part.vel.z += (centroidZ - part.pos.z) * COHESION_PULL[part.phase] * 0.70 * dt * motionScale;

          if (samples > 0) {
            part.vel.x += neighborForceX * COHESION_PULL[part.phase] * 0.22 * dt * motionScale;
            part.vel.y += neighborForceY * COHESION_PULL[part.phase] * 0.22 * dt * motionScale;
            part.vel.z += neighborForceZ * COHESION_PULL[part.phase] * 0.22 * dt * motionScale;

            part.vel.x += ((alignX / samples) - part.vel.x) * 0.18 * dt * motionScale;
            part.vel.y += ((alignY / samples) - part.vel.y) * 0.18 * dt * motionScale;
            part.vel.z += ((alignZ / samples) - part.vel.z) * 0.18 * dt * motionScale;
          }
        } else if (samples > 0) {
          part.vel.x += neighborForceX * CHAOS_REPULSION[part.phase] * 0.16 * dt * motionScale;
          part.vel.y += neighborForceY * CHAOS_REPULSION[part.phase] * 0.16 * dt * motionScale;
          part.vel.z += neighborForceZ * CHAOS_REPULSION[part.phase] * 0.16 * dt * motionScale;
        }

        // Variant-driven divergence:
        // SYMBOLS variant — spring force to home (rigid icon, sculpted form)
        // STARS   variant — no spring, only thermal+pressure (free, explosive)
        if (useSpring) {
          const k = SYMBOL_SPRING_K[part.phase];
          const hx = part.home.x - part.pos.x;
          const hy = part.home.y - part.pos.y;
          const hz = part.home.z - part.pos.z;
          part.vel.x += hx * k * dt * motionScale;
          part.vel.y += hy * k * dt * motionScale;
          part.vel.z += hz * k * dt * motionScale;
        }

        applyWorldBehaviorForce(
          world.particleBehavior,
          part,
          t,
          i,
          j,
          dt,
          motionScale,
          useSpring ? 'cohesion' : 'chaos',
        );

        // Thermal kick — Brownian-like jitter giving life. Gas jitters most.
        part.vel.x += (Math.random() - 0.5) * 2 * thermalAmp * dt * motionScale;
        part.vel.y += (Math.random() - 0.5) * 2 * thermalAmp * dt * motionScale;
        part.vel.z += (Math.random() - 0.5) * 2 * thermalAmp * dt * motionScale;

        // Outward radial pressure — pushes particles toward the icon's edges
        // (gas wants to fill its container). Suppressed for symbols (spring
        // already holds them; double force = jitter without form).
        const rr = Math.sqrt(part.pos.x * part.pos.x + part.pos.y * part.pos.y + part.pos.z * part.pos.z) || 1e-6;
        const rNorm = Math.min(1, rr / ORB_CONTAINMENT_R);
        const pmag = (useSpring ? 0.25 : 1.0) * pressure * (1.0 - rNorm) * dt * motionScale;
        part.vel.x += (part.pos.x / rr) * pmag;
        part.vel.y += (part.pos.y / rr) * pmag;
        part.vel.z += (part.pos.z / rr) * pmag;

        // Implode/explode central oscillation — node-wide breath
        const cf = centralForce * dt * motionScale;
        part.vel.x += (-part.pos.x / rr) * cf;
        part.vel.y += (-part.pos.y / rr) * cf;
        part.vel.z += (-part.pos.z / rr) * cf;

        if (!useSpring && burstWindow > 0) {
          const bdx = part.pos.x - burstOriginX;
          const bdy = part.pos.y - burstOriginY;
          const bdz = part.pos.z - burstOriginZ;
          const burstDist = Math.hypot(bdx, bdy, bdz) || 1e-6;
          const burstReach = Math.max(0, 1 - burstDist / burstRadius);
          const burstKick = burstWindow * burstReach * 3.2 * dt * motionScale;
          part.vel.x += (bdx / burstDist) * burstKick;
          part.vel.y += (bdy / burstDist) * burstKick;
          part.vel.z += (bdz / burstDist) * burstKick;
        }

        if (!useSpring && Math.random() < 0.0012 * world.thermalAmpMul) {
          const rareKick = 0.10 + 0.18 / Math.max(0.12, Math.random());
          part.vel.x += (Math.random() - 0.5) * 2 * rareKick * motionScale;
          part.vel.y += (Math.random() - 0.5) * 2 * rareKick * motionScale;
          part.vel.z += (Math.random() - 0.5) * 2 * rareKick * motionScale;
        }

        // Integrate
        part.pos.x += part.vel.x * dt * motionScale;
        part.pos.y += part.vel.y * dt * motionScale;
        part.pos.z += part.vel.z * dt * motionScale;

        // Outer sphere safety — never let particles escape the bounding sphere
        const r2 = Math.sqrt(part.pos.x * part.pos.x + part.pos.y * part.pos.y + part.pos.z * part.pos.z);
        const limit = ORB_CONTAINMENT_R - part.size;
        if (r2 > limit) {
          if (useSpring) {
            const nx = part.pos.x / r2;
            const ny = part.pos.y / r2;
            const nz = part.pos.z / r2;
            const vDotN = part.vel.x * nx + part.vel.y * ny + part.vel.z * nz;
            if (vDotN > 0) {
              part.vel.x -= (1 + bounce) * vDotN * nx;
              part.vel.y -= (1 + bounce) * vDotN * ny;
              part.vel.z -= (1 + bounce) * vDotN * nz;
            }
            part.pos.x = nx * limit;
            part.pos.y = ny * limit;
            part.pos.z = nz * limit;
          } else {
            respawnChaosParticle(part, world);
          }
        }

        // Damping
        part.vel.x *= damp;
        part.vel.y *= damp;
        part.vel.z *= damp;

        // Continuous icon-shape collision — distributed across frames.
        // If this particle is up for raycast this frame, test it against
        // the icon mesh. If outside, snap to home + reflect velocity.
        const collIdx = (j - collStart + phaseList.length) % phaseList.length;
        if (collIdx < collCount && phaseMesh) {
          icCandidatePos.copy(part.pos);
          icRaycaster.set(icCandidatePos, icProbeDir);
          const hits = icRaycaster.intersectObject(phaseMesh, false);
          if (hits.length % 2 !== 1) {
            if (useSpring) {
              // Outside icon — snap back to home + reflect velocity inward
              part.pos.copy(part.home);
              const toCenter = part.pos.length() || 1;
              const inwardX = -part.pos.x / toCenter;
              const inwardY = -part.pos.y / toCenter;
              const inwardZ = -part.pos.z / toCenter;
              const vMag = Math.sqrt(part.vel.x * part.vel.x + part.vel.y * part.vel.y + part.vel.z * part.vel.z);
              const inwardSpeed = vMag * 0.6 * bounce;
              part.vel.x = inwardX * inwardSpeed + (Math.random() - 0.5) * 0.05;
              part.vel.y = inwardY * inwardSpeed + (Math.random() - 0.5) * 0.05;
              part.vel.z = inwardZ * inwardSpeed + (Math.random() - 0.5) * 0.05;
            } else {
              respawnChaosParticle(part, world);
            }
          }
        }

        const bi = j * 3;
        phasePos[bi]     = part.pos.x;
        phasePos[bi + 1] = part.pos.y;
        phasePos[bi + 2] = part.pos.z;
        const speed = Math.sqrt(part.vel.x * part.vel.x + part.vel.y * part.vel.y + part.vel.z * part.vel.z);
        const glow = useSpring
          ? 0.88 + Math.min(0.32, speed * 0.45)
          : 0.95 + Math.min(0.75, speed * 0.55 + burstWindow * 0.55);
        phaseCol[bi] = Math.min(1, part.baseColor.r * glow);
        phaseCol[bi + 1] = Math.min(1, part.baseColor.g * glow);
        phaseCol[bi + 2] = Math.min(1, part.baseColor.b * glow);
      }
      nodePhaseGeometries[i].attributes.position.needsUpdate = true;
      nodePhaseGeometries[i].attributes.color.needsUpdate = true;
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
