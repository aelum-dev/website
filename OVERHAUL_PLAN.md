# Aelum site overhaul — plan

Status: **PR 1 ✅ · PR 2 ✅ · next is PR 3 (Hero)**. §7 records what was decided; §9 is one open
question the decisions surfaced.

---

## 0. What PR 1 (Foundation) already changed

Shipped in the working tree:

- **Real variable faces, axes clamped.** `scripts/build-fonts.sh` builds
  `sora-wght-latin.woff2` (wght 400–800), `nunito-wght-latin.woff2` and
  `nunito-wght-cyrillic.woff2` (wght 400–900) from `google/fonts`, with Google's own subsetting
  ranges. The static `nunito-v16-*-regular.woff2` files are deleted. Faux-bold is now structurally
  impossible: each `@font-face` declares its axis range and an explicit `unicode-range` per cut.
- **Sora is the display voice** (page + section titles), Nunito stays the reading voice (everything
  else, card titles included), JetBrains Mono stays the engineering voice. Families are referenced
  only through `--font-display` / `--font-body` / `--font-mono`.
- **Named fluid type scale** (`--text-display-1/2`, `--title-2`, `--lead`, `--text-small`,
  `--text-micro`) and tracking tokens (`--track-display/title/tight/wide`); a `.nums` helper sets
  tabular figures for sizes, versions and checksums.
- **Aurora deleted.** No orbs, no keyframes, no decorative grid, no grain. `.bg-field` is two fixed
  radial washes with the light source at the top of the document.
- **Dark-first default.** `theme.js` now falls back to dark instead of the OS preference, and owns
  persistence behind `window.aelumTheme.get/set`; `theme-toggle.js` only flips.
- OG image re-exported from `scripts/og-image.html` (it now draws Sora too).
- `AGENTS.md` updated: the palette is documented as **frozen**, and the font pipeline is documented.

Verified: `npm run build` clean, `npm run check` clean (biome + `astro check`, 0 errors), rendered at
1440×1000 in both schemes.

### PR 2 — real routes ✅ done

The hash router is gone. `src/pages/` is now `/`, `/download/`, `/install/`, `/features/` built as
directories (`build.format: "directory"` + `trailingSlash: "always"` — GitHub Pages serves directory
indexes but not extensionless paths).

- `Layout.astro` owns the **chrome**, not just the head: skip link, ambient background, `Nav`,
  `<main>`, `CTA`, `Footer`. A page supplies metadata, its `active` id, its own CSS imports and its
  sections (`showCta={false}` where a download CTA would be redundant).
- Nav/footer links come from `navLinks` in `site.ts`; the active item is marked **server-side** with
  `aria-current="page"`, so it is correct with JS off. `app.js` lost its router, its title rewriting
  and its hash handling — it no longer decides what renders.
- **Asset paths are now absolute from the site root** (`/logo.svg`, `/images/…`, `/scripts/…`).
  Relative paths break on nested routes: from `/download/` they resolve to `/download/logo.svg`.
  This reverses the old "use relative paths" convention; both AGENTS.md files now say so.
- `sitemap.filter` was a no-op (a filter decides inclusion, it never rewrites a URL). Replaced with
  `extendSitemap` dropping the 404; the directory output already yields clean
  `https://aelum.dev/download/` URLs.
- Payload per page: home is 13 KB HTML + 20 KB shared CSS, versus 50 KB HTML + 54 KB CSS before.

Verified: all four routes 200, unknown route 404, active nav state correct on each page, screenshots
rendered for `/`, `/download/`, `/install/`, `/features/` at 1440 px, `npm run check` clean.

---

---

## 1. Diagnosis — what actually makes the current site look dated

Concrete findings from the current tree (`src/styles/base.css`, `src/components/*`, `dist/`):

| # | Finding | Evidence |
|---|---------|----------|
| 1 | **Every heading is faux-bold.** `base.css` declares Nunito at `font-weight: 400` only, then asks for 600/700/800 in ~10 rules. The browser synthesizes the bold. This is the single biggest "not modern" tell on the page. | `base.css:15,26` (400 only) vs `base.css:338,352,401,750…` (700/800) |
| 2 | A variable-Nunito build already existed and was lost. `dist/_astro/` contains `nunito-v32-latin-wght…woff2` from a stale build; HEAD only has `nunito-v16-*-regular.woff2`. | `git ls-tree HEAD src/styles/fonts` |
| 3 | **Aurora cliché.** Three blurred drifting orbs + a faded 66 px grid = generic 2021 glassmorphism. It says "any SaaS landing page", not "Arch distro". | `base.css:237–320` |
| 4 | **Uniform card grids.** 9 identical glass cards (Features), 8 identical (Software), 6 identical (Install steps). No hierarchy, nothing to look at, everything the same size. | `site.ts` `features[]` / `software[]` / `installSteps[]` → `Card.astro` |
| 5 | **The product's wow is asserted, not shown.** The hero is a static fastfetch screenshot. The actual story — a full Arch install in ~60 s with zero network — is never demonstrated. | `Hero.astro` |
| 6 | **Heavy first paint.** 1.39 MB of hero PNGs (600 KB light + 788 KB dark), both `loading="eager" fetchpriority="high"` at 2560×1440 — both themes download regardless of which one is visible. Whole first load ≈ 1.6 MB. | `public/images/hero-*.png`, `Hero.astro` |
| 7 | **Flat IA.** Four hash "pages" of equal weight; Download opens with two sections of verification plumbing before the product has sold anything. | `index.astro`, `Download.astro` (337 lines) |
| 8 | **The differentiator has no story.** "Offline mirror embedded in the ISO" — the only genuinely unusual thing about Aelum — is one bullet in a card grid. | `site.ts` feature #1 |

What's already good and should be **kept**: the radial "ink" theme morph, the copy-in-`site.ts`
convention, the generated `release.ts` + WKD + `verifyCommands` chain, the no-JS fallback, the
offline-first constraint, the DMS-derived palette as a base.

---

## 2. Design target

**Direction: "Quiet machine."** Dark-first deep-ink canvas, one high-chroma accent, extreme type
contrast (large tight display type against small precise mono), bento layout, and motion that
*demonstrates the product* instead of decorating the page. Reference feel: Linear / Vercel /
Raycast marketing pages crossed with an Arch aesthetic — engineered, restrained, fast.

Explicitly **out**: aurora blobs, heavy frosted glass everywhere, gradient-painted headlines as the
default voice, decorative 3D, stock illustration, film grain.

Non-negotiables (unchanged by this overhaul):
- **The palette is not part of this overhaul.** `--bg`, `--accent`, … are the exported
  DankMaterialShell light/dark scheme and are the *distro's* colours, not a website design choice.
  Dark-first means the default theme is dark; it does not mean the dark scheme gets recoloured.
- Fully offline: no CDN, no API, no build-time network. Self-hosted subset fonts only.
- All copy stays in `src/lib/site.ts`; components consume data.
- `release.ts` / `release-type.ts` / WKD / `verifyCommands` are never hand-edited.
- Progressive enhancement: with JS off every section is present and readable.
- `prefers-reduced-motion` → no animation, full content.
- Static Astro build on GitHub Pages, vanilla JS only (no framework components).

---

## 3. The eight moves

Each is independently shippable; each leaves the site better on its own.

### M1 — Type system ✅ done
- Variable Nunito (`wght` 400–900, Latin + Cyrillic) shipped; the faux-bold problem is gone.
- **Sora** (OFL, Latin subset, 22 KB) carries page and section titles only; card titles deliberately
  stay in Nunito — the contrast between the two faces is what gives hierarchy without making every
  heading the same size.
- Fluid scale with negative tracking at large sizes, `text-wrap: balance`, tabular numerals for
  measurements. JetBrains Mono kept as the engineering voice, and now used for eyebrows/labels.

### M2 — Canvas ✅ done (palette untouched)
- Palette left exactly as the DMS export — see the frozen-palette rule in §2.
- The three orbs, their keyframes and the 66 px grid are deleted; no film grain. `.bg-field` is now
  two fixed radial washes: depth from a light source at the top of the document, zero animation.
- Still to do here: swap blur-heavy glass for **gradient hairline borders** + an inner 1 px highlight
  (less blur, more edge), and add `--edge-hi` when the card surfaces are rebuilt.
- Motion duration tokens (`--t-fast/--t-base/--t-slow`) are in place.

### M3 — Hero: show the install
- Left column: headline, one-line lead, primary CTA, three **count-up stats** (60 s / 3.2 GB / 28
  languages) in tabular numerals.
- Right column: **live install demo** — a mock installer window in HTML/CSS/JS that runs the eight
  real steps against a 60 s timeline using the installer's real weights (3/2/37/50/2/4/1/1), with a
  progress bar, step ticks, and a final "reboot into Hyprland" state. ~120 lines of vanilla JS, no
  video, no new assets, loops with a pause control; static final state under reduced motion.
- Fallback ladder: live demo → animated scrub of the existing `installer-step-1..7` PNGs → single
  static screenshot.
- **Image pipeline**: hero/screenshots → AVIF + WebP fallback + `srcset` (2 widths), target
  < 120 KB per image, and only the active theme's variant fetched (`<picture media="(prefers-color-scheme: …)">`).

### M4 — Layout: bento, not grids
- **Features** → bento: one large tile carrying the offline story, 6–8 smaller tiles with varied
  spans. Drop the colored square behind every icon; use the glyph at a larger size or inline SVG.
- **New band: "How an offline install works"** — a 4-node SVG/CSS diagram (ISO → embedded mirror →
  pacman → disk) with the ~1 min timing. This is the differentiator; give it a full-width band
  instead of a card.
- **Install** → sticky two-column scroller: step list on the left, pinned screenshot on the right
  that swaps per step (CSS scroll-driven animation with an IntersectionObserver fallback). Uses the
  seven screenshots that already exist.
- **Desktop/Software** → horizontal marquee/scroller of the shipped stack with links to each
  project; delete the 8-card grid.

### M5 — Download: one confident block
- Merge the two current sections into one: version + size + date set in display type, one primary
  download button, a compact three-command verify strip with copy buttons, and the sidecars as a
  tight table row set rather than cards.
- The WKD/`verifyCommands` logic is correct and generated — **do not change it**, only its layout.

### M6 — Motion system
- Upgrade the single `reveal` primitive into a **staggered** one (`--i` child index), and use
  `animation-timeline: view()` where supported with the existing IO as fallback.
- Extend the pointer spotlight (`--mx/--my`, already implemented) from `.card--interactive` to bento
  tiles and nav; add button press states and ≤ 4° card tilt.
- Keep the radial ink theme morph. Optionally upgrade it to a real View Transition where supported.
- Gate everything behind `prefers-reduced-motion`; gate grain/glass behind `prefers-reduced-transparency`.

### M7 — Nav & chrome
- Slimmer bar (66 → 56 px), solid-on-scroll instead of full glass, a sliding active-link indicator,
  cleaner mobile menu.
- Footer: three columns + a "verified release" strip carrying the key fingerprint.
- Re-export `public/og-image.png` from `scripts/og-image.html` after the type/palette change
  (required by `AGENTS.md` — the PNG must match the site).

### M8 — Perf & correctness hygiene
- Budget: **LCP asset < 150 KB, total first load < 600 KB** (today ≈ 1.6 MB).
- `loading="lazy"` below the fold; explicit `width/height` (already present) everywhere.
- Drop dead CSS from `base.css` (1169 lines, several rules belong to removed layouts).
- Add a small contrast check to `npm run check` (AA: 4.5:1 body, 3:1 large, both themes).

---

## 4. Phasing — five PRs, each independently shippable

| PR | Contents | Risk | Visible payoff |
|----|----------|------|----------------|
| **1 — Foundation** ✅ | M1 + M2: variable + display fonts, type scale, canvas, motion tokens. No markup changes beyond deleting the orbs. | low | the largest single visual lift |
| **2 — Routing** | Real Astro routes: `/`, `/download`, `/install`, `/features`, `/docs`. Delete the hash router from `app.js`; nav active state comes from the path; cross-section links become real links; `404.astro` rebuilt; per-page `<title>`/OG handled server-side. | medium | shareable URLs, real per-page metadata, smaller first paint |
| **3 — Hero** | M3: live install demo, `<picture>`/AVIF/`srcset`, stat counters. | medium | the page finally shows the product |
| **4 — Content layout** | M4: bento Features, offline diagram band, Install sticky scroller, stack marquee. | medium | kills the "identical cards" look |
| **5 — Docs + consolidation** | New `/docs` page; M5 Download merged; M6 motion polish; M7 nav/footer; OG re-export; `AGENTS.md` final pass. | low | coherence + perf |

`npm run check` (biome + `astro check`) gates every PR. Routing moves before the hero because the
hero, the nav and every cross-link change shape once pages are real documents.

---

## 5. Acceptance criteria

- No faux-bold anywhere: every `font-weight` used has a real face behind it.
- First load < 600 KB; LCP image < 150 KB; only the active theme's images fetched.
- JS off → every section present and readable; nothing depends on JS to be visible.
- `prefers-reduced-motion` → zero animation, full content, hero demo shown in its final state.
- WCAG AA contrast in both themes (4.5:1 body text, 3:1 large text).
- `npm run build` succeeds with the network off; `npm run check` clean.
- Reviewed at 390 / 768 / 1280 / 1920 px in both themes.

---

## 6. Explicitly not touching

`src/lib/release.ts`, `src/lib/release-type.ts`, the WKD tree, `verifyCommands`,
`docker/scripts/gen-release-metadata.sh` and friends, `.github/workflows/pages.yml`, `public/CNAME`,
`robots.txt`, and the `installer/` + `live-iso/` repos.

---

## 7. Decisions — locked

1. **Type**: Sora as the display face, Nunito as body. ✅ implemented.
2. **Theme**: dark-first default (explicit choice still respected), light designed in full. ✅
3. **IA**: real routes (`/download`, `/install`, `/features`, `/docs`). → PR 2.
4. **Docs**: in scope, as a real `/docs` page. → PR 5.
5. **Assets**: reuse the existing seven installer screenshots; no re-shoot. New formats only
   (AVIF/WebP + `srcset`), no new content.
6. **Texture**: no film grain. ✅ (and no orbs either)

Plus one constraint added during the work: **the palette is frozen** — it is the distro's colour
scheme, exported from DankMaterialShell, and is out of scope for the overhaul.

---

## 8. Main risk

Scope. This is eight moves; the failure mode is a half-finished redesign that mixes the old glass
system with the new one. Mitigation: strict PR boundaries per §4, and PR 1 must be complete (fonts,
type, canvas) before any layout work starts.

---

## 9. Open question: the reverted Material-3 build

`dist/` (built 2026-10-25, one day *after* the newest commit) is not a build of HEAD. It contains a
full Material-3 design system that is nowhere in git: `--md-*` tokens, oklch tonal palettes, state
layers, ripple, a sliding nav indicator, a snackbar, menus — and a **dynamic colour picker** with
five schemes (`aelum`, `ocean`, `moss`, `clay`, `grape`). It also used variable Nunito.

`AGENTS.md` explicitly says the opposite of that build ("There is no `tokens.css` and no `--md-*`
token layer", "No scheme picker / dynamic colour"), which reads like a deliberate rollback: the
dynamic-colour version was tried and removed because the site must carry the distro's one palette.

So: was that M3 build rejected on purpose, or lost by accident? It matters for PR 4/5, because that
build already solved things I was about to rebuild (state layers, nav indicator, elevation).

- If it was **rejected for the palette** (likely), the token *machinery* is still worth keeping:
  state layers, ripple, elevation and the sliding nav indicator can be re-added on top of the frozen
  DMS tokens, without any scheme picker.
- If it was **rejected wholesale**, I'll build the interaction layer by hand in `base.css` instead.

`dist/` is gitignored, so the only surviving copy of that work is the build output. Worth deciding
before PR 4 starts.
