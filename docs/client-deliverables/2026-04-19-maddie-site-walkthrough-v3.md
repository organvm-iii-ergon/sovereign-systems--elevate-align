# Your Site Walkthrough — Spiral-First Architecture (v3)

Hey Maddie! Big update. I went back through everything you sent me — all 7 of the intake PDFs — and pulled out 65 specific things you asked for. That process revealed something important: the site was built backwards. It was leading with water when it should be leading with the spiral. This update fixes that.

## Your Live URL

**https://sovereign-systems-spiral.pages.dev**

(Custom domain: **elevatealign.com** — ready to connect via Cloudflare dashboard)

---

## What Changed and Why

### The Problem

Every page on the site was pointing people toward water. The homepage said "Begin with Water" twice. The spiral was a small decoration in the middle of the page. But when I re-read your words, you said the spiral is the main attraction and water is "essentially just a mini version."

The site was inverted. This update puts it right.

### The Fix (5 changes)

**1. Homepage — Spiral is now the hero**

The spiral canvas is the first thing visitors see. It fills the screen on desktop. The old generic hero ("Begin with Water") is gone. Instead, the spiral visualization IS the hero, with your brand tagline overlaid on it.

Below the spiral: a quiz CTA ("What are you here for?"), the four phases of sovereignty, a video placeholder (for when you film the explainer), and a closing CTA. No mention of water on the homepage — it's spiral-first now.

**2. Water page — scoped to mini version**

The water page was doing the job of two different pages. The health tells, hydration metric, and "This Is Not Normal" section were about the Non Negotiable concept, not about water filtration.

Those sections moved to their own place in the spiral (see #4 below). The water page now has: your hero ("Water changed everything"), the video placeholder, the education section (molecular hydrogen + cellular hydration), the HydrationNode funnel (where people check their water), the research accordion, and a link back to Physical Sovereignty. That's the focused funnel you described.

**3. Quiz page — new entry point**

There's now a dedicated quiz at **/quiz** (separate from the water quiz). It asks for name and email, then shows four paths: Physical, Inner, Identity, Financial. Each path links to its pillar page. When you build your GHL quiz, we'll embed it here instead.

**4. 13 spiral nodes — the full architecture**

The spiral now has 13 individual nodes instead of 4 generic pillars:

**Phase 1 — ELEVATE (Physical Sovereignty)** — these are live and clickable:
- Feel Good First
- Your Body
- Regulate
- Non Negotiable (this is where the health tells and hydration metric now live)
- Water (links to the water page)

**Phases 2-4 (Inner, Identity, Financial)** — 8 more nodes, currently locked:
- Emotional Terrain, Nervous System, Mental Clarity
- Purpose, Voice, Boundaries
- Income Systems, Leverage

Locked nodes show "coming soon" with a link to their parent pillar. Each node has its own page at /nodes/1, /nodes/2, etc. The node names for Phases 2-4 are placeholders — we can rename them to whatever you want.

**5. Physical Sovereignty routing**

The Physical Sovereignty pillar no longer shortcuts to the water page. It goes to /pillars/physical first. Water is accessible from there, but it's not the only thing in Physical Sovereignty anymore — the 5 spiral nodes each represent a step in that phase.

---

## Page Count

The site went from 17 pages to 29 pages:

| Section | Pages |
|---------|-------|
| Homepage | 1 |
| Quiz | 1 |
| Spiral nodes | 12 (5 live, 7 locked) |
| Pillars | 4 |
| Water section | 9 (home, quiz, explore, 6 branches) |
| Business | 1 |
| Research | 1 |

---

## What Still Needs You

These are blocked until you provide them:

| Item | What I need from you |
|------|---------------------|
| Quiz | Your GHL quiz URL — I'll embed it on the quiz page |
| Documentary video | Film it whenever you're ready — the placeholder is already on the homepage and water page |
| Node names for Phases 2-4 | The 8 locked nodes have placeholder names. Tell me what you want to call them |
| Affiliate URLs | For the HydrationNode product recommendations |
| Subscription/payment setup | Stripe vs GHL — need your decision |
| Custom domain | I can connect elevatealign.com anytime — just say the word |

---

## How to Navigate

Same nav structure as before:

- **Desktop:** Top menu with Water, Inner, Identity, Business, Research
- **Mobile:** Three-line menu icon, links grouped by section
- **Breadcrumbs:** Show your location on every page
- **Footer:** Full site map at the bottom of every page

New: clicking any spiral node on the homepage takes you to that node's page. Phase 1 nodes are clickable. Phase 2-4 nodes are locked.

---

## Technical Notes (for your records)

- Deploy: Cloudflare Pages, auto-deploys on every code push
- Pages: 29 static HTML pages, zero JavaScript except the spiral canvas
- Performance: entire site loads in under 1 second on fast connections
- Mobile: spiral canvas is desktop-only; mobile shows pillar cards instead
