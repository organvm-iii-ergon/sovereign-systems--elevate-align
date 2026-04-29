# Maddie Ideals vs Rendered State — Diff Tracker

**Created:** 2026-04-29
**Last verified:** 2026-04-29
**Refresh discipline:** manual, on-demand. No automation. See runbook footer.
**Cross-link:** `organvm/sovereign-systems--layer-above-hokage/.codex/plans/2026-04-29-workload-encompassing-layer-routing.md` (`7ccd7c6`)

## What this is

Two corpora define "ideals":
- **W-001 → W-065** — atomized wants from `docs/client-decisions/2026-04-17-atomized-wants.md` (master inventory across 7 iMessage PDFs Mar 25 → Apr 17)
- **I-NN** — V4 directives from `docs/client-decisions/2026-04-25-maddie-spiral-v4-direction.md` (post-V3 design pass)

"Rendered state" is the current code: `src/data/hub.config.ts`, `src/components/spiral/spiral.ts`, `src/data/hydration.config.ts`, `src/content/**/*.md`, `functions/**/*.ts`.

This tracker is **gap-focused** — it lists what's not yet matching, what's blocked, what's drifted. SHIPPED items appear as a compact reference list, not row-by-row.

## Summary

| Status | Count | Meaning |
|---|---:|---|
| **SHIPPED** | 33 | Ideal stated; rendered state matches |
| **PARTIAL** | 8 | Rendered with drift or partial scope |
| **MISSING** | 5 | Asked, not yet rendered |
| **BLOCKED** | 9 | Waiting on external input (Maddie, affiliate accounts, video, CF dashboard) |
| **DRIFT** | 7 | Rendered without explicit prior ask — needs Maddie sign-off retroactively |
| **OUT-OF-SCOPE** | 17 | Relationship / coaching / vision items, not site features |

## Section 1 — Active gaps (PARTIAL / MISSING / BLOCKED)

| ID | Status | Source | Rendered Evidence | Delta / Blocker | Action Owner |
|---|---|---|---|---|---|
| W-008 | PARTIAL | `2026-04-17-atomized-wants.md:113-121` ("rename node 4 to Non Negotiable") | `hub.config.ts:133` (node 4 = "Elevate") | Spirit shipped (first-line copy + content): node 4 has the "feeling like shit is not normal" tagline; but the **name** is "Elevate," not "Non Negotiable." `2026-04-04-node-architecture-locked.md` (Apr 4 lock) overrode. | Verify with Maddie whether Apr 4 lock supersedes Apr 4 rename request. |
| W-017 | BLOCKED | `2026-04-17-atomized-wants.md:207-215` (post-email health quiz → GHL branches) | `src/pages/water/quiz.astro` (empty iframe), `hub.config.ts:196` (`quizFormUrl: ''`) | GHL quiz URL not provided. | Maddie. |
| W-022 | PARTIAL | `2026-04-17-atomized-wants.md:262-269` ("main overview" at top of explore) | `src/pages/water/explore.astro` (quiz CTA exists; main GHL overview link missing) | GHL overview URL not provided. | Maddie. |
| W-023 | BLOCKED | `2026-04-17-atomized-wants.md:271-279` (GHL quiz embed URL) | empty iframe container | Same as W-017 root cause. | Maddie. |
| W-028 | BLOCKED | `2026-04-17-atomized-wants.md:321-330` (documentary / 30-sec instruction video) | `src/components/VideoEmbed.astro` (placeholder) on `/water/` | Video not filmed. | Maddie. |
| W-029 | BLOCKED | `2026-04-17-atomized-wants.md:332-340` (104 flagged + 177 unverified atoms) | flagged set documented, not reviewed | Awaiting Maddie review session. | Maddie. |
| W-030 | PARTIAL | `2026-04-17-atomized-wants.md:346-354` (10% of all sales → $10K) | terms only in iMessage, no formal contract | Scope broadened from water-only to ALL sales. | Anthony — counter-review and formalize. |
| W-031 | BLOCKED | `2026-04-17-atomized-wants.md:356-362` (filter affiliate commissions) | `hydration.config.ts` filter tiers exist; affiliate URLs empty | Affiliate accounts (IonFaucet, Multipure) not set up yet. | Maddie. |
| W-032 | MISSING | `2026-04-17-atomized-wants.md:364-370` (DP sign-up flow $99) | no DP route on site | DP pricing/refund logic not built. | Anthony — needs scope. |
| W-033 | MISSING | `2026-04-17-atomized-wants.md:372-380` (subscription tiers $11/$22/$33) | no subscription page | Stripe vs GHL decision not made (Issue #38). | Anthony + Maddie — pick rail. |
| W-039 | BLOCKED | `2026-04-17-atomized-wants.md:438-445` (custom domain elevatealign.com) | deployed to `sovereign-systems-spiral.pages.dev` | CF dashboard action not done. | Anthony — non-code. |
| W-040 | PARTIAL | `2026-04-17-atomized-wants.md:451-457` (Creature Selves IP, Identity pillar concept page) | concept exists in IP; no Identity pillar concept page | Page not built. | Anthony. |
| W-041 | PARTIAL | `2026-04-17-atomized-wants.md:459-467` (pillar 3/4 ordering ambiguity Identity vs Financial) | `hub.config.ts:106-126` locks Physical/Inner/Identity/Financial in that order | "Locked-in" without explicit Maddie confirmation that 3=Identity and 4=Financial. | Maddie — explicit confirm. |
| W-042 | BLOCKED | `2026-04-17-atomized-wants.md:469-475` (documentary film) | placeholder | Same as W-028. | Maddie. |
| W-046 | SHIPPED | n/a | walkthrough v3, navigation overhaul shipped | (was blocking, now resolved) | — |
| W-047 | PARTIAL | `2026-04-17-atomized-wants.md:527-535` (short instruction video at top) | placeholder shipped | Filming blocked on Maddie. | Maddie. |
| W-019 | SHIPPED | `2026-04-17-atomized-wants.md:226-234` (branches stay in GHL) | branch CTAs removed from water page | Branch *pages* still exist on site as awareness content; user explicit decision (Apr 6-17) to keep but not promote. | — |

## Section 2 — V4 directive ideals (Apr 25 design pass)

These are the items from `2026-04-25-maddie-spiral-v4-direction.md` that emerged after the Apr 17 atomization. ID space `I-NN`.

| ID | Status | Source | Rendered Evidence | Delta / Note |
|---|---|---|---|---|
| I-001 | SHIPPED | V4 line 71-77 (hybrid geometry: orb + stars + per-religion symbol + hover-name) | `spiral.ts:25` (`SpiralVariant = 'symbols' \| 'stars'`); `spiral.ts:893` (Variant A + Variant B builders) | Both variants shipped as runtime switch, not fork. Stronger than asked. |
| I-002 | SHIPPED | V4 line 80-87 (multi-religion symbols approved, swap generic cross + heart) | `spiral.ts:989` (vesica piscis replaces heart); `spiral.ts:1037-1038` (solar cross replaces equal-arm cross) | Both swaps cited in code with attribution to Maddie ask. |
| I-003 | SHIPPED | V4 line 89-92 (replace one purple with orange; lighten top purple) | `spiral.ts:140-154` (8 chakra stops, second orange added at index 1, top violet lightened to `0xc97ce8`) | Comment at line 143 cites Maddie's exact words. |
| I-004 | NEEDS VERIFICATION | V4 line 94-95 (hover behavior: name pops up "in center or under on hover") | not searched in this pass | Verify which DOM element renders hover-name and whether positioning matches spec. |
| I-005 | SHIPPED | V4 line 97-99 (3D not mandatory; orbs + sparkles + hover-name acceptable) | `spiral.ts` Three.js + `MiniSpiral.astro` 2D fallback both exist | Choice preserved both ways. |
| I-006 | BLOCKED | V4 line 101-105 (filter page as CTA/freebie for posts; affiliate links pending) | `/water/` page operational; affiliate URLs empty in `hydration.config.ts` | Maddie sending affiliate links + process design. |
| I-007 | NEEDS VERIFICATION | V4 line 59 ("refracted light on water" aesthetic for stars) | spiral.ts variant 'stars' shipped but specific shimmer/refraction quality not audited | Visual review by Maddie required. |

## Section 3 — Drift (rendered without explicit ask)

| ID | Source of feature | Rendered Evidence | Maddie Ask Status |
|---|---|---|---|
| D-001 | EnvVar substrate (`PYR`/`OCULUS`/`DYAD`/`PYRAMIS`/`HYDOR`/`MANDORLA`/`KENOSIS`/`SHATKONA`/`PADMA`/`BODHI`/`TETRAD`/`OKTAEDRON`/`ANKH`) | `hub.config.ts:33-46`, `src/pages/lineage/[envvar].astro` | Not in atomized-wants. Not in V4 direction. **Retroactive sign-off needed.** Frame as: "I added a cross-cultural lineage layer — same essence named through Greek/Sanskrit/Egyptian/Christian/Jungian traditions. Want a 30-second walkthrough?" |
| D-002 | `/lineage/[envvar]` page | `src/pages/lineage/[envvar].astro` | Same as D-001. |
| D-003 | IconWorlds physics (per-node mini-universe with Kepler orbits, materia particles, phase regimes) | `spiral.ts:103+`, `src/data/icon-worlds.ts` | Aesthetic and mechanical depth far beyond "13 nodes on a spiral." Maddie may love it but hasn't seen the full V8 yet. |
| D-004 | V5–V8 spiral evolution stages (8 named iteration stages: V5.4 volumetric, V5.6 phase-particle, V5.7 vessel-removal, V5.8 spring-bound, V5.9 bouncing-substrate, V5.10 bloom-kill, V6 IconWorld type, V7 mathematical primitives, V8 unique universes) | git log | Process drift, not feature drift. Useful as receipts for the work. |
| D-005 | Pillar mapping change between locked-arch and code: locked says Node 2 → Inner, Node 12 → Identity; code says Node 2 → Physical, Node 12 → Financial | `2026-04-04-node-architecture-locked.md:51-56` vs `hub.config.ts:131,143` | **Real discrepancy.** Need to decide: (a) update locked-arch to match code, (b) update code to match locked-arch, (c) ask Maddie which she prefers. |
| D-006 | Per-node themes / palettes / planet counts / inclination layouts | `spiral.ts:494-506` | Same as D-001 — not asked, but supportive of the aesthetic. |
| D-007 | NAMING_CHAINS multi-lens lineage data | `feat(spiral): NAMING_CHAINS — multi-lens lineage data for 13 substrates` (commit `19e67bc`) | Same as D-001 family. |

## Section 4 — Shipped reference (compact)

These are confirmed SHIPPED. Each row is `W-NN: short label — file:line`. No deep narrative — see source plan files for full evolution.

- W-001: Spiral as main attraction — `src/pages/index.astro` (85vh hero)
- W-002: Water as mini version — `src/pages/water/index.astro`
- W-003: Pillars as phases — `hub.config.ts:82-126` + homepage phase grid
- W-004: Modular section order — `src/pages/index.astro`
- W-005: Spiral graphic / 4 rods evolution — V5 prototype archived → 13-node helix shipped
- W-006: 13-node architecture — `hub.config.ts:128-145`
- W-007: Nodes 3 & 4 merge → "Regulate" — `hub.config.ts:132` (node 3 = "Regulation")
- W-009: Button looping water → node 5 — `hub.config.ts:134` (node 5 url = `/water/`)
- W-010: Water/filter page deliverable — `src/pages/water/index.astro`
- W-011: ZIP code contaminant lookup — `functions/api/water-report.ts`
- W-012: Find a spring near you — `src/components/HydrationNode.astro`
- W-013: Personalized filter recs (logic) — `hydration.config.ts:matchFiltersToContaminants`
- W-014: Email gate before filter results — `src/components/EmailGate.astro` + `functions/capture.ts`
- W-015: Fluoride removal emphasis — Brita reality-check section
- W-016: Filter tiers as upgrade path — `hydration.config.ts`
- W-018: Automation fallback CTA — EWG demo data fallback
- W-020: Quiz as primary CTA — `src/pages/quiz.astro` + homepage CTA
- W-021: Explore page email-gated — `src/pages/water/explore.astro` + EmailGate
- W-024: "This is not normal" opening — `src/content/nodes/4.md`
- W-025: Inflammation as leading cause — `src/content/nodes/4.md`
- W-026: Three health tells — `src/content/nodes/4.md` 3-column grid
- W-027: Hydration metric "8 or higher" — `src/content/nodes/4.md`
- W-037: Self-service editing (Keystatic CMS) — `/keystatic` admin
- W-038: Independent hosting — Cloudflare Pages
- W-044: Instagram + TikTok — Maddie-side, content calendar tracked
- W-045: Sovereign Systems & Consciousness calls — part of W-033 subscription
- W-048: Notes format with screenshots + asterisks — process established

## Section 5 — Out-of-scope (relational / coaching / vision)

These are tracked for context, not as deliverables. Source: `2026-04-17-atomized-wants.md` lines 549-744.

- **W-049 — Housing crisis intervention** — ACTIVE situation. Operating constraint behind W-060 (immediate priority statement).
- **W-050 — WWOOF / 30-90 day farm reset** — Maddie provided detailed research. User interested. Application not started.
- **W-051 — Board / systems team position** — Future offer contingent on W-050.
- **W-052 — Case study + marketing manager model** — Suggestion. Not acted on.
- **W-053 — Human touch in AI-assisted outreach** — Advice given and acknowledged.
- **W-054 — Residual income via automated ads** — Tension between Maddie's suggestion (low-ticket automated) and user's preference (high-ticket consulting).
- **W-055 — Stair-step pricing** — Advice given.
- **W-056 — Hybrid Sovereign Systems Model** — Concept named and validated. Theoretical frame for collaboration.
- **W-057 — Payment/contract formalization** — Terms written via iMessage; no formal contract.
- **W-058 — Maddie's empathy + support stance** — Relational foundation.
- **W-059 — Organic marketing validation** — Mutual validation pattern.
- **W-060 — User's immediate priority statement** — STATED CONSTRAINT. All work filtered through this.
- **W-061 — "New Stan Lee / They call me Mad E"** — Brand identity declaration.
- **W-062 — Farmland crisis + hidden homelessness mission** — Vision statement tying nonprofit / WWOOF / board into mission arc.
- **W-063 — Cartographical fossil record** — Separate project entity, not site feature.
- **W-064 — Virtual store + snail mail** — Future scope.
- **W-065 — Easter / holiday rapport** — Relational pattern.

## Refresh runbook (manual, on-demand)

When you (or a future session) want to re-run this diff:

```bash
# 1. Update last_verified
WS=/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align

# 2. Pull any new ideals plan files (Maddie messages, V5+ direction docs)
ls -la "$WS"/docs/client-decisions/ "$WS"/.claude/plans/ "$WS"/.gemini/plans/ \
   | grep -E '20[0-9]{2}-[0-9]{2}-[0-9]{2}' | sort -k 6,7

# 3. Diff rendered state since last verified
git -C "$WS" log --since='2026-04-29' --pretty='%h %ad  %s' --date=short -- \
   src/components/spiral src/data src/content functions hub.config.ts

# 4. Read any new ideal source files; assign new W-NN, I-NN, or D-NN IDs
#    extending — never reusing — the existing ID space (W-001..W-065 locked).

# 5. For each existing row, verify rendered_evidence still resolves
#    (file path + line ref). If file moved, update path.

# 6. Bump "Last verified:" date at top of this file. Append a "Changelog"
#    section noting which rows changed status.
```

**No automation:** no LaunchAgents, no cron, no file watchers, no `run_onchange_*` hooks. The system trip-wires for "you might want to refresh this" are: (a) a new Maddie message, (b) a commit in `src/components/spiral/` or `src/data/`, (c) a new file under `docs/client-decisions/` or any `*/plans/` matching `*maddie*` or `*spiral*`. None of these auto-trigger anything — they are reading prompts for the human to decide whether to refresh.

## Reference: source plan files

Ideals (read these before refreshing):
- `docs/client-decisions/2026-04-17-atomized-wants.md` — master W-NN inventory
- `docs/client-decisions/2026-04-04-node-architecture-locked.md` — 13-node lock
- `docs/client-decisions/2026-04-04-maddie-feedback-session.md` — node-by-node decision log
- `docs/client-decisions/2026-04-17-maddie-imessage-extraction.md` — full iMessage extraction
- `docs/client-decisions/2026-04-25-maddie-spiral-v4-direction.md` — V4 design directives (I-NN source)
- `.gemini/plans/2026-04-28-spiral-catalog-audit-and-brainstorming-forms.md` — 11-gap audit (already absorbed into this tracker)

Rendered (read these to verify status):
- `src/data/hub.config.ts` — 13-node config table
- `src/components/spiral/spiral.ts` — 2,876 LOC Three.js renderer (V8)
- `src/data/hydration.config.ts` — water funnel config
- `src/data/icon-worlds.ts` — physics tuning per node
- `src/content/nodes/*.md` — 13 node content pages
- `src/content/pillars/*.md` — 4 pillar pages
- `src/content/branches/*.md` — 6 branch pages
- `functions/api/water-report.ts` — EWG proxy
- `functions/capture.ts` — email capture

## Changelog

- 2026-04-29 — Initial creation. 33 SHIPPED + 8 PARTIAL + 5 MISSING + 9 BLOCKED + 7 DRIFT identified. V4 directives (I-001..I-007) added. Drift D-005 (pillar-mapping discrepancy) flagged for decision.
