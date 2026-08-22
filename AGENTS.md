# AGENTS.md

Developer notes for agents working on **AestheticOS-Web** — a single-page Astro landing site for AestheticOS (a fully offline Arch Linux distro) and its installer.

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
  - `reveal.js` — `IntersectionObserver` scroll-reveal, with a `<noscript>` fallback so content is never hidden without JS.

## Design Guidance

- Material-You / glassy aesthetic mirroring the AestheticOS desktop (Hyprland + DankMaterialShell).
- Fonts are self-hosted woff2 under `src/styles/fonts/` (Nunito + JetBrains Mono + Nerd Fonts symbols) — keep them offline; the site must stay fully offline.
- Favicon `public/star.svg`; OG images `public/og-image.{svg,png}`.

## Deployment

- Deployed as a GitHub Pages **project/site page** via `.github/workflows/pages.yml` (runs on push to `main`).
- `astro.config.mjs`: `site` = `https://KornienkoDev.github.io/AestheticOS-Web/` and `base = "/AestheticOS-Web/"`. **If the repo name changes, update `base` there too.**
- Sitemap strips trailing `index.html` / slashes for clean URLs.

## Content Sources

All copy is derived from the upstream project READMEs:

- [AestheticOS](https://github.com/KornienkoDev/AestheticOS)
- [AestheticOS-Installer](https://github.com/KornienkoDev/AestheticOS-Installer)

## Assets

- Static images live under `public/` and are served at the site root.
- **Reference in-page `public/` assets with a relative path** (e.g. `src="logo.png"`), not a leading-slash absolute path. Because `astro.config.mjs` sets `base = "/AestheticOS-Web/"`, an absolute path like `/logo.png` is rejected at build time (the router expects `/AestheticOS-Web/logo.png`). Relative paths resolve correctly under the base — this is how the favicon (`star.svg`) and the nav logo are referenced.
- For **canonical/absolute URLs** (OG/Twitter images in `Layout.astro`), derive them from Astro's config with `new URL("og-image.png", Astro.url).href` so the base and site URL stay in one place.
- Do not hardcode the base string; keep it in `astro.config.mjs`.
- **Favicons:** rounded, optimized PNGs live in `public/` (`favicon-16.png`, `favicon-32.png`) and are referenced in `Layout.astro`. They are derived from the master `public/logo.png` (downscaled with rounded corners). Prefer these small favicons over the large `logo.png` in hot paths like the header.

## Gotchas

- No backend, no API calls, no network dependencies — keep it offline-first.
- After adding content or components, run `npm run check` (format + typecheck) before committing.
- `dist/` and `.astro/` are build artifacts (gitignored or committed per repo policy) — regenerate with `npm run build`, don't hand-edit.
