// CSS coverage check: every class a page uses must be styled by the CSS that
// page actually loads.
//
// Why this exists: each page imports base.css plus only its own section
// stylesheet. That keeps the payload small, but it means a component's styles
// can end up in the wrong file and silently render unstyled on another page.
// It happened twice: the CTA band (styles in features.css, chrome on every
// page) and CopyButton (styles in download.css, also used by the CLI section).
// Both were invisible in a dev server where one file imported everything.
//
// Run with: npm run check:css   (builds first, then audits dist/)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Classes that are markers, not styled UI.
const UNSTYLED_OK = new Set(["no-js"]);

const walk = (dir) =>
  readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) return walk(p);
    return p.endsWith(".html") ? [p] : [];
  });

const pages = walk("dist").filter((p) => !p.includes("sitemap"));
let failures = 0;

for (const page of pages) {
  const html = readFileSync(page, "utf8");

  const cssFiles = [...html.matchAll(/href="(\/_astro\/[^"]+\.css)"/g)].map((m) => m[1]);
  let css = cssFiles.map((f) => readFileSync(join("dist", f), "utf8")).join("\n");
  css += [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");

  const classes = new Set();
  for (const m of html.matchAll(/class="([^"]+)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c) classes.add(c);
  }

  const missing = [...classes]
    .filter((c) => !UNSTYLED_OK.has(c))
    .filter((c) => {
      const escaped = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return !new RegExp(`\\.${escaped}(?![\\w-])`).test(css);
    })
    .sort();

  if (missing.length) {
    failures++;
    console.error(`${page}: ${missing.length} unstyled class(es) -> ${missing.join(" ")}`);
  } else {
    console.log(`${page}: ${classes.size} classes, all covered`);
  }
}

if (failures) {
  console.error(
    "\nA class is used on a page whose stylesheet does not define it.\n" +
      "Either move the rule into base.css (shared UI) or import the stylesheet that owns it.",
  );
  process.exit(1);
}
