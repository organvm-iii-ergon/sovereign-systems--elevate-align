# Plan — Sort Streams of Rob and Maddie

**Slug (system-assigned):** `sort-streams-of-compiled-panda`
**Date:** 2026-04-30
**Scope:** Move six conversation transcripts out of `$TMPDIR` into durable, IP-isolated homes per stream (Rob → `hokage-chess`; Maddie → `sovereign-systems--elevate-align`; workspace-meta → local Claude session archive).

---

## Context

Six markdown conversation transcripts (Zed/IDE session exports — header format `# Title` + `**Session ID:** ses_…` + `**Created/Updated:**` timestamps) accumulated in `/private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/` on 2026-04-29 from parallel multi-stream work across:

- **Maddie's repo** — `organvm/sovereign-systems--elevate-align` (Spiral / elevatealign.com)
- **Rob's repo** — `4444J99/hokage-chess` (content engine / business workstreams)
- **Workspace-wide cleanup** — repo hygiene triage that explicitly excludes both client repos

These files are at risk: macOS purges `$TMPDIR` after reboot or ~3 days idle. The user's "nothing local only" axiom (collaborator persistence) plus the cross-client IP isolation rule (`feedback_private_directory.md`) both require precise placement — Rob's content cannot leak into Maddie's repo and vice versa.

The "sort" is a 3-way partition with two redundancy edges:
1. File 5 is already filed (SHA confirmed identical to existing archive copy).
2. File 1 is a strict subset of file 3 (same session, earlier snapshot — verified by `diff`).

---

## Source inventory (verified)

All paths under `/private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/` unless noted.

| # | File | Size | Session ID | Title | Stream | Disposition |
|---|------|------|-----------|-------|--------|-------------|
| 1 | `1777488453231.md` | 281K | `ses_2257c9a0bffeejImmxNkHLNlZB` | Repo hygiene triage (early snapshot, 2:47 PM) | Workspace-meta | **Discard** — strict subset of file 3 |
| 2 | `1777490789085.md` | 188K | `ses_225ad62f8ffe2OXOj1E21YOrnn` | Review: Maddie's Spiral Gaps + Consolidating Disparate Artifacts | **Maddie** | Archive → sovereign-systems repo |
| 3 | `1777491613012.md` | 329K | `ses_2257c9a0bffeejImmxNkHLNlZB` | Repo hygiene triage + IRF close-out (later, 3:26 PM, superset of file 1) | Workspace-meta | Archive → workspace-meta home |
| 4 | `1777496391581.md` | 761K | `ses_2251ee12affetcy10YnkBnIZQC` | Acolyte work verification (cwd: hokage-chess) | **Rob** | Archive → hokage-chess repo |
| 5 | `1777497738051.md` | 319K | `ses_225102168ffe76GxogEzggukPL` | Stream B / Rob IRF close-out | **Rob** | **Already filed** — delete `/tmp` copy |
| 6 | `1777497743954.md` | 220K | `ses_225102f2effeQwXmSULww4Tggn` | Stream A / Maddie IRF close-out (cwd: sovereign-systems) | **Maddie** | Archive → sovereign-systems repo |

### Evidence ledger

- **File 5 already filed:** `shasum` returned `e510b1ce236e6ef8cc9943c7455c7d669958450f` for both `/tmp/1777497738051.md` and `/Users/4jp/Workspace/4444J99/hokage-chess/docs/archive/2026-04/2026-04-29-session-ses_2251-memory.md` (size 319117 bytes each, identical mtime).
- **File 1 ⊂ File 3:** `diff` produced 1 `<`-line (line 5 timestamp differs: `2:47 PM` vs `3:26 PM`) and 1298 `>`-lines (continuation turn appended). Same session ID, same Created timestamp.
- **File 4 → Rob:** primary tool-call working-dir grep returned `/Users/4jp/Workspace/4444J99/hokage-chess/...` paths (active-handoff, Rob homework consolidation, Stream-D plans, business/forms/ tree). The Gemini synthesis it reads is already filed at `hokage-chess/docs/archive/2026-04/gemini-2026-04-28-refactored-workstreams.md` — continuing precedent.
- **File 6 → Maddie:** active-handoff in transcript states "Stream A — Maddie", repo bound: `organvm/sovereign-systems--elevate-align`, with explicit boundary "You do not write outside" that repo. Parallel sibling to file 5 (matching prompts, different cwds).
- **Files 1+3 → workspace-meta:** prompt explicitly enumerates Maddie + Rob as off-limits. Triages the *other* ~145 repos in `~/Workspace/`.

---

## Move plan

### 1. Maddie → `sovereign-systems--elevate-align/docs/archive/2026-04/`

The `2026-04/` subdirectory does not yet exist; create it (its sibling `archive/` exists per `ls`).

```bash
mkdir -p /Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/docs/archive/2026-04

mv /private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/1777490789085.md \
   /Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/docs/archive/2026-04/2026-04-29-maddie-spiral-gaps-and-artifacts-review-ses_225ad62f.md

mv /private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/1777497743954.md \
   /Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/docs/archive/2026-04/2026-04-29-stream-a-maddie-irf-closeout-ses_225102f2.md
```

### 2. Rob → `4444J99/hokage-chess/docs/archive/2026-04/`

Directory exists. Naming follows the established pattern in that dir (`2026-04-29-…-ses_xxxx.md`). Note: the existing `2026-04-29-session-ses_2251-memory.md` uses an ambiguously short ID prefix that could collide with file 6's `ses_225102f2…` — this is left untouched (out of scope), and the new file uses a longer prefix to avoid collision.

```bash
mv /private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/1777496391581.md \
   /Users/4jp/Workspace/4444J99/hokage-chess/docs/archive/2026-04/2026-04-29-acolyte-work-verification-ses_2251ee12.md
```

### 3. File 5 — already filed; remove `/tmp` copy after final hash recheck

```bash
# Re-verify hash before unlinking (paranoid pass — defends against mid-session moves)
SHA_TMP=$(shasum /private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/1777497738051.md | awk '{print $1}')
SHA_ARCHIVE=$(shasum /Users/4jp/Workspace/4444J99/hokage-chess/docs/archive/2026-04/2026-04-29-session-ses_2251-memory.md | awk '{print $1}')
[ "$SHA_TMP" = "$SHA_ARCHIVE" ] && [ "$SHA_TMP" = "e510b1ce236e6ef8cc9943c7455c7d669958450f" ] \
  && rm /private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/1777497738051.md \
  || echo "ABORT: hash mismatch — investigate before deleting"
```

### 4. File 1 — discard (strict subset of file 3)

Verified: `diff` shows only 1 line of unique content in file 1 (the timestamp on line 5), and that line is preserved in file 3's superset version. No information loss.

```bash
# Re-confirm subset relation right before unlinking
DIFF_DELS=$(diff /private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/1777488453231.md \
                /private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/1777491613012.md \
            | grep -c '^<')
[ "$DIFF_DELS" = "1" ] \
  && rm /private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/1777488453231.md \
  || echo "ABORT: file 1 has unique content beyond timestamp — preserve it"
```

### 5. File 3 — workspace-meta archive → `~/.claude/sessions/2026-04/` (confirmed)

File 3 is a workspace-wide repo-hygiene-triage session continued into an IRF close-out turn — explicitly **excludes** Maddie + Rob's repos by prompt. Confirmed destination: `~/.claude/sessions/2026-04/` (local-only Claude session archive). The transcript is personal session-keeping, not a peer-review artifact; `~/.claude/sessions/` parallels the existing `~/.claude/plans/` and `~/.claude/projects/` siblings already in use. Trade-off accepted: this file is local-only (mild friction with the parity axiom) — the user can later promote it to a git-tracked location if needed.

```bash
mkdir -p /Users/4jp/.claude/sessions/2026-04
mv /private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/1777491613012.md \
   /Users/4jp/.claude/sessions/2026-04/2026-04-29-workspace-repo-hygiene-and-irf-closeout-ses_2257c9a0.md
```

---

## Verification (post-execution)

1. **Source dir empty:**
   ```bash
   ls /private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/177748*.md \
      /private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/177749*.md 2>/dev/null
   # Expected: no output (all 6 removed or moved)
   ```

2. **Maddie archive populated:**
   ```bash
   ls -la /Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/docs/archive/2026-04/
   # Expected: 2 new files, sizes ~188K + ~220K = ~408K total
   ```

3. **Rob archive populated:**
   ```bash
   ls -la /Users/4jp/Workspace/4444J99/hokage-chess/docs/archive/2026-04/
   # Expected: file 4 newly added (~761K); pre-existing 8 files untouched (incl. ses_2251-memory.md)
   ```

4. **Workspace-meta filed:**
   ```bash
   ls -la /Users/4jp/.claude/sessions/2026-04/   # if default (A) chosen
   # Expected: 1 new file (~329K)
   ```

5. **Hash sanity (Maddie + Rob moves):** `shasum` each newly archived file and compare against pre-move hashes captured at execution time. (Not strictly necessary for `mv` on the same filesystem, but cheap insurance.)

6. **Git status (informational only — committing is out of scope):**
   ```bash
   git -C /Users/4jp/Workspace/organvm/sovereign-systems--elevate-align status --short docs/archive/2026-04/
   git -C /Users/4jp/Workspace/4444J99/hokage-chess status --short docs/archive/2026-04/
   # Expected: new files appear as untracked (??)
   ```

---

## Out of scope

- **Committing / pushing** the newly archived files to remotes. The "nothing local only" axiom requires this, but it's a follow-up step (one commit per repo, with conventional-commits message — `chore(archive): file 2026-04-29 session transcripts`). Deferred to user authorization.
- **Renaming the legacy `2026-04-29-session-ses_2251-memory.md`** in hokage-chess. Its ambiguous `ses_2251` prefix could in theory collide with file 6's session ID `ses_225102f2…`, but file 6 lives in the Maddie repo so no actual collision exists. Leaving it as-is preserves scope discipline.
- **Synthesizing transcript content.** Classification used minimal head/tail reads + working-dir signals. Decoding the substance of the conversations is a separate task.
- **Plan-file copy to project plans dir.** Per the user's plan discipline rule, after exiting plan mode this plan should be copied to `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/.claude/plans/2026-04-30-sort-streams-of-rob-and-maddie.md`. Doing so during execution, not within plan mode itself.

---

## Critical files

- `/private/var/folders/l9/zn9x070d4xqb1qb5wfzr9tjr0000gn/T/177748*.md`, `T/177749*.md` — six source files
- `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/docs/archive/` — Maddie destination parent
- `/Users/4jp/Workspace/4444J99/hokage-chess/docs/archive/2026-04/` — Rob destination
- `/Users/4jp/.claude/sessions/2026-04/` — workspace-meta destination (default)

## References to existing utilities reused

- No code utilities required — pure filesystem moves with `mv` / `mkdir -p` / `shasum` / `diff` / `rm`.
- The existing `hokage-chess/docs/archive/2026-04/` naming convention (`2026-04-29-session-ses_xxxx-…`) is the pattern matched.
