---
title: Outbound to Maddie — 2026-05-16 implementation confirmation + HTML exports
date: 2026-05-16
direction: outbound (studio → Maddie)
status: ready-to-send
parent_thread: docs/maddie/chat-screenshots/2026-05-16-maddie-imessage-responses.pdf
---

# Outbound to Maddie — 2026-05-16 implementation confirmation

Plain-text body. iMessage doesn't render markdown — paste as-is.

---

ok shipped — quick recap:

SPIRAL (live in a few mins at sovereign-systems-spiral.pages.dev):
• 3 branches visible now: Inflammation, Hormone Health, Energy + Focus
• Fertility / Cancer / Sustainability hidden from spiral nav — content is preserved, just not surfaced
• Water hub keeps what you loved: "what's in my water" (real EWG data) + "how much you're spending"
• Filter recommendations + email gate after the water report — removed
• New CTA after the cost breakdown points users straight to stopdrinkingacid.com (your GHL water hub)

HTML EXPORTS for GHL — all 6 branches as standalone HTML, ready to paste:
docs/maddie/2026-05-16-branch-html-exports/
• gut-hormones.html (Hormone Health) — visible-on-spiral
• athletic.html (Energy + Focus) — visible-on-spiral
• autoimmune.html (Inflammation) — visible-on-spiral
• fertility.html — hidden-on-spiral, moved to GHL
• cancer-support.html — hidden-on-spiral, moved to GHL
• sustainability.html — hidden-on-spiral, moved to GHL
• README.md — how to paste into a GHL Custom HTML block

Each file = clean semantic HTML, dark theme baked in, no scripts/JS. Drop into a Custom HTML block in GHL, save, preview — should look ~ like the spiral version.

NOT TOUCHED (carry-forward):
• GHL VA access — you said the HTML approach replaces this, holding off
• The "anesoa" deselect → email thing — I couldn't find that flow; can you point at which page/quiz when you're back from the game? Want to fix the right thing
• Voice-note 7-branch reorder (athletes/hormones/gut-skin/inflammation/energy-focus-brain/savings/cancer) — I read this as your GHL-side architecture, not a spiral-side rename ask; if you want the spiral renames to match more closely, say the word

re: the URL — stopdrinkingacid.com (root, not /waterhub) is what the spiral already points at; nothing to change

Have fun at the baseball game.

---

## What landed in code

Branch visibility — `src/data/hub.config.ts`:
- Added `visible?: boolean` to `Branch` interface (default true).
- `fertility`, `cancer-support`, `sustainability` set to `visible: false`.
- Renamed display names: `Gut + Hormones` → `Hormone Health`; `Athletic Performance` → `Energy + Focus`; `Inflammation / Autoimmune` → `Inflammation`.
- Slugs preserved → `/water/[slug]` routes still resolve for direct links + HTML extraction.

Water hub filter — `src/components/HydrationNode.astro`:
- Top-of-file flag: `const SHOW_FILTER_FUNNEL = false`.
- Wraps Step 2 (email gate) + Step 2 results (filter tiers) + Steps 3-6 preview in `{SHOW_FILTER_FUNNEL && (...)}`.
- Step 1 results unchanged — contaminants list, cost breakdown ("What You're Spending on Bottled Water"), Brita reality check, spring finder all stay.
- "See My Filter Recommendations →" CTA replaced with "Continue at the Water Hub →" → `hubConfig.ghl.productUrl` (currently `https://stopdrinkingacid.com`).

Branch listing — `src/pages/water/index.astro`:
- `config.branches.map(...)` → `config.branches.filter((b) => b.visible !== false).map(...)`.

HTML exports — `docs/maddie/2026-05-16-branch-html-exports/`:
- 6 standalone `.html` files (one per branch).
- README documents paste workflow.
- Generator: `scripts/extract-branch-html.mjs` — re-runs after `npm run build`.

## Open items to surface in next exchange

1. **Anesoa/deselect → email**: she described an interaction where she "tried to click and take out the anesoa and it tried to send you an email" — no quiz answer or UI element matches "anesoa" in the codebase. Best read: autocorrect for "answer." Possible flows: (a) clicked an answer in the spiral quiz expecting deselect, got auto-advance (no deselect in current flow), (b) interacted with the water-quiz email gate. Need her to point at the route/screen.
2. **GHL VA access (deferred)**: her voice note moved off this in favor of HTML exports. If GHL access is still wanted later (e.g., for embedding live forms or directly editing pages), follow `app.gohighlevel.com → Settings → My Staff → Add Employee` with `padavano.anthony@gmail.com` and a role scoped to `read-only` or `editor`.
3. **The 7-branch GHL architecture from the voice note** — read as her GHL information architecture, not a directive for spiral renames. If she wants tighter parity, the spiral could mirror her ordering, but that's a separate decision.

## Files modified

- `src/data/hub.config.ts` (+15 -3)
- `src/pages/water/index.astro` (+1 -1)
- `src/components/HydrationNode.astro` (+30 -7)
- `scripts/extract-branch-html.mjs` (new, 105 lines)
- `docs/maddie/2026-05-16-branch-html-exports/*.html` (new, 6 files)
- `docs/maddie/2026-05-16-branch-html-exports/README.md` (new)
- `docs/maddie/2026-05-16-outbound-implementation-confirmation.md` (this file)
