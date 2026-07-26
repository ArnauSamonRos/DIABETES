function setActiveFilterButton(filtro) {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filtro === filtro);
  });
}

function applyFilter(filtro) {
  const cards = document.querySelectorAll(".card");
  let visibleCount = 0;

  cards.forEach(card => {
    const match = filtro === "todas" || card.dataset.cat === filtro;
    card.style.display = match ? "" : "none";
    if (match) visibleCount += 1;
  });

  const emptyState = document.getElementById("empty-state");
  if (emptyState) emptyState.hidden = visibleCount > 0;
}

document.addEventListener("DOMContentLoaded", () => {
  const validCats = ["sensores", "medicacion", "estudios", "dietas", "ejercicio", "complicaciones"];
  const hash = window.location.hash.replace("#", "");
  const filtroInicial = validCats.includes(hash) ? hash : "todas";

  setActiveFilterButton(filtroInicial);
  applyFilter(filtroInicial);

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const filtro = btn.dataset.filtro;
      setActiveFilterButton(filtro);
      applyFilter(filtro);
      history.replaceState(null, "", filtro === "todas" ? "index.html" : `index.html#${filtro}`);
    });
  });
});
