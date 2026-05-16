/**
 * Spiral version manifest — chronological record of every major visual
 * aesthetic of the Sovereign Systems Spiral.
 *
 * Source of truth: HANDOFF.md and docs/timelines/2026-05-01-spiral-evolution-timeline.md
 * for V1–V8; docs/spiral-experiments/<batch>/README.md for experiment batches.
 *
 * Status semantics:
 *   - 'live'             — currently deployed on the production site
 *   - 'playable'         — self-contained HTML snapshot served from public/
 *   - 'snapshot-pending' — version exists in git history but has no playable
 *                          snapshot yet. Source link points to the commit.
 *
 * To add a new version: append to SPIRAL_VERSIONS chronologically.
 * To promote a snapshot-pending entry: build the version at its commit,
 * copy the output to public/spiral-versions/<id>/, set iframeSrc and
 * status='playable'.
 */

export type SpiralVersionStatus = 'live' | 'playable' | 'snapshot-pending';
export type SpiralVersionCategory =
  | 'production-historical' // shipped on the live site, now superseded
  | 'production-live'       // currently deployed
  | 'experiment'            // lab artifact, not in live site
  ;

export interface SpiralVersion {
  /** Stable identifier; used in URL slugs and as React-key equivalent. */
  id: string;
  /** Display name shown in the timeline card header. */
  name: string;
  /** ISO date for chronological sort and display. */
  date: string;
  category: SpiralVersionCategory;
  status: SpiralVersionStatus;
  /** Git commit SHA where this version is the HEAD of spiral.ts (where known). */
  commit?: string;
  /** Short caption beneath the version name. */
  description: string;
  /** Path the iframe loads. For 'playable' or 'live' only. */
  iframeSrc?: string;
  /** Optional context note (e.g. "Never deployed — CI broken Apr 19"). */
  notes?: string;
}

export const SPIRAL_VERSIONS: SpiralVersion[] = [
  {
    id: 'v1-round1-lightening',
    name: 'V1 — Round 1 Lightening',
    date: '2026-04-23',
    category: 'production-historical',
    status: 'snapshot-pending',
    commit: 'cdd046e',
    description: 'First lightening pass on the spiral after the Apr 21 3D-helix realignment.',
    notes: 'Never deployed — CI broken since Apr 19. Lived only in local dev until V2.',
  },
  {
    id: 'v2-chakra-stars',
    name: 'V2 — Chakra-Colored Stars',
    date: '2026-04-25',
    category: 'production-historical',
    status: 'snapshot-pending',
    commit: '02c90a2',
    description: '5-point stars with chakra-aligned color spectrum, bottom-to-top.',
  },
  {
    id: 'v3-helix-compressed',
    name: 'V3 — Helix Compressed, Framed for Fold',
    date: '2026-04-25',
    category: 'production-historical',
    status: 'snapshot-pending',
    commit: '845fcaf',
    description: 'Background matches --color-ocean-900, helix height 14, camera (0,0,18), canvas height calc(100vh-240px).',
  },
  {
    id: 'v4-dual-variants',
    name: 'V4 — Dual Variants (Sacred Symbols + Refracted Stars)',
    date: '2026-04-25',
    category: 'production-historical',
    status: 'snapshot-pending',
    commit: 'b8d105b',
    description: 'Two simultaneous aesthetics: 13 sacred symbols (Variant A) and generative refracted-light stars (Variant B).',
    notes: 'Maddie: "IM SO OBSESSED !!!!"',
  },
  {
    id: 'v5-themed-solar-systems',
    name: 'V5 — Themed Solar Systems Inside Each Shape',
    date: '2026-04-25',
    category: 'production-historical',
    status: 'snapshot-pending',
    commit: 'd8b34b6',
    description: 'Each node holds a contained universe — phase states, biology, physics govern its materia. 10 sub-versions (V5.1–V5.10) in 3.5 hours iterating the containment physics.',
  },
  {
    id: 'v6-envvar-substrate',
    name: 'V6 — EnvVar / IconWorld Substrate',
    date: '2026-04-25',
    category: 'production-historical',
    status: 'snapshot-pending',
    commit: '447ab84',
    description: 'IconWorld type + 13-entry table + EnvVar substrate binding 13 nodes to True Names. NAMING_CHAINS multi-lens lineage data added.',
  },
  {
    id: 'v7-mathematical-primitives',
    name: 'V7 — Mathematical Primitives Generative Geometry',
    date: '2026-04-26',
    category: 'production-historical',
    status: 'snapshot-pending',
    commit: '671818b',
    description: 'Proposal C: 13 sacred-geometry-primitives + 7 lens modulations wired into the spiral render loop.',
  },
  {
    id: 'v8-unique-universes',
    name: 'V8 — Unique Universes via Lineage × Lenses × Math',
    date: '2026-04-26',
    category: 'production-historical',
    status: 'snapshot-pending',
    commit: '66a6f0b',
    description: 'Planets re-enabled (2–6 per node), per-planet lineage RNG, lens-driven icon geometry from 7-tradition sequence, creation/destruction duality.',
  },
  // Live current
  {
    id: 'live-current',
    name: 'LIVE — Current Production Spiral',
    date: '2026-05-16',
    category: 'production-live',
    status: 'live',
    description: 'V8+ with chakra-color nodes (chakraColorForNode at spiral.ts:1248), IconWorlds physics, hybrid vessel-mode default.',
    iframeSrc: '/',
    notes: 'Always reflects the current deployment. Use the homepage spiral as your reference for "what visitors see now."',
  },
  // 2026-05-16 Confluence × Apophatic experiment batch (parallel lab — not in live site)
  {
    id: 'exp-mystical-canvas-v1',
    name: 'Lab — Mystical Energy Canvas v1',
    date: '2026-05-16',
    category: 'experiment',
    status: 'playable',
    description: 'Minimal seed render. Smallest, simplest version of the canvas series.',
    iframeSrc: '/spiral-experiments/2026-05-16-confluence-apophatic/mystical_energy_canvas.html',
  },
  {
    id: 'exp-mystical-canvas-v2',
    name: 'Lab — Mystical Energy Canvas v2',
    date: '2026-05-16',
    category: 'experiment',
    status: 'playable',
    description: 'More developed: added motion and more elements.',
    iframeSrc: '/spiral-experiments/2026-05-16-confluence-apophatic/mystical_energy_canvas (1).html',
  },
  {
    id: 'exp-mystical-canvas-v3',
    name: 'Lab — Mystical Energy Canvas v3',
    date: '2026-05-16',
    category: 'experiment',
    status: 'playable',
    description: 'Richer particle system.',
    iframeSrc: '/spiral-experiments/2026-05-16-confluence-apophatic/mystical_energy_canvas (2).html',
  },
  {
    id: 'exp-mystical-canvas-v4',
    name: 'Lab — Mystical Energy Canvas v4',
    date: '2026-05-16',
    category: 'experiment',
    status: 'playable',
    description: 'Most developed of the base canvas series.',
    iframeSrc: '/spiral-experiments/2026-05-16-confluence-apophatic/mystical_energy_canvas (3).html',
  },
  {
    id: 'exp-remixed-v1',
    name: 'Lab — Remixed (d00fdcac) v1',
    date: '2026-05-16',
    category: 'experiment',
    status: 'playable',
    description: 'Remix variant: different aesthetic, same seed image.',
    iframeSrc: '/spiral-experiments/2026-05-16-confluence-apophatic/remixed-d00fdcac.html',
  },
  {
    id: 'exp-remixed-v2',
    name: 'Lab — Remixed (d00fdcac) v2',
    date: '2026-05-16',
    category: 'experiment',
    status: 'playable',
    description: 'Remix iteration.',
    iframeSrc: '/spiral-experiments/2026-05-16-confluence-apophatic/remixed-d00fdcac (1).html',
  },
  {
    id: 'exp-confluence-kataphatic',
    name: 'Lab — Confluence (Kataphatic)',
    date: '2026-05-16',
    category: 'experiment',
    status: 'playable',
    description: 'Implementation of the Confluence philosophy: 6 orbital loops, 12 stations, 144 streaming lanes, dual triads. Every sacred motion made visible.',
    iframeSrc: '/spiral-experiments/2026-05-16-confluence-apophatic/confluence.html',
  },
  {
    id: 'exp-pf005-twelvefold',
    name: 'Lab — PF-005 Twelvefold Confluence',
    date: '2026-05-16',
    category: 'experiment',
    status: 'playable',
    description: 'Alternate kataphatic phrasing — same polarity, different surface.',
    iframeSrc: '/spiral-experiments/2026-05-16-confluence-apophatic/pf-005-twelvefold-confluence.html',
  },
  {
    id: 'exp-apophatic-engine-cell',
    name: 'Lab — Apophatic Engine Cell',
    date: '2026-05-16',
    category: 'experiment',
    status: 'playable',
    description: 'Negative/aniconic counterpart to the Confluence philosophy. Deliberately minimal — refuses image.',
    iframeSrc: '/spiral-experiments/2026-05-16-confluence-apophatic/apophatic-engine-cell.html',
  },
];

/** Reverse-chronological grouping for the viewfinder UI. */
export function versionsGroupedByCategory(): Record<SpiralVersionCategory, SpiralVersion[]> {
  const groups: Record<SpiralVersionCategory, SpiralVersion[]> = {
    'production-live': [],
    'experiment': [],
    'production-historical': [],
  };
  for (const v of SPIRAL_VERSIONS) groups[v.category].push(v);
  return groups;
}
