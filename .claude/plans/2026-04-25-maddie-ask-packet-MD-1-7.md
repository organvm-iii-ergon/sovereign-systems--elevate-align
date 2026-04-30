# Maddie Ask Packet — MD-1..7

**Date drafted:** 2026-04-25
**Status:** ALL DRAFTS — NOT SENT
**Dispatch gate:** Anthony picks one variant per MD before any send.
**Canonical IDs:** Match the master kill list at `~/.claude/plans/the-work-carried-through-smooth-mountain.md` (Maddie lane, lines 47–55). Earlier draft used wrong numbering (V8 sign-off was MD-7, DNS was MD-3, etc.); corrected here.
**Voice variants per ask:** A) Anthony-voice (warm + single-action) · B) Maddie-mirror (expressive, sensory) · C) Strict business (declarative)

Same Subject + same single-action core across variants. Diction varies. Bodies kept short — Maddie reacts best to concrete asks with one decision per message.

---

## MD-1 — Five filter affiliate URLs

- **Priority:** P0 — revenue
- **Channel:** text (her preferred medium)
- **Subject:** filter URLs ready when you are
- **Why now:** `/water/*` is the immediate revenue surface. 5 tiers in `src/data/hydration.config.ts` have empty `affiliateUrl: ''`. CTAs render "Details Coming Soon." Maddie said "this weekend if not today" on 2026-04-25.
- **Send when:** any time (gentle nudge — she already promised)
- **Status:** draft (not sent)

### Variant A — Anthony-voice
> hey — water page is wired up and just waiting on the filter URLs you mentioned. when you get a sec, can you drop the affiliate links + tracking codes for the 5 tiers (IonFaucet, Multipure, PureHome, Anespa DX, K8 Kangen)? once those land i can push live and the funnel starts earning. no rush, just teeing it up.

### Variant B — Maddie-mirror
> 🌊 the water page is *thirsty* for those filter URLs lol — whenever you've got 5 min, send the affiliate links + any tracking codes for the 5 tiers (IonFaucet, Multipure, PureHome, Anespa DX, K8 Kangen) and I'll wire them up the same day. funnel goes from "details coming soon" → live revenue 🙏

### Variant C — Strict business
> Filter affiliate URLs needed for `/water/*` revenue surface. Five tiers pending: IonFaucet, Multipure, PureHome, Anespa DX, K8 Kangen. Per tier: vendor URL + tracking code. Reply with the five entries and I'll deploy same-day.

---

## MD-2 — Cloudflare custom-domain action for elevatealign.com

- **Priority:** P0 — launch
- **Channel:** text
- **Subject:** 2-min DNS update for the brand URL?
- **Why now:** `elevatealign.com` parked at GoDaddy. Update CNAME and the live site is at the brand URL within minutes. This is the difference between "demo at pages.dev" and "ready to share at elevatealign.com." Once you do step 1, ping me and I'll do step 2 (Cloudflare side).
- **Send when:** any time (independent of MD-1)
- **Status:** draft (not sent)

### Variant A — Anthony-voice
> 2-minute thing on your end when you have a sec — log into GoDaddy, set elevatealign.com's CNAME to `sovereign-systems-spiral.pages.dev` (Type: CNAME, Name: `@`, Value: `sovereign-systems-spiral.pages.dev`, TTL: default). once that's in, ping me — i'll add the custom domain on cloudflare's side and the SSL cert auto-issues. site goes live at elevatealign.com same hour.

### Variant B — Maddie-mirror
> 🌐 ready to flip elevatealign.com live whenever you are — only takes 2 min on your end. in GoDaddy: CNAME, name `@`, value `sovereign-systems-spiral.pages.dev`, TTL default. ping me when done and i'll add the custom domain on cloudflare; SSL cert auto-issues, brand URL goes live same hour 💫

### Variant C — Strict business
> DNS action required to activate elevatealign.com. GoDaddy → DNS → add CNAME: Name=`@`, Value=`sovereign-systems-spiral.pages.dev`, TTL=default. Confirm when complete and I'll add the custom domain in Cloudflare Pages dashboard. Estimated time to live: under 1 hour after both steps complete.

---

## MD-3 — Visual sign-off on V3 chakra-stars + V6 + V8

- **Priority:** P1 — kills churn
- **Channel:** text
- **Subject:** V3 + V6 + V8 ready when you want to look
- **Why now:** Three iteration rounds stacked locally (V3 chakra stars 2026-04-09; V6 NAMING_CHAINS lineage shipped 2026-04-25; V8 lineage × lenses × math shipped 2026-04-25). Each load = unique cosmos within bounded design intent. Closes the V3→V8 iteration loop and prevents wasted iteration on a direction she'd reject.
- **Send when:** after CI token rotated and V8 is on the live URL (otherwise share ngrok review surface)
- **Status:** draft (not sent)

### Variant A — Anthony-voice
> V8 is up — each node is now its own universe driven by lineage × lens × math (so every spiral that loads is unique, but bounded by the symbolic foundation you set). live: sovereign-systems-spiral.pages.dev (or ngrok review surface, depending on deploy state). give it a spin when you have 5 — looking for go/no-go before we keep iterating. happy to do another round if it's not landing. also wanted to check: V3 chakra stars + V6 lineage round — both still feeling right?

### Variant B — Maddie-mirror
> ✨ V8 is *cooking* — each node is now its own little universe driven by lineage × lens × math (so every load = unique cosmos, bounded by the symbolic intent you set). give it a spin when you've got 5 min: sovereign-systems-spiral.pages.dev (or the ngrok link if CI's still being weird). looking for go/no-go before we keep iterating. obsessed with where it landed but want to hear your gut 🙏 also: V3 chakra-stars + V6 lineage round — those still resonating, or want a tweak?

### Variant C — Strict business
> Three spiral iterations stacked: V3 (chakra stars), V6 (NAMING_CHAINS lineage), V8 (lineage × lenses × math). Implementation V8: per-node universes via `lineageHash(envVar, lens, structural-position)`. Each load deterministic-but-unique within bounded design space. Review URL: sovereign-systems-spiral.pages.dev (or ngrok if CI deploy pending). Required: go/no-go decision per version, or single combined sign-off.

---

## MD-4 — GHL quiz embed URL

- **Priority:** P1 — capture flow
- **Channel:** text
- **Subject:** quiz embed URL?
- **Why now:** `/quiz` and `/water/quiz` currently render placeholder. Quiz is the lead-capture gate that routes users into pillar journeys. Without it the spiral has no landing point.
- **Send when:** can batch with MD-7 (single message asking quiz + pillar order)
- **Status:** draft (not sent)

### Variant A — Anthony-voice
> for the quiz pages — got the GHL embed URL on hand? want to drop it in so the quiz routes to your funnel instead of a placeholder. same for the /water/ quiz if it's a different one.

### Variant B — Maddie-mirror
> ✨ tiny one — what's the GHL quiz embed URL i should drop into /quiz? (and is /water/quiz a separate one or the same?) — once it's in, the lead-capture loop closes and we're routing properly into your pillars 🎯

### Variant C — Strict business
> Quiz embed URL needed for `/quiz` and `/water/quiz` routes. Provide GHL form ID or full embed URL. Confirm whether `/water/quiz` is same form or separate.

---

## MD-5 — Stripe vs GHL for subscription payments

- **Priority:** P1 — architectural fork
- **Channel:** text or call (her preference)
- **Subject:** subscriptions — Stripe or stay in GHL?
- **Why now:** EauCo Hub / Financial Sovereignty arm needs a payment routing decision before subscription flows are built. Stripe = lower fees + better UX, but separate dashboard. GHL = unified with quiz/email but higher per-tx cost.
- **Send when:** next planning conversation, not urgent
- **Status:** draft (not sent)

### Variant A — Anthony-voice
> when you're thinking about the subscription/payment side — gut check: do you want subscriptions running through stripe (lower fees, separate dashboard) or stay all-in on GHL (unified but higher per-tx)? doesn't have to decide today, but it shapes how i build out /business/ and EauCo. happy to spec out both options if that helps.

### Variant B — Maddie-mirror
> 💳 lil architecture q for whenever you're ready to think about it — subscriptions: do we run them through Stripe (lower fees, separate dashboard, more control) or keep it all in GHL (unified with your quiz/email, slightly higher per-transaction cost)? affects how i build out the business + EauCo side. zero rush, just tee'ing up the decision 🙏

### Variant C — Strict business
> Decision needed: subscription payment provider. Options: (1) Stripe — lower fees, separate dashboard, requires API integration. (2) GHL — unified but higher per-transaction. Affects EauCo Hub build path. Reply with preference or schedule call.

---

## MD-6 — Documentary video

- **Priority:** P2 — content slot
- **Channel:** call (better medium for creative direction)
- **Subject:** the documentary video — what's the shape?
- **Why now:** Hero `/` has video placeholder. The "What is Sovereign Systems?" section needs script direction + filming window + asset upload path before it can ship.
- **Send when:** next planning conversation
- **Status:** draft (not sent)

### Variant A — Anthony-voice
> on the homepage video — want to chat through what shape it takes? rough idea: 60-90s, your voice over b-roll of you working on the brand, ending with "this is sovereign systems." but i don't want to script it without your input. if you've got a draft or vibe board already that's even better.

### Variant B — Maddie-mirror
> 🎥 the documentary thing for the home page — wanna jam on it? thinking warm/intimate, maybe 60-90s, your voice over b-roll of you in your space, ending with the "this is sovereign systems" beat. but you've got the inner picture, so let's hop on a call and i'll script around what you're seeing. lmk when you've got a window 🙏

### Variant C — Strict business
> Homepage video deliverable status: pending. Required: script direction, filming window, asset upload path. Recommended length: 60-90s. Schedule call to lock direction or send written brief.

---

## MD-7 — Pillar order confirmation

- **Priority:** P2 — nav priority
- **Channel:** text
- **Subject:** pillar order — locking it in?
- **Why now:** Site renders Physical → Inner → Identity → Financial. Want to confirm that's the canonical order before I propagate it to the spiral, the navigation, the pillar pages, and the quiz routing. Easy to change now, harder later.
- **Send when:** can batch with MD-4 (one message)
- **Status:** draft (not sent)

### Variant A — Anthony-voice
> quick confirm: pillar order is Physical → Inner → Identity → Financial. that's how the spiral, nav, and quiz routing all work right now. before i lock it everywhere, want to confirm or shuffle?

### Variant B — Maddie-mirror
> 🌀 sanity check — pillar order locked at Physical → Inner → Identity → Financial across the site. matches the spiral's elevate→align→unlock arc. say the word and i'll lock it as canonical, or send me your preferred order if it's different in your head ✨

### Variant C — Strict business
> Confirm canonical pillar order: Physical → Inner → Identity → Financial. Currently propagated across spiral, navigation, pillar pages, quiz routing. Reply CONFIRM or send alternate order.

---

## Send-order recommendation (Anthony's discretion)

1. **MD-1** + **MD-2** — same session, both P0 (revenue + launch). Send as separate messages so each ask gets its own response thread.
2. **MD-3** — once V8 is on the public URL (post-token-rotation), ping for sign-off. Otherwise share ngrok review surface.
3. **MD-4 + MD-7** — batch into one message asking both at once (related: quiz + pillar IA).
4. **MD-5** — defer to next planning conversation (architectural, not blocking).
5. **MD-6** — defer to next planning conversation; better as a call than a text.

## Anti-patterns to avoid

- **Don't bundle P0 + P2 into one message** — Maddie responds best to single-decision asks. Bundling dilutes urgency.
- **Don't pre-decide MD-5 / MD-7 for her** — they're hers to lock; just present cleanly.
- **Don't reference V5/V6/V7 by name unless explicitly asking about them** — she sees only V3 and V8 publicly. Internal version numbers create confusion.
- **Don't apologize for CI being broken** — she didn't ask, doesn't care, and dwelling on infra signals "things are wobbly." If V8 is on ngrok, share the ngrok URL with no apology.
