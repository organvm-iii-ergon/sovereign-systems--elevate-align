# PR 1: Homepage Restructure — Spiral as Hero

## Context

The Sovereign Systems Spiral website (`sovereign-systems--elevate-align`) is architecturally inverted. Maddie's 65 atomized wants (commit `868d6c4`) reveal the site should be spiral-first — the spiral visualization is the main attraction, water is a nested "mini version." Currently the homepage leads with a generic Hero component that says "Begin with Water" twice. The spiral canvas is a 420px decoration sandwiched mid-page.

PR 1 is the foundation for the 5-PR corrective sequence. It restructures the homepage so the spiral canvas IS the hero experience, reframes pillars as journey phases, and redirects all CTAs from water to the quiz.

**Wants addressed:** W-001, W-002, W-003, W-004, W-020, W-047

## Branch

`feature/pr1-homepage-spiral-hero` from `main` at `3b6ecf8`

## Changes (3 files)

### 1. `src/data/hub.config.ts` — one line

Line 48: Physical Sovereignty URL `/water/` → `/pillars/physical`

This cascades to PillarCard links, canvas node clicks, and SpiralFallback mobile cards — all driven by `config.pillars`. The `/pillars/physical` route already exists via `src/pages/pillars/[slug].astro`.

### 2. `src/components/spiral/SpiralIsland.astro` — one line

Line 14: container height `style="height: 420px;"` → `class="... h-[80vh]"`

Must use `h-[80vh]` (not `min-h-`) because the canvas uses `absolute inset-0` — absolute children need an explicit computed height on their containing block. The canvas renderer (`spiral.ts`) uses `getBoundingClientRect()` and adapts to any container size automatically. No JS changes needed.

### 3. `src/pages/index.astro` — full restructure (65 → ~115 lines)

**Remove:** `Hero` import and usage  
**Add:** `VideoEmbed` import (component already exists at `src/components/VideoEmbed.astro`)  
**Keep:** `Base`, `SpiralIsland`, `SpiralFallback`, `PillarCard`, `CTAButton`, `config`

New section order:

| # | Section | Notes |
|---|---------|-------|
| 1 | **Spiral Hero** | Canvas fills 80vh (desktop). Brand tagline overlays via absolute-positioned div with `pointer-events-none` (so canvas interactions pass through). Separate mobile tagline block in normal flow above SpiralFallback cards. |
| 2 | **Quiz CTA** | "What are you here for?" heading + "Take the Quiz" button → `/water/quiz`. PR 3 wires routing options; PR 1 just places the section. |
| 3 | **Divider** | Unchanged `divider-line` |
| 4 | **Pillar Phases** | "The Framework"→"The Journey", "The Four Pillars"→"Four Phases of Sovereignty". Same PillarCard grid, cards now link to `/pillars/physical` via config change. |
| 5 | **Quote** | Unchanged |
| 6 | **Video placeholder** | `<VideoEmbed placeholder={true} />` with "What is Sovereign Systems?" heading. Satisfies W-047. |
| 7 | **Final CTA** | "Start at the root"→"Start the spiral", "Begin with Water"→"Take the Quiz", href `/water/`→`/water/quiz` |

### Files NOT changed

- `Hero.astro` — still used by `/water/`, `/water/quiz`, `/business/`
- `spiral.ts` — dimension-agnostic, auto-adapts
- `SpiralFallback.astro` — pillar URLs update automatically via config
- `PillarCard.astro`, `CTAButton.astro` — no changes needed
- `Base.astro`, `global.css` — no changes

## Key Design Decisions

**Tagline overlay: separate mobile/desktop markup.** Desktop uses `absolute inset-0 z-10 pointer-events-none` to float over canvas. Mobile uses normal flow `div` above SpiralFallback. Single responsive element would need `md:pointer-events-none` / `pointer-events-auto` and sizing diverges enough that two blocks are cleaner.

**Canvas center label collision.** The canvas draws "SOVEREIGN SYSTEMS" at center (`spiral.ts:223`) with pulsing alpha ~0.8. The Astro overlay heading "Sovereign Systems Spiral" centers in the same area. This creates intentional layering — the small canvas label reinforces the larger overlay heading. Assess visually; if collision is distracting, the canvas label can be hidden in a follow-up.

**Quiz CTA target.** Links to existing `/water/quiz` (which has QuizEmbed content). PR 3 creates a proper `/quiz` page with routing logic and rewires this CTA.

## Verification

```bash
cd /Users/4jp/Workspace/organvm-iii-ergon/sovereign-systems--elevate-align

# Build check — zero TypeScript errors, all 16 pages generate
npm run build

# Visual check
npm run dev
```

Manual verification at `localhost:4321`:
- [ ] Homepage: spiral canvas fills ~80vh on desktop, tagline overlays with readable text
- [ ] Homepage mobile (resize to <768px): tagline above fallback cards, no canvas shown
- [ ] Quiz CTA section visible below spiral, "Take the Quiz" links to `/water/quiz`
- [ ] Pillar grid: "Four Phases of Sovereignty" heading, Physical card links to `/pillars/physical`
- [ ] Video placeholder renders with play icon and "Documentary coming soon"
- [ ] Final CTA: "Start the spiral" / "Take the Quiz" (no "Begin with Water" anywhere on homepage)
- [ ] Canvas pillar node click: Physical → `/pillars/physical` (not `/water/`)
- [ ] `/water/` page: unchanged, Hero component still works
- [ ] `/business/` page: unchanged
- [ ] No broken links across site

## Execution Order

1. Create branch from main
2. Edit `hub.config.ts` (1 line)
3. Edit `SpiralIsland.astro` (1 line)
4. Rewrite `index.astro` (full restructure)
5. `npm run build` — verify
6. `npm run dev` — visual check
7. Commit + push + open PR
