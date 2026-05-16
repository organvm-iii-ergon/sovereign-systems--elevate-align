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
export type DecisionCategory = 'urgent' | 'client-gated' | 'studio-internal' | 'strategic';
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
    effects: 'Unlocks the right fix for the missing-fluoride report — three possible fixes (~30 min, ~1-2 hr, ~45 min) depending on your answer. Without this we can\'t pick the right one.',
    suggestion: 'Look at the little badge at the top of the water-report when fluoride doesn\'t appear. Tell me which of the three you see.',
    type: 'multi',
    progress: 50,
    status: 'partial',
    options: [
      { label: 'Sample Data', description: 'The data shown was the fallback demo, not real EWG data.', consequence: 'Diagnosis: route-shadowing (H1). Fix: ~30 min.' },
      { label: 'Demo (Server)', description: 'EWG was reached but parsing failed; server returned demo.', consequence: 'Diagnosis: EWG parser silent-fail (H2). Fix: ~1-2 hr.' },
      { label: 'ZIP {your zip}', description: 'Real EWG data for your ZIP — no fluoride row in EWG response.', consequence: 'Diagnosis: EWG genuinely missing fluoride for your utility (H3). Fix: UI-only ~45 min, add "checked but not detected" disclaimer.' },
    ],
    links: [
      { label: 'GH#62 fluoride bug', url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/62' },
      { label: 'Outbound draft (paste to iMessage)', url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/blob/main/docs/maddie/2026-05-16-fluoride-discriminator-question.md' },
    ],
    notes: 'Defensive fix already shipped (c778f48) — fluoride now in client-side fallback list + 3-state badge surfaces data-source.',
  },
  {
    id: 'hub-quiz-form-url',
    title: 'Hub-page quiz CTA — what URL?',
    category: 'urgent',
    ownerNeeded: 'maddie',
    urgencyHint: 'When ready',
    effects: 'Currently the spiral hero quiz CTA falls back to local /quiz (the affinity quiz that scores into 1 of 13 nodes). If you want the CTA to point to your GHL form, name the URL.',
    suggestion: 'Either confirm "use local /quiz" (acceptable as-is) OR provide a GHL form URL. The water-funnel URL `stopdrinkingacid.com` is already wired into `productUrl` separately — this is for the hub-page CTA only.',
    type: 'binary',
    progress: 25,
    status: 'open',
    options: [
      { label: 'Keep local /quiz', description: 'Hub CTA goes to the in-site spiral-affinity quiz.', consequence: 'No code change. Close GH#58 as won\'t-do.', recommended: true },
      { label: 'Use a GHL URL — I\'ll send it', description: 'You provide the URL; I wire it in.', consequence: 'I update `hub.quizFormUrl` in `src/data/hub.config.ts:268` once you send the URL.' },
    ],
    links: [
      { label: 'GH#58 quizFormUrl vacuum', url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/58' },
    ],
  },
  {
    id: 'multipure-canonical-referral',
    title: 'Multipure — which referral path is canonical?',
    category: 'urgent',
    ownerNeeded: 'maddie',
    urgencyHint: 'Before launch',
    effects: 'Two paths produce affiliate revenue but only one should be displayed to avoid attribution split. Current code uses `/maddie-wired`; today you sent `?coupon=249270`.',
    suggestion: 'Pick whichever path you want as the public-facing referral. I\'ll update the config to match.',
    type: 'binary',
    progress: 25,
    status: 'open',
    options: [
      { label: 'Use ?coupon=249270', description: 'Switch to the new path you sent today (with the coupon code visible in the URL).', consequence: 'Update `hydration.config.ts:260` to new path. Strips Google Ads tracking params before saving.' },
      { label: 'Keep /maddie-wired', description: 'Existing path stays as the canonical referral.', consequence: 'No change. Coupon URL is alternate, not promoted.', recommended: true },
    ],
    links: [
      { label: 'GH#49 affiliate URLs', url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/49' },
    ],
    notes: 'Both work — just need to pick one to display so analytics attributes cleanly.',
  },
  {
    id: 'anespa-dx-url',
    title: 'Anespa DX — provide URL or remove tier?',
    category: 'urgent',
    ownerNeeded: 'maddie',
    urgencyHint: 'Before launch',
    effects: 'Filter tier shows "Details Coming Soon" instead of a working link. Either provide the affiliate URL or remove the tier from `hydration.config.ts`.',
    suggestion: 'If you\'re pursuing Anespa as a partner, send the URL. If not, I\'ll remove the tier so the page doesn\'t show a dead placeholder.',
    type: 'binary',
    progress: 0,
    status: 'open',
    options: [
      { label: 'Sending URL', description: 'You\'ll send the affiliate URL — I wire it in.', consequence: 'Filter tier becomes live once URL is in place.' },
      { label: 'Remove the tier', description: 'Anespa DX is not a brand you\'re pursuing.', consequence: 'I remove the entry from `hydration.config.ts` (line 282). One less filter shown on the water page.' },
    ],
    links: [
      { label: 'GH#49 affiliate URLs', url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/49' },
    ],
  },
  // ============ STRATEGIC (foundational, takes longer) ============
  {
    id: 'branch-swap-proposal',
    title: 'Branch-swap proposal — which option?',
    category: 'strategic',
    ownerNeeded: 'both',
    urgencyHint: 'After water funnel ships',
    effects: 'Decides the public-vs-behind-capture content architecture. Affects: what\'s on /water/[slug] (currently 6 studio branches), what the public site\'s voice feels like, what depth library lives in GHL.',
    suggestion: 'Option B (curated subset) most literally matches your verbatim "switch my baby branches to the spiral and your kickass ones into GHL" + "just a few parts." Lowest revert cost.',
    type: 'multi',
    progress: 30,
    status: 'partial',
    options: [
      { label: 'Option A — Full swap', description: 'Wholesale replace 6 studio branches with your GHL content. Studio branches exported to GHL.', consequence: '6 pages disappear from the spiral; URLs/SEO impacted. Cleanest content architecture.' },
      { label: 'Option B — Curated subset', description: 'Keep 2-3 studio branches you choose; add your GHL branches alongside; rest of studio content goes to GHL.', consequence: 'Possibly more branches on spiral total; mixed authorship; easiest revert.', recommended: true },
      { label: 'Option C — Voice rewrite', description: 'You rewrite the 6 studio branches in your voice; full depth content stays as expanded GHL library.', consequence: 'Most manual effort on your side; preserves URL structure + SEO.' },
      { label: 'Send me the 3 clarifying Qs first', description: 'I\'ll send the 3 questions from the analysis doc. Answer those before we pick a path.', consequence: 'Slower but most informed. The 3 questions: which studio branches to keep, names of your GHL branches, your preferred export format.', recommended: true },
    ],
    links: [
      { label: 'Analysis doc with 3-option matrix', url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/blob/main/docs/maddie/2026-05-16-branch-swap-proposal-analysis.md' },
    ],
    notes: 'Biggest single content-strategy ask of the entire 6-week thread. Sound pattern (public = curated, capture = depth) but needs alignment before execution.',
  },
  {
    id: 'custom-domain-elevatealign',
    title: 'Connect elevatealign.com via Cloudflare',
    category: 'client-gated',
    ownerNeeded: 'maddie',
    urgencyHint: 'Whenever',
    effects: 'Site currently serves at `sovereign-systems-spiral.pages.dev`. Connecting elevatealign.com makes the URL match the brand. Mayan-calendar page currently at that domain needs to be preserved or relocated first.',
    suggestion: 'Stop paying GoDaddy first (you said this). Decide what to do with the Mayan-calendar page before swapping DNS. Then one Cloudflare dashboard action connects the domain.',
    type: 'multi',
    progress: 50,
    status: 'partial',
    options: [
      { label: 'Preserve Mayan calendar page', description: 'Export the Mayan calendar content from GoDaddy first; I\'ll host it on the spiral site under a /mayan-calendar route or similar.', consequence: 'No content lost. Slower switchover.' },
      { label: 'Archive Mayan calendar page', description: 'Save a copy locally; remove from the swap.', consequence: 'Content preserved as archive; not publicly accessible.' },
      { label: 'Let it disappear', description: 'GoDaddy stops; Mayan calendar page is no longer reachable.', consequence: 'Anyone with the URL gets 404 / spiral homepage.' },
    ],
    links: [
      { label: 'GH#3 custom domain', url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/3' },
    ],
  },
  // ============ CLIENT-GATED (lower urgency or longer-running) ============
  {
    id: 'coldstream-uk-placement',
    title: 'Coldstream UK — new filter tier or alternative?',
    category: 'client-gated',
    ownerNeeded: '4jp',
    urgencyHint: 'When deciding tiers',
    effects: 'You sent a Coldstream affiliate URL today. The brand does NOT have a tier in `hydration.config.ts`. If it stays out, the affiliate revenue from your referral won\'t flow through the spiral. If it goes in, the filter page gets an extra tier.',
    suggestion: 'Add as new tier if it fits your filter recommendation framework. Skip if Coldstream is an experimental/alternative you don\'t want to promote prominently.',
    type: 'multi',
    progress: 25,
    status: 'open',
    options: [
      { label: 'New filter tier', description: 'Add to `hydration.config.ts` as a 6th tier with the URL.', consequence: 'Spiral filter page gains a new option. Tier ordering / framing needs Maddie input.' },
      { label: 'Alternatives section', description: 'List under a "filter alternatives we know about" non-primary section.', consequence: 'Less prominent. Requires a small new content block.' },
      { label: 'Skip', description: 'Don\'t add to the spiral. URL lives only in your share notes.', consequence: 'No affiliate revenue through the spiral for Coldstream.' },
    ],
    notes: 'URL provided: https://www.coldstreamfilters.com/?v=79cba1185463 — `?v=79cba1185463` is likely Maddie\'s affiliate code.',
  },
  {
    id: 'documentary-video',
    title: 'Documentary video — filming status',
    category: 'client-gated',
    ownerNeeded: 'maddie',
    urgencyHint: 'When ready',
    effects: 'The homepage has a video slot intended for the documentary intro. Until filmed, the slot uses a placeholder OR is hidden.',
    suggestion: 'No system action — pending you filming and sharing.',
    type: 'observation',
    progress: 0,
    status: 'open',
  },
  {
    id: 'stripe-vs-ghl-subscriptions',
    title: 'Stripe vs GHL for subscriptions',
    category: 'strategic',
    ownerNeeded: 'maddie',
    urgencyHint: 'Before subscriptions launch',
    effects: 'Subscription-payment capability needs a payment processor. Stripe and GHL both work. Choice affects: pricing flexibility, customer email visibility, refund flow, and where subscription state lives.',
    suggestion: 'GHL if you want everything in one place and don\'t need Stripe\'s deeper subscription primitives. Stripe if you anticipate complex billing (proration, trials, multi-tier) or want lower per-transaction fees.',
    type: 'binary',
    progress: 10,
    status: 'open',
    options: [
      { label: 'Stripe', description: 'Direct Stripe integration. Subscription state in Stripe.', consequence: 'More implementation work upfront but more flexibility later.' },
      { label: 'GHL native', description: 'Use GHL\'s built-in subscription tools.', consequence: 'Less code. Subscription state in GHL. Easier if you\'re already running everything else in GHL.', recommended: true },
    ],
    links: [
      { label: 'GH#38 subscription capability', url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/38' },
    ],
  },
  {
    id: 'meta-pixel-tracking',
    title: 'Meta pixel — wire for analytics',
    category: 'client-gated',
    ownerNeeded: 'maddie',
    urgencyHint: 'When ready',
    effects: 'You have a Meta pixel ID. Wiring it into the site enables Facebook/Instagram ads attribution + retargeting. Without it, ad spend on Meta has no conversion signal back.',
    suggestion: 'Send the pixel ID. I wire it into the base layout and capture endpoint within ~30 min.',
    type: 'binary',
    progress: 10,
    status: 'open',
    options: [
      { label: 'Send pixel ID', description: 'You send the ID. I wire it into `Base.astro` + `/capture` event tracking.', consequence: 'Site starts firing Meta pixel events. Retargeting becomes possible.', recommended: true },
      { label: 'Defer', description: 'Hold until ad spend is planned.', consequence: 'No tracking until you\'re ready.' },
    ],
    links: [
      { label: 'GH#51 analytics integration', url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/51' },
    ],
  },
  // ============ STUDIO-INTERNAL (4jp-side, not Maddie-blocking) ============
  {
    id: 'cf-token-rotation',
    title: 'CF API token rotation OR pivot to GitHub App',
    category: 'studio-internal',
    ownerNeeded: '4jp',
    urgencyHint: 'When tired of manual deploys',
    effects: 'CI auto-deploy has been broken since Apr 19 (token expired). `npm run deploy` works manually. Rotating restores CI; GitHub App eliminates the token entirely.',
    suggestion: 'Install Cloudflare Pages GitHub App on the org → recreate the Pages project as Git-connected. Eliminates the token; no future rotation needed.',
    type: 'binary',
    progress: 50,
    status: 'partial',
    options: [
      { label: 'Rotate the token', description: 'Follow the runbook to mint a new CF API token + set as GH secret.', consequence: 'CI auto-deploy works again. Token will expire eventually — rotate-or-renew cycle.', recommended: true },
      { label: 'Pivot to GitHub App', description: 'Install CF Pages GH App, recreate Pages project as Git-connected.', consequence: 'No token to manage. One-time setup, then forever.' },
    ],
    links: [
      { label: 'GH#52 token expired', url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/issues/52' },
      { label: 'Runbook', url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/blob/main/docs/runbooks/cf-token-rotation.md' },
    ],
  },
  {
    id: 'backfill-spiral-snapshots',
    title: 'Backfill V1–V8 playable snapshots for /timeline',
    category: 'studio-internal',
    ownerNeeded: '4jp',
    urgencyHint: 'Iteratively',
    effects: '/timeline currently has 9 playable Lab Experiments + 1 live + 8 V1-V8 entries marked SNAPSHOT PENDING. Each backfilled snapshot makes the timeline more useful.',
    suggestion: 'Pick one V at a time. Checkout commit, build, save dist/ output to public/spiral-versions/<id>/, set status playable.',
    type: 'observation',
    progress: 0,
    status: 'open',
    links: [
      { label: 'Convention in PR #73 body', url: 'https://github.com/organvm-iii-ergon/sovereign-systems--elevate-align/pull/73' },
    ],
  },
  {
    id: 'session-logs-track-or-ignore',
    title: '5 Claude Code session logs — track or stay gitignored?',
    category: 'studio-internal',
    ownerNeeded: '4jp',
    urgencyHint: 'Whenever',
    effects: 'docs/archive/2026-04/*.txt — 5 Claude Code session logs filed but gitignored (global `*.txt` rule). They\'re local-only currently — Universal Rule #2 violation unless explicitly ignored as ephemeral.',
    suggestion: 'Sensitive content (full system prompts, conversation history). Recommend stay gitignored unless audit-trail value justifies risk.',
    type: 'binary',
    progress: 0,
    status: 'open',
    options: [
      { label: 'Stay gitignored', description: 'Files remain local-only. Treated as ephemeral.', consequence: 'No exposure of sensitive content. Files survive on disk via Time Machine / Backblaze only.', recommended: true },
      { label: 'Track them', description: 'Add `!docs/archive/**/*.txt` exception to .gitignore.', consequence: 'Files commit and ship to GitHub (private repo). Audit trail durable.' },
    ],
  },
];

// ============ Helpers ============

export function decisionsByCategory(): Record<DecisionCategory, DecisionItem[]> {
  const groups: Record<DecisionCategory, DecisionItem[]> = {
    urgent: [],
    'client-gated': [],
    strategic: [],
    'studio-internal': [],
  };
  for (const d of DECISIONS) groups[d.category].push(d);
  return groups;
}

export function overallProgress(): { count: number; sum: number; pct: number; resolved: number; partial: number; open: number } {
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
