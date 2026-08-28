// Configure your settings at https://astro.dev/config
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Canonical base for the GitLab Pages project/site page.
const site = "https://aelum.gitlab.io/website/";

export default defineConfig({
  base: "/website/",
  site,
  sitemap: {
    // Omit the trailing `index.html` from URLs for clean links.
    filter: ({ url }) => url.replace(/index\.html$/, "").replace(/\/$/, ""),
  },
  integrations: [sitemap()],
});
