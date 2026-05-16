---
title: Deploy paths — Sovereign Systems Spiral
date: 2026-05-16
context: CI auto-deploy has been broken since 2026-04-19 (expired CF API token, GH#52). Until that's fixed or replaced, there are 4 paths to get changes from `origin/main` live on `sovereign-systems-spiral.pages.dev`. This doc captures all 4 so the menu stays discoverable.
sibling: docs/runbooks/cf-token-rotation.md (path 3 detail)
---

# Deploy paths — Sovereign Systems Spiral

Four ways to ship changes from `origin/main` to `https://sovereign-systems-spiral.pages.dev`. Pick the one that matches your urgency + tolerance for setup cost.

| # | Path | Time today | Future cost | When it's right |
|---|---|---|---|---|
| 1 | **Merge open PRs, then `npm run deploy`** | ~5 min | recurs per deploy | You have multiple PRs queued; want them all live in one shot |
| 2 | **`npm run deploy` from current `main` now** | ~2 min | recurs per deploy | One thing on `main` is hot and you want it live *right now*; defer queued PRs |
| 3 | **Rotate the CF token (per runbook)** | ~10 min | one-off, until next expiry | You'd rather fix the root cause than keep manually deploying; OK with another rotation in 6-12 months |
| 4 | **Install CF Pages GitHub App** | ~30 min | forever fix | You want auto-deploy to work for the rest of the project's life; no future tokens to manage |

The current "always works" workaround is path 2 (and path 1 builds on it). Paths 3 and 4 are the structural fixes.

---

## Path 1 — Merge open PRs, then `npm run deploy`

**When:** Multiple PRs are queued and you want a single deploy that lands all of them.

```bash
# Verify the PRs you want to merge are mergeable + green
gh pr list --state open --json number,title,mergeable,statusCheckRollup

# Merge each in dependency order (PR-cascade convention from CLAUDE.md)
gh pr merge <N1> --squash --delete-branch
gh pr merge <N2> --squash --delete-branch
# ... etc

# Sync local main with origin
git checkout main
git pull --ff origin main

# Build + deploy
npm run deploy
# (= npm run build && wrangler pages deploy dist --project-name sovereign-systems-spiral)

# Verify
curl -s -o /dev/null -w "%{http_code}\n" https://sovereign-systems-spiral.pages.dev/<route>
```

**Notes:**
- If two open PRs touch the same file, merge order matters; pick the one whose diff doesn't need rebasing first.
- The deploy command runs `prebuild` (regenerates citations JSON) → `build` → wrangler upload. If `build` fails, deploy aborts.
- Wrangler uses your local OAuth (whatever account `wrangler login` last authenticated). No GitHub secret needed.

---

## Path 2 — `npm run deploy` from current `main` now

**When:** Something on `main` is hot and needs to be live before other queued work. Skips PR review for queued items.

```bash
git checkout main
git pull --ff origin main
npm run deploy
```

**Notes:**
- This is what happened today (2026-05-16) to ship `/timeline` immediately after PRs #71–#74 merged but #75 + #76 were still in review.
- Queued PRs land in a *later* deploy (path 1 or 2 again).
- If `npm run dev` is running locally, kill it first (it can block the build step).

---

## Path 3 — Rotate the CF token (per runbook)

**When:** You're tired of manual `npm run deploy` and want CI's auto-deploy to start working again. Acceptable to do another rotation in 6-12 months when the new token expires (unless you set "No TTL" — see GH#52 fix steps).

```bash
# 1. Follow docs/runbooks/cf-token-rotation.md
#    (mint token in CF dashboard → Account > Cloudflare Pages > Edit;
#     scope to Account Resources > Include > ivviiviivvi; No TTL)

# 2. Set the new token as the GitHub repo secret
gh secret set CLOUDFLARE_API_TOKEN --repo organvm-iii-ergon/sovereign-systems--elevate-align

# 3. Re-trigger CI (empty commit on main, or just push your next real commit)
git checkout main
git commit --allow-empty -m "ci: re-trigger deploy after token rotation"
git push

# 4. Verify
gh run watch  # most recent run on main
```

**Notes:**
- The runbook has the verification loop and the gotchas (CF API error 8000069, Direct Upload vs Git-connected projects).
- This doesn't change the fact that the CF Pages project is *Direct Upload*. CI still uses wrangler with the token; just with a fresh, non-expired token.
- After rotation, the `deploy` job in `.github/workflows/ci.yml` runs on every push to `main` instead of getting SKIPPED.

---

## Path 4 — Install Cloudflare Pages GitHub App (forever fix)

**When:** You want auto-deploy on push for the rest of the project's life with zero token management.

```text
1. Visit https://dash.cloudflare.com → Workers & Pages → GitHub App
2. Install the app on the `organvm-iii-ergon` organization, scoped to this repo
3. Recreate the sovereign-systems-spiral Pages project as Git-connected
   (NOT Direct Upload — the current project type can't be converted, must be recreated)
4. Verify a push triggers a deploy via Cloudflare-managed connection
5. Delete the original Direct Upload project after the new one is verified working
6. Remove the CLOUDFLARE_API_TOKEN GH secret (no longer needed)
```

**Notes:**
- This is the structural fix the GH#52 issue body describes under "Future: eliminate the token entirely."
- Slowest to set up today; lowest cost forever. After this, all future deploys are auto-triggered by CF on push to `main` — no `npm run deploy` needed, no CI deploy job needed (or the CI job becomes a redundant double-deploy).
- Risk: recreating the Pages project changes the underlying deployment IDs. Bookmarked preview URLs from before the swap will 404. The main `sovereign-systems-spiral.pages.dev` URL should survive the swap if you give the new project the same name.

---

## Picking quickly

If you just want **the page to be live in 2 minutes**: path 2.

If you want **CI auto-deploy to keep working forever**: path 4 (sometime soon — not today).

If you want **CI auto-deploy to work again but you don't want to install a GH App**: path 3.

If you have **multiple PRs queued and they should all land together**: path 1.

## Decision-board entry

The path-3-vs-path-4 choice is also tracked on the `/decisions` board as `cf-token-rotation` (`src/data/decisions.ts`). Treat that card as the authoritative decision surface for the structural fix; this runbook documents the operational steps.

## Cross-references

- `docs/runbooks/cf-token-rotation.md` — full detail for path 3
- `package.json` `scripts.deploy` — the actual `npm run deploy` command
- `.github/workflows/ci.yml` — the `deploy` job that's currently SKIPPED
- GH#52 — the original token-expiry issue
- HANDOFF.md — declares `pages.dev` as Live, `elevatealign.com` as not-yet-pointed
- CLAUDE.md `## Deploy Configuration` section — the canonical short version
