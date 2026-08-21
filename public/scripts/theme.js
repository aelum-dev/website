// Theme switcher: applies a persisted (or system-derived) theme with no flash.
// Stores the choice in localStorage under "aestheticos-theme".

(function () {
  const ROOT = document.documentElement;
  const STORAGE_KEY = 'aestheticos-theme';

  // Resolve the theme to apply. Explicit stored choice wins; otherwise follow
  // the OS / browser preference.
  function resolve() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (_) {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  const theme = resolve();
  // Apply immediately, before first paint, to avoid a flash of the wrong theme.
  ROOT.setAttribute('data-theme', theme);

  // Keep the meta theme-color in sync with the active theme.
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#151114' : '#faf7f6');
    metaTheme.setAttribute('name', 'theme-color');
  }

  // Listen for OS-level changes when the user hasn't made an explicit choice.
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemChange = (e) => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        ROOT.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        if (metaTheme) metaTheme.setAttribute('content', e.matches ? '#151114' : '#faf7f6');
      }
    } catch (_) {}
  };
  if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', onSystemChange);
  else if (mediaQuery.addListener) mediaQuery.addListener(onSystemChange); // Safari < 14
})();
