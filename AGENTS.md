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
npm run og-image   # re-export public/og-image.png from scripts/og-image.html (Chromium)
npm run typecheck  # astro check (type checking)
npm run format     # biome format --write .
npm run format:check
npm run lint       # biome lint . (optional; Prettier never linted)
npm run check      # biome format . && astro check   # run before committing

# Generated assets (run manually, commit the output — see Assets → Screenshots)
python3 scripts/prepare-sources.py --light <dir> --dark <dir>  # crop desktop captures into assets/
python3 scripts/build-images.py  # rebuild public/images + src/lib/images.ts from assets/
npm run format                # the generated manifest is committed biome-formatted
```

## Layout & Conventions

- **Real routes, one Astro page each.** `src/pages/` → `/` (`index.astro`), `/download/`,
  `/install/`, `/features/`; `404.astro` is the fallback. `astro.config.mjs` uses
  `build.format: "directory"` + `trailingSlash: "always"` so a route is built as
  `download/index.html` and served at `/download/` — GitHub Pages serves directory indexes but
  **not** extensionless paths, so this is the combination that works there. The nav is
  `navLinks` in `site.ts`; `Layout` marks the active item server-side (`aria-current="page"`), so
  the active state is correct with JS off. Adding a page = a new file in `src/pages/` + one entry in
  `navLinks`.
- **Content lives in `src/lib/site.ts`.** Keep all copy (languages, links, nav, feature text) as
  exported data here and consume it from components — don't hardcode strings in templates. This makes
  reviews and edits easy.
- **Copy is written from the reader's side, never the software's.** The subject of a sentence is the
  user or their machine — "Boot the ISO and the installer is already opening", "Your whole disk is
  erased", "Plug a monitor in and it picks a scale" — not the product narrating its own verbs:
  "Launches the installer. Wipes the partition table. Sets a scale." Stacked subject-less verb
  fragments ("Wipes X. Builds Y. No terminal, no commands.") are the tell of machine-written copy;
  humans describe outcomes and give advice ("use it only on a disk that's yours alone"). Punchy
  titles are fine; running prose is not a feature log. Facts, numbers, sizes and commands are never
  softened or dropped for style.
- **Sections are components** under `src/components/`, composed by the page that owns them:
  `/` → `Hero` + `Flow` · `/download/` → `Download` · `/install/` → `Install` + `DiskModes` ·
  `/features/` → `Desktop` + `Features` + `Languages` + `CLI`.
  Each section is a small `.astro` component. Add new sections as new components and insert them in
  the page. `Card.astro` (glassy card with a colored icon tile) and `CopyButton.astro` (clipboard
  button with copy/check icons) are reusable building blocks. `Flow.astro` (the three-move strip) is
  home-only and reads `flow` from `site.ts`.
- **Layout & chrome** in `src/layouts/Layout.astro`: the `<head>` boilerplate (meta, OG/Twitter,
  favicon, theme script) **and** the site chrome (skip link, the ambient background layers, the
  reading-progress bar, `Nav`, `<main>`, `CTA`, `Footer`). A page supplies only its title/description,
  an `active` page id, its own CSS imports and its sections. `showCta={false}` suppresses the
  call-to-action where the page already carries its own download buttons (Home, Download).
- **Reference `public/` assets from the site root** (`/logo.svg`, `/images/…`, `/scripts/…`).
  Relative paths (`logo.svg`) break on nested routes: from `/download/` they resolve to
  `/download/logo.svg` and 404. Canonical/absolute URLs (OG images) still come from `Astro.url`.
- **Styling** is split across `src/styles/`: `base.css` holds the design system tokens (colors, type,
  layout, glassy cards, ambient background); per-section files (`home.css`, `download.css`,
  `features.css`, `install.css`) hold the rest. Each page imports `base.css` plus only its own
  section CSS, so Astro emits a shared chunk for `base.css` and per-page CSS for the rest — keep
  section styles in their own file and the payload stays small. Add tokens/classes here rather than
  inline styles.
- **Screenshots go through `Shot.astro`, never a raw `<img>`.** Pass the manifest keys
  (`light="installer-step-3-light" dark="installer-step-3-dark"`). The emitted `<picture>` serves the
  **dark** derivatives — the theme every visitor gets before they have chosen anything — and carries
  the light set in `data-aelum-*` attributes; `theme.js` writes the matching set whenever it applies a
  theme. Two things this replaces, both of which were wrong:
  - `media="(prefers-color-scheme: dark)"` selects by the **operating system**, but the site's theme
    is its own dark-first choice, so an OS-light visitor saw a light screenshot inside the dark site.
  - Two `<img>` tags with one hidden by CSS: hidden images are still downloaded.
  A screenshot with no dark counterpart gets no `data-aelum-*` attributes and is never swapped.
- **Interactivity** is plain JS in `public/scripts/`:
  - `theme.js` / `theme-toggle.js` — light/dark theme + toggle (persisted in `localStorage`, defaults
    to dark). `theme.js` owns persistence, exposes `window.aelumTheme.get/set`, and is the only thing
    that rewrites theme-dependent screenshots (`syncImages`). The toggle is the only caller of `set`.
  - `app.js` — floating-nav scroll state + mobile menu + the nav's sliding active pill; the
    reading-progress bar (`--scroll` written on `.scroll-progress-bar`, the only reader of it); a
    scroll-reveal `IntersectionObserver` and the stagger indices it writes; the copy-to-clipboard
    handler; **one** rAF loop for every pointer effect (card glow, button spotlight, hero tilt,
    ambient spotlight); count-up on `[data-count]` numbers; and the section-liveness observer that
    pauses the decoration in whatever is off screen (see Design Guidance → Motion has a budget). **It
    does not route:** which content exists is decided at build time, and no page switching happens in
    the browser.
- **Scroll reveal** is progressive enhancement: `.reveal` elements are fully visible without JS, and `html.js` hides then reveals them via the observer in `app.js`. Reduced-motion users see everything immediately. Keep this invariant — never hide content in a way that depends on JS running.
- **Groups stagger** with `data-stagger` on the container: `app.js` writes `--i` onto its direct
  `.reveal` children and `base.css` turns that into a transition delay. Order is still CSS; JS only
  supplies an index. Do not hand-write per-child delays in a section stylesheet.

## Design Guidance

- Material-You / glassy aelum mirroring the Aelum desktop (Hyprland + Dux Shell).
- **The palette is frozen.** `--bg`, `--accent`, … in `base.css` are the exported Dux Shell
  light/dark scheme and must stay identical to the desktop's. Do not "improve" the colours here —
  change them in Dux Shell. Overhauls change type, layout and motion, not the scheme.
- **Motion is a system, not per-component improvisation.** Everything decorative in `base.css`:
  the ambient field (`.bg-aurora` / `.bg-grid` / `.bg-grain` / `.bg-spot`), the conic rim used by
  cards, the CTA panel, the CLI window and the theme toggle, the button spotlight, `.eyebrow` sheen +
  `.eyebrow-chip` pulse, `.reveal` and its stagger, and the nav's drop-in + sliding pill.
  Animated angles and percentage fills go through the registered custom properties `--spin` and
  `--fill` (`@property` at the top of `base.css`) — without registration a browser cannot interpolate
  a gradient, and the animation silently does nothing. Durations come from `--t-fast/base/slow` and
  the ambient loops from `--t-aurora/spin`.
  Rules: animate `transform`/`opacity` on fixed decorative layers (never `background-position` on a
  large one), gate any animation that *hides* content on `html.js`, and add the reduced-motion
  opt-out in the same commit — the `@media (prefers-reduced-motion: reduce)` block in `base.css`
  drops the drifting auroras, the spotlight and every conic rim while keeping the static wash, grid
  and grain that carry depth on their own.

- **Motion has a budget.** The overhaul made the site heavy enough to tax a GPU, and what made it
  heavy was not the number of effects — it was which ones were running, and continuously. These are
  the rules that keep it affordable; breaking one is a regression, not a preference.
  - **Nothing loops off screen.** `app.js` observes every `.section` and marks the visible ones
    `.is-live`; each stylesheet pauses the loops inside any section that is not
    (`html.loops-managed .section:not(.is-live) … { animation-play-state: paused }`). Without it the
    features page ran 17 card rims, a 56-chip marquee and a blinking terminal cursor while you were
    reading something else. `.loops-managed` is added only after the observer has classified every
    section, so a page with no JS keeps every loop. The walkthrough's own timer pauses the same way,
    in `Install.astro` — a paused progress bar and an unpaused slide timer drift apart.
  - **A loop you are not looking at is not running.** The conic rims on cards and on the theme toggle
    are `animation-play-state: paused` until `:hover`/`:focus-within`. They are invisible until then
    anyway; only their cost was being paid.
  - **`--spin` and `--fill` are not compositor animations.** A registered custom property used inside
    a gradient ticks a style recalculation and a repaint of that gradient (and its mask) every frame.
    That is fine for a rim on something you are pointing at, and never for a whole page of them.
  - **Never `scale()` a blurred layer.** A `filter: blur()` layer is rasterised once at a given scale
    and reused; a scale in the keyframes makes the compositor re-blur it. The auroras and the hero
    halo translate only — where the old scale mattered (the second aurora is larger than the first)
    the size is written into the element instead.
  - **No `background-position` loops.** `.eyebrow::after` and `.flow-line::after` are oversized
    pseudo-elements that translate under an `overflow: hidden` parent. Same picture, no repaint.
  - **`backdrop-filter` is the expensive one.** It re-samples and re-blurs everything behind the
    element on every frame that backdrop changes — and behind everything here is the drifting field.
    It is kept where it genuinely reads through *content* (`.nav-inner`, the mobile menu) and gone
    from anything that only sat on the page background:
    `.card`, `.stat`, `.flow-step`, `.cta-panel`, `.eyebrow`, `.btn-ghost`, `.hero-visual`,
    `.features-demo-frame`. `--surface` is already 72% of a solid colour over a field that is itself
    soft gradients, so the blur was contributing nothing visible — the before/after renders are
    identical. Do not re-add it to a card.
  - **No full-viewport blend, and no blur standing in for a gradient.** `.bg-grain` has no
    `mix-blend-mode` (a blend of the whole viewport, every frame, for a texture at 5% opacity), and
    the CTA panel's and demo frame's glows are soft gradient stops rather than a solid with a
    70–90px `filter: blur()` on it.
  - **`.reveal` is opacity + transform, never `filter`.** A blur transition re-rasterises the element
    at a new radius every frame — the worst thing to do to a page while it is being scrolled, and
    twelve cards arriving at once used to do exactly that.
  - **Write a custom property on the element that reads it.** `--scroll` goes on
    `.scroll-progress-bar`, `--spot-x/--spot-y` on `.bg-spot`, `--mx/--my` on the card or the `.btn`
    whose gradient reads them. Writing any of them on `:root` changes an *inherited* value, which
    invalidates inherited style for every node in the document — on every scroll frame, or every
    pointer move.
  - **One rAF per frame, and no layout read per pointer event.** All four pointer effects share a
    single coalesced loop; each tracked element's rect is cached and dropped when the page moves under
    the pointer, not re-measured on every event (pointer events arrive coalesced: a 120 Hz device
    fires several between two frames). A `.btn` inside a card is tracked as its own element, so
    lighting the button never freezes the card's glow.
  - **Colour transitions are for the theme switch only.** `base.css` gives elements their colour/
    border/box-shadow transition only while `<html>` has `.theme-anim`, which `theme.js` sets for
    exactly `--theme-duration` and then removes. As a permanent rule on `*` it put transition
    machinery on every element on every page and turned every hover into a 650 ms fade. It uses
    `:where()` so it contributes no specificity and a component's own `transition:` shorthand still
    wins.
  - **`will-change` is not permanent.** The theme-morph blob carries it only while `.active`, and is
    150vmax scaled to 2.4× rather than 300vmax scaled to 1× — same end circle, a quarter of the
    texture, and nothing allocated on page load for a click that may never happen.
  - **Minifier trap:** Astro's CSS minifier folds an `animation-play-state` longhand that trails a
    fully-literal `animation:` shorthand — and drops it, which then makes the matching `:hover`
    longhand look like a no-op and drops it too. Write the pause inside the shorthand
    (`animation: card-ring 6s linear infinite paused`). It only survived on the card rim because its
    duration is a `var()` the minifier cannot parse. Verify in `dist/_astro/*.css`, not in the source.
  - Verify the effect, not the intent: `chromium --headless=new --dump-dom` against a built page, and
    read `getComputedStyle(el, "::before")` / `document.getAnimations()`. Half of what this site does
    is decoration that is *supposed* to be invisible.
- **Type faces**: `Sora` (display — page and section titles only), `Nunito` (body — everything else,
  including card titles) and `JetBrains Mono` (commands, filenames, versions, checksums). All three
  are **variable with the `wght` axis clamped to the range the CSS asks for**, so no weight is ever
  faux-bolded by the browser; each `@font-face` declares its axis range (`font-weight: 400 900`) and
  an explicit `unicode-range` per cut. Rebuild with `bash scripts/build-fonts.sh` (fetches from
  `google/fonts`, subsets, prints the surviving axes) and commit the woff2 files — they are generated
  artifacts, like the rEFInd PNGs. OFL texts sit beside them.
- Reference families through `--font-display` / `--font-body` / `--font-mono`, never by face name in
  a component or section stylesheet. Keep every face self-hosted: no CDN, no hosted `@import`.
- **Theme is dark-first**: `theme.js` applies the persisted choice and falls back to **dark** when
  there is none; the OS `prefers-color-scheme` is deliberately not consulted for the initial value.
  Light is a fully designed scheme, not a degraded fallback.
- Favicons are rounded PNGs in `public/` (`favicon-16.png`, `favicon-32.png`, derived from the master `public/logo.png`); the OG share image is `public/og-image.png`, exported from the editable HTML source `scripts/og-image.html` via `npm run og-image`.

## Deployment

- Deployed as a **GitHub Pages** site via `.github/workflows/pages.yml` (runs on push to `main`), served at the custom domain `https://aelum.dev/`.
- `astro.config.mjs`: `site` = `https://aelum.dev/` and `base = "/"`. The custom domain is declared by `public/CNAME` (and must match the repo's Pages setting).
- Routes build as directories (`/download/index.html`) and are linked with a trailing slash.
  `robots.txt` **must** point at the deployed sitemap: `https://aelum.dev/sitemap-index.xml`. Keep it in sync with `site`.
- The sitemap already contains clean URLs (`https://aelum.dev/download/`) because of the directory
  output; `extendSitemap` only drops the 404 page. (The old `sitemap.filter` was a no-op — a filter
  decides inclusion, it does not rewrite the URL.)
- `public/robots.txt` **must** point at the deployed sitemap: `https://aelum.dev/sitemap-index.xml`. Keep it in sync with `site`.
- **Caching:** GitHub Pages ignores custom header config (there is no `_headers`/nginx equivalent). Content-hashed assets under `public/images/` already change filename when their content changes, so long-lived caching is safe without extra config.

## Content Sources

All copy is derived from the upstream project READMEs:

- [Aelum](https://github.com/aelum-dev/live-iso)
- [Aelum-Installer](https://github.com/aelum-dev/installer)

## Release / Download Metadata (auto-generated)

The download links, checksums, and signing key in the Download section come from
`src/lib/release.ts`, which is **generated on every release** — never edit it by
hand:

- `docker/scripts/gen-release-metadata.sh` produces it from a signed ISO (and
  the same data as `latest.json`, uploaded to Cloudflare R2).
- `docker/scripts/publish-iso.sh` runs it during a release and writes `release.ts`.
- `docker/scripts/publish-website.sh` commits it to this repo's `main`, which
  triggers the GitHub Pages workflow to redeploy with the new links.
- `scripts/fetch-release.mjs` can also regenerate it in CI by fetching `latest.json`
  from the public R2 bucket (`RELEASE_METADATA_URL`, i.e. `https://cdn.aelum.dev/latest.json`;
  there is no Worker in front of the CDN). If the URL is unset or the
  fetch fails it keeps the committed file, so the site always builds offline.

`src/lib/release.ts` is committed as an **offline baseline** (a normal pattern for
generated files) and overwritten on each release. `src/lib/release-type.ts`
(hand-written) types it. `src/lib/site.ts` re-exports the values the Download
component consumes (`releaseVersion`, `downloadUrl`, `checksums`, `signingKey`).

`site.ts` also derives the signing email from `signingKey.uid`, the WKD URL
(`wkdKeyUrl`), the user-facing `verifyCommands` and `isoSizeLabel` (one ISO-size
formatter, shared by the Download card and the landing-page stats, so one file is
never two different sizes), so the Download section's
"Verify in three commands" block always matches the shipped filenames and the
current key. The release key is published over **WKD** under
`public/.well-known/openpgpkey/` (generated by `docker/scripts/export-wkd.sh`);
the `hu/<hash>` path is z-base-32(SHA-1(local-part)) of the signing email, so it
changes if that email ever changes.

## Assets

### Screenshots (generated)

```
<Pictures>/installer-{light,dark}/N.png   a desktop capture with the installer window in it
  -> assets/<key>.png                     scripts/prepare-sources.py crops the window out
assets/<key>.png                          the screenshots themselves — the only copy, never served
  -> public/images/<key>-<w>w.<hash>.avif          the responsive ladder (AVIF only)
  -> public/images/<key>-<w>w.<hash>.webp          ONE WebP, at the fallback width
  -> src/lib/images.ts              generated manifest: key -> variants + fallback
```

- A capture off a display is **not** a source: it is the whole desktop with the installer window in it
  (1200x800 inside 2560x1440). `scripts/prepare-sources.py` finds the window — the largest block of
  pixels that differ from the capture's corner colour — and crops it, so the geometry is written down
  instead of hand-guessed at each re-shoot. It refuses to write a crop it is not confident about.
- `python3 scripts/build-images.py` (needs Pillow + numpy + `avifenc`) rebuilds all of it. Widths are derived
  per source and a source is never upscaled, so a 1200 px screenshot gets 800 px and 1200 px variants,
  not 1920 px. Stale derivatives are deleted, so re-shooting a screenshot does not leave orphans.
- **Encode quality follows the subject** (`PROFILES` in build-images.py). A window full of UI text is
  rendered close to 1:1, and a low `qcolor` puts ringing on every glyph edge — the thing a visitor
  actually sees — so those encode at `qcolor 55` / WebP 82. Whole-desktop shots (the hero) are shown
  small relative to their pixels and stay on the smaller `qcolor 38` profile.
- **One format serves the page.** The `<source>` ladder is AVIF; the single WebP per source is the
  `<img src>`, which is what a browser that supports `<picture>` but cannot decode AVIF ends up using.
  Shipping a full WebP ladder as well cost ~530 KB of repo for a format almost nobody fetched — AVIF
  is ~1.7x smaller on these screenshots. Do not re-add a WebP `srcset`.
- Components never name a file: they pass a key to `Shot.astro`. Re-shot screenshot → new hash →
  manifest changes → nothing to edit by hand.
- The hashes exist because GitHub Pages has no header control: a filename that changes with its
  content can be cached forever.
- Cost, for reference: the hero went from 804 KB (PNG) to 30 KB AVIF at 1920 px, and the old markup
  fetched light **and** dark. An installer step is 4–27 KB per file at the `ui` profile (the same
  screenshots were 2.7–23 KB at the `desktop` one); the whole served set — 16 screenshots in two themes,
  50 files — is ~700 KB.

### Other assets

- Static images live under `public/` and are served at the site root.
- Reference `public/` assets from the site root (`/logo.svg`, `/images/…`): pages are served at
  nested routes, where a relative path resolves inside that route and 404s.
- For **canonical/absolute URLs** (OG/Twitter images in `Layout.astro`), derive them from Astro's config with `new URL("og-image.png", Astro.url).href` so the site URL stays in one place.
- Do not hardcode the site URL; keep it in `astro.config.mjs`.
- **Favicons:** rounded, optimized PNGs live in `public/` (`favicon-16.png`, `favicon-32.png`) and are referenced in `Layout.astro`. They are derived from the master `public/logo.png` (downscaled with rounded corners). Prefer these small favicons over the large `logo.png` in hot paths like the header.
- **OG share image (`og-image.png`)** is exported from its editable HTML source `scripts/og-image.html` — never hand-edit the PNG. It drives social/Telegram link previews, so edit the copy/logo/colours/layout in `scripts/og-image.html` and re-export when the site text or logo changes: `npm run og-image` (alias for `bash scripts/export-og-image.sh`). The script renders the 1200×630 wrapper headless with Chromium, which draws the self-hosted Nunito woff2 that `rsvg`/cairo cannot. `scripts/og-image.html` is the single source of truth, so the repo carries no base64-raster bloat (the old `public/og-image.svg` was removed).

## Gotchas

- No backend, no API calls, no network dependencies — keep it offline-first.
- After adding content or components, run `npm run check` (format + typecheck) before committing.
- `dist/` and `.astro/` are build artifacts (gitignored or committed per repo policy) — regenerate with `npm run build`, don't hand-edit.
