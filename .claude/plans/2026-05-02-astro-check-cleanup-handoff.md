# Agent Handoff: `.astro check` cleanup + gate upgrade

**From:** Claude session (this repo, 2026-05-02 — spiral PRIMITIVES/scaleMul fix)
**To:** Next Claude session (same repo)
**Phase:** Cleanup of pre-existing TS errors that surfaced when the type-check gate was added
**Plan-file location:** this file (`.claude/plans/2026-05-02-astro-check-cleanup-handoff.md`)

---

## Current State

- `main = origin/main = fc75bbe` (no drift)
- Spiral renders correctly on `https://sovereign-systems-spiral.pages.dev/` — verified via `claude-in-chrome`: container visible, fallback hidden, canvas attached, `window.__spiralCleanup` set, console clean of `[spiral]`/`[SpiralIsland]` errors.
- `npm run check` (= `tsc --noEmit`) is wired into `test:all` and **passes** with 0 errors.
- `npm run build` passes; `npm test` passes.
- Working tree clean.
- `@astrojs/check` is installed but not used by any script — available if/when the next agent wants to invoke it.

## Completed Work (this session)

- [x] Reviewed prior session ses_21b070db9ffeqyo9mBFd3JVT3d, plan filed at `~/.claude/plans/review-animated-spiral-steady-kahn.md`.
- [x] Fixed `src/components/spiral/spiral.ts:1198`: `modulated.scaleMul` (undefined on `MathPrimitive`) → `Math.pow(PHI, modulated.phiExponent) * (0.85 + rng() * 0.30)`.
- [x] Removed 9 bisection `console.log('[spiral] …')` checkpoints; kept the 2 `console.error` calls (one in `SpiralIsland.astro:75-76`, one in `spiral.ts:2897` inside the `try/catch` wrapper around `initSpiral`).
- [x] Installed `@astrojs/check@0.9.9`, `typescript@5.9.3`, `@cloudflare/workers-types@4.20260426.1` as devDependencies.
- [x] Added `@cloudflare/workers-types` to `tsconfig.json` `compilerOptions.types` — clears `KVNamespace` / `PagesFunction` errors in `functions/api/water-report.ts` and `src/pages/capture.ts`.
- [x] Fixed `keystatic.config.ts:11` — GitHub storage `repo` is `RepoConfig` `{owner, name}` in `@keystatic/core@0.5.50`, not a `string`.
- [x] Added `npm run check = tsc --noEmit`; chained into `test:all` after content tests, before build.
- [x] Two atomic commits + push:
  - `aafb0eb fix(spiral): scale geometry from phiExponent; surface init errors`
  - `fc75bbe chore(build): add tsc gate; install Cloudflare worker types`
- [x] Manual deploy via `npm run deploy` (CI deploy step blocked by GH#52 expired CF token; CI build job passed).
- [x] Memory updates: `project_artifact_sovereign_spiral.md` (render-bug history paragraph), new `project_session_2026_05_02_spiral_review_fix.md`, `MEMORY.md` index entry.

## Not Done — Pickup Work

- [ ] **34 `.astro check` errors.** `npm exec astro check` reports these in `.astro` files. They were out of scope for the original "all above" approval and are deferred. See *Next Actions* for triage strategy.
- [ ] **Upgrade gate from `tsc --noEmit` → `astro check`.** Only after the 34 are resolved (or formally exempted). Touch point: `package.json` `check` script.

## Key Decisions (don't re-litigate)

| Decision | Rationale |
|---|---|
| `tsc --noEmit` rather than `astro check` for the gate | `astro check` exposed 34 pre-existing errors in `.astro` files that pre-dated this session's work. Adding it to `test:all` would have broken the gate immediately and exceeded the user's scope ("(iv) full sweep" was scoped to fixing Cloudflare/Keystatic .ts errors). The lighter `tsc --noEmit` catches the same class as the PRIMITIVES/scaleMul bugs (undefined names, missing properties in .ts files) without breaking on .astro inline-script issues. |
| scaleMul → `Math.pow(PHI, modulated.phiExponent) * (0.85 + rng() * 0.30)` | Three options were on the table: derive from phiExponent, drop lens scaling, or restore `scaleMul` to `MathPrimitive`. User picked the recommendation (option A). Preserves lens-driven variation (since `phiExponent` already has `mod.scaleMul` folded in via `lens-geometry.ts:154`); least invasive change. |
| Kept catch-block `console.error` in both `SpiralIsland.astro` and `spiral.ts` | Cheap insurance for any future silent-failure mode. The original empty `catch(() => …)` cost the user a long debugging session. Even one `console.error` would have cut diagnosis to seconds. Cost is zero on the success path. |
| Deployed via `npm run deploy` after CI deploy failed | CI deploy step is broken since 2026-04-19 (GH#52, expired CF token). The session's plan included verification post-deploy; CI's deploy step couldn't fulfill that, so I used the documented fallback (`wrangler pages deploy dist`) per `CLAUDE.md > Deploy Configuration`. |
| Did NOT remove `@astrojs/check` from devDependencies | Even though `tsc --noEmit` is what's wired now, the dependency is small and ready when the gate is upgraded. Removing it would just churn `package-lock.json`. |

## Critical Context

### What `astro check` catches that `tsc --noEmit` doesn't

`tsc --noEmit` reads `.ts` and `.tsx` files only; it skips `.astro`. `astro check` includes `.astro` files via the Astro language server, which type-checks both the frontmatter and any inline `<script>` blocks within them. The 34 errors are all in `.astro` files — invisible to `tsc`.

### The 34 errors break into 3 clusters

Run `npm exec astro check 2>&1 | grep error` to see them all. Approximate cluster breakdown from a pass on `fc75bbe`:

1. **`src/layouts/Base.astro` inline script (~22 errors)** — citation tooltip handler. Implicit `any` on `tooltip`, `activeSup`, `citations` locals; `e.target` possibly null with `closest()` calls. This is one block of inline JS that needs a type-cast pass: declare the `citations` JSON shape, narrow `e.target` via `instanceof HTMLElement` before `closest()`, type the `tooltip`/`activeSup` locals.

2. **`src/components/HydrationNode.astro:455-465` (~8 errors)** — `report` is `unknown` (likely from `JSON.parse` return). Fix: narrow with a type predicate or cast to a `WaterReport` shape (the type already exists in `src/data/hydration.config.ts`).

3. **`src/pages/quiz.astro:176-178` (3 errors)** — script references `quizQuestions`, `quizResultCopy`, `quizCaptureCopy` but the `.astro` script context only sees `questions`, `resultCopy`, `captureCopy` (different names). Either the script is reading these from `data-*` attrs (and the `Cannot find name` is a false positive that needs `// @ts-ignore` or a `declare const`), or it's a real bug where the data isn't getting hydrated. Verify at runtime first (open quiz page, check console) before "fixing."

4. **The remaining ~1 error** — likely tail-of-distribution single-file. Confirm via `astro check`.

### Non-actionable items kept here for context

- **GH#52 — CF API token expired Apr 19.** Owner action (rotate token in repo Actions secrets). Not agent-fixable. Until rotated, every push will leave CI in `failure` state at the deploy job; manual `npm run deploy` is the workaround.
- **Custom domain `elevatealign.com`** — single CF Dashboard action by Maddie. Tracked in artifact memory.
- **Maddie eyeball-verify** — symbol icons in `vesselMode=hybrid` should now render correctly post-scaleMul fix. Worth surfacing to her before next visual iteration.

## Next Actions (in order)

1. **Run `npm exec astro check 2>&1 | tee /tmp/astro-check.log`** to refresh the error list (may have shifted slightly since `fc75bbe`).
2. **Quiz error first** — verify whether `quizQuestions`/`quizResultCopy`/`quizCaptureCopy` are real runtime bugs or a static-analysis false-positive (the script may read these from `data-*` attrs where they're spelled differently). Open `/quiz` in browser, exercise the flow, check console. Decide: real fix vs. `declare const` shim.
3. **`Base.astro` tooltip handler** — biggest cluster. Top-of-script add explicit types: `let tooltip: HTMLElement | null = null;` etc. Narrow `e.target` via `if (!(e.target instanceof HTMLElement)) return;` before any `closest()`. Single commit.
4. **`HydrationNode.astro` `report: unknown`** — type the JSON parse: `const report = JSON.parse(...) as WaterReport;` (or use a type predicate). Single commit.
5. **Re-run `npm exec astro check`** — should be 0 errors.
6. **Upgrade gate**: change `package.json` `"check"` to `"astro check"` (or chain both). Re-run `npm run test:all` — must pass.
7. **Single hygiene commit** for the gate upgrade. Push.

## Risks & Warnings

- **Inline scripts in `.astro` are bundled to separate JS chunks at build time.** Frontmatter `const`s are NOT in scope inside `<script>` blocks — they only see globals + DOM + data-attrs. The quiz error may be a real bug (the script genuinely can't see those names), or the script may use `JSON.parse(el.dataset.questions)` while the type-checker sees the bare identifier. **Test in browser before "fixing" a name.** A wrong fix could break the quiz the same way the spiral was broken (silent runtime failure).
- **`Base.astro` inline-script citation handler is on every page.** A wrong type narrowing could break citation tooltips site-wide. Eyeball-verify on a node page (`/nodes/1`) after each commit.
- **Don't remove the `console.error` catch-block lines.** They're cheap insurance; keep them in.
- **GH#52 CF token will keep failing CI.** The next deploy must be manual via `npm run deploy` until that's rotated.
- **Don't add LaunchAgents.** Every prior incident froze the machine. Hard rule from `~/.claude/CLAUDE.md`.
- **The vacuum gate (`scripts/vacuum-gate.mjs`) runs as part of `npm test`.** If you add a new tracked vacuum, file the GH issue first then add to `TRACKED_VACUUMS`. See `CLAUDE.md > Vacuum Gate`.

## Recovery Protocol (if you arrive cold)

If this handoff is being read after the working tree has changed:

1. `git log --oneline e14641c..HEAD` — should show `aafb0eb` and `fc75bbe` if no further work has happened.
2. `git status` — expected clean.
3. `npm run check` — expected 0 errors.
4. `npm exec astro check 2>&1 | grep -c error` — count should match the ~34 in this handoff (give or take if intervening edits).
5. If counts diverge significantly, re-read this handoff for context and either continue from where it diverges, or surface the divergence to the user before acting.

## Critical files (for the next agent)

| Path | Why |
|---|---|
| `src/layouts/Base.astro` (script block ~287-385) | Biggest error cluster |
| `src/components/HydrationNode.astro:455-465` | `report: unknown` cluster |
| `src/pages/quiz.astro:176-178` | Name mismatch — verify runtime before fixing |
| `src/data/hydration.config.ts` | `WaterReport` type for the HydrationNode fix |
| `package.json` (`check`, `test:all`) | Where to upgrade the gate after cleanup |
| `~/.claude/plans/review-animated-spiral-steady-kahn.md` | The review that opened this work |
| `.conductor/active-handoff.md` | Stream A handoff from 2026-04-29 — older, separate scope, do not overwrite |

## Token-budget compression (for downstream uses)

**Standard (~500 tokens):**
> 34 pre-existing `.astro check` errors remain in `Base.astro` (citation tooltip implicit-any, ~22), `HydrationNode.astro` (`report: unknown`, ~8), and `quiz.astro` (3 name-mismatch errors — verify at runtime first; may be a false positive from data-attr hydration). `tsc --noEmit` is the live gate (`npm run check`); upgrade to `astro check` after cleanup. Spiral fix shipped via `aafb0eb`+`fc75bbe`, deploys at `sovereign-systems-spiral.pages.dev`. CI deploy blocked by GH#52 (CF token expired Apr 19) — manual `npm run deploy` is the workaround.

**Minimal (~100 tokens):**
> Continue cleanup of 34 `astro check` errors in this repo. Plan: `.claude/plans/2026-05-02-astro-check-cleanup-handoff.md`. Start with quiz error (verify at runtime first), then `Base.astro` tooltip handler, then `HydrationNode.astro` `report: unknown`. Upgrade gate from `tsc` to `astro check` last.
