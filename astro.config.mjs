// Configure your settings at https://astro.dev/config
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Canonical base for the custom domain served at the site root.
const site = "https://aelum.dev/";

export default defineConfig({
  base: "/",
  site,
  sitemap: {
    // Omit the trailing `index.html` from URLs for clean links.
    filter: ({ url }) => url.replace(/index\.html$/, "").replace(/\/$/, ""),
  },
  integrations: [sitemap()],
});
