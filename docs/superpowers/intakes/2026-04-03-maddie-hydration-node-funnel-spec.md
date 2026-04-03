# Intake: Maddie — Hydration Node + Water Funnel Blueprint

**Date:** 2026-04-03
**Source:** iMessage thread (group chat) + text follow-up (2 parts)
**Received by:** Studio (via user relay)
**Status:** Ingested, mapped against existing board. Requires architectural analysis.

---

## 1. WHAT ARRIVED

| Asset | Format | Source |
|-------|--------|--------|
| Hydration Node 6-Step Flowchart (Pt2) | iMessage text (structured blueprint) | ChatGPT-assisted specification |
| Backend automation note (Pt1, truncated) | iMessage text | Direct from Maddie |
| EauCo Hub credentials | iMessage text | Direct from Maddie |
| Group chat context | iMessage screenshots (2) | Thread with JT, JD, CT, S, RB, SL |

### Key Signals from Thread

- **Credentials shared:** Username `eauco-mads`, email `maddie@elevatealign.com`
- **Timeline pressure:** "going to really lock in water stuff this week fully"
- **Revenue model:** "adds two/three more income streams through filter commissions"
- **Next phase:** "then we can get to subscription phase & I can be doing two calls a month"
- **Total income streams target:** 6 different streams
- **Graceful degradation:** "if we can't connect it all on the backend & have it spit out all the results I want then at the bottom the CTA can just be..." (truncated — implies fallback to simpler CTA if dynamic integration is too heavy)
- **Excitement level:** High — "Am so excited thank you so much for all of your help!!"

---

## 2. HYDRATION NODE FUNNEL ARCHITECTURE (6 Steps)

### Step 1: Free Resource Layer — Awareness & Education

**User Input:** ZIP code + water source (tap, well, bottled, unsure)

**Outputs (immediate, no email needed):**
- Specific contaminants for their ZIP from EWG database
- Dual flags: Legal limit (FDA / municipal) vs Recommended health guideline
- Tooltips: hydration, skin, detox, cellular effects
- Bottled water cost comparison (Safeway 2026 prices — per bottle, per case, per gallon)
- "Find a spring near me" button
- Brita / RO reality check

**Goal:** Build trust and awareness; show users exactly what's in their water.

### Step 2: Email / Name Unlock — Personalized Filter Recommendations

**Trigger:** User clicks to see their exact recommended filters

**Form:** Name + Email → unlock specific tiered filter recommendations on same page

**Outputs:**
1. Tiered filters matched to user's contaminants:
   - IonFaucet (entry / point-of-use)
   - Multipure (mid-tier / whole house option)
   - PureHome (whole house / high-end)
   - Anespa / K8 (optional spa or ionizer upgrades)
2. Personalized cost vs bottled water savings
3. CTA to purchase or schedule consultation

**Optional Email Follow-Up:**
- If user leaves before buying, automatically send full report with contaminants breakdown, tiered filter recommendations, bottled water cost comparison

**Goal:** Protect lead accuracy and maximize conversion; filters are tailored so users don't guess and buy the wrong system.

### Step 3: Conversion → Water / Health Funnel

**After filter recommendations:**
- Optional deeper health survey: Cellular hydration, Detox, Fertility / energy / skin
- Funnel into affiliate / water products / content
- Users can download a report or email a copy for reference

**Goal:** Move high-intent leads into full water + wellness ecosystem.

### Step 4: Contractor / Demo Integration (Optional)

- Show personalized water report in-person during PureHome / Anespa / K8 demo
- Walk clients through contaminant breakdown, bottled water cost comparison, tiered filtration options
- Same page template works for multiple clients

### Step 5: Follow-Up / Non-Converter Nurture

- Email summary with personalized water data + flags, tiered filter recommendations, bottled water cost comparison
- CTA to revisit purchase or deeper water/health funnel

### Step 6: Optional Deep-Dive / Health Funnel (Post-Purchase or Interest)

- Cellular hydration + detox info
- Fertility, energy, skin impact
- Links to blog, video, or previous water quiz
- Encourages higher-ticket purchases or upsells (Anespa, K8, full PureHome setup)

---

## 3. VISUAL FLOW (Maddie's Color-Coded Legend)

| Color | Meaning |
|-------|---------|
| Blue | User input / action |
| Green | Free information / educational content |
| Yellow | Email capture / gated personalized content |
| Orange | Conversion / purchase / funnel flow |
| Purple | Optional demo / contractor integration |
| Dashed arrows | Optional follow-ups / secondary paths |

---

## 4. PRODUCT TIERS (Filter Recommendations)

| Tier | Product | Position |
|------|---------|----------|
| Entry / Point-of-use | IonFaucet | Low-cost, easy install |
| Mid-tier / Whole house | Multipure | Step-up, broader coverage |
| High-end / Whole house | PureHome | Premium, complete system |
| Upgrade / Spa | Anespa | Luxury upgrade (spa) |
| Upgrade / Ionizer | K8 | Luxury upgrade (ionizer) |

---

## 5. IMPACT ON EXISTING BOARD

### Decisions Partially Resolved

| Issue | Decision | New Signal | Status |
|-------|----------|------------|--------|
| #17 Water Hub Placement | Dedicated site vs nested | Flowchart implies standalone funnel application at stopdrinkingacid.com, not a nested sub-page. Step 4 (contractor demo) suggests it must work as an independent tool. | → IN-REVIEW |
| #7 Subscription Boundary | Free vs gated vs paid | Clear split defined: Step 1 = free (no email), Step 2 = email-gated (filter recs), Steps 3-6 = post-conversion | → IN-REVIEW |
| #9 Quiz/GHL Integration | GHL embed + routing | Step 3 introduces "optional deeper health survey" — may replace or supplement the existing quiz concept. Needs clarification. | PENDING (new context) |

### Scope Expansions

| Issue | Original Scope | New Scope | Delta |
|-------|---------------|-----------|-------|
| #6 Physical Sovereignty Build | Static content pages (nodes 1-5) + CTA to water funnel | Dynamic data-driven application with ZIP lookup, EWG integration, email capture, filter engine, cost calculator | MAJOR expansion |
| #17 Water Hub | Architecture decision | Now implies a full application build | MAJOR expansion |

### New Technical Requirements (Not in Current Specs)

1. **EWG Database Integration** — ZIP code → contaminant lookup (external API or scraped dataset)
2. **Email Capture Form** — Name + Email with same-page progressive disclosure
3. **Filter Recommendation Engine** — Contaminant profile → tiered filter matching logic
4. **Bottled Water Cost Calculator** — Safeway 2026 pricing data (per bottle, case, gallon)
5. **Spring Locator** — "Find a spring near me" (FindASpring.com or similar API)
6. **Email Automation** — Follow-up sequences for non-converters (likely GHL integration)
7. **Report Generation** — Downloadable/emailable personalized water report
8. **Contractor/Demo Mode** — Same page as a reusable pitch tool for multiple clients

---

## 6. OPEN QUESTIONS FOR MADDIE

### Architecture
1. Does the Hydration Node live at `stopdrinkingacid.com` (separate domain) or as `/water/hydration-node` on `elevatealign.com`?
2. Step 4 (contractor demo) — does this need multi-client session support, or is it just the same page re-used manually?

### Data Sources
3. EWG database: Do we scrape/API from EWG, or does Maddie have a curated dataset of contaminants by ZIP?
4. Safeway 2026 bottled water prices: Where does this data come from? Manual entry or scraped?
5. Spring locator: FindASpring.com integration, or a different source?

### Product/Affiliate
6. Are IonFaucet, Multipure, PureHome, Anespa, and K8 all Enagic/Kangen products, or from different manufacturers?
7. Affiliate links: Does Maddie have affiliate URLs for each product tier, or do we need to set those up?
8. "Schedule consultation" CTA: Does this go to GHL booking, Calendly, or something else?

### Email Automation
9. "Automatically send full report" (Step 2 follow-up): Is this handled by GHL, or do we need to build email delivery?
10. Step 5 nurture sequence: GHL automation, or a different email platform?

### Priority
11. Maddie says "lock in water stuff this week" — does this mean the full 6-step dynamic funnel, or Steps 1-2 with the rest phased?

---

## 7. RECOMMENDED PHASING

Given the scope, suggest building in layers:

**Phase A (This Week):** Static representation of Steps 1-2
- ZIP input form (UI only, or with static/demo contaminant data)
- Email capture form
- Static filter tier display
- CTA to purchase / consultation
- Deployable as proof-of-concept

**Phase B (Week 2):** Dynamic data integration
- EWG contaminant lookup (API or curated dataset)
- Dynamic filter matching logic
- Cost comparison calculator
- Report generation

**Phase C (Week 3+):** Automation + nurture
- GHL email integration
- Follow-up sequences
- Health survey (Step 3)
- Contractor demo mode

---

**Canonical location:** `docs/superpowers/intakes/2026-04-03-maddie-hydration-node-funnel-spec.md`
**Related:** Handoff 2026-04-01, Issue #6, #7, #9, #17
