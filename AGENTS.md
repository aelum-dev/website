# AGENTS.md

Developer notes for agents working on **Aelum-Web** — a single-page Astro landing site for Aelum (a fully offline Arch Linux distro) and its installer.

## Stack

- **Astro 7** (static site generation) with `@astrojs/sitemap`
- TypeScript (strict, via `astro/tsconfigs/strict`)
- Biome for formatting (replaces Prettier); a `lint` script is also available (`npm run lint`)
- Vanilla JS for interactivity (no framework components / no build-time JS bundling beyond Astro)

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server at localhost:4321
npm run build      # production build -> ./dist
npm run preview    # preview the production build
npm run og-image   # re-export public/og-image.png from scripts/og-image.html (Chromium)
npm run typecheck  # astro check (type checking)
npm run format     # biome format --write .
npm run format:check
npm run lint       # biome lint . (optional; Prettier never linted)
npm run check      # biome format . && astro check   # run before committing
```

## Layout & Conventions

- **Real routes, one Astro page each.** `src/pages/` → `/` (`index.astro`), `/download/`,
  `/install/`, `/features/`; `404.astro` is the fallback. `astro.config.mjs` uses
  `build.format: "directory"` + `trailingSlash: "always"` so a route is built as
  `download/index.html` and served at `/download/` — GitHub Pages serves directory indexes but
  **not** extensionless paths, so this is the combination that works there. The nav is
  `navLinks` in `site.ts`; `Layout` marks the active item server-side (`aria-current="page"`), so
  the active state is correct with JS off. Adding a page = a new file in `src/pages/` + one entry in
  `navLinks`.
- **Content lives in `src/lib/site.ts`.** Keep all copy (languages, links, nav, feature text) as
  exported data here and consume it from components — don't hardcode strings in templates. This makes
  reviews and edits easy.
- **Sections are components** under `src/components/`, composed by the page that owns them:
  `/` → `Hero` · `/download/` → `Download` · `/install/` → `Install` ·
  `/features/` → `Desktop` + `Features` + `Languages` + `CLI`.
  Each section is a small `.astro` component. Add new sections as new components and insert them in
  the page. `Card.astro` (glassy card with a colored icon tile) and `CopyButton.astro` (clipboard
  button with copy/check icons) are reusable building blocks.
- **Layout & chrome** in `src/layouts/Layout.astro`: the `<head>` boilerplate (meta, OG/Twitter,
  favicon, theme script) **and** the site chrome (skip link, ambient background, `Nav`, `<main>`,
  `CTA`, `Footer`). A page supplies only its title/description, an `active` page id, its own CSS
  imports and its sections. `showCta={false}` suppresses the call-to-action where it would be
  redundant (the Download page).
- **Reference `public/` assets from the site root** (`/logo.svg`, `/images/…`, `/scripts/…`).
  Relative paths (`logo.svg`) break on nested routes: from `/download/` they resolve to
  `/download/logo.svg` and 404. Canonical/absolute URLs (OG images) still come from `Astro.url`.
- **Styling** is split across `src/styles/`: `base.css` holds the design system tokens (colors, type,
  layout, glassy cards, ambient background); per-section files (`home.css`, `download.css`,
  `features.css`, `install.css`) hold the rest. Each page imports `base.css` plus only its own
  section CSS, so Astro emits a shared chunk for `base.css` and per-page CSS for the rest — keep
  section styles in their own file and the payload stays small. Add tokens/classes here rather than
  inline styles.
- **Interactivity** is plain JS in `public/scripts/`:
  - `theme.js` / `theme-toggle.js` — light/dark theme + toggle (persisted in `localStorage`, defaults
    to dark). `theme.js` owns persistence and exposes `window.aelumTheme.get/set`; the toggle is the
    only caller of `set`.
  - `app.js` — the floating-nav scroll state + mobile menu; a scroll-reveal `IntersectionObserver`;
    the copy-to-clipboard handler; the pointer-tracked card glow. **It does not route:** which content
    exists is decided at build time, and no page switching happens in the browser.
- **Scroll reveal** is progressive enhancement: `.reveal` elements are fully visible without JS, and `html.js` hides then reveals them via the observer in `app.js`. Reduced-motion users see everything immediately. Keep this invariant — never hide content in a way that depends on JS running.

## Design Guidance

- Material-You / glassy aelum mirroring the Aelum desktop (Hyprland + DankMaterialShell).
- **The palette is frozen.** `--bg`, `--accent`, … in `base.css` are the exported DankMaterialShell
  light/dark scheme and must stay identical to the desktop's. Do not "improve" the colours here —
  change them in DMS. Overhauls change type, layout and motion, not the scheme.
- **Type faces**: `Sora` (display — page and section titles only), `Nunito` (body — everything else,
  including card titles) and `JetBrains Mono` (commands, filenames, versions, checksums). All three
  are **variable with the `wght` axis clamped to the range the CSS asks for**, so no weight is ever
  faux-bolded by the browser; each `@font-face` declares its axis range (`font-weight: 400 900`) and
  an explicit `unicode-range` per cut. Rebuild with `bash scripts/build-fonts.sh` (fetches from
  `google/fonts`, subsets, prints the surviving axes) and commit the woff2 files — they are generated
  artifacts, like the rEFInd PNGs. OFL texts sit beside them.
- Reference families through `--font-display` / `--font-body` / `--font-mono`, never by face name in
  a component or section stylesheet. Keep every face self-hosted: no CDN, no hosted `@import`.
- **Theme is dark-first**: `theme.js` applies the persisted choice and falls back to **dark** when
  there is none; the OS `prefers-color-scheme` is deliberately not consulted for the initial value.
  Light is a fully designed scheme, not a degraded fallback.
- Favicons are rounded PNGs in `public/` (`favicon-16.png`, `favicon-32.png`, derived from the master `public/logo.png`); the OG share image is `public/og-image.png`, exported from the editable HTML source `scripts/og-image.html` via `npm run og-image`.

## Deployment

- Deployed as a **GitHub Pages** site via `.github/workflows/pages.yml` (runs on push to `main`), served at the custom domain `https://aelum.dev/`.
- `astro.config.mjs`: `site` = `https://aelum.dev/` and `base = "/"`. The custom domain is declared by `public/CNAME` (and must match the repo's Pages setting).
- Routes build as directories (`/download/index.html`) and are linked with a trailing slash.
  `robots.txt` **must** point at the deployed sitemap: `https://aelum.dev/sitemap-index.xml`. Keep it in sync with `site`.
- The sitemap already contains clean URLs (`https://aelum.dev/download/`) because of the directory
  output; `extendSitemap` only drops the 404 page. (The old `sitemap.filter` was a no-op — a filter
  decides inclusion, it does not rewrite the URL.)
- `public/robots.txt` **must** point at the deployed sitemap: `https://aelum.dev/sitemap-index.xml`. Keep it in sync with `site`.
- **Caching:** GitHub Pages ignores custom header config (there is no `_headers`/nginx equivalent). Content-hashed assets under `public/images/` already change filename when their content changes, so long-lived caching is safe without extra config.

## Content Sources

All copy is derived from the upstream project READMEs:

- [Aelum](https://github.com/aelum-dev/live-iso)
- [Aelum-Installer](https://github.com/aelum-dev/installer)

## Release / Download Metadata (auto-generated)

The download links, checksums, and signing key in the Download section come from
`src/lib/release.ts`, which is **generated on every release** — never edit it by
hand:

- `docker/scripts/gen-release-metadata.sh` produces it from a signed ISO (and
  the same data as `latest.json`, uploaded to Cloudflare R2).
- `docker/scripts/publish-iso.sh` runs it during a release and writes `release.ts`.
- `docker/scripts/publish-website.sh` commits it to this repo's `main`, which
  triggers the GitHub Pages workflow to redeploy with the new links.
- `scripts/fetch-release.mjs` can also regenerate it in CI by fetching `latest.json`
  from the Cloudflare Worker (`RELEASE_METADATA_URL`). If the URL is unset or the
  fetch fails it keeps the committed file, so the site always builds offline.

`src/lib/release.ts` is committed as an **offline baseline** (a normal pattern for
generated files) and overwritten on each release. `src/lib/release-type.ts`
(hand-written) types it. `src/lib/site.ts` re-exports the values the Download
component consumes (`releaseVersion`, `downloadUrl`, `checksums`, `signingKey`).

`site.ts` also derives the signing email from `signingKey.uid`, the WKD URL
(`wkdKeyUrl`) and the user-facing `verifyCommands`, so the Download section's
"Verify in three commands" block always matches the shipped filenames and the
current key. The release key is published over **WKD** under
`public/.well-known/openpgpkey/` (generated by `docker/scripts/export-wkd.sh`);
the `hu/<hash>` path is z-base-32(SHA-1(local-part)) of the signing email, so it
changes if that email ever changes.

## Assets

- Static images live under `public/` and are served at the site root.
- Reference `public/` assets from the site root (`/logo.svg`, `/images/…`): pages are served at
  nested routes, where a relative path resolves inside that route and 404s.
- For **canonical/absolute URLs** (OG/Twitter images in `Layout.astro`), derive them from Astro's config with `new URL("og-image.png", Astro.url).href` so the site URL stays in one place.
- Do not hardcode the site URL; keep it in `astro.config.mjs`.
- **Favicons:** rounded, optimized PNGs live in `public/` (`favicon-16.png`, `favicon-32.png`) and are referenced in `Layout.astro`. They are derived from the master `public/logo.png` (downscaled with rounded corners). Prefer these small favicons over the large `logo.png` in hot paths like the header.
- **OG share image (`og-image.png`)** is exported from its editable HTML source `scripts/og-image.html` — never hand-edit the PNG. It drives social/Telegram link previews, so edit the copy/logo/colours/layout in `scripts/og-image.html` and re-export when the site text or logo changes: `npm run og-image` (alias for `bash scripts/export-og-image.sh`). The script renders the 1200×630 wrapper headless with Chromium, which draws the self-hosted Nunito woff2 that `rsvg`/cairo cannot. `scripts/og-image.html` is the single source of truth, so the repo carries no base64-raster bloat (the old `public/og-image.svg` was removed).

## Gotchas

- No backend, no API calls, no network dependencies — keep it offline-first.
- After adding content or components, run `npm run check` (format + typecheck) before committing.
- `dist/` and `.astro/` are build artifacts (gitignored or committed per repo policy) — regenerate with `npm run build`, don't hand-edit.
