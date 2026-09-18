/* ============================================================
   navigation.js — injeta cabeçalho/rodapé compartilhados,
   controla o header sticky, o menu mobile e a seção ativa.
   ============================================================ */
(function () {
  "use strict";

  const THEME_KEY = "cajucarbo-theme";
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    document.documentElement.dataset.theme = savedTheme;
  }

  /* Página atual (para marcar o link ativo) */
  const path = location.pathname.split("/").pop() || "index.html";

  const LINKS = [
    { href: "index.html", label: "Início" },
    { href: "projeto.html", label: "O Projeto" },
    { href: "metodologia.html", label: "Metodologia" },
    { href: "resultados.html", label: "Resultados" },
    { href: "publicacoes.html", label: "Publicações" },
    { href: "equipe.html", label: "Equipe" },
    { href: "contato.html", label: "Contato" },
  ];

  const navItems = LINKS.map((l) => {
    const classes = [];
    if (l.href === path) classes.push("active");
    const active = classes.filter(Boolean).length
      ? ' class="' + classes.filter(Boolean).join(" ") + '"' + (l.href === path ? ' aria-current="page"' : "")
      : "";
    return '<a href="' + l.href + '"' + active + ">" + l.label + "</a>";
  }).join("");

  const headerHTML =
    '<div class="container header-inner">' +
    '<a class="brand" href="index.html" aria-label="CajuCarbo — página inicial">' +
    '<img class="brand__logo" src="assets/logos/CajuCarbo_Logo-removebg-preview.png" alt="CajuCarbo" />' +
    "</a>" +
    '<button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav-principal">' +
    '<span></span></button>' +
    '<nav class="nav" id="nav-principal" aria-label="Navegação principal">' +
    navItems +
    "</nav></div>";

  const footerHTML =
    '<div class="container footer-grid">' +
    '<div class="footer-about">' +
    '<a class="brand brand--light" href="index.html">' +
    '<img class="brand__logo" src="assets/logos/CajuCarbo_Logo-removebg-preview.png" alt="CajuCarbo" /></a>' +
    "<p>Pesquisa sobre balanço de carbono e sustentabilidade do cultivo de caju no Ceará, unindo ciência de campo e monitoramento ambiental.</p>" +
    "</div>" +
    '<div><h4>Navegação</h4><ul class="footer-links">' +
    LINKS.map((l) => '<li><a href="' + l.href + '">' + l.label + "</a></li>").join("") +
    "</ul></div>" +
    '<div class="footer-contact"><h4>Contato</h4><ul class="footer-links">' +
    '<li>Endereço: Embrapa Agroindústria Tropical</li>' +
    '<li>Rua Dra. Sara Mesquita, nº 2.270, Bairro Planalto do Pici, CEP 60511-110</li>' +
    '<li><a href="mailto:magna.moura@embrapa.br">E-mail: magna.moura@embrapa.br</a></li>' +
    '<li><a href="tel:+558533917100">Telefone: +55 (85) 3391-7100</a></li></ul></div>' +
    "</div>" +
    '<div class="footer-bottom container">' +
    "<span>&copy; <span data-year>2026</span> Projeto CajuCarbo. Todos os direitos reservados.</span>" +
    "<span>Ciência aplicada ao agronegócio sustentável</span></div>";

  const headerEl = document.querySelector("[data-header]");
  if (headerEl) headerEl.innerHTML = headerHTML;
  const footerEl = document.querySelector("[data-footer]");
  if (footerEl) footerEl.innerHTML = footerHTML;

  const headerInner = document.querySelector(".header-inner");
  if (headerInner && !headerInner.querySelector(".theme-toggle")) {
    const themeToggle = document.createElement("button");
    themeToggle.className = "theme-toggle";
    themeToggle.type = "button";
    themeToggle.innerHTML =
      '<span class="theme-toggle__sun" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg></span>' +
      '<span class="theme-toggle__moon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z"/></svg></span>';
    headerInner.appendChild(themeToggle);

    const setTheme = (theme) => {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem(THEME_KEY, theme);
      const dark = theme === "dark";
      themeToggle.setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
      themeToggle.setAttribute("aria-pressed", String(dark));
    };
    let currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(currentTheme);
    themeToggle.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(currentTheme);
    });
  }

  /* ---- Interações (após injeção) ---- */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 940) closeMenu(); });
  }

  /* Ano dinâmico */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
