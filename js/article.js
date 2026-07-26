function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function renderArticle() {
  const id = getParam("id");
  const article = ARTICLES.find(a => a.id === id);
  const container = document.getElementById("article-container");

  if (!article) {
    mountPartials(null);
    container.innerHTML = `
      <a class="back-link" href="index.html">&larr; Volver a la portada</a>
      <div class="not-found">
        <h1>Artículo no encontrado</h1>
        <p>El artículo que buscas no existe o ha sido movido.</p>
      </div>
    `;
    document.title = "Artículo no encontrado · DiabetesHoy";
    return;
  }

  mountPartials(article.categoria);

  const cat = CATEGORIAS[article.categoria];
  document.title = `${article.titulo} · DiabetesHoy`;

  container.innerHTML = `
    <a class="back-link" href="index.html#${article.categoria}">&larr; Volver a ${cat.nombre}</a>
    <span class="badge" style="background:${cat.color}">${cat.nombre}</span>
    <h1>${article.titulo}</h1>
    <div class="article-meta">${formatFecha(article.fecha)}</div>
    <div class="article-body">
      ${article.cuerpo.map(p => `<p>${p}</p>`).join("")}
    </div>
    <div class="source-box">
      Fuente original: <a href="${article.fuenteUrl}" target="_blank" rel="noopener noreferrer">${article.fuenteNombre}</a>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderArticle();
});
