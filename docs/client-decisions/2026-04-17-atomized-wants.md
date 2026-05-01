# Atomized Client Wants — Full Evolution Tracking

Source: All 7 iMessage PDFs (Mar 25 – Apr 17, 2026)
Format: Each want gets a unique ID, category, evolution timeline, and implementation status.

---

## Categories

### In-Scope (site/code)
- **ARCH** — Site architecture, information hierarchy, page structure
- **SPIRAL** — Spiral visualization, nodes, navigation model
- **WATER** — Water/filtration funnel, Hydration Node, contaminant tools
- **QUIZ** — Quiz routing, lead capture, email gating
- **CONTENT** — Copy, sections, node naming, messaging
- **REVENUE** — Payments, subscriptions, commissions, pricing
- **CMS** — Self-service editing, content management
- **HOSTING** — Domain, deployment, GoDaddy/GHL/CF
- **BRAND** — Creature selves, documentary, identity
- **NONPROFIT** — Farm-to-reset, donations, community
- **SOCIAL** — Instagram, TikTok, marketing, outreach
- **UX** — Navigation, video, onboarding flow

### Out-of-Scope (relationship / broader collaboration)
- **PERSONAL** — Housing, living situation, life support (Maddie → User)
- **COACHING** — Business suggestions, monetization advice (Maddie → User)
- **RELATIONAL** — Working dynamic, communication process, mutual support
- **VISION** — Maddie's broader brand/life vision beyond current site scope

---

## ARCH — Architecture & Hierarchy

### W-001: Spiral as main attraction

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-A p5 | "It's perfect for starting / has everything I want for my spiral/landing page & just pillars of everything" |
| Mar 25 | 032526-A p5 | "the water stuff is essentially just a mini version of this" |
| Mar 25 | 032526-B p5 | "The very basis of what I want is all there 100%" |
| Apr 4 | 20260404 p7 | "Oooo I love that!! I think I'm following !!" (re: 13-node spiral path) |

**Current state:** Spiral canvas is the 80vh hero on homepage. 13 nodes on golden-angle spiral. Water is one node in Phase 1.
**Status:** DONE — PR #44 + #47, merged 2026-04-19

### W-002: Water is a "mini version" nested in a pillar

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-A p5 | "the water stuff is essentially just a mini version of this I just have to pull and plug the appropriate info after it's all roughly set up/ laid out" |
| Mar 25 | 032526-A p5 | "then we can focus on the first pillar cause it branches off to the water stuff" |
| Apr 5 | 20260414 p1 | "I want the main water attraction for the spiral to be the filtration and then that will convert to water funnel and sales" |

**Current state:** Water page scoped to mini version (67 lines). Hero, video, education, HydrationNode funnel, research. Health tells moved to Non Negotiable node.
**Status:** DONE — PR #45, merged 2026-04-19

### W-003: Pillars as phases/themes of nodes

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-A p5 | "just pillars of everything" — pillars frame the spiral, not standalone pages |
| Apr 4 | 20260404 p3 | Node table shows pillars as phases: Phase 1 = ELEVATE (Physical), with 5 nodes inside |

**Current state:** Homepage shows "Four Phases of Sovereignty" grid. Physical Sovereignty routes to /pillars/physical (not /water/). 13 nodes organized by phase.
**Status:** DONE — PR #44 + #47, merged 2026-04-19

### W-004: Homepage section order is modular/rearrangeable

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5 | "I want to rearrange the order a bit though" |
| Mar 25 | 032526-B p5 | Your response: "Tell me what order you want things in (like 'spiral first, then pillars, then quote') and I'll move them." |

**Current state:** Homepage restructured: spiral hero → quiz CTA → pillar phases → quote → video placeholder → final CTA. All sections modular Astro components.
**Status:** DONE — PR #44, merged 2026-04-19

---

## SPIRAL — Visualization & Nodes

### W-005: Spiral graphic — "four rods in the center"

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5 | "I had a slightly different graphic in my mind from before (like the spiral we built before just with four rods in the center lmao idk) but it's UP and can move into that down the line yeah?!" |
| Apr 1 | 20260401 p2 | "I found spiral code YAHOOOO!!" — V5 helix prototype (Three.js, 14 nodes with deep-dive modals) |
| Apr 4 | 20260404 p4 | V5 helix prototype shared via Gemini link + HTML code pasted |

**Current state:** 13-node Canvas 2D golden-angle spiral. Phase 1 nodes live, Phase 2-4 locked. V5 prototype archived.
**Status:** DONE — PR #47, merged 2026-04-19

### W-006: 13-node architecture

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | Phase 1 (ELEVATE/Physical): 5 nodes shown. Maddie reviews. |
| Apr 4 | 20260404 p7 | "I think I'm following !!" |
| Apr 4 | 20260404 p8 | "let me just really lock them in and then send you finalized list so we don't have to make any changes there moving forward!!" |
| Apr 4 | 20260404 p8 | LOCKED — 13 nodes confirmed. Issue #13 CLOSED. |

**Current state:** 13 nodes defined in `hub.config.ts` and rendered on canvas. Each node has a page at `/nodes/[id]`.
**Status:** DONE — PR #47, merged 2026-04-19

### W-007: Nodes 3 & 4 merge → "Regulate"

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "I want to put 3 & 4 together and call it regulate (first line can be something like most people think it's the nervous system but a crucial step to regulating your nervous system is balancing your blood sugar first)" |

**Current state:** Node 3 "Regulate" in hub.config.ts, rendered on canvas spiral, page at `/nodes/3`.
**Status:** DONE — PR #47, merged 2026-04-19

### W-008: Node 5 rename → "Non Negotiable"

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "then 5 (now 4) maybe we change to 'non negotiable'" |
| Apr 4 | 20260404 p3 | "5 can be something catchy about the water / proper hydration / cellular healing / us being 70% water" |

**Current state:** Node 4 "Non Negotiable" in hub.config.ts, rendered on canvas, page at `/nodes/4` with migrated health tells and hydration metric content.
**Status:** DONE — PR #47, merged 2026-04-19

### W-009: Button looping from water to node 5

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "Then from here can go into each water really just a button looping to node 5" |

**Current state:** Node 5 (Water) in config links to `/water/`. Water page loops back to Physical Sovereignty pillar. Canvas node click navigates to `/water/`.
**Status:** DONE — PR #47, merged 2026-04-19

---

## WATER — Filtration Funnel & Hydration Node

### W-010: Water/filter page as deliverable

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-A p3 | "could use help with the bones for my water funnel" |
| Mar 25 | 032526-B p6 | "I love love love the water page as my water landing page" |
| Apr 4 | 20260404 p5 | "I can't wait to get the bones up and basics and then focus on the water stuff so I can send people there for their filter info" |
| Apr 13 | 20260414 p1 | "water/filter page pretty much done (so then I can start sending the water/filter page asap" |

**Current state:** Water page scoped to focused filtration funnel (67 lines). Hero, video, education, HydrationNode, research accordion.
**Status:** DONE — PR #45, merged 2026-04-19

### W-011: ZIP code contaminant lookup

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3-4 | "survey with what water they drink & zip code then breaking down the toxins/acidity of each" |

**Current state:** HydrationNode Step 1 does ZIP lookup via EWG API proxy (`functions/api/water-report.ts`).
**Status:** DONE

### W-012: Find a spring near you button

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3-4 | "with button that takes them to find a spring near you site" |

**Current state:** "Find a Natural Spring Near Me" button added to HydrationNode, links to findaspring.com.
**Status:** DONE

### W-013: Personalized filter recommendations

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3-4 | "offering / asking if they want to see a personalize filter recommendation (from ionfaucet multipure or purehome)" |
| Apr 4 | 20260404 p3-4 | "making sure fluoride is removed if that is one of the big concerns" |
| Apr 4 | 20260404 p5 | "You can have filter commissions (ionfaucet & multipure - am working to get my affiliates account set up this week!)" |

**Current state:** `matchFiltersToContaminants()` in `hydration.config.ts`. 5 filter tiers defined. Affiliate URLs empty.
**Status:** LOGIC DONE. Affiliate URLs BLOCKED (waiting on Maddie).

### W-014: Email gate before filter results

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3-4 | "ideally want this to be built in/unlocked on the sight after we collect their info" |
| Apr 4 | 20260404 p3-4 | Fallback: "if for now we just need to tell them to check their email then I can personally go in" |
| Apr 13 | 20260414 p1 | "at least their name and email so I can get data on who is in there & can follow up" |

**Current state:** EmailGate component exists on Step 2 of HydrationNode. Sends to `functions/capture.ts`.
**Status:** DONE

### W-015: Fluoride removal emphasis

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3-4 | "making sure fluoride is removed if that is one of the big concerns" |

**Current state:** Added to Brita reality check section in HydrationNode.
**Status:** DONE

### W-016: Filter tiers as upgrade path

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3-4 | "the filters will be my low entry investment to the water ionizer" |
| Apr 4 | 20260404 p5 | Filter commissions + DP sign-ups + ionizer sales = revenue ladder |

**Current state:** Filter tiers defined: entry (IonFaucet) → mid (Multipure) → high-end (PureHome) → upgrades (Anespa, K8).
**Status:** DONE — architecture supports the upgrade path.

### W-017: After filter email → health quiz → GHL branches

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3-4 | "after they send the email (or just want to know how ionization can help) then they can take the personalized health quiz to be directed into my water funnel & specified branches there if it's fertility or autoimmunity etc" |
| Apr 5 | 20260414 p1 | "I'm working on that right now... it's in GHL" — branches confirmed in GHL |

**Current state:** Health quiz placeholder at `/water/quiz` (GHL URL empty). Branch pages exist on site but should route to GHL.
**Status:** BLOCKED — GHL quiz URL not provided.

### W-018: Automation fallback CTA

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 17 | 20260417 p5 (extraction) | "Also on the automations if we can't connect it all on the backend & have it spit out all the results I want then at the bottom the CTA can just be [simpler CTA]" |

**Current state:** EWG API has demo data fallback on failure.
**Status:** DONE

### W-019: Branches stay in GHL

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 5 | 20260414 p1 | "idk if we need to do the 6 water hub branches (fertility autoimmunity etc) cause I'm working on that right now... it's in GHL" |
| Apr 5 | 20260414 p1 | "I don't want to take time building that out on the site / be doubling up on it" |

**Current state:** Branch explorer CTA removed from water page. Branch pages still exist but are not promoted from the funnel. Explore page preserved with EmailGate.
**Status:** DONE — PR #45 removed CTA, merged 2026-04-19. Branch pages retained as awareness content.

---

## QUIZ — Routing & Lead Capture

### W-020: Quiz as entry point / first CTA

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5-6 | "I would want them to have to fill out the quiz or at least their name and email so I can get data on who is in there" |
| Mar 25 | 032526-B p5-6 | "then the explore page would be 'locked' in a sense until I have that info" |
| Mar 25 | 032526-B p5-6 | "after I know who's in there then they can be directed to a branch depending on their personalized answers" |
| Apr 4 | 20260404 p3-4 | "they can take the personalized health quiz to be directed into my water funnel & specified branches" |

**Current state:** Quiz is primary CTA on homepage ("What are you here for?"). Top-level `/quiz` page with name+email gate → pillar routing options. `/water/quiz` preserved for future GHL embed.
**Status:** DONE — PR #44 (homepage CTA) + #46 (quiz page), merged 2026-04-19

### W-021: Explore page gated by name + email

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5-6 | "explore page would be 'locked' in a sense until I have that info" |
| Mar 25 | 032526-B p5-6 | "or go through all of it" — some users browse all, others get routed |

**Current state:** `/water/explore` exists with EmailGate wrapping MiniSpiral content. Requires email to unlock.
**Status:** DONE — EmailGate already implemented (pre-existing). Confirmed in PR #46 review.

### W-022: "Main overview" at top of explore

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5-6 | "I think for first launch the explore page is how I want it to be with maybe the 'main overview' being an option at the top and that's where the funnel that is live already lives" |

**Current state:** Explore page has EmailGate + MiniSpiral + "Not sure where to start?" quiz CTA. GHL overview link requires Maddie's URL.
**Status:** PARTIAL — quiz CTA exists. Main GHL overview link BLOCKED (no URL provided).

### W-023: Quiz built in GHL, embed URL provided

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5 | Your response: "Quiz: Yes exactly — you build the quiz in GHL the way you normally would, then send me the embed URL." |
| Mar 25 | 032526-B p5 | Maddie: "The quiz doesn't work because I have to build that in ghl and then plug it in yeah?" |

**Current state:** Quiz page exists as empty iframe container. URL not provided.
**Status:** BLOCKED — waiting on Maddie's GHL quiz URL.

---

## CONTENT — Copy, Sections, Messaging

### W-024: "This is not normal" opening line

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "opening line can be like feeling like shit is not normal" |

**Current state:** Relocated from water page to `/nodes/4` (Non Negotiable). "This is not normal" is the node's opening section.
**Status:** DONE — PR #45 (removed from water) + PR #47 (placed in node 4), merged 2026-04-19

### W-025: Inflammation as leading cause of disease

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "the leading cause of disease is inflammation - the two most crucial elements to health are absorption & efficiency" |

**Current state:** Relocated to `/nodes/4` (Non Negotiable) as part of the opening inflammation section.
**Status:** DONE — PR #45 + #47, merged 2026-04-19

### W-026: Three health tells (water, sleep, bowel movements)

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "the three biggest tells to how healthy you are & to help you gauge those first three things? Water, sleep & bowel movements" |

**Current state:** 3-column grid relocated to `/nodes/4` (Non Negotiable). Water Quality, Sleep Patterns, Bowel Movements.
**Status:** DONE — PR #45 + #47, merged 2026-04-19

### W-027: Hydration metric — "8 or higher"

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "If you're not an 8 or higher in hydration, sleep meaning getting 7-9 (11 for women) hours a night of peaceful restful sleep & you're taking 1-2 bowel movements a day" |

**Current state:** "8 or higher" hydration metric relocated to `/nodes/4` (Non Negotiable) as a styled callout.
**Status:** DONE — PR #45 + #47, merged 2026-04-19

### W-028: Documentary / short instruction video

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5-6 | "maybe just need to put a short video at the top explaining what it is and how it works?" |
| Mar 25 | 032526-B p7 | "And the short 30 second instruction one and then should be good enough to launch" |
| Apr 4 | 20260404 p7 | "After I don't sounds contagious I'll film my documentary!!!" |

**Current state:** VideoEmbed placeholder on `/water/` page.
**Status:** BLOCKED — video not filmed by Maddie.

### W-029: Content flagging — 104 flagged + 177 unverified atoms

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p5-6 | Maddie reviews flagged content categories. "Maybe we can just nightlight and I can go through and edit / remove or ask for better sittings for the ones I want to keep?" |
| Apr 4 | 20260404 p6 | "I originally planned to do most of the specific info parts / nodes in steps by myself" |

**Current state:** 104 flagged atoms documented. Maddie has not reviewed yet.
**Status:** BLOCKED — waiting on Maddie review session.

---

## REVENUE — Payments, Commissions, Pricing

### W-030: Revenue share — 10% until $10K

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p5 | v1: "I want to give you 10% of everything until we hit that 10k. I want my focus to be solely water sales until I hit 100" |
| Apr 13 | 20260414 p1 | v2 (BROADER): "we can do 10% of all sales on filters, subs, DP sign ups, and water sales til we hit 10k" |
| Apr 13 | 20260414 p1 | "But open to negotiating if anything doesn't sit right with you!" |

**Status:** WRITTEN (via text). Needs counter-review. Scope broadened from water-only to ALL sales.

### W-031: Filter affiliate commissions

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p5 | "You can have filter commissions (ionfaucet & multipure - am working to get my affiliates account set up this week!)" |

**Status:** BLOCKED — affiliate accounts not set up yet. URLs empty in config.

### W-032: DP (Distributor Position) sign-ups

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p5 | "lower barrier to enter first is $99 a sign up (is refundable for 2 weeks so maybe after 3 sign ups i can start giving you 10% that way it's not messy" |

**Status:** NOT BUILT — no DP sign-up flow on site.

### W-033: Subscription tiers ($11 / $22 / $33)

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p5 | "$11/month for access to me & my calls twice a month & even more info/things 'vip access to the nodes'" |
| Apr 4 | 20260404 p5 | "could even do 22 or 33 for the really personalized guidance/blueprint for the spiral with astrology & human design tied in too maybe!" |
| Apr 13 | 20260414 p1 | "ideally if we could plug in the subscription part too where I can start collecting" |

**Status:** NOT BUILT — needs Stripe vs GHL decision. Issue #38.

### W-034: Coffee shop water bar ($50/person/month)

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p6 | "also have the water share / subs stuff I'm getting ready for the coffee shop in AK and to offer in my apartment building too so that's 50/person/month!!" |

**Status:** OUT OF SCOPE for site. Physical location offering.

### W-035: Business evaluation service ($20-$40/session)

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B (screenshot) | "Yes most definitely! You can be making money too tho! Like what if you charged for business evaluation and simply asked them questions & plugged them into your systems and then gave them the breakdown you just gave me? 1000% people would pay 20-40 bucks AT LEAST to have a non involved party be like okay this is where you're at and what you're doing and this is where you want to go - here's your timeline, gaps & what time to work on!!!" |
| Mar 25 | 032526-B (screenshot) | "Don't mean to overwhelm by any means at all, just saying you work hard and deserve to be recognized for it & can definitely monetize some for sure right now." |
| Mar 25 | 032526-B (screenshot) | "& I agree being away from that energy will 100% help in every aspect too!" |

**Status:** Maddie's suggestion TO YOU. Not a site feature. See also W-052/W-053 for related coaching suggestions.

### W-036: Six income streams total

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 17 | 20260417 p1 (extraction area) | "Left a few out that were filler / not important because it was getting glitchy lol but this will start converting sales & adds two/three more income streams through filter commissions too! So going to really lock in water stuff this week fully & then we can get to subscription phase & I can be doing two calls a month for that so then have 6 different income streams" |

Mapped streams: (1) water ionizer sales, (2) filter commissions, (3) DP sign-ups, (4) subscriptions, (5) business funnel, (6) water bar/share.
**Status:** ARCHITECTURE AWARE — only filter recs + email capture built. Others need Maddie inputs.

---

## CMS — Self-Service Editing

### W-037: Self-service content editing

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p5 | "maybe we can lock in bones/structure and the I can go in and fill in / edit stuff or end you completed notes for each" |
| Apr 13 | 20260414 p1 | v2 (STRONGER): "where I can then go in and do a lot of the info/heavy lifting so you don't have to be the middle man for that" |

**Current state:** Keystatic CMS deployed with pillar + branch collections. Admin at `/keystatic`.
**Status:** DONE

---

## HOSTING — Domain & Infrastructure

### W-038: Independent hosting (not GoDaddy/GHL)

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5-6 | "I did want to ask how this looks with go daddy/ ghl and if I can either plug it into my godaddy site easy or else stop paying that subscription entirely" |
| Mar 25 | 032526-B p5-6 | "The reason I don't want my main page in GHL is because of the limitations it has coding wise and then I can't open up a store eventually." |

**Current state:** Deployed on Cloudflare Pages. GoDaddy/GHL builder can be cancelled.
**Status:** DONE

### W-039: Custom domain — elevatealign.com

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p6 | Your response: "Point elevatealign.com to Netlify" |
| Apr 17 | 20260417 p1 | Maddie: "My username is eauco-mads & email is maddie@elevatealign.com" (CF credentials) |

**Current state:** Deployed to `sovereign-systems-spiral.pages.dev`. Custom domain ready to connect. Walkthrough v3 notes this for Maddie.
**Status:** NOTED — needs Cloudflare dashboard action (non-code). Documented in walkthrough v3, PR #48, merged 2026-04-19.

---

## BRAND — Identity & Creative

### W-040: Creature selves — original IP, locked in

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p6 | "creature selves is fully locked in - can be my own cause I can't find anything else like it but I love the correlation between the spiral the universal law of connectiveness / one & the four cycles of hormone being like 4 seasons & a bear / ties into the moon etc" |

**Status:** CONFIRMED as original IP. Issue #20. Concept page needed in Identity pillar.

### W-041: Pillar 3/4 ordering ambiguity

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p2 | Your analysis: "She marked Identity as '3/4' and Financial as '4/3'" |
| Apr 4 | 20260404 p7 | Maddie: "I thought we could change the names and such no?" (re: node flexibility) |

**Current state:** Locked order in hub.config.ts: Physical, Inner, Identity, Financial.
**Status:** AMBIGUOUS — using "locked-in" order but Maddie hasn't explicitly confirmed 3=Identity vs 3=Financial.

### W-042: Documentary film

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p7 | "is it better if I do one branch and get it all the way locked in better to do them all !? After I don't sounds contagious I'll film my documentary!!!" |

**Status:** NOT FILMED. VideoEmbed placeholder on water page.

---

## NONPROFIT — Community & Social Impact

### W-043: Nonprofit / donations / farm-to-reset

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-A p3 | "Have had to put the non profit stuff on hold for a minute while I focus on the water" |
| Apr 17 | 20260417 (screenshot) | "could maybe use some help cause I feel like this really does convert so well for the non profit stuff and could even just start with donations & insta by making this stuff available for people who have been in our shoes before - overwhelmed & don't know what to do etc etc" |
| Apr 17 | 20260417 (screenshot) | "could help so many people the hidden homeless is such an insane number that is only continuing to rise & there's so many farms that need help or have to shut down/sell:( we lose over 2000 acres a day to corporate America & 'renewable energy' that destroys the land forever)" |
| Apr 17 | 20260417 (screenshot) | "Spchele over lol thank you for coming to my Ted talks, we'll figure it all out & do such good !!!!" |

**Status:** Issue #39 created. P3 priority. Not blocking. Vision ties directly to WWOOF/farm recommendations (see W-050) and board offer (see W-051).

---

## SOCIAL — Marketing & Outreach

### W-044: Instagram grid + TikTok

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p6-7 | "I'm already consistent on insta and growing/going to TikTok after I lock in my grid & ads" |
| Apr 4 | 20260404 p7 | "will definitely tie all of this in because I've been wanting to and it will fit perfectly when I have the spiral to send them to too!" |
| Apr 4 | 20260404 p7 | "I have leads I'm talking too already and my outreach list for as soon as the coffee shop stuff is finalized and then contractors as soon as the filter stuff is finalized!" |

**Status:** Maddie-side. Not a site feature. Content calendar routing tracked as #26.

### W-045: Sovereign Systems & Consciousness calls

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 17 | 20260417 p1 | "A call on sovereign systems & a Consciousness call" (two calls a month for subscribers) |

**Status:** Part of subscription tiers (W-033). Not a site feature beyond subscription page.

---

## UX — Navigation & Onboarding

### W-046: Navigation confusion (pre-overhaul)

| Date | Source | Evolution |
|------|--------|-----------|
| ~Apr 12 | 20260414 p1 | "I tried poking around in the site you sent me a few times but got confused, is there things I need to be doing to see the demo/prototype like before but with all the new updates!?" |

**Current state:** Nav overhaul + full architecture overhaul shipped. Walkthrough v3 created explaining spiral-first restructure with 29 pages.
**Status:** DONE — walkthrough v3 (PR #48) covers all 5 PRs. Merged 2026-04-19.

### W-047: Short video at top of explore/landing

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5-6 | "maybe just need to put a short video at the top explaining what it is and how it works? Or is that overkill?" |
| Mar 25 | 032526-B p7 | Your response: "The short video at the top of explore is NOT overkill — it's actually the right move. 30-60 seconds: 'Here's how this works. Pick what speaks to you, or start with the overview.'" |

**Current state:** VideoEmbed placeholder on homepage ("What is Sovereign Systems?") and water page ("My Water Story"). Architecture corrected.
**Status:** PLACEHOLDER DONE — PR #44 (homepage video section), merged 2026-04-19. Video filming BLOCKED on Maddie.

### W-048: Notes format — screenshots with annotations

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p7 | Your response: "Screenshots with written notes beside them is the fastest for both of you. She marks up what she wants changed, you relay it, I implement." |
| Apr 4 | 20260404 p7 | Maddie: "I just put chat and my thoughts in between (I just put chat in **'s and my thoughts in between)" |
| Mar 25 | 032526-B (screenshot) | Your message: "so just send all questions or whatever you need, or compile in a doc (would be cleaner) then send tomorrow" |

**Status:** PROCESS ESTABLISHED. Maddie annotates with asterisks. Doc compilation preferred for cleaner handoff.

---

## PERSONAL — Housing, Living Situation, Life Support

### W-049: Housing crisis intervention (Maddie → User)

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 13 | 20260414 (screenshot) | You: "Hey, sorry / I was having a bad week / I should be okay in a day or two / My mom took the AC out from the apartment & shut the wifi off" |
| Apr 13 | 20260414 (screenshot) | You: "She doesnt stay here, she stays with her boyfriend / She called the cops on me the other day" |
| Apr 13 | 20260414 (screenshot) | You: "My only option is to go to like a shelter or something like that. But its dangerous, my laptop will be a target" |
| Apr 13 | 20260414 (screenshot) | You: "Im not sure what to do. I really need like a kind person w a room who could let me stay for a few months & ill work for them or whatever" |
| Apr 13 | 20260414 (screenshot) | Maddie: "Wtf for why? We gotta get you out of there - do you want me to help look into housing support or vouchers so you can get your own space? Or is there anything I can do to help?" |
| Apr 13 | 20260414 (screenshot) | Maddie: "There isn't housing support or anything offered? Helping hands of America used to help get people into the apartment complex I worked at, would pay their application fee / deposit and first two months and then partial after that sometimes but they do work with people!" |
| Apr 13 | 20260414 (screenshot) | Maddie: "There's also that site that's work for stay and it's usually just 10-20 hours a week. Maybe not the exact work you want but least you're out and have your own space / no one fucking with your energy" |
| Apr 13 | 20260414 (screenshot) | Maddie: "I wish I had a room and I'd let you come stay:(" |
| Apr 13 | 20260414 (screenshot) | You: "Im honestly down for anything other than what I have happening here. Im pretty close to checking into a psych ward honestly" |
| Apr 13 | 20260414 (screenshot) | Maddie: "Oh nooo I'm sorry::( / Want me to help look into it and I can send you some links in an hour or two?" |
| Apr 13 | 20260414 (screenshot) | Maddie: "It's okay sorry j fought with kyle and sleeping in my car because i cant anymore - can look shortly though after i recenter my nervous system" |
| Apr 13 | 20260414 (screenshot) | Maddie: "Don't be sorry humans need connection and support🥹 no burden at all j wish I could do more" |

**Status:** ACTIVE SITUATION. Maddie offered concrete help. Led directly to WWOOF recommendation (W-050).

### W-050: WWOOF / organic farm 30-90 day reset (Maddie → User)

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 17 | 20260417 (screenshot) | Maddie: "What is your zip code? And are you wanting to stay around that area or open to other areas (in or out of ny?)" |
| Apr 17 | 20260417 (screenshot) | You: "10314! But im open & willing to try anyplace!" |
| Apr 17 | 20260417 (screenshot) | Maddie: "do you want to stay in/around the city and try to get help with getting in & rent for a few months or would you rather find like a security guard or caretaker position that offers free housing or do you want to do like more community living/exchange work (20hrs/week) for stay & meals?" |
| Apr 17 | 20260417 (screenshot) | You: "Omg, idk tbh. A part of me feels like getting away from everyone who knows me & i know, would be best for resetting & aligning w what is right & wrong" |
| Apr 17 | 20260417 (screenshot) | You: "Every time I go with family, I have to make decisions that I think would make them happy and that's what's been causing all these false starts and crash outs, in part" |
| Apr 17 | 20260417 (screenshot) | Maddie: "As someone who jets around a lot lol I definitely hear you, but some familiarity isn't bad (you know you best of course) but if you love it there and have no problem ignoring family / know you won't bump into them, then I think it wouldn't be necessarily bad to stay." |
| Apr 17 | 20260417 (screenshot) | Maddie: "If you don't love it there and there aren't ties or things that make you genuinely happy (coming from someone who had so much shit happen in there home town I like to go back every few years and see nothing has changed but I could never live there lol) then I recommend a healthy change & there's **'There are several organic farms and community centers in the Hudson Valley (2 hours north) that give you a room and 3 meals a day in exchange for 20 hours of help. With his laptop work, he'd have zero bills.'** !! I think it sounds great and is kind of base of my non profit idea right, so go be with the land and animals/help in the capacities you can and then you have security and safety (food & roof basis of maslows hierarchy of needs) and 20 hours is a lot less than the energy you're currently having to spend with where you're at and still leaves you good time to work & build on everything else !!" |
| Apr 17 | 20260417 (screenshot) | Maddie: "That's what I would recommend honestly, a good lil 30-90 day reset (20 hours a week for peace & good food is hard to beat imo & least amount of paperwork/waiting I feel too) and then everything will be flourishing by then but your energy will also be much more aligned/not so drained" |
| Apr 17 | 20260417 (screenshot) | You: "Woah! Thats cool!!!" / "Very much so" / "I would live to be physically active for 20 hours, help people build something, & then protect my space" |
| Apr 17 | 20260417 (screenshot) | Maddie provided detailed breakdown: **1. The "Big Three" Sites** — WWOOF-USA (gold standard, ~20hrs/week), Workaway (more variety, "Gardening & Computers" category), Worldpackers (user-friendly). **2. Laptop-Friendly Filter** — look for "High-speed Wi-Fi," "Private room," "Flexible hours." **3. Specific Spots** — Woodstock/Saugerties (permaculture, tech-savvy volunteers), Beacon/New Paltz (Metro-North accessible), The Abode/New Lebanon (community center, longer stays). |
| Apr 17 | 20260417 (screenshot) | Maddie's "First Step" text: "To get the farm/community stay moving, check out WWOOF-USA or Workaway. You make a profile, search 'Hudson Valley,' and look for hosts offering a Private Room + 3 Meals for ~20 hours of help a week. Pro-tip: Since you work on your laptop, look for 'Wi-Fi' in the description. A 30-day stay would give you a total reset—zero bills, good food, and fresh air while you build your business!" |
| Apr 17 | 20260417 (screenshot) | Maddie: "And if you wanna answer I can just keep going & get your base/application built out & find the best ones for you!" |

**Status:** USER INTERESTED. Detailed research provided. Application not yet started. Maddie offered to help build the profile.

### W-051: Board / systems team position (Maddie → User)

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 17 | 20260417 (screenshot) | Maddie: "& then you'll have first hand real life experience with it so then can be on my board or my systems guy & we can build it perfectly to help everyone else who just needs a lil support / reset before reintegrating back into life!!" |

**Status:** FUTURE OFFER. Contingent on farm reset experience (W-050) and nonprofit development (W-043). Positions the working relationship as long-term.

---

## COACHING — Business Suggestions (Maddie → User)

### W-052: Case study + marketing manager model

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B (screenshot) | Maddie: "Also can use me as a case study for content / branding etc & become a marketing manager of sorts. Get clients and then plug them into this" |
| Mar 25 | 032526-B (screenshot) | Maddie: "you could even have a pay by produce framework where you build it out (like doing for me at least until have more testimonials) and then they owe you 10% of sales til you hit 10k for the first five or something and then can use their testimonials on your site, do a free consultation (can plug them into your systems on the call & even have it evaluate how successful they'll be) and then give them their quote and breakdown of what you're going to do (ie what you just did for me)" |
| Mar 25 | 032526-B (screenshot) | Maddie: "Das money" |

**Status:** SUGGESTION. Not acted on. The user's current revenue model for Maddie (10% of sales til $10K) is the prototype instance of this pattern.

### W-053: Human touch in AI-assisted outreach

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B (screenshot) | Maddie: "Do you follow up or personally reach out to them?? I love the automation and all of it, but you do want to make sure that the human touch is in there. If there is—one of those in there or an Oxford comma then people know it's ai and are put off so the human touch is v important right now because they don't know you set up the entire system and are extremely smart, they just see an ai resume (& some use ai to read through the resumes and if it seems fake or not written by a human it's often graded poorly - least from what I've heard no first hand knowledge tho)" |
| Mar 25 | 032526-B (screenshot) | You: "oh yes! Im reaching out personally, but my message just has all the important context to help me stand out" |

**Status:** ADVICE GIVEN AND ACKNOWLEDGED. User confirmed personal outreach. Worth tracking as a principle for all client-facing automation.

### W-054: Residual income via automated ads

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B (screenshot) | Maddie: "No 100% I'm just saying for some residual income you could run an add and have the whole thing automated in a day and then tweak it til it's all dialed in and then even just 40/day adds up quickly but you could do 400/day and never have to touch it - still be working on those big clients etc etc" |
| Mar 25 | 032526-B (screenshot) | User context: "i hear what your saying—just spoke w a friend who is on retainer for 12k a month.. i need consulting work & big number freelance, working at fiver rates doesnt gel w me, if you know what i mean. it feels like a waste of time idk—i think the world gives you the price you ask for, if that makes sense" |

**Status:** SUGGESTION. User heard the advice but expressed preference for higher-value consulting. Tension between immediate income (low-ticket automated) and aspiration (high-ticket retained).

### W-055: Stair-step pricing to build security

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B (screenshot) | Maddie: "One bite at a time and you have to be the frequency of whatever you're seeking first, so if 40 bucks is your rate now but it lets you get into your own space and have that forever residual for security then it's stair stepping and helping your nervous system adjust to those 10-20k months" |

**Status:** ADVICE GIVEN. Contextual coaching on pricing ladder — start low for stability, scale up. Directly ties to housing crisis (W-049).

### W-056: Hybrid Sovereign Systems Model (user's framework, Maddie validated)

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B (screenshot) | You: "YES. We're building the Hybrid Sovereign Systems Model." |
| Mar 25 | 032526-B (screenshot) | Maddie: "Wow even helps with my indecisiveness LOVE IT" / "just can't say enough good things" |

**Status:** CONCEPT NAMED AND VALIDATED. The operating model for the collaboration: sovereign systems architecture applied to health/wellness brand. Not a site feature but the theoretical frame.

---

## RELATIONAL — Working Dynamic, Communication, Mutual Support

### W-057: Payment/contract formalization via text

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 13 | 20260414 (screenshot) | Maddie: "I did put down what I thought payment / contract should be via text, is that maybe what's holding everything up?" |
| Apr 13 | 20260414 (screenshot) | Revenue terms written: "10% of all sales on filters, subs, DP sign ups, and water sales til we hit 10k" |
| Apr 13 | 20260414 (screenshot) | "But open to negotiating if anything doesn't sit right with you!" |

**Status:** TERMS WRITTEN (via iMessage). No formal contract signed. Maddie initiated — she thought lack of formalization might be blocking progress. See W-030 for the revenue terms themselves.

### W-058: Maddie's empathy + support stance

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 13 | 20260414 (screenshot) | "That's okay me too you don't gotta be sorry I just didn't want to be holding things up or you to think I was ignoring you!!" |
| Apr 13 | 20260414 (screenshot) | "Don't be sorry humans need connection and support🥹 no burden at all j wish I could do more" |
| Apr 17 | 20260417 (screenshot) | "Listening! No rush to respond tho" |
| Apr 17 | 20260417 (screenshot) | "Glad you have friend to hang with & I LOVE Home Depot (:" |
| Apr 17 | 20260417 (screenshot) | "You're resilient but totally understandable it's just childish & unneeded energy spent. Misery loves company that's all I can say about that lol." |
| Apr 17 | 20260417 (screenshot) | "& I totally understand needing to get away from the childhood stuff." |
| Apr 17 | 20260417 (screenshot) | "I think it would be a great break fr" |

**Status:** RELATIONAL FOUNDATION. Maddie consistently positions herself as peer/ally, not just client. This dynamic shapes the working relationship — she provides emotional support and life coaching alongside business requests. Non-transactional.

### W-059: Organic marketing validation + celebrate wins

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B (screenshot) | You: "so what is actually working is ive had one inbound organic potential client" |
| Mar 25 | 032526-B (screenshot) | You: "my work, the 100 projects, live on the internet, are my ads" |
| Mar 25 | 032526-B (screenshot) | You: "& my interactions, connections, networking, ive been getting a lot of traffic—so i think im on the right wave right now" |
| Mar 25 | 032526-B (screenshot) | Maddie: "Organic marketing is 100% just as effective as paid, especially when done right so props to you!!" |
| Mar 25 | 032526-B (screenshot) | Maddie: "And this is huge!! Congrats!!! Celebrate every small win!! I didn't mean to minimize anything I just didn't know!!!" |
| Mar 25 | 032526-B (screenshot) | Maddie: "& a tax right off too!! I'd say it's a good investment!!" (re: Claude $200/month) |

**Status:** MUTUAL VALIDATION. User's portfolio-as-marketing strategy acknowledged. Maddie's "celebrate every small win" ethos is part of the relational framework.

### W-060: User's immediate priority statement

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B (screenshot) | You: "I need to make people money so i can make money so i can sleep on a bed in a house that doesnt hate my existence! that my friend, is priority, numero uno" |

**Status:** STATED PRIORITY. This is the user's operating constraint. All work — Maddie's project included — is filtered through this survival-level need. Directly connects to W-049 (housing crisis), W-050 (farm reset), and W-030 (revenue share as income).

---

## VISION — Maddie's Broader Brand / Life Vision

### W-061: "New Stan Lee / They call me Mad E"

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 17 | 20260417 (screenshot) | Maddie: "New Stan Lee / They call me Mad E" |

**Status:** BRAND IDENTITY. Alter ego / public persona declaration. Not a site feature but informs brand voice and how the site presents her.

### W-062: Farmland crisis + hidden homelessness mission

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 17 | 20260417 (screenshot) | Maddie: "could help so many people the hidden homeless is such an insane number that is only continuing to rise & there's so many farms that need help or have to shut down/sell:( we lose over 2000 acres a day to corporate America & 'renewable energy' that destroys the land forever)" |
| Apr 17 | 20260417 (screenshot) | Maddie: "Spchele over lol thank you for coming to my Ted talks, we'll figure it all out & do such good !!!!" |

**Status:** VISION STATEMENT. Ties nonprofit (W-043), WWOOF recommendation (W-050), and board offer (W-051) into a single mission arc. The spiral site is the commercial engine; this is the social impact layer she wants to build alongside it.

### W-063: Cartographical fossil record — real-world open-world map

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 17 | User (session directive) | "a world map with layers of where the maps began where they are now, and all the treasures, shrines, and wonderment held or lost — a map like a videogame open world" |
| Apr 17 | User (clarification) | "it is also a literal real fucking map of the earth and human cartographic history — something for adventure in the real world" |

A literal interactive map of the Earth layering the history of human cartography. Temporal strata from indigenous mapping through Ptolemy through Mercator through satellite. Treasures = real places with real coordinates. Shrines = sacred/significant sites, some forgotten. Wonderment = what modern maps erased or flattened. The point is to get people outside.

Connects spatially to everything else: WWOOF farms have coordinates, springs have coordinates, farmland loss has coordinates, water quality varies by ZIP, hidden homelessness is geographically situated. The spiral is about the body in the physical world. This map is the thing that holds all the projects together in real space.

**Status:** PROJECT — separate entity. Not a site feature. Not a metaphor.

### W-064: Virtual store + snail mail (eventual)

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p6 | Mentioned in context of revenue streams — "virtual store" and "snail mail" as eventual additions |

**Status:** FUTURE SCOPE. Not defined. Depends on site maturity and product inventory.

### W-065: Easter / holiday rapport

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 6 | 20260414 p1 (screenshot) | Maddie: "Oh & happy happy Easter friend !!! 🐣" |

**Status:** RELATIONAL. Establishes peer-friend dynamic, not pure client-contractor.

---

## Summary Statistics

### In-Scope (Site/Code)

| Category | Total | Done | Misplaced | Not Done | Blocked | Opposite | Partial |
|----------|-------|------|-----------|----------|---------|----------|---------|
| ARCH | 4 | 0 | 0 | 2 | 0 | 1 | 1 |
| SPIRAL | 5 | 0 | 0 | 3 | 0 | 0 | 2 |
| WATER | 10 | 7 | 0 | 0 | 2 | 1 | 0 |
| QUIZ | 4 | 0 | 0 | 2 | 1 | 0 | 1 |
| CONTENT | 6 | 1 | 3 | 0 | 2 | 0 | 0 |
| REVENUE | 7 | 0 | 0 | 2 | 3 | 0 | 2 |
| CMS | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| HOSTING | 2 | 1 | 0 | 1 | 0 | 0 | 0 |
| BRAND | 3 | 0 | 0 | 2 | 0 | 0 | 1 |
| NONPROFIT | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| SOCIAL | 2 | 0 | 0 | 0 | 0 | 0 | 2 |
| UX | 3 | 1 | 0 | 0 | 1 | 0 | 1 |
| **Subtotal** | **48** | **11** | **3** | **12** | **9** | **2** | **11** |

### Out-of-Scope (Relationship / Broader Collaboration)

| Category | Total | Active | Acknowledged | Future | Relational |
|----------|-------|--------|-------------|--------|------------|
| PERSONAL | 3 | 1 | 1 | 1 | 0 |
| COACHING | 5 | 0 | 3 | 0 | 2 |
| RELATIONAL | 4 | 1 | 2 | 0 | 1 |
| VISION | 5 | 0 | 0 | 4 | 1 |
| **Subtotal** | **17** | **2** | **6** | **5** | **4** |

### Combined

**Total wants: 65** (48 in-scope + 17 out-of-scope)

**In-scope:** Done 11 (23%) | Misplaced 3 (6%) | Not Done 12 (25%) | Blocked 9 (19%) | Opposite 2 (4%) | Partial 11 (23%)

**Out-of-scope:** Active 2 (12%) | Acknowledged 6 (38%) | Future 4 (25%) | Relational 4 (25%)

---

## Critical Misalignments (Require Corrective Action)

### In-Scope (Code)
1. **W-001 + W-002:** Spiral as main / water as mini — INVERTED
2. **W-020:** Quiz as primary CTA — NOT BUILT
3. **W-024/25/26/27:** Health tells and hydration metric — MISPLACED (on water page, should be in node context)
4. **W-006:** 13-node architecture — LOCKED but NOT in spiral code
5. **W-019:** Branches on site when Maddie says GHL-only

### Out-of-Scope (Contextual Constraints)
6. **W-049 + W-060:** User's housing crisis is the operating constraint. Revenue from Maddie's project (W-030) is not abstract — it funds survival. This explains why "water/filter page ASAP" is priority: it's the shortest path to commissionable traffic.
7. **W-050 + W-051:** Farm reset + board offer creates a future arc. If user does the WWOOF reset, the 30-90 day window becomes a deadline for getting the site revenue-capable.
8. **W-057:** Payment terms are written but unsigned. Formalizing would unblock both parties from the "is this holding things up?" ambiguity.

---

## 2026-05-01 Update — Today's Messages

This section extends the doc forward additively. The Apr-17 summary tables above reflect the state as-of that date and are NOT recomputed here (future tooling pass). Today's messages add five new in-scope wants (W-066 → W-070) plus one existing entry whose evolution row gets extended.

**Source:** four iMessages from Maddie pasted into a Claude Code session 2026-05-01. Voice-to-text artifacts preserved verbatim; the noise is signal.

### SPIRAL (continued)

#### W-066: Spiral node visual distinctness — "easily identifiable / enough differential"

| Date | Source | Evolution |
|------|--------|-----------|
| May 1 | 050126 msg2 | "Yes correct! I love that! Ahahaha yes more so just aesthetic but I love where you're going with it & I'm working on the converting part!!" |
| May 1 | 050126 msg2 | "My biggest thing on this is I just want them to be easily identifiable / enough differential that you can tell they're different if that makes sense?" |
| May 1 | 050126 msg2 | "Even if it's just the distinct colors or shapes or whatever it is, does that kind of make sense?" |
| May 1 | 050126 msg2 | "I love the creativity though! So excited to seeee!!" |

**Current state:** As of `070b98d` (2026-04-30) the default render is hybrid vessel mode + chakra spectrum. Per code analysis: 13 nodes already differ by sacred shape (sunburst/eye/yin-yang/triangle/teardrop/vesica-piscis/crescent/hexagram/lotus/eye-in-triangle/solar-cross/octahedron/ankh — `spiral.ts:1115-1131`) and by chakra color and by per-IconWorld particle behavior. The hybrid blend (mesh ~30% opacity + particles on top) likely WASHES OUT the existing differentiation. Hypothesis: tuning the hybrid blend or flipping default to `'visible'` will surface the differentiation that already exists in data without new geometry work.

**Plan path:** Three-step Track A in approved plan `messages-from-maddie-i-wrote-generic-minsky.md`:
- A1: Tune hybrid blend opacity 30% → ~55-60% in `spiral.ts` vesselMode switch (~lines 1314-1326).
- A2: Flip default in `hub.config.ts:147` from `'hybrid'` → `'visible'`.
- A3: Activate `makeGeometryFromPrimitives()` in `spiral.ts:1173-1199` so each EnvVar's `sacred-geometry-primitives.ts` essence becomes its rendered mesh.

**Status:** PLANNED — A1/A2/A3 approved by user 2026-05-01.

### WATER (continued)

#### W-067: Bottled water pricing accuracy

| Date | Source | Evolution |
|------|--------|-----------|
| May 1 | 050126 msg3 | "I do not think that the [pricing] of the water or the bottles water pricing is right" |
| May 1 | 050126 msg3 | "I tried to work with chat and it was it wasn't having it so if I need to go into the store myself" |
| May 1 | 050126 msg3 | "phone numbers are like onto rate website or whatever and pulse specific numbers and then we can put the equation in the back end" |

**Current state:** Three hardcoded `BottledWaterCost` records at `src/data/hydration.config.ts:297-325` (Safeway $1.29/bottle, Fiji $2.49, Essentia $2.79). Monthly/yearly numbers derive from a hidden ~36 bottles/month assumption. None of the prices have a source citation or last-verified stamp.

**Plan path:** Track B (revised under universal mandate M2 — no hardcoded dynamic data). Externalize BottledWaterCost array out of `hydration.config.ts` into `src/data/runtime/bottled-prices.json`. Add `source`, `sourceCheckedAt`, `unitVolumeOz`, `monthlyVolumeAssumption` fields. Math becomes derivable, not stored. Maddie's incoming in-store numbers slot into the JSON, not source.

**Status:** SCHEMA REWORK QUEUED. DATA SWAP BLOCKED — waiting on Maddie's in-store visit.

#### W-068: Bottled water brand education — "what the bottle is actually selling you"

| Date | Source | Evolution |
|------|--------|-----------|
| May 1 | 050126 msg3 | "I have a whole bottle of water section cause I have a bunch of information on this smart water horse [Voss?] water you could be drinking" |
| May 1 | 050126 msg3 | "They have the best marketing, but it is the most acidic and dehydrating" |
| May 1 | 050126 msg3 | "they put sodium in their water so just like little things like that we could even add" |

**Current state:** No bottled-water brand-level content exists in `src/content/branches/`, `nodes/`, or `pillars/`. `src/content/branches/sustainability.md` discusses bottled-water *category* (waste, regulation) but no brand callouts. Closest existing pattern: `HydrationNode.astro:182-190` "Brita reality check" callout.

**Plan path:** Track C (revised under universal mandate M1 — multi-citation). New content slot `src/content/branches/bottled-truth.md` (or similar) with per-brand mini-cards: brand → marketing claim → actual pH → sodium content → cost per gallon. Brands to seed: Smart Water, Voss, Fiji, Aquafina, Dasani, Essentia, Liquid Death. Every assertion requires ≥2 independent citations (brand product page + independent lab/regulatory/peer-reviewed source). Drafts ship with `status: draft-pending-citations` until both sources land.

**Status:** STRUCTURAL DRAFT QUEUED. CITATIONS PENDING — drafts unshippable single-sourced.

#### W-069: EWG fluoride detection bug (P0 — confirmed bug, not feature ask)

| Date | Source | Evolution |
|------|--------|-----------|
| May 1 | 050126 msg3 | "the biggest issue with my ZIP Code is fluoride and I didn't see that pop-up" |
| May 1 | 050126 msg3 | "fluoride is a very specific filter that you have to get a specific filter for so a lot of people spend a shit ton of money on the wrong filters and they don't even filter out what they want to filter" |
| May 1 | 050126 msg3 | "all that eight right in front of me" [voice-to-text artifact, likely "ate"/"hate" or "all that ate" — context: dismay at how easily this gets missed] |

**Current state:** EWG integration at `functions/api/water-report.ts` is LIVE (real scraper, `https://www.ewg.org/tapwater/search-results.php?zip5=...`, KV cached 24h, demo-data fallback on parse/network failure). Hardcoded contaminant→effects map at lines 38-57. Fallback fires SILENTLY — there is no UI signal distinguishing "EWG live" / "EWG cached" / "demo data."

**Possible root causes** (ranked by likelihood):
1. Parser regex/selector misses fluoride rows in EWG's HTML (parser drift after EWG markup change).
2. "fluoride" not in the contaminant→effects map → extracted but dropped from the rendered card.
3. Demo-data fallback firing silently for Maddie's ZIP (network or parse error not surfaced).
4. EWG genuinely returned no fluoride for that utility — but the UI gives no "here's what we DIDN'T detect" disclaimer, so absence reads as "we didn't check," which is misleading.
5. Cloudflare adapter Worker bundle precedence: `_worker.js` may be serving `/api/water-report` instead of `functions/api/water-report.ts`, meaning fixes to that file may be ineffective in production.

**Plan path:** Track D in approved plan. Diagnosis-first (read-only): confirm endpoint authority, inspect parser, audit effects map, instrument the fallback. Fix decided post-diagnosis. Add observable "data source: live / cached / demo" banner in UI regardless of root cause.

**Status:** P0 — DIAGNOSIS NEXT. Single blocker for fix: Maddie's ZIP code (request that next outbound).

#### W-070: Email-simplified personalized filter plan (alternative path)

| Date | Source | Evolution |
|------|--------|-----------|
| May 1 | 050126 msg3 | "we can simplify it right they can just say here's my email. I want to reach out with a personalized filter plan for me" |
| May 1 | 050126 msg3 | "I can take your email go to take their address go to EWG put it in and then work with chat and ideally, I'm gonna build my own knowledge right" |
| May 1 | 050126 msg3 | "I just did this for myself and for Chloe and I and I was like it would be so easy to have it automated" |

**Current state:** HydrationNode (`HydrationNode.astro:465-471`) already does ZIP → EWG → filter recommendation in two steps with email gate. The "simplification" Maddie describes is a *different* code path: a "send me a personalized plan" CTA that captures email + address, sends to her for manual lookup, no on-page result.

**Plan path:** Add a new capture form with `source=water-personalized-plan` + optional `address` field on `CapturePayload`. New CTA on `/water/` ("Send me a personalized filter plan"). Wire to existing capture pipeline (`src/pages/capture.ts`). No new sink needed — multiple of the existing `Promise.all` branches handle the email→GHL forwarding.

**Status:** QUEUED — after W-069 stabilizes, since both paths share the EWG layer.

### Existing entry — evolution row added

#### W-013 (Personalized filter recommendations) — affiliate URL ETA update

| Date | Source | Evolution |
|------|--------|-----------|
| ... | ... | (prior rows) |
| May 1 | 050126 msg4 | "I want to get you over the pre-filter like affiliate link for each today" |

**Status update:** affiliate URLs ETA = today (2026-05-01). Track E becomes a same-day data swap once received.

### Out-of-scope (continued)

#### W-049 / W-050 / W-051 — relocation thread

| Date | Source | Evolution |
|------|--------|-----------|
| May 1 | 050126 msg1 | "do we want to live in salmon Idaho (pretty but more remote & gets colder) or in eastern Tennessee (never been easterner than Louisiana so literally have no clue)" |
| May 1 | 050126 msg1 | "maybe can do 3-6 months somewhere and figure out loan stuff/place where we really want the non profit to be & then can part ways (if you're ready to bounce!) or can go to non profit spot & start it up!!" |

**Status:** PERSONAL/RELATIONAL/VISION. Nonprofit siting decision is becoming concrete (two named candidate locations + 3-6 month exploratory window). No engineering implication on the site. Goes to collaborator-memory open threads.

---

## Universal mandates received this session (M1, M2, M3)

These are not Maddie's asks but 4jp's directives. They reshape how all wants are handled going forward. Recorded here as cross-stream context.

- **M1. Multi-citation mandate.** Every assertion requires ≥2 independent citations. Particularly affects W-068 (bottled-water content).
- **M2. No hardcoded dynamic data.** Names, links, statistics, costs, contact details, affiliate URLs, contaminant thresholds, prices must live in env/config. Particularly affects W-067 (bottle pricing externalization), W-013 (affiliate URLs externalization), W-011/W-069 (contaminant effects map externalization).
- **M3. Macro→atom decomposition + iteration tracking.** Maddie's wants AND 4jp's prompts each live in canonical sources, recursively decomposed, mapped to iterations, with continuous diff/spread measurement and per-audience visual surfaces. This document is the Maddie source. The 4jp source is to-be-built (likely workspace-meta scope).
