# Sovereign Systems Spiral — Technical Design Spec

**Date:** 2026-03-25
**Status:** APPROVED (client design decisions locked)
**Repo:** `sovereign-systems--elevate-align` (ORGAN-III)

---

## 1. Overview

A multi-domain static website system for Maddie's Sovereign Systems Spiral brand. Three domains served from one Astro codebase, connected by an interactive p5.js spiral navigation. Content authored in Markdown. Quiz/CRM stays in GoHighLevel (GHL) via embed.

### Domains

| Domain | Role | Content State |
|--------|------|---------------|
| elevatealign.com | Hub — interactive spiral, 4 pillars | Spiral built, pillar pages 2/4 placeholder |
| stopdrinkingacid.com | Water pillar — documentary funnel, quiz, 6 branches | 3/6 branch copies done, landing copy done |
| eaucohub.com | Business pillar — placeholder | Placeholder only |

### Design Decisions (from client questionnaire)

| Decision | Answer |
|----------|--------|
| Spiral feel | Alive & breathing — slow orbital float, organic |
| Color palette | Teal/ocean tones — evolve existing, don't reinvent |
| Water page entry | Headline + hook text → documentary video |
| Quiz | GHL embed (preserves existing tagging/workflows) |
| Visible pillars | All 4 from day one, "coming soon" for unbuilt |
| Content editing | Markdown files she can edit + studio for structural changes |
| Build priority | Full skeleton with both domains, water side more polished |

---

## 2. Tech Stack

| Layer | Tool | Rationale |
|-------|------|-----------|
| Framework | Astro 5.x | Static-first, component islands, content collections, file-based routing |
| Styling | Tailwind CSS 4.x | Utility-first, custom theme tokens, responsive |
| Spiral component | p5.js via React island | Canvas-based generative animation, organic motion |
| Content | Astro Content Collections (Markdown) | Type-safe, editable without code |
| Quiz/CRM | GoHighLevel embed | Client's existing backend — tagging, workflows, follow-ups |
| Fonts | Self-hosted (Inter + Cormorant Garamond or similar serif) | Clean sans-serif body + elegant serif headings |
| Deploy | Netlify | Proven in ORGAN-III ecosystem, free tier, auto-deploy |
| Package manager | npm | Standard for Astro projects |

---

## 3. Project Structure

```
sovereign-systems--elevate-align/
├── src/
│   ├── layouts/
│   │   ├── Base.astro                  # <html>, <head>, fonts, nav, footer
│   │   ├── WaterLayout.astro           # Water pillar variant (teal accents)
│   │   └── HubLayout.astro             # Hub variant (if palette diverges later)
│   ├── components/
│   │   ├── spiral/
│   │   │   ├── SpiralCanvas.tsx        # React component wrapping p5.js sketch
│   │   │   ├── sketch.ts              # p5.js sketch: orbital animation, pillar nodes
│   │   │   └── types.ts               # Pillar data interface
│   │   ├── BranchSection.astro         # Single section of a branch page (hook/education/water/bridge/resources/cta)
│   │   ├── VideoEmbed.astro            # Responsive video player (Vimeo/YouTube/self-hosted)
│   │   ├── QuizEmbed.astro             # GHL form embed with loading state
│   │   ├── MiniSpiral.astro            # Smaller spiral for water "Explore" section
│   │   ├── PillarCard.astro            # Card for pillar overview on hub
│   │   ├── ComingSoon.astro            # Placeholder for unbuilt pillar/branch pages
│   │   ├── Hero.astro                  # Reusable hero section
│   │   └── CTAButton.astro             # Consistent call-to-action styling
│   ├── content/
│   │   ├── branches/                   # Water pillar branch pages (Markdown)
│   │   │   ├── gut-hormones.md         # ✅ Copy from ChatGPT spec
│   │   │   ├── fertility.md            # ✅ Copy from ChatGPT spec
│   │   │   ├── autoimmune.md           # ✅ Copy from ChatGPT spec
│   │   │   ├── athletic.md             # Placeholder
│   │   │   ├── cancer-support.md       # Placeholder (special soft tone)
│   │   │   └── sustainability.md       # Placeholder
│   │   └── pillars/                    # Sovereign Systems pillars (Markdown)
│   │       ├── physical.md             # Content from ChatGPT spec
│   │       ├── inner.md                # Content from ChatGPT spec
│   │       ├── identity.md             # Placeholder
│   │       └── financial.md            # Placeholder
│   ├── pages/
│   │   ├── index.astro                 # Hub landing — hero + spiral + 4 pillar cards
│   │   ├── pillars/
│   │   │   └── [slug].astro            # Dynamic pillar page from content/pillars/*.md
│   │   ├── water/
│   │   │   ├── index.astro             # Water landing — headline → video → education → CTAs
│   │   │   ├── quiz.astro              # Quiz page with GHL embed
│   │   │   ├── explore.astro           # Mini spiral showing 6 branches
│   │   │   └── [slug].astro            # Dynamic branch page from content/branches/*.md
│   │   └── business/
│   │       └── index.astro             # Business pillar placeholder
│   ├── data/
│   │   ├── pillars.ts                  # Pillar definitions (name, icon, color, url, status)
│   │   └── branches.ts                 # Branch definitions (name, icon, emoji, slug)
│   └── styles/
│       └── global.css                  # Tailwind directives + CSS custom properties
├── public/
│   ├── fonts/                          # Self-hosted font files
│   └── images/                         # Static images (logo, placeholders)
├── content.config.ts                   # Astro content collection schemas
├── astro.config.mjs                    # Astro config (integrations: react, tailwind)
├── tailwind.config.mjs                 # Theme tokens: colors, fonts, spacing
├── package.json
├── seed.yaml                           # ORGANVM ecosystem contract
├── CLAUDE.md                           # Project-specific Claude instructions
└── docs/
    ├── design-decisions.md             # Client-facing design summary
    └── superpowers/specs/              # Technical specs
```

---

## 4. Color System

Teal/ocean palette, evolved from her existing sites.

```css
/* CSS Custom Properties — defined in global.css, referenced in Tailwind config */

--color-ocean-900: #0a2a2f;       /* Deepest background */
--color-ocean-800: #0f3a40;       /* Card backgrounds */
--color-ocean-700: #145050;       /* Borders, dividers */
--color-ocean-600: #1a6b6b;       /* Secondary elements */
--color-ocean-500: #119a9e;       /* Primary brand — from elevatealign.com */
--color-ocean-400: #3dbfc4;       /* Hover states, accents */
--color-ocean-300: #8cc5d3;       /* From stopdrinkingacid.com */
--color-ocean-200: #b8dfe6;       /* Light accents */
--color-ocean-100: #e0f0f0;       /* Lightest tint */

--color-sand-900: #2a2520;        /* Dark warm neutral */
--color-sand-500: #8a7d6b;        /* Body text on dark */
--color-sand-300: #c9b89a;        /* Subtle warm accent */
--color-sand-100: #f0ebe4;        /* Light backgrounds */
--color-sand-50:  #faf8f5;        /* Lightest neutral (page bg) */

--color-gold: #c9a96e;            /* Spiral accent, CTAs, highlights */

--color-text-primary: #1a2a2f;    /* Headings on light bg */
--color-text-body: #4a5a60;       /* Body text on light bg */
--color-text-muted: #7a8a90;      /* Secondary text */
--color-text-on-dark: #e8e4df;    /* Text on dark backgrounds */
```

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headings | Cormorant Garamond | 400, 600 | Page titles, section headers, spiral labels |
| Body | Inter | 300, 400, 500 | Paragraphs, UI text, buttons |
| Accent | Cormorant Garamond italic | 400i | Quotes, callouts, emotional hooks |

---

## 5. Component Specifications

### 5.1 Spiral (SpiralCanvas.tsx + sketch.ts)

**Rendering:** p5.js canvas, loaded as React island (`client:visible` directive in Astro).

**Layout:**
- Center node: "Sovereign Systems" label with subtle pulse
- 4 pillar nodes orbit at different radii and speeds
- Orbital paths drawn as faint dotted arcs
- Spiral line connects center → physical → inner → identity → financial in a logarithmic spiral

**Animation:**
- Constant slow rotation (0.001 rad/frame base speed)
- Each pillar has slight individual drift (different angular velocities)
- Hover on pillar: node scales up 1.15x, label fades in, orbital speed slows
- Click on pillar: navigates to pillar page or external domain

**Pillar Node Visual:**
- Circle with icon/emoji inside
- Label below (pillar name)
- Status indicator: filled circle = live, hollow circle = coming soon
- Color: each pillar gets a tint from the ocean palette

**Responsive:**
- Desktop (>768px): full canvas, orbital layout
- Mobile (<768px): vertical list with subtle float animation (CSS), no canvas
- Transition: Astro renders both, CSS `display:none` toggles

**Data Input:** `pillars.ts` defines:
```ts
interface Pillar {
  name: string;           // "Physical Sovereignty"
  slug: string;           // "physical"
  emoji: string;          // "🌊"
  tagline: string;        // "Control your inputs. Stabilize your body."
  color: string;          // Tint from palette
  url: string;            // "/pillars/physical" or "https://stopdrinkingacid.com"
  status: 'live' | 'coming-soon';
  order: number;          // Orbital position (1-4)
}
```

### 5.2 Branch Page Template

All 6 water branches use identical structure, rendered from Markdown frontmatter + body.

**Markdown schema (content.config.ts):**
```ts
branches: defineCollection({
  schema: z.object({
    title: z.string(),                    // "Gut + Hormones"
    emoji: z.string(),                    // "🌿"
    hook: z.string(),                     // Emotional opening line
    status: z.enum(['live', 'placeholder']),
    tone: z.enum(['standard', 'soft']),   // 'soft' for cancer-support
    order: z.number(),
  })
})
```

**Rendered sections (from Markdown headings):**
1. `## Hook` — Relatable emotional entry
2. `## Connection` — What's happening in the body
3. `## Where Water Fits` — Hydrogen benefits, grounded
4. `## Bridge` — "This doesn't have to be overwhelming"
5. `## Resources` — Videos/clips (expandable later)
6. `## CTA` — "Start with your water" → product link

Each section maps to a `<BranchSection>` component with consistent spacing, typography, and a subtle teal left-border accent.

### 5.3 Water Landing Page (water/index.astro)

**Flow (top to bottom):**
1. **Hero** — Headline: "Water changed everything for me." + 2-3 sentences of context
2. **Documentary** — `<VideoEmbed>` component, large, centered. Placeholder state: thumbnail + "Documentary coming soon" overlay
3. **Post-video grounding** — Short section: "What you just watched" (2-3 sentences)
4. **Mini demo** — Optional second video embed (1-2 min product demo)
5. **Simple education** — "What is molecular hydrogen?" + "Why hydration ≠ just water anymore"
6. **Primary CTA** — "Find what your body actually needs" → /water/quiz
7. **Secondary CTA** — "Explore by category" → /water/explore (mini spiral)
8. **Final CTA** — "If something in you is curious... follow that."

### 5.4 QuizEmbed Component

```astro
<!-- GHL form embed with loading state -->
<div class="quiz-container">
  <div class="quiz-loading" id="quiz-loading">
    <p>Loading your quiz...</p>
  </div>
  <iframe
    src="{ghlFormUrl}"
    width="100%"
    style="border:none; min-height:600px;"
    onload="document.getElementById('quiz-loading').style.display='none'"
  />
</div>
```

GHL form URL provided by Maddie. Styling of the embed controlled in GHL to match the site palette. The wrapper handles loading state and responsive sizing.

### 5.5 Hub Landing Page (index.astro)

**Flow:**
1. **Hero** — "Sovereign Systems Spiral" + positioning statement + subtle background animation
2. **Spiral** — `<SpiralCanvas client:visible />` — the interactive spiral with 4 orbiting pillars
3. **Pillar cards** — 4 cards below the spiral (fallback/reinforcement for mobile and accessibility)
4. **Positioning** — The authority version positioning statement
5. **CTA** — "Start at the root" → links to water pillar (primary revenue path)

---

## 6. Multi-Domain Strategy

### Option: Subdirectory Routing (Recommended for MVP)

Deploy as a single Netlify site. Use path-based routing initially:
- `site.netlify.app/` → hub (elevatealign.com content)
- `site.netlify.app/water/` → water pillar (stopdrinkingacid.com content)
- `site.netlify.app/business/` → business pillar (eaucohub.com content)

When ready to connect custom domains, Netlify supports multiple domains per site with redirect rules:
```toml
# netlify.toml
[[redirects]]
  from = "https://stopdrinkingacid.com/*"
  to = "/water/:splat"
  status = 200

[[redirects]]
  from = "https://eaucohub.com/*"
  to = "/business/:splat"
  status = 200
```

This means: one deploy, three domains, zero code duplication.

---

## 7. Content Editing Flow

Maddie edits content by modifying Markdown files in `src/content/`.

**Simple edits (Maddie does herself):**
- Change a headline or body text in a branch page
- Update a video URL
- Add a resource link
- Edit the "coming soon" placeholder text

**Structural changes (studio handles):**
- Add a new branch page (create new .md file + add to branches.ts)
- Add a new pillar to the spiral (update pillars.ts + create page)
- Change page layout or component structure
- Update the spiral animation

**Editing workflow:**
1. Maddie edits a `.md` file (via GitHub web UI, or a simple text editor if we set up a CMS later)
2. Push triggers Netlify auto-deploy
3. Site updates in ~30 seconds

For Phase 1 MVP: direct file editing is sufficient. A headless CMS (Decap, Tina, or Keystatic) can be added later if she wants a visual editor.

---

## 8. Deployment

| Config | Value |
|--------|-------|
| Platform | Netlify |
| Build command | `npm run build` |
| Publish directory | `dist/` |
| Node version | 22.x |
| Auto-deploy | On push to `main` |
| Custom domains | Added later (elevatealign.com, stopdrinkingacid.com, eaucohub.com) |

---

## 9. Placeholder Strategy

Content that doesn't exist yet gets intentional placeholder treatment:

**Branch pages (athletic, cancer-support, sustainability):**
- Rendered with `<ComingSoon>` component
- Shows branch name, emoji, and: "This branch is growing. Check back soon."
- Same visual treatment as live branches (consistent navigation)

**Pillar pages (identity, financial):**
- Same pattern: name, tagline from pillars.ts, "coming soon" message
- Spiral shows them as hollow-circle nodes (visually distinct from live pillars)

**Documentary video:**
- Thumbnail placeholder with play button overlay
- Text: "Documentary coming soon" or a still frame if available

**No broken links.** Every navigation path leads somewhere intentional.

---

## 10. Testing & Verification

- **Visual:** Manual check on desktop + mobile (Chrome DevTools responsive mode)
- **Lighthouse:** Target 95+ performance, 100 accessibility, 100 SEO on branch pages
- **Links:** No dead links — all navigation paths verified
- **GHL embed:** Quiz loads, form submits, tags apply (requires Maddie's GHL credentials for end-to-end)
- **Content rendering:** All 6 branch pages render from Markdown correctly
- **Spiral:** Loads on desktop, degrades to list on mobile, pillar clicks navigate correctly

---

## 11. Scope Boundaries

**In scope for this build:**
- Hub landing page with interactive spiral
- Water funnel landing page with video placeholder + copy
- Quiz page with GHL embed
- Water explore page with mini spiral
- 6 branch pages (3 with real copy, 3 placeholder)
- 4 pillar pages (2 with content from spec, 2 placeholder)
- Business pillar placeholder page
- Responsive design (desktop + mobile)
- Netlify deployment
- Markdown content editing capability

**Out of scope (future phases):**
- GHL workflow configuration (Maddie's backend — she manages this)
- Documentary video production
- Remaining branch page copywriting
- Downline duplication system
- Analytics integration (Plausible/PostHog)
- Headless CMS integration
- Custom domain DNS configuration (needs Maddie's domain registrar access)
- Email sequence design
