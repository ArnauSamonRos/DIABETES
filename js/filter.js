const PAGE_SIZE = 9;
let visibleCountTodas = PAGE_SIZE;
let currentFiltro = "todas";

const FILTER_LANG = document.documentElement.lang === "en" ? "en" : "es";
const FILTER_STRINGS = {
  es: { loadMore: "Cargar más noticias" },
  en: { loadMore: "Load more news" }
};

function setActiveFilterButton(filtro) {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filtro === filtro);
  });
}

// Las tarjetas usan una animación CSS (.reveal) que solo se dispara una vez
// al aparecer en el DOM. Para que vuelvan a animarse al cambiar de filtro,
// se fuerza un reinicio quitando y reponiendo la propiedad "animation".
function restartCardAnimation(card) {
  card.style.animation = "none";
  void card.offsetWidth;
  card.style.animation = "";
}

function ensureLoadMoreButton() {
  let wrap = document.getElementById("load-more-wrap");
  if (wrap) return wrap;

  const grid = document.getElementById("grid");
  if (!grid) return null;

  wrap = document.createElement("div");
  wrap.id = "load-more-wrap";
  wrap.className = "load-more-wrap";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "load-more-btn";
  btn.textContent = FILTER_STRINGS[FILTER_LANG].loadMore;
  btn.addEventListener("click", () => {
    visibleCountTodas += PAGE_SIZE;
    applyFilter("todas", true);
  });

  wrap.appendChild(btn);
  grid.insertAdjacentElement("afterend", wrap);
  return wrap;
}

function applyFilter(filtro, animate) {
  const cards = Array.from(document.querySelectorAll(".card"));
  const paginate = filtro === "todas";
  let matchIndex = 0;
  let visibleCount = 0;
  let remaining = 0;

  cards.forEach(card => {
    const isMatch = filtro === "todas" || card.dataset.cat === filtro;
    let show = isMatch;

    if (isMatch && paginate) {
      matchIndex += 1;
      if (matchIndex > visibleCountTodas) {
        show = false;
        remaining += 1;
      }
    }

    if (show && animate) {
      card.style.display = "";
      restartCardAnimation(card);
    } else {
      card.style.display = show ? "" : "none";
    }

    if (show) visibleCount += 1;
  });

  const emptyState = document.getElementById("empty-state");
  if (emptyState) emptyState.hidden = visibleCount > 0;

  const loadMoreWrap = ensureLoadMoreButton();
  if (loadMoreWrap) loadMoreWrap.style.display = paginate && remaining > 0 ? "" : "none";
}

// Búsqueda por texto: independiente del filtro de categoría, muestra todas
// las coincidencias sin paginar (el usuario está buscando algo concreto).
function applySearch(query) {
  const cards = Array.from(document.querySelectorAll(".card"));
  const q = query.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach(card => {
    const title = (card.querySelector(".card-title")?.textContent || "").toLowerCase();
    const summary = (card.querySelector(".card-summary")?.textContent || "").toLowerCase();
    const show = title.includes(q) || summary.includes(q);
    card.style.display = show ? "" : "none";
    if (show) visibleCount += 1;
  });

  const emptyState = document.getElementById("empty-state");
  if (emptyState) emptyState.hidden = visibleCount > 0;

  const loadMoreWrap = document.getElementById("load-more-wrap");
  if (loadMoreWrap) loadMoreWrap.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("grid")) return;

  const validCats = ["sensores", "medicacion", "estudios", "dietas", "ejercicio", "complicaciones"];
  const hash = window.location.hash.replace("#", "");
  const filtroInicial = validCats.includes(hash) ? hash : "todas";
  currentFiltro = filtroInicial;

  setActiveFilterButton(filtroInicial);
  applyFilter(filtroInicial, false);

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const filtro = btn.dataset.filtro;
      currentFiltro = filtro;
      if (filtro === "todas") visibleCountTodas = PAGE_SIZE;
      setActiveFilterButton(filtro);
      applyFilter(filtro, true);
      history.replaceState(null, "", filtro === "todas" ? "index.html" : `index.html#${filtro}`);
    });
  });

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value;
      if (q.trim()) {
        document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        applySearch(q);
      } else {
        setActiveFilterButton(currentFiltro);
        applyFilter(currentFiltro, false);
      }
    });
  }
});
