# Plan — Maddie's Spiral: Chakra Stars + Round 2 Lightening

**Date:** 2026-04-25
**Project:** `sovereign-systems--elevate-align` (Maddie / Elevate Align)
**Repo path:** `~/Workspace/organvm/sovereign-systems--elevate-align`
**Status:** Pending approval

---

## Context

Maddie sent fresh notes on the spiral hero (Three.js helix at `/`). Two asks:

1. **Spiral still feels dark** — *"is there a way we can lighten the spiral so it pops a lil more maybe!?"*
   - The 2026-04-23 lightening pass (commit `cdd046e`) is already pushed to `main` and auto-deployed via Cloudflare Pages. So she has seen the lightened version and **still** finds it dark — round 2 is needed, not a redeploy.

2. **Nodes as chakra-colored stars** — *"doing the nodes as asterisks or stars that match the colors of the chakras from bottom to top"*
   - Currently: 13 sphere orbs (`SphereGeometry`, `spiral.ts:529`) with emoji sprites and 4-phase hex colors (`#119a9e` / `#8cc5d3` / `#c9a96e` / `#3dbfc4`).
   - Target: each node renders as a star shape, colored along the chakra spectrum, root (red) at bottom → crown (violet) at top.

**Outcome:** a perceptibly brighter spiral whose 13 nodes form a vertical rainbow reading as "ascent through the chakras" — visual coherence with the wellness/sovereignty brand.

---

## Approach

### Phase A — Replace orb geometry with 3D star

- **File:** `src/components/spiral/spiral.ts`
- Add helper near the existing `makeEmojiSprite` (around line 420):
  ```ts
  function makeStarGeometry(outerR: number, innerR: number, depth: number, points = 5): THREE.ExtrudeGeometry {
    const shape = new THREE.Shape();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: depth * 0.15,
      bevelSize: outerR * 0.08,
      bevelSegments: 2,
      curveSegments: 6,
    });
    geo.center();
    return geo;
  }
  ```
- **Replace** `spiral.ts:529`:
  ```ts
  // OLD: const sharedGeo = new THREE.SphereGeometry(ORB_RADIUS, ORB_SEGMENTS, ORB_SEGMENTS);
  const sharedGeo = makeStarGeometry(ORB_RADIUS, ORB_RADIUS * 0.45, ORB_RADIUS * 0.5, 5);
  ```
- The star inherits the existing `MeshPhysicalMaterial` (line 557): clearcoat, iridescence, sheen, emissive — all carry over and now render across faceted star surfaces (more glint than spheres).
- Star is shared geometry across all nodes (same `sharedGeo` pattern). Per-node rotation/animation already varies via `animParams` (lines 603–627), so the stars will not look static.
- Click/hover routing unchanged — `mesh.userData = node` (line 579) still attaches.

### Phase B — Chakra color mapping (bottom → top)

- Add to constants block (~line 96 of `spiral.ts`):
  ```ts
  // 7-chakra palette — root → crown, tuned for visibility against the lightened teal background
  const CHAKRA_HEX: number[] = [
    0xff3b3b, // 1 root      — red
    0xff8a3c, // 2 sacral    — orange
    0xffd23b, // 3 solar     — yellow
    0x4ed158, // 4 heart     — green
    0x3da9f5, // 5 throat    — sky blue
    0x6c4cd6, // 6 third eye — indigo
    0xb04ad8, // 7 crown     — violet
  ];

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
  ```
- In the `nodes.forEach` loop at `spiral.ts:539`, replace:
  ```ts
  // OLD: const nodeColor = new THREE.Color(node.color);
  const nodeColor = chakraColorForNode(i, nodes.length);
  ```
- Index 0 = bottom of helix = red. Index 12 = top = violet. Sequence is already correct because `nodePathIndex(t, path.length)` walks the helix in order.
- `node.color` from `hub.config.ts` becomes informational — still used by the helix line gradient (line 505, phase-based, kept) and node detail pages. Don't touch `hub.config.ts`.

### Phase C — Round 2 lightening

| Constant | Where | Current | New | Rationale |
|---|---|---|---|---|
| `BG_COLOR` | line 84 | `0x0a2d33` | `0x14525d` | Lighter teal — bigger headroom for chakra stars |
| `FOG_DENSITY` | line 85 | `0.050` | `0.035` | Less aerial dimming on mid/upper nodes |
| `renderer.toneMappingExposure` | line 467 | `1.6` | `1.85` | Just below ACES wash-out point |
| `AmbientLight` intensity | line 473 | `0.65` | `0.85` | More base illumination |
| Locked node `emissiveIntensity` | line 563 | `0.2` | `0.35` | Locked chakras (mostly upper half) stay readable |
| Locked node `opacity` | line 567 | `0.3` | `0.45` | Visible from default camera distance (22u) |
| Helix line `opacity` | line 525 | `0.45` | `0.6` | Reinforce spiral structure against lighter bg |

The locked-node bump matters: chakras 4–7 (heart, throat, third-eye, crown) sit on nodes 6–13, of which **8 are locked**. Without that bump, the upper rainbow will read as muted while the lower chakras pop — exact opposite of "ascent."

### Phase D — Emojis

**Keep them.** Each node's emoji (`✦ 🧬 ⚖️ 🛡️ 🌊 🕊️ 🌙 🔮 ✨ 📣 🚧 💠 ⚡`) carries node identity used elsewhere (node detail pages, OG images). The emoji sprite (line 585) already renders alpha-transparent on top of the orb material — same overlay pattern works for stars. The colored star reads as the chakra mark; the emoji reads as the node theme.

If Maddie later says she wants pure stars without emoji glyphs, that's a one-line change at line 585 (comment out `group.add(emoji)`).

---

## Critical Files

| File | Lines touched | Change |
|---|---|---|
| `src/components/spiral/spiral.ts` | 84–117, 420–443, 467–479, 525, 528–578 | Star helper + chakra helper + lightening constants + geometry swap + color swap |
| `src/data/hub.config.ts` | none | Phase colors stay; informational only for spiral now |

Existing utilities reused (no new abstractions):
- `MeshPhysicalMaterial` (line 557) — star inherits all material properties
- `makeEmojiSprite` (line 424) — kept for emoji overlay
- `mulberry32` (line 182) — per-node animation seed unchanged
- Aura particle system (line 630+) — unchanged; particles still take `nodeColor`, so they'll auto-pickup chakra colors

---

## Verification

1. **Local dev preview:**
   ```bash
   cd ~/Workspace/organvm/sovereign-systems--elevate-align
   npm run dev
   ```
   Open http://localhost:4321 and confirm:
   - 13 stars (5-point) render in place of spheres
   - Bottom-most star is red, top-most is violet, smooth gradient between
   - Spiral is visibly brighter than current `elevatealign.com`
   - Locked nodes are dimmer than live but still distinguishable
   - Click on a star → still navigates to the correct node URL
   - Auto-rotate, drag-to-orbit, pinch-zoom all still work
2. **Side-by-side screenshot:** capture `before.png` (current production) and `after.png` (local) for Maddie. Save to `docs/handoff-maddie-spiral-2026-04-25.md`.
3. **Build sanity:**
   ```bash
   npm run build
   ```
   Confirm no TS errors and `dist/` produces.
4. **Deploy + send:** push to `main`, Cloudflare auto-deploys. Reply to Maddie with the live link and the side-by-side. Phrasing: *"lightened it more + chakras going bottom-up — pop level right? lmk if any node should be a different shade."*
5. **Memory update on close:** update `project_artifact_spiral_maddie.md` with new state (chakra stars deployed, awaiting Maddie's reaction) — keeps the artifact memory current.

---

## What I deliberately did **not** do

- **Did not change `hub.config.ts` `color` fields.** Those still drive the pillar/node detail pages where 4-phase color identity matters editorially. Spiral now uses chakra colors locally; everywhere else keeps phase colors. If Maddie wants chakras everywhere, that's a separate (larger) brand-system pass.
- **Did not propose an asterisk (thin-line) shape.** A 5-point star reads as "star" at every viewport size; thin asterisks lose definition at distance and on mobile, especially against a colored background. Maddie wrote "asterisks **or** stars" — picking the more legible of the two.
- **Did not bump exposure past 1.85.** ACES filmic tone mapping starts to wash highlights past ~2.0; further lightening should come from background and emissive, not exposure.

---

## After plan approval

1. Persist this plan into the project's plans dir per CLAUDE.md plan discipline:
   ```bash
   mkdir -p ~/Workspace/organvm/sovereign-systems--elevate-align/.claude/plans
   cp /Users/4jp/.claude/plans/notes-from-maddie-really-zippy-hoare.md \
      ~/Workspace/organvm/sovereign-systems--elevate-align/.claude/plans/2026-04-25-maddie-spiral-chakra-stars-round2-lightening.md
   ```
2. Implement Phase A → B → C → D in `spiral.ts`.
3. Verify locally (dev server + screenshot).
4. Commit + push (Cloudflare auto-deploys).
5. Send Maddie the live link with the comparison.
