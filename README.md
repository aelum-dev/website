# Aelum — Website

This is the official landing site for [Aelum](https://github.com/aelum-dev/live-iso) and the [Aelum Installer](https://github.com/aelum-dev/installer), built with [Astro](https://astro.build/).

Aelum is an Arch Linux distro with a **fully offline installer**. Boot the live ISO and the installer launches on its own — answer four questions and end up with a Hyprland + Dux Shell desktop. The install needs no internet; once it's installed, your system uses the internet like any other Arch machine.

## What's on the site

Four real routes, one Astro page each.

- **`/` — Home**: **Hero** (the one-line pitch, key stats — ~1.5 min install, 3.2 GB installed, 28
  languages — inline value props, and the desktop preview in a lit device frame),
  **Flow** (the three moves: flash it, answer four questions, reboot), and **Showcase** (a bento of
  real installer screenshots, hard numbers and the two choices that matter).
- **`/install/` — Install**: the auto-advancing 7-shot walkthrough with a progress rail, and the
  6-step wizard grid.
- **`/features/` — Features**: why Aelum (offline install, auto-launching installer, optional LUKS2,
  dual-boot-safe manual partitioning, ext4/btrfs, silent boot, auto monitor scaling, GUI or CLI),
  **What you install** (Hyprland, Dux Shell, Dux Greeter, matugen, GTK/Qt theming, Kitty,
  Firefox, Aelum splash), the 28-language marquee, and **CLI** headless install examples.
- **`/download/` — Download**: the ISO, its SHA-256/SHA-512 checksums, the GPG signature, the signing
  key fetched via WKD, copyable verification commands, and flashing tools (Ventoy, BalenaEtcher, dd).
- **Call to action** and **Footer** are site chrome, rendered by the layout on every page but the
  Download page.

## Project Structure

```
src/
  pages/
    index.astro        # / (Hero + Flow + Showcase)
    download.astro     # /download/
    install.astro      # /install/
    features.astro     # /features/
    404.astro          # fallback page
  layouts/
    Layout.astro       # head, theme script, meta + site chrome (ambient field, progress bar)
  components/
    Nav.astro          # floating glass header + sliding active pill
    Hero.astro         # hero
    Flow.astro         # the three moves
    Showcase.astro     # landing-page bento
    Features.astro     # features section
    Desktop.astro      # finished desktop section
    Install.astro      # installer walkthrough + step grid
    Languages.astro    # installer languages marquee
    CLI.astro          # headless install examples
    CTA.astro          # closing call-to-action band
    Download.astro     # ISO download + verification section
    Footer.astro       # footer
    Card.astro         # reusable glassy card
    CopyButton.astro   # copy-to-clipboard control
    Shot.astro         # the only way to place a screenshot
  lib/
    site.ts            # all site copy (languages, links, feature text, home data)
    release.ts         # generated on every release — never hand-edited
    images.ts          # generated screenshot manifest — never hand-edited
  styles/
    base.css           # design system (tokens, ambient field, cards, buttons, nav, motion)
    home.css           # hero / flow / showcase
    download.css       # download page
    features.css       # features section
    install.css        # installer section
    fonts/             # self-hosted Sora + Nunito + JetBrains Mono + Nerd Fonts symbols
public/
  logo.png             # brand mark / large logo
  favicon-16.png       # small favicon (16×16)
  favicon-32.png       # small favicon (32×32)
  og-image.png         # social share image (raster export; see scripts/og-image.html)
  images/              # content-hashed AVIF derivatives + one WebP fallback each
  robots.txt           # points at the deployed sitemap
  scripts/
    app.js             # nav state, reveals, clipboard, pointer effects, count-up
    theme.js           # light/dark theme logic (persisted in localStorage)
    theme-toggle.js    # theme toggle button
```
    og-image.html      # OG share image source (edit, then `npm run og-image`)
    export-og-image.sh # headless-Chromium export -> public/og-image.png
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

- Built on **Astro 7** (static site generation) with real routes: every page is its own server-rendered
  document, so all content — including which sections exist — is decided at build time and is present
  with JavaScript off. `public/scripts/app.js` only adds behaviour the browser has to provide (nav
  state and its active pill, scroll reveal, copy buttons, pointer effects, count-up numbers) and
  `theme.js` owns the theme plus the theme-matched screenshots. Everything in them is enhancement.
- The palette and glassy cards echo the **Material-You** look of the desktop the installer ships. The
  scheme itself is the exported Dux Shell light/dark palette and is not a website choice.
- The site is a static site — no backend, no API calls, no network requests to serve it. Fonts are
  self-hosted woff2 files under `src/styles/fonts/`; screenshots are served from `public/images/` as
  content-hashed AVIF with a single WebP fallback each.

## Content

All copy on the site is sourced from the project READMEs:

- [Aelum/README.md](https://github.com/aelum-dev/live-iso)
- [Aelum-Installer/README.md](https://github.com/aelum-dev/installer)

---

GPL-3.0 — Aelum.
