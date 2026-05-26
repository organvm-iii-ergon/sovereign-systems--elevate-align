/**
 * /api/water-report — EWG tap-water proxy for the Water funnel.
 *
 * Astro-native APIRoute (replaces the prior Cloudflare Pages Function at
 * functions/api/water-report.ts, which was unreachable in production: the
 * Astro `_worker.js` advanced-mode bundle takes precedence over root
 * `functions/`, and `functions/` is not part of `dist/`, so the old
 * handler 404'd and HydrationNode silently fell back to demo data).
 * Same migration pattern as src/pages/capture.ts.
 *
 * Route: POST /api/water-report
 * Body: { zipCode: string, waterSource: string }
 *
 * Optional KV binding `EWG_CACHE` caches parsed reports for 24h; absent
 * binding degrades gracefully (no cache, live fetch each time). Any
 * upstream failure falls back to a representative demo report so the UI
 * never shows an empty state.
 */
import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

interface Bindings {
  EWG_CACHE?: KVNamespace;
}

function bindings(): Bindings {
  // Astro v6 / @astrojs/cloudflare v13 removed `Astro.locals.runtime.env`;
  // bindings come from the `cloudflare:workers` module instead. When the
  // KV namespace isn't provisioned the field is undefined and caching is
  // skipped.
  return cfEnv as unknown as Bindings;
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
  chromium: ['carcinogenic', 'detox'],
  arsenic: ['carcinogenic', 'neurological'],
  lead: ['neurological', 'reproductive', 'cellular'],
  nitrate: ['reproductive', 'cellular'],
  radium: ['carcinogenic'],
  uranium: ['carcinogenic', 'detox'],
  fluoride: ['neurological', 'hormonal'],
  chloroform: ['carcinogenic', 'detox'],
  pfas: ['hormonal', 'reproductive', 'cellular'],
  pfoa: ['hormonal', 'reproductive', 'carcinogenic'],
  pfos: ['hormonal', 'reproductive', 'carcinogenic'],
  manganese: ['neurological'],
  barium: ['cellular'],
  chlorine: ['skin', 'hydration'],
  bromodichloromethane: ['carcinogenic'],
  dibromochloromethane: ['carcinogenic'],
};

function lookupEffects(contaminantName: string): string[] {
  const lower = contaminantName.toLowerCase();
  for (const [key, effects] of Object.entries(KNOWN_EFFECTS)) {
    if (lower.includes(key)) return effects;
  }
  return ['cellular'];
}

function parseEwgHtml(
  html: string,
  zipCode: string,
  waterSource: string,
): WaterReport | null {
  const contaminants: Contaminant[] = [];

  const utilityMatch =
    html.match(/<h1[^>]*class="[^"]*headline[^"]*"[^>]*>([^<]+)</i) ||
    html.match(/<title>([^|<]+)/);
  const utilityName = utilityMatch
    ? utilityMatch[1]
        .replace(/\s*\|.*$/, '')
        .replace(/EWG.*$/, '')
        .trim()
    : `Water utility for ${zipCode}`;

  const contaminantPattern =
    /class="[^"]*contaminant[^"]*"[^>]*>[\s\S]*?<(?:span|div)[^>]*class="[^"]*name[^"]*"[^>]*>([^<]+)<[\s\S]*?class="[^"]*amount[^"]*"[^>]*>([^<]*)<[\s\S]*?class="[^"]*legal[^"]*"[^>]*>([^<]*)<[\s\S]*?class="[^"]*health[^"]*"[^>]*>([^<]*)</g;

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

  if (contaminants.length === 0) {
    const simplePattern =
      /<a[^>]*href="[^"]*contaminant[^"]*"[^>]*>([^<]+)<\/a>[\s\S]*?(\d+\.?\d*)\s*x\s*(?:above|over)\s*(?:health|EWG)/gi;
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
    {
      name: 'Haloacetic acids (HAA5)',
      detected: 27.7,
      legalLimit: 60,
      healthGuideline: 0.1,
      unit: 'ppb',
      exceedsLegal: false,
      exceedsHealth: true,
      effects: ['carcinogenic', 'cellular'],
    },
    {
      name: 'Total trihalomethanes (TTHMs)',
      detected: 49.2,
      legalLimit: 80,
      healthGuideline: 0.3,
      unit: 'ppb',
      exceedsLegal: false,
      exceedsHealth: true,
      effects: ['carcinogenic', 'cellular'],
    },
    {
      name: 'Chromium (hexavalent)',
      detected: 0.42,
      legalLimit: 100,
      healthGuideline: 0.01,
      unit: 'ppb',
      exceedsLegal: false,
      exceedsHealth: true,
      effects: ['carcinogenic', 'detox'],
    },
    {
      name: 'Chloroform',
      detected: 22.4,
      legalLimit: null,
      healthGuideline: 0.8,
      unit: 'ppb',
      exceedsLegal: false,
      exceedsHealth: true,
      effects: ['carcinogenic', 'detox'],
    },
    {
      name: 'Bromodichloromethane',
      detected: 8.9,
      legalLimit: null,
      healthGuideline: 0.3,
      unit: 'ppb',
      exceedsLegal: false,
      exceedsHealth: true,
      effects: ['carcinogenic'],
    },
    {
      name: 'Dibromochloromethane',
      detected: 5.1,
      legalLimit: null,
      healthGuideline: 0.4,
      unit: 'ppb',
      exceedsLegal: false,
      exceedsHealth: true,
      effects: ['carcinogenic'],
    },
    {
      name: 'Nitrate',
      detected: 1.8,
      legalLimit: 10000,
      healthGuideline: 0.14,
      unit: 'ppb',
      exceedsLegal: false,
      exceedsHealth: true,
      effects: ['reproductive', 'cellular'],
    },
    {
      name: 'Fluoride',
      detected: 700,
      legalLimit: 4000,
      healthGuideline: null,
      unit: 'ppb',
      exceedsLegal: false,
      exceedsHealth: false,
      effects: ['neurological', 'hormonal'],
    },
    {
      name: 'Barium',
      detected: 34,
      legalLimit: 2000,
      healthGuideline: 700,
      unit: 'ppb',
      exceedsLegal: false,
      exceedsHealth: false,
      effects: ['cellular'],
    },
    {
      name: 'Manganese',
      detected: 2.1,
      legalLimit: null,
      healthGuideline: null,
      unit: 'ppb',
      exceedsLegal: false,
      exceedsHealth: false,
      effects: ['neurological'],
    },
    {
      name: 'Chlorine',
      detected: 1200,
      legalLimit: 4000,
      healthGuideline: null,
      unit: 'ppb',
      exceedsLegal: false,
      exceedsHealth: false,
      effects: ['skin', 'hydration'],
    },
    {
      name: 'Radium (-226 & -228)',
      detected: 0.8,
      legalLimit: 5,
      healthGuideline: 0.05,
      unit: 'pCi/L',
      exceedsLegal: false,
      exceedsHealth: true,
      effects: ['carcinogenic'],
    },
  ],
  totalContaminants: 12,
  exceedingHealth: 8,
  exceedingLegal: 0,
  lastUpdated: new Date().toISOString(),
  isDemo: true,
};

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as {
      zipCode?: string;
      waterSource?: string;
    };

    const zipCode =
      typeof body.zipCode === 'string'
        ? body.zipCode.replace(/\D/g, '').slice(0, 5)
        : '';
    const waterSource =
      typeof body.waterSource === 'string'
        ? body.waterSource.slice(0, 40)
        : 'tap';

    if (!zipCode || zipCode.length !== 5) {
      return new Response(
        JSON.stringify({ error: 'Valid 5-digit ZIP code required' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    const { EWG_CACHE } = bindings();
    const cacheKey = `ewg:${zipCode}`;

    if (EWG_CACHE) {
      const cached = await EWG_CACHE.get(cacheKey);
      if (cached) {
        const report: WaterReport = JSON.parse(cached);
        report.waterSource = waterSource;
        return new Response(JSON.stringify(report), { headers: JSON_HEADERS });
      }
    }

    // zipCode is sanitized to exactly 5 digits above, so the upstream URL
    // cannot be repointed (no SSRF surface).
    const ewgUrl = `https://www.ewg.org/tapwater/search-results.php?zip5=${zipCode}&searchtype=zip`;
    const ewgResponse = await fetch(ewgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SovereignSystems/1.0)',
        Accept: 'text/html',
      },
    });

    if (!ewgResponse.ok) {
      return new Response(
        JSON.stringify({ ...DEMO_REPORT, zipCode, waterSource }),
        { headers: JSON_HEADERS },
      );
    }

    const html = await ewgResponse.text();
    const report = parseEwgHtml(html, zipCode, waterSource);

    if (!report || report.contaminants.length === 0) {
      return new Response(
        JSON.stringify({ ...DEMO_REPORT, zipCode, waterSource }),
        { headers: JSON_HEADERS },
      );
    }

    if (EWG_CACHE) {
      await EWG_CACHE.put(cacheKey, JSON.stringify(report), {
        expirationTtl: 86400,
      });
    }

    return new Response(JSON.stringify(report), { headers: JSON_HEADERS });
  } catch {
    return new Response(
      JSON.stringify({ ...DEMO_REPORT, zipCode: '00000', waterSource: 'tap' }),
      { headers: JSON_HEADERS },
    );
  }
};
