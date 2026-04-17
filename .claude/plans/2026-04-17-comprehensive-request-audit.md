# Comprehensive Maddie Request Audit — 2026-04-17

## Context

User requested a full re-review of ALL Maddie messages across 7 PDFs (Mar 25 – Apr 17, 2026) to ensure every client request is tracked. This plan documents the definitive gap analysis: every request mapped to its GitHub issue, with untracked items identified for issue creation.

**Sources reviewed:** 7 PDFs + 18 inline screenshots covering the complete client communication history.

---

## I. REVERSE-CHRONOLOGICAL TIMELINE — What Maddie Wants NOW vs. Then

### Apr 17, 2026 (TODAY — most recent)
- Provided Cloudflare credentials: eauco-mads / maddie@elevatealign.com
- Sent Hydration Node 6-step flowchart (detailed, production-ready spec)
- Automation fallback: simpler CTA acceptable if full backend automation isn't feasible
- Left out filler content — "not important because it was getting glitchy"
- Income stream urgency: "this will start converting sales & adds two/three more income streams"
- "going to really lock in water stuff this week fully & then we can get to subscription phase"
- Nonprofit vision: "start with donations & insta"
- Board/team signal: "can be on my board or my systems guy"
- Two calls: Sovereign Systems + Consciousness

### Apr 13, 2026 (Sunday)
- **Revenue terms written:** "10% of all sales on filters, subs, DP sign ups, and water sales til we hit 10k"
- **Water/filter page ASAP:** "so then I can start sending the water/filter page asap"
- **Subscription capability:** "ideally if we could plug in the subscription part too"
- **Self-service editing:** "where I can then go in and do a lot of the info/heavy lifting so you don't have to be the middle man"
- Payment/contract via text to unblock things

### Apr 12, 2026 (Saturday)
- **Nav gate FAILED:** "I tried poking around in the site... but got confused" (PREDATES nav overhaul commit `ae33323`)

### Apr 6, 2026 (Sunday)
- **Branch delineation reconfirmed:** "idk if we need to do the 6 water hub branches... cause I'm working on that right now... it's in GHL"
- Site = filtration entrance funnel only; GHL = branches (fertility, autoimmunity, etc.)

### Apr 4, 2026 (Friday — big decision session)
- **Node arch decisions:** Merge 3&4 → "Regulate", rename 5 → "Non Negotiable"
- **Revenue detail:** 10% of everything til 10k; DP=$99; filter commissions; subs $11/$22/$33
- **Creature Selves locked in:** "can be my own cause I can't find anything else like it"
- **Content approach:** "lock in bones/structure and then I can go in and fill in/edit stuff"
- **Flagged content:** "maybe we can just nightlight and I can go through and edit/remove"
- **Income streams enumerated:** filter commissions, water sales, DP, subs, virtual store, snail mail
- **Social marketing:** consistent on insta, growing to TikTok, has leads, outreach list ready

### Apr 1, 2026 (Tuesday — big intake)
- Sent 02-client-report.md (24KB) + Google Drive folder
- Sent V5 3D Helix prototype (Gemini-built)
- "Didn't do the instagram/post specifics yet but it's a very very good starting point"
- Showed v1 to two people: "they love it & can follow"
- "Will just have to go into tweak things/add more info & some videos"

### Mar 30, 2026 (Sunday)
- "Spiral code YAHOOOO!!" — found spiral concept, excited
- Working through ChatGPT thread exports
- Organizing content in Google Drive folders

### Mar 25-26, 2026 (earliest conversations)
- Initial project concept: spiral/helix site for health brand
- Water funnel = primary revenue driver
- Explore page should be email-gated
- Pillar ordering uncertainty (3 vs 4 — Identity or Financial?)
- Documentary/video plans
- Communication style: "I have trouble w words of conflict... I like to talk archaically & be silly"

---

## II. FULLY TRACKED — Request Has a Matching GitHub Issue

| Maddie Request | Issue | State |
|----------------|-------|-------|
| Custom domain setup (elevatealign.com → CF) | #3 | OPEN |
| Intake questionnaire delivery | #4 | CLOSED |
| 10% revenue agreement formalization | #5 | OPEN |
| Water/filter page (Physical Sovereignty nodes 1-5) | #6 | OPEN |
| Subscription boundary + gated content model | #7 | OPEN |
| Spiral should be movable/clickable | #8 | OPEN |
| Quiz routing + GHL integration | #9 | OPEN |
| Store buildout (virtual store) | #10 | OPEN |
| Self-service editing (CMS) — "don't want you to be the middle man" | #11 | OPEN |
| Node architecture lock (13 nodes, merge 3&4, rename 5) | #13 | CLOSED |
| Video/reel asset access verification | #14 | OPEN |
| V5/V6 prototype merge into production spiral | #15 | OPEN |
| Flagged content editorial review | #16, #25 | OPEN |
| Water Hub placement decision (site=filtration, GHL=branches) | #17 | OPEN (DECIDED) |
| Video hosting strategy for documentary/reel | #18 | OPEN |
| Inner Child Book packaging | #19 | OPEN |
| Creature Selves concept — "fully locked in, can be my own" | #20 | OPEN |
| Hydration Node funnel (6-step ZIP→EWG→filter→convert) | #23 | OPEN |
| Content genome merge (1,821→~1,000 atoms) | #24 | OPEN |
| Flagged atoms triage (104 pieces) | #25 | OPEN |
| Social content calendar routing (~200 SCRIPT atoms) | #26 | OPEN |
| EWG API for ZIP-based contaminant lookup | #29 | OPEN |
| Astrology, cycle syncing, human design integration | #30 | OPEN |
| Downloadable products (PDFs, guides, ebooks) | #31 | OPEN |
| Client walkthrough — nav confusion (pre-overhaul) | #36 | OPEN |
| Subscription payment collection capability | #38 | OPEN |
| Keystatic production handover | #1 | OPEN |
| docs/logos/ tetradic layer | #37 | OPEN |

**Count: 28 requests fully tracked across 31 issues.**

---

## II. PARTIALLY TRACKED — Request Exists but Details Need Updating

### 1. Subscription tiers: $11 / $22 / $33 per month
**Current tracking:** #7 (subscription boundary) + #38 (payment collection)
**Missing detail:** Specific tier pricing and what each tier includes:
- $11/month: access to 2 calls/month + more info/"VIP node access"
- $22 or $33: personalized guidance/blueprint with astrology & human design
- Two calls: "Sovereign Systems" + "Consciousness"
**Action:** Add comment to #7 with tier structure from Apr 4 messages.

### 2. Filter affiliate program setup
**Current tracking:** #23 (Hydration Node) covers filter recommendations
**Missing detail:** Maddie is setting up IonFaucet & Multipure affiliate accounts herself. The site needs affiliate link integration once she has them. She specifically said: "am working to get my affiliates account set up this week!"
**Action:** Note on #23 — affiliate link slots needed; awaiting Maddie's account setup.

### 3. Explore page email gating
**Original request (Mar 25-26):** Explore page should be "locked" behind email capture, with main overview/funnel link at top.
**Evolution:** The Hydration Node spec (#23) implements a more sophisticated version — free content at Step 1, email gate at Step 2 for personalized filter recs.
**Action:** Subsumed by #23. No separate issue needed.

### 4. Revenue scope broader than originally tracked
**Current tracking:** #5 tracks "10% of water sales until $10K"
**Actual written terms (Apr 13):** "10% of ALL sales — filters, subs, DP sign ups, and water sales — til we hit 10k"
**Also from Apr 4:** Maddie detailed DP sign-up at $99 (refundable 2 weeks), "maybe after 3 sign ups I can start giving you 10%"
**Action:** Comment already added to #5 in prior session. Verify it captures the full scope.

### 5. Automation fallback CTA
**From Apr 17:** "on the automations if we can't connect it all on the backend & have it spit out all the results I want then at the bottom the CTA can just be '...'"
**Action:** Product decision for #23 — if full EWG automation isn't feasible for v1, a simpler CTA is acceptable. Note on #23.

---

## III. UNTRACKED — No GitHub Issue Exists

### 1. Nonprofit / Donations Capability
**Source:** Apr 17 messages — "could maybe use some help cause I feel like this really does convert so well for the non profit stuff and could even just start with donations & insta"
**Scope:** WWOOF/farm-to-reset model as nonprofit arm. Housing/reset resources for "people who have been in our shoes."
**Priority:** P3 (future scope, not blocking current work)
**Action:** Create GitHub issue. Title: `[γ.5] Nonprofit arm — donations + farm-to-reset model`

### 2. Snail Mail Subscription
**Source:** Apr 4 — "eventually want virtual store & snail mail sub"
**Scope:** Physical mail subscription product. Mentioned alongside virtual store (#10).
**Priority:** P3 (future)
**Action:** Add as a line item on #10 (Store buildout) rather than separate issue.

### 3. Coffee Shop / Apartment Building Water Share
**Source:** Apr 4 — "also have the water share/subs stuff I'm getting ready for the coffee shop in AK and to offer in my apartment building too so that's 50/person/month!!"
**Scope:** Separate business channel, not site feature. B2B water share at $50/person/month.
**Priority:** Out of scope for this project. Document but don't issue.

### 4. Explainer Video on Explore Page
**Source:** Mar 25-26 — Maddie wanted a short explainer video on the explore page, separate from the documentary.
**Current state:** `VideoEmbed` component exists with `placeholder=true`. #14 tracks video asset access, #18 tracks hosting strategy. But no issue specifically tracks "add explainer video to water/explore page."
**Priority:** P2 (sub-task of #6 water page build)
**Action:** Add note to #6 — explore page needs explainer video slot.

---

## IV. CLIENT DELIVERABLES — Maddie's To-Do (Not Site Issues)

These are items Maddie committed to doing herself. They block site work but are not tracked as our issues:

| Deliverable | Status | Blocks |
|-------------|--------|--------|
| Film documentary video | Not started | #14, #18 |
| Set up IonFaucet/Multipure affiliate accounts | "Working on it this week" (Apr 4) | #23 affiliate links |
| Provide GHL quiz URL | Not provided — `ghl.quizFormUrl` is empty in hub.config.ts | #9 |
| Review 104 flagged content pieces (keep/reframe/move) | Not started | #16, #25 |
| Finish Instagram/post specifics | "Didn't do the instagram/post specifics yet" (Apr 1) | #26 |
| Send GHL branch content for reference | Offered to send (Apr 6) — not received | #17 context |
| Confirm pillar 3/4 ordering | Uncertain between Identity(3) and Financial(4) — not resolved | hub.config.ts order |

---

## V. PRODUCT DECISIONS EXTRACTED BUT NOT YET REFLECTED IN CODE

| Decision | Source Date | Current Code State | Issue |
|----------|------------|-------------------|-------|
| Nodes 3 & 4 merge → "Regulate" | Apr 4 | Not implemented — still separate in content | #6 |
| Node 5 rename → "Non Negotiable" | Apr 4 | Not implemented | #6 |
| Opening line: "this is not normal — leading cause of disease is inflammation" | Apr 4 | Not in content | #6 |
| Three health tells: water, sleep, bowel movements | Apr 4 | Not in content | #6 |
| "If you're not an 8 or higher in hydration..." metric | Apr 4 | Not in content | #6 |
| Button from water nodes looping to node 5 (water/hydration/cellular healing) | Apr 4 | Not implemented | #6 |
| Fluoride removal as key filter concern | Apr 4 | Not in Hydration Node content | #23 |
| "Find a spring near me" button | Apr 3 | Not implemented | #23 |
| Bottled water cost comparison (Safeway 2026 prices) | Apr 3 | Not implemented | #29 |
| Brita/RO reality check content | Apr 3 | Not in content | #23 |

---

## VI. EXECUTION PLAN

### Step 1: Create gap analysis document
Write `docs/client-decisions/2026-04-17-comprehensive-request-audit.md` containing:
- **Reverse-chronological timeline** (Section I) — most recent decisions surface first
- **Full cross-reference table** (Sections II-V) — every request mapped to its issue
- **Client deliverables** (Section IV) — what we're waiting on from Maddie
- **Product decisions not yet in code** (Section V) — implementation backlog

### Step 2: Create GitHub issues for untracked items
- **New issue:** Nonprofit / donations capability (`[γ.5]`, P3)
- No other items warrant separate issues — snail mail goes on #10, explainer video goes on #6

### Step 3: Update existing issues with missing detail
- **#7:** Add subscription tier structure ($11/$22/$33, two calls)
- **#23:** Add automation fallback CTA note, affiliate link readiness, fluoride concern, spring finder, Brita/RO check
- **#6:** Add node merging details (3&4→Regulate, 5→Non Negotiable), explainer video slot, content decisions from Apr 4
- **#10:** Add snail mail subscription line item

### Step 4: Update memory
- Update `project_board-state.md` with audit completion note
- No new memory files needed — existing coverage is comprehensive

### Step 5: Commit and push
- Commit gap analysis document + plan file
- Push to origin

---

## VII. CRITICAL FILES

| File | Action |
|------|--------|
| `docs/client-decisions/2026-04-17-comprehensive-request-audit.md` | CREATE |
| `.claude/plans/2026-04-17-comprehensive-request-audit.md` | CREATE (copy of plan) |
| `src/data/hub.config.ts` | READ ONLY (verify pillar order) |

---

## VIII. VERDICT

**Coverage is strong.** Of ~35 distinct client requests extracted across 7 PDFs:
- **28 are fully tracked** with matching GitHub issues
- **5 are partially tracked** and need detail updates on existing issues  
- **1 genuinely untracked item** needs a new issue (nonprofit/donations)
- **1 sub-feature** needs noting on an existing issue (explore video on #6)
- **1 out-of-scope item** (coffee shop B2B) is correctly not tracked

**Nothing critical was missed.** The board accurately reflects Maddie's requests. The gaps are detail-level (subscription pricing, automation fallback, content decisions not yet in code) rather than structural.

---

## IX. VERIFICATION

After execution:
1. Run `gh issue list --repo organvm-iii-ergon/sovereign-systems--elevate-align --state open --limit 50` to confirm new issue created
2. Verify gap analysis doc exists at `docs/client-decisions/2026-04-17-comprehensive-request-audit.md`
3. Verify git status clean and pushed to origin
4. Spot-check 3 issue comments were actually posted
