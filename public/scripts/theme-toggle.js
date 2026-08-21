// Wires up the light/dark toggle button. Expects an element with
// data-theme-toggle (the icon button). Each click flips light <-> dark and
// persists the choice to localStorage.

(function () {
  const STORAGE_KEY = 'aestheticos-theme';

  function current() {
    return document.documentElement.getAttribute('data-theme');
  }

  function set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#151114' : '#faf7f6');
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    // The button toggles light <-> dark; "auto" follows the OS.
    const next = current() === 'dark' ? 'light' : 'dark';
    set(next);
  });
})();
