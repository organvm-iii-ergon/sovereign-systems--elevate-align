# Plan: CLAUDE.md improvements for sovereign-systems--elevate-align

## Context

The user invoked `/init` in plan mode. A CLAUDE.md already exists at the repo root and is extensive, but multiple sections describe outdated reality:

- **`/quiz` description is wrong** — current text says "name+email gate → pillar routing options"; actual implementation is a 5-question affinity flow that scores users into 1 of 13 spiral nodes (commit `7f09cfd`).
- **Capture pipeline location is wrong** — `functions/capture.ts` is described as a Cloudflare Function; it was migrated to `src/pages/capture.ts` (Astro APIRoute) with multi-sink dispatch to KV + GHL webhook (commit `c59e6fa`).
- **Page count is misleading** — claims "28 pages + 404"; actual is 13 source files generating ~28 routes via dynamic templates.
- **Nav variants undocumented** — `de35974` added a spiral-first nav variant alongside pillar-first, runtime-toggled by `?variant=` querystring. Not mentioned.
- **Configuration layering invisible** — only `hub.config.ts` and `icon-worlds.ts` are listed in Key Files. The codebase actually has a 6-file layered ontological system in `src/data/` (sacred-geometry-primitives, lens-geometry, naming-chains, hydration.config) that's load-bearing for the spiral semantics. A future agent editing node metadata without seeing this layer will produce drift.
- **Keystatic CMS undocumented** — `keystatic.config.ts` is fully configured at repo root with `pillars` and `branches` collections; no mention in CLAUDE.md.
- **Content collection schema incomplete** — CLAUDE.md mentions `branches/` and `pillars/`. Actual `content.config.ts` defines a third collection (`nodes`) with rich schema (intention, steps, practiceTable, toolsTable, reflectionPrompts) — undocumented.
- **Missing routes** — `/for/[persona]` exists in `src/pages/for/[persona].astro`, completely undocumented.
- **No-tests fact unstated** — package.json has no test/lint/format scripts. A future Claude looking for these will waste time. Stating absence is a fact worth saving.

The auto-generated sections at the bottom (System Context, Active Directives, Live System Variables, Logos Documentation Layer, etc.) are populated by `organvm` pipeline scripts and **must NOT be touched**.

## Approach

Surgical edits to the **manual portion** of CLAUDE.md only (the section before `## System Context (auto-generated — do not edit)` at the line where auto-generated content begins). Preserve overall structure: same H2 sections in same order. Replace stale content inline; add 2 new H2 sections where the existing structure has clear gaps:

1. **New: `## Configuration Layering`** — describes `src/data/*.ts` as a layered ontological system. Goes between **Key Files** and **Content Directories**.
2. **New: `## Capture Pipeline`** — documents the multi-sink Astro APIRoute. Goes between **Page Map** and **Content Editing Notes**.

Everything else is in-place edits.

## Specific changes (file-by-file diff plan)

**Target file:** `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/CLAUDE.md`

### Change 1 — `## Tech Stack` section
Add a fourth bullet for **Markdoc + Keystatic CMS** since the Astro config registers `markdoc()` and `keystatic()` integrations. Note the absence of tailwind.config.js (CSS-first config via `@tailwindcss/vite`) is already correct.

### Change 2 — `## Commands` section
Add the missing `npm run deploy` (build + wrangler pages deploy). Add a one-liner noting **no test/lint/format tooling** is configured (so a future agent doesn't search for it). Add `npm run parse-citations` and `npm run count-files` as utility scripts (they exist in package.json).

### Change 3 — `## Key Files` table
Add rows for:
- `src/data/sacred-geometry-primitives.ts` — immutable geometric essences (PHI, vertex counts) per EnvVar identity
- `src/data/lens-geometry.ts` — cross-tradition lens modulations (Egyptian, Vedic, Jungian, etc.) that transform essences into rendered forms
- `src/data/naming-chains.ts` — surface bindings (EnvVar × Lens → name); decouples immutable identity from mutable surface
- `src/data/hydration.config.ts` — water-funnel data model (WaterReport, Contaminant)
- `src/pages/capture.ts` — Astro APIRoute; multi-sink dispatch (KV + GHL + extension points)
- `keystatic.config.ts` — CMS schema for pillars + branches collections
- `content.config.ts` — Astro content collection schemas (branches, pillars, nodes)
- `astro.config.mjs` — adapter (cloudflare), integrations (sitemap, markdoc, keystatic), dev tunneling allowlist

### Change 4 — New `## Configuration Layering` section (after Key Files)
~10 lines explaining the layered semantic system:

> The codebase separates **immutable identity** from **mutable surface** through a 5-layer structure in `src/data/`:
>
> 1. **`hub.config.ts`** — master metadata, the single source of truth for node count, pillar definitions, domain/GHL URLs.
> 2. **`sacred-geometry-primitives.ts`** — immutable geometric essence per `EnvVar` (PYR, OCULUS, DYAD, etc.); vertex counts, PHI exponents, symmetry types.
> 3. **`icon-worlds.ts`** — per-node visual physics (particles, palette, gravity, behavior).
> 4. **`lens-geometry.ts`** — tradition-specific transformations (vertex addends, scale multipliers); how essences appear through Egyptian / Vedic / Jungian / etc. lenses.
> 5. **`naming-chains.ts`** — bindings (EnvVar × Lens → surface name); chronological lineage for any node.
>
> Edits to node metadata in `hub.config.ts` may have invisible knock-on effects in icon-worlds (theme bundle), naming-chains (lens bindings), and quiz scoring (theme tags must match button labels). Always check all 5 layers before changing node identity.

### Change 5 — `## Content Directories` section
Add `nodes/` to the directory listing, with note that node files (1-13) carry richer schema than branches/pillars (intention, steps, practiceTable, toolsTable, reflectionPrompts). Reference `content.config.ts` for full schema.

### Change 6 — `## Page Map` section
Replace the misleading "28 pages + 404" framing with: "**13 source files generate ~28 routes via dynamic templates.**" Then keep the table but:
- Update `/quiz` row to: "5-question affinity flow → scores user into 1 of 13 spiral nodes (max 12 points: phase + pillar + theme matches) → result panel + optional capture"
- Add `/for/[persona]` row with brief description
- Add `/capture` row noting it's a POST-only APIRoute (not a renderable page)
- Note the `?vessel=` and `?variant=` querystring overrides in a paragraph below the table — these are **live A/B flags requiring no redeploy**.

### Change 7 — New `## Capture Pipeline` section (after Page Map)
~12 lines documenting the multi-sink dispatch:

> **Endpoint:** `POST /capture` — `src/pages/capture.ts` (Astro APIRoute; replaces prior `functions/capture.ts` because `_worker.js` takes precedence on Cloudflare).
>
> **Sinks (additive, isolated):**
> 1. **KV** (`SUBMISSIONS` namespace) — full payload + ipHint (last octet only). Optional; degrades gracefully.
> 2. **GHL webhook** (`GHL_WEBHOOK_URL` env var) — fire-and-forget POST. Optional; skips silently if env var unset.
> 3. **Extension points** in place for D1, email, etc.
>
> **Contract:** Always returns 200 for valid email. Quiz UX shows result *before* network completes — this is a UX invariant, not a bug. Sink failures never block response.
>
> **Adding a sink:** new Promise.all branch, no contract change required.

### Change 8 — `## Deploy Configuration` section
- Update first bullet: "Astro Cloudflare adapter generates `_worker.js`; `src/pages/*.ts` (e.g., `capture.ts`) become routes within the worker." Mention `functions/api/water-report.ts` still exists but is now within the worker bundle.
- Add `npm run deploy` (= `npm run build && wrangler pages deploy dist`) as the manual deploy path.
- Note the dev server config in `astro.config.mjs`: `host: true` + allowed hosts list (cloudflare.com, ngrok-free.app, localhost) for tunnel-based dev.

### Change 9 — New mini-section under `## Content Editing Notes`
Add a paragraph on Keystatic:

> **Keystatic CMS** (`keystatic.config.ts`) provides a UI for editing pillars and branches collections. Local mode by default; GitHub mode is configured (repo: `organvm-iii-ergon/sovereign-systems--elevate-align`). Run dev server and navigate to `/keystatic` for the editor UI.

### Change 10 — Preserve everything else verbatim
- `## What This Is` — unchanged.
- `## Canonical Intake` — unchanged.
- `## Project Board` link — unchanged.
- `## Session Close` — unchanged.
- All auto-generated sections from `## System Context (auto-generated — do not edit)` onward — **DO NOT TOUCH**.

## Critical files

- `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/CLAUDE.md` — target
- `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/package.json` — verify scripts list
- `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/astro.config.mjs` — verify integrations
- `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/src/pages/capture.ts` — verify endpoint contract
- `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/src/pages/quiz.astro` — verify scoring details
- `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/src/data/*.ts` (6 files) — verify file list and one-line purposes
- `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/content.config.ts` — verify nodes collection schema

## Verification

1. **Read the updated CLAUDE.md fresh** as if I'd never seen the codebase. Is everything still resolvable to a real file? Is the Configuration Layering section explanatory enough that a new agent would know to check 5 files before editing node identity?
2. **Glob each path I cited** to confirm it exists:
   - `Glob src/data/sacred-geometry-primitives.ts`
   - `Glob src/data/lens-geometry.ts`
   - `Glob src/data/naming-chains.ts`
   - `Glob src/data/hydration.config.ts`
   - `Glob src/pages/capture.ts`
   - `Glob src/pages/for/[persona].astro`
   - `Glob keystatic.config.ts`
3. **Confirm route count** — `Glob src/pages/**/*.{astro,ts}` and count.
4. **Confirm scripts** — Read `package.json` scripts block; ensure my Commands section matches.
5. **Re-read auto-generated boundary** — make sure I didn't touch anything below `## System Context (auto-generated — do not edit)`.
6. **Per global rule** (`Plans are artifacts`): commit and push the updated CLAUDE.md so working state persists remotely.
7. **Per global rule** (`Plan File Discipline`): copy this plan from `~/.claude/plans/frolicking-bubbling-oasis.md` to `<repo>/.claude/plans/2026-04-29-claude-md-improvements.md` so it lives with the project history. (Cannot do during plan mode — only the plan file itself is editable.)

## Out of scope

- Auto-generated CLAUDE.md sections (System Context, Active Directives, Live System Variables, System Density, Dialect Identity, Logos Documentation Layer)
- Code changes (no edits to `.ts`, `.astro`, `.mjs`)
- Project board state changes
- IRF entries
- README.md edits
- AGENTS.md edits

## Risk assessment

- **Low risk:** Pure documentation update; no runtime behavior change.
- **Reversal cost:** Trivial — `git revert` on the doc commit.
- **Blast radius:** Local file only. No shared infrastructure touched.
- **Pre-commit hooks:** Pre-commit config exists (per global CLAUDE.md); markdown is unlikely to trip linters but ShellCheck/yamllint run via `just lint` won't apply here.
