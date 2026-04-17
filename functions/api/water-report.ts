/**
 * EWG Tap Water Report — Cloudflare Pages Function
 *
 * Accepts a ZIP code, fetches contaminant data from EWG's tap water database,
 * and returns a structured WaterReport. Falls back to demo data on failure.
 *
 * Route: POST /api/water-report
 * Body: { zipCode: string, waterSource: string }
 */

interface Env {
  EWG_CACHE?: KVNamespace;
}

interface Contaminant {
  name: string;
  legalLimit: number | null;
  healthGuideline: number | null;
  detected: number;
  unit: string;
  exceedsLegal: boolean;
  exceedsHealth: boolean;
  effects: string[];
}

interface WaterReport {
  zipCode: string;
  waterSource: string;
  utilityName: string;
  contaminants: Contaminant[];
  totalContaminants: number;
  exceedingHealth: number;
  exceedingLegal: number;
  lastUpdated: string;
  isDemo: boolean;
}

const KNOWN_EFFECTS: Record<string, string[]> = {
  'haloacetic acids': ['carcinogenic', 'cellular'],
  'total trihalomethanes': ['carcinogenic', 'cellular'],
  'chromium': ['carcinogenic', 'detox'],
  'arsenic': ['carcinogenic', 'neurological'],
  'lead': ['neurological', 'reproductive', 'cellular'],
  'nitrate': ['reproductive', 'cellular'],
  'radium': ['carcinogenic'],
  'uranium': ['carcinogenic', 'detox'],
  'fluoride': ['neurological', 'hormonal'],
  'chloroform': ['carcinogenic', 'detox'],
  'pfas': ['hormonal', 'reproductive', 'cellular'],
  'pfoa': ['hormonal', 'reproductive', 'carcinogenic'],
  'pfos': ['hormonal', 'reproductive', 'carcinogenic'],
  'manganese': ['neurological'],
  'barium': ['cellular'],
  'chlorine': ['skin', 'hydration'],
  'bromodichloromethane': ['carcinogenic'],
  'dibromochloromethane': ['carcinogenic'],
};

function lookupEffects(contaminantName: string): string[] {
  const lower = contaminantName.toLowerCase();
  for (const [key, effects] of Object.entries(KNOWN_EFFECTS)) {
    if (lower.includes(key)) return effects;
  }
  return ['cellular'];
}

function parseEwgHtml(html: string, zipCode: string, waterSource: string): WaterReport | null {
  const contaminants: Contaminant[] = [];

  // Extract utility name from the page title or header
  const utilityMatch = html.match(/<h1[^>]*class="[^"]*headline[^"]*"[^>]*>([^<]+)</i)
    || html.match(/<title>([^|<]+)/);
  const utilityName = utilityMatch
    ? utilityMatch[1].replace(/\s*\|.*$/, '').replace(/EWG.*$/, '').trim()
    : `Water utility for ${zipCode}`;

  // EWG uses structured data in their contaminant rows
  // Pattern: contaminant name, detected amount, legal limit, health guideline
  const contaminantPattern = /class="[^"]*contaminant[^"]*"[^>]*>[\s\S]*?<(?:span|div)[^>]*class="[^"]*name[^"]*"[^>]*>([^<]+)<[\s\S]*?class="[^"]*amount[^"]*"[^>]*>([^<]*)<[\s\S]*?class="[^"]*legal[^"]*"[^>]*>([^<]*)<[\s\S]*?class="[^"]*health[^"]*"[^>]*>([^<]*)</g;

  let match;
  while ((match = contaminantPattern.exec(html)) !== null) {
    const name = match[1].trim();
    const detected = parseFloat(match[2].replace(/[^\d.]/g, '')) || 0;
    const legalLimit = parseFloat(match[3].replace(/[^\d.]/g, '')) || null;
    const healthGuideline = parseFloat(match[4].replace(/[^\d.]/g, '')) || null;

    contaminants.push({
      name,
      detected,
      legalLimit,
      healthGuideline,
      unit: 'ppb',
      exceedsLegal: legalLimit !== null && detected > legalLimit,
      exceedsHealth: healthGuideline !== null && detected > healthGuideline,
      effects: lookupEffects(name),
    });
  }

  // Fallback: try simpler pattern if structured parsing found nothing
  if (contaminants.length === 0) {
    const simplePattern = /<a[^>]*href="[^"]*contaminant[^"]*"[^>]*>([^<]+)<\/a>[\s\S]*?(\d+\.?\d*)\s*x\s*(?:above|over)\s*(?:health|EWG)/gi;
    while ((match = simplePattern.exec(html)) !== null) {
      const name = match[1].trim();
      const multiplier = parseFloat(match[2]);
      contaminants.push({
        name,
        detected: multiplier,
        legalLimit: null,
        healthGuideline: 1,
        unit: '× guideline',
        exceedsLegal: false,
        exceedsHealth: multiplier > 1,
        effects: lookupEffects(name),
      });
    }
  }

  if (contaminants.length === 0) return null;

  return {
    zipCode,
    waterSource,
    utilityName,
    contaminants,
    totalContaminants: contaminants.length,
    exceedingHealth: contaminants.filter((c) => c.exceedsHealth).length,
    exceedingLegal: contaminants.filter((c) => c.exceedsLegal).length,
    lastUpdated: new Date().toISOString(),
    isDemo: false,
  };
}

const DEMO_REPORT: WaterReport = {
  zipCode: '00000',
  waterSource: 'tap',
  utilityName: 'Sample Municipal Water',
  contaminants: [
    { name: 'Haloacetic acids (HAA5)', detected: 27.7, legalLimit: 60, healthGuideline: 0.1, unit: 'ppb', exceedsLegal: false, exceedsHealth: true, effects: ['carcinogenic', 'cellular'] },
    { name: 'Total trihalomethanes (TTHMs)', detected: 49.2, legalLimit: 80, healthGuideline: 0.3, unit: 'ppb', exceedsLegal: false, exceedsHealth: true, effects: ['carcinogenic', 'cellular'] },
    { name: 'Chromium (hexavalent)', detected: 0.42, legalLimit: 100, healthGuideline: 0.01, unit: 'ppb', exceedsLegal: false, exceedsHealth: true, effects: ['carcinogenic', 'detox'] },
    { name: 'Chloroform', detected: 22.4, legalLimit: null, healthGuideline: 0.8, unit: 'ppb', exceedsLegal: false, exceedsHealth: true, effects: ['carcinogenic', 'detox'] },
    { name: 'Bromodichloromethane', detected: 8.9, legalLimit: null, healthGuideline: 0.3, unit: 'ppb', exceedsLegal: false, exceedsHealth: true, effects: ['carcinogenic'] },
    { name: 'Dibromochloromethane', detected: 5.1, legalLimit: null, healthGuideline: 0.4, unit: 'ppb', exceedsLegal: false, exceedsHealth: true, effects: ['carcinogenic'] },
    { name: 'Nitrate', detected: 1.8, legalLimit: 10000, healthGuideline: 0.14, unit: 'ppb', exceedsLegal: false, exceedsHealth: true, effects: ['reproductive', 'cellular'] },
    { name: 'Fluoride', detected: 700, legalLimit: 4000, healthGuideline: null, unit: 'ppb', exceedsLegal: false, exceedsHealth: false, effects: ['neurological', 'hormonal'] },
    { name: 'Barium', detected: 34, legalLimit: 2000, healthGuideline: 700, unit: 'ppb', exceedsLegal: false, exceedsHealth: false, effects: ['cellular'] },
    { name: 'Manganese', detected: 2.1, legalLimit: null, healthGuideline: null, unit: 'ppb', exceedsLegal: false, exceedsHealth: false, effects: ['neurological'] },
    { name: 'Chlorine', detected: 1200, legalLimit: 4000, healthGuideline: null, unit: 'ppb', exceedsLegal: false, exceedsHealth: false, effects: ['skin', 'hydration'] },
    { name: 'Radium (-226 & -228)', detected: 0.8, legalLimit: 5, healthGuideline: 0.05, unit: 'pCi/L', exceedsLegal: false, exceedsHealth: true, effects: ['carcinogenic'] },
  ],
  totalContaminants: 12,
  exceedingHealth: 8,
  exceedingLegal: 0,
  lastUpdated: new Date().toISOString(),
  isDemo: true,
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = (await context.request.json()) as {
      zipCode?: string;
      waterSource?: string;
    };

    const zipCode = typeof body.zipCode === 'string' ? body.zipCode.replace(/\D/g, '').slice(0, 5) : '';
    const waterSource = typeof body.waterSource === 'string' ? body.waterSource : 'tap';

    if (!zipCode || zipCode.length !== 5) {
      return new Response(
        JSON.stringify({ error: 'Valid 5-digit ZIP code required' }),
        { status: 400, headers: corsHeaders },
      );
    }

    // Check cache first (if KV binding exists)
    const cacheKey = `ewg:${zipCode}`;
    if (context.env.EWG_CACHE) {
      const cached = await context.env.EWG_CACHE.get(cacheKey);
      if (cached) {
        const report: WaterReport = JSON.parse(cached);
        report.waterSource = waterSource;
        return new Response(JSON.stringify(report), { headers: corsHeaders });
      }
    }

    // Fetch from EWG
    const ewgUrl = `https://www.ewg.org/tapwater/search-results.php?zip5=${zipCode}&searchtype=zip`;
    const ewgResponse = await fetch(ewgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SovereignSystems/1.0)',
        Accept: 'text/html',
      },
    });

    if (!ewgResponse.ok) {
      const demo = { ...DEMO_REPORT, zipCode, waterSource };
      return new Response(JSON.stringify(demo), { headers: corsHeaders });
    }

    const html = await ewgResponse.text();
    const report = parseEwgHtml(html, zipCode, waterSource);

    if (!report || report.contaminants.length === 0) {
      const demo = { ...DEMO_REPORT, zipCode, waterSource };
      return new Response(JSON.stringify(demo), { headers: corsHeaders });
    }

    // Cache for 24 hours (if KV binding exists)
    if (context.env.EWG_CACHE) {
      await context.env.EWG_CACHE.put(cacheKey, JSON.stringify(report), {
        expirationTtl: 86400,
      });
    }

    return new Response(JSON.stringify(report), { headers: corsHeaders });
  } catch {
    const demo = { ...DEMO_REPORT, zipCode: '00000', waterSource: 'tap' };
    return new Response(JSON.stringify(demo), { headers: corsHeaders });
  }
};
