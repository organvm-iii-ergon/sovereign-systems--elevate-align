# Stream A — Maddie / Sovereign Spiral Visual: Generative Maximalist Build

**Date:** 2026-04-29
**Repo:** `/Users/4jp/Workspace/organvm/sovereign-systems--elevate-align/`
**Stream:** A (per `~/.claude/plans/snuggly-gathering-bear.md` partition map)
**Entry permit:** `.conductor/active-handoff.md` (read & acknowledged)
**Session ID:** `S-2026-04-29-maddie-spiral` (for `last_claimed_by` on DONE counter)

> Mirrored from `~/.claude/plans/read-conductor-active-handoff-md-crispy-zebra.md` per CLAUDE.md plan discipline (project retains its own dated plan history).

---

## Context

Three open vacuums anchor here, inherited from the 2026-04-29 "honor-the-dead" verification (35/36 claims PASS):

| ID | GH | Surface | Inherited frame |
|---|---|---|---|
| IRF-III-033 | #57 | `spiral.ts:1651` `vessel.visible = false` | "Decide visible vessel / refracted star / hybrid; render; screenshot-prove" |
| IRF-III-034 | #56 | `quiz.astro:60` + `hub.config.ts:196` | "Replace pillar-picker with weighted node-placement; wire or block-with-owner GHL URL" |
| IRF-III-032 | — | nav layer | "Spiral-first vs pillar-first realignment; design-blocked on Maddie response" |

User directives this session (verbatim from turn-1 questions):

- **Q1 (nav design gate):** "design as unbridled child idealist without inhibitions of worldly corruption; meta-policy: build all conceived paths bc overhead is cheap"
- **Q2 (V8 WIP):** Review + selective atomic commits
- **Q3 (GHL URL):** "clerical, gatekept systems external do not block — limitations birth creative bastards to kill the father blind"
- **Q4 (proof cadence):** All three (screenshot + deploy + local browser)

**Synthesis:** Build the full surface — every conceived variant — let realized artifacts force comparison rather than abstract debate. Supersede external dependencies (GHL) by producing local-first paths that don't need owner approval to ship. Maximum proof rigor per closure.

---

## Recommended approach

The work decomposes into **six tracks** that share substrate but commit independently. Tracks 1–2 are zero-risk hygiene; 3–5 are the closure work; 6 is the close-out protocol.

### Track 1 — Working-tree triage & atomic commits (clears 22 dirty files)

Per Agent-3 forensic. Commit groups, in order:

1. `.gitignore` update — add `.history/`, `.lh/`, `.specstory/`, `.vscode/`, `.gemini/` (NOT `.conductor/` — it carries the entry-permit `active-handoff.md`)
2. **Delete** ephemeral session exports: `export-2026-04-28T00-22-00.md`, `export-2026-04-28T00-36-00.md`
3. `chore: gitignore IDE/agent caches`
4. `feat(spiral): V8 cartographic coordinate layer` — `src/components/spiral/spiral.ts` (~30 LOC continuing commit `66a6f0b`)
5. `chore(content): refine pillar copy` — `src/content/pillars/{financial, identity}.md`
6. `feat(config): node taglines + node 11 phase shift to UNLOCK` — `src/data/hub.config.ts`
7. `feat(config): hydration affiliate URLs (IonFaucet/Multipure/PureHome)` — `src/data/hydration.config.ts` *[VERIFIED: real Maddie-tagged URLs (`/maddie-spiral`, `/maddie-wired`, `/maddie`)]*
8. `feat(geometry): MANDORLA/TETRAD vertex tuning` — `src/data/sacred-geometry-primitives.ts`
9. `docs(README): update spiral tech-stack description` — `README.md`
10. `feat(content): add node 5 (Water) content` — `src/content/nodes/5.md` *[VERIFIED: 96-line authored Root Healing content]*

**Plans/scratch (Group e):** keep — `.claude/plans/2026-04-25-*.md` are local agentic planning artifacts, no .gitignore needed.

**Docs (Group h):** `docs/client-deliverables/2026-04-27-revenue-agreement-final.md`, `docs/reports/2026-04-27-maddie-*.md`, `docs/client-orchestration-showcase.md`, `docs/reports/2026-04-27-prompt-atom-registry.md` — confidentiality/owner review needed; surface as Track-6 owner-ask, do not auto-commit.

### Track 2 — Proof infrastructure (foundational)

Create `docs/proofs/` with naming convention. One commit:

- `docs/proofs/README.md` — convention: `YYYY-MM-DD-{closure-id}-{variant}-{kind}.{png|md}` where kind ∈ `{screenshot, deploy-diff, smoke-log}`
- Empty subdirs: `docs/proofs/spiral-vessel-variants/`, `docs/proofs/nav-variants/`, `docs/proofs/quiz-flow/`

`docs: scaffold docs/proofs/ for visible-progress cadence`

### Track 3 — IRF-III-033 / GH#57: spiral vessel variants (4 modes, all built)

**Schema addition to `src/data/hub.config.ts`:**

```ts
export interface UIConfig {
  spiralVesselMode: 'invisible' | 'visible' | 'refracted-star' | 'hybrid';
  navVariant: 'pillar-first' | 'spiral-first';
}
export const ui: UIConfig = {
  spiralVesselMode: 'invisible',  // current state default; preserve Maddie's 2026-04-25 feedback
  navVariant: 'pillar-first',     // current default; preserve current ship state
};
```

Both flags overridable via querystring (`?vessel=visible`, `?nav=spiral-first`) for live A/B comparison without redeploying.

**Wire-through in `src/components/spiral/spiral.ts`:**
- Plumb `spiralVesselMode` from `SpiralIsland.astro` props through `initSpiral()` → into the per-mesh visibility decision at line 1651
- `'invisible'` → `mesh.visible = false`, particle field opacity 0.8 (current ship)
- `'visible'` → `mesh.visible = true`, particle field opacity 0.0 (vessel-only)
- `'refracted-star'` → `mesh.visible = true`, force `variant === 'stars'` for refraction material, particle field opacity 0.0
- `'hybrid'` → `mesh.visible = true`, particle field opacity 0.3, both layered

Materials already wired (`MeshPhysicalMaterial` transmission/ior/dispersion at lines 1582–1603). No new shaders needed.

**Proof artifacts** (all four, committed alongside code):
- `docs/proofs/spiral-vessel-variants/2026-04-29-IRF-III-033-invisible-screenshot.png`
- `docs/proofs/spiral-vessel-variants/2026-04-29-IRF-III-033-visible-screenshot.png`
- `docs/proofs/spiral-vessel-variants/2026-04-29-IRF-III-033-refracted-star-screenshot.png`
- `docs/proofs/spiral-vessel-variants/2026-04-29-IRF-III-033-hybrid-screenshot.png`
- `docs/proofs/spiral-vessel-variants/2026-04-29-IRF-III-033-comparison.md` — 4-up grid + Maddie-ask: "which mode ships as default?"

**Commit:** `feat(spiral): four vessel modes for Maddie comparison — closes IRF-III-033 GH#57`

### Track 4 — IRF-III-034 / GH#56: weighted node-placement quiz + GHL bypass

**The "creative bastard" — local-first form path that supersedes the GHL dependency.**

**Schema additions to `src/data/hub.config.ts`:**

```ts
export interface SpiralNode {
  // existing fields preserved...
  themes?: string[];        // e.g., ['energy', 'embodiment', 'rest']
  affinity?: { [theme: string]: number };  // 0–1 weight per theme
  chakra?: string;
}
```

Annotate all 13 nodes with theme tags derived from `envVar` + `pillarSlug` + `phase` + chakra mapping (the chakra/asterisk geometry data already exists in spiral primitives; surface it).

**Quiz redesign — `src/pages/quiz.astro`:**

Replace `config.pillars.map(...)` (line 60) with a 5–7 question survey:
- Q1: Which phase resonates? (ELEVATE / ALIGN / UNLOCK / not sure)
- Q2: Which pillar feels most alive right now? (4 pillars)
- Q3–Q7: Theme-based Likert (1–5) on state/intent — energy, embodiment, identity, sovereignty, etc.

Client-side scoring → highest-affinity node 1–13 → render result panel ("You are at: Node 7 — Inner Compass") → CTA: "See your node" → `/nodes/7`.

Form submission via fetch to `/capture` happens **after** result render (fire-and-forget; no UX block). User sees their node immediately regardless of capture success. This is the bastard form: it ships the value before the gate fires.

**Extend `functions/capture.ts`:**

```ts
interface CapturePayload {
  email?: string;
  name?: string;
  source?: string;
  // NEW:
  quizNodeId?: number;      // 1-13
  quizScore?: number;       // 0-100
  quizPath?: string;        // serialized answers e.g. "ALIGN|inner|3,5,2,4,5"
  selectedPillar?: string;
  selectedPhase?: 'ELEVATE' | 'ALIGN' | 'UNLOCK';
}
```

Add **multi-sink dispatch** (additive, all optional):
1. KV persistence (`SUBMISSIONS` namespace) — primary durable sink
2. GHL webhook (existing; preserved for when Maddie wires URL)
3. Future: D1, email, etc.

If KV namespace not bound (local dev), silently no-op. Submission never blocks user UX.

**Proof artifacts:**
- `docs/proofs/quiz-flow/2026-04-29-IRF-III-034-quiz-step1.png` (intro)
- `docs/proofs/quiz-flow/2026-04-29-IRF-III-034-quiz-step5.png` (mid-quiz)
- `docs/proofs/quiz-flow/2026-04-29-IRF-III-034-quiz-result.png` (node placement)
- `docs/proofs/quiz-flow/2026-04-29-IRF-III-034-capture-curl.md` — `curl -X POST localhost:4321/capture` with sample payload + 200 response logged

**Commits:**
- `feat(quiz): node-placement scoring + theme schema — closes IRF-III-034 GH#56`
- `feat(capture): multi-sink dispatch (KV + GHL + extensible)`

### Track 5 — IRF-III-032: dual nav variants (pillar-first AND spiral-first)

**Wire `config.ui.navVariant` through `src/layouts/Base.astro`:**

Extract two nav blocks:
1. **`<NavPillarFirst />`** — current behavior preserved verbatim (Water → Inner → Identity → Business → Research)
2. **`<NavSpiralFirst />`** — links: Home → Node 1 → Node 2 → … → Node 13 → Pillars (drawer) → Research

Conditional render based on `ui.navVariant` OR `?nav=spiral-first` querystring override.

Default stays `pillar-first` (no current-ship regression). Spiral-first available for Maddie to preview live.

**Proof artifacts:**
- `docs/proofs/nav-variants/2026-04-29-IRF-III-032-pillar-first-screenshot.png` (current default)
- `docs/proofs/nav-variants/2026-04-29-IRF-III-032-spiral-first-screenshot.png` (variant)
- `docs/proofs/nav-variants/2026-04-29-IRF-III-032-comparison.md` — Maddie-ask: "which navigation flow ships as default?"

**Commit:** `feat(nav): spiral-first variant alongside pillar-first — closes IRF-III-032`

### Track 6 — Close-out protocol (DONE counter, owner-asks, deploy attempt)

**Per closure, in this order:**

1. Build the closure (Tracks 3, 4, 5 above)
2. Generate proof artifacts (screenshots from `npm run dev` running locally on `:4321`)
3. Attempt local deploy: `npm run deploy` (uses local `wrangler`; if 1Password CLI provides token, succeeds; if not, capture the failure as IRF-III-035 candidate "deploy auth recovery — CF token refresh" surfaced in close-out)
4. If deploy succeeds: capture deployed URL diff in `docs/proofs/{track}/...-deploy-url.md` with before/after URLs
5. **Increment `meta-organvm/organvm-corpvs-testamentvm/data/done-id-counter.json` in its OWN commit** (claim-before-use protocol; the only allowed cross-repo write):
   - Set `last_claimed_by: "S-2026-04-29-maddie-spiral"`
   - One DONE-NNN per closed vacuum
6. Push the counter commit BEFORE referencing the new DONE-NNN anywhere
7. Closure commit message format: `closes IRF-III-NNN GH#NN` (Gate observes commits)
8. Push closure commits

**Owner-asks surfaced in close-out (NOT blockers):**

- Q: hydration.config.ts affiliate URLs — VERIFIED real (Maddie-tagged paths)
- Q: docs/client-deliverables/* — confidentiality / safe to commit?
- Q: docs/reports/2026-04-27-maddie-* — same question
- Q: CF API token expired Apr 19 — refresh? (separate vacuum candidate IRF-III-035)
- Q: Vessel mode default — Maddie picks from 4-variant proofs in `docs/proofs/spiral-vessel-variants/`
- Q: Nav variant default — Maddie picks from 2-variant proofs in `docs/proofs/nav-variants/`
- Q: Quiz copy — questions/answer text auto-generated from node themes; needs Maddie polish pass

**Close-out forbidden actions** (per handoff inheritance):
- NO bundle-commit
- NO `--no-verify`
- NO writes outside `organvm/sovereign-systems--elevate-align/` except DONE counter
- NO IRF body writes (Gate territory)

---

## Critical files

**Reads (substrate verified):**
- `src/components/spiral/spiral.ts:1564, 1651, 2268, 2283` (mesh visibility)
- `src/data/icon-worlds.ts:38–182` (per-node phase/palette physics)
- `src/data/sacred-geometry-primitives.ts` (lens system, V8 lineage hash)
- `src/data/hub.config.ts:82–198` (pillars, nodes, GHL slot)
- `src/pages/quiz.astro:60` (pillar-picker)
- `src/pages/water/quiz.astro` (water quiz embed)
- `src/components/EmailGate.astro:66–114` (capture pattern, reusable)
- `functions/capture.ts` (local-first form sink)
- `src/layouts/Base.astro:122–165` (nav surface)
- `src/pages/nodes/[id].astro:30–44` (node routing pattern)

**Writes (this session):**
- `.gitignore` (add agent/IDE caches)
- `src/data/hub.config.ts` (UIConfig + SpiralNode theme schema)
- `src/components/spiral/spiral.ts` (vessel mode wire-through; cartographic layer commit)
- `src/components/spiral/SpiralIsland.astro` (pass `spiralVesselMode` prop)
- `src/pages/quiz.astro` (replace pillar-picker with node-placement)
- `functions/capture.ts` (extended payload + multi-sink)
- `src/layouts/Base.astro` (dual nav)
- `src/components/Nav*.astro` (extracted nav components — new files)
- `docs/proofs/**` (new proof artifacts)
- `meta-organvm/organvm-corpvs-testamentvm/data/done-id-counter.json` (3 DONE claims, each in own commit)

**Reuse (do not recreate):**
- `EmailGate.astro` capture-form pattern → adapt for quiz form
- `MeshPhysicalMaterial` transmission/IOR/dispersion (lines 1582–1603 in spiral.ts) → already wired for refracted-star
- `lineageHash` + `LENS_SEQUENCE[7]` + `modulatePrimitive` (V8 substrate) → no new geometry needed
- `analytics.ts` event schema → emit `quiz_complete` event with nodeId

---

## Verification

End-to-end test sequence after build:

1. **Build sanity:** `npm run build` succeeds (Agent-3 already verified PASS at 5.63s on dirty tree; must continue passing after each commit)
2. **Local browser smoke test** (`npm run dev`, browse to `localhost:4321`):
   - `/?vessel=visible` → orbs render as visible meshes
   - `/?vessel=refracted-star` → orbs render with prismatic refraction
   - `/?vessel=hybrid` → orbs visible + particle field at 0.3 alpha
   - `/?vessel=invisible` (default) → current ship state preserved
   - `/?nav=spiral-first` → nav links to /nodes/1...13
   - `/?nav=pillar-first` (default) → current nav preserved
   - `/quiz` → 5–7 question flow → result panel with node placement → "See your node" link to /nodes/N
3. **Capture endpoint test:** `curl -X POST localhost:4321/capture -d '{"email":"test@example.com","quizNodeId":7,"quizScore":82.5}'` returns `{ok:true}` and either logs to KV (if bound) or no-ops gracefully
4. **Screenshot proofs:** all 4 vessel + 2 nav + 3 quiz screenshots present in `docs/proofs/` and committed
5. **Deploy attempt:** `npm run deploy` — record outcome (success → URL captured in proof; failure → surface as new vacuum)
6. **DONE counter parity:** for each closed IRF-III-NNN, exists once in `done-id-counter.json` range, once in commit message (`closes IRF-III-NNN GH#NN`), and remote git parity confirmed (`git log origin/main` shows commit)
7. **No bundle commit:** commit log shows N atomic commits per concern, not a single mega-commit
8. **Cross-verification readiness:** Stream H (Reconciliation Gate) can match each DONE counter increment to its commit + screenshot proof + IRF row; no overclaims (closure language matches evidence)

---

## Out of scope

- Refreshing CF API token (separate Maddie/owner action, surface as IRF-III-035 candidate)
- Rewriting node content text (Maddie's IP; copy edits done by client)
- Touching `my-knowledge-base`, `hokage-chess`, `growth-auditor`, `public-record-data-scrapper`, `meta-organvm/organvm-corpvs-testamentvm/INST-INDEX-RERUM-FACIENDARUM.md` (other streams)
- IRF body writes (Gate territory)
- Any work in repos outside `organvm/sovereign-systems--elevate-align/` except the DONE counter file

---

## Estimated commits (close-out checklist)

Track 1: ~7 atomic commits
Track 2: 1 commit
Track 3: 1 closure commit + 1 DONE-counter commit = 2
Track 4: 2 closure commits + 1 DONE-counter commit = 3
Track 5: 1 closure commit + 1 DONE-counter commit = 2

**Total: ~15 commits**, each pushed to `main`. No bundle. No `--no-verify`.
