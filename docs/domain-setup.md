# Connecting Your Domains

Your site is live at: **[NETLIFY_URL — will be filled after deploy]**

To connect your real domains, you need to update DNS records. Here are the exact steps for each domain.

---

## 1. elevatealign.com (GoDaddy)

1. Log in to GoDaddy → My Products → DNS
2. Find the existing records for your domain
3. Add or update these records:

**For the root domain (@):**
- **Type:** A
- **Name:** @
- **Value:** 75.2.60.5
- **TTL:** 1 hour

**For www:**
- **Type:** CNAME
- **Name:** www
- **Value:** `[NETLIFY_SITE].netlify.app`
- **TTL:** 1 hour

4. In Netlify → Domain Settings → Add custom domain → `elevatealign.com`
5. Wait 5-30 minutes for DNS to propagate
6. Netlify will automatically set up HTTPS

---

## 2. stopdrinkingacid.com

1. Log in to wherever you bought this domain (may be GoDaddy, Namecheap, or another registrar)
2. Update the DNS records the same way as above — A record for @ pointing to `75.2.60.5`, CNAME for www pointing to the Netlify site
3. In Netlify → Domain Settings → Add custom domain → `stopdrinkingacid.com`

**Important:** This will disconnect the current LeadConnector/GHL site at this domain. Your GHL forms, workflows, and tagging still work — they're backend systems, not tied to the domain. The quiz embed on the new site connects to the same GHL backend.

---

## 3. eaucohub.com (When Ready)

Same process as above. Connect when the business pillar is built out. For now it can stay on HighLevel.

---

## Need Help?

Send a screenshot of your DNS settings page and I'll tell you exactly what to change. Or if you can share your registrar login, I can do it directly.

---

## After Connecting

Once domains are connected:
- `elevatealign.com` → Your hub with the spiral
- `stopdrinkingacid.com` → Your water funnel
- `eaucohub.com` → Your business pillar (when ready)

All three domains serve from the same site. Update content once, it works everywhere.
