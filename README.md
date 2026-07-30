# DiabetesHoy

Web de novedades sobre diabetes: sensores, medicación, estudios clínicos y dietas.

Cada artículo es un resumen de una noticia real con enlace a su fuente original. El contenido es informativo y no sustituye el consejo médico profesional.

## Estructura

- `js/data.js` — **única fuente de verdad**: array `ARTICLES` con todas las noticias y objeto `CATEGORIAS` (Sensores, Medicación, Estudios, Dietas, Ejercicio, Complicaciones).
- `build.js` — genera las páginas estáticas a partir de `js/data.js` (sin dependencias, solo Node). También contiene el contenido de las preguntas frecuentes (`FAQ_ITEMS`).
- `index.html` — portada (generada), con filtro por categoría.
- `articulos/*.html` — una página estática por noticia (generadas), con su propio `<title>`, meta descripción, URL canónica, Open Graph, Twitter Card y datos estructurados (JSON-LD: `NewsArticle` + `BreadcrumbList`).
- `quienes-somos.html`, `faq.html`, `contacto.html` — páginas de apoyo (generadas) pensadas para SEO y confianza (E-E-A-T) en contenido de salud: qué es el sitio, cómo se seleccionan las fuentes, preguntas frecuentes (con JSON-LD `FAQPage`) y cómo contactar.
- `categoria/<slug>.html` — una página propia por categoría (generada), con su título, meta descripción y JSON-LD (`CollectionPage` + `ItemList`) propios, listando solo las noticias de esa categoría. Antes esas categorías solo existían como ancla (`index.html#categoria`) dentro de la portada, invisible para el buscador como página independiente.
- `glosario.html` — glosario de ~20 términos habituales sobre diabetes (generado desde `GLOSSARY_ITEMS` en `build.js`), con JSON-LD `DefinedTermSet` y enlaces internos a las guías relacionadas. Contenido pensado para búsquedas de cola larga ("qué es la HbA1c", etc.).
- `sitemap.xml` y `robots.txt` — generados a partir de las mismas noticias y páginas de apoyo.
- `js/filter.js` — filtrado de la portada por categoría y paginación ("Cargar más noticias", 9 tarjetas por página); solo interactividad, el contenido ya está en el HTML.
- `css/style.css` — estilos (con soporte de modo oscuro).
- `favicon.svg` — icono del sitio.
- `en/` — versión en inglés de todo el sitio (ver sección "Versión en inglés" más abajo). Misma estructura de carpetas que la raíz (`en/articulos/`, `en/categoria/`, etc.), generada por las mismas funciones de `build.js` con `lang: "en"`.

## Versión en inglés

Todo el sitio existe también en inglés bajo `/en/` (`en/index.html`, `en/articulos/<id>.html`, `en/categoria/<slug>.html`, guías, glosario, FAQ, etc.), como páginas HTML reales generadas en el build — no es una traducción por JavaScript en el cliente, para no romper el principio de que todo el contenido esté ya en el HTML servido.

- El contenido en inglés vive junto al español en las mismas fuentes de datos: cada artículo en `js/data.js` tiene un campo `en: { titulo, tituloSeo, resumen, cuerpo }`; cada categoría en `CATEGORIAS` tiene `nombreEn`/`descripcionEn`; y `FAQ_ITEMS`, `PUMPS`, `INSULIN_TYPES` y `GLOSSARY_ITEMS` en `build.js` tienen sus propios campos `*En`. Los textos de interfaz (menú, pie, botones) están en el objeto `STRINGS` de `build.js`.
- Todas las funciones `render*Page` de `build.js` aceptan un parámetro `lang` (`"es"` por defecto o `"en"`) y usan ese campo para elegir el idioma; `main()` genera cada página dos veces, una en la raíz y otra bajo `en/`, con la misma estructura de subcarpetas.
- Cada página lleva `<link rel="alternate" hreflang="es|en">` (más `x-default` apuntando a la versión en español) hacia su página equivalente en el otro idioma, y `sitemap.xml` incluye las URLs de ambos idiomas con sus anotaciones `xhtml:link` — así los buscadores entienden que son la misma página en dos idiomas, no contenido duplicado.
- La cabecera incluye un selector de idioma (enlace "🌐 English" / "🌐 Español") que enlaza directamente con la página equivalente en el otro idioma — no es un botón de JavaScript, así que funciona sin JS y cada versión es indexable por separado.
- Los recursos estáticos (`css/`, `js/`, `img/`, `favicon.svg`) no se duplican bajo `en/`: las páginas en inglés enlazan a los mismos archivos de la raíz con una ruta relativa adicional (`../`).
- `js/filter.js` y `js/motion.js` son scripts compartidos entre los dos idiomas; detectan el idioma de la página con `document.documentElement.lang` para mostrar sus pocos textos generados por JS (el botón "Cargar más noticias"/"Load more news" y el `aria-label` de "Volver arriba"/"Back to top") en el idioma correcto.

## SEO

El sitio está pensado para que los buscadores puedan indexar el contenido sin ejecutar JavaScript:

- Cada noticia tiene su propia URL (`/articulos/<id>.html`) con título, meta descripción, `<link rel="canonical">`, Open Graph/Twitter Card (`summary_large_image`) y JSON-LD (`NewsArticle` + `BreadcrumbList`) generados automáticamente.
- Todas las páginas comparten una imagen de vista previa (`img/og-cover.png`, 1200×630) para redes sociales, y un logo en PNG (`img/logo.png`, requerido por Google en vez de SVG) referenciado en el `Organization` de los datos estructurados.
- Migas de pan visibles (Portada › Categoría › Noticia) en todas las páginas, coherentes con su `BreadcrumbList` en JSON-LD.
- Cada noticia enlaza al final a hasta 3 noticias más de la misma categoría ("Más noticias de…"), para reforzar el enlazado interno.
- La portada incluye todas las tarjetas ya renderizadas en el HTML (el filtrado por categoría es solo una mejora de interactividad en el cliente).
- `sitemap.xml` y `robots.txt` se generan con las URLs reales de todas las noticias y páginas (la página `404.html` lleva `noindex` y queda fuera del sitemap a propósito).
- `<link rel="preconnect">` a los dominios de Google Tag Manager y AdSense para acelerar su carga.
- Cada noticia tiene un campo opcional `tituloSeo` en `js/data.js`: un título corto para `<title>`/Open Graph/Twitter (máx. ~46 caracteres, para no superar los 60 con el sufijo " · DiabetesHoy" y que Google no lo corte en el resultado de búsqueda). El titular completo (`titulo`) se sigue usando tal cual en el `<h1>`, en las tarjetas y en el `headline` del JSON-LD. Si un artículo no tiene `tituloSeo`, se usa `titulo` igualmente.
- Las meta descripciones (`<meta name="description">`, `og:description`, `twitter:description`) se recortan automáticamente a ~155 caracteres por palabra completa (función `truncateForMeta` en `build.js`); el `resumen` completo se sigue mostrando tal cual en la tarjeta, en el artículo y en el JSON-LD.
- Cada artículo tiene su propia imagen para redes sociales en `img/og/<id>.png` (generada a partir de su `tituloSeo` y su categoría). Si un artículo nuevo no tiene imagen todavía en esa carpeta, `build.js` usa automáticamente la genérica `img/og-cover.png` como respaldo — no hace falta generarla a mano para publicar.
- Cada categoría (`categoria/<slug>.html`) tiene ahora su propia página indexable, con título, meta descripción y JSON-LD (`CollectionPage` + `ItemList`) propios. Antes solo existían como ancla dentro de la portada (`index.html#categoria`), invisibles para el buscador como contenido independiente; esto amplía el número de páginas relevantes que pueden posicionar cuando alguien busca, por ejemplo, "sensores de glucosa" o "dietas para diabetes".
- `glosario.html` añade contenido de cola larga (~20 términos con su definición y JSON-LD `DefinedTermSet`) para búsquedas del tipo "qué es la HbA1c" o "qué es la resistencia a la insulina", con enlaces internos hacia las noticias y guías relacionadas.

El dominio real es `https://diabeteshoy.com` (constante `SITE_URL` en `build.js`). Si alguna vez cambia:

1. Actualiza `SITE_URL` en `build.js`.
2. Ejecuta `node build.js` para regenerar todas las páginas (canonical, sitemap, `og:url`, JSON-LD y el email de contacto se actualizan solos).
3. Vuelve a hacer commit y desplegar.

Si el sitio no se sirve desde la raíz del dominio (por ejemplo, GitHub Pages en `usuario.github.io/DIABETES/`), añade también esa ruta a `SITE_URL`.

## Cómo usarla

Sitio estático, sin instalación de dependencias. Para verlo localmente:

```bash
python3 -m http.server 8000
```

Y abre `http://localhost:8000/index.html`.

## Añadir una noticia nueva

1. Agrega un objeto al array `ARTICLES` en `js/data.js` con `id`, `categoria`, `titulo`, `resumen`, `fecha`, `fuenteNombre`, `fuenteUrl` y `cuerpo`. Si el `titulo` es largo, añade también un `tituloSeo` corto (ver sección SEO más arriba).
2. Añade también su traducción al inglés en el campo `en: { titulo, tituloSeo, resumen, cuerpo }` del mismo objeto (ver sección "Versión en inglés" más arriba); si se omite, el build fallará al generar `en/articulos/<id>.html`.
3. Ejecuta `node build.js` para regenerar `index.html`/`en/index.html`, las páginas del artículo en ambos idiomas, el `sitemap.xml` y el `robots.txt`.
4. (Opcional) Genera una imagen social propia en `img/og/<id>.png` (1200×630); si no la añades, se usará la genérica automáticamente.
5. Revisa los cambios y haz commit.

No edites `index.html`, `quienes-somos.html`, `faq.html`, `contacto.html`, nada dentro de `articulos/` o `categoria/`, ni nada dentro de `en/` a mano: todo eso se sobrescribe en cada `node build.js`. Para cambiar el contenido de las páginas de apoyo o de la FAQ, edita las funciones correspondientes (`renderAboutPage`, `renderFaqPage`, `renderContactPage`, `FAQ_ITEMS`) en `build.js`, incluyendo su rama en inglés (`lang === "en"`).
