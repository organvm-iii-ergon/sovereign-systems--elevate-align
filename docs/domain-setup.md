# Connecting Your Domains

Your site is live at: **https://sovereign-systems-spiral.pages.dev**

To connect your real domains, you add them in the Cloudflare Pages dashboard. Here are the steps.

---

## 1. elevatealign.com (GoDaddy)

1. In Cloudflare dashboard → Pages → sovereign-systems-spiral → Custom Domains → Add
2. Enter `elevatealign.com`
3. Cloudflare will tell you what DNS records to set
4. In GoDaddy → My Products → DNS:
   - Add a CNAME record: `@` → `sovereign-systems-spiral.pages.dev`
   - Or if GoDaddy won't allow CNAME on root: add the A records Cloudflare provides
5. Wait 5-30 minutes for DNS to propagate
6. Cloudflare handles HTTPS automatically

---

## 2. stopdrinkingacid.com

1. Same process — add in Cloudflare Pages Custom Domains
2. Update DNS at your registrar to point to Cloudflare
3. Cloudflare Pages serves the correct content for all domains from one deployment

**Important:** This will disconnect the current LeadConnector/GHL site at this domain. Your GHL forms, workflows, and tagging still work — they're backend systems, not tied to the domain.

---

## 3. eaucohub.com (When Ready)

Same process. Connect when the business pillar is built out.

---

## Need Help?

Send a screenshot of your DNS settings page and I'll tell you exactly what to change.

---

## After Connecting

Once domains are connected:
- `elevatealign.com` → Your hub with the spiral
- `stopdrinkingacid.com` → Your water funnel
- `eaucohub.com` → Your business pillar (when ready)

All three domains serve from the same site. Update content once, it works everywhere.
