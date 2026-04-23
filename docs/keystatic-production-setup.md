# Keystatic Production Setup (GitHub OAuth)

This guide enables Keystatic CMS editing in production via GitHub OAuth.
In production, content edits create commits directly on the `main` branch of the
GitHub repository. No code deploys are required for content changes.

## Prerequisites

- Admin access to the GitHub org `organvm-iii-ergon`
- Admin access to the Cloudflare Pages project `sovereign-systems-spiral`
- The editor (Maddie) must have a GitHub account with **write** access to
  `organvm-iii-ergon/sovereign-systems--elevate-align`

## 1. Create a GitHub OAuth App

1. Go to **https://github.com/organizations/organvm-iii-ergon/settings/applications/new**
   (or: GitHub org settings > Developer settings > OAuth Apps > New OAuth App)

2. Fill in the form:

   | Field | Value |
   |-------|-------|
   | Application name | `Keystatic CMS - Elevate & Align` |
   | Homepage URL | `https://elevatealign.com` |
   | Authorization callback URL | `https://elevatealign.com/api/keystatic/github/oauth/callback` |

   If you are using the `*.pages.dev` domain before connecting `elevatealign.com`,
   use `https://sovereign-systems-spiral.pages.dev/api/keystatic/github/oauth/callback`
   as the callback URL instead (update it once the custom domain is live).

3. Click **Register application**.

4. On the next screen, copy the **Client ID**.

5. Click **Generate a new client secret** and copy the secret immediately
   (it will not be shown again).

## 2. Generate a Session Secret

Keystatic uses a secret to sign session cookies. Generate one:

```bash
openssl rand -hex 32
```

Copy the output. This becomes `KEYSTATIC_SECRET`.

## 3. Set Environment Variables in Cloudflare Pages

1. Go to **https://dash.cloudflare.com** > Pages > `sovereign-systems-spiral`
2. Click **Settings** > **Environment variables**
3. Add the following variables (set for **Production** only, leave Preview blank
   so preview deployments stay in local mode):

   | Variable | Value | Encrypt? |
   |----------|-------|----------|
   | `KEYSTATIC_STORAGE_KIND` | `github` | No |
   | `KEYSTATIC_GITHUB_CLIENT_ID` | *(Client ID from step 1)* | No |
   | `KEYSTATIC_GITHUB_CLIENT_SECRET` | *(Client Secret from step 1)* | **Yes** |
   | `KEYSTATIC_SECRET` | *(hex string from step 2)* | **Yes** |

4. Click **Save**.
5. Trigger a new deployment (push to `main` or use the Cloudflare dashboard
   to retry the latest deploy) so the variables take effect.

## 4. Grant Maddie Repository Access

1. Go to **https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/settings/access**
2. Click **Add people** (or invite to a team with write access)
3. Add Maddie's GitHub username with **Write** role

She will receive an email invitation to accept.

## 5. Test the Production CMS

1. Navigate to **https://elevatealign.com/keystatic**
   (or `https://sovereign-systems-spiral.pages.dev/keystatic`)
2. You should see a **Sign in with GitHub** button
3. Click it. GitHub will prompt to authorize the OAuth app.
4. After authorization, you will be redirected back to the Keystatic dashboard.
5. Edit a pillar or branch and save. Verify:
   - A new commit appears on `main` in the GitHub repository
   - Cloudflare Pages auto-deploys the change
   - The updated content is live on the site within ~60 seconds

## How It Works

- **Local development** (`npm run dev`): `KEYSTATIC_STORAGE_KIND` is unset, so
  it defaults to `local`. Edits write directly to files on disk. No GitHub auth needed.
- **Production** (Cloudflare Pages): `KEYSTATIC_STORAGE_KIND=github`. Keystatic
  authenticates via GitHub OAuth and commits edits to the repository. Cloudflare
  auto-deploys on each push.

The config in `keystatic.config.ts` switches storage mode based on the
`KEYSTATIC_STORAGE_KIND` environment variable. The Keystatic Astro API handler
(`@keystatic/astro`) reads `KEYSTATIC_GITHUB_CLIENT_ID`,
`KEYSTATIC_GITHUB_CLIENT_SECRET`, and `KEYSTATIC_SECRET` from environment
variables automatically (including Cloudflare Workers runtime bindings).

## Troubleshooting

**"Sign in with GitHub" does not appear:**
The storage kind is still `local`. Verify `KEYSTATIC_STORAGE_KIND=github` is set
in the Cloudflare Pages production environment and that the deployment was rebuilt
after setting it.

**OAuth callback error (redirect_uri mismatch):**
The callback URL in the GitHub OAuth app settings must exactly match the domain
the CMS is served on. If you switched from `*.pages.dev` to `elevatealign.com`,
update the OAuth app callback URL.

**403 on save:**
The GitHub user does not have write access to the repository. Check step 4 above.

**Cookie/session errors:**
`KEYSTATIC_SECRET` may be missing or changed between deploys. Re-generate and
re-set it if needed. It must be the same value across all instances.
