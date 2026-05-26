/**
 * /capture — universal form-capture sink for the Sovereign Systems site.
 *
 * Astro-native APIRoute (replaces the prior Cloudflare Pages Function at
 * functions/capture.ts, which was being intercepted by the Astro SSR
 * worker because Astro's _worker.js takes precedence over Pages
 * Functions in the same project — this route is reachable in both
 * `npm run dev` and `wrangler pages dev` contexts).
 *
 * Multi-sink dispatch (additive; each sink is optional and isolated):
 *   1. KV (`SUBMISSIONS` namespace)  — primary durable sink for the site.
 *      Key: `submission:{ISO timestamp}:{random base36 id}`
 *      Value: full payload JSON + receivedAt + ipHint (last octet only)
 *      If the KV namespace isn't bound (e.g. local dev without wrangler
 *      bindings, or production before the KV is provisioned), we log a
 *      one-line warning and skip — never block the response.
 *   2. GHL webhook (`GHL_WEBHOOK_URL` env var)  — preserved sink for
 *      Maddie's GoHighLevel pipeline. If the env var is set, we POST
 *      a flat JSON envelope to it; if not, we skip silently.
 *   3. Future sinks (D1, email, etc.) plug in here as additional
 *      branches; they should follow the same isolation rule (any sink
 *      failure must not affect the client response).
 *
 * The endpoint always returns 200 `{success: true}` for valid email
 * submissions. The quiz UX treats this as fire-and-forget — the user
 * sees their result panel before this network call completes, so the
 * flow never blocks on capture latency or webhook availability.
 */
import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

type Phase = 'ELEVATE' | 'ALIGN' | 'UNLOCK';

interface CapturePayload {
  email?: string;
  name?: string;
  source?: string;
  // Quiz extension — present when the call comes from the
  // node-placement quiz at /quiz (or any successor that uses
  // the same affinity-scoring contract).
  quizNodeId?: number; // 1..13
  quizScore?: number; // 0..100 (normalized affinity for top node)
  quizPath?: string; // serialized answers e.g. "ALIGN|inner|3,5,2,4,5"
  selectedPillar?: string; // pillar slug
  selectedPhase?: Phase;
  // Decision-board extension — present when the call comes from
  // /decisions option clicks. Each click captures (a) which decision
  // was answered, (b) which option was chosen, (c) whether the chosen
  // option was the studio's recommendation, and (d) the suggestion
  // text itself so KV preserves what was proposed alongside the answer.
  decisionId?: string;
  chosenOptionLabel?: string;
  chosenOptionRecommended?: boolean;
  studioSuggestion?: string;
  decisionCategory?: string;
  decisionOwner?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Decision-board source uses a known constant identifier so Maddie's
// click-throughs land in KV without requiring her to retype her email
// on every option. She's the only client of /decisions; if a 4jp click
// is captured via the same endpoint, the decisionOwner field distinguishes.
const DECISION_BOARD_SOURCE = 'decision-board';
const DECISION_BOARD_DEFAULT_EMAIL = 'decisions@sovereign-systems.local';

function randomId(): string {
  return (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
}

function ipHintFromHeaders(headers: Headers): string {
  // Cloudflare provides the connecting IP via CF-Connecting-IP. We keep
  // only a coarse fragment — enough to de-duplicate aggressive resubmits,
  // not enough to identify. For IPv4 that's the last octet; for IPv6 it's
  // the FIRST hextet (part of the shared routing prefix) — never the
  // trailing interface identifier, which would single out a host.
  const ip = headers.get('CF-Connecting-IP') ?? '';
  if (!ip) return '';
  if (ip.includes(':')) {
    return ip.split(':').find((seg) => seg.length > 0) ?? '';
  }
  return ip.split('.').pop() ?? '';
}

interface Bindings {
  GHL_WEBHOOK_URL?: string;
  SUBMISSIONS?: KVNamespace;
}

function bindings(): Bindings {
  // Astro v6 / @astrojs/cloudflare v13 removed `Astro.locals.runtime.env`
  // (accessing it now throws); bindings come from the `cloudflare:workers`
  // module instead. When a binding isn't provisioned (e.g. `astro dev`
  // without wrangler bindings), the field is simply undefined and the
  // matching sink degrades gracefully.
  return cfEnv as unknown as Bindings;
}

async function persistToKv(
  env: Bindings,
  payload: Record<string, unknown>,
): Promise<void> {
  if (!env.SUBMISSIONS) {
    console.warn(
      '[capture] SUBMISSIONS KV not bound; skipping persistent sink',
    );
    return;
  }
  const key = `submission:${new Date().toISOString()}:${randomId()}`;
  try {
    await env.SUBMISSIONS.put(key, JSON.stringify(payload));
  } catch (err) {
    console.error('[capture] KV put failed:', err);
  }
}

async function dispatchToGhl(
  env: Bindings,
  payload: Record<string, unknown>,
): Promise<void> {
  const url = env.GHL_WEBHOOK_URL;
  if (!url) return;
  // Bound the outbound call so a slow/hanging GHL endpoint can't pin the
  // worker open — the client response should never wait on a flaky webhook.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    console.error('[capture] GHL webhook failed:', err);
  } finally {
    clearTimeout(timeout);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let data: CapturePayload;
  try {
    data = (await request.json()) as CapturePayload;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const rawEmail =
    typeof data.email === 'string' ? data.email.trim().slice(0, 254) : '';
  const name =
    typeof data.name === 'string' ? data.name.trim().slice(0, 120) : '';
  const source =
    typeof data.source === 'string' ? data.source.slice(0, 60) : 'unknown';

  // Decision-board submissions are self-attributing — synthesize an email
  // if one wasn't provided so KV writes still succeed.
  const email =
    rawEmail ||
    (source === DECISION_BOARD_SOURCE ? DECISION_BOARD_DEFAULT_EMAIL : '');

  if (!email || !EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: 'Valid email required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const quiz: Partial<CapturePayload> = {};
  if (
    typeof data.quizNodeId === 'number' &&
    data.quizNodeId >= 1 &&
    data.quizNodeId <= 13
  ) {
    quiz.quizNodeId = data.quizNodeId;
  }
  if (typeof data.quizScore === 'number' && Number.isFinite(data.quizScore)) {
    quiz.quizScore = Math.max(0, Math.min(100, data.quizScore));
  }
  if (typeof data.quizPath === 'string')
    quiz.quizPath = data.quizPath.slice(0, 200);
  if (typeof data.selectedPillar === 'string')
    quiz.selectedPillar = data.selectedPillar;
  if (
    data.selectedPhase === 'ELEVATE' ||
    data.selectedPhase === 'ALIGN' ||
    data.selectedPhase === 'UNLOCK'
  ) {
    quiz.selectedPhase = data.selectedPhase;
  }

  const decision: Partial<CapturePayload> = {};
  if (source === DECISION_BOARD_SOURCE) {
    if (typeof data.decisionId === 'string')
      decision.decisionId = data.decisionId.slice(0, 80);
    if (typeof data.chosenOptionLabel === 'string')
      decision.chosenOptionLabel = data.chosenOptionLabel.slice(0, 120);
    if (typeof data.chosenOptionRecommended === 'boolean')
      decision.chosenOptionRecommended = data.chosenOptionRecommended;
    if (typeof data.studioSuggestion === 'string')
      decision.studioSuggestion = data.studioSuggestion.slice(0, 1000);
    if (typeof data.decisionCategory === 'string')
      decision.decisionCategory = data.decisionCategory.slice(0, 40);
    if (typeof data.decisionOwner === 'string')
      decision.decisionOwner = data.decisionOwner.slice(0, 40);
  }

  const enriched = {
    email,
    name,
    source,
    ...quiz,
    ...decision,
    receivedAt: new Date().toISOString(),
    ipHint: ipHintFromHeaders(request.headers),
  };

  const env = bindings();
  await Promise.all([persistToKv(env, enriched), dispatchToGhl(env, enriched)]);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
