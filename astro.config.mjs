import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://elevatealign.com',
  integrations: [react(), keystatic(), sitemap()],
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
});
