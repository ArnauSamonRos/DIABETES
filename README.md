# DiabetesHoy

Web estática de novedades sobre diabetes: sensores, medicación, estudios clínicos y dietas.

Cada artículo es un resumen de una noticia real con enlace a su fuente original. El contenido es informativo y no sustituye el consejo médico profesional.

## Estructura

- `index.html` — portada con filtro por categorías (Sensores, Medicación, Estudios, Dietas).
- `articulo.html` — vista de artículo individual (`articulo.html?id=<id>`).
- `js/data.js` — base de datos de artículos.
- `js/partials.js` — cabecera y pie de página compartidos.
- `js/main.js` — listado y filtrado de la portada.
- `js/article.js` — renderizado del artículo individual.
- `css/style.css` — estilos (con soporte de modo oscuro).

## Cómo usarla

Es una web 100% estática, sin build ni dependencias. Para verla localmente:

```bash
python3 -m http.server 8000
```

Y abre `http://localhost:8000/index.html`.

Para añadir una noticia nueva, agrega un objeto al array `ARTICLES` en `js/data.js` con su categoría, fecha, resumen, cuerpo y fuente.
