export interface Pillar {
  name: string;
  slug: string;
  emoji: string;
  tagline: string;
  color: string;
  url: string;
  status: 'live' | 'coming-soon';
  order: number;
  citationIds?: string[];
}

export interface Branch {
  name: string;
  slug: string;
  emoji: string;
  order: number;
  citationIds: string[];
  ghlUrl?: string;
}

export type Phase = 'ELEVATE' | 'ALIGN' | 'UNLOCK';

/**
 * EnvVar — the immutable metaphysical substrate beneath each spiral node.
 * Surface names (Maddie's "Feel Good First", etc.) are mutable bindings;
 * the EnvVar is the True Name keyed to the icon shape and the node's
 * cross-cultural lineage. Used by `naming-chains.ts` to render the
 * `/lineage/[envvar]` view that shows the same essence named through
 * different traditions (Greek-classical, Sanskrit-Vedic, Egyptian,
 * Christian-mystical, Jungian, modern-wellness, etc.).
 */
export type EnvVar =
  | 'PYR'        // 1 — Sunburst — primordial fire / radiance
  | 'OCULUS'     // 2 — Eye — witness / observation
  | 'DYAD'       // 3 — Yin-Yang — polarity / pair
  | 'PYRAMIS'    // 4 — Triangle — pyramid / ascending volume
  | 'HYDOR'      // 5 — Teardrop — water / source
  | 'MANDORLA'   // 6 — Vesica Piscis — overlap / sacred gate
  | 'KENOSIS'    // 7 — Crescent — emptying / receptive vessel
  | 'SHATKONA'   // 8 — Hexagram — six-pointed union
  | 'PADMA'      // 9 — Lotus — bloom / unfolding
  | 'BODHI'      // 10 — Eye-in-Triangle — awakened seeing
  | 'TETRAD'     // 11 — Solar Cross — fourfold cardinal order
  | 'OKTAEDRON'  // 12 — Octahedron — eightfold crystalline form
  | 'ANKH';      // 13 — Ankh — eternal life / continuance

export interface SpiralNode {
  id: number;
  name: string;
  phase: Phase;
  pillarSlug: string;
  emoji: string;
  tagline: string;
  color: string;
  status: 'live' | 'locked';
  url: string;
  /** Immutable substrate identity — see EnvVar type above. */
  envVar: EnvVar;
}

export interface HubConfig {
  name: string;
  tagline: string;
  pillars: Pillar[];
  nodes: SpiralNode[];
  branches: Branch[];
  domains: {
    hub: string;
    water: string;
    business: string;
  };
  ghl: {
    quizFormUrl: string;
    productUrl: string;
  };
}

/**
 * VesselMode — how spiral nodes render their substrate.
 *
 *  invisible       — mesh hidden, particle field is the visual identity
 *                    (current ship; preserves Maddie's 2026-04-25 feedback
 *                    "the container exterior is only a guide and is to be removed")
 *  visible         — mesh shown opaquely, particle field suppressed
 *  refracted-star  — mesh shown with stars-variant transmission/IOR/dispersion
 *                    material; particle field suppressed; prismatic look
 *  hybrid          — mesh shown AND particle field at 30% — both layered
 */
export type VesselMode = 'invisible' | 'visible' | 'refracted-star' | 'hybrid';

/**
 * NavVariant — top-of-page navigation surface.
 *
 *  pillar-first  — current default; nav links to /pillars/:slug + /water/ + /business/
 *  spiral-first  — alternate; nav links directly to /nodes/1..13 sequence
 */
export type NavVariant = 'pillar-first' | 'spiral-first';

export interface UIConfig {
  spiralVesselMode: VesselMode;
  navVariant: NavVariant;
}

/**
 * Runtime UI defaults. Both flags can be overridden at request time via
 * querystring (?vessel=visible, ?nav=spiral-first) for live A/B comparison
 * without a redeploy. The defaults below are the ship state — change here
 * to promote a variant to default after Maddie picks.
 */
export const ui: UIConfig = {
  spiralVesselMode: 'invisible',
  navVariant: 'pillar-first',
};

export const config: HubConfig = {
  name: 'Sovereign Systems Spiral',
  tagline: 'Rebuilding life from the foundation up \u2014 stabilizing the body, strengthening inner authority, refining identity, and installing financial systems.',
  pillars: [
    {
      name: 'Physical Sovereignty',
      slug: 'physical',
      emoji: '\u{1F30A}',
      tagline: 'Control your inputs. Stabilize your body.',
      color: '#119a9e',
      url: '/pillars/physical',
      status: 'live',
      order: 1,
      citationIds: ['B-01', 'B-78', 'S-14', 'S-19']
    },
    {
      name: 'Inner Sovereignty',
      slug: 'inner',
      emoji: '\u{1F54A}',
      tagline: 'Control your internal state.',
      color: '#8cc5d3',
      url: '/pillars/inner',
      status: 'live',
      order: 2,
      citationIds: ['S-36', 'S-39', 'S-44', 'B-79', 'B-80', 'B-87', 'B-91']
    },
    {
      name: 'Identity Sovereignty',
      slug: 'identity',
      emoji: '\u2728',
      tagline: 'Control your self-expression.',
      color: '#c9a96e',
      url: '/pillars/identity',
      status: 'live',
      order: 3,
      citationIds: ['S-61', 'S-62', 'S-68', 'S-78', 'B-104', 'B-105', 'B-106']
    },
    {
      name: 'Financial Sovereignty',
      slug: 'financial',
      emoji: '\u{1F4A0}',
      tagline: 'Control your income and systems.',
      color: '#3dbfc4',
      url: '/business/',
      status: 'live',
      order: 4,
      citationIds: ['S-86', 'S-88', 'S-90', 'B-129', 'B-133', 'B-134']
    },
  ],
  nodes: [
    // ELEVATE: body → Physical Sovereignty (nodes 1-5)
    { id: 1,  name: 'Feel Good First',           phase: 'ELEVATE', pillarSlug: 'physical',  emoji: '✦',  tagline: 'Feeling good is the baseline — not the bonus.',                              color: '#119a9e', status: 'live',   url: '/nodes/1',  envVar: 'PYR'       },
    { id: 2,  name: 'Awareness',                 phase: 'ELEVATE', pillarSlug: 'physical',  emoji: '🧬', tagline: 'Your body is always speaking — are you listening?',                          color: '#119a9e', status: 'live',   url: '/nodes/2',  envVar: 'OCULUS'    },
    { id: 3,  name: 'Regulation',                phase: 'ELEVATE', pillarSlug: 'physical',  emoji: '⚖️', tagline: 'Balance your energy, calm your system.',                                    color: '#119a9e', status: 'live',   url: '/nodes/3',  envVar: 'DYAD'      },
    { id: 4,  name: 'Elevate',                   phase: 'ELEVATE', pillarSlug: 'physical',  emoji: '🛡️', tagline: 'Feeling like shit is not normal — when you know better, you do better.',     color: '#119a9e', status: 'live',   url: '/nodes/4',  envVar: 'PYRAMIS'   },
    { id: 5,  name: 'Root Healing',              phase: 'ELEVATE', pillarSlug: 'physical',  emoji: '🌊', tagline: 'Optimize your absorption & energy flow.',                                   color: '#119a9e', status: 'live',   url: '/water/',   envVar: 'HYDOR'     },
    // ALIGN: mind + life → Inner & Identity Sovereignty (nodes 6-10)
    { id: 6,  name: 'Responsibility (with Love)', phase: 'ALIGN',  pillarSlug: 'inner',     emoji: '🕊️', tagline: 'Own your choices, gently.',                                                color: '#8cc5d3', status: 'locked', url: '/nodes/6',  envVar: 'MANDORLA'  },
    { id: 7,  name: 'Unbecoming',                phase: 'ALIGN',   pillarSlug: 'inner',     emoji: '🌙', tagline: 'Reclaim / Remember / Release.',                                            color: '#8cc5d3', status: 'locked', url: '/nodes/7',  envVar: 'KENOSIS'   },
    { id: 8,  name: 'Alignment',                 phase: 'ALIGN',   pillarSlug: 'inner',     emoji: '🔮', tagline: 'See clearly, act intentionally.',                                           color: '#8cc5d3', status: 'locked', url: '/nodes/8',  envVar: 'SHATKONA'  },
    { id: 9,  name: 'The Becoming',              phase: 'ALIGN',   pillarSlug: 'identity',  emoji: '✨', tagline: 'Know your power — your choices create a life that fuels you.',              color: '#c9a96e', status: 'locked', url: '/nodes/9',  envVar: 'PADMA'     },
    { id: 10, name: 'Awakening',                 phase: 'ALIGN',   pillarSlug: 'identity',  emoji: '📣', tagline: 'I\'m awake, I have all this power — now what?',                             color: '#c9a96e', status: 'locked', url: '/nodes/10', envVar: 'BODHI'     },
    // UNLOCK: integration + freedom → Identity & Financial Sovereignty (nodes 11-13)
    { id: 11, name: 'Integrate',                 phase: 'UNLOCK',  pillarSlug: 'identity',  emoji: '🚧', tagline: 'Pull it all together; your wholeness is the work.',                        color: '#c9a96e', status: 'locked', url: '/nodes/11', envVar: 'TETRAD'    },
    { id: 12, name: 'Authenticate',              phase: 'UNLOCK',  pillarSlug: 'financial', emoji: '💠', tagline: 'Be YOU — loudly, proudly, unapologetically.',                               color: '#3dbfc4', status: 'locked', url: '/nodes/12', envVar: 'OKTAEDRON' },
    { id: 13, name: 'Unlock',                    phase: 'UNLOCK',  pillarSlug: 'financial', emoji: '⚡', tagline: 'Level up fully — your gifts, flow, and freedom amplified.',                 color: '#3dbfc4', status: 'locked', url: '/nodes/13', envVar: 'ANKH'      },
  ],
  branches: [
    { 
      name: 'Gut + Hormones', 
      slug: 'gut-hormones', 
      emoji: '\u{1F33F}', 
      order: 1,
      citationIds: ['B-13', 'B-14', 'B-15', 'B-16', 'B-17', 'B-18', 'B-19', 'B-20', 'S-16']
    },
    { 
      name: 'Fertility', 
      slug: 'fertility', 
      emoji: '\u{1F90D}', 
      order: 2,
      citationIds: ['B-21', 'B-22', 'B-23', 'B-24', 'B-25', 'B-26', 'B-27', 'B-28', 'B-29', 'B-01']
    },
    { 
      name: 'Athletic Performance', 
      slug: 'athletic', 
      emoji: '\u{1F4AA}', 
      order: 3,
      citationIds: ['B-38', 'B-39', 'B-40', 'B-41', 'B-42', 'B-43', 'B-44', 'B-45']
    },
    { 
      name: 'Inflammation / Autoimmune', 
      slug: 'autoimmune', 
      emoji: '\u{1F525}', 
      order: 4,
      citationIds: ['B-30', 'B-31', 'B-32', 'B-33', 'B-34', 'B-35', 'B-36', 'B-37']
    },
    { 
      name: 'Cancer Support', 
      slug: 'cancer-support', 
      emoji: '\u{1F397}', 
      order: 5,
      citationIds: ['B-46', 'B-47', 'B-48', 'B-49', 'B-50', 'B-51', 'B-52', 'B-53']
    },
    { 
      name: 'Sustainability / Savings', 
      slug: 'sustainability', 
      emoji: '\u{1F30E}', 
      order: 6,
      citationIds: ['S-13', 'S-17', 'S-19']
    },
  ],
  domains: {
    hub: 'elevatealign.com',
    water: 'stopdrinkingacid.com',
    business: 'eaucohub.com',
  },
  ghl: {
    quizFormUrl: '',
    productUrl: 'https://stopdrinkingacid.com',
  },
};
