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
- **Download** — the ISO, its SHA-256 / SHA-512 checksums, GPG signature, signing key, and flashing tools (Ventoy, BalenaEtcher, dd).
- **Call to action** — "build it yourself": the Docker recipe that assembles the ISO.

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
    CTA.astro          # call-to-action / "build it yourself" section
    Download.astro     # ISO download + verification section
    Footer.astro       # footer
    Card.astro         # reusable card
  lib/
    site.ts            # all site copy (languages, links, feature text)
  styles/
    base.css           # design system (colors, layout, ambient background, glassy cards)
    home.css           # hero / home section
    download.css       # download page
    features.css       # features section
    install.css        # installer section
    fonts/             # self-hosted Nunito + JetBrains Mono + Nerd Fonts symbols
public/
  logo.png             # brand mark / large logo
  favicon-16.png       # small favicon (16×16)
  favicon-32.png       # small favicon (32×32)
  og-image.svg         # social share image (vector source)
  og-image.png         # social share image (raster export)
  images/              # hero shots + installer demo video
  robots.txt           # points at the deployed sitemap
  scripts/
    app.js             # hash-based single-shell page router
    theme.js           # light/dark theme logic (persisted in localStorage)
    theme-toggle.js    # theme toggle button
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

Run `npm run check` (Biome + `astro check`) before committing.

## Tech notes

- Built on **Astro 7** (static site generation). The whole site is one server-rendered HTML shell, so every page is present without JavaScript; `public/scripts/app.js` then switches between pages by hash (progressive enhancement — with JS it shows a single active shell, without JS it falls back to a scrollable view). There is no scroll-reveal script.
- The palette and glassy cards echo the **Material-You** look of the desktop the installer ships.
- The site itself is a static site — no backend, no API calls, no network requests to serve it. Fonts are self-hosted woff2 files under `src/styles/fonts/`.

## Content

All copy on the site is sourced from the project READMEs:

- [Aelum/README.md](https://gitlab.com/aelum/live-iso)
- [Aelum-Installer/README.md](https://gitlab.com/aelum/installer)

---

GPL-3.0 — Aelum.
