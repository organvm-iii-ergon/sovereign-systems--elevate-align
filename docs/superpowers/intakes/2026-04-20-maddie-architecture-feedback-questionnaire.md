# Maddie Architecture Feedback — 2026-04-20

## Source

Voice-to-text messages received 2026-04-20. Maddie responding to the 5-PR corrective implementation (PRs 44-48, merged 2026-04-19).

## Raw Feedback (Verbatim)

> Can we not get the spiral alive with the stars/nodes and name when you hover? Cause it's all definitely there & I love it just not what I had envisioned persay after the last updates I sent with the nodes/steps and code! (If it's too hard/can't work I totally get that then just have to pivot my notes a bit!!)

> But it's v clean I like it!!

> And then it definitely might've been on me, but I think something's got lost in translation because I still live since we already have the information if you could share or I could pull the branches cause they're still super in-depth. I want that to live within the water.

> [continued — full voice-to-text transcript covering: spiral as main form, 13 nodes, Maslow's/pillars as background, water as single educational experience, quiz as spiral placement tool, subscription model, business as lightest touch]

## Decoded Requirements (5 decision points)

1. **Spiral = primary navigation** — not pillars. Users explore the spiral, not "choose a pillar."
2. **Pillars = invisible backbone** — structural, not user-facing. Push below fold or remove from homepage.
3. **Water = single educational experience** — filtering → ionizing → branches → soft product intro. Not multi-page architecture.
4. **Quiz = spiral placement** — assesses where you are, places you at correct node. Not a pillar picker.
5. **Business = lightest touch** — last nodes on spiral, barely mentioned.

## Questionnaire Sent

8 structured questions sent via text to pin down binary decisions. Each maps to a specific code change:

| Q# | Decision | Maps to |
|----|----------|---------|
| 1 | Spiral visual style (keep vs change) | `spiral.ts` |
| 2 | Node names visible always vs hover-only | `spiral.ts` |
| 3 | 13 node names correct? | `hub.config.ts` |
| 4 | Homepage pillars: remove / push down / relabel | `index.astro` |
| 5 | Water page: one long page / expandable / gated branches | `water/` pages |
| 6 | Quiz: confirm placement + who writes questions | `quiz.astro` |
| 7 | Branches: water-only access? | routing |
| 8 | Subscription: build now or link-out? | scope boundary |

## Interim Action Taken

- Homepage reordered: pillars moved below video/quote (safe regardless of Q4 answer)
- CTA copy updated: "Explore the Spiral" / "Find your starting point"
- Pillar section relabeled: "The Architecture"
- Committed and pushed: `a2553ce` (auto-deploys to Cloudflare Pages)

## Status

**AWAITING RESPONSE.** No further architectural code changes until questionnaire answers received.
