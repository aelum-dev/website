// Client-side behaviour for the Aelum site.
//
// Page switching is NOT here: the site is real Astro routes (/download/,
// /install/, /features/), so which content exists is decided at build time and
// the active nav item is marked in the HTML. What remains is everything that
// needs a browser:
//   1. Floating-nav scroll state + mobile menu + reading progress.
//   2. Scroll reveal for `.reveal` elements, staggered inside [data-stagger].
//   3. Copy-to-clipboard controls.
//   4. Pointer effects — card glow, button spotlight, card tilt, ambient
//      spotlight — in one loop.
//   5. Count-up on stat numbers.
//   6. Which sections are on screen, so the loops inside them can pause.
//
// Everything below is decoration: with JavaScript off the page is complete and
// readable, and every one of these respects prefers-reduced-motion.
//
// Two rules run through all of it, because they are what the site's GPU bill
// actually came from:
//   - A custom property is written on the element that reads it. Writing one on
//     :root changes an inherited value, which invalidates inherited style for
//     every node in the document — on every pointer move, or every scroll.
//   - One requestAnimationFrame per frame, shared by everything that follows the
//     pointer, and no layout read (getBoundingClientRect) per pointer event.

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------------------------------------------------------------------------
// Floating nav: deepen the bar on scroll, and drive the mobile menu.
// The reading-progress bar is updated in the same rAF: --scroll is read by
// .scroll-progress-bar's own transform, so it is written on that element.
// ---------------------------------------------------------------------------
(() => {
  const nav = document.querySelector("[data-nav]");
  const bar = document.querySelector(".scroll-progress-bar");
  if (!nav && !bar) return;

  const root = document.documentElement;
  let ticking = false;

  const update = () => {
    ticking = false;
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
    if (!bar) return;

    // Reading progress for the current document (0…1).
    const max = root.scrollHeight - window.innerHeight;
    bar.style.setProperty("--scroll", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();

  if (!nav) return;

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
// Pointer effects — one loop for all three.
//
//   card glow       --mx / --my on the card the pointer is inside
//   btn spotlight   --mx / --my on the .btn the pointer is inside
//   card tilt       --tilt-x / --tilt-y on whatever asked for [data-tilt]
//   ambient spot    --spot-x / --spot-y on .bg-spot itself
//
// The card and the button read the same two property names on themselves, which
// is why they share one loop: a button inside a card is tracked separately from
// that card, so lighting the button never freezes the card's glow.
//
// Pointer events arrive coalesced: a 120 Hz device fires several between two
// frames, and each one used to do its own getBoundingClientRect and its own
// style writes. Here the events only record the latest position, and a single
// rAF applies it once. Layout is read at most once per frame per tracked
// element, and only while something is actually under the pointer — the cached
// rect is dropped whenever the page moves underneath the pointer instead.
// ---------------------------------------------------------------------------
(() => {
  const spot = document.querySelector(".bg-spot");
  const tiltables = Array.from(document.querySelectorAll("[data-tilt]"));

  const pointer = { x: 0, y: 0, seen: false };
  let glowCard = null;
  let glowRect = null;
  let litBtn = null;
  let litBtnRect = null;
  let pending = null;

  const apply = () => {
    pending = null;
    if (!pointer.seen) return;

    if (glowCard) {
      if (!glowRect) glowRect = glowCard.getBoundingClientRect();
      glowCard.style.setProperty("--mx", `${pointer.x - glowRect.left}px`);
      glowCard.style.setProperty("--my", `${pointer.y - glowRect.top}px`);
    }

    // Tilt and the two spotlights are motion; the card glow is a hover
    // affordance, so only those three bow out under prefers-reduced-motion. The
    // button write sits below the return for the same reason: base.css hides
    // .btn::after there, so coordinates written there would be work nobody reads.
    if (reducedMotion) return;

    if (litBtn) {
      if (!litBtnRect) litBtnRect = litBtn.getBoundingClientRect();
      litBtn.style.setProperty("--mx", `${pointer.x - litBtnRect.left}px`);
      litBtn.style.setProperty("--my", `${pointer.y - litBtnRect.top}px`);
    }

    if (spot) {
      // Offset from the viewport centre. The multipliers are what make the
      // effect legible: at 0.1 the spotlight moved ~80px across a 1440px window
      // and read as nothing at all.
      const spotX = (window.innerWidth / 2 - pointer.x) * -0.3;
      const spotY = (window.innerHeight / 2 - pointer.y) * -0.22;
      spot.style.setProperty("--spot-x", `${spotX}px`);
      spot.style.setProperty("--spot-y", `${spotY}px`);
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

  const schedule = () => {
    if (!pending) pending = requestAnimationFrame(apply);
  };

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.seen = true;

    const card = event.target.closest(".card--interactive");
    if (card !== glowCard) {
      glowCard = card;
      glowRect = null;
    }

    const btn = event.target.closest(".btn");
    if (btn !== litBtn) {
      litBtn = btn;
      litBtnRect = null;
    }

    schedule();
  });

  // A cached rect is only valid until the page moves under the pointer.
  const invalidate = () => {
    glowRect = null;
    litBtnRect = null;
    schedule();
  };
  window.addEventListener("scroll", invalidate, { passive: true });
  window.addEventListener("resize", invalidate, { passive: true });

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
// Which sections you can actually see.
//
// Every decorative loop on the site is infinite, and CSS has no way to know
// whether what it animates is on screen: the features page ran 17 card rims, a
// 56-chip marquee and a blinking terminal cursor at full cost while you were
// reading something else entirely. Each `.section` is marked .is-live while it
// intersects the viewport, and the stylesheets pause the loops inside any
// section that is not (see base.css → Off-screen loops).
//
// Every section, not `main .section`: the CTA band is site chrome rendered by
// Layout after </main>, and a selector that skipped it would leave its orbiting
// rim paused forever, on every page, with nothing ever asking for that.
//
// .loops-managed is added to <html> inside the FIRST callback, by which point
// every section has been classified. That ordering matters twice: it means no
// section is ever paused before it has been measured, and it means a page whose
// script never runs keeps every loop running — paused is something the script
// asks for, never the default.
// ---------------------------------------------------------------------------
(() => {
  const sections = document.querySelectorAll(".section");
  if (!sections.length || !("IntersectionObserver" in window)) return;

  let first = true;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.classList.toggle("is-live", entry.isIntersecting);
      if (first) {
        first = false;
        document.documentElement.classList.add("loops-managed");
      }
    },
    // A section 200px below the fold is about to be read: waiting until the last
    // moment makes its decoration visibly switch on as you scroll into it.
    { rootMargin: "200px 0px 200px 0px", threshold: 0 },
  );

  sections.forEach((section) => io.observe(section));
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
