// robots.txt is generated, not a static file, so the sitemap URL is the one the
// config implies. It replaced public/robots.txt: that file repeated a domain the
// rest of the site already reads from astro.config.mjs → site.
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  // Without `site` in the config there is no absolute sitemap URL to publish;
  // the dev server is the only case that gets here without one.
  const origin = site ?? new URL("http://localhost:4321/");
  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${new URL("sitemap-index.xml", origin).href}`, ""].join(
    "\n",
  );

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
