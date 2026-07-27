function setActiveFilterButton(filtro) {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filtro === filtro);
  });
}

function applyFilter(filtro, animate) {
  const cards = document.querySelectorAll(".card");
  let visibleIndex = 0;

  cards.forEach(card => {
    const match = filtro === "todas" || card.dataset.cat === filtro;

    if (match && animate) {
      card.classList.remove("is-visible");
      card.style.display = "";
      card.style.transitionDelay = `${Math.min(visibleIndex, 8) * 50}ms`;
      // Forzar reflow para que la transición se vuelva a disparar.
      void card.offsetWidth;
      requestAnimationFrame(() => card.classList.add("is-visible"));
    } else {
      card.style.display = match ? "" : "none";
    }

    if (match) visibleIndex += 1;
  });

  const emptyState = document.getElementById("empty-state");
  if (emptyState) emptyState.hidden = visibleIndex > 0;
}

document.addEventListener("DOMContentLoaded", () => {
  const validCats = ["sensores", "medicacion", "estudios", "dietas", "ejercicio", "complicaciones"];
  const hash = window.location.hash.replace("#", "");
  const filtroInicial = validCats.includes(hash) ? hash : "todas";

  setActiveFilterButton(filtroInicial);
  applyFilter(filtroInicial, false);

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const filtro = btn.dataset.filtro;
      setActiveFilterButton(filtro);
      applyFilter(filtro, true);
      history.replaceState(null, "", filtro === "todas" ? "index.html" : `index.html#${filtro}`);
    });
  });
});
