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
  vite: {
    plugins: [tailwindcss()],
  },
});
