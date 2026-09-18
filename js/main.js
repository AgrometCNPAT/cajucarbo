/* ============================================================
   main.js — parallax da hero, indicador de scroll e contadores de etapa
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Parallax suave da hero --- */
  const parallax = document.querySelector("[data-parallax]");
  if (parallax && !prefersReduced && window.innerWidth > 720) {
    let ticking = false;
    const update = () => {
      const offset = window.scrollY;
      // fator discreto: a imagem move ~18% da rolagem
      parallax.style.transform = "translate3d(0," + offset * 0.18 + "px,0) scale(1.12)";
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* --- Indicador de scroll: leva à próxima seção --- */
  const scrollHint = document.querySelector("[data-scroll-hint]");
  if (scrollHint) {
    scrollHint.addEventListener("click", () => {
      const target = document.querySelector(scrollHint.dataset.scrollHint || "#projeto");
      if (target) target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* --- Cards de metodologia: expandem detalhes ao focar/tocar --- */
  document.querySelectorAll("[data-step]").forEach((card) => {
    card.addEventListener("click", () => {
      const open = card.classList.toggle("expanded");
      card.setAttribute("aria-expanded", String(open));
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  /* --- Ano dinâmico no rodapé --- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Validação do formulário de contato --- */
  const form = document.getElementById("form-contato");
  if (form) {
    const sucesso = form.querySelector("[data-sucesso]");
    if (sucesso) sucesso.setAttribute("tabindex", "-1");
    const setErro = (name, msg) => {
      const el = form.querySelector('[data-erro="' + name + '"]');
      const field = form.querySelector('[name="' + name + '"]');
      if (el) el.textContent = msg || "";
      if (field) field.setAttribute("aria-invalid", msg ? "true" : "false");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (sucesso) sucesso.hidden = true;
      let ok = true;
      const data = new FormData(form);

      const nome = (data.get("nome") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const assunto = (data.get("assunto") || "").toString().trim();
      const mensagem = (data.get("mensagem") || "").toString().trim();

      setErro("nome", nome ? "" : "Informe seu nome.");
      if (!nome) ok = false;

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setErro("email", emailValido ? "" : "Informe um e-mail válido.");
      if (!emailValido) ok = false;

      setErro("assunto", assunto ? "" : "Selecione um assunto.");
      if (!assunto) ok = false;

      setErro("mensagem", mensagem.length >= 10 ? "" : "Escreva ao menos 10 caracteres.");
      if (mensagem.length < 10) ok = false;

      if (ok) {
        form.reset();
        if (sucesso) {
          sucesso.hidden = false;
          sucesso.focus?.();
        }
      }
    });
  }
})();
