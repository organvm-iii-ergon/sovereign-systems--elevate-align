# Corrective Implementation Plan — Spiral-First Architecture

**Date:** 2026-04-17
**Grounded against:** 64-want atomization (`docs/client-decisions/2026-04-17-atomized-wants.md`)
**Workflow:** PR per phase → submit for GH feedback → next phase → repeat → merge after all feedback addressed

---

## The Problem

The site is architecturally inverted.

| What Maddie asked for | What exists |
|----------------------|-------------|
| Spiral = main attraction, hero experience | Spiral = 30-line section sandwiched between Hero and Pillars |
| Water = "mini version" nested in a pillar | Water = 147-line page with 10 sections, HydrationNode, EWG API |
| Quiz = primary CTA routing to nodes | No quiz. Hero CTAs both point to water |
| 13 nodes in the spiral | 4 pillar nodes + center dot |
| Health tells in "Non Negotiable" node context | Health tells on water page |
| Explore page gated by name+email | Explore page open, branches email-gated |

The homepage (65 lines) is a thin pass-through to the water page. Every CTA says "Begin with Water." The spiral is a decoration, not the experience.

---

## Corrective Sequence (5 PRs)

### PR 1: Homepage Restructure — Spiral as Hero

**Wants addressed:** W-001, W-002, W-003, W-004, W-020, W-047

**What changes:**

**`src/pages/index.astro`** (65 → ~120 lines):
- Remove current Hero component from homepage (it's generic)
- Make the spiral section the FIRST thing visitors see — full viewport, no Hero above it
- Add a tagline overlay on the spiral canvas: Maddie's brand voice, not "Sovereign Systems Spiral"
- Below spiral: quiz CTA section — "What are you here for?" with routing intent
- Below quiz CTA: pillar phases (not individual page links — phases of the spiral journey)
- Below phases: short video placeholder (W-047 — "explaining what it is and how it works")
- Final CTA: quiz again, or name+email capture if no GHL URL yet

**`src/components/spiral/SpiralIsland.astro`**:
- Increase default height from current size to `min-h-[80vh]` — the spiral IS the hero
- Add overlay text layer (Astro component, not canvas-rendered) for brand messaging

**`src/components/Hero.astro`**:
- No changes — it's still used on water and business pages
- Homepage just stops using it

**`src/data/hub.config.ts`**:
- Change Physical Sovereignty URL from `/water/` to `/pillars/physical` (it shouldn't shortcut to water)
- Water becomes accessible FROM the physical pillar page, not as the primary pillar URL

**Key principle:** The homepage should feel like arriving at the center of a spiral world, not like landing on a water sales page.

---

### PR 2: Water Page Scoping — Mini Version

**Wants addressed:** W-002, W-010, W-024, W-025, W-026, W-027, W-019

**What changes:**

**`src/pages/water/index.astro`** (147 → ~80 lines):
- REMOVE: "This Is Not Normal" section (→ moves to Non Negotiable node context in PR 4)
- REMOVE: Three Health Tells grid (→ moves to Non Negotiable node context in PR 4)
- REMOVE: Hydration Metric callout (→ moves to Non Negotiable node context in PR 4)
- REMOVE: Post-video grounding section (redundant prose)
- KEEP: Hero (but retitle — "Water changed everything" is good, stays)
- KEEP: Documentary video placeholder (Maddie films when ready)
- KEEP: Education section (H2 + cellular hydration — this IS the "mini version" content)
- KEEP: HydrationNode funnel (this is the conversion mechanism — filtration entrance)
- KEEP: Research accordion
- KEEP: Loop-back to Physical Sovereignty pillar
- REMOVE: Branch explorer CTA (branches live in GHL per W-019 — the explore page contradicts this)

**Result:** Water page becomes the focused filtration entrance funnel Maddie described — "the water stuff is essentially just a mini version of this."

**Content migration note:** The health tells, hydration metric, and inflammation content are NOT deleted — they're relocated to the Non Negotiable node in PR 4. This PR only removes them from `/water/`.

---

### PR 3: Quiz Architecture — Entry Point Routing

**Wants addressed:** W-020, W-021, W-022, W-023

**What changes:**

**`src/pages/index.astro`** (from PR 1 state):
- Wire the quiz CTA section to either:
  - A: Link to `/quiz` (new top-level page) if we want it prominent
  - B: Inline a lightweight "What brings you here?" form that routes to pillars/nodes
- Since GHL quiz URL is empty (W-023 BLOCKED), build the routing shell:
  - 3-4 options: "My body" → Physical, "My mind" → Inner, "My purpose" → Identity, "My income" → Financial
  - Each option links to the relevant pillar page
  - Name+email capture BEFORE showing options (W-021: explore gated by name+email)

**New file: `src/pages/quiz.astro`** (~60 lines):
- Full-page quiz routing experience
- Name + email form → POST to `/capture` → show routing options
- When Maddie provides GHL URL: embed the GHL form instead of the static routing
- Fallback: if no GHL URL, the static routing still works

**`functions/capture.ts`**:
- Already accepts `name` + `email` + `source`
- Add `source: 'quiz'` for attribution

**`src/pages/water/explore.astro`**:
- Add email gate at the top (W-021: explore page locked until name+email)
- Add "Main Overview" link at top pointing to existing GHL funnel (W-022)

---

### PR 4: 13-Node Spiral + Node Content

**Wants addressed:** W-005, W-006, W-007, W-008, W-009, W-024, W-025, W-026, W-027

**What changes:**

**`src/data/hub.config.ts`** — add node definitions:
```typescript
export interface SpiralNode {
  id: number;
  name: string;
  phase: string;        // ELEVATE, INNER, IDENTITY, FINANCIAL
  pillarSlug: string;
  tagline: string;
  color: string;
  status: 'live' | 'locked' | 'coming-soon';
  url: string;
}
```

13 nodes per the LOCKED architecture (#13):
- Phase 1 ELEVATE (Physical): 1. Feel Good First, 2. Your Body Is the Starting Point, 3. Regulate (merged 3+4), 4. Non Negotiable (renamed 5), 5. Water/Hydration
- Phase 2+ (Inner, Identity, Financial): 8 more nodes, status: 'locked'

**`src/components/spiral/spiral.ts`** (359 → ~450 lines):
- Replace 4 pillar nodes with 13 spiral nodes
- Spiral layout: nodes positioned along logarithmic spiral path (not orbital rings)
- Phase 1 nodes: solid borders, clickable, full labels
- Phase 2-4 nodes: dashed borders, "locked" indicator, non-clickable
- Center node: stays as "SOVEREIGN SYSTEMS"
- Touch support: touchstart/touchmove/touchend handlers
- Drag-to-rotate on mobile and desktop

**New file: `src/pages/nodes/[id].astro`** (~80 lines):
- Dynamic page for each spiral node
- Node 4 (Non Negotiable): receives the health tells, hydration metric, and inflammation content from water page
- Node 5 (Water): links to `/water/` (the mini version)
- Other Phase 1 nodes: content from Maddie's ChatGPT threads (placeholders for now)
- Locked nodes: "Coming soon" page with pillar context

**`src/content/pillars/physical.md`**:
- Already has Regulate and Non Negotiable naming from previous work
- Add node IDs to frontmatter for linking

---

### PR 5: Polish + Client Walkthrough

**Wants addressed:** W-046, W-039, W-036

**What changes:**

- Visual polish pass on all modified pages
- Mobile testing of spiral touch interactions
- Update walkthrough document with new site architecture
- Connect `elevatealign.com` custom domain (W-039, needs CF dashboard — non-code)
- Send walkthrough to Maddie (W-036/W-046 — she hasn't seen nav overhaul OR architecture fix)

**`docs/client-deliverables/2026-04-17-maddie-site-walkthrough-v3.md`**:
- New walkthrough reflecting spiral-first architecture
- Screenshots of: homepage with spiral hero, quiz routing, water as mini version, node pages
- Clear "here's what changed and why" section

---

## What This Plan Does NOT Touch

These are blocked or out-of-scope for this sprint:

| Want | Why not now |
|------|-----------|
| W-023: GHL quiz URL | BLOCKED — Maddie hasn't built it yet |
| W-028: Documentary video | BLOCKED — Maddie hasn't filmed it |
| W-029: 104 flagged atoms | BLOCKED — Maddie hasn't reviewed |
| W-031: Affiliate URLs | BLOCKED — Maddie working on accounts |
| W-033: Subscription payments | BLOCKED — Stripe vs GHL decision needed |
| W-041: Pillar 3/4 ordering | AMBIGUOUS — not confirmed by Maddie |
| W-049–W-064: Out-of-scope projects | Separate entities — nonprofit, WWOOF, coaching, etc. |

---

## Sequencing + Dependencies

```
PR 1: Homepage restructure (spiral hero, quiz CTA)
  ↓ must land first — everything else builds on the new homepage
PR 2: Water page scoping (remove misplaced content)
  ↓ can start in parallel with PR 3 after PR 1 merges
PR 3: Quiz architecture (routing shell, email gate)
  ↓ independent of PR 2 — different pages
PR 4: 13-node spiral + node pages
  ↓ depends on PR 1 (spiral changes) + PR 2 (content relocated)
PR 5: Polish + walkthrough
  ↓ depends on all above
```

PR 2 and PR 3 can be developed in parallel after PR 1.

---

## Verification — Per PR

Each PR must pass before moving to the next:

```bash
npm run build          # Zero TypeScript errors, all pages generate
npm run dev            # Visual check of modified pages
# Manual: walk the user journey from homepage → quiz → pillar → node → water
# Verify: no broken links, no missing content, no regression on existing pages
```

---

## Want Coverage

| PR | Wants Addressed | Count |
|----|----------------|-------|
| 1 | W-001, W-002, W-003, W-004, W-020, W-047 | 6 |
| 2 | W-002, W-010, W-019, W-024, W-025, W-026, W-027 | 7 |
| 3 | W-020, W-021, W-022, W-023 | 4 |
| 4 | W-005, W-006, W-007, W-008, W-009, W-024, W-025, W-026, W-027 | 9 |
| 5 | W-036, W-039, W-046 | 3 |
| **Total unique wants addressed** | | **18 of 48 in-scope** |

The remaining 30 in-scope wants are either DONE (11), BLOCKED (9), or depend on Maddie inputs (10).

---

## Map Update Protocol

After each PR merges, update `docs/client-decisions/2026-04-17-atomized-wants.md`:
- Change status of addressed wants
- Add implementation date
- Note any scope changes discovered during build
