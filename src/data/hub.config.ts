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
    { id: 1,  name: 'Feel Good First',           phase: 'ELEVATE', pillarSlug: 'physical',  emoji: '✦',  tagline: 'Shift your state first.',                     color: '#119a9e', status: 'live',   url: '/nodes/1'  },
    { id: 2,  name: 'Awareness',                 phase: 'ELEVATE', pillarSlug: 'physical',  emoji: '🧬', tagline: 'See where you are.',                          color: '#119a9e', status: 'live',   url: '/nodes/2'  },
    { id: 3,  name: 'Regulation',                phase: 'ELEVATE', pillarSlug: 'physical',  emoji: '⚖️', tagline: 'Regulate before you optimize.',               color: '#119a9e', status: 'live',   url: '/nodes/3'  },
    { id: 4,  name: 'Elevate',                   phase: 'ELEVATE', pillarSlug: 'physical',  emoji: '🛡️', tagline: 'Rise above the baseline.',                    color: '#119a9e', status: 'live',   url: '/nodes/4'  },
    { id: 5,  name: 'Root Healing',              phase: 'ELEVATE', pillarSlug: 'physical',  emoji: '🌊', tagline: 'Heal from the root. Start with water.',       color: '#119a9e', status: 'live',   url: '/water/'   },
    // ALIGN: mind + life → Inner & Identity Sovereignty (nodes 6-11)
    { id: 6,  name: 'Responsibility (with Love)', phase: 'ALIGN',  pillarSlug: 'inner',     emoji: '🕊️', tagline: 'Own your choices with love.',                 color: '#8cc5d3', status: 'locked', url: '/nodes/6'  },
    { id: 7,  name: 'Unbecoming',                phase: 'ALIGN',   pillarSlug: 'inner',     emoji: '🌙', tagline: 'Release what was never yours.',               color: '#8cc5d3', status: 'locked', url: '/nodes/7'  },
    { id: 8,  name: 'Alignment',                 phase: 'ALIGN',   pillarSlug: 'inner',     emoji: '🔮', tagline: 'Come into coherence.',                        color: '#8cc5d3', status: 'locked', url: '/nodes/8'  },
    { id: 9,  name: 'The Becoming',              phase: 'ALIGN',   pillarSlug: 'identity',  emoji: '✨', tagline: 'Step into who you are.',                      color: '#c9a96e', status: 'locked', url: '/nodes/9'  },
    { id: 10, name: 'Awakening',                 phase: 'ALIGN',   pillarSlug: 'identity',  emoji: '📣', tagline: 'See clearly for the first time.',             color: '#c9a96e', status: 'locked', url: '/nodes/10' },
    { id: 11, name: 'Integrate',                 phase: 'ALIGN',   pillarSlug: 'identity',  emoji: '🚧', tagline: 'Bring it all together.',                      color: '#c9a96e', status: 'locked', url: '/nodes/11' },
    // UNLOCK: freedom → Financial Sovereignty (nodes 12-13)
    { id: 12, name: 'Authenticate',              phase: 'UNLOCK',  pillarSlug: 'financial', emoji: '💠', tagline: 'Prove it to yourself.',                       color: '#3dbfc4', status: 'locked', url: '/nodes/12' },
    { id: 13, name: 'Unlock',                    phase: 'UNLOCK',  pillarSlug: 'financial', emoji: '⚡', tagline: 'Freedom is the final layer.',                 color: '#3dbfc4', status: 'locked', url: '/nodes/13' },
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
