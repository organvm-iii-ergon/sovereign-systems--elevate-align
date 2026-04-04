# Priority Unification: Attack Plan

**Date:** 2026-04-04
**Project:** sovereign-systems--elevate-align
**Scope:** Full board triage + sequenced execution plan

---

## Context

The project has completed a major content pipeline milestone: 1,821 atoms extracted, graded (SIGNAL/CONTEXT/NOISE), routed to 7 destinations, and organized into 5 strike plans. But **61% of content is MISSING from the build surface** (1,114 atoms), and the two P0 blockers (#13 node architecture, #5 revenue agreement) gate all revenue-generating and node-building work.

The question: what produces maximum forward motion given that the critical path is client-blocked?

**Answer:** Three swimlanes run in parallel — immediate client deliverables, content pipeline advancement, and blocker-acceleration. The attack sequences short completions first, then sustained pipeline work, then build preparation.

---

## Board State (21 open, 2 closed)

| # | Title | Pri | Labels | Status |
|---|-------|-----|--------|--------|
| 13 | Lock final Spiral node architecture | **P0** | client, spiral | **BLOCKED (Maddie)** |
| 5 | Formalize 10% revenue agreement | **P0** | client | **BLOCKED (Maddie)** |
| 15 | Merge V5/V6 HTML prototypes | P1 | spiral, infra | Blocked by #13 |
| 16 | Editorial review of flagged claims | P1 | content | **UNBLOCKED** |
| 14 | Verify doc 1b reel/video access | P1 | client, infra | Blocked (Maddie) |
| 9 | Start Here quiz + GHL integration | P1 | client, infra | Blocked (Maddie) |
| 8 | Spiral interaction target | P1 | spiral | Blocked by #13 |
| 6 | Physical Sovereignty build (nodes 1-5) | P1 | content | Blocked by #13 + content |
| 3 | Connect custom domains | P1 | client, infra | Blocked (Maddie) |
| 21 | Resolve 63 N/A cross-cutting atoms | P2 | content | **UNBLOCKED** |
| 18 | Video hosting strategy | P2 | client, infra | Blocked (Maddie) |
| 17 | Water Hub placement | P2→**P1** | client, infra | **PROMOTE** (hydration node makes urgent) |
| 7 | Subscription boundary | P2 | client, infra | Partially resolved by hydration spec |
| 20 | Creature Selves concept decision | P3 | content | Deferred |
| 19 | Inner Child Book packaging | P3 | content | Deferred |
| 12 | B-106 citation correction | P3 | content | **UNBLOCKED** |
| 11 | Keystatic CMS | P3 | infra | Deferred |
| 10 | Store buildout | P3 | infra | Deferred |
| 1 | Keystatic Production Handover | P3 | — | Deferred |

**Proposed change:** Promote #17 from P2 → P1. The hydration node spec (2026-04-03) makes the Water Hub placement decision urgent — it blocks #6 and the hydration node build.

---

## The Attack (5 Sprints)

### Sprint 1: Quick Wins (~2 hours)

**Goal:** Close the smallest items, produce an immediate client deliverable.

| # | Task | Issue | Time | Output |
|---|------|-------|------|--------|
| 1a | **#12 citation correction** | #12 | 30m | Fix B-106, close issue |
| 1b | **Social content extraction** | — | 90m | 94 SCRIPT atoms → organized by platform into `docs/social-content-calendar/` (instagram/carousel, reel, email, video). **Maddie can use these TODAY.** |

Why social content first: 94 atoms with nature=SCRIPT are pre-written captions, reel scripts, email sequences, and carousel scripts sitting in the atom registry. They require zero architecture decisions, zero Astro build work, and produce immediate client value. This was identified in the Phase 3 grading plan but not yet executed.

### Sprint 2: Content Pipeline (~4 hours)

**Goal:** Advance the pipeline to build-ready state.

| # | Task | Issue | Time | Output |
|---|------|-------|------|--------|
| 2a | **Phase 2 semantic clustering** | IRF-III-022 | 2h | `content-units.yaml` + `scripts/build-content-units.py` — groups 1,153 SIGNAL atoms into ~150-200 content units by destination × node |
| 2b | **Branch page enrichment** | — | 90m | Inject ~120 PARTIAL SIGNAL atoms into the 6 existing `src/content/branches/*.md` files. Gate: none (pages exist, atoms routed, no client decision needed) |
| 2c | **#21 route 63 N/A atoms** | #21 | 30m | Triage: assign to specific nodes or archive. Close issue. |

Why this order: Clustering produces the units that make all subsequent build work possible. Branch enrichment produces visible site improvement with zero blockers. N/A routing closes the last vacuum.

### Sprint 3: Client Decision Acceleration (~3 hours)

**Goal:** Reduce client-blocked time by making decisions trivially easy.

| # | Task | Issue | Time | Output |
|---|------|-------|------|--------|
| 3a | **#13 decision deck** | #13 | 90m | One-pager: 13-vs-14 node comparison with atom evidence, UX implications, and a recommendation. Formatted for iMessage response ("reply A or B"). |
| 3b | **#17 architecture rec** | #17 | 45m | Recommendation document: standalone app at stopdrinkingacid.com, with fallback `/water/hydration-node` on main site. Include partial #7 resolution (Step 1 free, Step 2 email-gated). |
| 3c | **#5 revenue draft** | #5 | 45m | One-page terms from commerce--meta templates. Signature-ready. |

Why this matters: Every day #13 stays open, 4 P0/P1 issues remain blocked. The decision deck converts a complex architecture question into a simple choice.

### Sprint 4: Hydration Node Phase A (~6 hours)

**Goal:** Build the static funnel scaffold (architecture-agnostic).

| # | Task | Issue | Time | Output |
|---|------|-------|------|--------|
| 4a | **Data model design** | — | 90m | `src/data/hydration.config.ts`: TypeScript interfaces for ZIP lookup, contaminant schema, filter tiers, cost comparisons |
| 4b | **6-step funnel component** | — | 3h | Astro component (NOT a page — avoids #17 dependency). Multi-step progressive disclosure. Steps 1-2 with demo data. Reuses `EmailGate.astro` patterns + existing glass-card design tokens. |
| 4c | **EWG API feasibility** | — | 90m | Research: public API? Scraping required? Curated dataset? Informs Phase B timeline. |

Key constraint: Build the component, not the page. A `<HydrationNode />` component works identically whether it lives at `/water/hydration-node` or `stopdrinkingacid.com/`. The page/route wiring waits for #17.

### Sprint 5: Build Preparation (post-#13 or parallel if time)

**Goal:** Be ready to execute the moment #13 resolves.

| # | Task | Issue | Time | Output |
|---|------|-------|------|--------|
| 5a | **V5/V6 prototype audit** | #15 prep | 90m | Locate prototypes (may not be in repo — check with Maddie or original handoff), document contents, create merge plan |
| 5b | **Node content collection schema** | — | 60m | Extend `content.config.ts` with `nodes` collection. Create `src/content/nodes/` directory. Schema: title, truth, realityCheck, science, sacred, soulPractice, reflectionPrompts, closingLine, prerequisiteNode, connectedNodes, pillarTags |
| 5c | **#16 editorial review** | #16 | 2h | Review 104 FLAGGED atoms. Disposition doc: which claims need citations, disclaimers, or rewording. Must complete before any node page goes live. |
| 5d | **Component architecture** | — | 90m | Design `NodeDeepDive.astro` + sub-components (NodeHero, NodeContent, NodeTools, NodeCTA, NodeNav) based on ATM-R-005 spec |

---

## What NOT to Build Yet

- **Node pages** (`/spiral/node-*`) — blocked by #13
- **Three.js / GSAP** — current spiral is vanilla Canvas (274 lines). V5/V6 merge is blocked.
- **Existing `/water/` restructure** — it works as-is. Hydration node is additive.
- **Hydration Node Phase B** (dynamic EWG) — wait for Phase A client review. Maddie's "graceful degradation" note suggests she's open to simpler fallbacks.
- **Subscription/payment infrastructure** (#7, #10, #11) — deferred until revenue agreement (#5) resolves.

---

## Critical Files

| File | Role |
|------|------|
| `docs/archive/atom-registry.yaml` | Source of truth for all 1,821 atoms |
| `docs/archive/atom-routing-map.md` | Build instruction set: where each atom lands |
| `docs/archive/coverage/by-tier.md` | Tier breakdown for build prioritization |
| `docs/archive/strikes/phase-*.md` | Phased execution plans |
| `src/data/hub.config.ts` | Site structure config (extend for nodes) |
| `src/content.config.ts` | Content collection schemas (extend for nodes) |
| `docs/superpowers/intakes/2026-04-03-maddie-hydration-node-funnel-spec.md` | Hydration node spec |
| `docs/archive/maddie-intent-register.md` | 557 CONTEXT atoms as decision log |
| `scripts/grade-atoms.py` | Tier grading (complete) |
| `scripts/build-intent-register.py` | Intent register builder (complete) |

---

## Verification

After each sprint:
1. `npm run build` — confirm Astro builds clean
2. `git diff --stat` — review scope of changes
3. Check atom-registry.yaml consistency: total must remain 1,821
4. For branch enrichment: `npm run dev` and visually confirm pages render

After Sprint 3 (client docs): Send decision deck to Maddie. Track response.
After Sprint 4: Demo hydration node component locally with `npm run dev`.

---

## Sequencing Summary

```
Sprint 1 (Quick Wins)     ████░░░░░░░░░░░░░░░░  ~2h
Sprint 2 (Pipeline)        ░░░░████████░░░░░░░░  ~4h
Sprint 3 (Client Accel)    ░░░░░░░░░░░░██████░░  ~3h
Sprint 4 (Hydration A)     ░░░░░░░░░░░░░░░░████████████  ~6h
Sprint 5 (Build Prep)      [after #13 resolves or parallel if time]

Total unblocked work: ~15 hours across 4 sprints
Client decision latency: Sprint 3 outputs reduce this
```

Sprints 1-2 can run in a single session. Sprint 3 should run immediately after to minimize client-blocked time. Sprint 4 is the sustained build. Sprint 5 activates when #13 resolves.
