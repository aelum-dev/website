// Client-side behaviour for the Aelum site.
//
// 1. Router — the site is a single HTML shell that ships every page
//    server-side (so all content is present on first load). This script
//    switches between them by hash without a page reload: it toggles the
//    `.active` page, highlights the matching nav link, updates the document
//    title, and scrolls to the top. Progressive enhancement: with no JS, every
//    page renders (a scroll view); with JS, only the active page shows.
// 2. Floating-nav scroll state + mobile menu.
// 3. Scroll reveal for `.reveal` elements.
// 4. Copy-to-clipboard controls.
// 5. Pointer-tracked glow on interactive cards.

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

  document.querySelectorAll("a[data-page]").forEach((el) => {
    el.classList.toggle("active", el.dataset.page === next);
  });

  const page = PAGES.find((p) => p.id === next);
  if (page) document.title = page.title;

  if (push) {
    history.pushState({ page: next }, "", `#${next}`);
  }

  window.scrollTo({ top: 0 });
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

go(location.hash, false);

// ---------------------------------------------------------------------------
// Floating nav: deepen the bar on scroll, and drive the mobile menu.
// ---------------------------------------------------------------------------
(() => {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = nav.querySelector("[data-nav-toggle]");
  if (!burger) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll(".nav-links a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-open") && !nav.contains(e.target)) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });
})();

// ---------------------------------------------------------------------------
// Scroll reveal — progressive enhancement. Content is visible by default;
// `.reveal` elements fade/slide in once, when they enter the viewport.
// ---------------------------------------------------------------------------
(() => {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => {
      el.classList.add("in");
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );

  els.forEach((el) => {
    io.observe(el);
  });
})();

// ---------------------------------------------------------------------------
// Copy-to-clipboard. Reads a literal `data-copy-value` or the text content of
// the element named by `data-copy-target`.
// ---------------------------------------------------------------------------
(() => {
  const copyText = (text) => {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      }
      ta.remove();
    });
  };

  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".copy-btn");
    if (!btn) return;

    let text = btn.dataset.copyValue;
    if (!text && btn.dataset.copyTarget) {
      const target = document.querySelector(btn.dataset.copyTarget);
      if (target) text = target.textContent.trim();
    }
    if (!text) return;

    copyText(text).then(
      () => {
        btn.classList.add("is-copied");
        setTimeout(() => btn.classList.remove("is-copied"), 1600);
      },
      () => {},
    );
  });
})();

// ---------------------------------------------------------------------------
// Pointer-tracked glow on interactive cards (sets --mx / --my).
// ---------------------------------------------------------------------------
document.addEventListener("pointermove", (event) => {
  const card = event.target.closest(".card--interactive");
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  card.style.setProperty("--my", `${event.clientY - rect.top}px`);
});
