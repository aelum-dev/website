# AestheticOS — Website

This is the official landing site for [AestheticOS](https://github.com/KornienkoDev/AestheticOS) and the [AestheticOS Installer](https://github.com/KornienkoDev/AestheticOS-Installer), built with [Astro](https://astro.build/).

AestheticOS is a beautiful, **fully offline** Arch Linux distro. Boot the live ISO and the installer launches on its own — answer a few questions and finish with a polished Hyprland + DankMaterialShell desktop. No internet, ever.

## What's on the site

- **Hero** — the one-line pitch, key stats (~1 min install, 4.7 GB, zero network), and the ISO preview.
- **Features** — why AestheticOS: fully offline, zero-touch boot, silent boot, auto monitor scaling, fast install, zram.
- **What you install** — the finished desktop: Hyprland, DMS greeter, matugen, Alacritty, Firefox, PipeWire, Plymouth, GTK/Qt theming.
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
- The site is fully offline — no backend, no API calls, no network dependencies. Fonts are self-hosted woff2 files under `src/styles/fonts/`.

## Content

All copy on the site is sourced from the project READMEs:

- [AestheticOS/README.md](https://github.com/KornienkoDev/AestheticOS)
- [AestheticOS-Installer/README.md](https://github.com/KornienkoDev/AestheticOS-Installer)

---

GPL-3.0 — AestheticOS.
