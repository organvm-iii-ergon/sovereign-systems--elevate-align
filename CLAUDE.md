# CLAUDE.md

## What This Is

**Sovereign Systems Spiral** — multi-domain Astro 5 website for client Maddie's 4-pillar health and business brand. Hub-and-spoke architecture: `elevatealign.com` is the central hub; `stopdrinkingacid.com` powers the Water/Physical Sovereignty funnel; `eaucohub.com` hosts the Financial Sovereignty business arm.

- **Organ:** III (Commerce / Ergon)
- **Client IP boundary:** content = client's IP (do not distribute or reuse); code/architecture = studio IP
- **Deploy:** Netlify, auto-deploy on push to `main`

## Tech Stack

- **Astro 5** — static site generator, zero JS by default
- **Tailwind CSS 4** — via `@tailwindcss/vite` plugin (no `tailwind.config.js` — CSS-first config)
- **TypeScript** — strict, no `any`
- **Vanilla Canvas** — `src/components/spiral/spiral.ts` drives the animated spiral visualization (no Three.js, no external canvas libs)

## Commands

```bash
npm run dev        # Dev server at localhost:4321
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
```

## Key Files

| File | Purpose |
|------|---------|
| `src/data/hub.config.ts` | Single source of truth — pillar definitions, branch list, domain map, GHL URLs |
| `src/components/spiral/spiral.ts` | Canvas spiral animation — pure vanilla TS, no deps |
| `src/components/spiral/SpiralIsland.astro` | Astro island wrapper for the spiral (client:idle) |
| `src/components/spiral/SpiralFallback.astro` | Static SVG fallback for no-JS environments |
| `src/layouts/Base.astro` | Root HTML layout — head, fonts, global styles |
| `content.config.ts` | Content collection schemas (`branches`, `pillars`) |

## Content Directories

All client-editable content lives in Markdown files:

```
src/content/
  branches/    # 6 branch pages (gut-hormones, fertility, athletic, autoimmune, cancer-support, sustainability)
  pillars/     # 3 pillar placeholder pages (inner, identity, financial)
```

Frontmatter schema is enforced by `content.config.ts` — any new file must include all required fields.

## Page Map (15 pages total)

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/index.astro` | Hub — spiral + 4-pillar grid |
| `/pillars/[slug]` | `src/pages/pillars/[slug].astro` | Dynamic pillar pages (inner, identity, financial) |
| `/water/` | `src/pages/water/index.astro` | Physical Sovereignty / Stop Drinking Acid funnel home |
| `/water/explore` | `src/pages/water/explore.astro` | Branch explorer (6 branches) |
| `/water/quiz` | `src/pages/water/quiz.astro` | GHL quiz embed page |
| `/water/branches/[slug]` | `src/pages/branches/[slug].astro` | Individual branch deep-dives |
| `/business/` | `src/pages/business/index.astro` | Financial Sovereignty / EauCo Hub landing |

## Content Editing Notes

- Edit Markdown files in `src/content/` for copy changes — no code knowledge required
- To update pillar metadata (taglines, colors, URLs, GHL form URLs): edit `src/data/hub.config.ts`
- To add a new branch: create `src/content/branches/<slug>.md` with correct frontmatter, then add an entry to the `branches` array in `hub.config.ts`
## Project Board
[Operating Board](https://github.com/orgs/organvm-iii-ergon/projects/5) — 11 issues across α/β/γ/ω phases

## Deploy Configuration

- **Platform:** Cloudflare Pages (sovereign-systems-spiral.pages.dev)
- **Build:** `npm run build` → `dist/`
- **Functions:** `functions/capture.ts` — Cloudflare Pages Function for email capture
- Primary domain: `elevatealign.com` (connect via CF dashboard → Custom Domains)
- Secondary domains: `stopdrinkingacid.com`, `eaucohub.com` (connect when ready)
- `netlify.toml` is legacy — kept for reference but deployment is on Cloudflare
