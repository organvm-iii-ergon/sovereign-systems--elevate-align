# Corrective Plan: Sovereign Systems Spiral — Fundamental Realignment

## Context

Maddie's feedback (iMessage thread 2026-04-20 + 6:16 voice memo) plus Anthony's repeated provision of a Three.js 3D helix prototype reveal three fundamental misses in the current build:

1. **The spiral renderer is the wrong technology and geometry.** We built a flat 2D Canvas Archimedean spiral (top-down view, golden-angle phyllotaxis). The client's vision — demonstrated repeatedly via a working Three.js prototype — is a **3D rotating helix** with drag-to-rotate OrbitControls, tapered radius, hover tooltips, and click interaction. This is not an aesthetic tweak; it's a full renderer replacement.

2. **12 of 13 node names are wrong.** The codebase has placeholder names that were never updated to Maddie's confirmed list.

3. **The water section and funnel architecture don't match Maddie's described flow.** She wants: water education → ZIP-based water report → filter recommendations (affiliate) → quiz that places users into GHL branches. Single scrollable page, not multi-page.

The Three.js HTML prototype is a **starting point for elevation**, not a finished component. We adapt its geometry, interaction model, and 3D rendering approach into the Astro site's architecture, ocean theme, and production standards.

---

## What Changes

### 1. Spiral Renderer: Three.js 3D Helix (replaces Canvas 2D)

**Current:** `src/components/spiral/spiral.ts` — 346-line vanilla Canvas 2D with Perlin noise, golden-angle flat spiral.

**New:** Three.js-based 3D helix renderer adapted from the provided prototype.

**From the prototype we keep:**
- Three.js scene/camera/renderer pattern
- `OrbitControls` for drag-to-rotate interaction
- Tapered helix geometry: `r = 2.5 + sin(p * PI) * 3.5` (wider in middle, narrow at ends)
- 4.5 turns, 512-point path resolution
- Raycaster-based hover detection + click handling
- Sprite-based node markers

**What we elevate:**
- Background: `#FDFDFB` (light) → `#071e22` (ocean-900 dark theme)
- Helix line: black → teal (`#119a9e`) at ~0.3 opacity, or gold (`#c9a96e`) accent
- Node markers: colored asterisk sprites → custom sprites with emoji + phase-colored glow rings (matching existing design language)
- Data source: hardcoded 14-item array → reads from `hub.config.ts` (13 nodes)
- Click behavior: inline modal → navigate to node URL (`window.location.href = node.url`)
- Tooltip: black box → styled to match site glass-card aesthetic
- Camera position: tuned for the 13-node helix dimensions
- Helix parameters: adjusted for 13 nodes (possibly 3-3.5 turns instead of 4.5)
- Add subtle auto-rotation when idle (slow Y-axis spin, stops on user interaction)
- Node size: live nodes slightly larger than locked nodes; locked nodes use dashed ring texture
- Add phase color bands along the helix path (ELEVATE teal → ALIGN blue → UNLOCK gold)
- Responsive: helix fills the hero container, OrbitControls touch-enabled for mobile

**Files to modify/create:**
- `npm install three` (add dependency)
- `src/components/spiral/spiral.ts` → **full rewrite** using Three.js
- `src/components/spiral/SpiralIsland.astro` → update to dynamically import Three.js module
- `src/components/spiral/SpiralFallback.astro` → rewrite: show all 13 nodes as vertical card list (not 4 pillars)
- Remove Perlin noise code (Three.js handles organic motion via OrbitControls damping + optional auto-rotation)

**Key implementation detail — Astro + Three.js integration:**
```
SpiralIsland.astro:
  - Contains a <canvas> or <div> mount point
  - Script tag with type="module" and client:idle or client:visible
  - Dynamically imports spiral.ts which imports from 'three'
  - Passes node data as JSON via data attribute or inline script
  - Three.js only loads on desktop (media query or JS check)
  - Mobile gets SpiralFallback (server-rendered, zero JS)
```

### 2. Node Names: Fix All 13

**File:** `src/data/hub.config.ts` lines 102-119

| # | Current (WRONG) | Correct (Maddie confirmed) |
|---|----------------|---------------------------|
| 1 | Feel Good First | Feel Good First |
| 2 | Your Body | Awareness |
| 3 | Regulate | Regulation |
| 4 | Non Negotiable | Elevate |
| 5 | Water | Root Healing |
| 6 | Emotional Terrain | Responsibility (with Love) |
| 7 | Nervous System | Unbecoming |
| 8 | Mental Clarity | Alignment |
| 9 | Purpose | The Becoming |
| 10 | Voice | Awakening |
| 11 | Boundaries | Integrate |
| 12 | Income Systems | Authenticate |
| 13 | Leverage | Unlock |

Also update taglines to match the new names where they reference old names.

### 3. Phase Model Update

**Current phases:** `'ELEVATE' | 'INNER' | 'IDENTITY' | 'FINANCIAL'`
**Framework phases:** Elevate, Align, Unlock (3 phases, not 4)

Update the `Phase` type and node assignments:
```typescript
export type Phase = 'ELEVATE' | 'ALIGN' | 'UNLOCK';

// ELEVATE: nodes 1-5 (body — Physical Sovereignty)
// ALIGN: nodes 6-11 (mind + life — Inner + Identity Sovereignty)  
// UNLOCK: nodes 12-13 (freedom — Financial Sovereignty)
```

The Four Pillars (Physical, Inner, Identity, Financial) remain as the sovereignty domain model. The three phases (Elevate, Align, Unlock) are the journey framework. They coexist — pillars describe WHAT, phases describe HOW.

**File:** `src/data/hub.config.ts` — update Phase type and node phase assignments.

### 4. Homepage: Four Phases Section

Per Maddie: "I'd imagine it's perfect with the four phases & elevate align unlock framework blurb/breakdown underneath it"

**File:** `src/pages/index.astro` lines 69-81

- Keep the "Four Phases of Sovereignty" section with 4 pillar cards
- Add an "Elevate / Align / Unlock" framework description below the pillar grid
- Brief blurb explaining the three-phase journey and how it maps to the spiral
- This section stays below the spiral hero (below the fold)

### 5. Water Section: Single Scrollable Page

Per Maddie: "C I think" (option C: branches accessible only from the water page)

**Current:** 4 separate pages (`/water/`, `/water/explore`, `/water/quiz`, `/water/[slug]`)
**New:** Single `/water/` page with inline sections

**File:** `src/pages/water/index.astro` — expand into consolidated experience:
1. Hero: Why water matters
2. Interactive: ZIP-based water report (HydrationNode step 1-2, already built)
3. Filter recommendations: tiered cards with affiliate CTAs
4. Branch teasers: expandable accordion or card grid (gut, fertility, athletic, etc.)
5. Quiz CTA: "Take the quiz to find your path" → links to GHL quiz (when URL available)
6. Soft bridge to ionizer education

**Files to remove or redirect:**
- `src/pages/water/explore.astro` → content merged into `/water/`
- `src/pages/water/quiz.astro` → quiz CTA inline in `/water/`, or keep as standalone if GHL needs a dedicated embed URL
- `src/pages/water/[slug].astro` → keep as deep-dive destinations, but primary access is from `/water/` page

### 6. Mobile Spiral Fallback

**File:** `src/components/spiral/SpiralFallback.astro` — full rewrite

Replace 4-pillar cards with 13-node vertical journey:
- Read `config.nodes` (not `config.pillars`)
- Group by phase (ELEVATE / ALIGN / UNLOCK) with small phase header dividers
- Each node: emoji + name + tagline, colored left border matching phase
- Live nodes: tappable link to node URL
- Locked nodes: dimmed with "coming soon" indicator
- Ascending visual (node 1 at top since it's a scrolling list — matches reading order)

### 7. Deferred Items (NOT in this plan)

Per Maddie's voice memo:
- **Subscriptions:** "Let's get the bones and the free aspect live... we can add in the subscriptions later"
- **Stripe integration:** Deferred until revenue starts flowing
- **Quiz assessment logic:** "I figured we could build the quiz after we have it honed in a bit"
- **GHL quiz URL:** Blocked on Maddie providing the URL
- **Full branch deep-dive content:** Existing content is fine for now
- **Documentary video embeds:** Blocked on Maddie filming

---

## Implementation Sequence

### Phase A: Data Foundation (hub.config.ts)
1. Fix all 13 node names
2. Update Phase type to `'ELEVATE' | 'ALIGN' | 'UNLOCK'`
3. Remap node phase assignments
4. Update node taglines to match new names

### Phase B: 3D Helix Renderer
1. `npm install three @types/three`
2. Rewrite `spiral.ts` using Three.js — adapted from provided prototype
3. Update `SpiralIsland.astro` for Three.js mounting
4. Rewrite `SpiralFallback.astro` with 13-node vertical list
5. Test on dev server: rotation, hover, click navigation, mobile fallback

### Phase C: Water Consolidation
1. Expand `water/index.astro` into single scrollable page
2. Inline branch teasers (accordion or cards)
3. Keep `water/[slug].astro` as deep-dive targets
4. Remove or redirect `water/explore.astro`

### Phase D: Homepage Polish
1. Add Elevate/Align/Unlock framework blurb under Four Phases section
2. Update quiz CTA language if needed
3. Verify spiral hero integration with new 3D renderer

---

## Critical Files

| File | Action | Scope |
|------|--------|-------|
| `src/data/hub.config.ts` | Edit | Node names, Phase type, phase assignments, taglines |
| `src/components/spiral/spiral.ts` | Full rewrite | Three.js 3D helix (from prototype seed) |
| `src/components/spiral/SpiralIsland.astro` | Edit | Three.js mount point, dynamic import |
| `src/components/spiral/SpiralFallback.astro` | Full rewrite | 13-node vertical list |
| `src/pages/water/index.astro` | Major edit | Consolidate into single scrollable page |
| `src/pages/water/explore.astro` | Remove/redirect | Content merged into water index |
| `src/pages/index.astro` | Edit | Add Elevate/Align/Unlock framework blurb |
| `package.json` | Edit | Add `three` dependency |

## Reusable Existing Code

- `src/components/HydrationNode.astro` — the 6-step water funnel is already built and solid; inline it into the consolidated water page
- `src/data/hydration.config.ts` — filter tiers, cost data, contaminant mapping all stay
- `functions/api/water-report.ts` — EWG API proxy stays unchanged
- `functions/capture.ts` — email capture endpoint stays unchanged
- `src/content/branches/*.md` — branch content stays, just accessed differently
- `src/styles/global.css` — theme colors, glass-card styles all reusable

## Verification

1. `npm run build` — no broken routes, Three.js tree-shakes correctly
2. Dev server: spiral renders as 3D helix, drag-to-rotate works, nodes are clickable
3. Mobile: fallback shows all 13 nodes with correct names, links work
4. Water page: single scroll experience with ZIP lookup, filter recs, branch teasers
5. Homepage: Four Phases section with Elevate/Align/Unlock framework below
6. All 13 node names match Maddie's confirmed list
7. Lighthouse: check bundle size impact of Three.js (~150KB gzipped)
