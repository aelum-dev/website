// Wires up the light/dark toggle button. Expects an element with
// data-theme-toggle (the icon button). Each click flips light <-> dark and
// persists the choice to localStorage. A radial "ink" morph overlays the
// switch for a smooth, satisfying transition.

(() => {
  const STORAGE_KEY = "aelum-theme";
  const ROOT = document.documentElement;
  const TOGGLE = document.querySelector("[data-theme-toggle]");

  // Full-screen background color for each scheme (mirrors the --bg tokens and
  // the meta theme-color values in theme.js / Layout.astro).
  const THEME_COLORS = {
    dark: "#151114",
    light: "#faf7f6",
  };

  function current() {
    return ROOT.getAttribute("data-theme");
  }

  // Reflect the active scheme on the control itself. The icons are aria-hidden
  // and shown/hidden with CSS only, so assistive tech would otherwise see a
  // stateless button. aria-pressed names the current scheme; the label names
  // the action the next click performs.
  function syncControl(theme) {
    if (!TOGGLE) return;
    TOGGLE.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    TOGGLE.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  function set(theme) {
    ROOT.setAttribute("data-theme", theme);
    syncControl(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#151114" : "#faf7f6");
  }

  // Radial ink wipe tinted with the destination theme color. Dark morphs in
  // from the top-left corner, light from the bottom-right. The underlying
  // colors also crossfade via CSS variable transitions in global.css; this
  // layer makes the change legible.
  function morph(theme) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const color = THEME_COLORS[theme];
    if (!color) return;

    const overlay = document.createElement("div");
    overlay.className = "theme-morph";
    const blob = document.createElement("div");
    // Dark morphs in from the top-left; light from the bottom-right.
    blob.className = theme === "light" ? "blob blob--br" : "blob";
    blob.style.background = color;
    overlay.appendChild(blob);
    document.body.appendChild(overlay);

    // Force reflow so the animation plays from its initial state.
    void blob.offsetWidth;
    requestAnimationFrame(() => overlay.classList.add("active"));

    const stated = parseInt(getComputedStyle(ROOT).getPropertyValue("--theme-duration"), 10);
    const duration = Number.isFinite(stated) ? stated : 650;
    setTimeout(() => overlay.remove(), duration + 80);
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    // Flip light <-> dark. The initial theme still follows the OS unless the
    // user has made an explicit choice (see theme.js); this button just toggles.
    const next = current() === "dark" ? "light" : "dark";
    set(next);
    morph(next);
  });

  // Initialise the control's state from the theme applied before paint by
  // theme.js (data-theme is set by then).
  syncControl(current());
})();
