# Agent Handoff: post `astro check` cleanup — what's open

**From:** Claude session (this repo, 2026-05-02 — astro check cleanup + gate upgrade)
**To:** Next Claude session (same repo)
**Phase:** DONE for the cleanup loop; this is a forward-looking inventory of follow-ups
**Plan-file location:** this file (`.claude/plans/2026-05-02-post-astro-check-handoff.md`)
**Predecessor:** `.claude/plans/2026-05-02-astro-check-cleanup-handoff.md` — fully executed, retained as historical record (do not edit; per plan-file discipline)

---

## Current State

- `main = origin/main = a8c8dc2` (no drift; verified by `git rev-list --count` both directions = 0)
- `npm run check` is now `astro check` and **passes with 0 errors**. 18 hints remain (see *Deferred*).
- `npm run test:all` is green: vacuum gate + content-shape test → astro check → build.
- Working tree clean.
- Citation tooltip eyeball-verified on local static build at `/water/` (B-01 hover renders correctly; mouse-leave hides).
- Quiz runtime verified at `https://sovereign-systems-spiral.pages.dev/quiz` end-to-end before edit; data-attrs hydration intact post-edit (build is the proof — Vite would have failed the script bundling otherwise).
- Memory written + indexed: `project_session_2026_05_02_astro_check_cleanup.md`, MEMORY.md parity 16/16.

## Completed Work (this session — for ledger continuity)

- [x] `cdc669b` — fix(types): resolve all astro check errors across quiz + Base + HydrationNode (4 files: quiz.config.ts, quiz.astro, Base.astro, HydrationNode.astro)
- [x] `a8c8dc2` — chore(build): upgrade type-check gate from tsc --noEmit to astro check (package.json)
- [x] Both pushed to `origin/main`; CI may still report failure at deploy step due to GH#52.

## Deferred (intentional — not blockers)

### 18 astro-check hints, none breaking

| Source | Code | Note |
|---|---|---|
| `spiral.ts` (5 hints) | `ts(6133)` unused locals: `PHASE_MIX`, `PLANET_COUNT_BONUS_MAX`, `ORB_SEGMENTS`, `MathPrimitive` import, `SymmetryType` import, `basePrim`, `nodeId` (param), `cameraDir`, `i` (param), `symbolGeometryFor` | Dead code from prior iterations. Cleaning is hygiene; risk is non-zero (some may be re-used by upcoming features) — leave for a focused cleanup session. |
| `spiral.ts` (2 hints) | `ts(6385)`/`ts(6387)` `THREE.Clock` deprecated | Three.js upgrade-path concern; needs the matching swap (likely `Timer` from three/addons). Don't touch without the spiral re-render plan. |
| `quiz.astro:298` | `ts(6133)` `top3` param unused | The function received `top3` for a future "top 3 nodes" UI that hasn't shipped. Either implement or drop the param. |
| `business/index.astro` (2 hints) | `ts(6133)` `citationIds`, `ResearchAccordion` unused | Accordion was wired then unwired; safe to delete the import + var. |
| `HydrationNode.astro:507` | `ts(6133)` `originalText` unused | The "Unlocking…" button-state code captures the original text but never restores it. Either restore on error path or drop. |
| `Base.astro:394` / `index.astro:12` | `astro(4000)` `is:inline` hint on JSON-LD scripts | Suppressible via explicit `is:inline` directive — purely cosmetic. JSON-LD must stay inline regardless. |

### External — not agent-fixable

- **GH#52** — CF API token expired Apr 19. Owner-only (rotate in repo Actions secrets). Until rotated, every `git push origin main` will leave CI in failure at the deploy job; `npm run deploy` is the documented manual workaround.

## Key Decisions (don't re-litigate)

| Decision | Rationale |
|---|---|
| Type-only `import type` + explicit type aliases (vs. `// @ts-ignore` or `declare const`) | Preserves type-checking instead of suppressing it. Adds zero runtime bytes (data flows via data-attrs as before). The handoff suggested `@ts-ignore` as one option; this is the more durable choice. |
| `instanceof Element` (not `HTMLElement`) for `closest()` narrowing in Base.astro | `closest('sup')` returns `HTMLElement` because lib.dom maps the tag literal. Element is the base class with `.closest()`; either works, Element is slightly more permissive at the guard site. |
| `WaterReport & { isDemo?: boolean }` inline cast (vs. extending the canonical interface) | `isDemo` is an API-response artifact from `/api/water-report`, not part of the data model. Polluting the canonical type would mislead other consumers. |
| Replaced `tsc --noEmit` (vs. chained both) | `astro check` is a strict superset; chaining adds runtime with no coverage gain. |
| 2 commits (types fix + gate upgrade) vs. 1 | Matches precedent from session ses_2026-05-02-spiral-review (`aafb0eb` + `fc75bbe`); keeps gate-promotion atomically reversible. |
| Used local static `python3 -m http.server` for tooltip verification (not `npm run dev`, not `wrangler pages dev`) | Dev server hung on first compile; wrangler failed on `nodejs_compat` for `sharp`/`detect-libc`. Static serve over `dist/` is sufficient because the tooltip is client-side JS — no SSR/Worker behavior needed for that surface. |

## Next Actions (if a next session continues here)

This is **discretionary** — no in-flight work blocks anything. Surface to user before picking from this list:

1. **Verify the deployed site picked up the changes.** CF auto-deploy will fail at the deploy step (GH#52). Run `npm run deploy` manually if user authorizes; then re-test `/quiz` and `/water/` (B-01 hover) on `sovereign-systems-spiral.pages.dev` to confirm parity with local build.
2. **Hint cleanup pass.** A focused session can clear most of the 18 hints in one commit. The `THREE.Clock` deprecation needs care — couples to the spiral re-render plan.
3. **Maddie-side artifacts** (per session-context briefing): GHL quiz URL, affiliate URLs (IonFaucet, Multipure), Stripe vs GHL subscription decision, content review session for 104 flagged pieces, pillar order confirmation, custom-domain connection for `elevatealign.com` (one CF dashboard action). All blocked on her input — agents can prep but not close.
4. **Outbound to Maddie:** symbol icons in `vesselMode=hybrid` should now render correctly post-scaleMul fix (prior session, commit `aafb0eb`). Worth surfacing to her before the next visual iteration. See predecessor handoff "Non-actionable items" — same context.

## Critical Context

- The chained close-out worked end-to-end: prior session's `tsc` gate caught nothing in `.astro` files, today's gate (`astro check`) catches everything. The 34 errors that surfaced were pre-existing, hidden by the narrower gate. Future scope creep into `.astro` inline scripts is now caught at `npm run check` time.
- Astro `<script>` blocks use Vite for TypeScript processing. `import type` works, regular `import` would bundle the imported value into the script bundle. Always prefer `import type` for cross-scope shape-only references.
- The `/water/` static page is the cheapest tooltip-verification surface (3 `<sup>` refs: B-01, B-02, B-78); `/research` is email-gated and renders no `<sup>` tags pre-unlock; `/nodes/1` has no citation refs at all.

## Risks & Warnings

- **Don't touch `.conductor/active-handoff.md`** — separate stream from 2026-04-29; honor any constraints there if engaging.
- **Don't add LaunchAgents** anywhere on this machine. Hard rule from `~/.claude/CLAUDE.md`.
- **`Base.astro` runs on every page.** A regression in the citation tooltip handler would be site-wide. Eyeball-verify on `/water/` after any future edit there.
- **Quiz hydration is data-attr based.** Don't "optimize" the script to read frontmatter directly — frontmatter ≠ client-side scope.

## Recovery Protocol (if you arrive cold)

1. `git log --oneline 4f548a0..HEAD` — should show `cdc669b` and `a8c8dc2` with no further commits.
2. `git status` — expected clean.
3. `npm run check` — expected 0 errors, 0 warnings, 18 hints.
4. `npm exec astro check 2>&1 | grep -c " error "` — should be 0.
5. If counts diverge, re-read this handoff and the predecessor before acting.

## Token-budget compression

**Standard (~500 tokens):**
> Astro-check cleanup is COMPLETE. 34 errors → 0 across quiz/Base/HydrationNode. Gate promoted from `tsc --noEmit` to `astro check`. Two atomic commits (`cdc669b` types, `a8c8dc2` gate) on `origin/main`; 1:1 verified. Tooltip eyeball-verified on /water/ B-01. 18 hints remain (deferred — see plan). GH#52 (expired CF token) still requires owner rotation; manual `npm run deploy` is the workaround. No in-flight work; next session is discretionary.

**Minimal (~100 tokens):**
> Astro check cleanup done; 0 errors, gate upgraded to `astro check`, commits cdc669b+a8c8dc2 pushed. Plan: `.claude/plans/2026-05-02-post-astro-check-handoff.md`. No in-flight work. Optional follow-ups: hint cleanup, manual deploy verification, Maddie deliverables.

**Emergency (~30 tokens):**
> Cleanup done. Pick from `.claude/plans/2026-05-02-post-astro-check-handoff.md` next-actions list.
