#!/usr/bin/env node
// Genera las páginas estáticas del sitio (index.html, articulos/*.html,
// sitemap.xml) a partir de js/data.js, la única fuente de verdad.
// No tiene dependencias externas: basta con `node build.js`.
//
// Ejecútalo cada vez que edites js/data.js.

const fs = require("fs");
const path = require("path");

const { ARTICLES, CATEGORIAS } = require("./js/data.js");

// IMPORTANTE: actualiza esta URL en cuanto tengas dominio o lugar de
// publicación definitivo y vuelve a ejecutar `node build.js`.
const SITE_URL = "https://www.diabeteshoy.example";
const SITE_NAME = "DiabetesHoy";
const SITE_DESCRIPTION =
  "Novedades sobre diabetes: sensores, medicación, estudios clínicos y dietas, con enlace a la fuente original de cada noticia.";

const ROOT = __dirname;
const ARTICLES_DIR = path.join(ROOT, "articulos");

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatFecha(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

function articleUrl(article, absolute) {
  return `${absolute ? SITE_URL + "/" : ""}articulos/${article.id}.html`;
}

function homeUrl(absolute) {
  return absolute ? `${SITE_URL}/` : "index.html";
}

function renderHeader(prefix, activeCat) {
  const links = [
    { href: `${prefix}index.html`, label: "Portada", cat: "inicio" },
    { href: `${prefix}index.html#sensores`, label: "Sensores", cat: "sensores" },
    { href: `${prefix}index.html#medicacion`, label: "Medicación", cat: "medicacion" },
    { href: `${prefix}index.html#estudios`, label: "Estudios", cat: "estudios" },
    { href: `${prefix}index.html#dietas`, label: "Dietas", cat: "dietas" }
  ];

  const navHtml = links
    .map(l => `<a href="${l.href}"${l.cat === activeCat ? ' class="active"' : ""}>${l.label}</a>`)
    .join("\n        ");

  return `  <header class="site-header">
    <div class="header-inner">
      <a href="${prefix}index.html" class="logo"><span>Diabetes<span class="dot">Hoy</span></span></a>
      <nav class="main-nav" aria-label="Categorías">
        ${navHtml}
      </nav>
    </div>
  </header>`;
}

function renderFooter() {
  const year = new Date().getFullYear();
  return `  <footer class="site-footer">
    <div class="container">
      <span>&copy; ${year} ${SITE_NAME}. Solo novedades sobre diabetes.</span>
      <span>Contenido informativo, no sustituye el consejo médico profesional.</span>
    </div>
  </footer>`;
}

function renderCard(article, prefix) {
  const cat = CATEGORIAS[article.categoria];
  return `      <a class="card" href="${prefix}${articleUrl(article)}" data-cat="${article.categoria}">
        <div class="card-banner" style="background:${cat.color}">${cat.nombre}</div>
        <div class="card-body">
          <time class="card-date" datetime="${article.fecha}">${formatFecha(article.fecha)}</time>
          <h3 class="card-title">${escapeHtml(article.titulo)}</h3>
          <p class="card-summary">${escapeHtml(article.resumen)}</p>
          <span class="card-link">Leer más &rarr;</span>
        </div>
      </a>`;
}

function renderIndexPage(articles) {
  const sorted = [...articles].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const cardsHtml = sorted.map(a => renderCard(a, "")).join("\n");
  const url = homeUrl(true);
  const title = `${SITE_NAME} · Novedades sobre diabetes: sensores, medicación, estudios y dietas`;

  const filterButtons = [
    { key: "todas", label: "Todas" },
    { key: "sensores", label: "Sensores" },
    { key: "medicacion", label: "Medicación" },
    { key: "estudios", label: "Estudios" },
    { key: "dietas", label: "Dietas" }
  ]
    .map(f => `      <button class="filter-btn" data-filtro="${f.key}">${f.label}</button>`)
    .join("\n");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL + "/",
    description: SITE_DESCRIPTION,
    inLanguage: "es",
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL + "/" }
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(SITE_DESCRIPTION)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(SITE_DESCRIPTION)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:locale" content="es_ES" />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(SITE_DESCRIPTION)}" />

  <link rel="icon" href="favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="css/style.css" />
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
${renderHeader("", "inicio")}

  <main class="container">
    <section class="hero">
      <h1>Novedades sobre diabetes</h1>
      <p>Sensores, medicación, estudios clínicos y dietas: un resumen claro de lo último, siempre con enlace a la fuente original.</p>
    </section>

    <div class="filters" role="group" aria-label="Filtrar por categoría">
${filterButtons}
    </div>

    <div class="grid" id="grid">
${cardsHtml}
    </div>
    <p class="empty-state" id="empty-state" hidden>No hay artículos en esta categoría todavía.</p>

    <div class="disclaimer">
      Este sitio recopila y resume información publicada por otros medios y fuentes especializadas con fines informativos. No constituye consejo médico: consulta siempre con tu equipo de salud antes de tomar decisiones sobre tratamiento, medicación o dieta.
    </div>
  </main>

${renderFooter()}

  <script src="js/filter.js"></script>
</body>
</html>
`;
}

function renderArticlePage(article) {
  const cat = CATEGORIAS[article.categoria];
  const url = `${SITE_URL}/${articleUrl(article)}`;
  const title = `${article.titulo} · ${SITE_NAME}`;
  const bodyHtml = article.cuerpo.map(p => `      <p>${escapeHtml(p)}</p>`).join("\n");

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.titulo,
    description: article.resumen,
    datePublished: article.fecha,
    dateModified: article.fecha,
    inLanguage: "es",
    articleSection: cat.nombre,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isBasedOn: article.fuenteUrl,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL + "/" }
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Portada", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: cat.nombre, item: `${SITE_URL}/index.html#${article.categoria}` },
      { "@type": "ListItem", position: 3, name: article.titulo, item: url }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(article.resumen)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${escapeHtml(article.titulo)}" />
  <meta property="og:description" content="${escapeHtml(article.resumen)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:locale" content="es_ES" />
  <meta property="article:published_time" content="${article.fecha}" />
  <meta property="article:section" content="${escapeHtml(cat.nombre)}" />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(article.titulo)}" />
  <meta name="twitter:description" content="${escapeHtml(article.resumen)}" />

  <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="../css/style.css" />
  <script type="application/ld+json">${JSON.stringify(jsonLdArticle)}</script>
  <script type="application/ld+json">${JSON.stringify(jsonLdBreadcrumb)}</script>
</head>
<body>
${renderHeader("../", article.categoria)}

  <main class="article-wrap">
    <a class="back-link" href="../index.html#${article.categoria}">&larr; Volver a ${cat.nombre}</a>
    <span class="badge" style="background:${cat.color}">${cat.nombre}</span>
    <h1>${escapeHtml(article.titulo)}</h1>
    <time class="article-meta" datetime="${article.fecha}">${formatFecha(article.fecha)}</time>
    <div class="article-body">
${bodyHtml}
    </div>
    <div class="source-box">
      Fuente original: <a href="${article.fuenteUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(article.fuenteNombre)}</a>
    </div>
  </main>

${renderFooter()}
</body>
</html>
`;
}

function renderSitemap(articles) {
  const urls = [
    { loc: `${SITE_URL}/`, lastmod: articles.reduce((max, a) => (a.fecha > max ? a.fecha : max), articles[0].fecha) },
    ...articles.map(a => ({ loc: `${SITE_URL}/${articleUrl(a)}`, lastmod: a.fecha }))
  ];

  const body = urls
    .map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function renderRobotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function main() {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });

  fs.writeFileSync(path.join(ROOT, "index.html"), renderIndexPage(ARTICLES));

  for (const article of ARTICLES) {
    fs.writeFileSync(path.join(ARTICLES_DIR, `${article.id}.html`), renderArticlePage(article));
  }

  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), renderSitemap(ARTICLES));
  fs.writeFileSync(path.join(ROOT, "robots.txt"), renderRobotsTxt());

  console.log(`Generadas ${ARTICLES.length} páginas de artículo + index.html + sitemap.xml + robots.txt`);
}

main();
