# Maddie outbound — 2026-05-01 tracks status

**Status:** DRAFT — paste into iMessage when ready. Single critical ask is the badge-state question on the fluoride bug; everything else is informational.

**Why this format:** plain text, iMessage-friendly (no markdown bold, no headers — Maddie's thread renders best with bullet lists and short paragraphs). Voice-memo register matches her thread style.

---

```
Got 'em all, breaking the work out so nothing falls through 🌀

1. Spiral nodes — pushed an update just now (live within a few mins). The
13 nodes have always been 13 distinct shapes (ankh, lotus, vesica piscis,
hexagram, etc.) under the chakra rainbow, but the particle haze was washing
them out. Lowered the haze. Let me know if they read as more obviously
different now, or if you want me to push it further — I can flip the
default to no-haze entirely, or go deeper and give each node a totally
unique procedural shape. We can do it in steps.

2. Fluoride miss in your ZIP — that's the most important thing you said.
The site IS pulling EWG live (you weren't seeing demo). Three possible
root causes, all fixable, but I need ONE thing from you to know which one:
when you ran your ZIP, what did the small badge in the top-right of the
result card say? "Sample data" / "Sample data — connection error" / 
"ZIP {your ZIP}". That one detail tells me exactly which fix to ship.
Drop your ZIP whenever, I'll reproduce.

(In the meantime: pushed a defense — if the lookup ever silently fails,
fluoride now appears in the fallback list AND you get an amber banner
saying "this is sample data, not your utility's actual report." So
nobody else gets the same silent miss while we figure this out.)

3. Bottled-water education section — drafting it. Sourcing every claim
from two independent places (the brand's own label + an independent lab
or regulatory source) before anything ships. Brands I'm seeding: Smart
Water, Voss, Fiji, Aquafina, Dasani, Essentia, Liquid Death. If you've
got specific labels you've personally read or your source notes, drop
them whenever — I'll fold them in.

4. Bottle pricing — yes, the current numbers are unsourced placeholders.
When you do the store visit, send actual price + bottle size + how many
you'd realistically drink per month, I'll re-derive monthly/yearly with
the assumption visible (right now it's hidden, which is bad).

5. Pre-filter affiliate links — I'm watching for them. Drop whenever,
same-day swap.

6. Find a Spring + filter page — happy you love them. No work needed.

7. Idaho vs Tennessee + nonprofit timing — separate convo, I'll DM. Big
decision, doesn't change anything site-side.

Your brain-going-too-fast-for-mouth is fine btw — voice memo all of it.
The noise is signal.
```

---

## Outbound design notes (not for sending)

- The single critical ask is bullet 2 (badge state). That answer collapses three live hypotheses for the fluoride bug into one fix path. Everything else is non-blocking.
- Bullet 1 telegraphs the deploy proactively — Maddie has had deploys lag in the past (CF API token expired Apr 19) so "live within a few mins" sets the right expectation.
- Bullet 2 acknowledges the EWG-live state explicitly because Maddie said "I tried to work with chat and it was it wasn't having it" — she may have assumed she was looking at sample data. Naming the state out loud closes that loop.
- Bullet 3 names the dual-citation discipline (M1 mandate) without using the term — frames it as "before anything ships" so she knows the speed tradeoff is intentional.
- Bullet 7 explicitly defers the relocation thread without dismissing it. Maddie's first message was the longest paragraph; ignoring it would land badly.
- Closing line addresses her stated meta-frustration ("brain going too fast for my mouth") and reframes it as a feature, not a bug. Authentic to the working dynamic.

## Tracks state after this outbound

| Track | Status | Blocked on |
|---|---|---|
| A1 spiral hybrid blend | LIVE | Maddie visual approval |
| A2 default flip to visible | HELD | A1 review |
| A3 sacred-geometry-primitives wiring | HELD | A1+A2 review |
| D fluoride bug client-fallback + banner | LIVE | — |
| D route migration | HELD | Maddie badge state + ZIP |
| C bottled-water draft | DRAFTING | M1 dual-citation sourcing |
| B bottle pricing externalization | SCHEMA QUEUED | Maddie store visit |
| E affiliate URLs | QUEUED | Maddie URLs |
