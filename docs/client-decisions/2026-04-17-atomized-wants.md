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

**Current state:** SITE IS INVERTED. Water dominates. Spiral is sidebar decoration with 4 nodes.
**Status:** NOT ADDRESSED

### W-002: Water is a "mini version" nested in a pillar

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-A p5 | "the water stuff is essentially just a mini version of this I just have to pull and plug the appropriate info after it's all roughly set up/ laid out" |
| Mar 25 | 032526-A p5 | "then we can focus on the first pillar cause it branches off to the water stuff" |
| Apr 5 | 20260414 p1 | "I want the main water attraction for the spiral to be the filtration and then that will convert to water funnel and sales" |

**Current state:** Water is the biggest, most feature-rich page. 7 sections, embedded HydrationNode, EWG API.
**Status:** OPPOSITE OF REQUEST

### W-003: Pillars as phases/themes of nodes

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-A p5 | "just pillars of everything" — pillars frame the spiral, not standalone pages |
| Apr 4 | 20260404 p3 | Node table shows pillars as phases: Phase 1 = ELEVATE (Physical), with 5 nodes inside |

**Current state:** Pillars have individual pages at `/pillars/[slug]`. Homepage has 4-pillar grid.
**Status:** PARTIALLY ADDRESSED — pillar pages exist but aren't structured as node-phase gateways

### W-004: Homepage section order is modular/rearrangeable

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5 | "I want to rearrange the order a bit though" |
| Mar 25 | 032526-B p5 | Your response: "Tell me what order you want things in (like 'spiral first, then pillars, then quote') and I'll move them." |

**Current state:** Homepage sections are in Astro components. Modular. No specific order requested yet.
**Status:** ARCHITECTURE READY, awaiting specific order

---

## SPIRAL — Visualization & Nodes

### W-005: Spiral graphic — "four rods in the center"

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5 | "I had a slightly different graphic in my mind from before (like the spiral we built before just with four rods in the center lmao idk) but it's UP and can move into that down the line yeah?!" |
| Apr 1 | 20260401 p2 | "I found spiral code YAHOOOO!!" — V5 helix prototype (Three.js, 14 nodes with deep-dive modals) |
| Apr 4 | 20260404 p4 | V5 helix prototype shared via Gemini link + HTML code pasted |

**Current state:** 4-node Canvas 2D orbital spiral. V5 prototype archived at `docs/archive/v5-helix-prototype.html`.
**Status:** PARTIAL — 4 nodes rendered, 13-node architecture not reflected in spiral

### W-006: 13-node architecture

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | Phase 1 (ELEVATE/Physical): 5 nodes shown. Maddie reviews. |
| Apr 4 | 20260404 p7 | "I think I'm following !!" |
| Apr 4 | 20260404 p8 | "let me just really lock them in and then send you finalized list so we don't have to make any changes there moving forward!!" |
| Apr 4 | 20260404 p8 | LOCKED — 13 nodes confirmed. Issue #13 CLOSED. |

**Current state:** 13 nodes defined in documentation. Canvas spiral only renders 4 pillar nodes.
**Status:** ARCHITECTURE LOCKED, NOT IMPLEMENTED IN CODE

### W-007: Nodes 3 & 4 merge → "Regulate"

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "I want to put 3 & 4 together and call it regulate (first line can be something like most people think it's the nervous system but a crucial step to regulating your nervous system is balancing your blood sugar first)" |

**Current state:** `physical.md` updated with "Regulate — Nervous System + Inflammation" naming.
**Status:** NAMING DONE in content. Not reflected in spiral visualization.

### W-008: Node 5 rename → "Non Negotiable"

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "then 5 (now 4) maybe we change to 'non negotiable'" |
| Apr 4 | 20260404 p3 | "5 can be something catchy about the water / proper hydration / cellular healing / us being 70% water" |

**Current state:** `physical.md` updated with "Water — The Non Negotiable" naming.
**Status:** NAMING DONE in content. Not reflected in spiral.

### W-009: Button looping from water to node 5

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "Then from here can go into each water really just a button looping to node 5" |

**Current state:** Water page has "See the full Physical Sovereignty pillar" CTA at bottom. No node-5 specific loop.
**Status:** PARTIALLY DONE — needs to target node 5 specifically, not just pillar page

---

## WATER — Filtration Funnel & Hydration Node

### W-010: Water/filter page as deliverable

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-A p3 | "could use help with the bones for my water funnel" |
| Mar 25 | 032526-B p6 | "I love love love the water page as my water landing page" |
| Apr 4 | 20260404 p5 | "I can't wait to get the bones up and basics and then focus on the water stuff so I can send people there for their filter info" |
| Apr 13 | 20260414 p1 | "water/filter page pretty much done (so then I can start sending the water/filter page asap" |

**Current state:** Water page fully built with 7 sections + HydrationNode embed + EWG API.
**Status:** BUILT — but scoped too large. Should be a focused filtration entrance, not the site's centerpiece.

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

**Current state:** 6 branch pages built on site (gut-hormones, fertility, athletic, autoimmune, cancer-support, sustainability). Email-gated.
**Status:** CONTRADICTS REQUEST — branches exist on site when Maddie says they belong in GHL. However, they serve as awareness content and are email-gated.

---

## QUIZ — Routing & Lead Capture

### W-020: Quiz as entry point / first CTA

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5-6 | "I would want them to have to fill out the quiz or at least their name and email so I can get data on who is in there" |
| Mar 25 | 032526-B p5-6 | "then the explore page would be 'locked' in a sense until I have that info" |
| Mar 25 | 032526-B p5-6 | "after I know who's in there then they can be directed to a branch depending on their personalized answers" |
| Apr 4 | 20260404 p3-4 | "they can take the personalized health quiz to be directed into my water funnel & specified branches" |

**Current state:** No quiz on homepage. `/water/quiz` page exists but GHL embed URL is empty.
**Status:** NOT ADDRESSED — quiz should be primary CTA on homepage, not buried on water subpage.

### W-021: Explore page gated by name + email

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5-6 | "explore page would be 'locked' in a sense until I have that info" |
| Mar 25 | 032526-B p5-6 | "or go through all of it" — some users browse all, others get routed |

**Current state:** `/water/explore` exists with branch cards. Individual branches are email-gated but explore page itself is not.
**Status:** NOT ADDRESSED — explore page should require name+email to access.

### W-022: "Main overview" at top of explore

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5-6 | "I think for first launch the explore page is how I want it to be with maybe the 'main overview' being an option at the top and that's where the funnel that is live already lives" |

**Current state:** Explore page has branch cards. No "main overview" section linking to existing GHL funnel.
**Status:** NOT ADDRESSED

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

**Current state:** Built as section on `/water/` page: "This is not normal."
**Status:** DONE — but MISPLACED. This is "Non Negotiable" node context, currently on water page.

### W-025: Inflammation as leading cause of disease

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "the leading cause of disease is inflammation - the two most crucial elements to health are absorption & efficiency" |

**Current state:** Built into water page section.
**Status:** DONE — but MISPLACED (same as W-024).

### W-026: Three health tells (water, sleep, bowel movements)

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "the three biggest tells to how healthy you are & to help you gauge those first three things? Water, sleep & bowel movements" |

**Current state:** 3-column grid on `/water/` page.
**Status:** DONE — but MISPLACED. These are node context for "Non Negotiable," not water page sections.

### W-027: Hydration metric — "8 or higher"

| Date | Source | Evolution |
|------|--------|-----------|
| Apr 4 | 20260404 p3 | "If you're not an 8 or higher in hydration, sleep meaning getting 7-9 (11 for women) hours a night of peaceful restful sleep & you're taking 1-2 bowel movements a day" |

**Current state:** Callout section on `/water/` page.
**Status:** DONE — but MISPLACED (same as W-024/25/26).

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

**Current state:** Deployed to `sovereign-systems-spiral.pages.dev`. Custom domain not connected.
**Status:** NOT DONE — Issue #3. Needs CF dashboard config.

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

**Current state:** Nav overhaul shipped (commit `ae33323`): grouped nav, breadcrumbs, footer sitemap. Walkthrough v2 created.
**Status:** FIX SHIPPED — but Maddie's response to the fix is unknown. She said she looked through the walkthrough v2 but we have no direct confirmation of the improved nav experience.

### W-047: Short video at top of explore/landing

| Date | Source | Evolution |
|------|--------|-----------|
| Mar 25 | 032526-B p5-6 | "maybe just need to put a short video at the top explaining what it is and how it works? Or is that overkill?" |
| Mar 25 | 032526-B p7 | Your response: "The short video at the top of explore is NOT overkill — it's actually the right move. 30-60 seconds: 'Here's how this works. Pick what speaks to you, or start with the overview.'" |

**Current state:** VideoEmbed placeholder on water page. No video on explore page.
**Status:** BLOCKED — video not filmed. Architecture note: video should be on homepage/explore, not water page.

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
