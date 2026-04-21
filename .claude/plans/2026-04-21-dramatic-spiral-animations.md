# Plan: Dramatic Spiral — Alive, Spinning, Atmospheric

**File:** `src/components/spiral/spiral.ts` (sole modification target)  
**Repo:** `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/`

## Context

Maddie is "over the moon" with the spiral structure and content. But the scene needs to feel **alive** — visible spinning, orbital motion, floating particles, atmospheric gas/water/air feel. The current implementation is too subtle (0.06-unit drift, 0.06 rad/s rotation = invisible). Also: the spiral endpoints are visible, breaking the infinite illusion.

Maddie's optional note: nodes as "asterisks or stars" with chakra colors bottom-to-top. This is deferred as a follow-up — the animation/atmosphere pass is the priority.

## Changes

### 1. Truly infinite helix
- `PATH_EXTEND`: 0.3 → **0.85** (extends well beyond camera view)
- `FOG_DENSITY`: 0.035 → **0.065** (dissolves endpoints into background)
- Add **cubic vertex fade** on the helix line — RGB approaches black at extensions so the line itself fades before the fog boundary

### 2. Visible orb spinning (multi-axis)
Replace single-axis 0.06 rad/s with multi-axis rotation at 5-10x speed:

| Phase | X rad/s | Y rad/s | Z rad/s | Character |
|-------|---------|---------|---------|-----------|
| ELEVATE | 0.15 | 0.40 | 0.10 | Steady, Y-dominant (rev/15s) |
| ALIGN | 0.35 | 0.25 | 0.45 | Tumbling, off-axis |
| UNLOCK | 0.10 | 1.20 | 0.08 | Fast Y spin (rev/5s), crystalline |

Per-node variation: each rate ×(0.85–1.15) via seeded PRNG.

### 3. Orbital motion around helix path
Each orb traces a small orbit (0.3–0.55 unit radius) in the plane perpendicular to the helix tangent at its position. Tangent/normal/binormal computed at init via cross products.

- `DRIFT_AMP`: 0.06 → **0.18** (3x, visible at camera distance 22)
- `DRIFT_AMP_Y`: 0.04 → **0.12**
- Orbit speed: 0.25–0.55 rad/s per node
- Combined with multi-frequency drift = never-repeating composite path

### 4. Per-orb particle aura (156 points, 1 draw call)
- **12 particles per orb** using `THREE.Points` + `BufferGeometry`
- Soft dot texture (32×32 radial gradient), additive blending
- Particles orbit each orb in 3D (spherical coordinates), radius pulsing
- Live orbs: 12 bright particles. Locked orbs: 6 dim particles (rest hidden at y=-1000)
- Colors match node color with per-particle brightness pulsing
- Buffer positions updated per frame via `needsUpdate = true`

### 5. Ambient atmosphere (150 points, 1 draw call)  
- **150 background particles** spread across scene volume (30×15×15 units)
- Phase-colored (teal/cyan/gold) at 15-35% brightness
- Slow independent drift per particle (0.02–0.06 Hz)
- Creates underwater/nebula/gaseous feel between the orbs
- Same soft dot texture (reused), additive blending, 25% opacity

### 6. Performance
- **2 extra draw calls** (29 total, from 27)
- **306 total points** (trivial for any GPU)
- **~5,000 flops/frame** additional math (negligible)
- **3.6KB/frame** buffer uploads
- No new meshes, no shadows, no post-processing

## What stays unchanged
- Mobile tap fix (TAP_THRESHOLD = 30)
- Procedural textures + normal maps (per-phase)
- Phase material properties (iridescence, sheen, etc.)
- Tooltip, hover scale, raycaster intersection
- OrbitControls (drag, auto-rotate)
- Emoji sprites (camera-facing + bob)

## Implementation sequence
1. Update constants (PATH_EXTEND, FOG_DENSITY, DRIFT_AMP, new orbit/particle constants)
2. Update types (OrbAnimParams: multi-axis rotation, orbit vectors)
3. Update PHASE_ANIM (per-axis rotation rates)
4. Add `createSoftDotTexture()` function
5. Add helix tangent computation in orb creation loop
6. Update animParams construction (orbit + rotation fields)
7. Add vertex fade to helix line coloring
8. Add aura particle system init (after orb creation)
9. Add ambient particle system init
10. Rewrite animation loop (orbit + spin + aura + ambient updates)
11. Update cleanup (dispose new geometries/materials)

## Verification
```bash
npm run build && npm run deploy
```
- Orbs visibly spin on multiple axes
- Orbs trace orbital paths around their helix positions
- Floating particles surround each orb
- Background particles create atmospheric depth
- Spiral endpoints invisible (fog + vertex fade)
- Tap still navigates on mobile
- Hover tooltips still work on desktop

## Deferred (Maddie's optional note)
- Star/asterisk node geometry (replace SphereGeometry with custom star shape)
- Chakra color mapping (7 chakras → 13 nodes, requires interpolation scheme)
- Both are visual identity changes — confirm with Maddie before implementing
