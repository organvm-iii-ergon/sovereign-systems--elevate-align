# SOP-SS-QAB-001_001-project-board-qa

**Title:** Project Board Quality Assurance  
**Domain:** Sovereign Systems Governance  
**Ordinal:** 001  
**Version:** 001  
**Status:** ACTIVE  
**Created:** 2026-04-04  
**Owner:** Orchestrator (AI Agent)

---

## Purpose

Define the mandatory Quality Assurance (QA) rituals for maintaining the GitHub Project Board. This ensures the physical board (GitHub) and the spiritual record (IRF/Documentation) remain in perfect 1:1 parity.

## Scope

- GitHub Project Board: [organvm-iii-ergon/projects/3](https://github.com/orgs/organvm-iii-ergon/projects/3)
- Repository Issues: `organvm-iii-ergon/sovereign-systems--elevate-align`
- Local Tracking: `docs/sops/SOP-SS-TRK-001_001-ontology_issue_tracking.md`
- Universal Record: `meta-organvm/organvm-corpvs-testamentvm/INST-INDEX-RERUM-FACIENDARUM.md`

## Input

- Session closure reports (e.g., `docs/reports/2026-04-04/`)
- Current GitHub issue list
- IRF `## Completed` section

## Rituals

### 1. The Pre-Close Audit (Every Session)

Before closing a session, the agent MUST:
1. **Verify Parity**: Every new finding in today's report that implies work must have a corresponding GitHub Issue OR a logged IRF item.
2. **Metadata Scrub**: Check all active issues for:
   - Correct Phase label (α, β, γ, ω)
   - Correct Priority (P0-P3)
   - Updated "Status" column on the Project Board
3. **Spec Sync**: Ensure `docs/superpowers/specs/` has a file for every ISSUE on the board.

### 2. The Universal Sync (Weekly/Milestone)

1. **IRF → GitHub**: Any P0/P1 item in the IRF for Organ III must be promoted to a GitHub Issue.
2. **GitHub → IRF**: Any CLOSED issue on GitHub must be moved to the `## Completed` section of the IRF.
3. **Vacuum Check**: Identify any "N/A" values in board metadata and replace with researched data.

## QA Checklists

### Issue Parity Check
- [ ] Issue title matches Spec filename slug
- [ ] Issue body contains link to the remote `.md` spec
- [ ] Issue labels correctly reflect Phase and Pillar

### Board State Check
- [ ] No issues in "Todo" have a "WIP" status in local tracking
- [ ] "Done" column items have a corresponding `DONE-NNN` entry in IRF
- [ ] Client-blocking items are in the "Gated" status

## Corrective Actions

- **If local > remote**: Create missing GitHub issues immediately.
- **If remote > local**: Read issue, create spec file, and add to tracking table.
- **If metadata clash**: Defer to the local `SOP-SS-TRK-001` as the source of truth and update GitHub to match.

## Related SOPs

- SOP-SS-TRK-001_001-ontology_issue_tracking.md
- SOP-SS-ISS-001-001-ontology-issue-specification.md
- meta-organvm/INST-INDEX-RERUM-FACIENDARUM.md

---

**End of SOP**
