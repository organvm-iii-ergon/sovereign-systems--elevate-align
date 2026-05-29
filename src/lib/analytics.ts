/**
 * analytics.ts — Lightweight, privacy-first event tracking
 *
 * Emits structured console events that Cloudflare Web Analytics
 * captures via Web Vitals integration. No cookies, no PII,
 * no third-party scripts beyond the CF beacon.
 *
 * Events are only emitted in production (guarded by the caller
 * or by the beacon's own conditional load).
 */

export type AnalyticsEvent =
  | { action: 'spiral_node_click'; nodeId: number; nodeName: string }
  | { action: 'quiz_start'; source: 'hub' | 'water' }
  | {
      action: 'quiz_complete';
      nodeId: number;
      score: number;
      source: 'hub' | 'water';
    }
  | { action: 'water_funnel_entry'; branch?: string }
  | { action: 'email_gate_submit'; page: string }
  | { action: 'branch_view'; branch: string }
  | { action: 'pillar_view'; pillar: string }
  | { action: 'cta_click'; label: string; href: string };

/**
 * Log a structured analytics event.
 *
 * Format: `[EA] action=<action> key=value ...`
 *
 * These are plain console.log calls — Cloudflare Web Analytics
 * picks up page-level metrics automatically. The structured logs
 * serve as a lightweight event stream that can be consumed by
 * Cloudflare Workers or Logpush if deeper analysis is needed later.
 */
export function trackEvent(event: AnalyticsEvent): void {
  const { action, ...data } = event;
  const pairs = Object.entries(data)
    .map(([k, v]) => `${k}=${v}`)
    .join(' ');

  // Structured prefix for easy filtering in log drains
  console.log(`[EA] action=${action}${pairs ? ' ' + pairs : ''}`);
}

/**
 * Auto-attach event listeners to annotated DOM elements.
 *
 * Call once from a `<script>` in Base.astro. Scans for elements
 * with `data-ea-*` attributes and wires up click handlers.
 *
 * Supported attributes:
 *   data-ea-action   — required, the event action name
 *   data-ea-*        — any other data-ea attribute becomes an event property
 *
 * Example:
 *   <a data-ea-action="cta_click" data-ea-label="Get Started" href="/quiz">
 */
export function initAutoTrack(): void {
  document.querySelectorAll<HTMLElement>('[data-ea-action]').forEach((el) => {
    el.addEventListener('click', () => {
      const action = el.dataset.eaAction;
      if (!action) return;

      const data: Record<string, string> = {};
      for (const [key, value] of Object.entries(el.dataset)) {
        if (key.startsWith('ea') && key !== 'eaAction' && value) {
          // Convert camelCase eaLabel -> label
          const prop = key.slice(2, 3).toLowerCase() + key.slice(3);
          data[prop] = value;
        }
      }

      // Include href for links
      if (el instanceof HTMLAnchorElement && el.href) {
        data.href = el.getAttribute('href') || el.href;
      }

      const pairs = Object.entries(data)
        .map(([k, v]) => `${k}=${v}`)
        .join(' ');
      console.log(`[EA] action=${action}${pairs ? ' ' + pairs : ''}`);
    });
  });
}
