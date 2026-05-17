# AGENTS.md

This file provides guidance for AI coding agents operating in this repository.

## Project Overview

**Sovereign Systems Spiral** — multi-domain Astro 5 website for a 4-pillar health and business brand. Hub-and-spoke across three domains:

| Domain                 | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `elevatealign.com`     | Central hub — spiral visualization, 4 pillars |
| `stopdrinkingacid.com` | Physical Sovereignty — water education funnel |
| `eaucohub.com`         | Financial Sovereignty — business hub          |

**IP boundary:** content = client IP (do not distribute or reuse); code/architecture = studio IP.

## Tech Stack

- **Astro 5** with Cloudflare adapter (`@astrojs/cloudflare`) — SSR via `prerender = false` on API routes
- **Tailwind CSS 4** — via `@tailwindcss/vite` plugin (CSS-first, **no `tailwind.config.js`**)
- **TypeScript strict**, `@/*` → `src/*`, `@cloudflare/workers-types` included
- **Three.js** — `src/components/spiral/spiral.ts` (~2,891 LOC): 13-node golden-angle helix, IconWorlds physics, post-processing bloom
- **Keystatic CMS** — `/admin` route, storage via `KEYSTATIC_STORAGE_KIND` env var (`local` or `github`), targets `organvm-iii-ergon/sovereign-systems--elevate-align`
- **Markdoc** — content format via `@astrojs/markdoc`

## Commands

```bash
npm run dev              # Dev server at localhost:4321 (binds 0.0.0.0 for tunnel access)
npm run build            # Production build → dist/ (prebuild generates public/citations.json)
npm run check            # TypeScript type-check via astro check
npm run preview          # Preview production build locally
npm run test             # Config↔content sync, spiral node invariants, quiz contracts
npm run test:all         # npm test && npm run check && npm run build
npm run deploy           # test:all + wrangler pages deploy dist --project-name sovereign-systems-spiral
npm run parse-citations  # Parse citations from source documents
npm run count-files      # File counting for system variables
```

**Important:** `prebuild` runs automatically before `build` — executes `scripts/generate-citations-json.js` to produce `public/citations.json`. Tests assert this file exists and is valid JSON.

### Testing

Test suite: `scripts/test.mjs` (Node assert, no framework). Validates:

- Pillar/branch config ↔ content file slug synchronization
- 13 spiral nodes: contiguous IDs, 3 quiz themes each, unique EnvVar
- Quiz page serializes node status, capture endpoint contract
- Capture route validates email, bounds-checks quizNodeId 1–13, dispatches sinks in parallel
- Citation JSON is non-empty and parseable
- Annotated bibliography manifest exists with required fields

**No test filtering exists.** To run a focused check, temporarily comment out assertions in `scripts/test.mjs`.

### Linting & Formatting

**Trunk** is configured via `.trunk/` and runs in CI (`trunk-io/trunk-action@v1`) on PR-scoped changed files only. No local lint script — CI is the gate.

## Architecture

### Single Source of Truth

| File                           | Purpose                                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `src/data/hub.config.ts`       | Pillars, nodes, branches, domains, UI defaults (vessel mode, nav variant), EnvVar types, QuizTheme types |
| `src/data/hydration.config.ts` | 6-step funnel config, filter tiers, cost data, matching engine                                           |
| `src/data/quiz.config.ts`      | Quiz questions (5 steps), answer definitions, result/capture copy                                        |
| `src/content.config.ts`        | Astro content collection schema                                                                          |
| `keystatic.config.ts`          | CMS schema for pillars + branches (Markdoc content)                                                      |

### Pages

| Route               | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `/`                 | Hub homepage with spiral visualization                    |
| `/pillars/[slug]`   | Dynamic 4 pillar pages                                    |
| `/nodes/[id]`       | 13 spiral node pages (id 1–13, **nodes 6–13 are locked**) |
| `/quiz`             | Node-placement quiz with affinity scoring (5 questions)   |
| `/water/`           | Physical Sovereignty funnel (6-step hydration node)       |
| `/business/`        | Financial Sovereignty landing                             |
| `/research`         | Bibliography (263 gated citations)                        |
| `/lineage/[envvar]` | Cross-cultural naming chains per EnvVar                   |
| `/for/`             | Audience-targeted landing pages                           |
| `/decisions`        | Decision board with option tracking                       |
| `/aesthetics`       | Aesthetics vocabulary showcase                            |
| `/timeline`         | Timeline view                                             |
| `/library`          | Library view                                              |
| `/capture` (POST)   | Multi-sink form capture (KV + GHL webhook)                |

### Key Components

- `src/components/spiral/spiral.ts` — 13-node Three.js helix with `EffectComposer` post-processing
- `src/components/QuizEmbed.astro` — quiz iframe wrapper with fallback to `/quiz`
- `src/components/HydrateFlow.astro` — hydration funnel orchestrator
- `src/pages/capture.ts` — API route (`prerender = false`), multi-sink dispatch (KV + GHL webhook)

### Capture Endpoint (`/capture` POST)

Fire-and-forget form capture. Validates email syntax, bounds-checks quizNodeId 1–13, dispatches to KV namespace (`SUBMISSIONS`) and GHL webhook (`GHL_WEBHOOK_URL`) in parallel via `Promise.all`. Any sink failure is logged but never blocks the 200 response. In local dev, KV is unbound — degrades gracefully with a warning.

Also handles **decision-board** submissions (source=`decision-board`) — captures decisionId, chosen option, studio recommendation match, and suggestion text.

### Content Collections

| Collection | Path                        | Count                   |
| ---------- | --------------------------- | ----------------------- |
| `pillars`  | `src/content/pillars/*.md`  | 4 files                 |
| `branches` | `src/content/branches/*.md` | 6 files                 |
| `nodes`    | `src/content/nodes/*.md`    | 13 files (1.md – 13.md) |

## Content Management

- Content lives in `src/content/pillars/` (4 pillars) and `src/content/branches/` (6 branches) as Markdoc
- Node content lives in `src/content/nodes/` (13 files)
- To add a pillar/branch: create `.md` file + add entry to `hub.config.ts` — **test suite will fail if out of sync**
- `public/citations.json` is generated by `prebuild` — **never edit by hand**

## Governance Scripts

Config: `.config/board.config.json`. All board operations flow through scripts — **never edit the board directly**.

| Script                                                                  | Purpose                                          |
| ----------------------------------------------------------------------- | ------------------------------------------------ |
| `bash scripts/transition-issue.sh <n> --status <STATUS> --reason "why"` | Gatekeeper — validates state transitions         |
| `bash scripts/sync-tracking-table.sh --write`                           | Generates tracking table from board              |
| `bash scripts/audit-board.sh`                                           | Drift detection — expected vs actual board state |
| `bash scripts/detect-redundancy.sh`                                     | Duplicate issue detection                        |
| `bash scripts/setup-board.sh --dry-run`                                 | Board setup from config                          |

Content genome scripts (Python): `excavate-atoms.py`, `grade-atoms.py`, `build-content-units.py`, `link-atoms-to-issues.py` — see `scripts/README.md`.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`):

- Build: Node 22, `npm ci`, Trunk lint (PR-scoped), `npm run test:all` on push/PR to `main`
- Deploy: Only on push to `main`, uses `cloudflare/wrangler-action@v3` with explicit accountId
- `CLOUDFLARE_API_TOKEN` secret required (Account > Cloudflare Pages > Edit + Account > Account Settings > Read)
- Concurrency: cancels in-flight deploys when a new push arrives

## Gotchas

- **Dev server binds 0.0.0.0** — required for tunnel access. `allowedHosts` in `astro.config.mjs` has explicit allowlist (`.trycloudflare.com`, `.ngrok-free.dev`, `.ngrok.io`).
- **Nodes 6–13 are locked** — `status: 'locked'` in `hub.config.ts`. Do not change without client approval.
- **Node 5 → `/water/`** — Root Healing node routes to the hydration funnel, not `/nodes/5`.
- **Vessel mode / nav variant** — querystring overrides available (`?vessel=visible`, `?nav=spiral-first`) for A/B testing. Defaults in `hub.config.ts` `ui` object (current: `hybrid` / `pillar-first`).
- **Functions vs API routes** — `functions/` directory is legacy. Use `src/pages/*.ts` with `export const prerender = false` for server routes.
- **No `.env` committed** — env vars: `KEYSTATIC_STORAGE_KIND`, `GHL_WEBHOOK_URL`, `CLOUDFLARE_API_TOKEN`.
- **Empty affiliate URLs** — `Anespa DX` and `K8 Kangen` have `affiliateUrl: ''` in `hydration.config.ts` — these are client-gated (tracked in GH#49).
- **`ghl.quizFormUrl` is empty** — local fallback to `/quiz`; affiliate routing tracked in GH#49 and GH#56.
- **No lockfile committed** — `package-lock.json` exists but should be regenerated; use `npm ci` in CI, `npm install` locally.
- **3 of 6 branches are hidden** — `visible: false` on Fertility, Cancer Support, Sustainability. They keep their `/water/[slug]` routes but don't appear in navigation.
- **`npm run check`** is part of `test:all` — don't skip it; it catches type errors that `npm test` (assertion-only) won't.
