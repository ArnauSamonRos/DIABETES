# DiabetesHoy

Web de novedades sobre diabetes: sensores, medicación, estudios clínicos y dietas.

Cada artículo es un resumen de una noticia real con enlace a su fuente original. El contenido es informativo y no sustituye el consejo médico profesional.

## Estructura

- `js/data.js` — **única fuente de verdad**: array `ARTICLES` con todas las noticias y objeto `CATEGORIAS` (Sensores, Medicación, Estudios, Dietas, Ejercicio, Complicaciones).
- `build.js` — genera las páginas estáticas a partir de `js/data.js` (sin dependencias, solo Node). También contiene el contenido de las preguntas frecuentes (`FAQ_ITEMS`).
- `index.html` — portada (generada), con filtro por categoría.
- `articulos/*.html` — una página estática por noticia (generadas), con su propio `<title>`, meta descripción, URL canónica, Open Graph, Twitter Card y datos estructurados (JSON-LD: `NewsArticle` + `BreadcrumbList`).
- `quienes-somos.html`, `faq.html`, `contacto.html` — páginas de apoyo (generadas) pensadas para SEO y confianza (E-E-A-T) en contenido de salud: qué es el sitio, cómo se seleccionan las fuentes, preguntas frecuentes (con JSON-LD `FAQPage`) y cómo contactar.
- `sitemap.xml` y `robots.txt` — generados a partir de las mismas noticias y páginas de apoyo.
- `js/filter.js` — filtrado de la portada por categoría (solo interactividad, el contenido ya está en el HTML).
- `css/style.css` — estilos (con soporte de modo oscuro).
- `favicon.svg` — icono del sitio.

## SEO

El sitio está pensado para que los buscadores puedan indexar el contenido sin ejecutar JavaScript:

- Cada noticia tiene su propia URL (`/articulos/<id>.html`) con título, meta descripción, `<link rel="canonical">`, Open Graph/Twitter Card (`summary_large_image`) y JSON-LD (`NewsArticle` + `BreadcrumbList`) generados automáticamente.
- Todas las páginas comparten una imagen de vista previa (`img/og-cover.png`, 1200×630) para redes sociales, y un logo en PNG (`img/logo.png`, requerido por Google en vez de SVG) referenciado en el `Organization` de los datos estructurados.
- Migas de pan visibles (Portada › Categoría › Noticia) en todas las páginas, coherentes con su `BreadcrumbList` en JSON-LD.
- Cada noticia enlaza al final a hasta 3 noticias más de la misma categoría ("Más noticias de…"), para reforzar el enlazado interno.
- La portada incluye todas las tarjetas ya renderizadas en el HTML (el filtrado por categoría es solo una mejora de interactividad en el cliente).
- `sitemap.xml` y `robots.txt` se generan con las URLs reales de todas las noticias y páginas (la página `404.html` lleva `noindex` y queda fuera del sitemap a propósito).
- `<link rel="preconnect">` a los dominios de Google Tag Manager y AdSense para acelerar su carga.

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

1. Agrega un objeto al array `ARTICLES` en `js/data.js` con `id`, `categoria`, `titulo`, `resumen`, `fecha`, `fuenteNombre`, `fuenteUrl` y `cuerpo`.
2. Ejecuta `node build.js` para regenerar `index.html`, la página del artículo, el `sitemap.xml` y el `robots.txt`.
3. Revisa los cambios y haz commit.

No edites `index.html`, `quienes-somos.html`, `faq.html`, `contacto.html` ni los archivos dentro de `articulos/` a mano: se sobrescriben en cada `node build.js`. Para cambiar el contenido de las páginas de apoyo o de la FAQ, edita las funciones correspondientes (`renderAboutPage`, `renderFaqPage`, `renderContactPage`, `FAQ_ITEMS`) en `build.js`.
