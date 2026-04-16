# Plan: Navigation UX Overhaul — #36 Root Cause Fix

## Context

Maddie (client) tried visiting the site "a few times" and got confused (#36, P0). The walkthrough guide exists (`docs/client-deliverables/2026-04-14-maddie-site-walkthrough.md`) but is a band-aid — the real problem is structural: the nav doesn't communicate where you are or where you can go.

**Root causes identified:**
1. Flat 4-link nav (`Water | Business | Explore | Quiz`) hides hierarchy — "Explore" and "Quiz" are Water children but appear as peers
2. No active-page indicator — every link looks identical regardless of current page
3. No breadcrumbs — zero positional awareness on inner pages
4. Pillar pages (Inner, Identity) unreachable from nav — only via homepage cards
5. Footer is a dead end (copyright only)
6. "Explore" label is ambiguous without "Water" context

**This session ships:** Navigation that a non-technical person can understand on first visit. Advances #36 (P0) and makes the water section (#6) more launch-ready by improving its discoverability.

## Files to Modify

| File | Change |
|------|--------|
| `src/layouts/Base.astro` | Nav restructure, active indicators, breadcrumbs, footer sitemap |
| `src/components/Breadcrumbs.astro` | NEW — minimal breadcrumb component |
| `src/components/Hero.astro` | Add optional `section` prop for "you are here" context |
| `src/pages/water/index.astro` | Pass `section="Physical Sovereignty"` to Hero |
| `src/pages/water/quiz.astro` | Pass section prop |
| `src/pages/water/explore.astro` | Pass section prop |
| `src/pages/water/[slug].astro` | Rename "Explore other branches" CTA label, add back-to-hub link |
| `src/pages/business/index.astro` | Pass section prop |

## Implementation Steps

### Step 1: Base.astro — Active Page Logic (frontmatter)

Add path detection above the existing frontmatter:

```typescript
const currentPath = Astro.url.pathname;
const isWaterSection = currentPath.startsWith('/water');

function navClass(href: string): string {
  const active = href === '/'
    ? currentPath === '/'
    : currentPath === href || currentPath.startsWith(href);
  return active ? 'text-white' : 'text-ocean-400 hover:text-white';
}

// Breadcrumb data from path
const branchSlug = isWaterSection ? currentPath.replace('/water/', '').replace(/\/$/, '') : '';
const branchName = config.branches.find(b => b.slug === branchSlug)?.name;
```

Reuse existing `config` import (line 2).

### Step 2: Base.astro — Restructure Desktop Nav (lines 60-64)

Replace flat 4-link nav with grouped structure:

**Primary row:** Water, Inner, Identity, Business, Research
**Conditional secondary row** (Water section only): Quiz, Branches

Remove "Explore" and "Quiz" from primary nav. Add pillar links. Apply `navClass()` to each link. Secondary row gets `text-[10px]` sizing and `border-t border-white/[0.03]` separator.

Adjust `<main>` padding: `class:list={['flex-1', isWaterSection ? 'pt-[88px]' : 'pt-[56px]']}` to accommodate the taller nav when sub-nav is visible.

### Step 3: Base.astro — Restructure Mobile Nav (lines 73-79)

Replace flat list with grouped sections:

```
WATER                    ← section header (span, not link)
  Water Home             ← /water/
  Take the Quiz          ← /water/quiz
  Explore Branches       ← /water/explore

THE SPIRAL               ← section header
  Inner Sovereignty      ← /pillars/inner
  Identity Sovereignty   ← /pillars/identity
  Business               ← /business/
  Research               ← /research
```

Section headers: `text-[9px] tracking-[0.2em] uppercase text-white/15 font-medium`. Active links: `text-white border-l-2 border-ocean-400 pl-3`. Existing hamburger JS (lines 82-97) continues working — it targets `#nav-menu a` and section headers are `<span>` elements.

### Step 4: Create Breadcrumbs.astro

New file: `src/components/Breadcrumbs.astro`

Props: `items: Array<{ label: string; href?: string }>`. Renders an `<ol>` with `/` separators. Styling: `text-[11px] text-white/25`, current page `text-white/40`. `aria-label="Breadcrumb"`.

Breadcrumb map in Base.astro frontmatter generates items from `currentPath` + `config.branches`/`config.pillars`. Rendered inside `<main>` before `<slot />`, hidden on homepage.

### Step 5: Base.astro — Footer Sitemap (lines 104-109)

Replace copyright-only footer with structured nav:

- **Desktop:** 3-4 column grid — Water links, Spiral links, Connect/Research
- **Mobile:** Single column with section headers matching mobile nav grouping
- All links `text-[12px] text-white/20 hover:text-white/40`
- Keep copyright at bottom

Data-driven: iterate `config.branches` for water links, `config.pillars` for spiral links.

### Step 6: Hero Section Label

Add optional `section?: string` prop to Hero.astro. When present, renders above heading:
```html
<p class="text-[11px] font-medium tracking-[0.2em] uppercase text-ocean-500 mb-3">{section}</p>
```

Pattern already used on homepage (index.astro:29 — "The Framework"). Apply to:
- `/water/` → "Physical Sovereignty"
- `/water/quiz` → "Physical Sovereignty"
- `/water/explore` → "Physical Sovereignty"
- `/business/` → "Financial Sovereignty"

### Step 7: Branch Page CTA Cleanup

In `src/pages/water/[slug].astro` line 63: rename "Explore other branches" to "All Water Branches". Add a third CTA: `<CTAButton href="/water/" label="Back to Water" variant="secondary" />`.

## Verification

1. `npm run build` — must produce 16 pages, zero errors
2. `npm run dev` — visual check on every page:
   - Homepage: no breadcrumbs, nav links all work
   - `/water/`: breadcrumbs show "Home / Water", sub-nav visible, "Water" active in nav
   - `/water/quiz`: breadcrumbs show "Home / Water / Quiz", sub-nav visible
   - `/water/gut-hormones`: breadcrumbs show "Home / Water / Gut & Hormones"
   - `/pillars/inner`: breadcrumbs show "Home / Inner Sovereignty", "Inner" active in nav
   - `/business/`: breadcrumbs show "Home / Business", "Business" active in nav
   - `/research`: breadcrumbs show "Home / Research"
3. Mobile hamburger: grouped sections render, close-on-tap still works
4. Footer: all links point to correct routes
5. No horizontal scroll on mobile (check nav/footer don't overflow)

## Scope Boundaries

**In scope:** Navigation restructure, breadcrumbs, footer sitemap, active indicators, Hero section labels, branch CTA cleanup.

**Out of scope:** Content changes to pages, GHL integration (#9), spiral merge (#15), Hydration Node (#23), Keystatic CMS (#11). Those are separate issues.

## Issue Impact

- **#36 (P0):** Directly resolved — site becomes self-navigable
- **#6 (P1):** Advanced — water section becomes discoverable and launch-ready from nav perspective
- **#17:** Indirectly helped — clear separation between site nav and GHL funnels
