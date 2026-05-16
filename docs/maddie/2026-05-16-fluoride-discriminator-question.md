---
title: Fluoride-discriminator question for Maddie
date: 2026-05-16
status: draft (NOT auto-sent)
direction: outbound 4jp → Maddie
purpose: close GH#62 fluoride bug H1/H2/H3 hypothesis tree with one targeted question
parent: docs/internal/2026-05-16-maddie-imessage-transcript-and-signals.md (TL;DR point 3)
---

# Outbound: one-question fluoride discriminator

## Context (for your review before sending)

GH#62 (fluoride bug) has 3 live hypotheses:
- **H1** — Astro `_worker.js` shadows `functions/api/water-report.ts` → 404 → catch-block fallback fires (which DOES include fluoride post-c778f48). Diagnostic: Maddie sees badge `Sample Data` or `Demo (Server)`.
- **H2** — EWG HTML structure changed, parser silent-fails → server demo fallback fires (DEMO_REPORT contains fluoride; if true, Maddie WOULD have seen it). Diagnostic: same badge states as H1.
- **H3** — EWG genuinely has no fluoride row for Maddie's utility. UI gives no "checked but not detected" disclaimer. Fix is UI-only. Diagnostic: Maddie sees badge `ZIP {her zip}`.

The defensive ship (`c778f48`) added a 3-state badge that surfaces the data-source state on every visit. Maddie's report of "didn't see fluoride pop up" confirms the symptom but NOT the diagnostic — without knowing her badge state, all three hypotheses remain live.

One question closes the triage.

## The outbound (iMessage-ready, plain text — no markdown bold)

Paste this verbatim into iMessage. Plain text only, no asterisks (iMessage doesn't render them).

```
quick water page q — when you ran it and didn't see fluoride, what did the little badge at the top of the report say? three options:

— "Sample Data"
— "Demo (Server)"
— "ZIP {your zip number}"

one of those tells me exactly which of three things to fix. no rush 🙏
```

## Why this exact wording

- Opens with "quick" — signals low overhead, no time investment needed from her
- Names the badge explicitly — she may have skipped past it; saying "little badge at the top" puts her attention there
- Three options as bullet-like dashes — easy to read on iPhone, easy to reply with the matching one
- Closes with "no rush 🙏" — preserves the patient tone she's been using ("no stress" appears multiple times in her recent messages)
- 4 lines including the three options — fits on one iPhone screen, no scroll required

## Branching on her answer

| She says | Diagnosis | Action |
|---|---|---|
| "Sample Data" or "Demo (Fallback)" | H1 confirmed — Astro worker shadowing the route | Migrate `functions/api/water-report.ts` → `src/pages/api/water-report.ts` (mirrors `src/pages/capture.ts` precedent in CLAUDE.md). Probably ~30 min including verification. |
| "Demo (Server)" | H2 confirmed — EWG parser silent-fail | Inspect EWG HTML for her ZIP, update parser. May be ~1-2 hr depending on what changed. |
| "ZIP {number}" | H3 confirmed — EWG genuinely has no fluoride row for her utility | UI-only fix: add "Common contaminants checked but not detected" sub-list with fluoride prominently named. ~45 min. |
| "I don't see any badge" | The 3-state banner from `c778f48` may not have shipped to prod, or she's on a stale cache | Verify deploy state; ask her to hard-refresh and re-share. |

## Audit trail

- Source bug report: Maddie 2026-05-01 voice memo (transcript in `docs/internal/2026-05-16-maddie-imessage-transcript-and-signals.md`, Audio 2)
- Diagnosis doc: `docs/decisions/2026-05-01-water-report-fluoride-bug-diagnosis.md`
- Defensive ship: commit `c778f48` (added Fluoride to client fallback list + 3-state badge)
- Half-confirmed 2026-05-16: Maddie verified fluoride IS the issue but did NOT name the badge state
- This question closes the triage and unlocks the discriminated fix
