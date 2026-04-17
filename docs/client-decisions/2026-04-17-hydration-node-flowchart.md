# Hydration Node + Water Funnel Flowchart — 2026 Blueprint

Source: Client-provided (Maddie), received 2026-04-17

## Visual Flow

```
[User Entry: ZIP & Water Source]
          |
          V
[Step 1: Contaminant Overview & Free Resources]
          |
          V
[Step 2: Email Unlock -> Personalized Filter Recommendations]
          |
          V
[Step 3: Conversion -> Water / Health Funnel]
          |
          V
[Step 4: Contractor / Demo Integration (Optional)]
          |
          V
[Step 5: Follow-Up Email / Non-Converter Nurture]
          |
          V
[Step 6: Optional Deep-Dive Health Funnel / Upsells]
```

## Step 1: Free Resource Layer — Awareness & Education

**User input:** ZIP code + water source (tap, well, bottled, unsure)

**Outputs (immediate, no email needed):**
- Specific contaminants for their ZIP from EWG database
- Dual flags: Legal limit (FDA / municipal standard) AND Recommended health guideline
- Tooltips: hydration, skin, detox, cellular effects
- Bottled water cost comparison (Safeway 2026 prices — per bottle, per case, per gallon)
- "Find a spring near me" button
- Brita / RO reality check

**Goal:** Build trust and awareness; show users exactly what's in their water.

## Step 2: Email / Name Unlock — Personalized Filter Recommendations

**Trigger:** User clicks to see their exact recommended filters

**Form:** Name + Email → unlock specific tiered filter recommendations on the same page

**Outputs:**
1. Tiered filters matched to user's contaminants:
   - **IonFaucet** (entry / point-of-use)
   - **Multipure** (mid-tier / whole house option)
   - **PureHome** (whole house / high-end)
   - **Anespa / K8** (optional spa or ionizer upgrades)
2. Personalized cost vs bottled water savings
3. CTA to purchase or schedule consultation

**Optional Email Follow-Up:**
- If user leaves before buying, automatically send full report with contaminants breakdown, tiered filter recommendations, bottled water cost comparison

**Goal:** Protect lead accuracy and maximize conversion.

## Step 3: Conversion — Water / Health Funnel

After filter recommendations:
- Optional deeper health survey: cellular hydration, detox, fertility/energy/skin
- Funnel into affiliate / water products / content
- Users can download a report or email a copy for reference

## Step 4: Optional Contractor / Demo Integration

- Show personalized water report in-person during PureHome / Anespa / K8 demo
- Walk clients through contaminant breakdown, bottled water cost comparison, tiered filtration options
- Allows contractor pitches using same page template for multiple clients

## Step 5: Follow-Up / Non-Converter Nurture

Email summary with:
- Personalized water data + flags
- Tiered filter recommendations
- Bottled water cost comparison
- CTA to revisit purchase or deeper water/health funnel

## Step 6: Optional Deep-Dive / Health Funnel (Post-Purchase or Interest)

- Cellular hydration + detox info
- Fertility, energy, skin impact
- Links to blog, video, or previous water quiz
- Encourages higher-ticket purchases or upsells (Anespa, K8, full PureHome setup)

## Implementation Notes

### Data Sources Required
- **EWG Tap Water Database** — ZIP-based contaminant data (scrape or API)
- **Safeway 2026 bottled water prices** — for cost comparison calculations
- **Product catalog** — IonFaucet, Multipure, PureHome, Anespa, K8 specs and affiliate links

### Technical Architecture (Proposed)
- Step 1 (free layer): Static Astro page with client-side ZIP lookup
- Step 2 (email gate): Extends existing `functions/capture.ts` with name field, triggers GHL workflow for filter recommendations
- Steps 3-6: GHL automation sequences triggered by capture event

### Delineation with GHL
Per Maddie's branch delineation decision: the SITE handles Steps 1-2 (awareness + capture). GHL handles Steps 3-6 (nurture, follow-up, deep-dive sequences). The site is the entrance funnel; GHL is the conversion engine.

## Color Coding (from client)

| Color | Function |
|-------|----------|
| Blue | User input / action |
| Green | Free information / educational content |
| Yellow | Email capture / gated personalized content |
| Orange | Conversion / purchase / funnel flow |
| Purple | Optional demo / contractor integration |
