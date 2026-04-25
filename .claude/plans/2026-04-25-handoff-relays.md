# Plan — Hand-off Relays for sovereign-systems--elevate-align

**Date:** 2026-04-25
**Project:** `sovereign-systems--elevate-align` (ORGAN-III, organvm-iii-ergon)
**Repo path:** `~/Workspace/organvm/sovereign-systems--elevate-align`
**Status:** Pending approval

---

## Context

The Maddie spiral session ended in a saturated state: V3 shipped (commit `d380086`), Proposal A (13 sacred-symbol shapes) sent to Maddie for input, Proposal B (generative) on the table, and a handful of unrelated open issues (CF token expiry, custom-domain DNS, filter affiliate URLs, mobile camera distance) parked on the side. None of that is captured anywhere a future session can pick up cold without re-reading the entire transcript.

The user provided the Hokage Chess HANDOFF.md as a model: 5 self-contained work groups, each pasteable into a fresh session, each capturing one stream of work. Goal: produce the equivalent for the elevate-align project — `HANDOFF.md` at the repo root, pushed to GitHub, indexed in memory.

**Outcome:** A clean baton. Any of these groups can be picked up next session — by the same agent, a different agent, or a different model — without reconstructing context from chat history.

---

## Approach

Single new file at the repo root: `~/Workspace/organvm/sovereign-systems--elevate-align/HANDOFF.md`. Five groups, sized to the work. Each group is one self-contained section — heading, trigger, relay prompt (the thing you paste into a fresh session), files involved, verification.

**Group breakdown:**

1. **V4 NODE SHAPES** — biggest creative work, blocked on Maddie's response to Proposal A. Implements either A (fixed sacred symbols), B (generative), or hybrid. The doc references already exist (`docs/design-proposals/2026-04-25-node-shapes.md`); the relay just needs to point there + give the implementation entry points.

2. **MOBILE SPIRAL POLISH** — pre-existing, non-blocking. Mobile renders the spiral but at a tiny camera distance. V3's helix compression helped; may need camera-pulled-closer pass for mobile breakpoints. Parallelizable with V4.

3. **CI AUTO-DEPLOY UNBLOCK (GH#52)** — single Anthony action: rotate `CLOUDFLARE_API_TOKEN` in GitHub repo Settings → Secrets, then push any commit to verify `wrangler-action@v3` succeeds. Until done, every spiral push needs `wrangler pages deploy dist --project-name sovereign-systems-spiral` locally.

4. **CUSTOM DOMAIN GO-LIVE (GH#3)** — DNS change at GoDaddy (Maddie's account) + CF Pages custom-domain config. Currently `elevatealign.com` is on GoDaddy parking; live site is at `sovereign-systems-spiral.pages.dev`. Two-party action: Maddie does DNS, Anthony does CF Pages.

5. **FILTER AFFILIATE FLOW (GH#49)** — content task blocked on Maddie sending water-filter info ("this weekend if not today" per 2026-04-25 thread). Once she sends, populate affiliate URLs in `hub.config.ts` + branch markdown files. Powers the `/water/` revenue funnel.

---

## Critical Files

| File | Role | Lines/Notes |
|------|------|-------------|
| `HANDOFF.md` (NEW) | Repo-root handoff index | ~250 lines — created by this plan |
| `docs/design-proposals/2026-04-25-node-shapes.md` | Already shipped — referenced by Group 1 | Don't touch |
| `src/components/spiral/spiral.ts` | V4 implementation surface | Constants block (75–110), `buildHelixPath` (407), `nodePathIndex` (425), `makeStarGeometry` (435), `chakraColorForNode` (467), nodes.forEach (601) |
| `src/components/spiral/SpiralIsland.astro` | Mobile camera tuning surface | Container sizing — line 13 (`h-[calc(100vh-240px)]`) |
| `src/data/hub.config.ts` | Affiliate URL surface | Branch + product config |
| `.github/workflows/ci.yml` | CI deploy workflow | `cloudflare/wrangler-action@v3` step |

Existing utilities already wired and reusable (no new abstractions needed):
- `mulberry32(nodeId * SOME_CONSTANT)` at `spiral.ts:601` — deterministic per-node seed (Proposal B / hybrid uses this)
- `THREE.Shape` + `ExtrudeGeometry` pattern at `spiral.ts:435` — both proposals build on this
- Per-node `animParams` at `spiral.ts:600–627` — physics extension surface for Proposal B

---

## HANDOFF.md content (ready to write on approval)

```markdown
# HANDOFF — sovereign-systems--elevate-align

**Last update:** 2026-04-25
**Last commit:** `d380086` — design proposals doc
**Live:** https://sovereign-systems-spiral.pages.dev/ (V3: chakra stars, bg matches page, helix compressed)
**Custom domain:** `elevatealign.com` — NOT yet pointed (GoDaddy parking)
**Working tree:** clean, all pushed

## Quick orientation for next session

Five work groups below, each self-contained. Pick whichever has its trigger satisfied. Paste the **Relay** block of a group into a fresh session to start that work cold.

| # | Group | Status | Trigger |
|---|-------|--------|---------|
| 1 | V4 Node Shapes | BLOCKED | Maddie reacts to Proposal A |
| 2 | Mobile Spiral Polish | READY | Opportunistic — parallel to V4 |
| 3 | CI Auto-Deploy Unblock (GH#52) | BLOCKED | Anthony rotates `CLOUDFLARE_API_TOKEN` |
| 4 | Custom Domain Go-Live (GH#3) | BLOCKED | Maddie/Anthony coordinate DNS |
| 5 | Filter Affiliate Flow (GH#49) | BLOCKED | Maddie sends water-filter info |

Recent shipping context (most recent first):
- `d380086` — `docs(design)`: Proposal A (13 sacred symbols) + Proposal B (generative) for V4 node shapes
- `845fcaf` — V3 fix: BG matches `--color-ocean-900`, helix compressed (HELIX_HEIGHT 14), camera (0,0,18), canvas `h-[calc(100vh-240px)]`
- `c7bca33` — handoff doc for V2/V3 internal context
- `02c90a2` — V2: chakra-colored 5-pt stars + round 2 lightening
- `cdd046e` — V1 (round 1 lightening — never deployed; CI broken since Apr 19)

Memory anchor: `~/.claude/projects/-Users-4jp/memory/project_artifact_spiral_maddie.md` — current artifact state.

---

## Group 1 — V4 NODE SHAPES

**Trigger:** Maddie responds to Proposal A (the 13 sacred-symbols mapping). Anthony sent it 2026-04-25.

**Decision logic when reply lands:**
- Likes A → ship Proposal A (fixed sacred symbols)
- Wants more dynamism → ship Proposal B (generative) or the hybrid
- Wants something else → adjust

**Why this matters:** V3 ships chakra-colored 5-point stars, but all 13 nodes have the same shape. Anthony's standing critique is that each node should be its own form, recognizable at small and large sizes, rooted in a tradition. Proposal A is fully designed; Proposal B is described.

### Relay

```
Picking up V4 Node Shapes for the Maddie spiral.

Repo: ~/Workspace/organvm/sovereign-systems--elevate-align
Live: https://sovereign-systems-spiral.pages.dev/

Read first:
- docs/design-proposals/2026-04-25-node-shapes.md (full mapping + tradeoffs)
- ~/.claude/projects/-Users-4jp/memory/project_artifact_spiral_maddie.md (artifact state)

Maddie's response: <PASTE WHAT SHE SAID>

Implementation entry points in src/components/spiral/spiral.ts:
- Replace makeStarGeometry (line 435) — for Proposal A: branch on nodeId, return per-node geometry. For Proposal B: parameterize by mulberry32(nodeId) seed. For hybrid: combine both.
- Geometry list for Proposal A: sunburst, eye-of-horus, yin-yang, upward-triangle, teardrop/wave, heart, crescent, hexagram, lotus, eye-in-triangle, equal-arm-cross, octahedron, ankh.
- Each shape is THREE.Shape + ExtrudeGeometry; some need bezier curves (heart, ankh, eye-in-triangle, lotus, yin-yang).
- nodes.forEach at spiral.ts:601 — already iterates with index i; pass i to a per-node geometry factory.
- Keep chakraColorForNode (line 467) — Maddie's color constraint stays.
- Keep emoji sprite overlay — node identity stays.

Verify:
- npm run build (no TS errors)
- npm run dev → localhost:4321 → drag spiral, confirm each node has distinct silhouette
- Visual: bottom-most node = root chakra red, top-most = crown violet
- Build size: keep under ~970 KiB (V3 baseline 958.44 KiB)

Deploy (CI auto-deploy still broken per GH#52, use local wrangler):
  wrangler pages deploy dist --project-name sovereign-systems-spiral --commit-dirty=true --branch=main

Then commit + push, send Maddie the live link.

Non-goals: don't propagate chakra colors to hub.config.ts / pillar pages / node detail pages — that's a separate brand-system pass.
```

---

## Group 2 — MOBILE SPIRAL POLISH

**Trigger:** opportunistic — can run parallel to Group 1, or while waiting on Maddie.

**Why this matters:** Mobile renders the spiral on `/` but at a camera distance that makes the nodes too small to read. V3's helix compression (HELIX_HEIGHT 20→14) and `h-[calc(100vh-240px)]` container helped on desktop but didn't tune mobile camera. Pre-existing — not introduced by V2/V3.

### Relay

```
Picking up mobile spiral polish for the Maddie spiral.

Repo: ~/Workspace/organvm/sovereign-systems--elevate-align
Live: https://sovereign-systems-spiral.pages.dev/

Problem: on mobile (≤768px), the 3D spiral renders correctly but the camera distance (Z=18) is too far for the nodes to read at the smaller viewport. The spiral becomes a thin colored squiggle.

Read first:
- src/components/spiral/spiral.ts:514–520 (camera setup)
- src/components/spiral/SpiralIsland.astro (container + client:idle hydration)

Approach options (pick one or layer):
- Add a viewport-aware camera Z: window.innerWidth < 768 ? 12 : 18
- Wire a window 'resize' listener that updates camera.position.z
- Adjust ORB_RADIUS and HELIX_HEIGHT responsively
- Or scope SpiralIsland to desktop only (md:block hidden) and let SpiralFallback take mobile (already in DOM at index.astro:36)

Verify:
- Chrome MCP at 393×852 (mobile) and 1456×900 (desktop) — both readable
- Test orbit drag still works on mobile (touch)
- npm run build clean
- Deploy via local wrangler (CI still broken per GH#52)

Don't break: desktop V3 framing (page bg seamless, full helix above the fold).
```

---

## Group 3 — CI AUTO-DEPLOY UNBLOCK (GH#52)

**Trigger:** Anthony rotates `CLOUDFLARE_API_TOKEN` in GitHub repo Settings → Secrets.

**Why this matters:** CI auto-deploy via `cloudflare/wrangler-action@v3` has been failing with `Authentication error [code: 10000]` since April 19. Every spiral push needs a manual `wrangler pages deploy dist --project-name sovereign-systems-spiral` locally. Until rotated, this is an ongoing tax on every iteration.

### Relay

```
Picking up GH#52 — CI auto-deploy unblock.

Repo: ~/Workspace/organvm/sovereign-systems--elevate-align (organvm-iii-ergon)

Confirm token rotation done (Anthony action):
  gh secret list -R organvm-iii-ergon/sovereign-systems--elevate-align
  Look for CLOUDFLARE_API_TOKEN with a recent 'Updated' timestamp.

Token requirements (rotate via Cloudflare dashboard → My Profile → API Tokens):
- Pages: Edit (write to sovereign-systems-spiral project)
- Account: Read (verify membership)
- Account ID: e0921b840fd656d8ea46426f1f114c30 (account name: ivviiviivvi)

Verify CI passes:
- Trigger an empty commit: git commit --allow-empty -m "chore: verify CI deploy"
- git push origin main
- gh run watch (latest run)
- On success, check: https://sovereign-systems-spiral.pages.dev/ updates

Close the loop:
- gh issue close 52 --comment "Token rotated; CI deploy passing as of <date>. Local wrangler workaround retired."
- Update memory: drop the "use local wrangler" note from project_artifact_spiral_maddie.md

If still failing: check workflow file at .github/workflows/ci.yml — the wrangler step is the last in 'deploy' job. Check if wrangler-action@v3 is still on a supported version.
```

---

## Group 4 — CUSTOM DOMAIN GO-LIVE (GH#3)

**Trigger:** Maddie updates DNS at GoDaddy (her account) AND Anthony connects custom domain in Cloudflare Pages dashboard.

**Why this matters:** `elevatealign.com` is the brand URL Maddie wants to share. Currently it points to GoDaddy parking. The live site is at `sovereign-systems-spiral.pages.dev`. The two-party action has been pending since project start.

### Relay

```
Picking up GH#3 — custom domain go-live for elevatealign.com.

Repo: ~/Workspace/organvm/sovereign-systems--elevate-align
Live (current): https://sovereign-systems-spiral.pages.dev/
Target: https://elevatealign.com

Read first:
- docs/domain-setup.md (if it exists — referenced in IRF-APP-033)

Two-party setup (does not need code changes):

Maddie (DNS at GoDaddy):
  Type: CNAME
  Name: @  (or 'elevatealign.com' depending on registrar UI)
  Value: sovereign-systems-spiral.pages.dev
  TTL: default

  Or, if CNAME flattening isn't supported at apex, use A records to Cloudflare's IPs (CF Pages custom-domain wizard will display them).

Anthony (Cloudflare Pages):
  CF dashboard → Workers & Pages → sovereign-systems-spiral → Custom domains → Add custom domain → enter elevatealign.com → follow wizard.
  CF will issue a Universal SSL cert automatically.

Verification:
  curl -sI https://elevatealign.com/ | head -3
  Expect: HTTP/2 200, server: cloudflare

Then:
- Update CLAUDE.md project doc + seed.yaml (replace pages.dev URL where canonical)
- gh issue close 3 --comment "elevatealign.com live as of <date>"
- Send Maddie a confirmation message that it's live

Secondary domains (deferred — same pattern when ready): stopdrinkingacid.com, eaucohub.com.
```

---

## Group 5 — FILTER AFFILIATE FLOW (GH#49)

**Trigger:** Maddie sends water-filter info ("filter info over to you this weekend if not today" — 2026-04-25 message thread).

**Why this matters:** This is the P0 revenue surface. The `/water/` funnel exists and routes to branch pages, but the affiliate URLs that monetize it are empty. Per IRF-APP-033 + the agreement, this is the 10%-of-water-sales-until-$10K pipeline. Every visitor who completes the funnel without these URLs is lost revenue.

### Relay

```
Picking up GH#49 — filter affiliate URLs for the /water/ revenue flow.

Repo: ~/Workspace/organvm/sovereign-systems--elevate-align

Maddie's filter info: <PASTE WHAT SHE SENT — affiliate vendor, URLs, tracking codes, product names>

Read first:
- src/data/hub.config.ts (single source of truth for pillar/branch/product config)
- src/content/branches/*.md (6 branch pages — gut-hormones, fertility, athletic, autoimmune, cancer-support, sustainability)
- src/pages/water/index.astro (Water hub funnel)
- src/pages/water/[slug].astro (branch deep-dives)
- functions/api/water-report.ts (EWG API proxy — for ZIP-based water-quality lookup that feeds filter recommendations)

Implementation approach:
1. Identify the affiliate URL field shape Maddie sent (one URL per filter? per branch? per ZIP-bucket?)
2. Add affiliate URLs to hub.config.ts as a structured field (e.g., per-branch product[] with affiliate_url, vendor, tracking)
3. Wire CTAs in water/[slug].astro and water/index.astro to point to the affiliate URLs
4. Add data-ea-* tracking attributes (per existing analytics pattern in V2)
5. If GHL routing is involved, double-check with src/pages/quiz.astro routing logic

Verify:
- npm run build clean
- Click each filter CTA in dev → routes to vendor with correct tracking
- analytics.ts utility fires the right event names

Deploy via local wrangler (CI still broken per GH#52 unless Group 3 completed first):
  wrangler pages deploy dist --project-name sovereign-systems-spiral --commit-dirty=true --branch=main

- gh issue close 49 --comment "Affiliate URLs populated; <vendor> live across <N> branches"
- Send Maddie confirmation with the live link
```

---

## Coordination notes

- **Independence:** Each group can advance without blocking others. Group 2 is the only one that's truly "ready right now" with no external dependency.
- **Sequencing preference:** If you can finish Group 3 before Maddie replies to Group 1, do — it removes the local-wrangler tax for every subsequent push.
- **Don't reduce scope:** Each of these has been on the open list. None is a nice-to-have. Keep them all on the board.
- **External-facing actions stay gated to Anthony:** any message to Maddie, any GH issue close, any DNS change. Code/docs/local builds are agent-fine.

---

## Process anchors

- All work in this repo: see `CLAUDE.md` at repo root for stack, commands, content directories.
- ORGAN-III conventions: see `~/Workspace/organvm-iii-ergon/CLAUDE.md`.
- Workspace-level conventions: see `~/Workspace/CLAUDE.md`.
- IRF (universal work registry): `~/Workspace/organvm/organvm-corpvs-testamentvm/INST-INDEX-RERUM-FACIENDARUM.md`.
- Done-ID counter (claim before assigning DONE-NNN): `~/Workspace/organvm/organvm-corpvs-testamentvm/data/done-id-counter.json`.
```

---

## Verification

After approval, the steps below confirm the handoff is correctly wired:

1. **File written to expected path:**
   ```
   ls -la ~/Workspace/organvm/sovereign-systems--elevate-align/HANDOFF.md
   ```
   Expect: ~10–14 KiB markdown file.

2. **Plan persisted to project plans dir** (per CLAUDE.md plan discipline):
   ```
   cp /Users/4jp/.claude/plans/hand-off-relays-vast-pnueli.md \
      ~/Workspace/organvm/sovereign-systems--elevate-align/.claude/plans/2026-04-25-handoff-relays.md
   ls -la ~/Workspace/organvm/sovereign-systems--elevate-align/.claude/plans/
   ```
   Expect: new dated plan file alongside the others.

3. **Commit + push:**
   ```
   cd ~/Workspace/organvm/sovereign-systems--elevate-align
   git add HANDOFF.md .claude/plans/2026-04-25-handoff-relays.md
   git commit -m "docs(handoff): 5-group relay file for V4 + open infra/content threads"
   git push origin main
   ```

4. **Stranger-test the relays.** For each group, confirm the relay block contains:
   - Repo path
   - Trigger condition
   - Files to read first
   - Implementation entry points (line numbers where stable)
   - Verification commands
   - Deploy/close commands
   No group should require chasing context outside the file + the named references.

5. **Memory update — single line:**
   Add to `~/.claude/projects/-Users-4jp/memory/MEMORY.md` Active Artifacts section:
   ```
   - [HANDOFF — sovereign-systems--elevate-align](project_artifact_handoff_elevate_align.md) — 5 groups, V4 + infra + content; commit <hash>
   ```
   And persist the underlying `project_artifact_handoff_elevate_align.md` with paths/state — the standard artifact-memory pattern.

---

## What I deliberately did not do

- **Did not launch Explore agents.** The user pasted both the source (full session transcript) and the model (hokage-chess HANDOFF). All exploration was already done on-screen. Shallow verification (one Bash + one Read) confirmed repo state. Spawning agents for synthesis would just delay the artifact.
- **Did not split V4 into two groups (A vs. B).** Maddie's reply will determine which path to ship. Splitting prematurely creates a stale group either way. Group 1's relay handles the branching internally.
- **Did not include the Maddie message-send action as its own group.** Per the session, Anthony already sent Proposal A. The "send message" action is gated to Anthony anyway and isn't a unit of work that needs a relay.
- **Did not include tertiary issues (GH#7, #14, #18, #19, #20, #30, #38, #39, #51) in the handoff.** They're on the project board but not active threads in this session. Listing them would dilute the handoff. Let `gh issue list` be the authoritative open-work view; HANDOFF.md is for in-flight context.
- **Did not version HANDOFF.md as `HANDOFF-2026-04-25.md`.** The hokage-chess example uses a single living `HANDOFF.md` at repo root. New session updates the same file (with a "Last update" line at top). Dated archives go in `.claude/plans/` or `docs/`.

---

## After approval

1. Write `HANDOFF.md` to the repo root (full content above, embedded in the ` ```markdown ` block).
2. Persist plan to `~/Workspace/organvm/sovereign-systems--elevate-align/.claude/plans/2026-04-25-handoff-relays.md` (additive — never overwrite prior plans).
3. Commit + push.
4. Update memory: artifact entry for the handoff + MEMORY.md index line.
5. Optional: brief comment on the still-open IRF entries pointing to HANDOFF.md, so future agents arriving via IRF land on the relays.
