// Lightweight scroll-reveal. Gracefully no-ops if the browser lacks
// IntersectionObserver. Exposes `window.initReveals()` so the client router can
// re-run reveals after switching pages (hidden pages' elements don't intersect
// the viewport until they become visible).
document.documentElement.classList.add("js");

function initReveals() {
  const targets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && targets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    targets.forEach((el) => {
      observer.observe(el);
    });
  }
}

window.initReveals = initReveals;
initReveals();

// Restart the installer-demo video from the top every time the Install
// section scrolls into view (e.g. clicking "Install" in the nav).
function initRestartableVideo() {
  const video = document.querySelector(".install-visual video");
  if (!video || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      });
    },
    { threshold: 0.12 },
  );

  const section = document.querySelector("#install");
  observer.observe(section || video);
}

initRestartableVideo();
