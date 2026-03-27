import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { email } = data;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Replace this with the actual GoHighLevel Webhook URL when available
    const WEBHOOK_URL = import.meta.env.GHL_WEBHOOK_URL;

    if (WEBHOOK_URL) {
      // Forward the lead to GoHighLevel
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'water_explore_gate' }),
      });

      if (!response.ok) {
        console.error('Failed to post to webhook', response.statusText);
        // We still return 200 to the client to not block the UX,
        // but we log the error server-side for debugging.
      }
    } else {
      // If no webhook is configured yet, just log it server-side
      console.log(`[Lead Captured] Email: ${email}, Source: water_explore_gate`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Route Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
