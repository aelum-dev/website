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

- **Single page.** `src/pages/index.astro` is the only real page; `src/pages/404.astro` is the fallback.
- **Content lives in `src/lib/site.ts`.** Keep all copy (languages, links, feature text) as exported data here and consume it from components — don't hardcode strings in templates. This makes reviews and edits easy.
- **Sections are components** under `src/components/`, composed in `index.astro`:
  `Nav` → Home page (`Hero`) → Download page (`Download`) → Install page (`Install`) →
  Features page (`Desktop` + `Features` + `Languages` + `CLI`) → `CTA` → `Footer`.
  Each section is a small `.astro` component. Add new sections as new components and insert them in the page.
  `Card.astro` (glassy card with a colored icon tile) and `CopyButton.astro` (clipboard button with
  copy/check icons) are reusable building blocks.
- **Layout & chrome** in `src/layouts/Layout.astro` (head, fonts, theme script, meta).
- **Styling** is split across `src/styles/`: `base.css` holds the design system tokens (colors, layout, glassy cards, ambient background); per-section files (`home.css`, `download.css`, `features.css`, `install.css`) hold the rest. Add tokens/classes here rather than inline styles.
- **Interactivity** is plain JS in `public/scripts/`:
  - `theme.js` / `theme-toggle.js` — light/dark theme + toggle (persisted in `localStorage`).
  - `app.js` — everything else: the hash-based single-shell router (toggles the `.active` page, highlights matching `a[data-page]` links, updates the title, scrolls to top); the floating-nav scroll state + mobile menu; a scroll-reveal `IntersectionObserver`; the copy-to-clipboard handler; and the pointer-tracked card glow.
- **Scroll reveal** is progressive enhancement: `.reveal` elements are fully visible without JS, and `html.js` hides then reveals them via the observer in `app.js`. Reduced-motion users see everything immediately. Keep this invariant — never hide content in a way that depends on JS running.

## Design Guidance

- Material-You / glassy aelum mirroring the Aelum desktop (Hyprland + DankMaterialShell).
- Fonts are self-hosted woff2 under `src/styles/fonts/` (Nunito + JetBrains Mono + Nerd Fonts symbols) — keep them offline; the site must stay fully offline.
- Favicons are rounded PNGs in `public/` (`favicon-16.png`, `favicon-32.png`, derived from the master `public/logo.png`); the OG share image is `public/og-image.png`, exported from the editable HTML source `scripts/og-image.html` via `npm run og-image`.

## Deployment

- Deployed as a **GitHub Pages** site via `.github/workflows/pages.yml` (runs on push to `main`), served at the custom domain `https://aelum.dev/`.
- `astro.config.mjs`: `site` = `https://aelum.dev/` and `base = "/"`. The custom domain is declared by `public/CNAME` (and must match the repo's Pages setting).
- Sitemap strips trailing `index.html` / slashes for clean URLs.
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
- Reference `public/` assets with a relative path (e.g. `src="logo.png"`) so they resolve regardless of the deploy base.
- For **canonical/absolute URLs** (OG/Twitter images in `Layout.astro`), derive them from Astro's config with `new URL("og-image.png", Astro.url).href` so the site URL stays in one place.
- Do not hardcode the site URL; keep it in `astro.config.mjs`.
- **Favicons:** rounded, optimized PNGs live in `public/` (`favicon-16.png`, `favicon-32.png`) and are referenced in `Layout.astro`. They are derived from the master `public/logo.png` (downscaled with rounded corners). Prefer these small favicons over the large `logo.png` in hot paths like the header.
- **OG share image (`og-image.png`)** is exported from its editable HTML source `scripts/og-image.html` — never hand-edit the PNG. It drives social/Telegram link previews, so edit the copy/logo/colours/layout in `scripts/og-image.html` and re-export when the site text or logo changes: `npm run og-image` (alias for `bash scripts/export-og-image.sh`). The script renders the 1200×630 wrapper headless with Chromium, which draws the self-hosted Nunito woff2 that `rsvg`/cairo cannot. `scripts/og-image.html` is the single source of truth, so the repo carries no base64-raster bloat (the old `public/og-image.svg` was removed).

## Gotchas

- No backend, no API calls, no network dependencies — keep it offline-first.
- After adding content or components, run `npm run check` (format + typecheck) before committing.
- `dist/` and `.astro/` are build artifacts (gitignored or committed per repo policy) — regenerate with `npm run build`, don't hand-edit.
