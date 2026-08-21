# AestheticOS — Website

This is the official landing site for [AestheticOS](https://github.com/KornienkoDev/AestheticOS) and the [AestheticOS Installer](https://github.com/KornienkoDev/AestheticOS-Installer), built with [Astro](https://astro.build/).

AestheticOS is a beautiful, **fully offline** Arch Linux distro. Boot the live ISO and the installer launches on its own — answer a few questions and finish with a polished Hyprland + DankMaterialShell desktop. No internet, ever.

## 🎯 What's on the site

- **Hero** — the one-line pitch, key stats (~1 min install, 4.7 GB, zero network), and the ISO preview.
- **Features** — why AestheticOS: fully offline, zero-touch boot, silent boot, auto monitor scaling, fast install, zram.
- **What you install** — the finished desktop: Hyprland, DMS greeter, matugen, Alacritty, Firefox, PipeWire, Plymouth, GTK/Qt theming.
- **The installer** — the 6-step wizard, plus the ext4 vs btrfs choice.
- **Languages** — all 28 installer languages.
- **CLI** — headless / scripted install examples.
- **Call to action** — link out to the ISO repo and the installer.

## 🚀 Project Structure

```
src/
  pages/
    index.astro        # the single-page landing site
  styles/
    global.css         # design system (colors, layout, ambient background, reveal)
  components/
    Star.astro         # decorative star glyph (brand mark)
  lib/
    (build helpers)
public/
  star.svg             # favicon
```

## 🧭 Commands

All commands are run from the root of the project, from a terminal:

| Command             | Action                                            |
| :------------------ | :------------------------------------------------ |
| `npm install`       | Installs dependencies                             |
| `npm run dev`       | Starts local dev server at `localhost:4321`       |
| `npm run build`     | Build your production site to `./dist/`           |
| `npm run preview`   | Preview your build locally, before deploying      |

## 📦 Deploy to GitHub Pages

This site is configured to deploy as a GitHub Pages **project/site page** at
`https://<your-username>.github.io/AestheticOS-Web/`.

1. Push this repository to GitHub (repo named `AestheticOS-Web`).
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. On every push to `main`, the `.github/workflows/pages.yml` workflow builds
   the site and publishes it automatically.

> The Astro `base` is set to `/AestheticOS-Web/` in `astro.config.mjs`, which is
> required for project/site pages. If you ever change the repo name, update it
> there too.

## 🧩 Tech notes

- Built on **Astro 7** (static site generation). All content is server-rendered for SEO, with a lightweight `IntersectionObserver` script for scroll-reveal animations and a `<noscript>` fallback so nothing is hidden without JavaScript.
- The palette and glassy cards echo the **Material-You** look of the desktop the installer ships.

## 📄 Content

All copy on the site is sourced from the project READMEs:

- [AestheticOS/README.md](https://github.com/KornienkoDev/AestheticOS)
- [AestheticOS-Installer/README.md](https://github.com/KornienkoDev/AestheticOS-Installer)

---

GPL-3.0 — AestheticOS.
