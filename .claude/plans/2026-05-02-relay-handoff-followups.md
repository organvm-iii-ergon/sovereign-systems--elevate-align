# Relay Handoff Continuation — 2026-05-02

## Context

Prior session shipped CI completion (af3ba65) + handoff plan (a0e6ccd), 1:1 parity verified. User selected **all 4** follow-ups from the resume question. This plan covers execution order, critical files, and verification.

State at plan-write time (verified, not assumed):
- HEAD = `a0e6ccd` ✓
- `git rev-list --count origin/main..main` = 0 ✓
- Working tree clean ✓
- Handoff plan: `.claude/plans/2026-05-02-handoff-triadic-review-ci-completion.md` (10,069 bytes) ✓

## Execution order

Order chosen for low-risk-first, preserving option to course-correct after each step:

### 1. Review the handoff plan (read-only, fastest)

Read `.claude/plans/2026-05-02-handoff-triadic-review-ci-completion.md` and surface a 5-bullet structural summary so the user can confirm/amend before later steps build on it.

**Critical file:** `.claude/plans/2026-05-02-handoff-triadic-review-ci-completion.md`

### 2. File trunk-lint gap as IRF entry

Add IRF entry for "trunk lint suite (17 linters) configured but never runs in CI — symmetric to today's test:all CI completion." The gap is real per memory `feedback_no_git_hooks.md` (precedent: `.trunk/trunk.yaml` disables `trunk-check-pre-push` + `trunk-fmt-pre-commit` deliberately because CI completion is the durable enforcement layer — but the linters themselves never run *anywhere* automatically right now).

**Critical files:**
- `~/Workspace/organvm/organvm-corpvs-testamentvm/INST-INDEX-RERUM-FACIENDARUM.md` (target: append entry)
- `.trunk/trunk.yaml` (read for current linter list to cite)
- `.github/workflows/ci.yml` (read to confirm trunk is absent from CI)

ID space: pick next available `IRF-CRP-NNN` after a quick grep for max existing N.

### 3. Prep CF token rotation steps (GH#52)

Write a short, owner-action-scoped runbook the user follows in the Cloudflare dashboard + GitHub. No secrets in repo. Steps land in `docs/runbooks/cf-token-rotation.md` (new file, low-risk addition).

**Critical files:**
- `docs/runbooks/cf-token-rotation.md` (new)
- (read-only) `.github/workflows/ci.yml` to confirm secret name (`CLOUDFLARE_API_TOKEN`)

### 4. Schedule action-bump agent

Use `/schedule` skill to queue a one-time agent firing ~2026-05-20 (≥10 days before the 2026-06-02 Node 24 forced-default deadline). Action: open a PR in this repo bumping `actions/checkout` and `actions/setup-node` to `@v4` if not already at v4.

**Critical files (for the future agent):**
- `.github/workflows/ci.yml` (read pinned versions before bumping)
- (target) New PR with conventional-commit title

## Reused utilities / patterns

- IRF append pattern: existing entries in `INST-INDEX-RERUM-FACIENDARUM.md` follow `IRF-XXX-NNN | Domain | Status | Description` — match the existing column layout, do not invent.
- Runbook pattern: `docs/handoff-maddie-spiral-path-2026-04-01.md` and `docs/superpowers/intakes/*` show the project's mirror-canonical-handoff style; CF runbook should mirror that voice.
- `/schedule` skill: per skill description, "in N weeks" cadence is supported; the trigger conditions (one-time agent for staged-rollout / TODO-with-removal-condition) match the actions-bump case exactly.

## Verification

- After step 1: surfaced summary matches the plan file's actual content (user confirms in chat).
- After step 2: `grep IRF-CRP- ~/Workspace/organvm/organvm-corpvs-testamentvm/INST-INDEX-RERUM-FACIENDARUM.md | tail -3` shows the new entry; ID has no collision.
- After step 3: `cat docs/runbooks/cf-token-rotation.md` returns the runbook; it references the correct secret name from CI.
- After step 4: the scheduled routine is present in `/schedule list` (or whatever the schedule skill exposes); fire-time + action description correct.

End-to-end durability check: commit any new files (IRF entry, runbook) and push; confirm `git rev-list --count origin/main..main` returns 0 again before declaring done. The /schedule operation is platform-side and does not need a commit, but I'll surface its acknowledgement to the user.

## Out of scope

- Actually rotating the CF token (owner action, requires browser + dashboard).
- Filing the IRF's GitHub-issue companion (would make it 2/3 EMBRYONIC; deferred unless user wants it now).
- Running the action bump now instead of in 2 weeks (scheduling is the explicit ask; preempting it removes the scheduling-discipline data point).
