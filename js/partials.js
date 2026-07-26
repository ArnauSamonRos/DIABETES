function renderHeader(activeCategoria) {
  const links = [
    { href: "index.html", label: "Portada", cat: "inicio" },
    { href: "index.html#sensores", label: "Sensores", cat: "sensores" },
    { href: "index.html#medicacion", label: "Medicación", cat: "medicacion" },
    { href: "index.html#estudios", label: "Estudios", cat: "estudios" },
    { href: "index.html#dietas", label: "Dietas", cat: "dietas" }
  ];

  const navHtml = links.map(l => {
    const cls = l.cat === activeCategoria ? "active" : "";
    return `<a href="${l.href}" class="${cls}">${l.label}</a>`;
  }).join("");

  return `
    <div class="header-inner">
      <a href="index.html" class="logo">
        <span>Diabetes<span class="dot">Hoy</span></span>
      </a>
      <nav class="main-nav">${navHtml}</nav>
    </div>
  `;
}

function renderFooter() {
  const year = new Date().getFullYear();
  return `
    <div class="container">
      <span>&copy; ${year} DiabetesHoy. Solo novedades sobre diabetes.</span>
      <span>Contenido informativo, no sustituye el consejo médico profesional.</span>
    </div>
  `;
}

function mountPartials(activeCategoria) {
  document.getElementById("site-header").innerHTML = renderHeader(activeCategoria || "inicio");
  document.getElementById("site-footer").innerHTML = renderFooter();
}

function formatFecha(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}
