const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initBackToTop() {
  const lang = document.documentElement.lang === "en" ? "en" : "es";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", lang === "en" ? "Back to top" : "Volver arriba");
  btn.innerHTML = "&uarr;";
  document.body.appendChild(btn);

  const toggle = () => btn.classList.toggle("is-visible", window.scrollY > 500);
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}

// El número final ya está en el HTML (para que se lea bien sin JS); aquí solo
// se anima visualmente desde 0 hasta ese valor, sin depender del scroll.
function initStatCounters() {
  const stats = document.querySelectorAll(".stat-number[data-count-to]");
  if (!stats.length || prefersReducedMotion) return;

  stats.forEach(el => {
    const target = Number(el.dataset.countTo || el.textContent || 0);
    if (!target) return;

    const duration = 900;
    const start = performance.now();
    el.textContent = "0";

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initBackToTop();
  initStatCounters();
});
