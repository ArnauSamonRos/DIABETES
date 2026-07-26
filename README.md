# DiabetesHoy

Web de novedades sobre diabetes: sensores, medicación, estudios clínicos y dietas.

Cada artículo es un resumen de una noticia real con enlace a su fuente original. El contenido es informativo y no sustituye el consejo médico profesional.

## Estructura

- `js/data.js` — **única fuente de verdad**: array `ARTICLES` con todas las noticias.
- `build.js` — genera las páginas estáticas a partir de `js/data.js` (sin dependencias, solo Node).
- `index.html` — portada (generada), con filtro por categorías (Sensores, Medicación, Estudios, Dietas).
- `articulos/*.html` — una página estática por noticia (generadas), con su propio `<title>`, meta descripción, URL canónica, Open Graph, Twitter Card y datos estructurados (JSON-LD).
- `sitemap.xml` y `robots.txt` — generados a partir de las mismas noticias.
- `js/filter.js` — filtrado de la portada por categoría (solo interactividad, el contenido ya está en el HTML).
- `css/style.css` — estilos (con soporte de modo oscuro).
- `favicon.svg` — icono del sitio.

## SEO

El sitio está pensado para que los buscadores puedan indexar el contenido sin ejecutar JavaScript:

- Cada noticia tiene su propia URL (`/articulos/<id>.html`) con título, meta descripción, `<link rel="canonical">`, Open Graph/Twitter Card y JSON-LD (`NewsArticle` + `BreadcrumbList`) generados automáticamente.
- La portada incluye todas las tarjetas ya renderizadas en el HTML (el filtrado por categoría es solo una mejora de interactividad en el cliente).
- `sitemap.xml` y `robots.txt` se generan con las URLs reales de todas las noticias.

**Importante:** las URLs usan el dominio de ejemplo `https://www.diabeteshoy.example` (constante `SITE_URL` en `build.js`) porque aún no hay dominio definitivo. En cuanto lo tengas:

1. Cambia `SITE_URL` en `build.js`.
2. Ejecuta `node build.js` para regenerar todas las páginas.
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

No edites `index.html` ni los archivos dentro de `articulos/` a mano: se sobrescriben en cada `node build.js`.
