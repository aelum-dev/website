# Aelum-Web — Design & content rules

Deep dive behind the short rules in `../AGENTS.md`. Read this before touching layout, copy, motion or theme.

## Routes & pages

- **Real routes, one Astro page each.** `src/pages/` → `/` (`index.astro`), `/download/`,
  `/install/`, `/features/`, `/faq/`; `404.astro` is the fallback. `astro.config.mjs` uses
  `build.format: "directory"` + `trailingSlash: "always"` so a route is built as
  `download/index.html` and served at `/download/` — GitHub Pages serves directory indexes but
  **not** extensionless paths, so this is the combination that works there. The nav is
  `navLinks` in `site.ts`; `Layout` marks the active item server-side (`aria-current="page"`), so
  the active state is correct with JS off. Adding a page = a new file in `src/pages/` + one entry in
  `navLinks`.
- **Reference `public/` assets from the site root** (`/logo.svg`, `/images/…`, `/scripts/…`).
  Relative paths (`logo.svg`) break on nested routes: from `/download/` they resolve to
  `/download/logo.svg` and 404. Canonical/absolute URLs (OG images) still come from `Astro.url`.
- **Styling** is split across `src/styles/`: `base.css` holds the design system tokens (colors, type,
  layout, glassy cards, ambient background); per-section files (`home.css`, `download.css`,
  `features.css`, `install.css`, `faq.css`) hold the rest. Each page imports `base.css` plus only its own
  section CSS, so Astro emits a shared chunk for `base.css` and per-page CSS for the rest — keep
  section styles in their own file and the payload stays small. Add tokens/classes here rather than
  inline styles.
- **Layout & chrome** in `src/layouts/Layout.astro`: the `<head>` boilerplate (meta, OG/Twitter,
  favicon, theme script) **and** the site chrome (skip link, the ambient background layers, the
  reading-progress bar, `Nav`, `<main>`, `CTA`, `Footer`). A page supplies only its title/description,
  an `active` page id, its own CSS imports and its sections. `showCta={false}` suppresses the
  call-to-action where the page already carries its own download buttons (Home, Download).

## Content & copy

- **Content lives in `src/lib/site.ts`.** Keep all copy (languages, links, nav, feature text) as
  exported data here and consume it from components — don't hardcode strings in templates. This makes
  reviews and edits easy.
- **Copy is written from the reader's side, never the software's.** The subject of a sentence is the
  user or their machine — "Boot the ISO and the installer is already opening", "Your whole disk is
  erased", "Boot an older state and the desktop asks whether to restore it" — not the product
  narrating its own verbs:
  "Launches the installer. Wipes the partition table. Sets a scale." Stacked subject-less verb
  fragments ("Wipes X. Builds Y. No terminal, no commands.") are the tell of machine-written copy;
  humans describe outcomes and give advice ("use it only on a disk that's yours alone"). Punchy
  titles are fine; running prose is not a feature log. Facts, numbers, sizes and commands are never
  softened or dropped for style.
- **The community links** (GitHub, Discord) live in `site.ts` (`githubUrl`, `discordUrl`) and are plain
  `<a>` in two places: `Nav.astro`'s `.nav-actions` (header) and the footer's Project column. In the
  header they are icon-first: the mark is a Nerd Fonts glyph from the self-hosted subset (`f09b`,
  `f1ff`), so a new one is `scripts/icons.py add <cp>` plus a commit of the rebuilt
  `src/styles/fonts/NerdFontsSymbols.woff2` — never a second icon set or an inline SVG. The icon-only
  form is `.nav-social`, and it hides together with `.nav-gl` at the compact breakpoint, where the name
  belongs in `aria-label`/`title` because there is no room for it. In the footer they are text links.
- **The FAQ is a data-driven accordion.** `FAQ.astro` renders `faqGroups` (in `site.ts`) as native
  `<details>`/`<summary>` — openable with no JavaScript, keyboard-operable, no accordion script — grouped
  by topic under a jump row of fragment links. Answer copy may carry `<code>` / `<strong>` and is rendered
  with `set:html` (the Download page's flash steps do the same); command blocks use `set:html` **on the
  `<pre>` itself**, because any text node a template leaves inside a `<pre>` is rendered — a formatted
  newline + indent before the `<code>` shows up as a blank line and an indent. `faq.astro` mirrors the same
  copy into `FAQPage` JSON-LD with the tags stripped. `download.astro` emits a `SoftwareApplication`
  built from `release.ts` (version, publish date, `fileSize`, `downloadUrl`, an `Offer` at 0) — the one
  page where structured data says something a search engine can act on. Answers restate what the repos
  actually do; a claim that is not in the installer or the profile does not belong on this page.

## Components

- **Sections are components** under `src/components/`, composed by the page that owns them:
  `/` → `Hero` + `Facts` + `Flow` + `Questions` · `/download/` → `Download` · `/install/` → `Install` + `DiskModes` + `Languages` + `CLI` ·
  `/features/` → `Desktop` + `Look` + `Features` · `/faq/` → `FAQ`.
  Each section is a small `.astro` component. Add new sections as new components and insert them in
  the page. `Card.astro` is the **one** card of the site — every icon-headed card on every page renders
  through it (`size="md"` is the default, so a plain card grid is the home facts row; `num=` gives the
  numbered install-step variant; `interactive={false}` for content panels like the Download page's; the
  named `head` slot holds a head's right-edge control). Its chrome — surface, head, the 0.85rem
  head→body air, rim/glow — is owned by base.css → Cards; a section stylesheet adds only a grid preset
  (`--cell-min`/`--grid-gap`) and slot-content styles, **never card head spacing or body margins** (that
  restatement is what made every card tweak a three-page fix). `CopyButton.astro` (clipboard button with
  copy/check icons) is the other reusable building block.
  `Facts.astro` (the four first-visit
  answers) and `Questions.astro` (the closing FAQ/Discord step) are home-only and read
  `homeFacts`/`homeClosing` from `site.ts`; `Flow.astro` (the three-move strip) is home-only and
  reads `flow` from `site.ts`.
- **Screenshots go through `Shot.astro`, never a raw `<img>`.** Pass the manifest keys
  (`light="installer-step-3-light" dark="installer-step-3-dark"`). The emitted `<picture>` serves the
  **dark** derivatives — the theme every visitor gets before they have chosen anything — and carries
  the light set in `data-aelum-*` attributes; `theme.js` writes the matching set whenever it applies a
  theme. Two things this replaces, both of which were wrong:
  - `media="(prefers-color-scheme: dark)"` selects by the **operating system**, but the site's theme
    is its own dark-first choice, so an OS-light visitor saw a light screenshot inside the dark site.
  - Two `<img>` tags with one hidden by CSS: hidden images are still downloaded.
  A screenshot with no dark counterpart gets no `data-aelum-*` attributes and is never swapped.
  Pass `defer` for a screenshot that is **not visible yet** (the install walkthrough's slides 2–7):
  the `<picture>` carries both sets in `data-aelum-*` and loads nothing, and whatever makes it visible
  copies the matching pair into `srcset`/`src` and drops the `data-shot-defer` marker (`theme.js`
  skips deferred pictures; the promoted one is then owned by it like any other). `loading="lazy"` is
  not enough here — `visibility: hidden` still lays out a box, and a box in the viewport makes a
  browser fetch a lazy image: seven stacked slides fetched seven images, measured with a Chromium net
  log against a built page.

## Interactivity

- **Interactivity** is plain JS in `public/scripts/`:
  - `theme.js` / `theme-toggle.js` — light/dark theme + toggle (persisted in `localStorage`, defaults
    to dark). `theme.js` owns persistence, exposes `window.aelumTheme.get/set`, and is the only thing
    that rewrites theme-dependent screenshots (`syncImages`). The toggle is the only caller of `set`.
  - `app.js` — floating-nav scroll state + mobile menu + the nav's sliding active pill; the
    reading-progress bar (`--scroll` written on `.scroll-progress-bar`, the only reader of it); a
    scroll-reveal `IntersectionObserver` and the stagger indices it writes; the copy-to-clipboard
    handler; **one** rAF loop for every pointer effect (card glow, button spotlight, hero tilt,
    ambient spotlight); count-up on `[data-count]` numbers; and the section-liveness observer that
    pauses the decoration in whatever is off screen (see Motion has a budget). **It
    does not route:** which content exists is decided at build time, and no page switching happens in
    the browser.
- **Scroll reveal** is progressive enhancement: `.reveal` elements are fully visible without JS, and `html.js` hides then reveals them via the observer in `app.js`. Reduced-motion users see everything immediately. Keep this invariant — never hide content in a way that depends on JS running.
- **Groups stagger** with `data-stagger` on the container: `app.js` writes `--i` onto its direct
  `.reveal` children and `base.css` turns that into a transition delay. Order is still CSS; JS only
  supplies an index. Do not hand-write per-child delays in a section stylesheet.

## Theme & type

- **Theme is dark-first**: `theme.js` applies the persisted choice and falls back to **dark** when
  there is none; the OS `prefers-color-scheme` is deliberately not consulted for the initial value.
  Light is a fully designed scheme, not a degraded fallback.
- **The palette is frozen.** `--bg`, `--accent`, … in `base.css` are the exported Dux Shell
  light/dark scheme and must stay identical to the desktop's. Do not "improve" the colours here —
  change them in Dux Shell. Overhauls change type, layout and motion, not the scheme.
- **Type faces**: `Sora` (display — page and section titles only), `Nunito` (body — everything else,
  including card titles) and `JetBrains Mono` (commands, filenames, versions, checksums). All three
  are **variable with the `wght` axis clamped to the range the CSS asks for**, so no weight is ever
  faux-bolded by the browser; each `@font-face` declares its axis range (`font-weight: 400 900`) and
  an explicit `unicode-range` per cut. Rebuild with `bash scripts/build-fonts.sh` (fetches from
  `google/fonts`, subsets, prints the surviving axes) and commit the woff2 files — they are generated
  artifacts, like the rEFInd PNGs. OFL texts sit beside them.
- Reference families through `--font-display` / `--font-body` / `--font-mono`, never by face name in
  a component or section stylesheet. Keep every face self-hosted: no CDN, no hosted `@import`.
- **The two cuts every page renders text with are preloaded**: `Layout.astro` imports
  `sora-wght-latin.woff2` and `nunito-wght-latin.woff2` and emits `<link rel="preload" as="font"
  type="font/woff2" crossorigin>` for them. Importing them is the point — the href is then the build's
  content-hashed URL, the same string the CSS uses (`src/types/assets.d.ts` types `*.woff2`, which Astro
  does not). A browser only learns a font's URL after it has fetched *and parsed* the stylesheet, and
  every face here is `font-display: swap`, so without the preload the fetch is sequenced behind the CSS
  and the title repaints. Verified against a served `dist/` with a Chromium net log: with the two links
  the fonts are requested before the stylesheets; without them they come after. One request per asset
  either way — `crossorigin` is what keeps the preload and the CSS request the same fetch (without it
  they are two). The `unicode-range`-gated cuts (`nunito-wght-cyrillic`, `JetBrainsMono`,
  `NerdFontsSymbols`) are deliberately **not** preloaded: preloading them pays bytes for pages that may
  need none of them.

## Motion

- Material-You / glassy aelum mirroring the Aelum desktop (Hyprland + Dux Shell).
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
    features page ran 17 card rims and the install page ran a 56-chip marquee and a blinking terminal
    cursor while you were reading something else. `.loops-managed` is added only after the observer has classified every
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
