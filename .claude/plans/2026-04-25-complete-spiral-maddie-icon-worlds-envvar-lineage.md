# Complete Outstanding Spiral Work for Maddie — sovereign-systems--elevate-align

> Per CLAUDE.md plan-file discipline this should be filed as
> `2026-04-25-complete-spiral-maddie-icon-worlds-envvar-lineage.md` in
> `~/Workspace/organvm/sovereign-systems--elevate-align/.claude/plans/`.
> System constraint pins me to this path; **after approval, copy this plan
> into the project's `.claude/plans/` with proper dated naming** (universal
> rule #3 — additive, never overwrite).

## Context

The user asked: *"complete all outstanding tasks for align, elevate, Maddie, and the spiral Maddie mentions below"* — referencing the V6 spiral architecture transcribed in the pasted session.

Two prior sessions (transcripts captured) produced significant intellectual work for Maddie's spiral on `sovereign-systems--elevate-align`:

1. **V6 IconWorld physics architecture** designed in `~/.claude/plans/jolly-fluttering-hare.md` (14.5 KB) — themed worlds, cohesion/chaos regimes, per-load uniqueness.
2. **A14 "yes and" 3-commit sequence** verbally approved in the transcript — envVar substrate + NAMING_CHAINS data + `/lineage` page — load-bearing infrastructure for both Maddie's site AND a future multi-lens viewer.
3. **Joseph Campbell / True Names / multi-lens** intellectual chain (PYR, OCULUS, SHATKONA, PADMA, etc.) — captured in transcript only, no durable artifact.

The prior audit (`~/.claude/plans/i-need-you-to-merry-thimble.md`) identified the gap and got user approval but did not execute. Verified by two parallel Explore agents this session: **the gap is still real on disk.**

This plan executes the close-out — strictly scoped to the spiral/Maddie work, NOT the broader Achilles backlog (PRT-048 skill, SYS-156, CI cascade — those remain in `2026-04-25-achilles-session-workload.md`).

## Verified Current State (2026-04-25)

**Repo:** `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/` · branch `main`

**DONE on disk (12 unpushed commits ahead of origin):**
- `interface IconWorld` + types — `src/components/spiral/spiral.ts:391–402`
- `const ICON_WORLDS` 13 entries (Forge of Dawn → Eternal Gold) — `:404–536`
- `worldFor(nodeId)` helper — `:537–538`
- ngrok tunnel live at `symbolistical-amiya-mitigable.ngrok-free.dev`
- Bash permissions for cloudflared/ngrok/pkill in `~/.claude/settings.local.json`

**PARTIAL (data added, behavior unchanged) — load-bearing miss:**
- Physics loop at `spiral.ts:1744` still reads `PHASE_MIX[universe.materia]`
- Zero call sites for `worldFor(`, `world.particleBehavior`, `world.gravity`, `world.thermalAmpMul`, `world.accentPalette`
- The 184-line IconWorld block is **inert** — it does not change rendering

**NOT DONE:**
- `src/data/naming-chains.ts` — does not exist
- `/lineage` or `/nodes/[id]/lineage` page — does not exist
- `envVar` field on `SpiralNode` interface in `src/data/hub.config.ts`
- Cohesion regime (K-nearest + phase-centroid + velocity alignment)
- Chaos regime (repulsion + supernovae + Pareto entropy + decay/respawn)

**UNCOMMITTED in working tree:**
- `M src/components/spiral/spiral.ts` (IconWorld block)
- `M astro.config.mjs` (ngrok allowedHosts)

## Scope Boundary (what this plan does NOT do)

- Does NOT build PRT-048 Domain Ideal-Whole skill (separate authorization path).
- Does NOT touch SYS-156 GitHub notification backlog.
- Does NOT touch CI cascade across 14 repos.
- Does NOT design the multi-lens viewer UI itself — only delivers the **data substrate** (envVar + NAMING_CHAINS) that a future viewer would consume.

## Implementation Plan — 6 Atomic Commits

Sequential, each commit independently revertable. Order matters: data substrate before consumers.

### Commit 1 — Decide & commit IconWorld data layer
**Why first:** Mid-implementation pause is the highest-risk failure mode. Either commit the working-tree IconWorld block with explicit "data-only, physics not yet wired" message, or revert. Cannot stay in working tree across sessions.

**Action:** Commit current modifications with this message body:
```
feat(spiral): IconWorld type + 13-entry table (data-only, physics wiring pending)

Adds the IconWorld substrate (Element/Biology/ParticleBehavior unions,
13 themed-world entries, worldFor() helper). NOT YET CONSUMED by physics
loop — loop at spiral.ts:1744 still uses PHASE_MIX[universe.materia].

Wiring follows in subsequent commit (cohesion + chaos regimes).
See ~/.claude/plans/jolly-fluttering-hare.md for full V6 architecture.
```
Also includes `astro.config.mjs` ngrok allowedHosts change in same commit (related to Maddie share-tunnel).

**Files:** `src/components/spiral/spiral.ts`, `astro.config.mjs`

### Commit 2 — envVar substrate on SpiralNode
**Add to `src/data/hub.config.ts`:**
- `type EnvVar = 'PYR' | 'OCULUS' | 'DYAD' | 'PYRAMIS' | 'HYDOR' | 'MANDORLA' | 'KENOSIS' | 'SHATKONA' | 'PADMA' | 'BODHI' | 'TETRAD' | 'OKTAEDRON' | 'ANKH';`
- Add `envVar: EnvVar` field to `SpiralNode` interface
- Bind 13 nodes (Forge of Dawn → Eternal Gold) to their True Names

**Mapping** (drawn from the transcript's metaphysical-naming work):
| Node (Maddie surface) | envVar (substrate) |
|---|---|
| Forge of Dawn | PYR |
| Inner Witness | OCULUS |
| Sacred Pair | DYAD |
| Body Temple | PYRAMIS |
| Flowing Source | HYDOR |
| Vesica Gate | MANDORLA |
| Empty Vessel | KENOSIS |
| Star of Union | SHATKONA |
| Lotus Bloom | PADMA |
| Awakened Mind | BODHI |
| Four Pillars | TETRAD |
| Crystal Heart | OKTAEDRON |
| Eternal Gold | ANKH |

(Final node→envVar mapping confirmed from `hub.config.ts` actual node IDs at execution time — substrate names are stable.)

**Files:** `src/data/hub.config.ts`

### Commit 3 — NAMING_CHAINS data file
**Create `src/data/naming-chains.ts`:**
```ts
export type Lens =
  | 'greek-classical' | 'sanskrit-vedic' | 'egyptian'
  | 'christian-mystical' | 'theosophical' | 'jungian'
  | 'modern-wellness' | 'physics-elemental';

export type EnvVar = /* re-export from hub.config */;

export interface SurfaceBinding {
  envVar: EnvVar;        // immutable referent
  lens: Lens;            // tradition naming it
  era?: string;          // "~500 BCE" / "21st c"
  name: string;          // "PYR" / "Agni" / "Feel Good First"
  script?: string;       // πῦρ / अग्नि
  connotation: string;   // one-line essence
  source?: string;       // Heraclitus / Vedas / Maddie 2026
}

export const NAMING_CHAINS: SurfaceBinding[] = [ /* seed 13 × ~6 ≈ 80 entries */ ];

export function chainsFor(envVar: EnvVar): SurfaceBinding[];
export function viewThroughLens(lens: Lens): SurfaceBinding[];
```

**Seed minimum:** 13 envVars × 6 lenses (Greek / Sanskrit / Egyptian / Christian-mystical / Jungian / modern-wellness) = ~78 entries. Ship with that; expand later.

**Files:** `src/data/naming-chains.ts` (new)

### Commit 4 — `/lineage/[envvar]` page
**Create `src/pages/lineage/[envvar].astro`:**
- Dynamic route consuming `chainsFor(envvar)`
- Renders chronological chain (era-sorted) as the lineage chart
- Per-node CTA from spiral hover (link from Maddie's spiral nodes to `/lineage/PYR` etc.)
- Layout reuses existing site shell (no new design system work)

Add subtle hover-link from spiral node → `/lineage/{envVar}` in `Spiral.astro` or whichever component handles hub presentation.

**Files:** `src/pages/lineage/[envvar].astro` (new), `src/components/spiral/Spiral.astro` (hover-link addition)

### Commit 5 — Wire ICON_WORLDS into physics + regimes
**Edit `src/components/spiral/spiral.ts`:**
1. Replace `PHASE_MIX[universe.materia]` lookup at `:1744` with `worldFor(node.id).phaseMix` (or equivalent — confirm exact field name from `IconWorld` interface).
2. Branch physics on `world.particleBehavior`:
   - `'cohesion'` (symbols variant) → K-nearest-neighbor index + phase-centroid attraction + velocity alignment
   - `'chaos'` (stars variant) → inter-particle repulsion + Pareto entropy injection + supernova bursts + decay/respawn
3. Apply `world.gravity` vector, scale thermal amplitude by `world.thermalAmpMul`, route accent colors through `world.accentPalette`.

Reference: `~/.claude/plans/jolly-fluttering-hare.md` — "Files to modify" section has the exact integration points.

**Test in browser** at the ngrok URL: switch `?variant=symbols` vs `?variant=stars` — confirm visible behavior divergence.

**Files:** `src/components/spiral/spiral.ts`

### Commit 6 — Push & share
- `git push origin main` — clears the now ~17-commit-ahead state.
- Confirm ngrok tunnel still live; if dead, re-spawn.
- Maddie's link: `https://symbolistical-amiya-mitigable.ngrok-free.dev/` (or new ngrok URL if tunnel rotated).

## Critical Files

| File | Action | Lines |
|---|---|---|
| `src/components/spiral/spiral.ts` | Commit IconWorld + wire physics | 391–538 (existing), 1744 (replace) |
| `src/data/hub.config.ts` | Add `EnvVar` type + `envVar` field + bindings | interface block + 13 node entries |
| `src/data/naming-chains.ts` | Create with `SurfaceBinding[]` + helpers | new file (~150 lines) |
| `src/pages/lineage/[envvar].astro` | Create dynamic lineage route | new file (~80 lines) |
| `src/components/spiral/Spiral.astro` | Add hover-link to `/lineage/{envVar}` | 1 small block |
| `astro.config.mjs` | Already modified (ngrok hosts) — commit alongside #1 | line 20 area |

## Reused Existing Code

- `worldFor()` helper at `spiral.ts:537` — already defined, just needs to be **called**.
- `loadSalt` per-load uniqueness primitive — already exists, no rebuild needed.
- Existing `Spiral.astro` shell + hub render — no rewrite.

## Memory Capture (post-implementation)

After commit 6, update memory:
- Update `project_artifact_spiral_maddie.md` with V6 ship state (commit hashes, IconWorld wired, envVar substrate live).
- Create `project_artifact_naming_chains.md` for the multi-lens substrate (envVar enum, lens taxonomy, chainsFor/viewThroughLens API, seed coverage).
- Atomize as **DONE-A14a through DONE-A14-3** in the IRF (so the Joseph Campbell / True Name / envVar / multi-lens design chain persists beyond transcript).

## Verification

End-to-end sanity check after all 6 commits:

```bash
cd ~/Workspace/organvm/sovereign-systems--elevate-align
git status                      # clean working tree
git rev-list --count origin/main..HEAD  # → 0 (pushed)
grep -nE 'worldFor\(|world\.particleBehavior|ICON_WORLDS\[' src/components/spiral/spiral.ts
                                # → ≥3 call sites in physics loop
ls src/data/naming-chains.ts    # exists
ls src/pages/lineage/           # contains [envvar].astro
npm run dev                     # local server starts clean
```

Browser tests via ngrok URL:
1. `/` — spiral renders, hover any node → tooltip shows surface name.
2. `/?variant=symbols` — visibly cohering / clustering particle behavior.
3. `/?variant=stars` — visibly chaotic / supernova / scattered behavior.
4. Hover a spiral node → click hover-link → lands on `/lineage/PYR` (or whichever envVar).
5. `/lineage/PYR` — chronological chain renders (Greek → Sanskrit → Egyptian → Christian-mystical → Jungian → modern-wellness).

Send Maddie the ngrok URL when green.

## Out of Scope (explicit deferral)

- **Multi-lens viewer UI** (faith/religion/mythology/psychology stacked filter) — only the data substrate ships here. Viewer is a separate plan.
- **Connection to user's older personalized journal** (Siddhartha-through-physics) — separate design pass needed; do not collapse into Maddie's site.
- **PRT-048 Domain Ideal-Whole skill build** — pending separate authorization.
- **SYS-156 / CI cascade / IRF hygiene** — Achilles workload, separate plan.

## Risk Notes

- **Physics-wiring commit (#5) is the riskiest.** Visual regression possible if `worldFor()` returns undefined for any node ID. Add a defensive `worldFor(id) ?? DEFAULT_WORLD` guard.
- **Cohesion regime K-NN complexity** — N=13 nodes × ~80 particles each = ~1,000 particles total. K-NN per frame at 60fps is fine; no spatial index required.
- **Chaos regime supernova bursts** — cap simultaneous bursts to prevent thermal-amplitude runaway.
- **The 12 unpushed commits** include earlier V5 work — pushing #1-6 will also push those. Verify nothing in the unpushed range was experimental-only before pushing.
