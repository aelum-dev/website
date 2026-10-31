# Aelum — website

The source behind [aelum.dev](https://aelum.dev): the landing site for Aelum, an Arch Linux distro whose
installer needs no internet.

It is a static Astro 7 site — four real pages, no backend, no API, no requests needed to serve it. Fonts
are self-hosted, the screenshots are built into the repo, and it opens dark, because that is the theme a
visitor has not chosen yet.

## Pages

| Route | What's there |
|---|---|
| `/` | what Aelum is, and the three moves from a USB stick to a desktop |
| `/download/` | the ISO with its checksums, its GPG signature, copyable verification commands, flashing tools |
| `/install/` | the installer walkthrough, the four questions, automatic vs manual disk mode, the 28 languages, headless installs |
| `/features/` | the desktop that ships, and what the installed system does on its own: snapshots, wallpaper colors, encrypted boot |

All copy lives in one file, `src/lib/site.ts`. The download metadata arrives from the release pipeline in
[aelum/docker](https://github.com/aelum-dev/docker), so publishing a release updates the site without
anyone editing it.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # preview the built site
npm run check      # formatting + types + a CSS-coverage check — run this before committing
```

## Deployed

A push to `main` runs `.github/workflows/pages.yml`, which publishes to `https://aelum.dev/`.

## Working on it

[AGENTS.md](./AGENTS.md) holds the conventions — routes, components, generated files, the design system,
the motion budget, the screenshot pipeline — and the things that broke before.

## License

GPL-3.0 — see [LICENSE](./LICENSE).
