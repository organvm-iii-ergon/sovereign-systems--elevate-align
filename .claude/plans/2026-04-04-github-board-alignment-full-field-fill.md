# Sovereign Systems — GitHub Project Board Alignment & Full-Field Fill

**Date:** 2026-04-04
**Project:** sovereign-systems--elevate-align
**Scope:** GitHub Projects board template realignment + content cleanup + config filling

---

## Context

The GitHub Project board (project #5, `sovereign-systems--elevate-align--operating-board`) was cloned from project #3 (`[TEMPLATE]_founder-partner-delivery--operating-board`), which itself was designed for the **Styx** enterprise launch (project #2, 504 items, multi-founder/multi-department). That template carries 26 fields and views built for enterprise coordination — departments, owner roles, review personas, sprints, lanes — none of which apply to this project, which is a **1:1 client website build** (solo practitioner + client Maddie).

The project's own SOPs (`SOP-SS-TRK-001`) define a different, leaner field model: Phase/Priority/Type/Status/Gate Met. The board's Status field uses generic `Todo/In Progress/Done` while the SOP requires `GATED/SPEC/WIP/DONE/CLOSED`. This is the core misalignment.

Additionally, 5 of 6 branch content files contain template garbage from intake extraction, and the Astro site config has unfilled fields (GHL quiz URL, video embed URLs).

---

## Part A: GitHub Project Board Realignment

### A1. Field Model — What to Keep, Remove, Add

**KEEP (aligned with SOP or useful):**

| Field | Type | Board Has | SOP Requires | Action |
|-------|------|-----------|--------------|--------|
| Status | Single-select | Todo/In Progress/Done | GATED/SPEC/WIP/DONE/CLOSED | **Reconfigure options** |
| Priority | Single-select | P0-blocker/P1-high/P2-medium/P3-backlog | P0/P1/P2/P3 | ✅ Already aligned |
| Target Date | Date | ✅ | Useful | Keep, fill gaps (63% filled) |
| Next Action | Text | ✅ | Useful | Keep, fill (77% empty) |
| External Party | Text | ✅ | Useful for client items | Keep, fill for GATED items |
| Category | Single-select | A-Plans/B-Sessions/C-Cache/D-Infra | — | Review options for this project |
| Work Type | Single-select | Epic/Feature/Blocked Handoff/Decision/Bug/Artifact/Ops | Maps to SOP Type | Keep, may serve as Type proxy |
| Source Plan | Single-select | Various PLANS-- and SESSIONS-- | — | Keep, useful for traceability |

**ADD (required by SOP, missing from board):**

| Field | Type | Options | Source |
|-------|------|---------|--------|
| Phase | Single-select | α, β, γ, ω, IRF | SOP-SS-TRK-001 |
| Type | Single-select | DECISION, WORK, BLOCKER | SOP-SS-TRK-001 |
| Gate Met | Single-select or Checkbox | Yes/No or ✅ | SOP-SS-TRK-001 |

**REMOVE or HIDE (enterprise template artifacts, <40% fill rate, wrong domain):**

| Field | Why Remove | Current Fill Rate |
|-------|-----------|-------------------|
| Department | Enterprise multi-dept (ENG/LEG/PRD/OPS/GRO/FIN/CXS/B2B) — solo practitioner project | 47% |
| Owner Role | 16 enterprise roles (CLOUD_ARCH, PRODUCT_LEAD, etc.) — no team | 40% |
| Review Persona | 16 review types — no review team | 27% |
| Review Stage | Enterprise review pipeline (Draft/Cross-Review/Revision/Approved) — not applicable | 33% |
| Lane | Styx-specific (Partner/Engineering/Shared/Archive) | ~30% |
| Sprint | S1-S4/Later — not using sprints | ~30% |
| Token Budget | AI token tracking — not relevant | 7% |
| Phase Energy | Undefined, unused | 13% |
| Effort | XS-XL sizing — optional, low value for this project | 40% |

### A2. Status Field Reconfiguration

**Current options:** `Todo`, `In Progress`, `Done`
**Target options (per SOP-SS-TRK-001):**

| Status | Meaning | Maps From |
|--------|---------|-----------|
| GATED | Waiting on external decision (client) | Todo (for blocked items) |
| SPEC | Specification being written | Todo (for spec items) |
| WIP | Work actively in progress | In Progress |
| DONE | Work complete, awaiting gate verification | Done (not yet closed) |
| CLOSED | Gate met, issue resolved | Done (verified) |

**Migration mapping for existing 124 items:**
- Items with `client` label + `Todo` → `GATED`
- Items with `Todo` + spec exists → `SPEC`
- Items with `In Progress` → `WIP`
- Items with `Done` + not verified → `DONE`
- Items with `Done` + verified → `CLOSED`

### A3. Views to Create

Replace Styx-derived views with project-specific views:

| View | Type | Filter/Group | Purpose |
|------|------|-------------|---------|
| **All Issues** | Table | None | Master view, all fields visible |
| **Client Gated** | Board | Status = GATED, group by Priority | Items awaiting Maddie's input |
| **Ready to Build** | Table | Status = SPEC, sorted by Priority | Work-ready items |
| **Critical Path** | Table | Priority = P0 or P1, sorted by Phase | Blocking chain visibility |
| **By Phase** | Board | Group by Phase (α/β/γ/ω) | Phase-based planning |
| **Completed** | Table | Status = DONE or CLOSED | Finished work archive |

### A4. Item Field Filling

For each of the ~20 active issues (from SOP tracking table), fill:

| Issue # | Phase | Type | Status | Priority | Next Action | External Party |
|---------|-------|------|--------|----------|-------------|----------------|
| 5 | α | DECISION | GATED | P0 | Revenue terms pending Maddie review | Maddie |
| 13 | α | DECISION | GATED | P0 | Node architecture decision from Maddie | Maddie |
| 3 | α | DECISION | GATED | P1 | DNS access from Maddie/domain registrar | Maddie |
| 14 | α | DECISION | GATED | P1 | Test video asset access links | Maddie |
| 6 | β | WORK | SPEC | P1 | Begin physical sovereignty node build | — |
| 15 | β | WORK | SPEC | P1 | Merge V5/V6 prototypes (blocked by #13) | — |
| 9 | β | WORK | SPEC | P1 | Quiz routing + GHL integration (blocked by #14) | — |
| 8 | β | WORK | SPEC | P1 | Spiral interaction target (blocked by #13) | — |
| 16 | β | WORK | SPEC | P1 | Editorial review of flagged claims | — |
| 17 | β | DECISION | GATED | P2 | Water Hub placement decision from Maddie | Maddie |
| 18 | β | DECISION | GATED | P2 | Video hosting strategy decision | Maddie |
| 7 | β | DECISION | GATED | P2 | Subscription boundary model decision | Maddie |
| 20 | γ | DECISION | GATED | P3 | Creature Selves concept decision from Maddie | Maddie |
| 19 | γ | DECISION | GATED | P3 | Inner Child Book packaging decision | Maddie |
| 11 | γ | WORK | SPEC | P3 | Keystatic CMS setup | — |
| 10 | γ | WORK | SPEC | P3 | Store buildout | — |
| 12 | ω | WORK | SPEC | P3 | Citation correction (B-106) | — |
| 22 | — | WORK | — | P2 | Route 63 N/A atoms | — |

For the remaining ~104 draft/other items: audit each, fill Phase/Type/Status/Priority at minimum, or archive if stale.

---

## Part B: Branch Content Cleanup

### Contamination Audit Results

| File | Lines | Garbage Range | Severity |
|------|-------|---------------|----------|
| `gut-hormones.md` | 118 | Lines 49–118 | **HEAVY** — grocery lists, research notes, email drafts, "Who is John Stuart Reid" |
| `fertility.md` | 91 | Lines 51–81 | **HEAVY** — endometriosis chat, design feedback ("Terracotta Rose"), PDF discussion |
| `athletic.md` | 91 | Lines 42–81 | **HEAVY** — Cheetos toxic breakdown, 30-day acupressure routine, meme discussion |
| `autoimmune.md` | 99 | Lines 49–90 | **HEAVY** — fascia/neurodivergence, "E•A•U Spiral Blueprint", morning flow plan |
| `sustainability.md` | 61 | Lines 40–51 | **LIGHT** — client chat fragments ("Thank you so much!", funnel quotes) |
| `cancer-support.md` | 47 | None | **CLEAN** |

### Cleanup Action Per File

For each contaminated file, the pattern is the same:
1. Content through `## Bridge` section is **clean and well-written**
2. Everything after Bridge (under `## Research & Evidence`, `### Key Frameworks`, `### Protocols`, `### From Maddie's Research`) is **intake garbage**
3. The `## Resources` and `## CTA` sections at the end are clean

**Action:** For each file, remove all content between the end of `## Bridge` and the start of `## Resources`. Leave a clean `## Research & Evidence` heading with a placeholder note, preserving the Resources and CTA sections.

---

## Part C: Astro Site Config Filling

### Items Requiring Maddie (→ GitHub Issues)

| Config | File | Current | Needed | Issue |
|--------|------|---------|--------|-------|
| GHL quiz form URL | `src/data/hub.config.ts` line 136 | `''` (empty) | GHL embed URL | Relates to #9 |
| Water documentary URL | `src/pages/water/index.astro` line 18 | `placeholder={true}` | Video embed URL | Relates to #18 |
| Business hub video URL | `src/pages/business/index.astro` line 22 | `placeholder={true}` | Video embed URL | Relates to #18 |

These are already tracked by existing issues (#9, #18) — no new issues needed. Ensure the board items have `External Party: Maddie` and `Next Action` filled.

### Items Fixable Without Client Input

| Config | File | Action |
|--------|------|--------|
| EmailGate hardcoded "263" | `src/components/EmailGate.astro` line 40 | Derive count from `citations.length` or update to actual count |

---

## Part D: SOP Corrections

| SOP | Issue | Fix |
|-----|-------|-----|
| `SOP-SS-QAB-001_001` line 19 | References `organvm-iii-ergon/projects/3` (the template) | Update to `organvm-iii-ergon/projects/5` |
| `SOP-SS-TRK-001_001` | Tracking table may need new issues (#21, #22) added | Reconcile with current `gh issue list` |

---

## Execution Order

1. **A1–A3: Board field model + views** — Add Phase/Type/Gate Met fields, reconfigure Status options, hide enterprise fields, create new views
2. **A4: Fill item fields** — Walk through all 20+ active issues and populate Phase/Type/Status/Priority/Next Action/External Party
3. **B: Content cleanup** — Remove garbage from 5 branch files
4. **C: Config filling** — Fill what's possible, ensure Maddie items are tracked on board
5. **D: SOP corrections** — Fix project reference, reconcile tracking table

## Verification

- [ ] `gh project field-list 5 --owner organvm-iii-ergon` shows new fields (Phase, Type, Gate Met)
- [ ] Status field has 5 options: GATED/SPEC/WIP/DONE/CLOSED
- [ ] All 20 active issues have Phase, Type, Status, Priority filled
- [ ] All GATED items have External Party = "Maddie" and Next Action filled
- [ ] Views created and accessible at project URL
- [ ] `npm run build` passes after content cleanup
- [ ] All branch files have clean structure (no intake garbage)
- [ ] SOP-SS-QAB references project/5
- [ ] SOP-SS-TRK tracking table matches board state

---

## Key Files

```
Board:     https://github.com/orgs/organvm-iii-ergon/projects/5
Template:  https://github.com/orgs/organvm-iii-ergon/projects/3  (source of misalignment)
SOP:       docs/sops/SOP-SS-QAB-001_001-project-board-qa.md
SOP:       docs/sops/SOP-SS-TRK-001_001-ontology_issue_tracking.md
Content:   src/content/branches/*.md  (5 of 6 contaminated)
Config:    src/data/hub.config.ts     (quizFormUrl empty)
```
