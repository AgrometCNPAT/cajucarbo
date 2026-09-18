/* ============================================================
   animations.js — revelações ao entrar no viewport
   Suporta [data-reveal] e agrupamento em cascata via [data-reveal-group]
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll("[data-reveal]");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }

  /* Aplica atraso escalonado a filhos de um grupo */
  document.querySelectorAll("[data-reveal-group]").forEach((group) => {
    const children = group.querySelectorAll("[data-reveal]");
    children.forEach((child, i) => {
      child.style.transitionDelay = (i * 90) + "ms";
    });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();
