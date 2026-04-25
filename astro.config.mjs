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
      allowedHosts: true,         // accept any Host header — required for tunnel
    },
  },
});
