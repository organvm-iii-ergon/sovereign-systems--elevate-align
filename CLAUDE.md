# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**Sovereign Systems Spiral** — multi-domain Astro 6 website for client Maddie's 4-pillar health and business brand. Hub-and-spoke architecture: `elevatealign.com` is the central hub; `stopdrinkingacid.com` powers the Water/Physical Sovereignty funnel; `eaucohub.com` hosts the Financial Sovereignty business arm.

- **Organ:** III (Commerce / Ergon)
- **Client IP boundary:** content = client's IP (do not distribute or reuse); code/architecture = studio IP
- **Deploy:** Cloudflare Pages, auto-deploy on push to `main`

## Sibling AI Guidance

Three other AI/human guidance files live at repo root: `AGENTS.md` (vendor-agnostic agent contract), `GEMINI.md` (Gemini-specific), `README.md` (human overview). When a fact appears in more than one, **`AGENTS.md` is canonical for tech-stack and command claims** (commit `667e808` — "AGENTS.md tech-stack truth"). CLAUDE.md is canonical for Claude-specific protocols: capture pipeline, content genome handling, governance scripts, session close, and the conventions documented below.

## Universal Mandates (live in memory, not CLAUDE.md)

Cross-stream rules that govern _all_ code/content changes are recorded as feedback memories at `~/.claude/projects/-Users-4jp-Workspace-organvm-sovereign-systems--elevate-align/memory/feedback_*.md` and indexed in `MEMORY.md` (auto-loaded at session start). Do not duplicate the rule text in CLAUDE.md (drift risk).

**Scope rule:** memory entries are universal unless their `description:` frontmatter says otherwise. CLAUDE.md is the _index_; memory is the _source_. `MEMORY.md` is auto-truncated past line 200 — when the index grows beyond that, the underlying `feedback_*.md` files remain readable directly via filesystem; never let truncation hide active mandates.

As of 2026-05-01 the active universal mandates:

- **M1 multi-citation** (`feedback_multi_citation_mandate.md`) — every assertion needs ≥2 independent citations.
- **M2 no hardcoded dynamic data** (`feedback_no_hardcoded_dynamic_data.md`) — names, links, statistics, costs, affiliate URLs, contaminant thresholds, prices live in env vars or external config; never inline in source.
- **M3 macro→atom decomposition + iteration tracking** (`feedback_macro_to_atom_tracking.md`) — client asks AND 4jp's prompts each live in canonical sources, recursively decomposed, mapped to commits, with continuous diff/spread + per-audience visual surfaces. Substrate grammar: `~/Workspace/meta-organvm/organvm-corpvs-testamentvm/data/prompt-registry/GRAMMAR.md`.

When a new universal rule is established, save the feedback memory FIRST and add a one-line entry above. CLAUDE.md is the index pointer; memory is the source.

## Cross-Client IP Isolation (`.private/`)

`.private/` at repo root holds artifacts that mix multi-client IP (e.g., orchestration showcases referencing both Maddie and other studio clients). Gitignored except for `.private/README.md` (rule at `.gitignore:33-34` — `.private/*` + `!.private/README.md`). Use it when an artifact is operationally useful but would leak IP if filed in a single client's repo. See `feedback_private_directory.md` in scope memory.

## Tech Stack

- **Astro 6** — static site generator, zero JS by default; Cloudflare adapter (`@astrojs/cloudflare` 13.x, which runs the dev server in workerd via `@cloudflare/vite-plugin`). Migrated from Astro 5 on 2026-05-24 to clear all dependency CVEs — see `docs/design-proposals/2026-05-24-astro-6-migration-scope.md`. Note: `vite` is pinned to `^7.3.3` in `package.json` `overrides` to dedupe against `@tailwindcss/vite`'s vite 8 (the duplicate broke the cloudflare vite-plugin runner-worker).
- **Tailwind CSS 4** — via `@tailwindcss/vite` plugin (no `tailwind.config.js` — CSS-first config)
- **TypeScript** — strict, no `any` (escapes were dropped in commit `0322e37`)
- **Three.js** — `src/components/spiral/spiral.ts` drives the 3D helix visualization: tapered helix, `OrbitControls`, `MeshPhysicalMaterial` orbs, `FogExp2`, and a post-processing pipeline (`EffectComposer` → `RenderPass` → `UnrealBloomPass` → `OutputPass`). IconWorlds physics gives each node its own particle behavior (cohesion for symbol-mode, chaos for star-mode). Node colors map to a 13-step chakra-aligned spectrum via `chakraColorForNode` (spiral.ts:1248); default vessel mode is `'hybrid'` (`hub.config.ts:147` — `spiralVesselMode: 'hybrid'`). Source has no version marker; treat the file as authoritative.
- **Markdoc + Pages CMS** — Markdoc renders rich content blocks. Content editing is via [Pages CMS](https://pagescms.org) (`.pages.yml` at repo root), a git-based hosted editor at app.pagescms.org for the pillars and branches collections. (Replaced Keystatic in the Astro 6 migration — no `@keystatic/astro` supports Astro 6; see `keystatic#1515`.)

## Commands

```bash
npm run dev              # Dev server at localhost:4321 (host:true; tunnel-friendly)
npm run build            # Production build → dist/
npm run preview          # Preview production build locally
npm run deploy           # test:all + wrangler pages deploy dist/client (project: sovereign-systems-spiral)
npm test                 # scripts/test.mjs — content-shape validator (frontmatter + schema invariants) + vacuum gate (scripts/vacuum-gate.mjs)
npm run check            # astro check — TypeScript / Astro diagnostics
npm run test:all         # test + check + production build (the CI-style gate)
npm run format           # prettier --write . (format all files)
npm run format:check     # prettier --check . (Trunk runs this PR-scoped in CI)
npm run parse-citations  # Regenerate citations from source bibliography
npm run count-files      # Repo file census utility
```

**`prebuild` auto-runs** `node scripts/generate-citations-json.js && node scripts/generate-library-manifest.mjs` before every `npm run build` (npm lifecycle hook in `package.json`). Citations JSON and the library manifest are rebuilt on every build — do not commit a stale snapshot expecting it to survive deploy.

**No ESLint or Vitest — but Prettier IS configured** (`.prettierrc.json` + `.prettierignore`; `singleQuote`, `prettier-plugin-astro`). Quality gates: TypeScript strictness (`npm run check` / `astro check`), `npm test` (a Node assertion script validating content-collection frontmatter + schema invariants), and Prettier formatting — the last enforced PR-scoped via `trunk-io/trunk-action` in CI (`.github/workflows/ci.yml`), with no committed `.trunk/` config. Run `npm run format:check` before broad formatting work. There is no ESLint, and the Prettier config is `.prettierrc.json`, not `prettier.config.*`.

## Key Files

| File                                         | Purpose                                                                                                                                                                                                                                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/hub.config.ts`                     | Master metadata — `Pillar`, `Branch`, `SpiralNode` definitions; `Phase` / `EnvVar` / `QuizTheme` / `VesselMode` / `NavVariant` types; domain map; GHL URLs; UI defaults                                                                                                                     |
| `src/data/icon-worlds.ts`                    | Per-node visual physics — `Element`, `Biology`, `ParticleBehavior`; 13 themed `IconWorld` records (one per node)                                                                                                                                                                            |
| `src/data/sacred-geometry-primitives.ts`     | Immutable geometric essences per `EnvVar` — vertex counts, PHI exponents, symmetry types                                                                                                                                                                                                    |
| `src/data/lens-geometry.ts`                  | Tradition lenses (Egyptian / Vedic / Jungian / etc.) — modulations applied to essences (vertex addends, scale multipliers)                                                                                                                                                                  |
| `src/data/naming-chains.ts`                  | Surface bindings (`EnvVar` × `Lens` → name); decouples immutable identity from mutable surface; exports `chainsFor(envVar)` and `viewThroughLens(lens)`                                                                                                                                     |
| `src/data/hydration.config.ts`               | Water-funnel data model — `WaterReport`, `Contaminant` (zip-code lookup, EWG limits)                                                                                                                                                                                                        |
| `src/data/citations.ts`                      | Citations source for the research page (regenerated by `npm run parse-citations`)                                                                                                                                                                                                           |
| `src/data/quiz.config.ts`                    | Externalized quiz copy — `quizQuestions` (5 × 4 answers), `quizResultCopy`, `quizCaptureCopy`, `quizEmbedCopy`. Result-panel templates use `{placeholder}` token substitution, NOT functions — `JSON.stringify` strips function values when embedded in `data-*` attrs for client hydration |
| `scripts/vacuum-gate.mjs`                    | Build gate enforcing Constitutional Axiom #1 ("N/A is a vacuum"). See dedicated section below                                                                                                                                                                                               |
| `src/components/spiral/spiral.ts`            | Three.js 3D helix — tapered spiral with OrbitControls, 3D orb meshes, micro-motion, IconWorlds physics; exports `initSpiral(container, nodes, variant, vesselMode)` returning a cleanup fn                                                                                                  |
| `src/components/spiral/SpiralIsland.astro`   | Astro island wrapper — mounts spiral via dynamic import; reads `?vessel=` / `?variant=` querystring overrides                                                                                                                                                                               |
| `src/components/spiral/SpiralFallback.astro` | Static SVG fallback for no-JS environments                                                                                                                                                                                                                                                  |
| `src/layouts/Base.astro`                     | Root HTML layout — head, fonts, global styles, dual nav (pillar-first default; spiral-first variant)                                                                                                                                                                                        |
| `src/pages/capture.ts`                       | Astro APIRoute — POST `/capture`; multi-sink dispatch (KV + GHL webhook + extension points). Replaces prior `functions/capture.ts`.                                                                                                                                                         |
| `src/pages/quiz.astro`                       | 5-question affinity flow → node-placement scoring → result panel + optional capture                                                                                                                                                                                                         |
| `src/pages/lineage/[envvar].astro`           | Naming chains substrate — renders all lens bindings for one `EnvVar`                                                                                                                                                                                                                        |
| `src/content.config.ts`                      | Astro content collection schemas (`branches`, `pillars`, `nodes`) — Astro 6 Content Layer via the `glob()` loader (legacy `type: 'content'` removed in the migration)                                                                                                                       |
| `.pages.yml`                                 | Pages CMS config — `pillars` + `branches` collections (git-based hosted editor at app.pagescms.org). Replaced `keystatic.config.ts` in the Astro 6 migration                                                                                                                                |
| `astro.config.mjs`                           | Cloudflare adapter; integrations: `sitemap`, `markdoc`; dev tunneling allowlist (cloudflare, ngrok, localhost)                                                                                                                                                                              |

## Configuration Layering

The codebase separates **immutable identity** from **mutable surface** through a layered structure in `src/data/`. Each layer modulates rendering downstream; edits to one layer can have invisible knock-on effects in others.

1. **`hub.config.ts`** — master metadata; the single source of truth for node count (13), pillar definitions (4), branch list (6), domain/GHL URLs, and UI defaults.
2. **`sacred-geometry-primitives.ts`** — immutable geometric essence per `EnvVar` (PYR, OCULUS, DYAD, PYRAMIS, HYDOR, MANDORLA, KENOSIS, SHATKONA, PADMA, BODHI, TETRAD, OKTAEDRON, ANKH); vertex counts, PHI exponents, symmetry types.
3. **`icon-worlds.ts`** — per-node visual physics (particles, palette, gravity, behavior); one `IconWorld` per node.
4. **`lens-geometry.ts`** — tradition-specific transformations (Egyptian, Sanskrit-Vedic, Greek-classical, Christian-mystical, Jungian, physics-elemental, modern-wellness); how essences appear through each lens.
5. **`naming-chains.ts`** — bindings (`EnvVar` × `Lens` → surface name); `chainsFor(envVar)` returns chronological lineage, `viewThroughLens(lens)` returns all 13 nodes through one tradition.

**When changing node identity:** check all 5 layers. Adding a `QuizTheme` tag, for example, requires both `hub.config.ts` (node theme list) AND `src/pages/quiz.astro` (button labels must match exactly).

## Landing Engine

`src/lib/landing-engine/` is a declarative composer for `/for/[persona]` routes (commit `3d8cabd`): three data layers (`personas.ts`, `narratives.ts`, `sections.ts`) feed `compose.ts` (pure), which produces the section list rendered by section components in `src/components/landing/`. **Adding a persona to `personas.ts` spawns a new `/for/<id>` page automatically** via `getStaticPaths` in `src/pages/for/[persona].astro` — no route-file edit required.

## Content Directories

All client-editable content lives in Markdown files:

```text
src/content/
  branches/    # 6 branch pages (gut-hormones, fertility, athletic, autoimmune, cancer-support, sustainability)
  pillars/     # 4 pillar pages (physical, inner, identity, financial)
  nodes/       # 13 spiral node pages — richer schema than branches/pillars
```

Frontmatter schema is enforced by `content.config.ts` — any new file must include all required fields.

**Node schema is the deepest** — beyond `title` and `nodeId`, supports optional `subHeader`, `intention`, `steps[]` (`{title, text}`), `practiceTable[]` (`{science, sacred, soul}`), `toolsTable[]` (`{tool, purpose, sacred}`), `reflectionPrompts[]`, and `closingLine`. All optional except `title` and `nodeId`. See `content.config.ts` for the Zod definitions.

## Content Genome

The site is powered by an **atom registry** — content units extracted from client conversations, each carrying a 17-field metadata schema (signal class, pillar, phase, citations, linked issues, etc.). README.md cites the current corpus census (1,821 atoms; 1,153 SIGNAL / 557 CONTEXT / 111 NOISE; 1,343 linked to issues; 263 citations). Treat README as the authoritative count for any given session — this CLAUDE.md will drift.

Regenerate after content changes:

```bash
bash scripts/build-atom-registry.sh
python3 scripts/link-atoms-to-issues.py --write
```

## Governance Scripts

**Hard rule: no direct project-board edits.** All board mutations go through config-driven scripts so state transitions are auditable and reversible. Config lives at `.config/board.config.json`.

```bash
bash scripts/transition-issue.sh <issue#> --status <STATUS> --reason "why"  # the gatekeeper
bash scripts/sync-tracking-table.sh --write                                  # board → tracking table
bash scripts/audit-board.sh                                                  # drift + missing fields
bash scripts/detect-redundancy.sh                                            # duplicate issues
bash scripts/setup-board.sh --dry-run                                        # board scaffolding
```

## Vacuum Gate (Axiom #1)

`scripts/vacuum-gate.mjs` runs as part of `npm test`, which CI invokes via `npm run test:all` in `.github/workflows/ci.yml` on every push and PR (both `build` and `deploy` jobs). It scans `src/data/hub.config.ts` and `src/data/hydration.config.ts` for empty config strings (and `src/content/{pillars,branches}/*.md` for empty required frontmatter). Every detected vacuum is checked against an in-file `TRACKED_VACUUMS` map (field-key → GH issue ref). UNTRACKED vacuums fail the build.

**Why allow-list rather than live `gh` query:** deterministic, no network on test, explicit context for any reader of the gate. The map is the truth source — `.config/board.config.json` does NOT contain an `issues[]` array (the project board lives in GH Projects #5; that JSON is metadata for the transition scripts only).

**Resolution loop for a tracked vacuum:** populate the value in the source config → remove its entry from `TRACKED_VACUUMS` → close the underlying GH issue. The gate fails-closed if you populate without removing the entry (it sees no vacuum + a stale tracker), so the three steps must move together.

**Adding a new vacuum:** file a GH issue (apply `vacuum` label), then add the entry to `TRACKED_VACUUMS`. Without the GH issue the gate refuses to acknowledge the vacuum as named work.

## Hook Noise Expectation

The PreToolUse:Write hook prints `HARD BLOCK — LaunchAgent creation is forbidden` on every Write tool call. **The print is universal; the block is conditional.** The hook fires only as a guard when the target path matches LaunchAgent danger patterns: `.plist` extension, `~/Library/LaunchAgents/` directory, or any `launchctl` invocation. If your target is none of those, the print is informational and the write proceeds.

If your target _does_ match (you're writing a `.plist` to `~/Library/LaunchAgents/` or planning a `launchctl` call), **STOP** — never override. The rule exists because every prior LaunchAgent incident froze the machine; on-demand CLI only is the hard rule.

This applies generally: future safety hooks may follow the same shape (universal print + conditional block). Read the hook message, verify your target path, decide.

## Project Manifest

`scripts/generate_project_manifest.py` produces a dated annotated bibliography of the entire repo corpus to `docs/manifests/YYYY-MM-DD-project-manifest-annotated-bibliography.{md,json}`. Deterministic UIDs, thread-grouped, content-previewed for text/Markdown/JSON/DOCX/PDF, SHA-256 per file. Excludes `.git`, `node_modules`, `dist`, `.astro`, `.netlify`, `.wrangler`, `output`, and `docs/manifests/` itself. Re-run on any session that materially changes the corpus.

## Canonical Intake

- `docs/handoff-maddie-spiral-path-2026-04-01.md` — mirrored canonical handoff for the 2026-04-01 Maddie Spiral Path intake
- `docs/superpowers/intakes/2026-04-01-maddie-spiral-path-board-atomization.md` — board translation from handoff to executable issue surface
- `.codex/plans/2026-04-01-maddie-spiral-orchestration-assignment.md` — dated orchestration plan preserved as session history

## Session Archives

`docs/archive/YYYY-MM/` is the home for filed conversation-transcript exports (Zed/IDE session logs of the form `# Title` + `**Session ID:** ses_…`). Naming convention: `YYYY-MM-DD-<slug>-ses_<short-id>.md`. Filed transcripts are auto-committed by the conductor pipeline within ~7 minutes of landing on disk under the user's git identity — verify with `git log --oneline -- docs/archive/YYYY-MM/` rather than waiting on a manual commit. Stream-isolation rule: only Maddie-related transcripts go here; Rob's go to `4444J99/hokage-chess/docs/archive/YYYY-MM/`; workspace-meta sessions go to `~/.claude/sessions/YYYY-MM/` mirrored at `meta-organvm/organvm-corpvs-testamentvm/docs/archive/YYYY-MM/`. See `feedback_stream_repo_alignment.md` in scope memory.

## Design Critiques

`docs/critiques/YYYY-MM-DD-<slug>.md` is the home for structured architectural-critique passes — severity-rated findings on usability, visual hierarchy, accessibility, color systems, etc. — produced by review sessions and intended to feed polish work. Distinct from session transcripts (`docs/archive/`) and from intake handoffs (`docs/superpowers/intakes/`): critiques are _evaluative_ deliverables, not records-of-conversation. First exemplar: `2026-04-30-spiral-hero-polish-critique.md` (post-chakra ship, hybrid vessel default). When a Claude Code session uses `isolation: "worktree"` to produce a critique, ensure the artifact is migrated back into main before the worktree is removed — otherwise the critique dies with the branch.

## Evolution Timelines

`docs/timelines/YYYY-MM-DD-<artifact>-evolution-timeline.md` is the home for chronological 3-column evolution transcripts (date | client request | 4jp prompt | version shipped) of a specific artifact across all rounds of iteration. First exemplar: `2026-05-01-spiral-evolution-timeline.md` (Sovereign Systems Spiral Apr 1 → May 1, 7 rounds, 56 commits). Distinct from session archives (records-of-conversation) and from critiques (evaluative): timelines are _historical narrative_ of one named artifact's evolution, with verbatim quotes traceable to primary sources (`meta-organvm/organvm-corpvs-testamentvm/data/corpora/.../prompts-raw.jsonl` and `.specstory/history/*.md` for 4jp; iMessage extracts and dated decision docs for the client).

## Maddie Outbound Drafts

`docs/maddie/YYYY-MM-DD-<topic>.md` is the home for iMessage-ready outbound drafts to Maddie. Plain-text bodies (no markdown bold — iMessage doesn't render it), kept durable so the message Maddie receives matches what's tracked in repo memory. First exemplar: `2026-05-01-outbound-tracks-status.md` (consolidated tracks-status response addressing all four 2026-05-01 messages). Outbounds are NOT auto-sent by any pipeline; they exist as reviewable artifacts the user pastes into iMessage when ready.

## Page Map

**13 source files in `src/pages/` generate ~28 routes** (most expansion via `[id]` / `[slug]` / `[persona]` / `[envvar]` dynamic templates).

| Route               | File                               | Description                                                                                                                                        |
| ------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                 | `src/pages/index.astro`            | Hub — 3D helix hero (85vh), quiz CTA, video, pillar phases + Elevate/Align/Unlock framework (below fold)                                           |
| `/quiz`             | `src/pages/quiz.astro`             | 5-question affinity flow → scores user into 1 of 13 spiral nodes (max 12 points: phase + pillar + theme matches) → result panel + optional capture |
| `/nodes/[id]`       | `src/pages/nodes/[id].astro`       | Dynamic spiral node pages (13 pages — node 5/Water also links to `/water/`)                                                                        |
| `/pillars/[slug]`   | `src/pages/pillars/[slug].astro`   | Dynamic pillar pages (physical, inner, identity, financial)                                                                                        |
| `/lineage/[envvar]` | `src/pages/lineage/[envvar].astro` | Naming-chains substrate — all lens bindings for one EnvVar identity                                                                                |
| `/for/[persona]`    | `src/pages/for/[persona].astro`    | Persona-specific landing (dynamic by persona slug)                                                                                                 |
| `/water/`           | `src/pages/water/index.astro`      | Water mini version — hero, video, education, HydrationNode funnel                                                                                  |
| `/water/#branches`  | (inline in `water/index.astro`)    | Branch grid — accessible from single scrollable water page                                                                                         |
| `/water/quiz`       | `src/pages/water/quiz.astro`       | Local assessment route when GHL URL is empty                                                                                                       |
| `/water/[slug]`     | `src/pages/water/[slug].astro`     | Individual branch deep-dives (6 branches)                                                                                                          |
| `/business/`        | `src/pages/business/index.astro`   | Financial Sovereignty / EauCo Hub landing                                                                                                          |
| `/research`         | `src/pages/research.astro`         | Full research bibliography (email-gated)                                                                                                           |
| `/capture`          | `src/pages/capture.ts`             | POST-only APIRoute (not a renderable page) — see Capture Pipeline below                                                                            |
| `/404`              | `src/pages/404.astro`              | Not-found page                                                                                                                                     |

**Live querystring overrides (no redeploy required):**

- `?vessel={invisible|visible|refracted-star|hybrid}` — toggles spiral vessel-mode rendering
- `?variant={pillar-first|spiral-first}` — toggles nav variant

These are A/B flags wired into `src/data/hub.config.ts` defaults (`ui.spiralVesselMode`, `ui.navVariant`); the querystring takes precedence client-side via `SpiralIsland.astro` and `Base.astro`.

## Capture Pipeline

**Endpoint:** `POST /capture` — `src/pages/capture.ts` (Astro APIRoute; replaces prior `functions/capture.ts` because the Cloudflare adapter's `_worker.js` takes precedence over `functions/`).

**Payload:** `CapturePayload` — `email` (required), `name`, `source`, plus quiz extension fields (`quizNodeId` 1..13, `quizScore` 0..100, `quizPath`, `selectedPillar`, `selectedPhase`).

**Sinks (additive, isolated):**

1. **KV** (`SUBMISSIONS` namespace) — full payload + `ipHint` (last octet only, from `CF-Connecting-IP`). Optional; degrades gracefully if KV not bound.
2. **GHL webhook** (`GHL_WEBHOOK_URL` env var) — fire-and-forget POST with flat JSON envelope. Optional; skips silently if env var unset.
3. **Extension points** in place for D1, email, etc. — additive Promise.all branches.

**Contract:** Always returns 200 `{success: true}` for valid email. Quiz UX shows result _before_ the capture network call completes — this is a UX invariant, not a bug. Sink failures never block the response.

**Adding a sink:** new Promise.all branch; no contract change. **De-identification:** only the last octet (or last `::` segment for IPv6) of the IP is kept.

**Source-string registry** (the `source` field on capture submissions; filter downstream by these). Verify with `grep -n "source:" src/pages/ src/components/`:

- `spiral_quiz` — `/quiz` capture form (`quiz.astro:353`)
- `business-application-waitlist` — `/business/` waitlist form (`business/index.astro:74,105`)

(Note: `quiz.astro:320` logs `source=hub` to the console for analytics — that string is NOT the capture-payload source. Don't conflate.)

## Content Editing Notes

- Edit Markdown files in `src/content/` for copy changes — no code knowledge required
- To update pillar metadata (taglines, colors, URLs, GHL form URLs): edit `src/data/hub.config.ts`
- To add a new branch: create `src/content/branches/<slug>.md` with correct frontmatter, then add an entry to the `branches` array in `hub.config.ts`
- **Pages CMS** (`.pages.yml`) provides a GUI for editing pillars and branches collections — connect the repo at app.pagescms.org (git-based; commits straight to the Markdown files, GitHub OAuth handled by Pages CMS). Replaced Keystatic in the Astro 6 migration (no `@keystatic/astro` supports Astro 6).

## Project Board

[Operating Board](https://github.com/orgs/organvm-iii-ergon/projects/5) — see board for live state. Recent closures: #57 (vessel modes), #56 (quiz node-placement), #55 (mobile polish), #53 (chakra stars).

Critical path complete. Content genome processed. Auto-deploy on push to `main` is operational — the GH#52 token expiry was resolved 2026-05-16 and the `dist/client` publish-path regression was fixed in #170 (`58dc4ac`); recent `main` CI runs are green. Manual `npm run deploy` remains the fallback.

## Triple-Reference Law

Identity by triangulation. Every referenceable work item exists in 3 canonical surfaces. For this project: (a) atomized-wants `W-###` (or `seed.yaml` declaration) in this repo, (b) IRF entry `IRF-XXX-NNN` at `~/Code/organvm/organvm-corpvs-testamentvm/INST-INDEX-RERUM-FACIENDARUM.md`, (c) GitHub issue on this repo's project board.

Threshold classifications per IRF-SYS-078: **3/3 = CONSTITUTED** (active, traceable across all surfaces), **2/3 = EMBRYONIC** (acceptable for blocked work waiting on input), **1/3 = NASCENT** (likely an unfiled vacuum), **0/3 = VACUUM** (Constitutional Axiom #1 violation).

Verify at session close. The principle is identity-by-triangulation: items whose existence is asserted but not triangulated drift into ambiguity. See also `sys-check-pulse` for the triple-pulse instance of the same principle (self/local/remote coherence).

## Deploy Configuration

- **Platform:** Cloudflare Pages (`sovereign-systems-spiral.pages.dev`); auto-deploy on push to `main`
- **Build:** `npm run build` → `dist/`. The Astro Cloudflare adapter (v13, Workers output) produces `dist/client` (static assets — the Pages deploy root) + `dist/server/entry.mjs` (the SSR worker); `src/pages/*.ts` (e.g., `capture.ts`) are bundled into that server worker, _not_ separate Pages Functions. (Astro 5 / adapter 12 emitted a single `dist/_worker.js`; that model is gone — see #170.)
- **Manual deploy:** `npm run deploy` (= `npm run test:all && wrangler pages deploy dist/client --project-name sovereign-systems-spiral`); the fallback when CF auth-on-push fails (the GH#52 token expiry that originally forced manual deploys was resolved 2026-05-16 — auto-deploy is green again).
- **`functions/` directory removed:** the EWG proxy now lives at `src/pages/api/water-report.ts` (Astro APIRoute, same pattern as `capture.ts`). The prior `functions/api/water-report.ts` was unreachable in production — the server worker bundle takes precedence over root `functions/`, which also isn't part of `dist/` — so it 404'd and the funnel silently served demo data. The worker bundle is authoritative for all routes.
- **Multi-domain story is metadata-only.** `src/data/hub.config.ts` declares `domains: { hub, water, business }` for content references; actual multi-domain routing is DNS-level (CNAMEs in Cloudflare), not Astro logic.
  - Primary: `elevatealign.com` (connect via CF dashboard → Custom Domains)
  - Secondary: `stopdrinkingacid.com`, `eaucohub.com` (connect when ready)
- **Dev server (`astro.config.mjs`):** `host: true` + allowed hosts (`*.cloudflare.com`, `*.ngrok-free.app`, `localhost`) for tunnel-based dev with the client.
- `.config/netlify.toml` is legacy (relocated from repo root in hygiene pass `294d071`) — kept for reference but deployment is on Cloudflare.

## Session Close

Close-out is a checklist, not a feeling. Default is **check-all, skip-inapplicable, never check-none**.

1. **Local↔remote = 1:1** — `git rev-list --count origin/main..main` and reverse, both must be 0. Both this repo _and_ any workspace-meta repos touched.
2. **Vacuum gate** — `npm test`. Any new `src/data/*` fields must be in `TRACKED_VACUUMS` map (with GH issue) or filled. UNTRACKED vacuums fail the build.
3. **Additive only** — atomized-wants, IRF, decision docs grow forward; never overwrite. Audit reconciles drift after.
4. **Triple-reference law** (IRF-SYS-078) — verify each new work item in 3 surfaces (see `## Triple-Reference Law` section above). 3/3 CONSTITUTED, 2/3 EMBRYONIC (blocked work OK), <2 → file the missing references.
5. **N/A vacuum law** (Constitutional Axiom #1) — every blank/N/A in atomized-wants, IRF, or `seed.yaml` must become a named vacuum item with researched plan. No bare blanks.
6. **10-index propagation** — for completed/new work, propagate to: IRF (`organvm irf list`), `INST-INDEX-LOCORUM`, `INST-INDEX-NOMINUM`, omega scorecard (`organvm omega status`), `inquiry-log.yaml` (if SGO work), `seed.yaml` (if capabilities changed), CLAUDE.md (if architecture changed), `concordance.md` (if new ID type introduced), GH issues (`gh issue create`/`gh issue close`), and any external handoff doc that needs mirroring into `docs/`. **Applicability rule:** an index is applicable if today's commits/decisions touched its scope; ≥1 touch = include, 0 = skip.
7. **Memory parity** — file count in `~/.claude/projects/.../memory/` minus 1 (the `MEMORY.md` index itself) = MEMORY.md line count.
8. **Plan file durable** — plan exists at `~/.claude/plans/<slug>.md`; project mirror at `<repo>/.claude/plans/YYYY-MM-DD-<slug>.md` per workspace-CLAUDE.md plan-file discipline.
9. **Session memory written** — `project_session_YYYY_MM_DD_<slug>.md` saved + indexed in MEMORY.md.
10. **Commit-all, land-on-origin** — every touched repo lands its work on `origin/main`. Two valid flows: (a) direct-push: `git push origin main` after atomic commits; (b) PR-cascade: `gh pr create` → self-review → `gh pr merge --squash`. Auto-deploy picks up either. Choose direct-push for low-risk hygiene; PR-cascade when round-robin review discipline is warranted (multi-section docs changes, structural refactors, governance edits).

**Recover-on-loss law:** if any check fails, recover _immediately_ — universal rule across all repos and surfaces. Nothing local-only, nothing lost.

Reference exemplar pattern: `~/.claude/projects/-Users-4jp-Workspace-<project-slug>/memory/project_session_YYYY_MM_DD_<slug>.md` (latest exemplar findable via `ls -t` in that dir).

This protocol is the HARVEST phase of the FRAME→SHAPE→BUILD→PROVE→HARVEST conductor cycle — formalizing as `conductor_session_transition(target_phase="HARVEST")` is IRF-track work.

<!-- ORGANVM:AUTO:START -->
<!--
  This auto-block was trimmed 2026-05-17 to bring CLAUDE.md under the 40K /doctor limit.
  Unique-to-this-repo data preserved verbatim (System Context, project SOPs, Linked skills,
  Dialect, Logos pointers). Generic system-wide sections removed (regenerable elsewhere):
  - Active Directives system-scope rows (60+) → discover with `organvm sop lifecycle`
  - Live System Variables (all `scope: global`) → `organvm ontologia status`
  - System Density (whole-ecosystem density) → `organvm refresh` then inspect output
  - System Library duplicate (already in parent ~/Code/organvm/CLAUDE.md)
  - Generic Prompting boilerplate
  Generator-level fix tracked separately — next `organvm refresh` may re-inflate this block.
-->

## System Context (auto-generated — do not edit)

**Organ:** ORGAN-III (Commerce) | **Tier:** standard | **Status:** LOCAL
**Org:** `organvm-iii-ergon` | **Repo:** `sovereign-systems--elevate-align`

### Edges

- _No inter-repo edges declared in seed.yaml_

### Siblings in Commerce

`classroom-rpg-aetheria`, `gamified-coach-interface`, `trade-perpetual-future`, `fetch-familiar-friends`, `sovereign-ecosystem--real-estate-luxury`, `public-record-data-scrapper`, `search-local--happy-hour`, `multi-camera--livestream--framework`, `universal-mail--automation`, `mirror-mirror`, `the-invisible-ledger`, `enterprise-plugin`, `virgil-training-overlay`, `tab-bookmark-manager`, `a-i-chat--exporter` ... and 16 more

### Governance

- Strictly unidirectional flow: I→II→III. No dependencies on Theory (I).

<!-- markdownlint-disable MD036 -->

_Last synced: 2026-04-14T21:31:57Z_

<!-- markdownlint-enable MD036 -->

## Active Handoff Protocol

If `.conductor/active-handoff.md` exists, **READ IT FIRST** before doing any work.
It contains constraints, locked files, conventions, and completed work from the
originating agent. You MUST honor all constraints listed there.

If the handoff says "CROSS-VERIFICATION REQUIRED", your self-assessment will
NOT be trusted. A different agent will verify your output against these constraints.

## Session Review Protocol

At the end of each session that produces or modifies files:

1. Run `organvm session review --latest` to get a session summary
2. Check for unimplemented plans: `organvm session plans --project .`
3. Export significant sessions: `organvm session export <id> --slug <slug>`
4. Run `organvm prompts distill --dry-run` to detect uncovered operational patterns

Transcripts are on-demand (never committed):

- `organvm session transcript <id>` — conversation summary
- `organvm session transcript <id> --unabridged` — full audit trail
- `organvm session prompts <id>` — human prompts only

## Project SOPs

System-wide SOPs from `meta-organvm/praxis-perpetua/library/` are not duplicated here — discover them with `organvm sop lifecycle`. Project-specific SOPs (this repo) below.

| Name                                                     | Description                           |
| -------------------------------------------------------- | ------------------------------------- |
| SOP-SS-ATM-001_001-atomic-decomposition                  | Atomic Decomposition & Coverage Proof |
| SOP-SS-CLT-001_001-ontology_client_decisions             | Client decisions ontology             |
| SOP-SS-CNT-001_001-content-extraction-and-node-injection | Content Extraction & Node Injection   |
| SOP-SS-ISS-001-001-ontology-issue-specification          | Issue specification ontology          |
| SOP-SS-PRC-001_001-ontology_meta_process                 | Meta-process ontology                 |
| SOP-SS-QAB-001_001-project-board-qa                      | Project board QA                      |
| SOP-SS-TRK-001_001-ontology_issue_tracking               | Issue tracking ontology               |
| registry                                                 | SOP Registry — Sovereign Systems      |

**Linked skills:** api-design-patterns, cicd-resilience-and-recovery, coding-standards-enforcer, continuous-learning-agent, contract-risk-analyzer, cross-agent-handoff, evaluation-to-growth, gdpr-compliance-check, genesis-dna, multi-agent-workforce-planner, planning-and-roadmapping, promotion-and-state-transitions, quality-gate-baseline-calibration, repo-onboarding-and-habitat-creation, security-threat-modeler, structural-integrity-audit

## Dialect Identity (Trivium)

**Dialect:** EXECUTABLE_ALGORITHM | **Classical Parallel:** Arithmetic | **Translation Role:** The Engineering — proves that proofs compute. Strongest cross-organ translations: I (formal), II (structural), VII (structural). Scan: `organvm trivium scan III <OTHER>`.

## Logos Documentation Layer

**Symmetry:** 0.5 (GHOST). Narrative record in `docs/logos/`: [`telos.md`](../docs/logos/telos.md) (idealized form), [`pragma.md`](../docs/logos/pragma.md) (concrete state), [`praxis.md`](../docs/logos/praxis.md) (remediation), [`receptio.md`](../docs/logos/receptio.md) (reception), [`alchemical-io.md`](../docs/logos/alchemical-io.md) (source & transmutation).

<!-- ORGANVM:AUTO:END -->
