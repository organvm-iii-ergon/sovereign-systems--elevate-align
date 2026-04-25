# Landing Engine — Persona × Narrative × Section Composition

**Date:** 2026-04-25
**Scope:** spiral repo (slice 1–2) + hokage-chess repo (slice 3)
**Origin:** audit comparing spiral vs hokage architectures revealed both are missing the same primitive: an audience-targeted landing page generator from declarative data.
**Sibling artifact:** `~/Workspace/a-i--skills/skills/project-management/product-domain-engine/` — the conductor skill exists; this plan instantiates it.

## Why this exists

Two adjacent products, two complementary half-solutions:

| Capability | Spiral (Maddie) | Hokage (Rob) |
|---|---|---|
| Data-driven content (CMS, schemas, dynamic routes) | ✅ Keystatic + Zod | ❌ Hardcoded JSX |
| Named computable narrative layer | ❌ Visual narrative only | ✅ `narrative.ts` (ki-sho-ten-ketsu) |
| Persona variants | ❌ One brand, one site | ❌ One persona, one funnel |
| Section composition primitive | ❌ Sections are page-bespoke | ❌ Sections are React components |
| OG/SEO discipline | Partial (per-page) | None |

Neither demonstrates **the generator** that maps `(persona × narrative × sections) → landing page`. Both should consume the same primitive.

## The primitive

`src/lib/landing-engine/` with three data layers + one composer:

### 1. `personas.ts`
Audience archetypes carrying pain, desire, language:

```ts
export type Persona = {
  id: string;                  // "toxic-environment-seeker"
  label: string;               // shown in CMS picker
  pain: string[];              // 3–5 verbatim phrases
  desire: string[];            // 3–5 outcome statements
  language: { tone: Tone; vocabulary: string[]; avoid: string[] };
  primaryPillar: PillarId;     // links into existing hub.config.ts
  defaultNarrative: NarrativeId;
};
```

Spiral's seven seed personas (derivable from existing branch/pillar taxonomy):

1. **Toxic-Environment Seeker** — water entry, gut/fertility surface
2. **Burnt-Out High Achiever** — Inner pillar
3. **Identity-Shift Seeker** — Identity pillar
4. **Cycle-Syncing Practitioner** — astrology + HD layer
5. **Athlete-Performance** — performance branch
6. **Cancer-Support Journey** — cancer-support branch
7. **Income-System Builder** — Financial pillar

Hokage's seed personas:

1. **Stuck Beginner (1000–1400 ELO)** — primary, matches Rob's existing offer
2. **Climbing Intermediate (1400–1800)** — secondary
3. **Returning Adult Improver** — comeback narrative

### 2. `sections.ts`
Section type registry — one Astro component per type, all read typed schema:

- `hero` — pillar + headline + sub + CTA primary
- `problem` — pain enumeration + agitate
- `three-paths` / `n-paths` — offer ladder
- `social-proof` — testimonials/stats
- `journey-map` — milestone strip with "YOU ARE HERE"
- `faq`
- `cta`
- `identity` (spiral-specific, branch overview)

### 3. `narratives.ts`
Ordered section templates:

- `ki-sho-ten-ketsu` — hero → problem → twist (three-paths) → resolution (cta)
- `hero-journey` — call → refusal → mentor → trial → return
- `problem-agitate-solve` — problem → agitate (social-proof of cost) → solve (offer)
- `before-after-bridge` — current → ideal → bridge (offer)

### 4. The composer
Single dynamic route `src/pages/for/[persona].astro` (or `/[persona]/` in Astro):

```astro
---
const { persona } = Astro.params;
const { narrative, sectionData } = await composeLanding({ persona });
---
{sectionData.map(({ type, props }) => <SectionRenderer type={type} props={props} />)}
```

CMS adds a Persona entry → page exists. No code commits for new audiences.

## Slice plan

### Slice 1 — Spiral, hardcoded (no CMS)

**Goal:** prove the composer with three personas and four section types end-to-end before introducing CMS surface.

Files:
- `src/lib/landing-engine/personas.ts` — 3 personas (Toxic-Environment Seeker, Burnt-Out High Achiever, Cycle-Syncing Practitioner)
- `src/lib/landing-engine/sections.ts` — 4 types (hero, problem, three-paths, cta)
- `src/lib/landing-engine/narratives.ts` — 1 template (ki-sho-ten-ketsu)
- `src/lib/landing-engine/compose.ts` — pure function `(personaId) → sectionData[]`
- `src/components/landing/HeroSection.astro`
- `src/components/landing/ProblemSection.astro`
- `src/components/landing/ThreePathsSection.astro`
- `src/components/landing/CtaSection.astro`
- `src/pages/for/[persona].astro` — dynamic route with `getStaticPaths`

**Success:** `/for/toxic-environment-seeker`, `/for/burnt-out-high-achiever`, `/for/cycle-syncing-practitioner` all render with persona-specific copy and the same narrative shape.

**Estimate:** 2–3 focused hours.

**Blocked on:** spiral glow/twinkle agent finishing `spiral.ts` (avoid same-repo TS-file collisions during their bloom + UnrealBloomPass + per-node Points cloud work).

### Slice 2 — Spiral, Keystatic-driven

Move `personas.ts` data into `src/content/personas/` Keystatic collection. CMS adds personas without code. `composeLanding` reads from content collection, falls back to hardcoded if collection empty.

**Estimate:** 1–2 hours after slice 1 lands.

### Slice 3 — Hokage port

Port the engine into `~/Workspace/4444J99/hokage-chess/src/lib/landing-engine/`. Extract Hokage's 9 hardcoded landing sections into `sections.ts`. Declare Rob's persona in `personas.ts`. Render `app/page.tsx` (Next.js App Router) via the engine. Add `app/sitemap.ts` + `app/opengraph-image.tsx` per persona.

**Note:** Astro components don't transfer to Next directly — need React equivalents in Hokage. The data layer (personas/sections/narratives schemas) is portable; the renderers are framework-specific. Acceptable cost — schemas are the actual primitive.

**Estimate:** 3–4 hours (more setup since framework boundary).

## Risks + tradeoffs

- **Persona explosion** — 7 personas in spiral could fragment messaging if Maddie isn't ready to commit copy for each. Mitigation: ship 3 in slice 1, let the rest stay theoretical until CMS proves the workflow.
- **Cross-framework primitive** — spiral is Astro, hokage is Next. The schema is shared, the renderers fork. Could be tempted to extract a separate package; resist until a third consumer exists.
- **Existing routing** — spiral already uses `[id]`/`[slug]` for nodes/pillars/branches. Adding `[persona]` doesn't collide but adds another mental layer for Maddie. Naming should be unambiguous (`/for/<persona>` reads well).
- **OG image generation** — adds build complexity. Defer to slice 3 unless trivial in slice 2.

## Done definition (slice 1)

- [ ] All four files created with passing TypeScript types
- [ ] All four section components render at minimum styling (theme-conformant, not bespoke)
- [ ] Dynamic route generates exactly 3 pages at build
- [ ] Each page passes a smoke test: persona's `pain[0]` appears in problem section, persona's `desire[0]` appears in CTA
- [ ] `getStaticPaths` returns from `personas.ts`, not hardcoded array
- [ ] Plan file committed + pushed (this file)

## Out of scope (this plan)

- Email capture wiring (separate task — Kit API)
- Analytics events per persona (slice 4+)
- A/B testing harness (slice 4+)
- Localization (i18n) — schema can be ready, but no copy translations yet

## Sequence rationale

Spiral first because:
1. Data layer (personas, sections, narratives) is more naturally fed by Maddie's existing CMS surface
2. Keystatic round-trip proves the composer is honest about its data dependencies
3. Hokage gets the second pass with battle-tested schemas (avoids re-architecting under Rob's deployment timeline)

If spiral agent's bloom/shimmer work blocks slice 1, slice 3 can lead — the schema design proves out either way; the framework adapter is the only cost difference.
