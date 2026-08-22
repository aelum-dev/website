// Lightweight scroll-reveal. Gracefully no-ops if the browser lacks IntersectionObserver.
document.documentElement.classList.add("js");

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
