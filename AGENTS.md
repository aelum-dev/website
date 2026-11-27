# Aelum Website — Agent Context

Static site for Aelum (https://aelum.dev), a fully offline Arch Linux distro. **Astro 7** SSG +
vanilla JS, deployed to GitHub Pages on push to `main`. Five real routes (`/`, `/download/`,
`/install/`, `/features/`, `/faq/`) plus 404 — no backend, no runtime network calls.

All copy is derived from the sibling repos — [installer](https://github.com/aelum-dev/installer) and
[live-iso](https://github.com/aelum-dev/live-iso). A claim that is not in those repos does not belong
on this site.

## Where things live

```
astro.config.mjs             — site URL + base; directory output with trailing slashes
src/pages/                   — one .astro per route; robots.txt.ts is the one generated route
src/layouts/Layout.astro     — head + chrome: ambient field, progress bar, Nav, CTA, Footer
src/components/              — page sections + the shared Card / CopyButton / Shot
src/lib/site.ts              — ALL copy: nav, features, steps, disk modes, languages, links, FAQ
src/lib/release.ts           — GENERATED per release — never hand-edit (release-type.ts types it)
src/lib/images.ts            — GENERATED screenshot manifest
src/styles/base.css          — design tokens + shared UI (palette = exported Dux Shell scheme)
src/styles/<page>.css        — per-section styles, imported per page
src/styles/fonts/            — GENERATED self-hosted woff2 subsets + OFL texts
public/scripts/              — theme.js / theme-toggle.js / app.js (progressive enhancement)
public/images/               — GENERATED content-hashed AVIF ladder + one WebP fallback
public/.well-known/openpgpkey/ — release key over WKD (docker/scripts/export-wkd.sh)
scripts/                     — image pipeline, fonts, icons, og-image export, fetch-release.mjs
docs/                        — DESIGN.md (layout/copy/motion rules) · ASSETS.md (generated assets)
```

## Build & test

```bash
npm run check                # format + typecheck — run before committing (the deploy runs the same gate)
npm run dev                  # dev server at localhost:4321
npm run build && npm run preview
```

Generated assets — screenshots, fonts, icons, og-image, WKD, release metadata — have their own
pipeline; commands and rules in `docs/ASSETS.md`.

## Rules

- All copy lives in `src/lib/site.ts` — never hardcode strings in templates; sections are small
  components composed by the page that owns them.
- `Card.astro` is the one card; screenshots render only through `Shot.astro`; icons only through the
  Nerd Fonts subset (`scripts/icons.py`) — never inline SVG or a second icon set.
- Generated files (`release.ts`, `images.ts`, `public/images/`, fonts, `og-image.png`, WKD) are never
  hand-edited.
- The palette is frozen — it mirrors the desktop's Dux Shell scheme. Motion follows `docs/DESIGN.md`;
  breaking a motion-budget rule is a regression, not a preference.
- Copy is written from the reader's side; facts, numbers, sizes and commands are never softened or
  dropped for style.
- Progressive enhancement: content is fully visible with JS off, reduced motion is respected, and the
  theme is dark-first (the OS preference is deliberately not consulted).
- Deployment: GitHub Pages via `.github/workflows/pages.yml`; the domain comes from `public/CNAME`;
  the site URL lives only in `astro.config.mjs` and everything absolute is derived from it.
- Commit messages: keep them SHORT — one conventional subject line (`type(scope): summary`, ≤72 chars);
  at most two or three short body lines when the *why* is not obvious.
