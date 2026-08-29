# AGENTS.md

Developer notes for agents working on **Aelum-Web** — a single-page Astro landing site for Aelum (a fully offline Arch Linux distro) and its installer.

## Stack

- **Astro 7** (static site generation) with `@astrojs/sitemap`
- TypeScript (strict, via `astro/tsconfigs/strict`)
- Prettier + `prettier-plugin-astro` for formatting
- Vanilla JS for interactivity (no framework components / no build-time JS bundling beyond Astro)

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server at localhost:4321
npm run build      # production build -> ./dist
npm run preview    # preview the production build
npm run typecheck  # astro check (type checking)
npm run format     # prettier --write .
npm run format:check
npm run check      # prettier --check . && astro check   # run before committing
```

## Layout & Conventions

- **Single page.** `src/pages/index.astro` is the only real page; `src/pages/404.astro` is the fallback.
- **Content lives in `src/lib/site.ts`.** Keep all copy (languages, links, feature text) as exported data here and consume it from components — don't hardcode strings in templates. This makes reviews and edits easy.
- **Sections are components** under `src/components/`, composed in order in `index.astro`:
  `Nav` → `Hero` → `Features` → `Desktop` → `Install` → `Languages` → `CLI` → `CTA` → `Footer`.
  Each section is a small `.astro` component (typically 20–70 lines). Add new sections as new components and insert them in the page.
- **Layout & chrome** in `src/layouts/Layout.astro` (head, fonts, theme script, meta).
- **Styling** is centralized in `src/styles/global.css` (~1150 lines): design system tokens (colors, layout, glassy cards, ambient background, reveal styles). Add tokens/classes here rather than inline styles.
- **Interactivity** is plain JS in `public/scripts/`:
  - `theme.js` / `theme-toggle.js` — light/dark theme + toggle (persisted in `localStorage`).
  - `app.js` — hash-based single-shell router: toggles the `.active` page, highlights the matching nav link, updates the title, and scrolls to top (deep links + back/forward via the history API).
- **No scroll-reveal script.** Every page is server-rendered and visible without JS (a scroll view); with JS the router shows only the active page. There is no `reveal.js` — don't add one expecting a `<noscript>` fallback to exist.

## Design Guidance

- Material-You / glassy aelum mirroring the Aelum desktop (Hyprland + DankMaterialShell).
- Fonts are self-hosted woff2 under `src/styles/fonts/` (Nunito + JetBrains Mono + Nerd Fonts symbols) — keep them offline; the site must stay fully offline.
- Favicon `public/star.svg`; OG images `public/og-image.{svg,png}`.

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
