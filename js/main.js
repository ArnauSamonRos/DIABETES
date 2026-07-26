function cardHtml(article) {
  const cat = CATEGORIAS[article.categoria];
  return `
    <a class="card" href="articulo.html?id=${article.id}">
      <div class="card-banner" style="background:${cat.color}">${cat.nombre}</div>
      <div class="card-body">
        <span class="card-date">${formatFecha(article.fecha)}</span>
        <h3 class="card-title">${article.titulo}</h3>
        <p class="card-summary">${article.resumen}</p>
        <span class="card-link">Leer más &rarr;</span>
      </div>
    </a>
  `;
}

function renderGrid(filtro) {
  const grid = document.getElementById("grid");
  const sorted = [...ARTICLES].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const filtered = filtro === "todas" ? sorted : sorted.filter(a => a.categoria === filtro);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">No hay artículos en esta categoría todavía.</div>`;
    return;
  }
  grid.innerHTML = filtered.map(cardHtml).join("");
}

function setActiveFilterButton(filtro) {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filtro === filtro);
  });
}

function initFilters() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const filtro = btn.dataset.filtro;
      setActiveFilterButton(filtro);
      renderGrid(filtro);
      history.replaceState(null, "", filtro === "todas" ? "index.html" : `index.html#${filtro}`);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("grid")) return;

  const hash = window.location.hash.replace("#", "");
  const filtroInicial = CATEGORIAS[hash] ? hash : "todas";

  mountPartials(filtroInicial === "todas" ? "inicio" : filtroInicial);
  initFilters();
  setActiveFilterButton(filtroInicial);
  renderGrid(filtroInicial);
});
