# Maddie Duty — Substrate Audit + Persona Refresh + Ask Packet

**Date:** 2026-04-25
**Repo:** `~/Workspace/organvm/sovereign-systems--elevate-align/` (HEAD: `1bd15aa`, V8 shipped)
**Persona file:** `~/Documents/personas/maddie.md` (private, NOT git, NOT chezmoi)
**Mirror plan after exit:** copy to `<repo>/.claude/plans/2026-04-25-maddie-substrate-audit-persona-refresh-ask-packet.md`

## Context

User invoked "you're on maddie duty" then mid-investigation pivoted with a **Three Relay Packets** message that scoped the Maddie session concretely to three deliverables:

- **M-A1** (15–20 min) — mirror-audit Maddie's persona substrate for parallel drift against Rob's persona, which had 3 small bugs: duplicate baseline, wrong file ext, shallow timeslices
- **M-A2** (10 min) — refresh persona against latest spiral feedback if anything new since 2026-04-25
- **MD-1..7 ask packet drafts** — 7 outstanding asks to Maddie; **drafts only, NOT sent**; P0 = MD-1 (revenue) + MD-3 (launch)

The relay also hard-fences: don't touch hokage-chess, a-i--skills, corpvs.

## Out of scope (parking lot — flagged for future)

- **Spiral nodes "not viewable" iteration** — initial investigation found that V8 production renders 13 nodes as faint sketches (mesh.visible=false intentional; particles meant to BE the icon; locked nodes get ~1/3 visual energy via 50% aura particles + opacity 0.55 vs 0.95). Localhost:4321 currently shows blank hero (zero astro-islands hydrated — likely user's stale dev process state). Out of scope per relay; raise next session if Maddie surfaces it.
- **CLOUDFLARE_API_TOKEN rotation** (GH#52) — Anthony action; blocks V8 deploy
- **Custom domain / DNS** (GH#3) — two-party action; covered in MD-3 as a draft ask
- **hokage-chess, a-i--skills, corpvs** — explicit "don't touch" per relay

## Phase 1 — M-A1 Mirror-Audit Maddie's persona

Goal: surface parallel drift against the 3 bugs found in Rob's substrate. Read-only audit; report findings; user confirms fixes before edits.

**Reference files (read both side-by-side):**
- `~/Documents/personas/rob-bonavoglia.md` (104 lines, source for the 3 bugs)
- `~/Documents/personas/maddie.md` (79 lines, audit target)
- `~/Documents/personas/README.md` (rubric + update protocol)

**Bugs to check, with observed Rob-state and Maddie-analogue hypothesis:**

| # | Bug | Rob's state | Maddie's analogue | Likely fix |
|---|-----|-------------|-------------------|------------|
| 1 | **Duplicate baseline** | Rob has TWO 2026-04-25 transcript entries for the same call (Summary + Raw Excerpt at lines 71–83) — same baseline rendered twice | Maddie has only ONE 2026-04-25 entry (Summary at lines 52–58). NOT analogous on the surface. **Verify with user**: is the bug "two entries for one event" or "Source basis line 8 = derived memory file = duplicates raw source on line 9"? | If interpretation #2 holds: demote `collaborator_maddie.md` from Source basis (it's derived, not source) |
| 2 | **Wrong file ext** | Source basis line 9 references `2026-04-25-rob-call-transcript-source.md` — should the source-of-record be the audio/video, not its `.md` transcription? | Maddie's 3 source paths are all `.md` and **all exist on disk** (verified). No spiral-call audio referenced. Bug likely doesn't apply, but verify intent with user | If user confirms intent: link to original audio/PDF/screenshot rather than the markdown derivation |
| 3 | **Shallow timeslices** | Rob's Transcripts section has only one date (2026-04-25) — no historical depth | Maddie's Transcripts has only one date (2026-04-25). Memory `collaborator_maddie.md` records a 2026-04-23 interaction ("it's kinda dark for me, is there a way we can lighten the spiral so it pops a lil more maybe!?") — **MISSING from persona** | Backfill Transcripts with 2026-04-23 entry from memory; add prior dates from `docs/handoff-maddie-spiral-2026-04-25.md` if present |

**Audit deliverable (Phase 1 output, no edits yet):**
- One block per bug: confirmed-applicable / not-applicable / different-flavor
- Specific lines + proposed edit text
- Pause for user confirmation before applying any persona edits (private file; small + high-signal)

## Phase 2 — M-A2 Refresh persona against latest feedback

Today is 2026-04-25 (same day as `Last Updated`). Refresh = drift check + missing-history backfill, not new content injection.

**Reconciliation sources (all read-only):**
- `~/.claude/projects/-Users-4jp/memory/collaborator_maddie.md` (2-day-old; Last interaction = 2026-04-23)
- `~/.claude/plans/2026-04-25-relay-maddie-elevate-align.md` (today's master relay; 7 ask threads)
- `~/Workspace/organvm/sovereign-systems--elevate-align/HANDOFF.md` (5-group relay, post-V8)
- `git log --oneline --since="2026-04-23" --author=Anthony` in spiral repo for any new Maddie-attributed commits

**Concrete drift already detected:**
1. **Last interaction** in persona = "2026-04-25" but memory records 2026-04-23 + new 2026-04-25 V8/lineage feedback round. Persona should reflect both dates explicitly (folds into M-A1 bug #3).
2. **Open threads:** persona has 4 items; actual ask-list per relay has 7 (MD-1..7). Persona is missing GHL quiz, Stripe-vs-GHL, documentary video.
3. **Decision history** can add: "2026-04-23 — flagged spiral as too dark, prompted lightening pass V2/V3" + "2026-04-25 — accepted V8 lineage × lenses × math direction (pending sign-off)".
4. **Confidence rating** stays at 3 (Structured) — 2-4 sessions threshold; not yet enough cadence for 4 (Operational).

**Apply edits only after user confirms M-A1 audit findings** so all persona edits land in one pass.

## Phase 3 — MD-1..7 Ask Packet Drafts (drafts only, NOT sent)

Draft a single deliverable file holding 7 distinct asks, each ready to send as its own message when user gives the word. **External-facing actions stay gated to Anthony per relay rule** — agent drafts, user dispatches.

**Output:** `<spiral-repo>/.claude/plans/2026-04-25-maddie-ask-packet-MD-1-7.md`
(plan-discipline mirror; lives with the project so future sessions find it)

**Per-draft schema (3 voice variants per MD — multiverse pick):**
```
## MD-N — <single-action label>
- Priority: P0/P1/P2
- Channel: text (per persona — visual feedback medium)
- Subject: <≤ 60 chars; same across variants>
- Why now: <revenue / launch / unblock / nice-to-have>
- Send when: <gating condition or "any time">
- Status: draft (not sent)

### Variant A — Anthony-voice (warm hook + single action)
<body>

### Variant B — Maddie-mirror (expressive, sensory, emoji-aware)
<body>

### Variant C — Strict business (no warmth, declarative)
<body>
```
User picks one variant per MD before any send. Same Subject + same single-action core; diction varies.

**Draft inventory (P0 first, then sequenced):**

| Tag | Ask | Priority | Why |
|-----|-----|----------|-----|
| MD-1 | 5 filter affiliate URLs (IonFaucet, Multipure, PureHome, Anespa DX, K8 Kangen) — vendor link + tracking code per tier | **P0 — revenue** | Empty `affiliateUrl` blocks `/water/*` revenue surface; Maddie said "this weekend if not today" 2026-04-25 |
| MD-3 | Cloudflare DNS go-live — GoDaddy CNAME `@` → `sovereign-systems-spiral.pages.dev`, then ping me to add custom domain in CF | **P0 — launch** | Unblocks `elevatealign.com` brand URL Maddie wants to share |
| MD-7 | V8 sign-off — link to live site (post-token-rotation) + ngrok review surface; ask for go/no-go on lineage × lenses × math direction | P1 | Closes the V3→V6→V8 spiral iteration loop |
| MD-2 | GHL quiz embed URL for `/quiz` and `/water/quiz` | P1 | Quiz funnel currently shows placeholder |
| MD-6 | Pillar order confirmation (Physical → Inner → Identity → Financial) | P1 | Locks brand information architecture |
| MD-4 | Stripe vs GHL payment routing for subscriptions | P2 | Affects EauCo Hub build path |
| MD-5 | Documentary video — script direction + asset upload window | P2 | Hero video placeholder still on `/` |

**Send order Anthony should consider** (offered in the doc, not enforced):
1. MD-1 immediately (Maddie already promised filter info)
2. MD-3 immediately (DNS is a 2-minute action; unblocks public launch)
3. MD-7 once token rotated and V8 is on the live URL
4. MD-2/MD-6 batched as a follow-up
5. MD-4/MD-5 next planning conversation

## Critical files

| Path | Role |
|------|------|
| `~/Documents/personas/maddie.md` | M-A1 audit target + M-A2 refresh target |
| `~/Documents/personas/rob-bonavoglia.md` | Reference for the 3 bugs (Phase 1) |
| `~/Documents/personas/README.md` | Update protocol (Transcripts/Opinions/Observations/Open threads) |
| `~/.claude/projects/-Users-4jp/memory/collaborator_maddie.md` | Source of 2026-04-23 missing entry |
| `~/.claude/plans/2026-04-25-relay-maddie-elevate-align.md` | 7-ask source + cross-session coordination |
| `~/Workspace/organvm/sovereign-systems--elevate-align/HANDOFF.md` | Post-V8 5-group relay |
| **NEW** `<spiral-repo>/.claude/plans/2026-04-25-maddie-ask-packet-MD-1-7.md` | Phase 3 deliverable |

## Verification

- **Phase 1**: re-read `maddie.md` after each edit; confirm sections still match README protocol; diff old vs new in chat for user signoff.
- **Phase 2**: cross-reference each Open threads bullet against MD-1..7; should be 1:1 + the mobile-spiral verification thread.
- **Phase 3**: open the ask-packet file in Read; confirm 7 distinct sections, each with single-action ask; confirm none accidentally addressed to wrong recipient.
- **Persona read-back test**: ask "what would Maddie think of X?" using only the refreshed persona — answer should reference dated entries, not vibes (per README query protocol).
- **No outbound sends this turn** — agent only drafts; Anthony dispatches.

## Cleanup

- Stop the dev server I started on port 4322 earlier (`pkill -f "astro dev" | head` carefully; user's own server on :4321 stays).
- Mirror this plan to spiral repo `.claude/plans/2026-04-25-maddie-substrate-audit-persona-refresh-ask-packet.md` after ExitPlanMode (per global plan discipline rule — never overwrite, additive).
- Save artifact memory on completion: `project_artifact_maddie_persona_audit_2026-04-25.md` with file path + state + pending feedback (per session close-out rule).

## Clarifications already resolved

- **Bug semantics (M-A1):** user said "read the diff yourself." Personas aren't git-tracked, so no literal diff. Approach instead: inspect Rob's persona content directly for the fix evidence (e.g., where Summary + Raw Excerpt coexist, where source-basis paths point to derived-vs-original artifacts, where Transcripts has only one timeslice). Treat each bug as **observed-in-Rob → check-Maddie-for-same-pattern**. Findings reported with file:line evidence; nothing edited until user confirms read.
- **Voice register (MD-1..7):** user said "always draft multiple perspectives so we could work out the multiverse and return with a better answer." Each MD draft therefore has 3 voice variants in parallel: (a) Anthony-voice with warm hook, (b) Maddie-mirror expressive voice, (c) strict-business no-warmth. User picks winner per ask. Same Subject + same single-action core; diction varies.
