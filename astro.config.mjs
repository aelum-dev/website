// Configure your settings at https://astro.dev/config

import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// Canonical base for the custom domain served at the site root.
const site = "https://aelum.dev/";

export default defineConfig({
  base: "/",
  site,

  build: {
    // One directory per route: /download/index.html served at /download/.
    // GitHub Pages serves directory indexes but NOT extensionless paths, so
    // `format: "directory"` + trailing slashes is the combination that works
    // there. It also keeps every page's asset URLs rooted at the site root.
    format: "directory",
  },
  trailingSlash: "always",

  sitemap: {
    // With directory output the generated URLs are already clean
    // (https://aelum.dev/download/); nothing to rewrite.
    extendSitemap: (sitemap) => {
      sitemap.urls = sitemap.urls.filter((u) => !u.loc.includes("/404"));
      return sitemap;
    },
  },

  integrations: [sitemap()],
});
