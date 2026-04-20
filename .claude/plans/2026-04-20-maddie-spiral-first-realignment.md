# Plan: Resolve Maddie's Feedback — Spiral-First Architecture Realignment

## Context

Maddie sent voice-to-text messages expressing that the current site "isn't what she envisioned." The core issue is **not** that the spiral doesn't work — it does (13 animated nodes, hover names, click navigation). The misunderstanding is about **information architecture philosophy**:

- **We built:** Spiral as a hero visualization → Pillars as primary navigation → Branches as sub-content
- **She wants:** Spiral as THE primary navigation/exploration tool → Water as educational warm-up hub → Pillars as invisible structural backbone

## Translation: What Maddie Is Actually Saying

### 1. "Can we not get the spiral alive with the stars/nodes and name when you hover?"

**Status:** This already works. The spiral IS alive — nodes animate with Perlin noise, names ARE always visible (brighter on hover), click routes to node pages.

**Likely misunderstanding:** She may not have seen the live deployed version recently, or she's referencing visual mockups she sent (the "last updates I sent with the nodes/steps and code") that look different from the canvas implementation. She might want:
- Names hidden by default, revealed only on hover (currently always visible)
- A more "star/constellation" aesthetic vs. the current emoji-in-circle style
- **Need to confirm**: What specific images/mockups did she send? Do we have them in docs/?

### 2. "Maslow's hierarchy and the four pillars are more so background structural pieces"

**Current:** Homepage shows "Four Phases of Sovereignty" with 4 prominent pillar cards in a grid.
**She wants:** Pillars pushed WAY down or even removed from homepage navigation. The spiral IS the user journey — pillars are internal architecture the user never needs to think about.

**Change needed:** On homepage, remove or de-emphasize the pillar card grid. Replace the CTA language from "explore the branches" → "explore the spiral."

### 3. "I want the branches/pre-filter info to live within the water"

**Current:** `/water/explore` → 6 branch pages (gut, fertility, athletic, etc.) — this IS within water.
**But:** She wants ONE water tab/section, not the multi-page architecture. The branch content = educational warm-up material that lives INSIDE the water experience. Users learn about filtering → ionizing → see how it connects to their specific concern (branch) → THEN get the soft product introduction.

**Change needed:** Consolidate water into a single scrollable experience (or minimal sub-navigation), not separate `/water/explore`, `/water/quiz`, `/water/[slug]` pages.

### 4. "The quiz can say you've got the base elevate level done, we're gonna plug you in at step 4/5/6"

**Current:** Quiz is name+email gate → shows 4 pillar cards to choose from.
**She wants:** Quiz that ASSESSES where you are and PLACES you on the spiral. It's a placement tool, not a routing menu. Output: "You're at node X, start here."

**Change needed:** Redesign quiz from "choose your pillar" to "answer questions → get placed on spiral node."

### 5. "Feel Good First" positioning + subscription model

She's describing a BUSINESS MODEL architecture:
- **Spiral subscription:** Monthly access for people not ready for $99 biz discovery or $6K water
- **Feel Good First** = either the universal start OR the quiz skips you past it
- **Water** = low-tier entry (filtering education → product warm-up)
- **Business** = lightest touch, last nodes on spiral

This is content/business strategy, not a code change (yet). But it affects how the quiz routes people and what's gated vs. free.

---

## Concrete Changes Required

### A. Homepage (`src/pages/index.astro`)

1. **Keep:** Spiral hero section (it's working as she wants)
2. **Modify:** Quiz CTA language — from "What are you here for?" to "Explore the Spiral" or "Find your starting point"
3. **De-emphasize:** "Four Phases of Sovereignty" pillar grid — push below video/quote OR remove entirely from homepage, keep only as structural reference on pillar sub-pages
4. **Add:** Direct "explore the spiral" CTA that scrolls/animates to spiral interaction

### B. Spiral Canvas (`src/components/spiral/spiral.ts`)

**Confirm with Maddie first:** Does she want:
- (a) Current style (emoji circles, names always shown) — she said "it's all definitely there & I love it" → suggests YES this is fine
- (b) Names only on hover (hidden by default)
- (c) Different visual style matching specific mockups she sent

The canvas code is solid — node names, hover, click all work. Changes here are aesthetic only.

### C. Water Section Consolidation

**Current pages:**
- `/water/` — mini hub
- `/water/explore` — branch picker (email-gated)
- `/water/quiz` — GHL embed
- `/water/[slug]` — 6 branch deep-dives

**Proposed:** Merge into a single scrollable `/water/` page with sections:
1. Hero (what is water sovereignty)
2. Quiz/assessment (inline, not separate page)
3. Pre-filter education (what's in your water)
4. Ionizing education (what it does for you)
5. Branch previews (expandable cards linking to full branch content OR inline accordion)
6. Soft product bridge (NOT a product page — a "here's what's possible" section)

Branch pages (`/water/[slug]`) can remain as deep-dive destinations but accessed FROM the single water experience, not from a separate "explore" gate.

### D. Quiz Redesign

**Current:** Email gate → 4 pillar cards
**Proposed:** 5-7 questions that assess:
- Physical foundation (sleep, water, movement) → places at nodes 1-5
- Emotional/nervous system state → places at nodes 6-8
- Identity/purpose clarity → places at nodes 9-11
- Financial systems → places at nodes 12-13

Output: "Based on your answers, start at Node X: [name]" with direct link to that node page.

### E. Information Architecture Shift

```
CURRENT:
Homepage → [Spiral (visual)] → [Pillars (navigation)] → [Quiz (gate)]
                                      ↓
                              [Water / Business / etc.]

PROPOSED:
Homepage → [Spiral (THE navigation)] → [Quiz (placement tool)]
                    ↓
         Node pages (13 stops on the journey)
              ↓ (at Node 5)
         Water experience (single page, branches inline)
              ↓ (at Nodes 12-13)  
         Business (lightest touch, last)
```

---

## Critical Files to Modify

| File | Change |
|------|--------|
| `src/pages/index.astro` | De-emphasize pillars, change CTAs to "explore the spiral" |
| `src/pages/quiz.astro` | Redesign from pillar-picker to spiral placement assessment |
| `src/pages/water/index.astro` | Expand into consolidated single-page experience |
| `src/pages/water/explore.astro` | Potentially remove (merge into water index) |
| `src/data/hub.config.ts` | Add quiz question data, update navigation labels |
| `src/components/spiral/spiral.ts` | Aesthetic tweaks only IF Maddie confirms style change |

---

## Questions to Resolve Before Implementation

1. **Spiral visual style**: She said "I love it" but also "not what I had envisioned per se after the last updates I sent." Do we have her mockup images? Are they in `docs/` or were they sent via text/email only? This determines whether the canvas needs restyling.

2. **Water page consolidation scope**: Keep branch pages as deep-dives (accessible from water page) or literally inline everything into one long page?

3. **Quiz questions**: Does she have specific questions in mind, or do we design the assessment logic based on the 13 nodes/4 phases?

4. **Subscription/monthly access**: This implies a membership platform (GHL? Separate tool?). Is this something we build now or just architect for?

5. **Node name confirmation**: She said "the 13 nodes with the names that I provided" — are these the names already in `hub.config.ts` (Feel Good First, Your Body, Regulate, etc.) or did she send updated names?

---

## Verification

After implementation:
1. `npm run build` — ensure no broken routes from page consolidation
2. Visual check: spiral hero → quiz placement → water experience → node pages flow
3. Mobile check: `SpiralFallback.astro` still works with any layout changes
4. Content check: No branch content lost in consolidation (pages can still exist, just accessed differently)

---

## Questionnaire for Maddie (Text Message Format)

Intro message:

> Hey! I'm going to send you 8 quick questions — you can voice-note each one separately so I get clean answers. No rush, just respond to each number when you get a sec.

---

**Question 1 — The Spiral Look**

> Looking at the live site right now — the animated spiral with the 13 circles, emojis, and names underneath each one. Is the LOOK of that what you want, just needs to be reorganized on the page? Or do you want a totally different visual style? (If different — can you screenshot or describe what you're picturing?)

*Pinning down: aesthetic change vs. architectural change*

---

**Question 2 — Node Names Visibility**

> Right now the node names (Feel Good First, Your Body, Regulate, etc.) are always visible under each node. Do you want them HIDDEN until someone hovers, or keep them always showing?

*Pinning down: the "name when you hover" comment — is that a request or a description?*

---

**Question 3 — The 13 Node Names**

> Are these the right 13 names in the right order? Just say yes or tell me what's different:
> 1. Feel Good First
> 2. Your Body  
> 3. Regulate
> 4. Non Negotiable
> 5. Water
> 6. Emotional Terrain
> 7. Nervous System
> 8. Mental Clarity
> 9. Purpose
> 10. Voice
> 11. Boundaries
> 12. Income Systems
> 13. Leverage

*Pinning down: she said "the 13 nodes with the names I provided" — confirming these ARE those names*

---

**Question 4 — Homepage Pillars**

> On the homepage right now there's a "Four Phases of Sovereignty" section with 4 cards (Physical, Inner, Identity, Financial). Do you want that section:
> A) Removed from homepage entirely (pillars only exist in the background)
> B) Kept but pushed way down below everything else
> C) Kept but relabeled as something else

*Pinning down: "more so background structural pieces that we just talk about or mention on the bottom"*

---

**Question 5 — Water Page Structure**

> Right now the water section has multiple separate pages (main page, explore page, quiz page, 6 branch deep-dives). Do you want:
> A) ONE long scrollable water page that has everything inline (quiz + filtering education + branches + product intro all on one page)
> B) One main water page with the branches as expandable sections you can click open
> C) Keep the branch pages separate but make them only accessible FROM the one water page (no other way to find them)

*Pinning down: "one tab instead of the multiple or the whole water section"*

---

**Question 6 — Quiz Function**

> Right now the quiz just collects name+email then lets you pick a pillar. You said you want it to PLACE people on the spiral. So the new quiz would ask a few questions and then say "start at Node 6" or "start at Node 3" — correct? And do YOU have the questions for this or do you want me to design them based on the 13 nodes?

*Pinning down: quiz redesign scope + who owns question content*

---

**Question 7 — Branch Content in Water**

> The 6 branches (Gut + Hormones, Fertility, Athletic Performance, Inflammation, Cancer Support, Sustainability) — these currently live as separate pages under the water section. You want people to find this content ONLY through the water experience, right? Not through the spiral nodes or anywhere else on the site?

*Pinning down: branches are water-internal content, not independently navigable*

---

**Question 8 — Subscription / Monthly Access**

> You mentioned people subscribing for monthly access to work through the spiral. Is this something you need built into the site now? Or is this a future thing you'll handle through GHL and just need a "subscribe" button that links out?

*Pinning down: scope of current work vs. future vision*

---

## How These Answers Map to Code Changes

| Answer | Drives |
|--------|--------|
| Q1-Q2 | `spiral.ts` canvas changes (or confirms no change needed) |
| Q3 | `hub.config.ts` node names array |
| Q4 | `index.astro` homepage layout |
| Q5 | `src/pages/water/` page consolidation |
| Q6 | `src/pages/quiz.astro` redesign scope |
| Q7 | Navigation/routing architecture |
| Q8 | Scope boundary (build now vs. later) |
