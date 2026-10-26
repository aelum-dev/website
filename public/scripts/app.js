// Client-side behaviour for the Aelum site.
//
// Page switching is NOT here: the site is real Astro routes (/download/,
// /install/, /features/), so which content exists is decided at build time and
// the active nav item is marked in the HTML. What remains is everything that
// needs a browser:
//   1. Floating-nav scroll state + mobile menu.
//   2. Scroll reveal for `.reveal` elements.
//   3. Copy-to-clipboard controls.
//   4. Pointer-tracked glow on interactive cards.

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
