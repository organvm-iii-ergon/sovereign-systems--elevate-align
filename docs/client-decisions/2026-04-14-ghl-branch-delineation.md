# Client Decision: GHL Branch Delineation

**Date:** 2026-04-05 (extracted 2026-04-14)
**Source:** iMessage, Maddie → User
**Decision by:** Maddie (client)

## Decision

The 6 water hub branches (gut-hormones, fertility, athletic, autoimmune, cancer-support, sustainability) remain in GoHighLevel (GHL). They are NOT duplicated on the Astro site.

The site's water/physical section serves as the **filtration entrance funnel** only:
- Spiral → Water attraction (filtration) → GHL water funnel → sales conversion
- Branches are GHL-native content, managed by Maddie directly
- Site does not build out individual branch pages for water-specific content already in GHL

## Maddie's Words

> "idk if we need to do the 6 water hub branches (fertility autoimmunity etc) cause I'm working on that right now... but it's in GHL so I don't want to take time building that out on the site / be doubling up on it cause I want the main water attraction for the spiral to be the filtration and then that will convert to water funnel and sales"

## Implications

1. **Issue #17** (Water Hub placement): DECIDED — the hub is the filtration funnel on-site, not a branch explorer
2. **Issue #6** (Physical Sovereignty build): Water funnel within this node = entrance to GHL, not standalone branch pages
3. **Issue #23** (Hydration Node): Phase A static UI can be simpler — entrance/filtration, not 6 sub-pages
4. **Content in `src/content/branches/`**: These 6 markdown files may need re-scoping — they exist in the repo but Maddie's GHL houses the canonical branch content
5. **`src/pages/water/explore.astro`**: Branch explorer page may become a GHL redirect or simplified overview rather than deep-dive content pages

## Open Questions

- Does Maddie want ANY branch preview/teaser on the site, or pure redirect to GHL?
- Should `src/content/branches/*.md` files be archived or repurposed as SEO landing pages that funnel to GHL?
- Does the existing quiz (`/water/quiz`) stay as-is (GHL embed) or change routing?
