# Sovereign Systems Spiral — Workspace Context

## Project Overview
**Sovereign Systems Spiral** is a multi-domain Astro 5 hub-and-spoke website for Maddie's 4-pillar health and business brand. It centralizes three distinct domains into a single codebase and deployment architecture.

- **Hub (`elevatealign.com`):** Central entry point featuring the interactive 4-pillar spiral navigation.
- **Water/Physical (`stopdrinkingacid.com`):** Documentary-first funnel, quiz, and 6 branch deep-dives.
- **Business/Financial (`eaucohub.com`):** Landing page for the professional/systems arm of the brand.

**Organ:** III (Commerce / Ergon)
**Client:** Maddie
**Studio:** ORGANVM Studio

## Tech Stack
- **Framework:** [Astro 5](https://astro.build/) (Static Site Generation)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (using `@tailwindcss/vite`, CSS-first config)
- **Language:** TypeScript (Strict mode, no `any`)
- **Visuals:** Vanilla HTML5 Canvas for the Spiral animation (no external 3D/Canvas libs)
- **Deployment:** [Netlify](https://www.netlify.com/) (Node 22, auto-deploy on `main`)

## Core Architecture & Key Files

### Configuration & Data
- `src/data/hub.config.ts`: **Single source of truth.** Defines pillars, branches, domain mapping, and external GHL (GoHighLevel) URLs.
- `src/content.config.ts`: Defines Zod schemas for Astro Content Collections (`branches`, `pillars`).
- `netlify.toml`: Manages build settings and domain-based redirects (uncomment post-DNS).

### The Spiral Component
- `src/components/spiral/spiral.ts`: Pure Vanilla TS logic for the floating, interactive canvas spiral.
- `src/components/spiral/SpiralIsland.astro`: Astro client-side island (`client:idle`).
- `src/components/spiral/SpiralFallback.astro`: Static SVG fallback for non-JS/low-power environments.

### Content Structure
All client-editable content is managed via Markdown in `src/content/`:
- `src/content/branches/`: 6 pages (e.g., `gut-hormones.md`, `fertility.md`).
- `src/content/pillars/`: 4 pillar pages (e.g., `physical.md`, `inner.md`).

## Development Workflow

### Commands
```bash
npm run dev        # Local development server (localhost:4321)
npm run build      # Production build to dist/
npm run preview    # Local preview of the production build
```

### Conventions
1. **Surgical Updates:** When updating content, target the Markdown files in `src/content/`.
2. **Config First:** To change metadata (colors, URLs, taglines), edit `src/data/hub.config.ts`.
3. **No External Dependencies:** Avoid adding heavy 3D or animation libraries; prefer extending the existing vanilla `spiral.ts`.
4. **Tailwind 4:** Use the CSS-first configuration. No `tailwind.config.js` exists; global styles and Tailwind variables live in `src/styles/global.css`.
5. **Strict Types:** Always use TypeScript interfaces (see `hub.config.ts` for examples).

## Documentation Hierarchy
- `CLAUDE.md`: High-level summary of commands and page mapping.
- `docs/design-decisions.md`: Record of architectural and aesthetic choices.
- `docs/corpus-canon.md`: **Foundational Mandate.** Contains 113 sacred and biomedical citations backing every claim on the site. Every health claim must map back to an entry here.
- `docs/superpowers/`: Project-specific plans and specifications.

## Deployment Notes
- The site builds all routes into a single `dist/`.
- Netlify handles multi-domain routing via `_redirects` or `netlify.toml` logic.
- Ensure `site` in `astro.config.mjs` is set to the primary hub domain.
