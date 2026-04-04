# Plan: Content Genome & System Health Report Suite

## Context

Maddie handed off 127 files (~360K words) from her Google Drive on 2026-04-01. Over the following 3 days, we:

1. Archived and extracted all 127 files into structured markdown
2. Decomposed them into **1,821 discrete atoms** with in-situ markers
3. Ran three-way verification (Claude fine-grain + Gemini medium-grain + Claude-blind coarse-grain) — all three converge on the same ideas
4. Graded every atom: **1,153 SIGNAL / 557 CONTEXT / 111 NOISE**
5. Built a routing map to 7 destinations (node pages, branch enrichment, pillar enrichment, hydration node, social content, standalone products, reference backing)
6. Identified blocking decisions (#13 node architecture, #5 revenue agreement) and immediate deliverables (social content calendar, branch enrichment)

The user wants a **report suite** — multiple depth levels produced as internal assets, from which they'll select what to share with Maddie. All reports include actionable asks.

---

## Deliverables: 4 Report Documents

All reports go in `docs/reports/2026-04-04/` (new directory). Each is a standalone markdown file.

### Report 1: Executive Summary (1-pager)
**File:** `docs/reports/2026-04-04/01-executive-summary.md`
**Audience:** Quick scan — for Maddie or anyone needing the 60-second version
**Sections:**
- What arrived (127 files, ~360K words)
- What we found (1,821 atoms → 1,153 signal, 557 context, 111 noise)
- Where your content lives now (4 pillars, 7 destinations)
- What's ready NOW (social content, branch enrichment, lead magnets)
- What needs your input (3 blocking decisions with clear asks)

### Report 2: Client-Curated Report (the one she'd likely see)
**File:** `docs/reports/2026-04-04/02-client-report.md`
**Audience:** Maddie — content creator, not developer
**Sections:**
1. **Your Content, Atomized** — what we did with her 127 files, the analogy of "DNA sequencing" for her intellectual property, the headline numbers
2. **Your Brand DNA** — breakdown by pillar (Physical 528, Inner 481, Cross-cutting 399, Financial 309, Identity 104), what each pillar contains in plain language
3. **Your Content Types** — what she created (frameworks 241, protocols 106, scripts 94, tools 126, narratives 303, citations 36) in terms she'd recognize ("you wrote 94 social media posts", "you designed 106 step-by-step guides")
4. **Your Voice vs AI** — 842 atoms are her words (LOCAL), 971 are AI-structured versions of her ideas (HYBRID), only 8 are generic/alien. The brand is authentically hers.
5. **What's Ready Now** — social content calendar (~200 atoms), branch page enrichment (~120 atoms), lead magnets (acupressure guide, rhythms PDF), ebooks in draft
6. **What the Spiral Becomes** — the 13-node deep-dive architecture, how her atoms map to each node (table with node name, atom count, primary topics)
7. **The Hydration Node** — her 2026-04-03 spec translated to a build roadmap (6-step funnel)
8. **Editorial Flags** — 104 atoms flagged for verification (water memory, spoon bending, etc.) — presented respectfully as "content that needs your review before publishing"
9. **What We Need From You** — 3 clear asks:
   - Lock the 13-node architecture and ordering (#13)
   - Confirm the revenue structure in writing (#5)
   - Review 104 flagged health/science claims (#18)
10. **What Happens Next** — phased build roadmap (NOW → after decisions → future)

### Report 3: Technical Audit (full transparency)
**File:** `docs/reports/2026-04-04/03-technical-audit.md`
**Audience:** Internal / studio reference
**Sections:**
1. **Extraction Pipeline** — 127 files → 125 extracted → 1,821 atoms. Tools: pandoc, excavate-atoms.py, build-atom-registry.sh
2. **Three-Way Verification** — Claude 1,821 vs Gemini 1,083 vs Claude-blind 357. Convergence analysis. Provenance agreement. Nature classification alignment.
3. **Tier Grading** — SIGNAL 1,153 / CONTEXT 557 / NOISE 111. Grading rules. Distribution by source file.
4. **Atom Registry Schema** — full field inventory (id, source_file, idea, section, position, provenance, nature, nodes, pillar, build_state, editorial, tier, strike_phase)
5. **Routing Map** — 7 destinations with atom counts, gates, selection criteria
6. **Editorial Risk Matrix** — 104 FLAGGED atoms enumerated, 177 UNVERIFIED listed, risk by domain
7. **Build State Inventory** — MISSING 1,114 / PARTIAL 342 / EXISTS 302 / N/A 63
8. **Board Alignment** — 19 open issues mapped to atom destinations
9. **Verification Confidence** — what the three models agreed on, where they diverged, the Gemini confabulation incident
10. **File Manifest** — all scripts, registries, coverage maps, and their locations

### Report 4: System Health & Architecture
**File:** `docs/reports/2026-04-04/04-system-health.md`
**Audience:** Internal / studio reference (system-level view)
**Sections:**
1. **Site Architecture** — Astro 5, Tailwind 4, TS, Cloudflare Pages. What's deployed vs what's built vs what's planned
2. **Page Inventory** — 15 current pages, their status (live / placeholder / planned)
3. **Content Collections** — branches (6) and pillars (4) with Zod schemas, what's populated
4. **Design System** — ocean shades, Cormorant Garamond / Inter, glass morphism, grain texture
5. **Domain Strategy** — elevatealign.com (hub), stopdrinkingacid.com (water), eaucohub.com (business) — none connected yet
6. **Infrastructure** — Cloudflare Pages Functions (capture.ts), citation system, build pipeline
7. **Board State** — 19 issues, critical path (#13 → #15 → #6), P0 blockers, hydration node scope expansion
8. **Seed.yaml Edges** — what this project produces (5 edges) and consumes (1 edge), none fulfilled yet
9. **Risk Register** — governance drift, unfulfilled produces edges, editorial liability, client decision bottleneck
10. **Recommendations** — prioritized list of what to build next, what to decide, what to defer

---

## Data Sources (all read during exploration)

| Data | File | Key Numbers |
|------|------|-------------|
| Atom registry | `docs/archive/atom-registry.yaml` | 27,320 lines, 1,821 atoms |
| Routing map | `docs/archive/atom-routing-map.md` | 7 destinations |
| Three-way reconciliation | `docs/archive/verification/three-way-reconciliation.md` | 3 models converge |
| Handoff doc | `docs/handoff-maddie-spiral-path-2026-04-01.md` | 127 files, brand architecture |
| Hydration node spec | `docs/superpowers/intakes/2026-04-03-maddie-hydration-node-funnel-spec.md` | 6-step funnel |
| Board atomization | `docs/superpowers/intakes/2026-04-01-maddie-spiral-path-board-atomization.md` | 19 issues |
| Grading plan | `docs/superpowers/plans/2026-04-04-atom-grading-assembly-delivery.md` | Phase 1-3 plan |
| Hub config | `src/data/hub.config.ts` | 4 pillars, 6 branches, 3 domains |
| Seed.yaml | `seed.yaml` | organ III, 5 produces, 1 consumes |

### Key Statistics (verified from registry)

| Dimension | Breakdown |
|-----------|-----------|
| **Total atoms** | 1,821 |
| **By tier** | SIGNAL 1,153 (63%) · CONTEXT 557 (31%) · NOISE 111 (6%) |
| **By provenance** | LOCAL 842 (Maddie's voice) · HYBRID 971 (AI-structured) · ALIEN 8 |
| **By pillar** | Physical 528 · Inner 481 · Cross-cutting 399 · Financial 309 · Identity 104 |
| **By nature** | CLAIM 355 · QUESTION 321 · NARRATIVE 303 · FRAMEWORK 241 · INSTRUCTION 143 · TOOL 126 · PROTOCOL 106 · SCRIPT 94 · STATISTIC 38 · CITATION 36 · PRODUCT 34 · MODEL 24 |
| **By editorial** | CLEAN 1,540 · UNVERIFIED 177 · FLAGGED 104 |
| **By build state** | MISSING 1,114 · PARTIAL 342 · EXISTS 302 · N/A 63 |

---

## Implementation Steps

### Step 1: Create report directory
```
mkdir -p docs/reports/2026-04-04/
```

### Step 2: Write Report 1 — Executive Summary (~60 lines)
- Pure prose, no tables except the atom tier split
- Ends with 3 bullet asks
- File: `docs/reports/2026-04-04/01-executive-summary.md`

### Step 3: Write Report 2 — Client Report (~250-350 lines)
- Client-friendly language throughout — "your content" not "atoms"
- Tables for pillar breakdown, content types, node mapping
- Respectful framing of editorial flags
- Clear "What We Need From You" section
- File: `docs/reports/2026-04-04/02-client-report.md`

### Step 4: Write Report 3 — Technical Audit (~300-400 lines)
- Full pipeline documentation with exact numbers
- Verification methodology and confidence assessment
- Complete editorial risk enumeration
- File manifest with paths
- File: `docs/reports/2026-04-04/03-technical-audit.md`

### Step 5: Write Report 4 — System Health (~200-300 lines)
- Architecture inventory with status per page
- Board state with critical path visualization
- Seed.yaml edge fulfillment tracking
- Risk register and prioritized recommendations
- File: `docs/reports/2026-04-04/04-system-health.md`

### Step 6: Verify
- All 4 files exist and render cleanly
- Cross-check that statistics in all reports match (no conflicting numbers)
- Ensure no client-sensitive credentials appear (reference_maddie-credentials.md content stays out)
- No Maddie email addresses or platform passwords in any report

---

## Tone Guidance

**Reports 1-2 (client-facing candidates):**
- "Your" voice — it's about her work, her ideas, her brand
- Avoid: atoms, registry, pipeline, YAML, provenance, in-situ
- Use instead: ideas, content pieces, your research, your frameworks, your voice
- The framing is "we mapped your creative DNA" not "we ran an extraction pipeline"
- Editorial flags presented as "content that benefits from review" not "pseudoscience we caught"

**Reports 3-4 (internal):**
- Full technical vocabulary
- Exact file paths and registry field names
- Honest risk assessment with no softening
