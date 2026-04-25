# Spiral V4 — Dual Variants + Sleek Pass

**Date:** 2026-04-25
**Session:** dual-variant build off Maddie's 2026-04-25 message
**Repo:** `organvm-iii-ergon/sovereign-systems--elevate-align`
**Outcome:** Shipped — production live at `https://sovereign-systems-spiral.pages.dev/?variant=symbols` and `?variant=stars`
**Commits:** `b8d105b`, `19c6339`, `b6c9cdd` (all pushed to `main`)

## Why

Maddie's iMessage thread on 2026-04-25 (mirrored at `docs/maddie/2026-04-25-message-spiral-feedback.pdf`) green-lit BOTH design directions that had been on the table:

1. **Proposal A — sacred symbols across traditions.** "Absolutely love the each symbol being from a different religion — chefs kiss !!!" — but the cross + heart specifically read as "generic." Wanted "more traditional/stoic" replacements OR convert those two slots to glowing orbs with sparkles.
2. **Proposal B — generative star structures.** "Omg okay I think you read my brain !!! ... am obsessed with that idea WOW." Visual reference: "obsessed with stars lately and how they're all different but essentially just look like refracted light on water."

User reply ("kinda wanna see both lol") locked in: ship BOTH so Maddie can compare.

Color tweak in same message: "another shade of orange instead of three purple" + "lighten the most top purple."

## What shipped

### Variant A — sacred symbols (`?variant=symbols`, default)

13 unique extruded shapes spanning Egyptian, Christian, Islamic, Jewish, Hindu, Buddhist, Taoist, Pythagorean, Celtic, Masonic traditions. The two flagged "generic" symbols replaced:

- Node 6 (was Heart) → **Vesica piscis** (mandorla — mystical-union almond from Christian/Hindu/Sufi traditions)
- Node 11 (was Equal-arm cross) → **Solar cross** (cross-in-circle, Celtic/pre-Christian sun-wheel)

Other nodes: sunburst, Eye of Horus, yin-yang, upward triangle, teardrop, crescent moon, hexagram, lotus rosette, eye-in-triangle, octahedron, ankh.

Ankh assembled via `mergeGeometries` (loop + vertical bar + crossbar fused into one BufferGeometry, so the renderer treats every node as a single mesh).

### Variant B — generative refracted-light stars (`?variant=stars`)

Per-node procedural geometry seeded by `node.id`:
- 5–12 points (random per node)
- Inner-radius ratio 0.28–0.60
- Per-vertex jitter ±18%
- Twist 0–0.45 rad
- Bevel segments 5, curve segments 16

Material: `MeshPhysicalMaterial` with the optical stack that translates "refracted light on water":
- `transmission` 0.55–0.75 (dialed back from initial 0.78–0.93 in sleek pass so chakra color sings)
- `ior` 1.33–1.53 (water-to-glass)
- `dispersion` 0.6–2.4 (chromatic aberration at edges)
- `iridescence` 0.55–0.85 with `iridescenceIOR` 1.30–1.70
- `attenuationColor` = nodeColor (light tinted as it passes through)
- `clearcoat` 1.0
- `emissiveIntensity` 0.85 live / 0.45 locked (stars need to RADIATE)

### Color ramp

8 stops (was 7). Added a red-orange between root and sacral; lightened the crown violet. Math: with `t = (i / 12) * (N-1)`, going N=7→N=8 shifts node 11 from `t=5.0` (pure indigo) to `t=5.83` (mostly sky-blue). Only nodes 12–13 now sit in the violet half — addresses "three purples" pushback.

```ts
const CHAKRA_HEX = [
  0xff3b3b,  // 1 root        — red
  0xff6a3c,  // 2 root-sacral — red-orange (added)
  0xff9a3c,  // 3 sacral      — orange
  0xffd23b,  // 4 solar       — yellow
  0x4ed158,  // 5 heart       — green
  0x3da9f5,  // 6 throat      — sky blue
  0x6c4cd6,  // 7 third eye   — indigo
  0xc97ce8,  // 8 crown       — lightened violet
];
```

### Sleek pass (commit `b6c9cdd`)

User feedback after first V4 deploy: "still wrapping emojis ... lofi ... we want sleek and sexy and minimal; we need to solve for the lack of node clarity upon looking upon it."

- **`makeEmojiSprite` deleted.** No `node.emoji` references anywhere in the renderer. Bright-white glyphs that were dominating each node's silhouette → eliminated.
- **`makeLabelSprite` added.** Uppercase Inter 400 with 0.22em letter-spacing, two-pass shadow (wide soft halo at blur=18 + tight ink shadow at blur=6), positioned 0.55 below each node, always visible. Locked nodes get 62%-alpha tone. World width 2.2 units. This is the at-a-glance node-clarity solve.
- **Tooltip surfaces tagline** instead of duplicating the name. Two-tier disclosure: name below the node, tagline on hover.
- **`ORB_RADIUS` 0.4 → 0.55** for stronger silhouette presence.
- **Smoother extrudes:** default `bevelSegments` 2→4, `curveSegments` 8→16; generative-star bevelSegments 3→5.

## Variant switch

`SpiralIsland.astro` reads `?variant=` from the URL and passes to `initSpiral(container, nodes, variant)`. Default = symbols. Both variants share the same animation loop, particle systems, raycaster, helix path — only the per-node geometry + material branch on variant.

## Files touched

- `src/components/spiral/spiral.ts` (339 insertions, 45 deletions in V4 commit; 68 insertions, 41 deletions in sleek-pass commit)
- `src/components/spiral/SpiralIsland.astro` (variant query-param wiring)
- `docs/client-decisions/2026-04-25-maddie-spiral-v4-direction.md` (committed in `19c6339`)
- `docs/maddie/2026-04-25-message-spiral-feedback.pdf` (mirrored from `~/Desktop/`)

## Deploy state

CI auto-deploy still broken (GH#52, CF API token expired since Apr 19). All deploys this session manual via `npx wrangler pages deploy dist --project-name=sovereign-systems-spiral --branch=main`. Final deploy: `https://2eefd3f5.sovereign-systems-spiral.pages.dev` aliased to production `sovereign-systems-spiral.pages.dev`. Bundle hash on prod confirmed via curl (`spiral.B6ppDQ1Z.js` contains `"0.22em"` letter-spacing string from sleek pass).

## Pending

- Maddie verifies on her phone (mobile) and picks A/B/blend
- GH#52 unblock CI
- GH#3 wire `elevatealign.com` custom domain on CF Pages
- GH#49 affiliate URLs from Maddie this weekend
- Filter page (Maddie greenlit as CTA freebie) — needs audit + deploy

## IRF

- DONE-443 — V4 dual variants + sleek pass shipped (this session)
