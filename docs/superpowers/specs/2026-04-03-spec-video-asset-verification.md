# Specification: Verify doc 1b reel/video asset access

**Issue:** #14 | **Phase:** α | **Priority:** P1 | **Status:** GATED

## Context

### Why This Matters
Doc 1b references three shared Google Drive folders for reel/video assets. These need verification before the media pipeline can proceed. If inaccessible, we need to request re-shares before work begins.

### Dependencies
- **Blocked by:** None
- **Blocks:** #18 (video hosting), #9 (quiz routing - media assets)
- **Requires:** Access to Google Drive links from handoff

### Upstream / Downstream
- **Upstream:** Handoff doc 1b
- **Downstream:** Video hosting decision, media integration

## Scope

### In-Scope
- Test all three shared links from handoff
- Record access status for each
- Document which are accessible, expired, or permission-blocked

### Out-of-Scope
- Downloading/syncing assets (done after verification)
- Video hosting implementation

### Boundaries
- Only test shared links; do not modify or download yet

## Output

### Deliverable
Access status report for each of three folders

### Success Criteria
- [ ] Folder 1: Access status recorded
- [ ] Folder 2: Access status recorded
- [ ] Folder 3: Access status recorded
- [ ] If inaccessible: Re-share request sent to Maddie

### Verification Method
Attempt to open each link in browser, record result

## Gate

**Gate Criterion:** All three folders are accessible OR a specific re-share request has been sent to Maddie

**Approver:** Studio (internal verification)

**Evidence Required:**
- Access status report
- Re-share request (if needed) with timestamp

## Execution Checklist

- [ ] Identify three shared links from handoff doc 1b
- [ ] Test link 1 in browser, record result
- [ ] Test link 2 in browser, record result
- [ ] Test link 3 in browser, record result
- [ ] If any inaccessible: draft re-share request
- [ ] Send request to Maddie
- [ ] Document results in this spec

## Tracking

| Field | Value |
|-------|-------|
| Spec Created | 2026-04-03 |
| Spec Complete | 2026-04-03 |
| Work Started | |
| Work Complete | |
| Gate Met | |
| Estimated Hours | 1 |
| Actual Hours | |

## Notes

### Source References
Links should be in `docs/handoff-maddie-spiral-path-2026-04-01.md` around media/assets section.

### Typical Issue
Google Drive shared links often expire or lose permission when owner changes account. Re-share is standard resolution.

### Tracking
Update with actual link results when tested.
