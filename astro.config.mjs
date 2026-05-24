import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';

export default defineConfig({
  site: 'https://elevatealign.com',
  adapter: cloudflare(),
  integrations: [sitemap(), markdoc(), keystatic()],
  server: {
    host: true,                   // bind 0.0.0.0 — required for tunnel access
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Explicit list because allowedHosts:true sometimes doesn't propagate
      // through Astro's adapter chain. Wildcard prefixes accept any subdomain.
      allowedHosts: ['.trycloudflare.com', '.ngrok-free.app', '.ngrok-free.dev', '.ngrok.io', 'localhost', '127.0.0.1'],
    },
  },
});
