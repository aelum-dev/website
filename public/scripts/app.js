// Client-side router for the Aelum site.
//
// The site is a single HTML shell that ships every page server-side (so all
// content is present on first load). This script switches between them by
// hash without a page reload: it toggles the `.active` page, highlights the
// matching nav link, updates the document title, scrolls to the top, and
// re-runs the scroll-reveal so animations fire on the newly shown page.
//
// Progressive enhancement: with no JS, every page renders (falling back to a
// scroll view). With JS, only the active page shows. Deep links and the
// browser back/forward buttons work via the history API.

const PAGES = [
  {
    id: "home",
    title: "Aelum — an Arch Linux distro with an offline installer",
  },
  { id: "download", title: "Download Aelum — verify the ISO" },
  { id: "install", title: "Install Aelum — a few questions. That's it." },
  { id: "features", title: "Features — a painless, offline install" },
];
const DEFAULT_PAGE = "home";

const validId = (raw) => {
  const id = (raw || "").replace(/^#/, "");
  return PAGES.some((p) => p.id === id) ? id : DEFAULT_PAGE;
};

// Switch to the given page id. `push` records the change in session history
// so back/forward work; the initial load and popstate handling pass false.
function go(id, push = true) {
  const next = validId(id);

  document.querySelectorAll(".page").forEach((el) => {
    el.classList.toggle("active", el.id === next);
  });

  document
    .querySelectorAll(".nav-links a[data-page]")
    .forEach((el) => {
      el.classList.toggle("active", el.dataset.page === next);
    });

  const page = PAGES.find((p) => p.id === next);
  if (page) document.title = page.title;

  if (push) {
    history.pushState({ page: next }, "", "#" + next);
  }

  window.scrollTo({ top: 0 });

  // Re-run scroll-reveal for the now-visible page. reveal.js exposes this.
  if (typeof window.initReveals === "function") window.initReveals();
}

// Nav clicks (both the top nav links and the brand logo) switch pages.
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-page]");
  if (!link) return;
  event.preventDefault();
  go(link.dataset.page);
});

// Browser back / forward, and any programmatic hash change.
window.addEventListener("popstate", () => {
  go(location.hash, false);
});

// Initial route from the current hash (or the home page).
go(location.hash, false);
