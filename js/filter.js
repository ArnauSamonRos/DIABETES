const PAGE_SIZE = 9;
let visibleCountTodas = PAGE_SIZE;

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

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("grid")) return;

  const validCats = ["sensores", "medicacion", "estudios", "dietas", "ejercicio", "complicaciones"];
  const hash = window.location.hash.replace("#", "");
  const filtroInicial = validCats.includes(hash) ? hash : "todas";

  setActiveFilterButton(filtroInicial);
  applyFilter(filtroInicial, false);

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const filtro = btn.dataset.filtro;
      if (filtro === "todas") visibleCountTodas = PAGE_SIZE;
      setActiveFilterButton(filtro);
      applyFilter(filtro, true);
      history.replaceState(null, "", filtro === "todas" ? "index.html" : `index.html#${filtro}`);
    });
  });
});
