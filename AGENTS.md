# AGENTS.md

This file provides guidance for AI coding agents operating in this repository.

## Project Overview

**Sovereign Systems Spiral** — multi-domain Astro 5 website for client Maddie's 4-pillar health and business brand. Hub-and-spoke architecture with `elevatealign.com` as central hub, `stopdrinkingacid.com` for Water/Physical Sovereignty, and `eaucohub.com` for Financial Sovereignty.

- **Organ:** III (Commerce / Ergon)
- **Client IP boundary:** content = client's IP (do not distribute or reuse); code/architecture = studio IP

## Tech Stack

- **Astro 5** — static site generator, zero JS by default
- **Tailwind CSS 4** — via `@tailwindcss/vite` plugin (CSS-first config, no `tailwind.config.js`)
- **TypeScript** — strict mode, no `any`
- **Vanilla Canvas** — `src/components/spiral/spiral.ts` drives animated spiral (no Three.js, no external canvas libs)

---

## Build & Dev Commands

```bash
npm run dev        # Dev server at localhost:4321
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run parse-citations  # Parse citations from source documents
```

### Running a Single Test

**No test framework is currently configured.** To add tests:

```bash
# Install testing dependencies
npm install -D vitest @testing-library/astro jsdom

# Run tests
npx vitest run
npx vitest run src/components/spiral/spiral.test.ts  # Run single file
npx vitest --watch src/components/spiral/            # Watch mode
```

### Linting

**No linter is currently configured.** To add linting:

```bash
# Install ESLint and related packages
npm install -D eslint @eslint/astro eslint-plugin-astro typescript-eslint

# Run lint
npx eslint src/
```

---

## Code Style Guidelines

### General Principles

- Write clear, readable code over clever code
- Use descriptive names for variables, functions, classes
- Keep functions small and focused (single responsibility)
- Prefer composition over inheritance
- Don't repeat yourself (DRY), but avoid premature abstraction

### TypeScript Conventions

- **Always use strict TypeScript** — no `any` allowed
- Use explicit return types for public functions
- Prefer interfaces over types for object shapes
- Use proper TypeScript utility types when needed (`ReturnType`, `Partial`, etc.)
- Define types in `.ts` files, not inline

```typescript
// Good
interface PillarData {
  name: string;
  slug: string;
  emoji: string;
  color: string;
  status: 'live' | 'coming-soon';
}

function initSpiral(canvas: HTMLCanvasElement, pillars: PillarData[]): () => void {
  // ...
}
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `baseRadius`, `nodeStates` |
| Functions | camelCase | `initNoise()`, `drawOrbitalPaths()` |
| Interfaces/Types | PascalCase | `PillarData`, `HubConfig` |
| Constants | SCREAMING_SNAKE_CASE | `BASE_ROTATION_SPEED` |
| Astro components | PascalCase | `SpiralIsland.astro` |
| Files (components) | PascalCase | `spiral.ts` → fine for utilities |

### Imports & Exports

- Use named exports for all exports (no default exports)
- Group imports logically: external packages → internal modules → types
- Use absolute imports from `@/` alias when available

```typescript
import type { PillarData } from '../data/hub.config';
import { config } from '../data/hub.config';
```

### Formatting

- Use 2 spaces for indentation
- Maximum line length: 100 characters
- Use trailing commas in arrays and objects
- Use semicolons for statement termination

### Error Handling

- Handle errors explicitly with meaningful messages
- Fail fast on invalid inputs
- Use try/catch for async operations with proper error propagation
- Never swallow errors silently

```typescript
function hexToRgba(hex: string, alpha: number): string {
  if (!hex.startsWith('#') || hex.length !== 7) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  // ...
}
```

### Astro Components

- Use `.astro` files for static content and island wrappers
- Prefer `client:idle` or `client:visible` for hydration (avoid `client:load` unless necessary)
- Provide SVG fallbacks for Canvas/JS-dependent components
- Use content collections (`src/content/`) for Markdown content with frontmatter

### Tailwind CSS 4

- No `tailwind.config.js` — use CSS-first configuration
- Define custom properties and theme in global CSS
- Use `@theme` directive for custom design tokens
- Keep utility classes in components, extract to globals only for truly reusable patterns

```css
/* src/styles/global.css */
@theme {
  --color-brand: #119a9e;
  --font-family-display: 'Inter', system-ui, sans-serif;
}
```

### Canvas & Animation

- Target 60fps for animations
- Use `requestAnimationFrame` for render loops
- Implement proper cleanup functions to prevent memory leaks
- Provide static fallbacks for no-JS environments
- Handle DPR (device pixel ratio) for crisp rendering

```typescript
return function cleanup(): void {
  cancelAnimationFrame(animFrame);
  window.removeEventListener('resize', resize);
  canvas.removeEventListener('mousemove', updateMouse);
};
```

---

## Project Structure

```
src/
├── components/
│   └── spiral/
│       ├── spiral.ts          # Canvas animation (vanilla TS)
│       ├── SpiralIsland.astro # Astro island wrapper
│       └── SpiralFallback.astro # Static SVG fallback
├── content/
│   ├── branches/              # 6 branch Markdown files
│   └── pillars/               # 3 pillar placeholder pages
├── data/
│   └── hub.config.ts          # Single source of truth for config
├── layouts/
│   └── Base.astro             # Root HTML layout
├── pages/
│   ├── index.astro            # Hub homepage
│   ├── pillars/[slug].astro   # Dynamic pillar pages
│   ├── water/                  # Physical Sovereignty funnel
│   └── business/               # Financial Sovereignty landing
└── styles/
    └── global.css             # Global styles + Tailwind
```

---

## Content Management

- Edit Markdown files in `src/content/` for copy changes
- Update pillar metadata (taglines, colors, URLs) in `src/data/hub.config.ts`
- Frontmatter schema is enforced by `src/content.config.ts`
- To add a new branch: create `src/content/branches/<slug>.md` with correct frontmatter, then add entry to `hub.config.ts`

---

## Deployment

- **Platform:** Cloudflare Pages
- **Build command:** `npm run build` → outputs to `dist/`
- **Functions:** `functions/capture.ts` for email capture
- Primary domain: `elevatealign.com`
- Auto-deploy on push to `main`

---

## Session Guidelines

- Mirror canonical handoffs into `docs/` before treating as authoritative
- Keep dated artifacts in `docs/superpowers/intakes/` and `.codex/plans/`
- If scope or board state changes, reconcile `seed.yaml` and `CLAUDE.md` in the same session
- Commit and push before close for project memory persistence

<!-- ORGANVM:AUTO:START -->
## Agent Context (auto-generated — do not edit)

This repo participates in the **ORGAN-III (Commerce)** swarm.

### Active Subscriptions
- Event: `client.site.deployed` — triggers downstream signals to V, VII, VI, I

### Production Responsibilities
- Cloudflare Pages: `sovereign-systems-spiral.pages.dev`
- Email capture function: `functions/capture.ts`

### External Dependencies
- Consumes governance from `ORGAN-III/commerce--meta` (contract templates, SOPs, client lifecycle standards)

### Governance Constraints
- Adhere to unidirectional flow: I→II→III
- Never commit secrets or credentials

*Last synced: 2026-04-03T15:19:55Z*
<!-- ORGANVM:AUTO:END -->

## Active Handoff Protocol

If `.conductor/active-handoff.md` exists, read it before starting work.
It contains constraints you must honor, files you must not modify, and
conventions you must follow. Violating these constraints will cause your
work to be rejected during cross-verification.

Key sections to obey:
- **Locked Constraints** — decisions you cannot override
- **Locked Files** — files you cannot modify
- **Conventions** — naming/style rules to follow exactly
- **Receiver Restrictions** — file patterns you must not touch
