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
- Favicons are rounded PNGs in `public/` (`favicon-16.png`, `favicon-32.png`, derived from the master `public/logo.png`); OG share image is `public/og-image.svg` (vector source, re-exported to `og-image.png`).

## Deployment

- Deployed as a **GitLab Pages** project/site page via `.gitlab-ci.yml` (runs on push to `main`).
- `astro.config.mjs`: `site` = `https://aelum.gitlab.io/website/` and `base = "/website/"`. **If the repo name changes, update `base` there too.**
- Sitemap strips trailing `index.html` / slashes for clean URLs.
- `public/robots.txt` **must** point at the deployed sitemap: `https://aelum.gitlab.io/website/sitemap-index.xml` (not a GitHub Pages / old-repo URL). Keep it in sync with `site`/`base`.
- **Caching:** GitLab Pages reads `public/_gitlab-pages-nginx.conf` (a Netlify `_headers` file is *not* honored by GitLab Pages). Match the deployed base path in the `location` regex. Reference `public/` assets with relative paths so they resolve under `/website/`.

## Content Sources

All copy is derived from the upstream project READMEs:

- [Aelum](https://gitlab.com/aelum/live-iso)
- [Aelum-Installer](https://gitlab.com/aelum/installer)

## Release / Download Metadata (auto-generated)

The download links, checksums, and signing key in the Download section come from
`src/lib/release.ts`, which is **generated on every release** — never edit it by
hand:

- `docker/scripts/build-release-metadata.sh` produces it from a signed ISO (and
  the same data as `latest.json`, uploaded to Cloudflare R2).
- `docker/scripts/publish-iso.sh` runs it during a release and writes `release.ts`.
- `docker/scripts/publish-website.sh` commits it to this repo's `main`, which
  triggers GitLab Pages to redeploy with the new links.
- `scripts/fetch-release.mjs` can also regenerate it in CI by fetching `latest.json`
  from the Cloudflare Worker (`RELEASE_METADATA_URL`). If the URL is unset or the
  fetch fails it keeps the committed file, so the site always builds offline.

`src/lib/release.ts` is committed as an **offline baseline** (a normal pattern for
generated files) and overwritten on each release. `src/lib/release-type.ts`
(hand-written) types it. `src/lib/site.ts` re-exports the values the Download
component consumes (`releaseVersion`, `downloadUrl`, `checksums`, `signingKey`).

## Assets

- Static images live under `public/` and are served at the site root.
- **Reference in-page `public/` assets with a relative path** (e.g. `src="logo.png"`), not a leading-slash absolute path. Because `astro.config.mjs` sets `base = "/website/"`, an absolute path like `/logo.png` is rejected at build time (the router expects `/website/logo.png`). Relative paths resolve correctly under the base — this is how the favicon (`star.svg`) and the nav logo are referenced.
- **Links that must reach the site root** (e.g. the 404 page's "Back to home") must also be relative (`href="index.html"`), not `href="/"` — an absolute `/` misses the `/website/` base and lands on the GitLab user root.
- For **canonical/absolute URLs** (OG/Twitter images in `Layout.astro`), derive them from Astro's config with `new URL("og-image.png", Astro.url).href` so the base and site URL stay in one place.
- Do not hardcode the base string; keep it in `astro.config.mjs`.
- **Favicons:** rounded, optimized PNGs live in `public/` (`favicon-16.png`, `favicon-32.png`) and are referenced in `Layout.astro`. They are derived from the master `public/logo.png` (downscaled with rounded corners). Prefer these small favicons over the large `logo.png` in hot paths like the header.
- **OG share image (`og-image.png`)** is exported from its vector source `public/og-image.svg` — never hand-edit the PNG. It drives social/Telegram link previews, so update both the SVG copy and re-export when the site text or logo changes. Re-export with headless Chromium (it loads the self-hosted Nunito woff2, which `rsvg`/cairo cannot): copy `src/styles/fonts/nunito-v16-latin-regular.woff2` to `public/nunito.woff2` (the SVG references it), inline the SVG into an HTML wrapper sized 1200×630, and screenshot with `chromium --headless=new --window-size=1200,630 --screenshot=public/og-image.png file://…/wrapper.html`.

## Gotchas

- No backend, no API calls, no network dependencies — keep it offline-first.
- After adding content or components, run `npm run check` (format + typecheck) before committing.
- `dist/` and `.astro/` are build artifacts (gitignored or committed per repo policy) — regenerate with `npm run build`, don't hand-edit.
