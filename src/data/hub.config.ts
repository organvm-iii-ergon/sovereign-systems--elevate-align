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
  citationIds: string[];
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
    quizFormUrl: 'https://placeholder.ghl.com/form/quiz',
    productUrl: 'https://stopdrinkingacid.com',
  },
};
