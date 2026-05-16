# Runbook — Cloudflare API Token Rotation

**Tracks:** [GH#52](https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/52)
**Cadence:** owner-action; needed when `CI` deploy job fails at the wrangler step with `Authentication error [code: 10000]`.
**Time:** ~5 min in CF dashboard + ~3 min CI verification.

The rotation procedure itself lives in **GH#52 body** (canonical). This runbook adds the verification loop — how to confirm the new token actually works end-to-end.

## Pre-rotation check

Before rotating, confirm the token *is* the failure mode. Other deploy failures look identical at a glance.

```sh
gh run list --repo organvm-iii-ergon/sovereign-systems--elevate-align \
  --workflow CI --limit 5 --json conclusion,headBranch,databaseId,createdAt
gh run view <last-failed-id> --log-failed | grep -i -E "authentication|10000|token"
```

> Use `--log-failed`, not `--log`. `--log` returns every job's full output and the head is the `build` job's setup boilerplate (`token: ***` from `actions/checkout`) which false-matches the grep. `--log-failed` scopes to the failing step (`deploy` → `Deploy to Cloudflare Pages`) where the real `Authentication error [code: 10000]` lives.

If the failure is `Authentication error [code: 10000]` → token is the cause. Proceed.
If it's any other error → the new token will not fix it; do not rotate yet.

## Rotation (canonical steps live in GH#52)

Open the issue and follow steps 1–6:

```sh
gh issue view 52 --repo organvm-iii-ergon/sovereign-systems--elevate-align --web
```

Critical invariants (do NOT diverge from GH#52):
- Token type: **Custom Token** (not API Tokens preset).
- Permissions: `Account > Cloudflare Pages > Edit` (required — wrangler's `pages deploy` call hits the Pages API) **plus** `Account > Account Settings > Read` (included in the 2026-05-16 rotated token; sufficiency of Pages:Edit alone is **not empirically verified** — see "Open question" below).
- Account Resources: `All accounts` (the workspace has one CF account — `ivviiviivvi` / `e0921b840fd656d8ea46426f1f114c30`; "All accounts" and "Include > ivviiviivvi" are equivalent in this single-account workspace).
- TTL: **never expires** (the April 19 incident was a TTL expiry; do not repeat it).
- Secret name: `CLOUDFLARE_API_TOKEN` — existence check at `.github/workflows/ci.yml:46`, consumed at `.github/workflows/ci.yml:53`, deploy step name at `.github/workflows/ci.yml:50` ("Deploy to Cloudflare Pages"). Verify all three references survive any workflow edit.

Final write happens via:

```sh
gh secret set CLOUDFLARE_API_TOKEN \
  --repo organvm-iii-ergon/sovereign-systems--elevate-align
```

## Verification

After `gh secret set` succeeds, trigger a no-op CI run and confirm the full pipeline goes green.

### 1. Trigger a deploy

Push a trivial commit (e.g., touch a doc file) or re-run the last failing workflow:

```sh
# Option A — re-run the last failed workflow (fastest, no commit needed)
gh run rerun <last-failed-id> --repo organvm-iii-ergon/sovereign-systems--elevate-align

# Option B — trigger a fresh run via push
git commit --allow-empty -m "ci: verify CF token rotation" && git push origin main
```

### 2. Watch the deploy job

```sh
gh run watch --repo organvm-iii-ergon/sovereign-systems--elevate-align
```

Expected pass conditions:
- `build` job ✓ (this passes regardless of token status — it's the gate from `af3ba65`).
- `deploy` job ✓ — specifically, the **Deploy to Cloudflare Pages** step exits 0.
- The wrangler step output should include a deploy URL like `https://<hash>.sovereign-systems-spiral.pages.dev`.

### 3. Confirm the live URL

```sh
curl -fsSI https://sovereign-systems-spiral.pages.dev | head -5
```

Expected: `HTTP/2 200`. The Last-Modified header should be within minutes of the deploy run completion. If it's older, the deploy succeeded but DNS / cache hasn't flipped yet — wait 60s and retry.

### 4. Close GH#52 atomically

Only after steps 1–3 all pass:

```sh
gh issue close 52 \
  --repo organvm-iii-ergon/sovereign-systems--elevate-align \
  --comment "Token rotated $(date -u +%Y-%m-%dT%H:%M:%SZ); CI deploy job verified green at run <run-id>; live URL responds 200."
```

Do not close on partial success (build green, deploy still fails) — that's a different failure mode and the issue should stay open with a new comment narrowing the cause.

## Failure modes during rotation

| Symptom | Likely cause | Action |
|---|---|---|
| `gh secret set` errors `not authorized` | gh CLI lacks `repo` scope or wrong account | `gh auth status` → re-auth with `gh auth refresh -s repo` |
| New token, deploy still 10000 | Token created with wrong account-resource scope | Recreate token; verify "Account Resources > Include > ivviiviivvi" exactly |
| Deploy succeeds but URL 404s | First deploy on a new token can race the project bootstrap | Wait 60s, retry curl |
| Deploy succeeds but Last-Modified is stale | CF edge cache | Force purge in CF dashboard → Caching → Configuration → Purge Everything (project-scoped) |

## Open question — is `Account Settings: Read` actually required?

The 2026-05-16 rotated token includes `Account > Account Settings > Read` alongside `Pages: Edit`. Sufficiency of `Pages: Edit` alone has not been tested. The failed-deploy logs (runs 25965854670 and 25965782383) show wrangler's "Getting User settings..." line *after* the `code: 10000` error, not before — so that diagnostic line is post-failure recovery output, not evidence of a pre-flight probe failure. The 10000 came from the Pages API call itself, most likely due to TTL expiry on the prior token (per GH#52).

To convert this from precaution to verified spec: mint a second token with `Pages: Edit` only (no Account Settings), set as a temporary secondary secret, run a one-off workflow that uses it for `pages deploy`. If it succeeds → narrow the canonical scope. If it 10000s → restore strong-form language across all three surfaces (this runbook, `deploy-paths.md` Path 3, `ci.yml:47`).

## Why this exists separately from GH#52

GH#52 is the *what*. This runbook is the *how-do-we-know-it-worked* — the verification half of the loop is what closes Universal Rule #7 ("everything is a loop — what does this produce, and what does the result feed into next?"). Without verification steps the rotation could be done, marked done, and silently broken.

## Long-term elimination (out of scope here, tracked in GH#52)

Install the Cloudflare Pages GitHub App on `organvm-iii-ergon`, recreate the project as Git-connected, retire `CLOUDFLARE_API_TOKEN` entirely. No token = no rotation = no incident. Tracked in GH#52 "Future" section.
