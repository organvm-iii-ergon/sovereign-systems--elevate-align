# SOP-SS-TRK-001_001-ontology_issue_tracking

**Title:** Issue Tracking Matrix  
**Domain:** Sovereign Systems Issue Management  
**Ordinal:** 001  
**Version:** 001  
**Status:** ACTIVE  
**Created:** 2026-04-03  
**Owner:** Orchestrator (AI Agent)

---

## Purpose

Provide a single source of truth for tracking all issue specifications, their status, and gate completion. This matrix enables quick assessment of project health and bottleneck identification.

## Tracking Table

| Spec File | Issue # | Phase | Priority | Type | Status | Gate Met | Notes |
|-----------|---------|-------|----------|------|--------|----------|-------|
| spec-revenue-agreement.md | 5 | α | P0 | DECISION | GATED | | Revenue terms pending |
| spec-spiral-node-architecture.md | 13 | α | P0 | DECISION | GATED | | Blocks #15, #8, #6 |
| spec-revenue-confirmation.md | - | α | P0 | DECISION | GATED | | IRF-III-023 |
| spec-node-architecture-lock.md | - | α | P1 | DECISION | GATED | | IRF-III-024 |
| spec-ewg-api-implementation.md | - | β | P1 | WORK | SPEC | | IRF-III-025 |
| spec-domain-connection.md | 3 | α | P1 | DECISION | GATED | | DNS access pending |
| spec-video-asset-verification.md | 14 | α | P1 | DECISION | GATED | | Testing access links |
| spec-physical-sovereignty-build.md | 6 | β | P1 | WORK | SPEC | | |
| spec-spiral-merge.md | 15 | β | P1 | WORK | SPEC | | Depends on #13 |
| spec-quiz-ghl-integration.md | 9 | β | P1 | WORK | SPEC | | Depends on #14 |
| spec-spiral-interaction.md | 8 | β | P1 | WORK | SPEC | | Depends on #13 |
| spec-editorial-review.md | 16 | β | P1 | WORK | SPEC | | |
| spec-water-hub-architecture.md | 17 | β | P2 | DECISION | GATED | | |
| spec-video-hosting.md | 18 | β | P2 | DECISION | GATED | | |
| spec-subscription-boundary.md | 7 | β | P2 | DECISION | GATED | | |
| spec-creature-selves.md | 20 | γ | P3 | DECISION | GATED | | |
| spec-inner-child-book.md | 19 | γ | P3 | DECISION | GATED | | |
| spec-keystatic-cms.md | 11 | γ | P3 | WORK | SPEC | | |
| spec-store-buildout.md | 10 | γ | P3 | WORK | SPEC | | |
| spec-citation-correction.md | 12 | ω | P3 | WORK | SPEC | | |
| spec-keystatic-oauth.md | 1 | IRF | - | WORK | SPEC | | Legacy IRF |

## Status Legend

| Status | Meaning |
|--------|---------|
| GATED | Waiting on external decision (client) |
| SPEC | Specification being written |
| WIP | Work actively in progress |
| DONE | All work complete, awaiting gate verification |
| CLOSED | Gate met, issue resolved |

## Type Legend

| Type | Meaning |
|------|---------|
| DECISION | Requires external input before work |
| WORK | Can be executed once spec complete |
| BLOCKER | P0 item blocking multiple downstream |

## Phase Legend

| Phase | Description |
|-------|-------------|
| α | Blocking / foundational decisions |
| β | Core build / implementation |
| γ | Future-phase / deferred decisions |
| ω | Content fix / maintenance |
| IRF | Legacy IRF items |

## Metrics

| Metric | Value |
|--------|-------|
| Total Issues | 20 |
| SPEC Files Created | 20 |
| GATED (pending client) | 12 |
| WIP (in progress) | 0 |
| DONE (work complete) | 0 |
| CLOSED (gate met) | 0 |

### Status After Spec Expansion (2026-04-03)
- All 20 issues now have full specifications in `docs/superpowers/specs/`
- 12 issues require client decisions before work can proceed
- 8 work-ready issues available for execution

### Blocking Issues
- #13 (node architecture): Blocks #15, #8, #6
- #5 (revenue): Blocks all revenue work
- #3 (domains): Blocks production deployment

### Velocity
| Week | Specs | Work | Closed |
|------|-------|------|--------|
| 2026-W14 | 0 | 0 | 0 |

## Update Protocol

After each spec completion:
1. Update Status to `WIP`
2. Set Spec Complete date
3. Commit spec file

After work completion:
1. Update Status to `DONE`
2. Set Work Complete date
3. Verify all success criteria

After gate met:
1. Update Status to `CLOSED`
2. Set Gate Met date
3. Close GitHub issue

## Related SOPs

- SOP-SS-ISS-001_001-ontology_issue_specification.md
- SOP-SS-PRC-001_001-ontology_meta_process.md
- SOP-SS-CLT-001_001-ontology_client_decisions.md

---

**Last Updated:** 2026-04-03
