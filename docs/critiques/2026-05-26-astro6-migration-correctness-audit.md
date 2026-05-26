# Correctness Critique: Post Astro-6-Migration Coverage Audit

**Date:** 2026-05-26
**Target:** the 15-commit Astro 6 migration + recent work now at `origin/main` (`81b8114`) — spiral engine, Astro pages, components, `src/data` config, landing engine, build gates, scripts, CI
**Stage:** Post-migration, pre-polish. Branch `claude/issue-reporting-severity-5HQ5L` sits exactly at `origin/main`; this is a full-surface correctness sweep, not a design pass.
**Method:** Coverage-first static review from code only (no live render). The goal was breadth, not precision — every suspicion is logged with a **Severity** and **Confidence** so a downstream filter can rank/triage. Items marked ✓ were manually confirmed by reading the source during this pass. Findings are *evaluative input*, not a decided remediation plan.

**Severity legend:** 🔴 High · 🟡 Medium · 🟢 Low. **Confidence:** High / Med / Low.

---

## Overall Impression

The migration is structurally sound — node/pillar/branch/EnvVar counts line up across all five config layers (13/4/6/13, 91 lens bindings), `compose.ts` is genuinely pure, getStaticPaths are valid, and the vacuum gate's tracked entries are correctly maintained. No confirmed build-breaker or guaranteed runtime crash was found.

The real themes are: (1) a **soft email gate that protects nothing** and leaks lead capture; (2) **client/studio data hardcoded into source** (M2 violations) including a personal email and live affiliate URLs; (3) a **spiral lifecycle wired to an event that never fires** plus incomplete Three.js teardown; and (4) **build-gate fragility** — `test.mjs` silently depends on committed generated artifacts that the docs say should not be committed, and `vacuum-gate.mjs` parses TS with a regex that can miss a vacuum.

---

## 🔴 High

| Finding | Conf | Note / Impact |
|---|---|---|
| Email gate protects nothing — `EmailGate.astro:26-31,95-133` ✓ | High | Gated `<slot/>` is server-rendered inside a `hidden` div (fully in page source); unlock is client-side `localStorage` and fires even when `/capture` POST fails (128-133). Content readable via view-source; capture trivially bypassed. |
| Unescaped citation tooltip — `Base.astro:671-712` | High | `tooltip.innerHTML` built from `cite.source/detail/context` with no escaping. Data is studio-controlled `citations.json` (low exploitability) but the sink is a real XSS surface; `Citation.astro` renders the same data safely. |
| Personal email hardcoded in client page — `decisions.astro:27` ✓ | High | `padavano.anthony@gmail.com` inlined as the `mailto` recipient (PII-in-source + M2). Disagrees with `capture.ts`'s synthetic `decisions@sovereign-systems.local`. |
| Spiral cleanup never runs — `SpiralIsland.astro:83-90` | High | Cleanup wired only to `astro:before-swap`; no ClientRouter/ViewTransitions exists, so it never fires → WebGL ctx, RAF loop, resize/pointer listeners never torn down. If ViewTransitions is later added, no `astro:page-load` rebind → spiral won't re-mount after a swap. |
| Incomplete Three.js teardown — `spiral.ts ≈3544-3568` | Med | Disposes tracked geo/mat/tex but never removes scene-graph objects or clears `scene`; `UnrealBloomPass`/`RenderPass`/`OutputPass` not individually disposed (bloom render targets may leak). Accumulates on repeated mount/unmount. |
| Unguarded renderer/container init — `spiral.ts:1760-1765` | Med | 0-height container → `camera.aspect = NaN` (corrupt projection); any throw before `return cleanup` leaks everything already allocated (closure never returned). |
| Quiz match % can't reach 100 — `quiz.astro:374-382` | Med | `MAX_SCORE = 12` is unreachable for any single node (Q3-Q5 theme bundles map to different nodes), so "Match: {score}%" is systematically deflated. |
| Affiliate URLs / prices / stats hardcoded — `hydration.config.ts:272,290,306,333-359,268-325` | High–Med | `ionfaucet.com/maddie-spiral`, `multipure.com/maddie-wired`, `purehome.co/maddie`, prices, contaminant stats inlined (M2). Prices feed cost math via fragile regex and go stale silently. |
| Unhardened video iframe — `VideoEmbed.astro:39-46` | Med | Arbitrary `src`, no host allow-list / `referrerpolicy` / `sandbox` / `youtube-nocookie`. Dormant (all callers pass `placeholder`) but unguarded for the first real video. |
| Explicit `any` violates strict policy — `nodes/[id].astro:32-33,94,135,176,205`, `HydrationNode.astro:583-588` | Med | `astro check` (tsc) does not fail on *explicit* `any` and there is no ESLint, so CI passes — policy/safety erosion, not a build break. |

---

## 🟡 Medium

| Finding | Conf | Note / Impact |
|---|---|---|
| Vacuum gate can miss a vacuum — `vacuum-gate.mjs:62-73` ✓ | Med | Filter-tier regex lazily stops at first `}`; a tier with a nested `{}` before `affiliateUrl`, or one lacking `affiliateUrl`, can be missed (silent gate evasion) or mis-attributed across tiers. |
| `test:all` depends on committed generated artifacts — `test.mjs:154,160-168` + `package.json` ✓ | Med | `test` runs before `build`, but reads `public/citations.json` + `docs/manifests/*.json` produced by `prebuild` (build-only). Passes only because both are committed — contradicting CLAUDE.md ("do not commit a stale snapshot"). De-committing per docs breaks `npm test`/CI. |
| Manifest stale vs corpus — `docs/manifests/` ✓ | Med | Latest is `2026-04-30`; the migration materially changed the corpus but the manifest wasn't regenerated (test checks shape, not freshness). |
| Node 5 url leaves node space — `hub.config.ts:312`, `nodes/[id].astro:43-45`, `quiz.astro:393` | High | Node 5 `url` is `/water/` not `/nodes/5`; prev/next nav + quiz preview cross out silently. Likely intentional but undocumented/inconsistent. |
| Duplicate `Lens` types drift — `naming-chains.ts:27-34` vs `lens-geometry.ts:13-20` | High | Two independent defs (same 7 members, different order) + duplicated `LENSES` arrays; adding a lens to one silently drifts from the other. |
| BCE eraSort mis-sorts lineage — `naming-chains.ts:302-307` | High | PYRAMIS `christian-mystical` has `eraSort: -600` despite 16th-c. sources → wrong chronology on `/lineage/PYRAMIS`. |
| Exponent × scale unit conflation — `lens-geometry.ts:151` | Med | `phiExponent * scaleMul` multiplies an exponent by a scale factor; for `phiExponent: 0` always yields 0 regardless of lens. Likely meant to modulate scale. |
| Unescaped contaminant innerHTML — `HydrationNode.astro:405-409` | Med | `row.innerHTML` interpolates `c.name` (from `/api/water-report` EWG proxy) unescaped → reflected XSS if upstream/proxy returns markup. Use `textContent`. |
| Undocumented capture `source` values — `HydrationNode.astro:552`, `EmailGate.astro:118` | Med | `'hydration-node'`/`'email_gate'` not in CLAUDE.md source registry; downstream filtering by the registry drops them. |
| Stale line-number refs + affiliate data in decisions — `decisions.ts:144,161,163,204,245,371,192` | Med | Decision copy cites source-file line numbers already stale (quizFormUrl is at :533); also a live affiliate URL + coupon code inlined as data. |
| Unguarded JSON.parse + unvalidated vessel mode — `SpiralIsland.astro:58-75` | High | Parse errors masquerade as WebGL failure (hides whole container); invalid `?vessel=`/`spiralVesselMode` cast `as VesselMode` with no validation into `initSpiral`. |
| Greedy active-nav matching — `Base.astro:33-49` (`navClass`) | Med | `currentPath.startsWith(href)` over-highlights siblings (`/research-archive` activates `/research`). |
| rAF handle used as frame counter — `spiral.ts:3120,3236` | Med | `frame` is the `requestAnimationFrame` id (not monotonic), so `(frame * 7919) % len` particle sweeps are erratic, not the intended even cycle. |
| Point-in-polygon mis-classification — `spiral.ts:2411,3453` | Med | `hits.length % 2` "inside" test on beveled/holed geometry (eye pupil, yin-yang, crescent, ankh) can mis-classify edge-grazing rays → flickering particles. |

---

## 🟢 Low

| Finding | Conf | Note / Impact |
|---|---|---|
| `getContext('2d')!` non-null assertions — `spiral.ts:916,1028,1102,1684` (also `!` at `2388,3107`) | High | Throws if 2D context unavailable; violates no-unsafe-cast posture. |
| Stale "0..6" comment — `spiral.ts:1659-1668` | High | `CHAKRA_HEX` now has 8 entries; code correct (`length-1`) but comment misleads. |
| `nodePathIndex` lower bound unclamped — `spiral.ts:1146` | Med | Negative `t` → `undefined` path entry → `.clone()` throw. Not currently triggered. |
| `prefers-reduced-motion` read once — `spiral.ts:2909-2911` | Med | No `change` listener; toggling mid-session has no effect (a11y). |
| Mixed 0-based `i` vs 1-based `node.id` indexing — `spiral.ts:711`, `icon-worlds.ts:239` | Med | Color (by `i`) and universe/world (by `id`) desync silently if a partial/reordered node list is passed to `initSpiral`. |
| `?nav=` vs `?variant=` docs divergence — `Base.astro:496-507`, `SpiralIsland.astro:66-67` | High | CLAUDE.md documents `?variant=pillar-first\|spiral-first`, but the layout reads `?nav=` for that while SpiralIsland reads `?variant=` for `stars\|symbols`. Plus FOUC on the `?nav=` swap. |
| Scroll progress divide-by-zero + leaked listeners — `VerticalSpine.astro:42,55-66` | Med | `winScroll/height` → `NaN%` on short pages; scroll/resize listeners never removed. |
| Disabled card is still an anchor — `PillarCard.astro:12-13` | High | `<a href={undefined}>` + `aria-disabled` is not keyboard-focusable and `aria-disabled` doesn't block activation; should be a non-anchor (SpiralFallback does this right). |
| Content/data hardcoded in components — `CycleAwareness.astro:9-65`, `Base.astro:9-13` (`PHASE_ENTRY`) | Med | Branch copy, cycle phase data, per-phase node URLs (`/nodes/1,6,11`) inlined (M2 + desync risk). |
| Inline `onload` null deref — `QuizEmbed.astro:24` | Med | `getElementById('quiz-loading')` dereferenced without guard. |
| Scoring weight skew — `quiz.config.ts:149-152` | Med | Q5 answer 4 bundles six themes vs three elsewhere → disproportionate weight toward nodes 4/13. |
| Price regex low-end + $300 default — `hydration.config.ts:169-173`; PureHome always 100% — `:155-157` | Med | Takes low end of a range, defaults to fictitious `$300` on no match; "All major contaminants" tier always scores 100% regardless of profile. |
| Stale Keystatic comment — `personas.ts:9` | Low | References a tool removed in the migration. |
| Hardcoded CF accountId — `.github/workflows/ci.yml:62` | Low | Identifier (not a secret) inlined; M2-adjacent. |
| Library entries point at gitignorable artifacts — `lib/docs-library.ts:202-219` | Low | `single-file` entries reference root `*.txt`/`session-ses_*.md`; if removed, those library cards render empty. |
| Misc a11y | Med–Low | Breadcrumbs missing `aria-current`; VideoEmbed generic `title="Video"`/missing `allow`; dual citation-tooltip systems (CSS + JS) double-fire on `<Citation>` pages. |

---

## Verified as Non-Issues

- Quiz Q3-Q5 theme tags match `hub.config` exactly; all `{placeholder}` tokens are substituted; no function values in serialized copy.
- getStaticPaths across all dynamic routes return valid params; node-5 → `/water/` exclusion is intentional.
- Counts line up: 13 nodes / 4 pillars / 6 branches / 13 EnvVars / 91 lens bindings; `chainsFor`/`viewThroughLens` never return undefined.
- `compose.ts` is genuinely pure; `library-manifest.json` is valid; section `type` literals match the renderer switch.
- Quiz result-before-network + capture fire-and-forget is the documented intended UX invariant — not a bug.
- The empty-string vacuums (`ghl.quizFormUrl`, `anespa`/`k8` `affiliateUrl`) **are** correctly tracked in `TRACKED_VACUUMS` (GH#58, GH#49) — they do not fail the build. ✓

---

## Suggested Triage Order

1. Decide intent of the email gate (`EmailGate.astro`) — if it's meant to gate, content must not be server-rendered into the DOM; if it's a soft prompt, document it so it isn't mistaken for protection.
2. Remove the hardcoded personal email + live affiliate URLs from source into env/config (M2).
3. Decide the spiral lifecycle story — either adopt ViewTransitions (and add `astro:page-load` rebind) or drop the dead `astro:before-swap` cleanup and guard the 0-height/init-throw paths.
4. Harden the build gates — make `test.mjs` independent of build-only artifacts (or generate them in a pretest step) and replace the vacuum-gate tier regex with a parse that can't skip a `}`-nested tier.

*Coverage-first audit — findings are unfiltered by design. A separate verification step should confirm and rank before any are actioned.*
