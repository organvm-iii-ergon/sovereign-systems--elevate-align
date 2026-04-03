# SOP-SS-CLT-001_001-ontology_client_decisions

**Title:** Client Decision Tracker  
**Domain:** Sovereign Systems Issue Management  
**Ordinal:** 001  
**Version:** 001  
**Status:** ACTIVE  
**Created:** 2026-04-03  
**Owner:** Orchestrator (AI Agent)

---

## Purpose

Track all issues requiring external decision/input from the client (Maddie). This document provides a single source of truth for what decisions are needed, their status, and what gates they unlock.

## Scope

- Issues labeled `client` in the project board
- Decision items that block work execution
- Excludes: Pure work items, content-only tasks, IRF legacy items

## Decision Inventory

| # | Issue Title | Decision Needed | Priority | Status | Gate Date |
|---|-------------|-----------------|----------|--------|-----------|
| 13 | Lock final Spiral node architecture (13 vs 14 + order) | Confirm 13-node structure, confirm ordering, confirm dropped nodes | P0 | PENDING | |
| 5 | Formalize 10% revenue agreement | Written/text confirmation: 10% water sales, 12 months, $10K cap | P0 | PENDING | |
| 3 | Connect custom domains (Cloudflare) | DNS registrar access (GoDaddy), confirm DNS changes | P1 | PENDING | |
| 14 | Verify doc 1b reel/video asset access | Re-share any inaccessible Google Drive folders | P1 | PENDING | |
| 17 | Decide Water Hub placement | Dedicated site vs nested sub-page | P2 | PENDING | |
| 18 | Decide video hosting strategy | Choose host: Google Drive, YouTube, Vimeo, other | P2 | PENDING | |
| 9 | Start Here quiz routing + GHL integration | GHL embed URL, routing rules by pillar | P1 | PENDING | |
| 7 | Subscription boundary and gated content model | Define free vs email-gated vs paid per node/pillar | P2 | PENDING | |
| 20 | Creature Selves concept decision | Keep live, defer to future, or archive | P3 | PENDING | |
| 19 | Inner Child Book packaging decision | Standalone product, Spiral-integrated, or deferred | P3 | PENDING | |

## Status Definitions

- **PENDING**: Awaiting initial decision from client
- **IN-REVIEW**: Decision submitted, awaiting confirmation
- **RESOLVED**: Decision recorded, gates met, can proceed
- **BLOCKED**: No progress possible, needs escalation

## Decision Templates

### Issue #13: Node Architecture

**Current State:** PENDING - Waiting for Maddie confirmation

**Decision Options:**
1. Adopt 13-node `2b` architecture (RECOMMENDED)
2. Keep 14-node HTML prototype architecture
3. Hybrid approach (specify which nodes)

**Ordering Options:**
1. Use `2b` phase order (recommended)
2. Use original HTML sequence
3. Custom order (specify)

**Dropped Nodes to Confirm:**
- Check-In
- Quantum Creation  
- Embodiment
- Rebirth

**Required Output:** Written confirmation (text/email) with clear statement of chosen architecture

### Issue #5: Revenue Agreement

**Current State:** PENDING - Waiting for written confirmation

**Verbal Agreement:** 10% of water sales until $10K cap, 12 month term

**Required Output:** Text/email from Maddie explicitly stating:
- "I agree to 10% of water sales"
- "For 12 months"
- "Up to $10,000 total"

### Issue #3: Domain Connection

**Current State:** PENDING - Waiting for DNS access

**Instructions:** See `docs/domain-setup.md`

**Required Output:**
- GoDaddy login access OR
- DNS record changes made by Maddie directly

### Issue #14: Video Asset Access

**Current State:** PENDING - Testing links from handoff

**Required Output:** Re-share notification for any inaccessible folders

### Issue #17: Water Hub Placement

**Current State:** PENDING - Waiting for architectural decision

**Options:**
1. Dedicated site (`stopdrinkingacid.com` becomes full site)
2. Nested section (`/water/` sub-section of Physical Sovereignty)

### Issue #18: Video Hosting

**Current State:** PENDING - Waiting for platform decision

**Options:**
- Google Drive (simple, but not embed-friendly)
- YouTube (public visibility concerns)
- Vimeo (paid, privacy controls)
- Other (specify)

### Issue #9: Quiz Routing

**Current State:** PENDING - Waiting for GHL details

**Required:**
- GHL embed URL
- Routing logic by pillar/result
- CTA handoff mapping

### Issue #7: Subscription Boundaries

**Current State:** PENDING - Waiting for content model decision

**Required:** Free/Email-gated/Paid matrix by:
- Page type
- Pillar
- Node

### Issue #20: Creature Selves

**Current State:** PENDING - Brand concept decision

**Options:**
- Keep as live brand concept
- Defer to future product/brand branch
- Archive from current build

### Issue #19: Inner Child Book

**Current State:** PENDING - Product packaging decision

**Options:**
- Standalone product
- Spiral-integrated gated asset
- Deferred/archive for later

## Impact Map

Client decisions block the following work:

```
#13 (P0) ─────┬─► #15 Spiral merge
              ├─► #8 Spiral interaction
              └─► #6 Physical build

#5 (P0) ──────► All revenue-generating work

#3 (P1) ──────► Production deployment

#14 (P1) ─────► #18 Video hosting
               └─► #9 Quiz routing (media assets)

#17 (P2) ─────► #6 Physical build (architecture)

#18 (P2) ─────► #6 Physical build (media integration)

#9 (P1) ──────► #6 Physical build (funnel)

#7 (P2) ──────► #6 Physical build (gating)

#20 (P3) ─────► γ-phase content planning

#19 (P3) ─────► γ-phase content planning
```

## Escalation Protocol

If decision remains PENDING for >7 days:
1. Send friendly reminder with specific questions
2. If >14 days, escalate: offer to proceed with recommendation
3. If >30 days, mark as BLOCKED and move to archive

## Related SOPs

- SOP-SS-ISS-001-001-ontology-issue-specification.md
- SOP-SS-PRC-001_001-ontology_meta_process.md
- SOP-SS-TRK-001_001-ontology_issue_tracking.md

---

**Last Updated:** 2026-04-03
