// Theme switcher: applies the active theme before first paint, with no flash.
// Stores the choice in localStorage under "aelum-theme".
//
// The site is dark-first: with no stored choice it renders dark. The light
// scheme is fully supported and is what an explicit choice selects — it is not a
// degraded fallback. The OS `prefers-color-scheme` is deliberately NOT used for
// the initial value, because "dark first" only holds if the default is actually
// dark; the toggle is the one place a user states a preference.
//
// This file also owns the theme-dependent screenshots. Shot.astro serves the
// dark derivatives and stores the light set on the <picture>; syncImages() is
// the only thing that ever rewrites them, so a screenshot can never disagree
// with the theme the page is actually in.

(() => {
  const ROOT = document.documentElement;
  const STORAGE_KEY = "aelum-theme";
  const META_CONTENT = { dark: "#141218", light: "#fff7f9" };
  const SHOTS = "picture[data-aelum-avif-light]";

  function stored() {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      return v === "light" ? "light" : v === "dark" ? "dark" : null;
    } catch (_) {
      return null;
    }
  }

  // Point every screenshot at the set matching `theme`. Values are compared
  // first: writing the same srcset back would re-fetch images that are already
  // correct, which is the whole thing this is trying to avoid.
  function syncImages(theme) {
    if (!document.body) return; // head script: the pictures are not parsed yet
    const useLight = theme === "light";
    for (const picture of document.querySelectorAll(SHOTS)) {
      const avif = useLight ? picture.dataset.aelumAvifLight : picture.dataset.aelumAvifDark;
      const src = useLight ? picture.dataset.aelumSrcLight : picture.dataset.aelumSrcDark;
      if (!avif || !src) continue;

      const source = picture.querySelector('source[data-aelum-type="avif"]');
      if (source && source.getAttribute("srcset") !== avif) source.setAttribute("srcset", avif);

      const img = picture.querySelector("img");
      if (img && img.getAttribute("src") !== src) img.setAttribute("src", src);
    }
  }

  function apply(theme, animate) {
    // The colour crossfade that accompanies a switch is opt-in. base.css gives
    // elements their colour transition only while <html> carries .theme-anim,
    // so the site does not carry transition machinery on every element all the
    // time (see base.css → the .theme-anim rule).
    //
    // The initial apply() below deliberately passes nothing: nothing should fade
    // into place on load, the page should simply be in the theme you asked for.
    if (animate) startColorMorph();
    ROOT.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", META_CONTENT[theme]);
    syncImages(theme);
  }

  apply(stored() || "dark");

  // The first apply() runs in <head>, before any <picture> exists. This is the
  // pass that makes a stored light choice correct on the page itself.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => syncImages(ROOT.getAttribute("data-theme") || "dark"));
  }

  // Mirrors --theme-duration in base.css (read from the stylesheet when there is
  // one, with the same fallback theme-toggle.js uses) plus enough margin for the
  // last colour transition to finish before the class comes off.
  const FALLBACK_DURATION = 650;
  let morphTimer = null;

  function startColorMorph() {
    ROOT.classList.add("theme-anim");
    if (morphTimer) clearTimeout(morphTimer);
    const stated = parseInt(getComputedStyle(ROOT).getPropertyValue("--theme-duration"), 10);
    const duration = Number.isFinite(stated) ? stated : FALLBACK_DURATION;
    morphTimer = setTimeout(() => ROOT.classList.remove("theme-anim"), duration + 120);
  }

  // Exposed so theme-toggle.js (and any future control) drives the same state
  // instead of duplicating the storage rules. set() is the one path that animates.
  window.aelumTheme = {
    get: () => ROOT.getAttribute("data-theme") || "dark",
    set: (theme) => {
      apply(theme, true);
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch (_) {}
    },
  };
})();
