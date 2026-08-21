// Configure your settings at https://astro.dev/config
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical base for the GitHub Pages project/site page.
const site = 'https://KornienkoDev.github.io/AestheticOS-Web/';

export default defineConfig({
  base: '/AestheticOS-Web/',
  site,
  sitemap: {
    // Omit the trailing `index.html` from URLs for clean links.
    filter: ({ url }) => url.replace(/index\.html$/, '').replace(/\/$/, ''),
  },
  integrations: [sitemap()],
});
