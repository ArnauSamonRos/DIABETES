#!/usr/bin/env node
// Genera las páginas estáticas del sitio (index.html, articulos/*.html,
// páginas de apoyo y sitemap.xml) a partir de js/data.js, la única
// fuente de verdad. No tiene dependencias externas: basta con `node build.js`.
//
// Ejecútalo cada vez que edites js/data.js o el contenido de este archivo.

const fs = require("fs");
const path = require("path");

const { ARTICLES, CATEGORIAS } = require("./js/data.js");

// Dominio real del sitio. Si algún día cambia, actualiza esta constante y
// vuelve a ejecutar `node build.js` para regenerar todas las páginas.
const SITE_URL = "https://diabeteshoy.com";
const SITE_NAME = "DiabetesHoy";
const SITE_DESCRIPTION =
  "Novedades sobre diabetes: sensores, medicación, estudios clínicos, dietas, ejercicio y complicaciones, con enlace a la fuente original de cada noticia.";

// Fecha de referencia para las páginas de apoyo (Quiénes somos, FAQ,
// Contacto). Actualízala a mano cuando cambies su contenido.
const STATIC_PAGES_LASTMOD = "2026-07-26";

// Cliente de Google AdSense para el script cargado en el <head> de cada página.
const ADSENSE_CLIENT = "ca-pub-7265745270719064";

// Google Tag Manager, instalado en todas las páginas generadas.
const GTM_ID = "GTM-568X9Q5B";

const GTM_SCRIPT = `<!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${GTM_ID}');</script>
  <!-- End Google Tag Manager -->`;

const GTM_NOSCRIPT = `  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->`;

// Vercel Analytics. Este sitio es HTML estático (sin React/Next.js ni build
// de npm), así que se usa el script vanilla que recomienda Vercel para sitios
// sin framework en vez del paquete @vercel/analytics + <Analytics/>. Solo
// registrará visitas si el sitio se despliega realmente en Vercel.
const VERCEL_ANALYTICS_SCRIPT = `<script defer src="/_vercel/insights/script.js"></script>`;

// Imagen de vista previa genérica para redes sociales (Open Graph / Twitter
// Card) en las páginas que no son artículo.
const OG_IMAGE_URL = `${SITE_URL}/img/og-cover.png`;

// Cada artículo puede tener su propia imagen social en img/og/<id>.png; si no
// existe (por ejemplo, un artículo nuevo sin imagen generada todavía), se usa
// la genérica de arriba como respaldo.
function ogImageForArticle(article) {
  const file = path.join(ROOT, "img", "og", `${article.id}.png`);
  return fs.existsSync(file) ? `${SITE_URL}/img/og/${article.id}.png` : OG_IMAGE_URL;
}

// Logo en PNG para los datos estructurados de Organization: Google exige que
// no sea SVG, por eso no se reutiliza favicon.svg directamente.
const LOGO_URL = `${SITE_URL}/img/logo.png`;

const ORG_JSONLD = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL + "/",
  logo: { "@type": "ImageObject", url: LOGO_URL, width: 512, height: 512 }
};

const ROOT = __dirname;
const ARTICLES_DIR = path.join(ROOT, "articulos");

const FAQ_ITEMS = [
  {
    pregunta: "¿Qué es DiabetesHoy?",
    respuesta:
      "DiabetesHoy es un proyecto independiente que resume noticias públicas sobre diabetes (sensores, medicación, estudios clínicos, dietas, ejercicio y complicaciones) y enlaza siempre a la fuente original de cada una para que puedas verificarla."
  },
  {
    pregunta: "¿El contenido de DiabetesHoy sustituye el consejo médico?",
    respuesta:
      "No. Todo el contenido tiene fines informativos y no sustituye el diagnóstico, el tratamiento ni el consejo de un profesional sanitario. Consulta siempre con tu equipo médico antes de tomar decisiones sobre tratamiento, medicación o dieta."
  },
  {
    pregunta: "¿Con qué frecuencia se actualizan las noticias?",
    respuesta:
      "Se añaden nuevas noticias a medida que aparecen novedades relevantes en las fuentes que seguimos. No hay una periodicidad fija, pero puedes consultar la fecha de publicación de cada artículo en su propia página."
  },
  {
    pregunta: "¿Cómo se seleccionan las fuentes?",
    respuesta:
      "Priorizamos fuentes públicas y especializadas: sociedades científicas, agencias reguladoras, medios especializados en diabetes y publicaciones médicas. Cada artículo de DiabetesHoy enlaza directamente a la fuente original usada para redactarlo."
  },
  {
    pregunta: "¿Los artículos están escritos por profesionales médicos?",
    respuesta:
      "No. DiabetesHoy es un proyecto de curación y resumen de noticias, no un medio médico ni una institución sanitaria. Por eso cada artículo enlaza a su fuente original, para que puedas consultar la información completa y contrastarla con tu equipo médico."
  },
  {
    pregunta: "¿Qué diferencia hay entre diabetes tipo 1 y tipo 2?",
    respuesta:
      "De forma general, la diabetes tipo 1 es una enfermedad autoinmune en la que el cuerpo deja de producir insulina, y suele diagnosticarse en la infancia o juventud. La diabetes tipo 2 se asocia a una resistencia progresiva a la insulina y suele aparecer en la edad adulta, aunque cada caso es distinto. Para un diagnóstico o información personalizada, consulta a un profesional sanitario."
  },
  {
    pregunta: "¿Qué es un sensor de monitorización continua de glucosa (MCG)?",
    respuesta:
      "Es un pequeño dispositivo que se coloca sobre la piel y mide de forma continua el nivel de glucosa en el líquido intersticial, mostrando los datos en un móvil o lector, sin necesidad de pincharse el dedo cada vez. Puedes ver ejemplos de novedades sobre estos dispositivos en la categoría Sensores."
  },
  {
    pregunta: "He encontrado un error o quiero sugerir una noticia, ¿qué hago?",
    respuesta:
      "Escríbenos desde la página de contacto. Revisamos cualquier corrección señalada y valoramos las sugerencias de temas para futuras noticias."
  }
];

const PUMPS = [
  {
    modelo: "Omnipod 5",
    fabricante: "Insulet",
    tipo: "Sin tubo (parche), impermeable",
    sensores: "Dexcom G6, G7 y FreeStyle Libre 2 Plus",
    destacado: "Se controla desde el móvil o un controlador dedicado, sin tubo visible; cada Pod dura hasta 3 días.",
    detalle:
      "El Pod se lleva pegado directamente sobre la piel y no lleva tubo de conexión. El algoritmo SmartAdjust ajusta la insulina basal automáticamente cada 5 minutos según los datos del sensor. Cada Pod admite hasta 200 unidades de insulina de acción rápida y se cambia cada 3 días.",
    fuenteNombre: "Comparativa de bombas de insulina, LMC Diabetes & Endocrinology (feb. 2026)",
    fuenteUrl: "https://www.lmc.ca/wp-content/uploads/2026/02/EN-LMC-Pump-Comparison-Chart-Feb-2026-.pdf"
  },
  {
    modelo: "MiniMed 780G",
    fabricante: "Medtronic",
    tipo: "Con tubo, pantalla integrada",
    sensores: "Guardian 4 y Simplera Sync",
    destacado: "Ajustes basales muy finos (desde 0,025 U/hora) y detección avanzada de comidas.",
    detalle:
      "Su algoritmo SmartGuard corrige automáticamente cada 5 minutos y permite ajustes de insulina basal especialmente precisos, lo que puede resultar útil para personas con necesidades de insulina bajas o muy variables. Incluye tecnología de detección avanzada de comidas para reforzar la respuesta a las subidas de glucosa tras comer.",
    fuenteNombre: "Comparativa de bombas de insulina, LMC Diabetes & Endocrinology (feb. 2026)",
    fuenteUrl: "https://www.lmc.ca/wp-content/uploads/2026/02/EN-LMC-Pump-Comparison-Chart-Feb-2026-.pdf"
  },
  {
    modelo: "t:slim X2",
    fabricante: "Tandem Diabetes Care",
    tipo: "Con tubo, pantalla táctil a color",
    sensores: "Compatible con el algoritmo Control-IQ+",
    destacado: "Modos específicos de sueño y ejercicio, con bolos de autocorrección.",
    detalle:
      "Además de los modos de sueño y ejercicio, que adaptan los objetivos de glucosa según la actividad, incorpora bolos de autocorrección para reforzar el control entre comidas. Para 2026 se espera un set de infusión de mayor duración, de hasta 7 días.",
    fuenteNombre: "Comparativa de bombas de insulina, LMC Diabetes & Endocrinology (feb. 2026)",
    fuenteUrl: "https://www.lmc.ca/wp-content/uploads/2026/02/EN-LMC-Pump-Comparison-Chart-Feb-2026-.pdf"
  },
  {
    modelo: "YpsoPump (mylife)",
    fabricante: "Ypsomed",
    tipo: "Con tubo, muy compacta y ligera",
    sensores: "Según el algoritmo asociado (por ejemplo, CamAPS FX)",
    destacado: "Pensada especialmente para el uso en niños, con monitorización a distancia para cuidadores.",
    detalle:
      "Es una de las bombas más pequeñas y ligeras del mercado, lo que la hace popular en población pediátrica. Puede combinarse con distintos algoritmos de asa cerrada según el país, e incluye funciones de monitorización remota para madres, padres o cuidadores.",
    fuenteNombre: "Comparativa de bombas de insulina, LMC Diabetes & Endocrinology (feb. 2026)",
    fuenteUrl: "https://www.lmc.ca/wp-content/uploads/2026/02/EN-LMC-Pump-Comparison-Chart-Feb-2026-.pdf"
  },
  {
    modelo: "iLet Bionic Pancreas",
    fabricante: "Beta Bionics",
    tipo: "Con tubo",
    sensores: "Dexcom y FreeStyle Libre 3 Plus",
    destacado: "No requiere contar carbohidratos: solo pide una estimación aproximada de la comida.",
    detalle:
      "Su planteamiento es distinto al resto: no se introducen ratios ni factores de corrección, solo el peso de la persona al empezar. El propio sistema desarrolla y actualiza un perfil de dosis a lo largo de 288 segmentos basales al día, y en las comidas solo pide una estimación aproximada (\"como de costumbre\", \"más\" o \"menos\") en lugar de un conteo exacto de carbohidratos.",
    fuenteNombre: "Beta Bionics (sitio oficial del fabricante)",
    fuenteUrl: "https://www.betabionics.com/ilet-bionic-pancreas/ilet-adults/"
  }
];

const INSULIN_TYPES = [
  {
    tipo: "Ultrarrápida (rápida)",
    ejemplos: "Análogos como lispro, aspart o glulisina",
    inicio: "~15 minutos",
    pico: "Alrededor de 1 hora",
    duracion: "2 a 4 horas",
    uso: "Se inyecta justo antes de comer, para cubrir la subida de glucosa de esa comida.",
    detalle:
      "Es la insulina que actúa más rápido. Al empezar a hacer efecto casi enseguida, se usa para cubrir lo que se come en cada comida principal, y por eso normalmente se inyecta justo antes (o, en algunos casos, justo después) de empezar a comer."
  },
  {
    tipo: "Corta (regular)",
    ejemplos: "Insulina humana regular",
    inicio: "~30 minutos",
    pico: "2 a 3 horas",
    duracion: "3 a 6 horas",
    uso: "Se inyecta entre 30 y 60 minutos antes de comer.",
    detalle:
      "Es de las insulinas más antiguas y tarda algo más en empezar a actuar que los análogos ultrarrápidos, por lo que necesita inyectarse con más antelación respecto a la comida. Hoy en día se usa con menos frecuencia que las insulinas rápidas más modernas."
  },
  {
    tipo: "Intermedia",
    ejemplos: "NPH",
    inicio: "2 a 4 horas",
    pico: "4 a 12 horas",
    duracion: "12 a 18 horas",
    uso: "Cubre medio día o la noche; suele combinarse con una insulina rápida.",
    detalle:
      "Actúa de forma más lenta y prolongada, cubriendo las necesidades de insulina durante buena parte del día o de la noche. Es habitual combinarla con una insulina rápida para cubrir también lo que se come en las comidas."
  },
  {
    tipo: "Prolongada (basal)",
    ejemplos: "Glargina, detemir",
    inicio: "~2 horas",
    pico: "Sin pico marcado",
    duracion: "Hasta 24 horas",
    uso: "Aporta un nivel de fondo estable durante casi todo el día, sin relación directa con las comidas.",
    detalle:
      "Se conoce como insulina \"basal\": no está pensada para cubrir una comida en concreto, sino para mantener un nivel de fondo de insulina estable a lo largo del día, de forma parecida a como lo haría un páncreas que funciona con normalidad fuera de las comidas."
  },
  {
    tipo: "Ultraprolongada",
    ejemplos: "Degludec",
    inicio: "~6 horas",
    pico: "Sin pico",
    duracion: "36 horas o más",
    uso: "Insulina basal de acción muy larga, con más margen de flexibilidad horaria.",
    detalle:
      "Funciona de forma parecida a la insulina prolongada, pero dura todavía más tiempo y su efecto es aún más estable, lo que en la práctica puede dar algo más de margen si un día se retrasa la inyección respecto al horario habitual (siempre según lo pautado por el equipo médico)."
  },
  {
    tipo: "Premezclada (bifásica)",
    ejemplos: "Combinaciones de insulina intermedia y corta o rápida en un mismo vial o pluma",
    inicio: "5 a 60 minutos",
    pico: "Variable (doble pico)",
    duracion: "10 a 16 horas",
    uso: "Se inyecta entre 10 y 30 minutos antes del desayuno y de la cena.",
    detalle:
      "Combina en una sola inyección una parte de insulina de acción corta o rápida con otra de acción intermedia, en una proporción fija. Simplifica el número de pinchazos al día, aunque ofrece menos flexibilidad para ajustar cada componente por separado."
  }
];

// Cada término admite HTML simple (por ejemplo enlaces <a>) en `definicion`,
// ya que build.js no lo escapa; usa comillas dobles con cuidado.
const GLOSSARY_ITEMS = [
  {
    slug: "bomba-de-insulina",
    termino: "Bomba de insulina",
    definicion: 'Dispositivo que administra insulina de acción rápida de forma continua a través de un catéter o un parche, sustituyendo las inyecciones múltiples diarias. Puedes comparar varios modelos en nuestra <a href="bombas-de-insulina.html">comparativa de bombas de insulina</a>.'
  },
  {
    slug: "cetoacidosis-diabetica",
    termino: "Cetoacidosis diabética (CAD)",
    definicion: "Complicación grave y de aparición rápida, más frecuente en diabetes tipo 1, en la que el cuerpo, al no poder usar la glucosa como energía, empieza a producir cetonas en exceso. Requiere atención médica urgente."
  },
  {
    slug: "diabetes-gestacional",
    termino: "Diabetes gestacional",
    definicion: "Diabetes que se diagnostica por primera vez durante el embarazo, debido a que las hormonas del embarazo dificultan la acción de la insulina. Suele controlarse con dieta, ejercicio y, en algunos casos, medicación, y normalmente desaparece tras el parto."
  },
  {
    slug: "diabetes-tipo-1",
    termino: "Diabetes tipo 1",
    definicion: "Enfermedad autoinmune en la que el sistema inmunitario destruye las células beta del páncreas, encargadas de producir insulina. Requiere tratamiento con insulina desde el diagnóstico, que suele darse en la infancia o la juventud, aunque puede aparecer a cualquier edad."
  },
  {
    slug: "diabetes-tipo-2",
    termino: "Diabetes tipo 2",
    definicion: "Forma de diabetes asociada a una resistencia progresiva a la insulina, en la que el cuerpo produce insulina pero no la utiliza con eficacia. Suele aparecer en la edad adulta y se relaciona con factores genéticos y de estilo de vida."
  },
  {
    slug: "glucemia",
    termino: "Glucemia",
    definicion: "Nivel de glucosa (azúcar) presente en la sangre en un momento dado, habitualmente medido en mg/dL. Es el valor que miden tanto los glucómetros de punción digital como los sensores de monitorización continua."
  },
  {
    slug: "glp-1",
    termino: "GLP-1 (agonista del receptor de GLP-1)",
    definicion: "Familia de fármacos que imitan una hormona intestinal natural, estimulando la liberación de insulina, ralentizando la digestión y reduciendo el apetito. Se usan tanto para la diabetes tipo 2 como para el control del peso."
  },
  {
    slug: "hba1c",
    termino: "HbA1c (hemoglobina glucosilada)",
    definicion: "Análisis de sangre que refleja el promedio de los niveles de glucosa de los últimos 2-3 meses, y que se usa habitualmente para valorar el control a medio plazo de la diabetes, a diferencia de una medición puntual de glucosa."
  },
  {
    slug: "hiperglucemia",
    termino: "Hiperglucemia",
    definicion: "Nivel de glucosa en sangre más alto de lo habitual. Si es mantenida en el tiempo, es la responsable de buena parte de las complicaciones a largo plazo de la diabetes."
  },
  {
    slug: "hipoglucemia",
    termino: "Hipoglucemia",
    definicion: "Bajada de los niveles de glucosa en sangre por debajo del rango normal, que puede causar síntomas como temblor, sudoración o confusión, y que en casos graves requiere actuar con rapidez."
  },
  {
    slug: "indice-glucemico",
    termino: "Índice glucémico",
    definicion: "Medida que indica con qué rapidez un alimento con carbohidratos eleva la glucosa en sangre en comparación con un alimento de referencia. Los alimentos de índice glucémico bajo elevan la glucosa de forma más lenta y sostenida."
  },
  {
    slug: "insulina-basal",
    termino: "Insulina basal",
    definicion: 'Insulina de acción lenta o prolongada que mantiene un nivel de fondo estable a lo largo del día, sin relación directa con las comidas. Lo explicamos con más detalle en nuestra <a href="tipos-de-insulina.html">guía de tipos de insulina</a>.'
  },
  {
    slug: "insulina-en-bolo",
    termino: "Insulina en bolo",
    definicion: 'Insulina de acción rápida que se administra para cubrir la subida de glucosa producida por una comida, a diferencia de la insulina basal. Más contexto en la <a href="tipos-de-insulina.html">guía de tipos de insulina</a>.'
  },
  {
    slug: "mcg",
    termino: "MCG (monitorización continua de glucosa)",
    definicion: 'Sensor que se coloca sobre la piel y mide la glucosa en el líquido intersticial de forma continua, mostrando los datos en un móvil o lector, sin necesidad de pincharse el dedo cada vez. Puedes ver las últimas novedades en nuestra categoría de <a href="categoria/sensores.html">Sensores</a>.'
  },
  {
    slug: "nefropatia-diabetica",
    termino: "Nefropatía diabética",
    definicion: "Daño progresivo en los riñones causado por niveles de glucosa elevados mantenidos en el tiempo, una de las principales complicaciones microvasculares de la diabetes."
  },
  {
    slug: "neuropatia-diabetica",
    termino: "Neuropatía diabética",
    definicion: "Daño en los nervios asociado a la diabetes, que puede reducir la sensibilidad (sobre todo en los pies) y hacer que heridas o irritaciones pasen desapercibidas."
  },
  {
    slug: "prediabetes",
    termino: "Prediabetes",
    definicion: "Situación en la que los niveles de glucosa están por encima de lo normal, pero todavía no lo suficiente como para diagnosticar diabetes tipo 2. Con cambios en la alimentación y el ejercicio, es posible frenar o revertir su progresión."
  },
  {
    slug: "resistencia-a-la-insulina",
    termino: "Resistencia a la insulina",
    definicion: "Situación en la que las células del cuerpo responden peor de lo habitual a la insulina, por lo que el páncreas necesita producir más cantidad para mantener la glucosa en niveles normales. Es una base común de la diabetes tipo 2 y la prediabetes."
  },
  {
    slug: "retinopatia-diabetica",
    termino: "Retinopatía diabética",
    definicion: "Complicación ocular causada por el daño que la glucosa elevada mantenida en el tiempo produce en los vasos sanguíneos de la retina, y una de las principales causas de pérdida de visión evitable."
  },
  {
    slug: "sglt2",
    termino: "SGLT2 (inhibidor del cotransportador sodio-glucosa tipo 2)",
    definicion: "Familia de fármacos que actúan a nivel renal, favoreciendo la eliminación de glucosa a través de la orina, usados en el tratamiento de la diabetes tipo 2 y con beneficios adicionales a nivel cardiovascular y renal."
  },
  {
    slug: "sindrome-cardio-renal-metabolico",
    termino: "Síndrome cardio-renal-metabólico (CKM)",
    definicion: "Concepto que describe cómo el tejido adiposo, la diabetes tipo 2, la enfermedad renal crónica y las enfermedades cardiovasculares están conectados entre sí, y que refuerza la idea de tratar estos problemas de forma conjunta en lugar de por separado."
  }
];

function stripTags(html) {
  return String(html).replace(/<[^>]+>/g, "");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Recorta por palabra completa para que las meta descripciones no superen el
// límite que Google suele mostrar en el snippet (~155-160 caracteres).
function truncateForMeta(text, max = 155) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
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

function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url }))
  };
}

// items: [{ name, href }]. El último elemento se pinta como página actual
// (sin enlace), igual que en el BreadcrumbList de JSON-LD correspondiente.
function renderBreadcrumbsNav(items) {
  const parts = items.map((it, i) => {
    if (i === items.length - 1) return `<span aria-current="page">${escapeHtml(it.name)}</span>`;
    return `<a href="${it.href}">${escapeHtml(it.name)}</a>`;
  });
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación">${parts.join('<span class="crumb-sep" aria-hidden="true">/</span>')}</nav>`;
}

function renderHeader(prefix, activeCat) {
  const guideLinks = [
    { href: `${prefix}dietas-y-ejercicio.html`, label: "Guía práctica", cat: "guia" },
    { href: `${prefix}bombas-de-insulina.html`, label: "Bombas de insulina", cat: "bombas" },
    { href: `${prefix}tipos-de-insulina.html`, label: "Tipos de insulina", cat: "tipos-insulina" },
    { href: `${prefix}glosario.html`, label: "Glosario", cat: "glosario" }
  ];

  const renderLink = (l, extraClass) =>
    `<a href="${l.href}" class="${[extraClass, l.cat === activeCat ? "active" : ""].filter(Boolean).join(" ")}">${l.label}</a>`;

  const guideHtml = guideLinks.map(l => renderLink(l, "nav-link--guide")).join("\n        ");

  return `  <header class="site-header">
    <div class="header-inner">
      <a href="${prefix}index.html" class="logo"><span>Diabetes<span class="dot">Hoy</span></span></a>
      <nav class="main-nav" aria-label="Navegación principal">
        <a href="${prefix}index.html"${activeCat === "inicio" ? ' class="active"' : ""}>Portada</a>

        <span class="nav-group nav-group--guides" role="group" aria-label="Guías y páginas de referencia">
          ${guideHtml}
        </span>
      </nav>
    </div>
  </header>`;
}

function renderFooter(prefix) {
  const year = new Date().getFullYear();
  return `  <footer class="site-footer">
    <div class="container">
      <span>&copy; ${year} ${SITE_NAME}. Solo novedades sobre diabetes.</span>
      <nav class="footer-nav" aria-label="Sobre DiabetesHoy">
        <a href="${prefix}quienes-somos.html">Quiénes somos</a>
        <a href="${prefix}faq.html">Preguntas frecuentes</a>
        <a href="${prefix}contacto.html">Contacto</a>
      </nav>
      <span>Contenido informativo, no sustituye el consejo médico profesional.</span>
    </div>
  </footer>`;
}

function renderCard(article, prefix, options = {}) {
  const cat = CATEGORIAS[article.categoria];
  const cardClass = ["card reveal", options.featured ? "card--featured" : ""].filter(Boolean).join(" ");
  const eyebrow = options.featured ? `<span class="card-eyebrow">Última noticia</span>` : "";

  return `      <a class="${cardClass}" href="${prefix}${articleUrl(article)}" data-cat="${article.categoria}">
        <div class="card-banner" style="background:${cat.color}">
          <span class="card-icon" aria-hidden="true">${cat.icono}</span>${cat.nombre}
        </div>
        <div class="card-body">
          ${eyebrow}
          <time class="card-date" datetime="${article.fecha}">${formatFecha(article.fecha)}</time>
          <h3 class="card-title">${escapeHtml(article.titulo)}</h3>
          <p class="card-summary">${escapeHtml(article.resumen)}</p>
          <span class="card-link">Leer más &rarr;</span>
        </div>
      </a>`;
}

function renderHead({
  title,
  description,
  url,
  type,
  prefix,
  extraMeta = "",
  jsonLdBlocks = [],
  robots = "index, follow",
  ogImage = OG_IMAGE_URL
}) {
  const jsonLdHtml = jsonLdBlocks
    .map(obj => `  <script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join("\n");

  // El JSON-LD conserva la descripción completa; solo se recorta la que ve
  // el buscador en el <title>/meta description/redes sociales.
  const metaDescription = truncateForMeta(description);

  return `  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(metaDescription)}" />
  <meta name="robots" content="${robots}" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="${type}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(metaDescription)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:locale" content="es_ES" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
${extraMeta}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(metaDescription)}" />
  <meta name="twitter:image" content="${ogImage}" />

  <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="${prefix}css/style.css" />
  <link rel="preconnect" href="https://www.googletagmanager.com" />
  <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}"
     crossorigin="anonymous"></script>
  ${VERCEL_ANALYTICS_SCRIPT}
${jsonLdHtml}`;
}

function renderIndexPage(articles) {
  const sorted = [...articles].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const cardsHtml = sorted
    .map((a, i) => renderCard(a, "", { featured: i === 0 }))
    .join("\n");
  const url = homeUrl(true);
  const title = `${SITE_NAME} · Novedades sobre diabetes`;

  const filterButtons = [
    `      <button class="filter-btn" data-filtro="todas">🗞️ Todas</button>`,
    ...Object.entries(CATEGORIAS).map(
      ([slug, cat]) => `      <button class="filter-btn" data-filtro="${slug}">${cat.icono} ${cat.nombre}</button>`
    )
  ].join("\n");

  const totalFuentes = new Set(articles.map(a => a.fuenteNombre)).size;
  const stats = [
    { valor: articles.length, etiqueta: "Noticias publicadas" },
    { valor: Object.keys(CATEGORIAS).length, etiqueta: "Categorías" },
    { valor: totalFuentes, etiqueta: "Fuentes verificadas" }
  ];
  const statsHtml = stats
    .map(
      s => `        <div class="stat reveal">
          <span class="stat-number" data-count-to="${s.valor}">${s.valor}</span>
          <span class="stat-label">${s.etiqueta}</span>
        </div>`
    )
    .join("\n");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL + "/",
    description: SITE_DESCRIPTION,
    inLanguage: "es",
    publisher: ORG_JSONLD
  };

  const head = renderHead({ title, description: SITE_DESCRIPTION, url, type: "website", prefix: "", jsonLdBlocks: [jsonLd] });

  return `<!DOCTYPE html>
<html lang="es">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", "inicio")}

  <main class="container">
    <section class="hero">
      <div class="hero-blob hero-blob--1" aria-hidden="true"></div>
      <div class="hero-blob hero-blob--2" aria-hidden="true"></div>
      <h1>Novedades sobre diabetes</h1>
      <p>Sensores, medicación, estudios clínicos, dietas, ejercicio y complicaciones: un resumen claro de lo último, siempre con enlace a la fuente original.</p>
      <div class="stats-bar">
${statsHtml}
      </div>
    </section>

    <div class="filters" role="group" aria-label="Filtrar por categoría">
${filterButtons}
    </div>

    <div class="grid" id="grid">
${cardsHtml}
    </div>
    <p class="empty-state" id="empty-state" hidden>No hay artículos en esta categoría todavía.</p>

    <div class="disclaimer">
      Este sitio recopila y resume información publicada por otros medios y fuentes especializadas con fines informativos. No constituye consejo médico: consulta siempre con tu equipo de salud antes de tomar decisiones sobre tratamiento, medicación o dieta. Más detalles en <a href="quienes-somos.html">quiénes somos</a> y en las <a href="faq.html">preguntas frecuentes</a>.
    </div>
  </main>

${renderFooter("")}

  <script src="js/filter.js"></script>
  <script src="js/motion.js"></script>
</body>
</html>
`;
}

function renderArticlePage(article, allArticles) {
  const cat = CATEGORIAS[article.categoria];
  const url = `${SITE_URL}/${articleUrl(article)}`;
  const title = `${article.tituloSeo || article.titulo} · ${SITE_NAME}`;
  const bodyHtml = article.cuerpo.map(p => `      <p>${escapeHtml(p)}</p>`).join("\n");
  const ogImage = ogImageForArticle(article);

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.titulo,
    description: article.resumen,
    datePublished: article.fecha,
    dateModified: article.fecha,
    inLanguage: "es",
    articleSection: cat.nombre,
    image: ogImage,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isBasedOn: article.fuenteUrl,
    publisher: ORG_JSONLD
  };

  const breadcrumbItems = [
    { name: "Portada", href: "../index.html", url: SITE_URL + "/" },
    { name: cat.nombre, href: `../categoria/${article.categoria}.html`, url: `${SITE_URL}/categoria/${article.categoria}.html` },
    { name: article.titulo, url }
  ];
  const jsonLdBreadcrumb = breadcrumbJsonLd(breadcrumbItems);

  const extraMeta = `  <meta property="article:published_time" content="${article.fecha}" />
  <meta property="article:section" content="${escapeHtml(cat.nombre)}" />
`;

  const head = renderHead({
    title,
    description: article.resumen,
    url,
    type: "article",
    prefix: "../",
    extraMeta,
    jsonLdBlocks: [jsonLdArticle, jsonLdBreadcrumb],
    ogImage
  });

  const related = allArticles
    .filter(a => a.categoria === article.categoria && a.id !== article.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 3);

  const relatedHtml = related.length
    ? `  <section class="related-articles">
    <div class="article-wrap">
      <h2>Más noticias de ${escapeHtml(cat.nombre)}</h2>
      <ul>
${related
        .map(
          a => `        <li><a href="${a.id}.html">${escapeHtml(a.titulo)}</a> <time datetime="${a.fecha}">${formatFecha(a.fecha)}</time></li>`
        )
        .join("\n")}
      </ul>
    </div>
  </section>`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("../", article.categoria)}

  <main class="article-wrap">
    ${renderBreadcrumbsNav(breadcrumbItems)}
    <span class="badge" style="background:${cat.color}">${cat.icono} ${cat.nombre}</span>
    <h1>${escapeHtml(article.titulo)}</h1>
    <time class="article-meta" datetime="${article.fecha}">${formatFecha(article.fecha)}</time>
    <div class="article-body">
${bodyHtml}
    </div>
    <div class="source-box">
      Fuente original: <a href="${article.fuenteUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(article.fuenteNombre)}</a>
    </div>
  </main>

${relatedHtml}

${renderFooter("../")}
  <script src="../js/motion.js"></script>
</body>
</html>
`;
}

function renderAboutPage() {
  const title = `Quiénes somos · ${SITE_NAME}`;
  const description =
    "Qué es DiabetesHoy, cómo seleccionamos las noticias sobre diabetes que publicamos y por qué no sustituyen el consejo médico profesional.";
  const url = `${SITE_URL}/quienes-somos.html`;

  const breadcrumbItems = [
    { name: "Portada", href: "index.html", url: SITE_URL + "/" },
    { name: "Quiénes somos", url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Quiénes somos",
    url,
    description,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL + "/" }
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "website",
    prefix: "",
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)]
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", null)}

  <main class="article-wrap">
    ${renderBreadcrumbsNav(breadcrumbItems)}
    <h1>Quiénes somos</h1>
    <p class="lead">DiabetesHoy es un proyecto independiente que resume noticias públicas sobre diabetes y enlaza siempre a la fuente original de cada una.</p>

    <div class="article-body">
      <h2>Qué es DiabetesHoy</h2>
      <p>DiabetesHoy no es un medio de comunicación ni una institución sanitaria. Es un proyecto de curación de contenidos que sigue novedades públicas sobre sensores de glucosa, medicación, estudios clínicos, dietas, ejercicio y complicaciones relacionadas con la diabetes, y las resume en un formato breve y claro.</p>

      <h2>Cómo seleccionamos las noticias</h2>
      <p>Priorizamos fuentes públicas y especializadas: sociedades científicas, agencias reguladoras, medios especializados en diabetes y publicaciones médicas. Cada artículo enlaza directamente a la fuente original usada para redactarlo, para que puedas consultar la información completa y verificarla.</p>

      <h2>Nuestro compromiso con la información de salud</h2>
      <p>Los temas relacionados con la salud requieren especial cuidado. Por eso todo el contenido de DiabetesHoy es informativo y divulgativo, no está escrito por profesionales médicos y en ningún caso sustituye el diagnóstico, el tratamiento o el consejo de un profesional sanitario. Ante cualquier duda sobre tu salud, consulta siempre con tu equipo médico.</p>

      <h2>Correcciones y sugerencias</h2>
      <p>Si detectas un error en algún artículo o quieres sugerir un tema, puedes escribirnos desde la página de <a href="contacto.html">contacto</a>.</p>
    </div>
  </main>

${renderFooter("")}
  <script src="js/motion.js"></script>
</body>
</html>
`;
}

function renderFaqPage() {
  const title = `Preguntas frecuentes · ${SITE_NAME}`;
  const description = "Resolvemos las dudas más habituales sobre DiabetesHoy: qué es, cómo seleccionamos las noticias y si sustituye el consejo médico.";
  const url = `${SITE_URL}/faq.html`;

  const breadcrumbItems = [
    { name: "Portada", href: "index.html", url: SITE_URL + "/" },
    { name: "Preguntas frecuentes", url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(item => ({
      "@type": "Question",
      name: item.pregunta,
      acceptedAnswer: { "@type": "Answer", text: item.respuesta }
    }))
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "website",
    prefix: "",
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)]
  });

  const faqHtml = FAQ_ITEMS.map(
    item => `      <h2>${escapeHtml(item.pregunta)}</h2>
      <p>${escapeHtml(item.respuesta)}</p>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", null)}

  <main class="article-wrap">
    ${renderBreadcrumbsNav(breadcrumbItems)}
    <h1>Preguntas frecuentes</h1>
    <p class="lead">Dudas habituales sobre DiabetesHoy y su contenido.</p>

    <div class="article-body">
${faqHtml}
    </div>
  </main>

${renderFooter("")}
  <script src="js/motion.js"></script>
</body>
</html>
`;
}

function renderContactPage() {
  const title = `Contacto · ${SITE_NAME}`;
  const description = "Cómo ponerte en contacto con DiabetesHoy para corregir un error o sugerir un tema. No es un canal de consulta médica.";
  const url = `${SITE_URL}/contacto.html`;

  const breadcrumbItems = [
    { name: "Portada", href: "index.html", url: SITE_URL + "/" },
    { name: "Contacto", url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contacto",
    url,
    description
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "website",
    prefix: "",
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)]
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", null)}

  <main class="article-wrap">
    ${renderBreadcrumbsNav(breadcrumbItems)}
    <h1>Contacto</h1>
    <p class="lead">¿Has visto un error en una noticia o quieres sugerir un tema? Escríbenos.</p>

    <div class="article-body">
      <p>Puedes contactar con DiabetesHoy escribiendo a <a href="mailto:contacto@diabeteshoy.com">contacto@diabeteshoy.com</a>.</p>
      <p>Este canal es para correcciones, dudas sobre el propio sitio o sugerencias de noticias. No es un canal de consulta médica: para cualquier duda sobre tu salud, contacta con tu equipo médico.</p>
    </div>
  </main>

${renderFooter("")}
  <script src="js/motion.js"></script>
</body>
</html>
`;
}

function renderGuidePage() {
  const title = `Dietas y ejercicio diario para la diabetes · ${SITE_NAME}`;
  const description =
    "Ejemplo de plato saludable e ideas de comidas, junto con una rutina semanal de ejercicio (caminar, fuerza y estiramientos) pensada para personas con diabetes.";
  const url = `${SITE_URL}/dietas-y-ejercicio.html`;

  const breadcrumbItems = [
    { name: "Portada", href: "index.html", url: SITE_URL + "/" },
    { name: "Guía práctica", url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Dietas y ejercicio diario para la diabetes: guía práctica",
    description,
    inLanguage: "es",
    url,
    image: OG_IMAGE_URL,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: ORG_JSONLD
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "article",
    prefix: "",
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)]
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", "guia")}

  <main class="article-wrap">
    ${renderBreadcrumbsNav(breadcrumbItems)}
    <h1>Dietas y ejercicio diario para la diabetes</h1>
    <p class="lead">Un plato de ejemplo y una rutina semanal sencilla, basados en las pautas generales recogidas en nuestras noticias de <a href="categoria/dietas.html">Dietas</a> y <a href="categoria/ejercicio.html">Ejercicio</a>.</p>

    <div class="disclaimer">
      Esta guía es orientativa y general: no sustituye un plan de alimentación o de ejercicio personalizado. Antes de cambiar tu dieta o de empezar una rutina nueva, consulta con tu médico, endocrino o educador en diabetes, especialmente si usas insulina u otra medicación que pueda causar hipoglucemias.
    </div>

    <div class="article-body">
      <h2>Un plato de ejemplo para las comidas principales</h2>
      <img class="guide-image reveal" src="img/plato-alimentacion.png" width="832" height="548" loading="lazy" alt="Plato dividido en 50% verduras y hortalizas, 25% proteína y 25% cereales o carbohidratos, con un tenedor y un cuchillo a los lados" />
      <p>Una forma sencilla de organizar comidas y cenas es dividir el plato en tres partes: la mitad con verduras y hortalizas, un cuarto con cereales integrales o carbohidratos de bajo índice glucémico (arroz integral, legumbres, patata con piel) y el último cuarto con una fuente de proteína magra (pescado, huevo, legumbres o carne magra). Más contexto en la noticia sobre la <a href="articulos/nice-2026-nutricion.html">guía NICE 2026</a> y sobre los <a href="articulos/dieta-base-vegetal.html">patrones alimentarios de base vegetal</a>.</p>

      <h2>Ideas para el día a día</h2>
      <ul>
        <li>Prioriza fruta entera frente a zumos, ya que aporta más fibra y produce una subida de glucosa más lenta.</li>
        <li>Cambia los cereales o el pan refinado por versiones integrales siempre que puedas.</li>
        <li>Incluye legumbres varias veces por semana como fuente de proteína y fibra.</li>
        <li>Modera los ultraprocesados y las bebidas azucaradas, presentes en muchas rutinas sin que nos demos cuenta.</li>
      </ul>
      <p>Estas ideas resumen los mensajes generales de nuestra noticia sobre <a href="articulos/perdida-peso-control-metabolico.html">pérdida de peso y control metabólico</a>.</p>

      <h2>Rutina semanal: actividad aeróbica</h2>
      <p>Las guías generales recomiendan unos 150 minutos semanales de actividad aeróbica moderada: caminar a paso ligero, nadar, ir en bicicleta o bailar son buenas opciones que se pueden repartir en sesiones de 20-30 minutos la mayoría de los días. Más información en la noticia sobre <a href="articulos/ejercicio-prevencion-diabetes-58.html">ejercicio y prevención de la diabetes tipo 2</a>.</p>

      <h2>Rutina semanal: fuerza</h2>
      <p>Complementar el ejercicio aeróbico con 2 sesiones semanales de entrenamiento de fuerza (con el propio peso corporal, bandas elásticas o pesas) se asocia a mejoras adicionales en el control glucémico. Puedes empezar con series cortas y aumentar la intensidad de forma progresiva. Más detalles en la noticia sobre <a href="articulos/entrenamiento-fuerza-hba1c.html">entrenamiento de fuerza y HbA1c</a>.</p>

      <h2>Pausas activas y estiramientos</h2>
      <p>Además del ejercicio programado, procura interrumpir los periodos largos sentado cada 30 minutos: levantarte a caminar un momento o hacer unos estiramientos suaves ayuda a mejorar la glucemia a lo largo del día. Lo explicamos con más detalle en la noticia sobre <a href="articulos/sedentarismo-cada-30-minutos.html">interrumpir el sedentarismo</a>.</p>
    </div>

    <div class="disclaimer">
      Recuerda: esta guía es información general y divulgativa, no un plan médico o nutricional personalizado. Consulta siempre con un profesional sanitario antes de hacer cambios importantes en tu dieta o en tu actividad física. Más contexto en <a href="quienes-somos.html">quiénes somos</a>.
    </div>
  </main>

${renderFooter("")}
  <script src="js/motion.js"></script>
</body>
</html>
`;
}

function renderPumpsPage() {
  const title = `Comparativa de bombas de insulina · ${SITE_NAME}`;
  const description =
    "Comparativa de las principales bombas de insulina (Omnipod 5, MiniMed 780G, t:slim X2, YpsoPump e iLet Bionic Pancreas): tipo, sensores compatibles y qué las diferencia.";
  const url = `${SITE_URL}/bombas-de-insulina.html`;

  const breadcrumbItems = [
    { name: "Portada", href: "index.html", url: SITE_URL + "/" },
    { name: "Bombas de insulina", url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Comparativa de bombas de insulina",
    description,
    inLanguage: "es",
    url,
    image: OG_IMAGE_URL,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: ORG_JSONLD
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "article",
    prefix: "",
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)]
  });

  const tableRows = PUMPS.map(
    p => `        <tr>
          <td>${escapeHtml(p.modelo)}</td>
          <td>${escapeHtml(p.fabricante)}</td>
          <td>${escapeHtml(p.tipo)}</td>
          <td>${escapeHtml(p.sensores)}</td>
          <td>${escapeHtml(p.destacado)}</td>
        </tr>`
  ).join("\n");

  const detailBlocks = PUMPS.map(
    p => `      <h3>${escapeHtml(p.modelo)} <span class="text-muted">— ${escapeHtml(p.fabricante)}</span></h3>
      <p>${escapeHtml(p.detalle)} Fuente: <a href="${p.fuenteUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.fuenteNombre)}</a>.</p>`
  ).join("\n\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", "bombas")}

  <main class="article-wrap article-wrap--wide">
    ${renderBreadcrumbsNav(breadcrumbItems)}
    <h1>Comparativa de bombas de insulina</h1>
    <p class="lead">Un vistazo rápido a algunas de las bombas de insulina disponibles actualmente, con sus principales diferencias.</p>

    <div class="disclaimer">
      Esta comparativa es orientativa y no exhaustiva: la disponibilidad, las combinaciones con sensores y las condiciones de financiación varían según el país y el sistema de salud. La elección de una bomba de insulina debe hacerse siempre con tu equipo médico o educador en diabetes, que puede valorar cuál se ajusta mejor a tu caso.
    </div>

    <div class="table-scroll reveal">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Bomba</th>
            <th>Fabricante</th>
            <th>Tipo</th>
            <th>Sensores compatibles</th>
            <th>Lo más destacado</th>
          </tr>
        </thead>
        <tbody>
${tableRows}
        </tbody>
      </table>
    </div>

    <div class="article-body">
      <h2>Cada bomba, con más detalle</h2>
${detailBlocks}
    </div>

    <div class="disclaimer">
      Recuerda: esta página no sustituye el consejo médico. Consulta con tu equipo de diabetes qué opción se adapta mejor a tu tratamiento, tu estilo de vida y tu cobertura sanitaria. Más contexto en <a href="quienes-somos.html">quiénes somos</a>.
    </div>
  </main>

${renderFooter("")}
  <script src="js/motion.js"></script>
</body>
</html>
`;
}

function renderInsulinTypesPage() {
  const title = `Tipos de insulina: guía sencilla · ${SITE_NAME}`;
  const description =
    "Insulina rápida, corta, intermedia, prolongada, ultraprolongada y premezclada explicadas en palabras sencillas: cuándo empiezan a actuar, cuánto duran y para qué se usa cada una.";
  const url = `${SITE_URL}/tipos-de-insulina.html`;

  const breadcrumbItems = [
    { name: "Portada", href: "index.html", url: SITE_URL + "/" },
    { name: "Tipos de insulina", url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Tipos de insulina: guía sencilla de cómo actúan",
    description,
    inLanguage: "es",
    url,
    image: OG_IMAGE_URL,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: ORG_JSONLD
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "article",
    prefix: "",
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)]
  });

  const tableRows = INSULIN_TYPES.map(
    t => `        <tr>
          <td>${escapeHtml(t.tipo)}</td>
          <td>${escapeHtml(t.ejemplos)}</td>
          <td>${escapeHtml(t.inicio)}</td>
          <td>${escapeHtml(t.pico)}</td>
          <td>${escapeHtml(t.duracion)}</td>
        </tr>`
  ).join("\n");

  const detailBlocks = INSULIN_TYPES.map(
    t => `      <h3>Insulina ${escapeHtml(t.tipo.toLowerCase())}</h3>
      <p>${escapeHtml(t.detalle)} <strong>¿Cuándo se usa?</strong> ${escapeHtml(t.uso)}</p>`
  ).join("\n\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", "tipos-insulina")}

  <main class="article-wrap article-wrap--wide">
    ${renderBreadcrumbsNav(breadcrumbItems)}
    <h1>Tipos de insulina: guía sencilla de cómo actúan</h1>
    <p class="lead">Explicamos en palabras sencillas, sin tecnicismos, los principales tipos de insulina que existen y en qué se diferencian.</p>

    <div class="disclaimer">
      Esta guía es divulgativa y general: no está pensada para ajustar dosis ni para sustituir la pauta que te haya indicado tu médico o educador en diabetes. El tipo, la dosis y el horario de insulina siempre deben decidirse con tu equipo médico, de forma individualizada.
    </div>

    <div class="article-body">
      <h2>La idea básica: insulina "basal" e insulina "en bolo"</h2>
      <p>Un páncreas que funciona con normalidad libera insulina de dos formas: un poco constantemente durante todo el día (para mantener la glucosa estable entre comidas y durante la noche) y bastante más de golpe cuando se come (para gestionar la subida de glucosa de esa comida). Los tratamientos con insulina intentan imitar ese mismo patrón combinando dos tipos de insulina con perfiles distintos: una insulina de acción lenta que hace de "insulina basal" (el nivel de fondo) y una insulina de acción rápida que hace de "insulina en bolo" (la que cubre las comidas). El resto de tipos de insulina son, básicamente, variaciones de estos dos perfiles.</p>

      <h2>Comparativa rápida de los tipos de insulina</h2>
    </div>

    <div class="table-scroll reveal">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Ejemplos</th>
            <th>Inicio de acción</th>
            <th>Pico de acción</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
${tableRows}
        </tbody>
      </table>
    </div>
    <p class="table-note">Los tiempos son orientativos: pueden variar de una persona a otra y según la zona del cuerpo donde se inyecte. Datos basados en los <a href="https://www.cdc.gov/diabetes/es/about/tipos-de-insulina.html" target="_blank" rel="noopener noreferrer">tipos de insulina de los CDC (Centros para el Control y la Prevención de Enfermedades de EE. UU.)</a>.</p>

    <div class="article-body">
      <h2>Cada tipo de insulina, explicado con más detalle</h2>
${detailBlocks}

      <h2>Preguntas habituales</h2>

      <h3>¿Por qué hay tantos tipos de insulina distintos?</h3>
      <p>Porque cada persona necesita una combinación distinta de insulina "de fondo" y de insulina "para las comidas", según su rutina, sus horarios y el tipo de diabetes que tenga. Tener varios tipos con distinta velocidad y duración permite ajustar el tratamiento a cada caso.</p>

      <h3>¿Qué diferencia hay entre insulina humana y análogos de insulina?</h3>
      <p>La insulina humana (como la regular o la NPH) tiene una estructura idéntica a la que produce el cuerpo humano. Los análogos (como lispro, aspart, glargina o degludec) son insulinas modificadas ligeramente en el laboratorio para que actúen más rápido o durante más tiempo, según el caso. Ambos tipos son insulinas reales y llevan décadas usándose con seguridad bajo prescripción médica.</p>

      <h3>¿Se pueden mezclar distintos tipos de insulina en la misma jeringa o pluma?</h3>
      <p>Depende del tipo concreto de insulina: algunas combinaciones están pensadas para mezclarse (como las insulinas premezcladas) y otras no deben mezclarse entre sí. Esto siempre debe indicarlo el equipo médico, ya que mezclar insulinas de forma incorrecta puede alterar cómo actúan.</p>

      <h3>¿Todas las insulinas se administran de la misma forma?</h3>
      <p>La forma más habitual es la inyección subcutánea (con pluma, jeringa o bomba de insulina), aunque el dispositivo y la zona de inyección pueden influir ligeramente en la rapidez con la que actúa. Puedes ver cómo funcionan las bombas de insulina, que usan insulina de acción rápida de forma continua, en nuestra <a href="bombas-de-insulina.html">comparativa de bombas de insulina</a>.</p>
    </div>

    <div class="disclaimer">
      Recuerda: el objetivo de esta página es que entiendas mejor cómo funciona tu tratamiento o el de alguien cercano, no sustituir a tu equipo médico. Cualquier cambio de tipo, dosis u horario de insulina debe hacerse siempre con supervisión profesional. Más contexto en <a href="quienes-somos.html">quiénes somos</a>.
    </div>
  </main>

${renderFooter("")}
  <script src="js/motion.js"></script>
</body>
</html>
`;
}

function renderCategoryPage(slug, articles) {
  const cat = CATEGORIAS[slug];
  const articulosCategoria = articles
    .filter(a => a.categoria === slug)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const title = `${cat.nombre}: novedades sobre diabetes · ${SITE_NAME}`;
  const description = cat.descripcion;
  const url = `${SITE_URL}/categoria/${slug}.html`;

  const breadcrumbItems = [
    { name: "Portada", href: "../index.html", url: SITE_URL + "/" },
    { name: cat.nombre, url }
  ];

  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.nombre}: novedades sobre diabetes`,
    description,
    url,
    inLanguage: "es",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL + "/" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articulosCategoria.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: articleUrl(a, true),
        name: a.titulo
      }))
    }
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "website",
    prefix: "../",
    jsonLdBlocks: [jsonLdCollection, breadcrumbJsonLd(breadcrumbItems)]
  });

  const cardsHtml = articulosCategoria.map(a => renderCard(a, "../")).join("\n");

  const relatedGuidesHtml = cat.guiasRelacionadas.length
    ? `    <div class="callout">
      <strong>También te puede interesar:</strong>
      ${cat.guiasRelacionadas.map(g => `<a href="../${g.href}">${escapeHtml(g.label)}</a>`).join(" · ")}
    </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("../", null)}

  <main class="container">
    ${renderBreadcrumbsNav(breadcrumbItems)}
    <section class="hero hero--compact">
      <span class="badge" style="background:${cat.color}">${cat.icono} ${cat.nombre}</span>
      <h1>${cat.nombre}: novedades sobre diabetes</h1>
      <p>${escapeHtml(cat.descripcion)}</p>
    </section>

${relatedGuidesHtml}

    <div class="grid">
${cardsHtml}
    </div>

    <div class="disclaimer">
      Este sitio recopila y resume información publicada por otros medios y fuentes especializadas con fines informativos. No constituye consejo médico: consulta siempre con tu equipo de salud antes de tomar decisiones sobre tratamiento, medicación o dieta.
    </div>
  </main>

${renderFooter("../")}
  <script src="../js/motion.js"></script>
</body>
</html>
`;
}

function renderGlossaryPage() {
  const title = `Glosario de términos sobre diabetes · ${SITE_NAME}`;
  const description = "Diccionario sencillo de términos habituales sobre diabetes: HbA1c, insulina basal y en bolo, hipoglucemia, resistencia a la insulina, MCG y más, explicados en palabras claras.";
  const url = `${SITE_URL}/glosario.html`;

  const breadcrumbItems = [
    { name: "Portada", href: "index.html", url: SITE_URL + "/" },
    { name: "Glosario", url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glosario de términos sobre diabetes",
    description,
    url,
    inLanguage: "es",
    hasDefinedTerm: GLOSSARY_ITEMS.map(item => ({
      "@type": "DefinedTerm",
      name: item.termino,
      description: stripTags(item.definicion),
      url: `${url}#${item.slug}`
    }))
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "website",
    prefix: "",
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)]
  });

  const tocHtml = GLOSSARY_ITEMS.map(item => `<a href="#${item.slug}">${escapeHtml(item.termino)}</a>`).join("\n        ");

  const termsHtml = GLOSSARY_ITEMS.map(
    item => `      <h2 id="${item.slug}">${escapeHtml(item.termino)}</h2>
      <p>${item.definicion}</p>`
  ).join("\n\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", "glosario")}

  <main class="article-wrap">
    ${renderBreadcrumbsNav(breadcrumbItems)}
    <h1>Glosario de términos sobre diabetes</h1>
    <p class="lead">Un diccionario breve, en palabras sencillas, de los términos que más se repiten al hablar de diabetes.</p>

    <div class="disclaimer">
      Estas definiciones son generales y divulgativas: no sustituyen la información que te dé tu equipo médico sobre tu caso concreto.
    </div>

    <nav class="glossary-toc" aria-label="Índice de términos">
        ${tocHtml}
    </nav>

    <div class="article-body">
${termsHtml}
    </div>
  </main>

${renderFooter("")}
  <script src="js/motion.js"></script>
</body>
</html>
`;
}

function renderSitemap(articles) {
  const staticPages = [
    "quienes-somos.html",
    "faq.html",
    "contacto.html",
    "dietas-y-ejercicio.html",
    "bombas-de-insulina.html",
    "tipos-de-insulina.html",
    "glosario.html"
  ];

  const categoryUrls = Object.keys(CATEGORIAS).map(slug => {
    const articulosCategoria = articles.filter(a => a.categoria === slug);
    const lastmod = articulosCategoria.reduce((max, a) => (a.fecha > max ? a.fecha : max), articulosCategoria[0].fecha);
    return { loc: `${SITE_URL}/categoria/${slug}.html`, lastmod };
  });

  const urls = [
    { loc: `${SITE_URL}/`, lastmod: articles.reduce((max, a) => (a.fecha > max ? a.fecha : max), articles[0].fecha) },
    ...articles.map(a => ({ loc: `${SITE_URL}/${articleUrl(a)}`, lastmod: a.fecha })),
    ...staticPages.map(p => ({ loc: `${SITE_URL}/${p}`, lastmod: STATIC_PAGES_LASTMOD })),
    ...categoryUrls
  ];

  const body = urls
    .map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function renderRobotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function renderNotFoundPage() {
  const title = `Página no encontrada · ${SITE_NAME}`;
  const description = "La página que buscas no existe o se ha movido. Vuelve a la portada de DiabetesHoy para ver las últimas noticias.";
  const url = `${SITE_URL}/404.html`;

  // noindex: es una página de error, no debe aparecer en los resultados de búsqueda.
  const head = renderHead({ title, description, url, type: "website", prefix: "", robots: "noindex, follow" });

  return `<!DOCTYPE html>
<html lang="es">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", null)}

  <main class="article-wrap">
    <h1>Página no encontrada</h1>
    <p class="lead">Lo sentimos, la página que buscas no existe o se ha movido.</p>

    <div class="article-body">
      <p>Puedes volver a la <a href="index.html">portada</a>, consultar la <a href="dietas-y-ejercicio.html">guía práctica</a>, la <a href="bombas-de-insulina.html">comparativa de bombas de insulina</a> o los <a href="tipos-de-insulina.html">tipos de insulina</a>, o revisar las <a href="faq.html">preguntas frecuentes</a>.</p>
    </div>
  </main>

${renderFooter("")}
  <script src="js/motion.js"></script>
</body>
</html>
`;
}

function main() {
  const CATEGORY_DIR = path.join(ROOT, "categoria");
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  fs.mkdirSync(CATEGORY_DIR, { recursive: true });

  fs.writeFileSync(path.join(ROOT, "index.html"), renderIndexPage(ARTICLES));
  fs.writeFileSync(path.join(ROOT, "dietas-y-ejercicio.html"), renderGuidePage());
  fs.writeFileSync(path.join(ROOT, "bombas-de-insulina.html"), renderPumpsPage());
  fs.writeFileSync(path.join(ROOT, "tipos-de-insulina.html"), renderInsulinTypesPage());
  fs.writeFileSync(path.join(ROOT, "glosario.html"), renderGlossaryPage());
  fs.writeFileSync(path.join(ROOT, "quienes-somos.html"), renderAboutPage());
  fs.writeFileSync(path.join(ROOT, "faq.html"), renderFaqPage());
  fs.writeFileSync(path.join(ROOT, "contacto.html"), renderContactPage());
  fs.writeFileSync(path.join(ROOT, "404.html"), renderNotFoundPage());

  for (const article of ARTICLES) {
    fs.writeFileSync(path.join(ARTICLES_DIR, `${article.id}.html`), renderArticlePage(article, ARTICLES));
  }

  for (const slug of Object.keys(CATEGORIAS)) {
    fs.writeFileSync(path.join(CATEGORY_DIR, `${slug}.html`), renderCategoryPage(slug, ARTICLES));
  }

  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), renderSitemap(ARTICLES));
  fs.writeFileSync(path.join(ROOT, "robots.txt"), renderRobotsTxt());

  console.log(
    `Generadas ${ARTICLES.length} páginas de artículo + index.html + ${Object.keys(CATEGORIAS).length} páginas de categoría + guía práctica + glosario + 3 páginas de apoyo + sitemap.xml + robots.txt`
  );
}

main();
