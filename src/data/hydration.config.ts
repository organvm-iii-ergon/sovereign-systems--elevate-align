/**
 * Hydration Node — Data Model
 *
 * Defines the type system for the 6-step hydration funnel.
 * Phase A uses demo data; Phase B connects to EWG API.
 *
 * @see docs/superpowers/intakes/2026-04-03-maddie-hydration-node-funnel-spec.md
 * @see docs/decisions/2026-04-04-water-hub-placement.md
 */

// --- Step 1: Contaminant Lookup ---

export interface Contaminant {
  name: string;
  legalLimit: number | null;
  healthGuideline: number | null;
  detected: number;
  unit: string;
  exceedsLegal: boolean;
  exceedsHealth: boolean;
  effects: ContaminantEffect[];
}

export type ContaminantEffect =
  | 'hydration'
  | 'skin'
  | 'detox'
  | 'cellular'
  | 'hormonal'
  | 'neurological'
  | 'reproductive'
  | 'carcinogenic';

export interface WaterReport {
  zipCode: string;
  waterSource: WaterSource;
  utilityName: string;
  contaminants: Contaminant[];
  totalContaminants: number;
  exceedingHealth: number;
  exceedingLegal: number;
  lastUpdated: string;
}

export type WaterSource = 'tap' | 'well' | 'bottled' | 'unsure';

// --- Step 1: Cost Comparison ---

export interface BottledWaterCost {
  brand: string;
  perBottle: number;
  perCase: number;
  perGallon: number;
  source: string;
  monthlyEstimate: number;
  yearlyEstimate: number;
}

// --- Step 2: Filter Recommendations ---

export interface FilterTier {
  id: string;
  name: string;
  brand: string;
  position: FilterPosition;
  priceRange: string;
  features: string[];
  removes: string[];
  bestFor: string;
  affiliateUrl: string;
  image?: string;
}

export type FilterPosition =
  | 'entry'
  | 'mid-tier'
  | 'high-end'
  | 'upgrade-spa'
  | 'upgrade-ionizer';

export interface FilterRecommendation {
  tier: FilterTier;
  matchScore: number;
  reason: string;
  monthlySavings: number;
  yearlyComparison: {
    bottledWater: number;
    thisFilter: number;
    savings: number;
  };
}

// --- Step 3: Health Survey ---

export interface HealthSurveyQuestion {
  id: string;
  question: string;
  category: 'hydration' | 'detox' | 'fertility' | 'energy' | 'skin';
  options: SurveyOption[];
}

export interface SurveyOption {
  label: string;
  value: number;
  flag?: string;
}

// --- Step Configuration ---

export type StepId = 1 | 2 | 3 | 4 | 5 | 6;

export interface FunnelStep {
  id: StepId;
  title: string;
  subtitle: string;
  access: 'free' | 'email-gated' | 'post-conversion';
  color: string;
  icon: string;
}

export interface HydrationConfig {
  steps: FunnelStep[];
  filterTiers: FilterTier[];
  costData: BottledWaterCost[];
}

// --- Filter Matching Engine ---

interface MatchContaminant {
  name: string;
  exceedsHealth: boolean;
  exceedsLegal: boolean;
}

/**
 * Score each filter tier against a user's contaminant profile.
 * Returns sorted recommendations (best match first) with cost comparison.
 */
export function matchFiltersToContaminants(
  contaminants: MatchContaminant[],
  filters: FilterTier[] = hydrationConfig.filterTiers,
  avgBottledMonthly = 65,
): FilterRecommendation[] {
  const concerning = contaminants.filter((c) => c.exceedsHealth || c.exceedsLegal);

  return filters.map((tier) => {
    const removesLower = tier.removes.map((r) => r.toLowerCase());
    let matched = 0;
    for (const c of concerning) {
      const cLower = c.name.toLowerCase();
      if (removesLower.some((r) => cLower.includes(r) || r.includes('all major'))) {
        matched++;
      }
    }

    const matchScore = concerning.length > 0 ? Math.round((matched / concerning.length) * 100) : 50;

    // Extract first number from range like "$150–$300" → 150
    const priceMatch = tier.priceRange.match(/[\d,]+/);
    const priceNum = priceMatch ? parseInt(priceMatch[0].replace(/,/g, ''), 10) : 300;
    const monthlyFilterCost = priceNum / 36; // amortize over 3 years
    const yearlySavings = avgBottledMonthly * 12 - monthlyFilterCost * 12;

    const reason =
      matchScore >= 80
        ? `Removes ${matched} of ${concerning.length} flagged contaminants in your area`
        : matchScore >= 50
          ? `Covers key contaminants — good starting point for your profile`
          : `Targeted solution — best for ${tier.bestFor.toLowerCase()}`;

    return {
      tier,
      matchScore,
      reason,
      monthlySavings: Math.round(avgBottledMonthly - monthlyFilterCost),
      yearlyComparison: {
        bottledWater: Math.round(avgBottledMonthly * 12),
        thisFilter: Math.round(monthlyFilterCost * 12),
        savings: Math.round(yearlySavings),
      },
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// --- Demo Data (Phase A) ---

export const hydrationConfig: HydrationConfig = {
  steps: [
    {
      id: 1,
      title: "What's In Your Water?",
      subtitle: 'Enter your ZIP code to see what contaminants are in your local water supply.',
      access: 'free',
      color: '#119a9e',
      icon: '💧',
    },
    {
      id: 2,
      title: 'Your Personalized Filter Match',
      subtitle: 'Get tiered filter recommendations matched to your specific contaminants.',
      access: 'email-gated',
      color: '#c9a96e',
      icon: '🔬',
    },
    {
      id: 3,
      title: 'Your Water & Health Profile',
      subtitle: 'Optional deeper assessment — hydration, detox, fertility, energy, skin.',
      access: 'post-conversion',
      color: '#3dbfc4',
      icon: '🌿',
    },
    {
      id: 4,
      title: 'See It In Action',
      subtitle: 'Personalized demo with a water specialist.',
      access: 'post-conversion',
      color: '#8b5cf6',
      icon: '🎯',
    },
    {
      id: 5,
      title: 'Your Full Report',
      subtitle: 'Emailed summary with contaminants, recommendations, and cost savings.',
      access: 'post-conversion',
      color: '#f59e0b',
      icon: '📊',
    },
    {
      id: 6,
      title: 'Deep Dive',
      subtitle: 'Cellular hydration, detox pathways, and advanced wellness resources.',
      access: 'post-conversion',
      color: '#ec4899',
      icon: '🔮',
    },
  ],

  filterTiers: [
    {
      id: 'ionfaucet',
      name: 'IonFaucet',
      brand: 'IonFaucet',
      position: 'entry',
      priceRange: '$150–$300',
      features: ['Point-of-use', 'Easy install', 'No plumbing changes'],
      removes: ['Chlorine', 'Lead', 'Sediment', 'VOCs'],
      bestFor: 'Renters or single-faucet solution',
      affiliateUrl: 'https://ionfaucet.com/maddie-spiral',
    },
    {
      id: 'multipure',
      name: 'Multipure',
      brand: 'Multipure',
      position: 'mid-tier',
      priceRange: '$400–$800',
      features: ['Whole house option', 'NSF certified', 'Carbon block'],
      removes: ['Chlorine', 'Lead', 'Mercury', 'Arsenic', 'PFAS', 'Pharmaceuticals'],
      bestFor: 'Families wanting broader protection',
      affiliateUrl: 'https://www.multipure.com/maddie-wired',
    },
    {
      id: 'purehome',
      name: 'PureHome',
      brand: 'PureHome',
      position: 'high-end',
      priceRange: '$2,000–$5,000',
      features: ['Whole house', 'Multi-stage', 'Professional install'],
      removes: ['All major contaminants', 'Bacteria', 'Viruses', 'Microplastics'],
      bestFor: 'Homeowners wanting complete water sovereignty',
      affiliateUrl: 'https://purehome.co/maddie',
    },
    {
      id: 'anespa',
      name: 'Anespa DX',
      brand: 'Enagic',
      position: 'upgrade-spa',
      priceRange: '$2,890',
      features: ['Shower/bath', 'Hot spring minerals', 'Removes chlorine'],
      removes: ['Chlorine', 'Sediment'],
      bestFor: 'Skin health, spa-quality water at home',
      affiliateUrl: '',
    },
    {
      id: 'k8',
      name: 'K8 Kangen',
      brand: 'Enagic',
      position: 'upgrade-ionizer',
      priceRange: '$4,980',
      features: ['8 platinum plates', 'pH 2.5–11.5', 'Medical-grade'],
      removes: ['Chlorine'],
      bestFor: 'Ionized/alkaline water, advanced wellness',
      affiliateUrl: '',
    },
  ],

  costData: [
    {
      brand: 'Store brand (Safeway)',
      perBottle: 1.29,
      perCase: 5.99,
      perGallon: 1.19,
      source: 'Safeway 2026 shelf prices',
      monthlyEstimate: 47.60,
      yearlyEstimate: 571.20,
    },
    {
      brand: 'Fiji',
      perBottle: 2.49,
      perCase: 29.99,
      perGallon: 9.55,
      source: 'Safeway 2026 shelf prices',
      monthlyEstimate: 74.70,
      yearlyEstimate: 896.40,
    },
    {
      brand: 'Essentia',
      perBottle: 2.79,
      perCase: 27.99,
      perGallon: 10.68,
      source: 'Safeway 2026 shelf prices',
      monthlyEstimate: 83.70,
      yearlyEstimate: 1004.40,
    },
  ],
};
