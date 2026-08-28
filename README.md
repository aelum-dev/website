# Aelum — Website

This is the official landing site for [Aelum](https://gitlab.com/aelum/live-iso) and the [Aelum Installer](https://gitlab.com/aelum/installer), built with [Astro](https://astro.build/).

Aelum is an Arch Linux distro with a **fully offline installer**. Boot the live ISO and the installer launches on its own — answer a few questions and end up with a Hyprland + DankMaterialShell desktop. The install needs no internet; once it's installed, your system uses the internet like any other Arch machine.

## What's on the site

- **Hero** — the one-line pitch, key stats (~1 min install, 4.7 GB, no network during install), and the ISO preview.
- **Features** — why Aelum: offline install, auto-launching installer, silent boot, auto monitor scaling, fast install, minimal live ISO.
- **What you install** — the finished desktop: Hyprland, DMS greeter, matugen, Firefox, PipeWire, Plymouth, GTK/Qt theming, ZRAM swap.
- **The installer** — the 6-step wizard, plus the ext4 vs btrfs choice.
- **Languages** — all 28 installer languages.
- **CLI** — headless / scripted install examples.

## Project Structure

```
src/
  pages/
    index.astro        # the single-page landing site
    404.astro          # fallback page
  layouts/
    Layout.astro       # head, fonts, theme script, meta
  components/
    Nav.astro          # navigation / header
    Hero.astro         # hero section
    Features.astro     # features section
    Desktop.astro      # finished desktop section
    Install.astro      # installer wizard section
    Languages.astro    # installer languages section
    CLI.astro          # headless install examples
    Footer.astro       # footer
    Card.astro         # reusable card
    Star.astro         # decorative star glyph (brand mark)
  lib/
    site.ts            # all site copy (languages, links, feature text)
  styles/
    global.css         # design system (colors, layout, ambient background, reveal)
    fonts/             # self-hosted Nunito + JetBrains Mono + Nerd Fonts symbols
public/
  star.svg             # favicon
  scripts/
    theme.js           # light/dark theme logic (persisted in localStorage)
    theme-toggle.js    # theme toggle button
    reveal.js          # IntersectionObserver scroll-reveal (+ noscript fallback)
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

Run `npm run check` (Prettier + `astro check`) before committing.

## Tech notes

- Built on **Astro 7** (static site generation). All content is server-rendered for SEO, with a lightweight `IntersectionObserver` script for scroll-reveal animations and a `<noscript>` fallback so nothing is hidden without JavaScript.
- The palette and glassy cards echo the **Material-You** look of the desktop the installer ships.
- The site itself is a static site — no backend, no API calls, no network requests to serve it. Fonts are self-hosted woff2 files under `src/styles/fonts/`.

## Content

All copy on the site is sourced from the project READMEs:

- [Aelum/README.md](https://gitlab.com/aelum/live-iso)
- [Aelum-Installer/README.md](https://gitlab.com/aelum/installer)

---

GPL-3.0 — Aelum.
