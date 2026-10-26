// Client-side behaviour for the Aelum site.
//
// Page switching is NOT here: the site is real Astro routes (/download/,
// /install/, /features/), so which content exists is decided at build time and
// the active nav item is marked in the HTML. What remains is everything that
// needs a browser:
//   1. Floating-nav scroll state + mobile menu + reading progress.
//   2. Scroll reveal for `.reveal` elements, staggered inside [data-stagger].
//   3. Copy-to-clipboard controls.
//   4. Pointer-tracked glow on interactive cards, card tilt, ambient spotlight.
//   5. Count-up on stat numbers.
//
// Everything below is decoration: with JavaScript off the page is complete and
// readable, and every one of these respects prefers-reduced-motion.

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------------------------------------------------------------------------
// Floating nav: deepen the bar on scroll, and drive the mobile menu.
// ---------------------------------------------------------------------------
(() => {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const root = document.documentElement;
  let ticking = false;

  const update = () => {
    ticking = false;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);

    // Reading progress for the nav's progress bar (0…1).
    const max = root.scrollHeight - window.innerHeight;
    root.style.setProperty("--scroll", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();

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
// The nav's sliding pill.
//
// It rests on the active link, follows the pointer while the pointer is inside
// the menu, and returns when the pointer or focus leaves. It is decoration: the
// real active state is aria-current plus the CSS .active rule, so a page without
// this script still shows which page you are on.
// ---------------------------------------------------------------------------
(() => {
  const nav = document.querySelector("[data-nav]");
  const menu = nav && nav.querySelector("[data-nav-menu]");
  const indicator = menu && menu.querySelector(".nav-indicator");
  if (!indicator) return;

  const anchors = Array.from(menu.querySelectorAll("a"));
  if (!anchors.length) return;

  const resting = menu.querySelector("a.active") || anchors[0];

  const place = (el) => {
    if (!el) return;
    const box = menu.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    indicator.style.width = `${b.width}px`;
    indicator.style.height = `${b.height}px`;
    indicator.style.transform = `translate(${b.left - box.left}px, ${b.top - box.top}px)`;
    menu.classList.add("is-ready");
  };

  const rest = () => place(resting);

  for (const a of anchors) {
    a.addEventListener("pointerenter", () => place(a));
    a.addEventListener("focus", () => place(a));
  }
  menu.addEventListener("pointerleave", rest);
  menu.addEventListener("focusout", rest);

  window.addEventListener("resize", rest);

  // Variable fonts land after first paint and change every label's width, so
  // re-measure once they are in.
  place(resting);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rest);
})();

// ---------------------------------------------------------------------------
// Scroll reveal — progressive enhancement. Content is visible by default;
// `.reveal` elements fade/slide in once, when they enter the viewport.
// Children of a [data-stagger] container get an index (--i) that base.css turns
// into a transition delay, so a grid arrives in order instead of all at once.
// ---------------------------------------------------------------------------
(() => {
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    group.querySelectorAll(":scope > .reveal").forEach((el, i) => {
      el.style.setProperty("--i", String(i));
    });
  });

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

// ---------------------------------------------------------------------------
// Ambient spotlight + card tilt.
//
// Both write numbers only; the CSS decides what those numbers look like. The
// spotlight is written on the document (inherited by .bg-spot), the tilt on the
// element that asked for it. A single rAF-coalesced handler serves every pointer
// move on the page.
// ---------------------------------------------------------------------------
(() => {
  if (reducedMotion) return;

  const root = document.documentElement;
  const spot = root.querySelector(".bg-spot");
  const tiltables = Array.from(document.querySelectorAll("[data-tilt]"));
  if (!spot && !tiltables.length) return;

  let pending = null;

  const apply = () => {
    pending = null;
    if (spot) {
      // Offset from the viewport centre. The multipliers are what make the
      // effect legible: at 0.1 the spotlight moved ~80px across a 1440px window
      // and read as nothing at all.
      root.style.setProperty("--spot-x", `${(window.innerWidth / 2 - pointer.x) * -0.3}px`);
      root.style.setProperty("--spot-y", `${(window.innerHeight / 2 - pointer.y) * -0.22}px`);
    }
    for (const el of tiltables) {
      if (!el.dataset.tiltActive) continue;
      const rect = el.getBoundingClientRect();
      const nx = (pointer.x - rect.left) / rect.width - 0.5;
      const ny = (pointer.y - rect.top) / rect.height - 0.5;
      el.style.setProperty("--tilt-y", `${(nx * 9).toFixed(2)}deg`);
      el.style.setProperty("--tilt-x", `${(-ny * 7).toFixed(2)}deg`);
    }
  };

  const pointer = { x: 0, y: 0 };

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if (!pending) pending = requestAnimationFrame(apply);
  });

  for (const el of tiltables) {
    el.addEventListener("pointerenter", () => {
      el.dataset.tiltActive = "1";
    });
    el.addEventListener("pointerleave", () => {
      delete el.dataset.tiltActive;
      el.style.removeProperty("--tilt-x");
      el.style.removeProperty("--tilt-y");
    });
  }
})();

// ---------------------------------------------------------------------------
// Count-up on stat numbers. The final value is already in the HTML (that is
// what a no-JS visitor reads), so this only ever animates from 0 towards text
// the page already contains. data-decimals keeps "3.83" at two places.
// ---------------------------------------------------------------------------
(() => {
  if (reducedMotion) return;
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;

  const run = (el) => {
    const target = Number.parseFloat(el.dataset.count);
    if (!Number.isFinite(target)) return;

    const decimals = Number.parseInt(el.dataset.decimals ?? "0", 10) || 0;
    // Anything before the number in the markup (a "~") is kept verbatim.
    const prefix = (el.textContent.match(/^[^\d]*/) || [""])[0];
    const duration = 1100;
    const start = performance.now();

    const frame = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      el.textContent = prefix + (target * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        run(entry.target);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.4 },
  );

  els.forEach((el) => io.observe(el));
})();
