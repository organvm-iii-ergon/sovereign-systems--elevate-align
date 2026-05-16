---
title: Branch HTML Exports — for GHL paste
date: 2026-05-16
audience: Maddie
trigger: 2026-05-16 voice note — "if you have the HTML codes that's how I built my landing pages... I can pull it and plug it in"
---

# Branch HTML Exports

Six standalone HTML files — one per branch — pre-formatted to drop straight into
GoHighLevel's **Custom HTML** content block.

## Files

| File | Branch | Currently on spiral? |
|---|---|---|
| `gut-hormones.html` | Hormone Health | yes (visible) |
| `athletic.html` | Energy + Focus | yes (visible) |
| `autoimmune.html` | Inflammation | yes (visible) |
| `fertility.html` | Fertility | no — moved to GHL |
| `cancer-support.html` | Cancer Support | no — moved to GHL |
| `sustainability.html` | Sustainability + Savings | no — moved to GHL |

All six are exported regardless of spiral visibility, because you said: *"I love
the branches like the fertility stuff... I don't want to lose anything you've built."*
The 3 hidden-on-spiral branches now live here as the canonical handoff into GHL.

## How to paste into GHL

1. In GHL, open the page you want to add the branch to.
2. Add a **Custom HTML** block.
3. Open one of these files in any text editor.
4. Select all (Cmd-A) → Copy.
5. Paste into the Custom HTML editor in GHL.
6. Save and preview.

The wrapper `<div>` provides a dark background + white text so it looks the same
as on the spiral site. If your GHL theme already supplies a dark background,
delete the inline `style="..."` on the outer wrapper and the content will inherit
your GHL theme's styling instead.

## What's in each file

- **Hero title + italic subtext** (matches the spiral version)
- **Full body content** — H2 section headings (Hook, Connection, Where Water Fits, etc.)
- **Inline citations** as `<sup>` superscript numbers (e.g., `B-01`, `B-21`)
- **Lists, bold, italics** — all standard semantic HTML

## What's NOT in each file (intentional)

- **No `<script>` tags** — pure content, no JavaScript dependencies
- **No EmailGate** — on the spiral site, branch content is hidden behind a name+email
  capture; for GHL you'll handle conversion separately
- **No spine progress bar / nav / breadcrumbs** — these are spiral-site chrome
- **No external CSS files** — only the inline styles on the wrapper

## Regenerating

When a branch's `.md` source changes (in `src/content/branches/`), regenerate the
HTML exports with:

```bash
npm run build
node scripts/extract-branch-html.mjs
```

The extraction reads from `dist/water/<slug>/index.html` (Astro production output)
and writes here.

## Source files

| Branch | Source |
|---|---|
| Hormone Health (was: Gut + Hormones) | `src/content/branches/gut-hormones.md` |
| Fertility | `src/content/branches/fertility.md` |
| Energy + Focus (was: Athletic Performance) | `src/content/branches/athletic.md` |
| Inflammation (was: Inflammation / Autoimmune) | `src/content/branches/autoimmune.md` |
| Cancer Support | `src/content/branches/cancer-support.md` |
| Sustainability + Savings | `src/content/branches/sustainability.md` |

Note: source slugs preserved for URL/route stability; display names updated to
match the 2026-05-16 directive ("Inflammation, hormone health, and energy or focus").
