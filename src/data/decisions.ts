/**
 * Decisions registry — every open question, hanging headache, and
 * binary/multi-option path that needs an answer to move the site forward.
 *
 * Source of truth for the `/decisions` page (`src/pages/decisions.astro`),
 * which is the client-us interaction surface — Maddie can browse the list,
 * see what affects what, see the system's recommendation, and signal her
 * answer via the per-option action.
 *
 * Each item carries:
 *   - title, category, ownerNeeded, urgencyHint  → header context
 *   - effects                                    → why this matters / what's blocked
 *   - suggestion                                 → system's recommended path
 *   - type + options                             → binary / multi-option / observation
 *   - progress 0-100                             → how close to a decision/resolution
 *   - status                                     → open / partial / resolved
 *   - links                                      → GH issues, docs, evidence
 *
 * v1 is static. v2 will hook option clicks into /capture with
 * source='decision-board' so Maddie's selections land in KV without leaving
 * the page.
 */

export type DecisionStatus = 'open' | 'partial' | 'resolved';
export type DecisionType = 'binary' | 'multi' | 'observation' | 'free-text';
export type DecisionCategory =
  | 'urgent'
  | 'client-gated'
  | 'studio-internal'
  | 'strategic';
export type Owner = 'maddie' | '4jp' | 'both' | 'system';

export interface DecisionOption {
  /** Short label shown on the button (1-4 words). */
  label: string;
  /** What choosing this means / what happens next. */
  description: string;
  /** Optional hint about consequences if chosen. */
  consequence?: string;
  /** Whether this is the system's recommended option. */
  recommended?: boolean;
}

export interface DecisionLink {
  label: string;
  url: string;
}

export interface DecisionItem {
  id: string;
  title: string;
  category: DecisionCategory;
  ownerNeeded: Owner;
  urgencyHint: string;
  /** What downstream things depend on this being decided/resolved. */
  effects: string;
  /** The system's recommended path (always present, even if just "needs Maddie input"). */
  suggestion: string;
  type: DecisionType;
  /** For binary/multi only. */
  options?: DecisionOption[];
  /** 0–100 — how close this is to being fully decided/resolved. */
  progress: number;
  status: DecisionStatus;
  links?: DecisionLink[];
  /** IDs of other decisions that must be resolved first. */
  blockedBy?: string[];
  /** Free-text notes for context/history. */
  notes?: string;
}

export const DECISIONS: DecisionItem[] = [
  // ============ URGENT (this-week shippable) ============
  {
    id: 'fluoride-badge-state',
    title: 'Fluoride bug — which badge state did you see?',
    category: 'urgent',
    ownerNeeded: 'maddie',
    urgencyHint: 'When you have a sec',
    effects:
      "Unlocks the right fix for the missing-fluoride report — three possible fixes (~30 min, ~1-2 hr, ~45 min) depending on your answer. Without this we can't pick the right one.",
    suggestion:
      "Look at the little badge at the top of the water-report when fluoride doesn't appear. Tell me which of the three you see.",
    type: 'multi',
    progress: 50,
    status: 'partial',
    options: [
      {
        label: 'Sample Data',
        description: 'The data shown was the fallback demo, not real EWG data.',
        consequence: 'Diagnosis: route-shadowing (H1). Fix: ~30 min.',
      },
      {
        label: 'Demo (Server)',
        description:
          'EWG was reached but parsing failed; server returned demo.',
        consequence: 'Diagnosis: EWG parser silent-fail (H2). Fix: ~1-2 hr.',
      },
      {
        label: 'ZIP {your zip}',
        description:
          'Real EWG data for your ZIP — no fluoride row in EWG response.',
        consequence:
          'Diagnosis: EWG genuinely missing fluoride for your utility (H3). Fix: UI-only ~45 min, add "checked but not detected" disclaimer.',
      },
    ],
    links: [
      {
        label: 'GH#62 fluoride bug',
        url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/62',
      },
      {
        label: 'Outbound draft (paste to iMessage)',
        url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/blob/main/docs/maddie/2026-05-16-fluoride-discriminator-question.md',
      },
    ],
    notes:
      'Defensive fix already shipped (c778f48) — fluoride now in client-side fallback list + 3-state badge surfaces data-source.',
  },
  {
    id: 'hub-quiz-form-url',
    title: 'Hub-page quiz CTA — what URL?',
    category: 'urgent',
    ownerNeeded: 'maddie',
    urgencyHint: 'When ready',
    effects:
      'Currently the spiral hero quiz CTA falls back to local /quiz (the affinity quiz that scores into 1 of 13 nodes). If you want the CTA to point to your GHL form, name the URL.',
    suggestion:
      'Either confirm "use local /quiz" (acceptable as-is) OR provide a GHL form URL. The water-funnel URL `stopdrinkingacid.com` is already wired into `productUrl` separately — this is for the hub-page CTA only.',
    type: 'binary',
    progress: 25,
    status: 'open',
    options: [
      {
        label: 'Keep local /quiz',
        description: 'Hub CTA goes to the in-site spiral-affinity quiz.',
        consequence: "No code change. Close GH#58 as won't-do.",
        recommended: true,
      },
      {
        label: "Use a GHL URL — I'll send it",
        description: 'You provide the URL; I wire it in.',
        consequence:
          'I update `hub.quizFormUrl` in `src/data/hub.config.ts:268` once you send the URL.',
      },
    ],
    links: [
      {
        label: 'GH#58 quizFormUrl vacuum',
        url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/58',
      },
    ],
  },
  {
    id: 'ghl-booking-url',
    title: 'Book-a-call CTA — provide GHL calendar URL?',
    category: 'urgent',
    ownerNeeded: 'maddie',
    urgencyHint: 'When ready',
    effects:
      'Your GHL slug-status table shows "Book a call" as "add calendar URL" — the slug isn\'t wired yet. The Sovereign Spiral config (`hub.config.ts:279`) has no `ghl.bookingUrl` field either, so any "book a call" CTA on the spiral can\'t target your calendar today.',
    suggestion:
      'When your GHL booking calendar is set up, send the URL. I\'ll add `bookingUrl` to `hub.config.ts:279` (mirrors the `quizFormUrl` pattern) and wire any "book a call" CTAs to it.',
    type: 'binary',
    progress: 10,
    status: 'open',
    options: [
      {
        label: 'Send calendar URL',
        description: 'You configure the GHL booking calendar and send the URL.',
        consequence:
          'I add `bookingUrl` to the `ghl` config block and surface a working "book a call" CTA. Mirrors how `quizFormUrl` and `productUrl` work today.',
      },
      {
        label: 'Defer — no book-a-call CTA needed yet',
        description: 'No booking flow until later in launch sequence.',
        consequence:
          'No code change. Revisit when calls are part of the funnel.',
        recommended: true,
      },
    ],
    notes:
      'Surfaced from GHL admin slug-status table screenshot 2026-05-17. Slug `[your GHL calendar URL]` is the placeholder Maddie sees in her GHL admin.',
  },
  {
    id: 'multipure-canonical-referral',
    title: 'Multipure — which referral path is canonical?',
    category: 'urgent',
    ownerNeeded: 'maddie',
    urgencyHint: 'Before launch',
    effects:
      'Two paths produce affiliate revenue but only one should be displayed to avoid attribution split. Current code uses `/maddie-wired`; today you sent `?coupon=249270`.',
    suggestion:
      "Pick whichever path you want as the public-facing referral. I'll update the config to match.",
    type: 'binary',
    progress: 25,
    status: 'open',
    options: [
      {
        label: 'Use ?coupon=249270',
        description:
          'Switch to the new path you sent today (with the coupon code visible in the URL).',
        consequence:
          'Update `hydration.config.ts:260` to new path. Strips Google Ads tracking params before saving.',
      },
      {
        label: 'Keep /maddie-wired',
        description: 'Existing path stays as the canonical referral.',
        consequence: 'No change. Coupon URL is alternate, not promoted.',
        recommended: true,
      },
    ],
    links: [
      {
        label: 'GH#49 affiliate URLs',
        url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/49',
      },
    ],
    notes:
      'Both work — just need to pick one to display so analytics attributes cleanly.',
  },
  {
    id: 'anespa-dx-url',
    title: 'Anespa DX — provide URL or remove tier?',
    category: 'urgent',
    ownerNeeded: 'maddie',
    urgencyHint: 'Before launch',
    effects:
      'Filter tier shows "Details Coming Soon" instead of a working link. Either provide the affiliate URL or remove the tier from `hydration.config.ts`.',
    suggestion:
      "If you're pursuing Anespa as a partner, send the URL. If not, I'll remove the tier so the page doesn't show a dead placeholder.",
    type: 'binary',
    progress: 0,
    status: 'open',
    options: [
      {
        label: 'Sending URL',
        description: "You'll send the affiliate URL — I wire it in.",
        consequence: 'Filter tier becomes live once URL is in place.',
      },
      {
        label: 'Remove the tier',
        description: "Anespa DX is not a brand you're pursuing.",
        consequence:
          'I remove the entry from `hydration.config.ts` (line 282). One less filter shown on the water page.',
      },
    ],
    links: [
      {
        label: 'GH#49 affiliate URLs',
        url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/49',
      },
    ],
  },
  // ============ STRATEGIC (foundational, takes longer) ============
  {
    id: 'branch-swap-proposal',
    title: 'Branch-swap proposal — direction locked, mapping pending',
    category: 'strategic',
    ownerNeeded: 'both',
    urgencyHint: 'Mapping confirmation pending',
    effects:
      "Decides the public-vs-behind-capture content architecture. Affects: what's on /water/[slug] (currently 6 studio branches), what the public site's voice feels like, what depth library lives in GHL.",
    suggestion:
      'Direction is set toward Option A (wholesale swap — studio branches move to GHL). Final mapping of which 3 branches remain visible on the spiral is still being clarified — see energy-branch-content-source.',
    type: 'multi',
    progress: 75,
    status: 'partial',
    options: [
      {
        label: 'Option A — Full swap',
        description:
          "Wholesale replace studio branches: studio branches exit the spiral and ship to GHL; spiral surfaces only Maddie's curated 3 (or her chosen mapping).",
        consequence:
          'Cleanest content architecture. URLs/SEO impacted. Matches Maddie\'s verbatim "switch my baby branches to spiral and your kickass ones into GHL."',
        recommended: true,
      },
      {
        label: 'Option B — Curated subset',
        description:
          'Keep 2-3 studio branches you choose; add your GHL branches alongside; rest of studio content goes to GHL.',
        consequence:
          'Possibly more branches on spiral total; mixed authorship; easiest revert.',
      },
      {
        label: 'Option C — Voice rewrite',
        description:
          'You rewrite the 6 studio branches in your voice; full depth content stays as expanded GHL library.',
        consequence:
          'Most manual effort on your side; preserves URL structure + SEO.',
      },
    ],
    notes:
      'Direction locked 2026-05-16 by Maddie: studio branches migrate to GHL via HTML codes. Spiral retains 3 visible (per her "inflammation, hormone health & energy/cellular health"). Final mapping still ambiguous — are the 3 visible the renamed studio branches kept from task #15, or her own baby branches replacing them? Downstream: energy-branch-content-source resolves part of this.',
    blockedBy: ['energy-branch-content-source'],
  },
  {
    id: 'custom-domain-elevatealign',
    title: 'Connect elevatealign.com via Cloudflare',
    category: 'client-gated',
    ownerNeeded: 'maddie',
    urgencyHint: 'Whenever',
    effects:
      'Site currently serves at `sovereign-systems-spiral.pages.dev`. Connecting elevatealign.com makes the URL match the brand. Mayan-calendar page currently at that domain needs to be preserved or relocated first.',
    suggestion:
      'Stop paying GoDaddy first (you said this). Decide what to do with the Mayan-calendar page before swapping DNS. Then one Cloudflare dashboard action connects the domain.',
    type: 'multi',
    progress: 50,
    status: 'partial',
    options: [
      {
        label: 'Preserve Mayan calendar page',
        description:
          "Export the Mayan calendar content from GoDaddy first; I'll host it on the spiral site under a /mayan-calendar route or similar.",
        consequence: 'No content lost. Slower switchover.',
      },
      {
        label: 'Archive Mayan calendar page',
        description: 'Save a copy locally; remove from the swap.',
        consequence: 'Content preserved as archive; not publicly accessible.',
      },
      {
        label: 'Let it disappear',
        description:
          'GoDaddy stops; Mayan calendar page is no longer reachable.',
        consequence: 'Anyone with the URL gets 404 / spiral homepage.',
      },
    ],
    links: [
      {
        label: 'GH#3 custom domain',
        url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/3',
      },
    ],
  },
  // ============ CLIENT-GATED (lower urgency or longer-running) ============
  {
    id: 'coldstream-uk-placement',
    title: 'Coldstream UK — new filter tier or alternative?',
    category: 'client-gated',
    ownerNeeded: '4jp',
    urgencyHint: 'When deciding tiers',
    effects:
      "You sent a Coldstream affiliate URL today. The brand does NOT have a tier in `hydration.config.ts`. If it stays out, the affiliate revenue from your referral won't flow through the spiral. If it goes in, the filter page gets an extra tier.",
    suggestion:
      "Add as new tier if it fits your filter recommendation framework. Skip if Coldstream is an experimental/alternative you don't want to promote prominently.",
    type: 'multi',
    progress: 25,
    status: 'open',
    options: [
      {
        label: 'New filter tier',
        description: 'Add to `hydration.config.ts` as a 6th tier with the URL.',
        consequence:
          'Spiral filter page gains a new option. Tier ordering / framing needs Maddie input.',
      },
      {
        label: 'Alternatives section',
        description:
          'List under a "filter alternatives we know about" non-primary section.',
        consequence: 'Less prominent. Requires a small new content block.',
      },
      {
        label: 'Skip',
        description:
          "Don't add to the spiral. URL lives only in your share notes.",
        consequence: 'No affiliate revenue through the spiral for Coldstream.',
      },
    ],
    notes:
      "URL provided: https://www.coldstreamfilters.com/?v=79cba1185463 — `?v=79cba1185463` is likely Maddie's affiliate code.",
  },
  {
    id: 'documentary-video',
    title: 'Documentary video — placeholder or gate Node 5?',
    category: 'client-gated',
    ownerNeeded: 'maddie',
    urgencyHint: 'When deciding Node 5 ship order',
    effects:
      'Node 5 trim (now 3 elements: your hook + documentary + 2 buttons) needs the documentary in slot 2. Two paths: ship Node 5 now with a placeholder and swap when video is ready, OR wait to update Node 5 until the documentary is filmed and ready.',
    suggestion:
      'Ship now with a placeholder (a still image, a "documentary coming" card, or the existing intro video) and swap when ready. Lets the new Node 5 architecture land without gating on filming.',
    type: 'binary',
    progress: 25,
    status: 'open',
    options: [
      {
        label: 'Ship with placeholder',
        description:
          'Update Node 5 to the 3-element layout now; documentary slot uses a placeholder until the real video is ready.',
        consequence:
          'Node 5 ships faster. Two-step delivery (now + later swap).',
        recommended: true,
      },
      {
        label: 'Gate Node 5 on video',
        description: 'Wait to update Node 5 until the documentary is filmed.',
        consequence:
          'Node 5 stays in current state until filming completes. Single-step delivery.',
      },
    ],
    notes:
      'Maddie said "need to film the two videos" (transcript 2026-05-16 line 180) — this item tracks ONE slot (Node 5 documentary). The second video target is TBD; ask Maddie when she\'s ready.',
  },
  {
    id: 'stripe-vs-ghl-subscriptions',
    title: 'Stripe vs GHL for subscriptions',
    category: 'strategic',
    ownerNeeded: 'maddie',
    urgencyHint: 'Before subscriptions launch',
    effects:
      'Subscription-payment capability needs a payment processor. Stripe and GHL both work. Choice affects: pricing flexibility, customer email visibility, refund flow, and where subscription state lives.',
    suggestion:
      "GHL if you want everything in one place and don't need Stripe's deeper subscription primitives. Stripe if you anticipate complex billing (proration, trials, multi-tier) or want lower per-transaction fees.",
    type: 'binary',
    progress: 10,
    status: 'open',
    options: [
      {
        label: 'Stripe',
        description: 'Direct Stripe integration. Subscription state in Stripe.',
        consequence:
          'More implementation work upfront but more flexibility later.',
      },
      {
        label: 'GHL native',
        description: "Use GHL's built-in subscription tools.",
        consequence:
          "Less code. Subscription state in GHL. Easier if you're already running everything else in GHL.",
        recommended: true,
      },
    ],
    links: [
      {
        label: 'GH#38 subscription capability',
        url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/38',
      },
    ],
  },
  {
    id: 'meta-pixel-tracking',
    title: 'Meta pixel — wire for analytics',
    category: 'client-gated',
    ownerNeeded: 'maddie',
    urgencyHint: 'When ready',
    effects:
      'You have a Meta pixel ID. Wiring it into the site enables Facebook/Instagram ads attribution + retargeting. Without it, ad spend on Meta has no conversion signal back.',
    suggestion:
      'Send the pixel ID. I wire it into the base layout and capture endpoint within ~30 min.',
    type: 'binary',
    progress: 10,
    status: 'open',
    options: [
      {
        label: 'Send pixel ID',
        description:
          'You send the ID. I wire it into `Base.astro` + `/capture` event tracking.',
        consequence:
          'Site starts firing Meta pixel events. Retargeting becomes possible.',
        recommended: true,
      },
      {
        label: 'Defer',
        description: 'Hold until ad spend is planned.',
        consequence: "No tracking until you're ready.",
      },
    ],
    links: [
      {
        label: 'GH#51 analytics integration',
        url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/51',
      },
    ],
  },
  // ============ STUDIO-INTERNAL (4jp-side, not Maddie-blocking) ============
  {
    id: 'cf-token-rotation',
    title: 'CF API token rotation OR pivot to GitHub App',
    category: 'studio-internal',
    ownerNeeded: '4jp',
    urgencyHint: 'When tired of manual deploys',
    effects:
      'CI auto-deploy has been broken since Apr 19 (token expired). `npm run deploy` works manually. Rotating restores CI; GitHub App eliminates the token entirely.',
    suggestion:
      'Install Cloudflare Pages GitHub App on the org → recreate the Pages project as Git-connected. Eliminates the token; no future rotation needed.',
    type: 'binary',
    progress: 50,
    status: 'partial',
    options: [
      {
        label: 'Rotate the token',
        description:
          'Follow the runbook to mint a new CF API token + set as GH secret.',
        consequence:
          'CI auto-deploy works again. Token will expire eventually — rotate-or-renew cycle.',
        recommended: true,
      },
      {
        label: 'Pivot to GitHub App',
        description:
          'Install CF Pages GH App, recreate Pages project as Git-connected.',
        consequence: 'No token to manage. One-time setup, then forever.',
      },
    ],
    links: [
      {
        label: 'GH#52 token expired',
        url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/52',
      },
      {
        label: 'Runbook',
        url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/blob/main/docs/runbooks/cf-token-rotation.md',
      },
    ],
  },
  {
    id: 'backfill-spiral-snapshots',
    title: 'Backfill V1–V8 playable snapshots for /timeline',
    category: 'studio-internal',
    ownerNeeded: '4jp',
    urgencyHint: 'Iteratively',
    effects:
      '/timeline currently has 9 playable Lab Experiments + 1 live + 8 V1-V8 entries marked SNAPSHOT PENDING. Each backfilled snapshot makes the timeline more useful.',
    suggestion:
      'Pick one V at a time. Checkout commit, build, save dist/ output to public/spiral-versions/<id>/, set status playable.',
    type: 'observation',
    progress: 0,
    status: 'open',
    links: [
      {
        label: 'Convention in PR #73 body',
        url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/pull/73',
      },
    ],
  },
  {
    id: 'ghl-page-buildout-status',
    title: 'GHL page buildout status — 12-row snapshot 2026-05-17',
    category: 'studio-internal',
    ownerNeeded: 'system',
    urgencyHint: 'Observational',
    effects:
      "Captures the state of Maddie's GHL funnel pages as of 2026-05-17 so the studio knows what page-states she's sitting on. Not actionable by studio (these are her GHL admin slugs), but useful as context for which Sovereign-side CTAs have working targets.",
    suggestion:
      'Re-snapshot this row whenever Maddie sends a new GHL admin screenshot. Items: Landing live, Quiz live, Thank-you build-now, 7 branches building (athletes/fertility/gut-skin/inflammation/energy/planet/cancer), Water Hub live, Members hub live, Book-a-call calendar-URL-pending.',
    type: 'observation',
    progress: 100,
    status: 'partial',
    notes:
      "Source: GHL admin slug-status table screenshot from Maddie's 2026-05-17 share. 3 of 12 slugs still pending (Thank-you build, 7 branches building [tracked separately via `energy-branch-content-source` + `html-codes-delivery`], Book-a-call URL [tracked via `ghl-booking-url`]). 9 of 12 live or in-flight.",
  },
  {
    id: 'session-logs-track-or-ignore',
    title: '5 Claude Code session logs — track or stay gitignored?',
    category: 'studio-internal',
    ownerNeeded: '4jp',
    urgencyHint: 'Whenever',
    effects:
      "docs/archive/2026-04/*.txt — 5 Claude Code session logs filed but gitignored (global `*.txt` rule). They're local-only currently — Universal Rule #2 violation unless explicitly ignored as ephemeral.",
    suggestion:
      'Sensitive content (full system prompts, conversation history). Recommend stay gitignored unless audit-trail value justifies risk.',
    type: 'binary',
    progress: 0,
    status: 'open',
    options: [
      {
        label: 'Stay gitignored',
        description: 'Files remain local-only. Treated as ephemeral.',
        consequence:
          'No exposure of sensitive content. Files survive on disk via Time Machine / Backblaze only.',
        recommended: true,
      },
      {
        label: 'Track them',
        description: 'Add `!docs/archive/**/*.txt` exception to .gitignore.',
        consequence:
          'Files commit and ship to GitHub (private repo). Audit trail durable.',
      },
    ],
  },
  // ============ Items resolved or opened 2026-05-16 (architecture pivot) ============
  {
    id: 'node-5-trim-spec',
    title: 'Node 5 trim — layout locked at 3 elements',
    category: 'urgent',
    ownerNeeded: '4jp',
    urgencyHint: 'Ship next',
    effects:
      'Node 5 on Sovereign Spiral becomes: (a) Maddie\'s hook paragraph + headline, (b) the documentary, (c) two buttons — "Find out what\'s in your water" (zip dropdown + bottle-water cost breakdown) and "How it may be affecting you / What to do about it →" (deeper dive into GHL pages). Less compositing on Sovereign; water mechanics live in GHL.',
    suggestion:
      'Implement the 3-element layout in `src/pages/nodes/[id].astro` for nodeId=5. Documentary slot strategy resolves separately via `documentary-video` (placeholder-then-swap vs gate).',
    type: 'observation',
    progress: 100,
    status: 'resolved',
    notes:
      'Layout resolved 2026-05-16 by Maddie (verbatim Node 5 spec in morning iMessage). Implementation work is separate (and depends on `documentary-video` for video-slot strategy) but the layout decision itself is locked.',
  },
  {
    id: 'bottle-water-cost-breakdown-defer',
    title: 'Bottled-water cost breakdown — pause for now',
    category: 'urgent',
    ownerNeeded: '4jp',
    urgencyHint: 'Disable on next deploy',
    effects:
      "Bottled-water cost breakdown page can be disabled in current state. Maddie wants to preserve the info (don't lose it) but defer until GHL migration is straightened out — the breakdown will likely live in GHL with the other water content, not on Sovereign.",
    suggestion:
      'Hide the bottled-water cost breakdown from current routes; keep source content + config so it can be re-enabled or migrated to GHL later. Document the freeze.',
    type: 'observation',
    progress: 100,
    status: 'resolved',
    notes:
      'Resolved 2026-05-16 by Maddie: "all filter stuff after quiz & bottled water cost breakdown, can be disabled right now (the specific filter info and names - I don\'t want to lose it but let\'s get everything else straightened first)". Supersedes her earlier same-morning "I like the bottled water breakdown so let\'s keep that please!!" — latest wins.',
  },
  {
    id: 'filter-recs-after-quiz-defer',
    title: 'Post-quiz filter recommendations — pause for now',
    category: 'urgent',
    ownerNeeded: '4jp',
    urgencyHint: 'Disable on next deploy',
    effects:
      "Post-quiz affiliate filter recommendations can be disabled in current state. Maddie wants to preserve the info (don't lose it) but defer until GHL migration is straightened out — filter logic will likely live in GHL with tracking + automation.",
    suggestion:
      'Hide the post-quiz filter UI; keep source content + tier config so it can be re-enabled or migrated to GHL later. Document the freeze.',
    type: 'observation',
    progress: 100,
    status: 'resolved',
    notes:
      'Resolved 2026-05-16 by Maddie: filter content preserved, UI disabled, deferred to post-launch GHL setup. She will send additional filter info/names later for the GHL build.',
  },
  {
    id: 'html-codes-delivery',
    title: 'HTML codes delivery — ship 6 clean branch exports to Maddie',
    category: 'urgent',
    ownerNeeded: '4jp',
    urgencyHint: 'Ship next',
    effects:
      'Maddie chose HTML codes (over GHL-assistant access) as the immediate-delivery path for branches. 6 clean exports already exist at `docs/maddie/2026-05-16-branch-html-exports/*.html` (regenerated after content-leak scrub). Need to deliver to Maddie for paste into GHL.',
    suggestion:
      'Send the 6 HTML files via iMessage (screenshot or copy-paste, her preference). Verify against `energy-branch-content-source` first — her GHL table shows 7 slugs, our exports are 6 (no "energy" source mapped).',
    type: 'binary',
    progress: 50,
    status: 'partial',
    options: [
      {
        label: 'Send 6 now',
        description:
          'Ship the 6 clean exports we have today. Address the missing "energy" branch separately once Maddie confirms its source.',
        consequence:
          'Maddie can start pasting immediately. Energy branch follows when content is resolved.',
        recommended: true,
      },
      {
        label: 'Wait for energy resolution',
        description:
          'Hold delivery until all 7 branches are ready including energy.',
        consequence: 'Single batched delivery; slower start.',
      },
    ],
    blockedBy: ['energy-branch-content-source'],
  },
  {
    id: 'energy-branch-content-source',
    title: 'Energy branch — where does content come from?',
    category: 'client-gated',
    ownerNeeded: 'maddie',
    urgencyHint: 'Before final HTML delivery',
    effects:
      'Maddie\'s GHL table shows 7 branches (athletes, fertility, gut-skin, inflammation, energy, planet, cancer). Our Sovereign source has 6 (athletic, fertility, gut-hormones, autoimmune, cancer-support, sustainability). The "energy" slug has no source file in our repo — needs Maddie input on whether it maps to an existing source, lives in her existing GHL content, or needs new copy.',
    suggestion:
      'Confirm the 6 mappings (athletes←athletic, fertility←fertility, gut-skin←gut-hormones, inflammation←autoimmune, planet←sustainability, cancer←cancer-support) and tell me where the "energy" branch content lives.',
    type: 'multi',
    progress: 0,
    status: 'open',
    options: [
      {
        label: 'Maps to athletic',
        description:
          'Athletic branch = the energy branch under a different name.',
        consequence:
          'I rename in the export; 6 branches cover 7 slugs via alias.',
      },
      {
        label: 'I have content in GHL',
        description:
          "You'll paste your own energy content; I just send 6 branch exports.",
        consequence: 'No studio action on energy branch; 6 exports ship as-is.',
      },
      {
        label: 'Need new copy from studio',
        description:
          'Studio writes a new energy/cellular-health branch from existing source material.',
        consequence:
          'Slower delivery; new branch authored before HTML batch ships.',
      },
    ],
  },
  {
    id: 'ghl-assistant-access',
    title: 'GHL assistant access for studio — when?',
    category: 'strategic',
    ownerNeeded: 'maddie',
    urgencyHint: 'After launch wave',
    effects:
      'Maddie offered to make 4jp her GHL assistant (instead of/in addition to HTML codes delivery). With direct access, studio could wire filter/tracking/automation work without bouncing files back and forth — but adds a security/permissions decision.',
    suggestion:
      'Defer until after launch wave stabilizes. HTML codes flow is sufficient for the immediate migration; assistant access pays off when the post-launch filter/tracking work begins.',
    type: 'binary',
    progress: 25,
    status: 'open',
    options: [
      {
        label: 'Grant after launch',
        description:
          'You add 4jp as a GHL assistant once Sovereign + GHL pages are live.',
        consequence:
          'Studio handles filter/tracking/automation work directly in GHL. Faster iteration on post-launch features.',
        recommended: true,
      },
      {
        label: 'Keep HTML-codes-only',
        description:
          'Studio never gets direct GHL access; all changes flow through file delivery.',
        consequence:
          'Slower for any GHL-side iteration; more secure (no third-party access).',
      },
      {
        label: 'Grant now',
        description:
          'Add 4jp as GHL assistant immediately to accelerate migration.',
        consequence:
          'Faster migration; one more decision-during-launch instead of after.',
      },
    ],
  },
];

// ============ Helpers ============

export function decisionsByCategory(): Record<
  DecisionCategory,
  DecisionItem[]
> {
  const groups: Record<DecisionCategory, DecisionItem[]> = {
    urgent: [],
    'client-gated': [],
    strategic: [],
    'studio-internal': [],
  };
  for (const d of DECISIONS) groups[d.category].push(d);
  return groups;
}

export function overallProgress(): {
  count: number;
  sum: number;
  pct: number;
  resolved: number;
  partial: number;
  open: number;
} {
  const count = DECISIONS.length;
  const sum = DECISIONS.reduce((acc, d) => acc + d.progress, 0);
  const pct = Math.round(sum / count);
  const resolved = DECISIONS.filter((d) => d.status === 'resolved').length;
  const partial = DECISIONS.filter((d) => d.status === 'partial').length;
  const open = DECISIONS.filter((d) => d.status === 'open').length;
  return { count, sum, pct, resolved, partial, open };
}

export function categoryLabel(c: DecisionCategory): string {
  return {
    urgent: 'Urgent · Ship this week',
    'client-gated': 'Client-gated',
    strategic: 'Strategic',
    'studio-internal': 'Studio-internal',
  }[c];
}

export function ownerLabel(o: Owner): string {
  return {
    maddie: 'Maddie',
    '4jp': '4jp / studio',
    both: 'Maddie + 4jp',
    system: 'System',
  }[o];
}
