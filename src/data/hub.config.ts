export interface Pillar {
  name: string;
  slug: string;
  emoji: string;
  tagline: string;
  color: string;
  url: string;
  status: 'live' | 'coming-soon';
  order: number;
}

export interface Branch {
  name: string;
  slug: string;
  emoji: string;
  order: number;
}

export interface HubConfig {
  name: string;
  tagline: string;
  pillars: Pillar[];
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
      url: '/water/',
      status: 'live',
      order: 1,
    },
    {
      name: 'Inner Sovereignty',
      slug: 'inner',
      emoji: '\u{1F54A}',
      tagline: 'Control your internal state.',
      color: '#8cc5d3',
      url: '/pillars/inner',
      status: 'coming-soon',
      order: 2,
    },
    {
      name: 'Identity Sovereignty',
      slug: 'identity',
      emoji: '\u2728',
      tagline: 'Control your self-expression.',
      color: '#c9a96e',
      url: '/pillars/identity',
      status: 'coming-soon',
      order: 3,
    },
    {
      name: 'Financial Sovereignty',
      slug: 'financial',
      emoji: '\u{1F4A0}',
      tagline: 'Control your income and systems.',
      color: '#3dbfc4',
      url: '/business/',
      status: 'coming-soon',
      order: 4,
    },
  ],
  branches: [
    { name: 'Gut + Hormones', slug: 'gut-hormones', emoji: '\u{1F33F}', order: 1 },
    { name: 'Fertility', slug: 'fertility', emoji: '\u{1F90D}', order: 2 },
    { name: 'Athletic Performance', slug: 'athletic', emoji: '\u{1F4AA}', order: 3 },
    { name: 'Inflammation / Autoimmune', slug: 'autoimmune', emoji: '\u{1F525}', order: 4 },
    { name: 'Cancer Support', slug: 'cancer-support', emoji: '\u{1F397}', order: 5 },
    { name: 'Sustainability / Savings', slug: 'sustainability', emoji: '\u{1F30E}', order: 6 },
  ],
  domains: {
    hub: 'elevatealign.com',
    water: 'stopdrinkingacid.com',
    business: 'eaucohub.com',
  },
  ghl: {
    quizFormUrl: 'https://placeholder.ghl.com/form/quiz',
    productUrl: 'https://stopdrinkingacid.com',
  },
};
