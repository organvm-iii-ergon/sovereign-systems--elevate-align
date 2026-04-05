# Sovereign Systems Spiral

Multi-domain Astro 5 website for a 4-pillar health and sovereignty brand. Hub-and-spoke architecture across three domains.

| Domain | Purpose |
|--------|---------|
| `elevatealign.com` | Central hub — spiral visualization, 4 pillars |
| `stopdrinkingacid.com` | Physical Sovereignty — water education funnel |
| `eaucohub.com` | Financial Sovereignty — business hub |

## Quick Start

```bash
npm install
npm run dev        # localhost:4321
npm run build      # production → dist/
```

## Architecture

```
Hub (elevatealign.com)
├── Spiral Visualization (canvas, vanilla TS)
├── 4 Pillar Pages (Physical, Inner, Identity, Financial)
├── Research Bibliography (263 citations, gated)
│
├── /water/ (stopdrinkingacid.com)
│   ├── Documentary landing
│   ├── Quiz → GHL integration
│   ├── 6 Branch deep-dives (gut, fertility, athletic, autoimmune, cancer, sustainability)
│   └── Hydration Node funnel (ZIP lookup, filter recs, cost calculator)
│
└── /business/ (eaucohub.com)
    └── Financial Sovereignty — systems, authority, time reclamation
```

## Content System

The site is powered by a **content genome** — 1,821 atomic content units extracted from client conversations, each with 17 metadata fields.

| Metric | Value |
|--------|-------|
| Total atoms | 1,821 |
| SIGNAL (build-worthy) | 1,153 |
| CONTEXT (structural) | 557 |
| NOISE (filtered) | 111 |
| Linked to issues | 1,343 |
| Citations | 263 (sacred + peer-reviewed) |

Regenerate: `bash scripts/build-atom-registry.sh && python3 scripts/link-atoms-to-issues.py --write`

## Governance Scripts

All project board operations flow through config-driven scripts. No direct board edits.

```bash
# State transitions (the gatekeeper)
bash scripts/transition-issue.sh <issue#> --status <STATUS> --reason "why"

# Generate tracking table from board
bash scripts/sync-tracking-table.sh --write

# Audit for drift and missing fields
bash scripts/audit-board.sh

# Detect duplicate issues
bash scripts/detect-redundancy.sh

# Board setup from config
bash scripts/setup-board.sh --dry-run
```

Config: `.config/board.config.json`

## Stack

- **Astro 5** — static site generator
- **Tailwind CSS 4** — CSS-first config via `@tailwindcss/vite`
- **TypeScript** — strict mode
- **Cloudflare Pages** — deploy on push to `main`
- **Vanilla Canvas** — spiral visualization (no Three.js)

## IP Boundary

Content is client intellectual property. Architecture, components, and governance tooling are studio IP.

## Deploy

Cloudflare Pages auto-deploys on push to `main`. Build: `npm run build` → `dist/`.

Primary: `sovereign-systems-spiral.pages.dev`
