# Phase 2 + 3 findings: autogen blast radius, IRF-OPS-040 reframing, Maddie drafts

**Date:** 2026-05-17 (post-/clear session)
**Working dir:** `/Users/4jp/Code/organvm/sovereign-systems--elevate-align`
**Branch:** `docs/agents-md-corrections-2026-05-17` (PR #103 in flight — DO NOT mix this session's findings into it)

## Phase 2: Reframed from "commit fix to corpvs" → "report findings, don't commit"

### What the handoff predicted

> Expected finding: registry path still `~/Workspace/organvm-iii-ergon/...` (pre-relocation). Fix is to update the registry path to `~/Code/organvm/sovereign-systems--elevate-align`.

### What I actually found

1. **`registry-v2.json` carries no filesystem paths** — only `name` + `org`. The path-drift framing was a near-miss.
2. **`~/Workspace/organvm-iii-ergon/` doesn't exist** — the whole organ migrated, not just this repo. Mixed layout in flight: `~/Code/organvm-i-theoria/` (flat), `~/Code/organvm/<repo>` (nested), `~/Workspace/organvm/` (legacy), three different `meta-organvm/` dirs.
3. **Actual bug in `organvm_engine/contextmd/sync.py:40`** — `ws = Path(workspace) if workspace else Path.home() / "Workspace"`. With repos at `~/Code/organvm/`, walker misses them entirely. Section 3b (`for root in extra_roots`) would catch them IF `additional_workspace_roots` is configured.
4. **The fix is already in flight by a parallel session.** `~/Code/organvm/organvm-corpvs-testamentvm/governance-config.yaml` has uncommitted addition (working tree):
   ```yaml
   additional_workspace_roots:
     - /Users/4jp/Code/organvm
   ```
   Comment tags `IRF-DOM-048`. This is exactly the fix I would have proposed. DO NOT touch it.
5. **`IRF-OPS-040` already covers this exact bug** (filed 2026-05-16 from Styx context-refresh session in `peer-audited--behavioral-blockchain`). IRF entry at `~/Code/organvm/organvm-corpvs-testamentvm/INST-INDEX-RERUM-FACIENDARUM.md:292`.

### NEW bug discovered this session (file as new IRF)

**`organvm context sync --dry-run` actually writes to filesystem** while reporting `[DRY RUN] No files were modified.`

Evidence: ran `ORGANVM_WORKSPACE_DIR=~/Code/organvm organvm context sync --dry-run` from `/tmp` with this repo's tree clean. After the run, this repo's `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` all had mtime in the run window and showed `git diff` reverting the deliberate IRF-CRP-014 trim (commit `7714b0f`).

Reproduction (DANGEROUS — will write to dozens of repos):

```bash
cd /tmp
ORGANVM_ADDITIONAL_WORKSPACE_ROOTS=~/Code/organvm:~/Code organvm context sync --dry-run
# Output: "Updated: 246, Created: 3, [DRY RUN] No files were modified."
# Reality: 240 files written across 80 dirs.
```

Suggested IRF text:

> `organvm context sync --dry-run` writes to disk while printing `[DRY RUN] No files were modified.` Reproduced 2026-05-17. Likely in `organvm_engine.contextmd.sync.sync_all()` — `_inject_section(..., dry_run)` is called but may not respect the flag. Blast-radius reproduction with `ORGANVM_ADDITIONAL_WORKSPACE_ROOTS=~/Code/organvm:~/Code` wrote 240 files across 80 directories.

#### Ready-to-paste IRF entry (post-cascade, 2026-05-17 post-/compact)

Cascade resolution: Phase 4 close-out cascade routed to file this IRF. Claude Code permission classifier blocked cross-org corpvs stash without explicit per-session auth; entry stored here pending user auth in a corpvs session.

**Append location:** existing `### S-2026-05-17-harmonic-sparking-teacup Discovered Items` subsection in `~/Code/organvm/organvm-corpvs-testamentvm/INST-INDEX-RERUM-FACIENDARUM.md` (currently ends after IRF-OPS-050 at line ~2298; insert below it before the blank line at 2299). Continuation of the same session lineage post-/compact; no new subsection needed.

**Workflow when authorizing:**

1. `cd ~/Code/organvm/organvm-corpvs-testamentvm`
2. Inspect 3 modified files (parallel-session autogen): `git diff --stat` — confirm they're CLAUDE/AGENTS/GEMINI.md only
3. `git stash push -m "autogen-not-mine" -- AGENTS.md CLAUDE.md GEMINI.md`
4. Edit IRF file: append the row below after current line 2298
5. `git add INST-INDEX-RERUM-FACIENDARUM.md && git commit -m "irf: +IRF-OPS-051 organvm context sync --dry-run writes-anyway bug"`
6. `git stash pop`
7. `git push origin main`

**Row to insert (single table row, pipe-delimited, matches IRF-SYS-181/IRF-OPS-050 schema):**

```text
| IRF-OPS-051 | **P2** | **`organvm context sync --dry-run` writes to disk while printing `[DRY RUN] No files were modified.`** Empirical 2026-05-17 during post-`/compact` Phase 4 close-out cascade (this session). Reproduction: from `/tmp` with target repo's working tree clean, `ORGANVM_ADDITIONAL_WORKSPACE_ROOTS=~/Code/organvm:~/Code organvm context sync --dry-run` printed `Updated: 246, Created: 3, [DRY RUN] No files were modified.` Verification: post-run `git diff` in `~/Code/organvm/sovereign-systems--elevate-align` showed `CLAUDE.md`/`AGENTS.md`/`GEMINI.md` all mutated with mtime in the run window, reverting the deliberate IRF-CRP-014 trim (commit `7714b0f`). Total blast: **240 files written across 80 directories** by two `--dry-run` invocations. Restored via `git -C <dir> restore CLAUDE.md AGENTS.md GEMINI.md` loop across 75 git-tracked dirs (2 special cases handled: corpvs Code-clone newly-created untracked AGENTS+GEMINI deleted; domus chezmoi-source CLAUDE.md restored; 5 NOT-GIT dirs left intact with their auto-block markers refreshed). Likely root cause: `organvm_engine.contextmd.sync.sync_all()` passes `dry_run` to `_inject_section(...)` but the section-injection path does not gate the actual write call on the flag (or the gate is misplaced and only suppresses the post-write log line, not the write itself). The stdout `[DRY RUN] No files were modified.` is therefore a **false-success report** — same failure-mode family as IRF-OPS-050 (refresh silent-skip) and IRF-SYS-181 (chezmoi silent-enrollment-drift): the user-facing channel asserts a state that does not match disk. Damage potential is much higher than its siblings — `--dry-run` is the safety affordance users invoke specifically to AVOID writes when probing behavior; violating that contract turns the safest invocation into the most expensive. Operational impact this session: 240-file blast required ~5 min cleanup loop and 1 advisor call to confirm the cleanup pattern; had the user been less attentive, the trim of IRF-CRP-014 (CLAUDE.md bloat past 40K /doctor limit) would have been silently reversed across multiple repos. Closure options: (a) audit `organvm_engine/contextmd/sync.py` `_inject_section` and any nested write paths to confirm `dry_run` short-circuits BEFORE the file write, not after (estimated ~30 min including unit test that asserts no mtime change in a tmpdir under `--dry-run`); (b) add an integration test that runs `--dry-run` against a tmpdir fixture and asserts file SHA-256 unchanged pre/post (~20 min; defends against regression); (c) bundle with IRF-OPS-050 + IRF-SYS-181 closure under a single "loud-warn + correct-dry-run" PR since all three are user-facing-channel-lies in the same subsystem. Pairs with IRF-OPS-050 (sibling — silent-skip on path drift), IRF-SYS-181 (sibling — silent enrollment drift), IRF-CRP-014 (the trim this bug silently undoes), IRF-SYS-178 (system-wide autogen drift — this bug masks attempts to safely inspect what refresh would do). Acceptance: `organvm context sync --dry-run` exits with no filesystem mutations (verified by SHA-256 pre/post on every reachable file in the walk). | Agent | S-2026-05-17-harmonic-sparking-teacup (post-/compact Phase 4 cascade), `.claude/plans/2026-05-17-phase-2-3-findings-blast-radius-and-drafts.md` in `sovereign-systems--elevate-align` | None |
```

### Blast-radius cleanup completed this session

- **240 context files** (`CLAUDE.md`/`AGENTS.md`/`GEMINI.md`) modified across 80 directories by my two `--dry-run` invocations.
- **75 git-tracked dirs reverted** via `git -C <dir> restore CLAUDE.md AGENTS.md GEMINI.md` in a loop.
- **2 special cases:**
  - `~/Code/organvm/custodia-securitatis`: CLAUDE.md restored, untracked AGENTS.md + GEMINI.md (newly created) deleted.
  - `~/Workspace/4444J99/domus-semper-palingenesis`: CLAUDE.md restored (chezmoi source — autoCommit not triggered per `feedback_chezmoi_add_collision.md`).
- **5 NOT-GIT dirs LEFT INTACT** (auto-block markers preserved; pre-block static content untouched):
  - `~/Code/organvm/studium-generale` (not-yet-git-init'd; treat as deliberate refresh)
  - `~/Workspace/` (workspace-level CLAUDE.md, 223 lines of substantive workspace map — only auto-block updated)
  - `~/Workspace/meta-organvm/` (legacy stale path; auto-block only)
  - `~/Workspace/meta-organvm/organvm-corpvs-testamentvm/` (legacy stale path; auto-block only)
  - `~/Workspace/meta-organvm/praxis-perpetua/` (legacy stale path; auto-block only)
- **Parallel session has run autogen AGAIN since my revert** (240 files re-touched at 16:43:01 — after my revert at 16:40). Not my concern. Stopping cross-repo work.
- **This repo's working tree restored to clean** (after final revert at 16:45ish).

### Phase 2 outcomes (proposed)

| Outcome                                                                          | Status                                                                              |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| File new IRF for `--dry-run writes` bug                                          | NEEDS USER GO (corpvs commit auth)                                                  |
| Fix the bug (engine code edit in `organvm-engine`)                               | NEEDS USER GO (cross-repo, engineering scope)                                       |
| Wait for parallel session's `additional_workspace_roots` fix to ship + retest    | RECOMMENDED — defers all of the above until the parallel session lands their commit |
| Bypass autogen-gate on next /closeout via `AUTOGEN_FRESHNESS_THRESHOLD_DAYS=999` | NEEDS USER GO (authorization gate for bypass)                                       |

## Phase 3: Maddie drafts (verbatim, paste-ready)

All 3 already on disk under `docs/maddie/`. Reading-order recommendation: skip HOLD entirely (cleanup is already shipped per prior session logs), send CLEAR alone, send fluoride-question separately whenever convenient.

### Draft 1 — HOLD (probably skip — cleanup already done)

```text
hey hold on — don't paste those 6 HTML files into GHL yet, found some stray content in there from old chat exports that shouldn't be in client copy. cleaning + re-shipping in ~30 min 🙏
```

### Draft 2 — CLEAR (send this one)

```text
ok cleaned + reshipped 🌀 same folder, all 6 files replaced. safe to paste into GHL now.

what happened: when I converted your branch content into HTML, my script grabbed some old chat-export snippets that had ended up in the source files (totally my mistake, not yours). they're gone now. live site is clean too.

(if you already pasted any of the old ones, just re-paste from the new files — the contaminated section was at the bottom of the page, marked "Research & Evidence" — that whole block is now removed.)

sorry for the back-and-forth 🙏
```

### Draft 3 — Fluoride discriminator question (independent paste)

```text
quick water page q — when you ran it and didn't see fluoride, what did the little badge at the top of the report say? three options:

— "Sample Data"
— "Demo (Server)"
— "ZIP {your zip number}"

one of those tells me exactly which of three things to fix. no rush 🙏
```

Full branching-on-answer triage at `docs/maddie/2026-05-16-fluoride-discriminator-question.md`.

## Phase 4 + 5 (auth ask — surfaced to user separately)

Phase 4 (#94 Dependabot major-bumps) and Phase 5 (post-deploy verify) remain BLOCKED per handoff's "explicit per-session authorization" rule. Failure-domain risk on Phase 4: `src/components/spiral/spiral.ts` OrbitControls/EffectComposer pipeline + `src/pages/capture.ts` APIRoute signature. Auth needed to proceed.
