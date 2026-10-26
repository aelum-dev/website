// Theme switcher: applies the active theme before first paint, with no flash.
// Stores the choice in localStorage under "aelum-theme".
//
// The site is dark-first: with no stored choice it renders dark. The light
// scheme is fully supported and is what an explicit choice selects — it is not
// a degraded fallback. The OS `prefers-color-scheme` is deliberately NOT used
// for the initial value, because "dark first" only holds if the default is
// actually dark; the toggle is the one place a user states a preference.

(() => {
  const ROOT = document.documentElement;
  const STORAGE_KEY = "aelum-theme";
  const META_CONTENT = { dark: "#141218", light: "#fff7f9" };

  function stored() {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      return v === "light" ? "light" : v === "dark" ? "dark" : null;
    } catch (_) {
      return null;
    }
  }

  function apply(theme) {
    ROOT.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", META_CONTENT[theme]);
  }

  apply(stored() || "dark");

  // Exposed so theme-toggle.js (and any future control) drives the same state
  // instead of duplicating the storage rules.
  window.aelumTheme = {
    get: () => ROOT.getAttribute("data-theme") || "dark",
    set: (theme) => {
      apply(theme);
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch (_) {}
    },
  };
})();
