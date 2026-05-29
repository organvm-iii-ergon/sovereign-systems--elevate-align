# Cross-Agent Handoff: pages.dev deploy-output-dir regression

**From:** Claude session (local host, Opus 4.8) | **Date:** 2026-05-29 | **Phase:** HARVEST
**Reciprocal to:** `.conductor/active-handoff.md` (canonical current-state doc — read it for full detail) ; supersedes `.conductor/archive-2026-05-25-post-astro-6-migration-handoff.md`
**Compression level:** Standard (~1500 tokens). Full state in `.conductor/active-handoff.md`; session record in `.claude/plans/2026-05-29-closeout-pages-deploy-output-dir-regression.md`.

## Current State

- **Production restored.** `https://sovereign-systems-spiral.pages.dev` serves the site again (verified 200 on `/`, `/water/`, `/business/`, `/quiz`, `/research`, `/nodes/1`, `/pillars/physical`). It had been 404 on every path since the Astro 6 migration (2026-05-24).
- **Restored via a manual deploy** of the correct dir: `wrangler pages deploy dist/client --project-name sovereign-systems-spiral --branch main`.
- **Root-cause fix is in the working tree, UNCOMMITTED:** `package.json` `deploy` `dist` → `dist/client`.
- Branch `claude/jolly-cannon-7ba4fb` == `origin/main` `83a5bff` + that one-line change. Working tree otherwise clean.

## Completed Work

- [x] Diagnosed the outage end-to-end (not a code bug — a deploy-output-dir regression).
- [x] Proved root cause: `@astrojs/cloudflare` 12→13 moved build output `dist/` (Pages, `_worker.js`) → `dist/client` + `dist/server` (Workers, no `_worker.js`); `wrangler pages deploy dist` (unchanged) published a non-servable root.
- [x] Restored production (manual `dist/client` deploy to `--branch main`).
- [x] Patched `package.json` deploy script (uncommitted).
- [x] Verified code review of the migration (#112 high-severity items re-checked live; `capture.ts` read directly).
- [x] Corrected the active-handoff (prior one falsely claimed "runtime-verified").
- [ ] **Land the `package.json` fix on `main`** (NOT started — see Next Actions #1).
- [ ] SSR-endpoint decision (NOT started).

## Key Decisions

| Decision | Rationale |
|---|---|
| Restore via static Pages deploy of `dist/client` (not switch to Workers) | Owner is attached to the `pages.dev` URL; Workers deploy would change it to `*.workers.dev`. Stopgap keeps the URL; full SSR is a separate, deliberate choice. |
| Fix `package.json` `dist`→`dist/client` rather than re-architect deploy | Minimal, correct change for the current v13 Pages-static reality; keeps the URL; prevents silent re-break. Workers migration deferred to an explicit decision. |
| Revert incidental build artifacts (`package-lock.json`, `library-manifest.json`) | Keep the fix commit atomic to only the deploy-script change. The manifest regen (239/207) suggests committed-manifest drift — a separate, out-of-scope observation. |
| Bypass the RED autogen gate (IRF-OPS-050) instead of running `organvm refresh` | 44d-stale tail is pre-existing, host-scope, unrelated to this outage fix; refresh path itself is bug-tracked (IRF-OPS-051). Tracked-bug-bypass precedent. |
| Do NOT touch `elevatealign.com` DNS or the live funnels | `elevatealign.com` is on GoDaddy (owner task); live funnels are on a *different* CF account. Out of this repo's deploy scope. |

## Critical Context

- **The site is held up ONLY by the manual deploy.** Until the `package.json` fix lands on `main`, any `npm run deploy` from `main` (old `dist` script) re-publishes the broken tree.
- **This Pages project is dev/staging.** The live client funnels (`stopdrinkingacid.com`, `eaucohub.com`) are served from a **different Cloudflare account** (not in this account's zones; not custom domains on `sovereign-systems-spiral`). Deploying this repo does NOT update prod.
- **`pages.dev` deployment hash URLs error at the TLS layer** (`*.pages.dev` cert is single-level, so `<hash>.<project>.pages.dev` → 000). Test the bare alias or custom domains, never the hash URL.
- **SSR endpoints** (`/capture`, `/api/water-report`) do not run on a static Pages deploy (405/404). They need the Workers path.
- **Docs are stale** post-v13: CLAUDE.md "Deploy Configuration" + AGENTS.md still say `wrangler pages deploy dist` and "adapter generates `_worker.js`."

## Next Actions (sequenced; ownership noted)

1. **[conductor/Claude] Land the deploy fix** — PR-cascade (no direct push to `main`):
   ```bash
   git add package.json
   git commit -m "fix(deploy): publish dist/client (Astro 6 / @astrojs/cloudflare v13 output), not dist"
   gh pr create --fill && gh pr merge --squash   # after self-review
   ```
2. **[conductor decision] SSR direction** — Pages-static (keep URL, no SSR) vs Workers (`wrangler deploy --config dist/server/wrangler.json` + wire `SUBMISSIONS` KV; URL→`*.workers.dev`) vs investigate Pages-SSR. See table in `.conductor/active-handoff.md`.
3. **[bench-eligible: Codex/OpenCode] Update stale docs** — CLAUDE.md + AGENTS.md deploy sections (`dist`→`dist/client`; drop `_worker.js` claim; note Workers output model).
4. **[Claude/governance] Triple-reference the regression** — file IRF-OPS row + GH issue (currently 1/3).
5. **[human/owner] Connect `elevatealign.com`** — at GoDaddy, repoint the apex from GoDaddy Website Builder to Cloudflare Pages (mirror the siblings); add it as a custom domain on the project.

## Risks & Warnings

- **Do not push to `main` directly** on this public ORGANVM repo without explicit per-session owner authorization. PR-cascade.
- **Do not switch to the Workers deploy without owner sign-off** — it changes the URL the owner relies on.
- **Memory is hypothesis.** Re-verify on resume (see Recovery).

## Recovery Protocol

1. `curl -s -o /dev/null -w '%{http_code}' https://sovereign-systems-spiral.pages.dev/` → `200` = fix holding; `404` = re-broken (redeploy `dist/client --branch main`; check the `package.json` script landed).
2. `git show origin/main:package.json | grep '"deploy"'` → `dist/client` = fix merged; `dist` = still pending (Next Action #1).
3. Read `.conductor/active-handoff.md` for full state before any deploy-model change.

## Minimal restart line (~emergency)

> Continue: land the staged `package.json` deploy fix (`dist`→`dist/client`) on `main` via PR; site is up via a manual `wrangler pages deploy dist/client --branch main` but reverts on next `npm run deploy` until merged. Then pick the SSR path. Full context: `.conductor/active-handoff.md`.
