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
const SITE_DESCRIPTION_EN =
  "Diabetes news: sensors, medication, clinical studies, diet, exercise and complications, with a link to the original source of each story.";

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
      "DiabetesHoy es un proyecto independiente que resume noticias públicas sobre diabetes (sensores, medicación, estudios clínicos, dietas, ejercicio y complicaciones) y enlaza siempre a la fuente original de cada una para que puedas verificarla.",
    preguntaEn: "What is DiabetesHoy?",
    respuestaEn:
      "DiabetesHoy is an independent project that summarizes public news about diabetes (sensors, medication, clinical studies, diet, exercise and complications) and always links to the original source of each one so you can verify it."
  },
  {
    pregunta: "¿El contenido de DiabetesHoy sustituye el consejo médico?",
    respuesta:
      "No. Todo el contenido tiene fines informativos y no sustituye el diagnóstico, el tratamiento ni el consejo de un profesional sanitario. Consulta siempre con tu equipo médico antes de tomar decisiones sobre tratamiento, medicación o dieta.",
    preguntaEn: "Does DiabetesHoy's content replace medical advice?",
    respuestaEn:
      "No. All content is for informational purposes only and does not replace the diagnosis, treatment or advice of a healthcare professional. Always consult your medical team before making decisions about treatment, medication or diet."
  },
  {
    pregunta: "¿Con qué frecuencia se actualizan las noticias?",
    respuesta:
      "Se añaden nuevas noticias a medida que aparecen novedades relevantes en las fuentes que seguimos. No hay una periodicidad fija, pero puedes consultar la fecha de publicación de cada artículo en su propia página.",
    preguntaEn: "How often is the news updated?",
    respuestaEn:
      "New stories are added as relevant developments appear in the sources we follow. There's no fixed schedule, but you can check each article's publication date on its own page."
  },
  {
    pregunta: "¿Cómo se seleccionan las fuentes?",
    respuesta:
      "Priorizamos fuentes públicas y especializadas: sociedades científicas, agencias reguladoras, medios especializados en diabetes y publicaciones médicas. Cada artículo de DiabetesHoy enlaza directamente a la fuente original usada para redactarlo.",
    preguntaEn: "How are sources selected?",
    respuestaEn:
      "We prioritize public and specialized sources: scientific societies, regulatory agencies, media outlets specializing in diabetes and medical publications. Every DiabetesHoy article links directly to the original source used to write it."
  },
  {
    pregunta: "¿Los artículos están escritos por profesionales médicos?",
    respuesta:
      "No. DiabetesHoy es un proyecto de curación y resumen de noticias, no un medio médico ni una institución sanitaria. Por eso cada artículo enlaza a su fuente original, para que puedas consultar la información completa y contrastarla con tu equipo médico.",
    preguntaEn: "Are the articles written by medical professionals?",
    respuestaEn:
      "No. DiabetesHoy is a news curation and summarization project, not a medical outlet or healthcare institution. That's why every article links to its original source, so you can check the full information and verify it with your medical team."
  },
  {
    pregunta: "¿Qué diferencia hay entre diabetes tipo 1 y tipo 2?",
    respuesta:
      "De forma general, la diabetes tipo 1 es una enfermedad autoinmune en la que el cuerpo deja de producir insulina, y suele diagnosticarse en la infancia o juventud. La diabetes tipo 2 se asocia a una resistencia progresiva a la insulina y suele aparecer en la edad adulta, aunque cada caso es distinto. Para un diagnóstico o información personalizada, consulta a un profesional sanitario.",
    preguntaEn: "What's the difference between type 1 and type 2 diabetes?",
    respuestaEn:
      "Broadly speaking, type 1 diabetes is an autoimmune disease in which the body stops producing insulin, and is usually diagnosed in childhood or youth. Type 2 diabetes is linked to progressive insulin resistance and tends to appear in adulthood, though every case is different. For a diagnosis or personalized information, consult a healthcare professional."
  },
  {
    pregunta: "¿Qué es un sensor de monitorización continua de glucosa (MCG)?",
    respuesta:
      "Es un pequeño dispositivo que se coloca sobre la piel y mide de forma continua el nivel de glucosa en el líquido intersticial, mostrando los datos en un móvil o lector, sin necesidad de pincharse el dedo cada vez. Puedes ver ejemplos de novedades sobre estos dispositivos en la categoría Sensores.",
    preguntaEn: "What is a continuous glucose monitoring (CGM) sensor?",
    respuestaEn:
      "It's a small device worn on the skin that continuously measures glucose levels in interstitial fluid, showing the data on a phone or reader, without needing a finger prick every time. You can see examples of news about these devices in the Sensors category."
  },
  {
    pregunta: "He encontrado un error o quiero sugerir una noticia, ¿qué hago?",
    respuesta:
      "Escríbenos desde la página de contacto. Revisamos cualquier corrección señalada y valoramos las sugerencias de temas para futuras noticias.",
    preguntaEn: "I found an error or want to suggest a story — what do I do?",
    respuestaEn:
      "Write to us through the contact page. We review any correction flagged and consider topic suggestions for future stories."
  }
];

const PUMPS = [
  {
    modelo: "Omnipod 5",
    fabricante: "Insulet",
    tipo: "Sin tubo (parche), impermeable",
    tipoEn: "Tubeless (patch), waterproof",
    sensores: "Dexcom G6, G7 y FreeStyle Libre 2 Plus",
    sensoresEn: "Dexcom G6, G7 and FreeStyle Libre 2 Plus",
    destacado: "Se controla desde el móvil o un controlador dedicado, sin tubo visible; cada Pod dura hasta 3 días.",
    destacadoEn: "Controlled from a phone or dedicated controller, no visible tubing; each Pod lasts up to 3 days.",
    detalle:
      "El Pod se lleva pegado directamente sobre la piel y no lleva tubo de conexión. El algoritmo SmartAdjust ajusta la insulina basal automáticamente cada 5 minutos según los datos del sensor. Cada Pod admite hasta 200 unidades de insulina de acción rápida y se cambia cada 3 días.",
    detalleEn:
      "The Pod is worn directly on the skin with no connecting tube. The SmartAdjust algorithm automatically adjusts basal insulin every 5 minutes based on sensor data. Each Pod holds up to 200 units of rapid-acting insulin and is changed every 3 days.",
    fuenteNombre: "Comparativa de bombas de insulina, LMC Diabetes & Endocrinology (feb. 2026)",
    fuenteUrl: "https://www.lmc.ca/wp-content/uploads/2026/02/EN-LMC-Pump-Comparison-Chart-Feb-2026-.pdf"
  },
  {
    modelo: "MiniMed 780G",
    fabricante: "Medtronic",
    tipo: "Con tubo, pantalla integrada",
    tipoEn: "Tubed, built-in display",
    sensores: "Guardian 4 y Simplera Sync",
    sensoresEn: "Guardian 4 and Simplera Sync",
    destacado: "Ajustes basales muy finos (desde 0,025 U/hora) y detección avanzada de comidas.",
    destacadoEn: "Very fine basal adjustments (from 0.025 U/hour) and advanced meal detection.",
    detalle:
      "Su algoritmo SmartGuard corrige automáticamente cada 5 minutos y permite ajustes de insulina basal especialmente precisos, lo que puede resultar útil para personas con necesidades de insulina bajas o muy variables. Incluye tecnología de detección avanzada de comidas para reforzar la respuesta a las subidas de glucosa tras comer.",
    detalleEn:
      "Its SmartGuard algorithm automatically corrects every 5 minutes and allows especially precise basal insulin adjustments, which can be useful for people with low or highly variable insulin needs. It includes advanced meal-detection technology to strengthen the response to post-meal glucose spikes.",
    fuenteNombre: "Comparativa de bombas de insulina, LMC Diabetes & Endocrinology (feb. 2026)",
    fuenteUrl: "https://www.lmc.ca/wp-content/uploads/2026/02/EN-LMC-Pump-Comparison-Chart-Feb-2026-.pdf"
  },
  {
    modelo: "t:slim X2",
    fabricante: "Tandem Diabetes Care",
    tipo: "Con tubo, pantalla táctil a color",
    tipoEn: "Tubed, color touchscreen",
    sensores: "Compatible con el algoritmo Control-IQ+",
    sensoresEn: "Compatible with the Control-IQ+ algorithm",
    destacado: "Modos específicos de sueño y ejercicio, con bolos de autocorrección.",
    destacadoEn: "Dedicated sleep and exercise modes, with self-correction boluses.",
    detalle:
      "Además de los modos de sueño y ejercicio, que adaptan los objetivos de glucosa según la actividad, incorpora bolos de autocorrección para reforzar el control entre comidas. Para 2026 se espera un set de infusión de mayor duración, de hasta 7 días.",
    detalleEn:
      "Besides sleep and exercise modes, which adapt glucose targets to activity, it includes self-correction boluses to reinforce control between meals. A longer-lasting infusion set, up to 7 days, is expected for 2026.",
    fuenteNombre: "Comparativa de bombas de insulina, LMC Diabetes & Endocrinology (feb. 2026)",
    fuenteUrl: "https://www.lmc.ca/wp-content/uploads/2026/02/EN-LMC-Pump-Comparison-Chart-Feb-2026-.pdf"
  },
  {
    modelo: "YpsoPump (mylife)",
    fabricante: "Ypsomed",
    tipo: "Con tubo, muy compacta y ligera",
    tipoEn: "Tubed, very compact and lightweight",
    sensores: "Según el algoritmo asociado (por ejemplo, CamAPS FX)",
    sensoresEn: "Depending on the paired algorithm (e.g., CamAPS FX)",
    destacado: "Pensada especialmente para el uso en niños, con monitorización a distancia para cuidadores.",
    destacadoEn: "Designed especially for use in children, with remote monitoring for caregivers.",
    detalle:
      "Es una de las bombas más pequeñas y ligeras del mercado, lo que la hace popular en población pediátrica. Puede combinarse con distintos algoritmos de asa cerrada según el país, e incluye funciones de monitorización remota para madres, padres o cuidadores.",
    detalleEn:
      "It's one of the smallest and lightest pumps on the market, making it popular in pediatric use. It can be paired with different closed-loop algorithms depending on the country, and includes remote monitoring features for parents or caregivers.",
    fuenteNombre: "Comparativa de bombas de insulina, LMC Diabetes & Endocrinology (feb. 2026)",
    fuenteUrl: "https://www.lmc.ca/wp-content/uploads/2026/02/EN-LMC-Pump-Comparison-Chart-Feb-2026-.pdf"
  },
  {
    modelo: "iLet Bionic Pancreas",
    fabricante: "Beta Bionics",
    tipo: "Con tubo",
    tipoEn: "Tubed",
    sensores: "Dexcom y FreeStyle Libre 3 Plus",
    sensoresEn: "Dexcom and FreeStyle Libre 3 Plus",
    destacado: "No requiere contar carbohidratos: solo pide una estimación aproximada de la comida.",
    destacadoEn: "No carb counting required: it only asks for a rough estimate of the meal.",
    detalle:
      "Su planteamiento es distinto al resto: no se introducen ratios ni factores de corrección, solo el peso de la persona al empezar. El propio sistema desarrolla y actualiza un perfil de dosis a lo largo de 288 segmentos basales al día, y en las comidas solo pide una estimación aproximada (\"como de costumbre\", \"más\" o \"menos\") en lugar de un conteo exacto de carbohidratos.",
    detalleEn:
      "Its approach is different from the rest: no ratios or correction factors are entered, only the person's weight at the start. The system itself develops and updates a dosing profile across 288 basal segments a day, and at mealtimes it only asks for a rough estimate (\"usual,\" \"more\" or \"less\") instead of an exact carb count.",
    fuenteNombre: "Beta Bionics (sitio oficial del fabricante)",
    fuenteUrl: "https://www.betabionics.com/ilet-bionic-pancreas/ilet-adults/"
  }
];

const INSULIN_TYPES = [
  {
    tipo: "Ultrarrápida (rápida)",
    tipoEn: "Ultra-rapid (rapid)",
    ejemplos: "Análogos como lispro, aspart o glulisina",
    ejemplosEn: "Analogs such as lispro, aspart or glulisine",
    inicio: "~15 minutos",
    inicioEn: "~15 minutes",
    pico: "Alrededor de 1 hora",
    picoEn: "About 1 hour",
    duracion: "2 a 4 horas",
    duracionEn: "2 to 4 hours",
    uso: "Se inyecta justo antes de comer, para cubrir la subida de glucosa de esa comida.",
    usoEn: "Injected right before eating, to cover the glucose rise from that meal.",
    detalle:
      "Es la insulina que actúa más rápido. Al empezar a hacer efecto casi enseguida, se usa para cubrir lo que se come en cada comida principal, y por eso normalmente se inyecta justo antes (o, en algunos casos, justo después) de empezar a comer.",
    detalleEn:
      "This is the fastest-acting insulin. Since it starts working almost immediately, it's used to cover what's eaten at each main meal, which is why it's normally injected right before (or, in some cases, right after) starting to eat."
  },
  {
    tipo: "Corta (regular)",
    tipoEn: "Short (regular)",
    ejemplos: "Insulina humana regular",
    ejemplosEn: "Regular human insulin",
    inicio: "~30 minutos",
    inicioEn: "~30 minutes",
    pico: "2 a 3 horas",
    picoEn: "2 to 3 hours",
    duracion: "3 a 6 horas",
    duracionEn: "3 to 6 hours",
    uso: "Se inyecta entre 30 y 60 minutos antes de comer.",
    usoEn: "Injected 30 to 60 minutes before eating.",
    detalle:
      "Es de las insulinas más antiguas y tarda algo más en empezar a actuar que los análogos ultrarrápidos, por lo que necesita inyectarse con más antelación respecto a la comida. Hoy en día se usa con menos frecuencia que las insulinas rápidas más modernas.",
    detalleEn:
      "One of the oldest insulins, it takes somewhat longer to start working than ultra-rapid analogs, so it needs to be injected further ahead of the meal. Today it's used less often than the more modern rapid-acting insulins."
  },
  {
    tipo: "Intermedia",
    tipoEn: "Intermediate",
    ejemplos: "NPH",
    ejemplosEn: "NPH",
    inicio: "2 a 4 horas",
    inicioEn: "2 to 4 hours",
    pico: "4 a 12 horas",
    picoEn: "4 to 12 hours",
    duracion: "12 a 18 horas",
    duracionEn: "12 to 18 hours",
    uso: "Cubre medio día o la noche; suele combinarse con una insulina rápida.",
    usoEn: "Covers half the day or the night; usually combined with a rapid-acting insulin.",
    detalle:
      "Actúa de forma más lenta y prolongada, cubriendo las necesidades de insulina durante buena parte del día o de la noche. Es habitual combinarla con una insulina rápida para cubrir también lo que se come en las comidas.",
    detalleEn:
      "It acts more slowly and for longer, covering insulin needs for much of the day or night. It's commonly combined with a rapid-acting insulin to also cover what's eaten at meals."
  },
  {
    tipo: "Prolongada (basal)",
    tipoEn: "Long-acting (basal)",
    ejemplos: "Glargina, detemir",
    ejemplosEn: "Glargine, detemir",
    inicio: "~2 horas",
    inicioEn: "~2 hours",
    pico: "Sin pico marcado",
    picoEn: "No pronounced peak",
    duracion: "Hasta 24 horas",
    duracionEn: "Up to 24 hours",
    uso: "Aporta un nivel de fondo estable durante casi todo el día, sin relación directa con las comidas.",
    usoEn: "Provides a stable background level for nearly the whole day, without direct relation to meals.",
    detalle:
      "Se conoce como insulina \"basal\": no está pensada para cubrir una comida en concreto, sino para mantener un nivel de fondo de insulina estable a lo largo del día, de forma parecida a como lo haría un páncreas que funciona con normalidad fuera de las comidas.",
    detalleEn:
      "Known as \"basal\" insulin: it isn't meant to cover a specific meal, but to maintain a stable background insulin level throughout the day, similar to how a normally functioning pancreas would behave between meals."
  },
  {
    tipo: "Ultraprolongada",
    tipoEn: "Ultra-long-acting",
    ejemplos: "Degludec",
    ejemplosEn: "Degludec",
    inicio: "~6 horas",
    inicioEn: "~6 hours",
    pico: "Sin pico",
    picoEn: "No peak",
    duracion: "36 horas o más",
    duracionEn: "36 hours or more",
    uso: "Insulina basal de acción muy larga, con más margen de flexibilidad horaria.",
    usoEn: "Very long-acting basal insulin, with more flexibility in timing.",
    detalle:
      "Funciona de forma parecida a la insulina prolongada, pero dura todavía más tiempo y su efecto es aún más estable, lo que en la práctica puede dar algo más de margen si un día se retrasa la inyección respecto al horario habitual (siempre según lo pautado por el equipo médico).",
    detalleEn:
      "Works similarly to long-acting insulin, but lasts even longer and its effect is even more stable, which in practice can give a bit more leeway if an injection is delayed one day from the usual schedule (always as directed by the medical team)."
  },
  {
    tipo: "Premezclada (bifásica)",
    tipoEn: "Premixed (biphasic)",
    ejemplos: "Combinaciones de insulina intermedia y corta o rápida en un mismo vial o pluma",
    ejemplosEn: "Combinations of intermediate and short- or rapid-acting insulin in the same vial or pen",
    inicio: "5 a 60 minutos",
    inicioEn: "5 to 60 minutes",
    pico: "Variable (doble pico)",
    picoEn: "Variable (double peak)",
    duracion: "10 a 16 horas",
    duracionEn: "10 to 16 hours",
    uso: "Se inyecta entre 10 y 30 minutos antes del desayuno y de la cena.",
    usoEn: "Injected 10 to 30 minutes before breakfast and dinner.",
    detalle:
      "Combina en una sola inyección una parte de insulina de acción corta o rápida con otra de acción intermedia, en una proporción fija. Simplifica el número de pinchazos al día, aunque ofrece menos flexibilidad para ajustar cada componente por separado.",
    detalleEn:
      "Combines a portion of short- or rapid-acting insulin with an intermediate-acting portion in a single injection, at a fixed ratio. It simplifies the number of daily injections, though it offers less flexibility to adjust each component separately."
  }
];

// Cada término admite HTML simple (por ejemplo enlaces <a>) en `definicion`,
// ya que build.js no lo escapa; usa comillas dobles con cuidado.
const GLOSSARY_ITEMS = [
  {
    slug: "bomba-de-insulina",
    termino: "Bomba de insulina",
    terminoEn: "Insulin pump",
    definicion: 'Dispositivo que administra insulina de acción rápida de forma continua a través de un catéter o un parche, sustituyendo las inyecciones múltiples diarias. Puedes comparar varios modelos en nuestra <a href="bombas-de-insulina.html">comparativa de bombas de insulina</a>.',
    definicionEn: 'A device that delivers rapid-acting insulin continuously through a catheter or patch, replacing multiple daily injections. You can compare several models in our <a href="bombas-de-insulina.html">insulin pump comparison</a>.'
  },
  {
    slug: "cetoacidosis-diabetica",
    termino: "Cetoacidosis diabética (CAD)",
    terminoEn: "Diabetic ketoacidosis (DKA)",
    definicion: "Complicación grave y de aparición rápida, más frecuente en diabetes tipo 1, en la que el cuerpo, al no poder usar la glucosa como energía, empieza a producir cetonas en exceso. Requiere atención médica urgente.",
    definicionEn: "A serious, fast-developing complication, more common in type 1 diabetes, in which the body, unable to use glucose for energy, starts producing excess ketones. It requires urgent medical attention."
  },
  {
    slug: "diabetes-gestacional",
    termino: "Diabetes gestacional",
    terminoEn: "Gestational diabetes",
    definicion: "Diabetes que se diagnostica por primera vez durante el embarazo, debido a que las hormonas del embarazo dificultan la acción de la insulina. Suele controlarse con dieta, ejercicio y, en algunos casos, medicación, y normalmente desaparece tras el parto.",
    definicionEn: "Diabetes first diagnosed during pregnancy, because pregnancy hormones make insulin's action harder. It's usually managed with diet, exercise and, in some cases, medication, and typically goes away after delivery."
  },
  {
    slug: "diabetes-tipo-1",
    termino: "Diabetes tipo 1",
    terminoEn: "Type 1 diabetes",
    definicion: "Enfermedad autoinmune en la que el sistema inmunitario destruye las células beta del páncreas, encargadas de producir insulina. Requiere tratamiento con insulina desde el diagnóstico, que suele darse en la infancia o la juventud, aunque puede aparecer a cualquier edad.",
    definicionEn: "An autoimmune disease in which the immune system destroys the pancreas's beta cells, which produce insulin. It requires insulin treatment from diagnosis, which usually occurs in childhood or youth, though it can appear at any age."
  },
  {
    slug: "diabetes-tipo-2",
    termino: "Diabetes tipo 2",
    terminoEn: "Type 2 diabetes",
    definicion: "Forma de diabetes asociada a una resistencia progresiva a la insulina, en la que el cuerpo produce insulina pero no la utiliza con eficacia. Suele aparecer en la edad adulta y se relaciona con factores genéticos y de estilo de vida.",
    definicionEn: "A form of diabetes associated with progressive insulin resistance, in which the body produces insulin but doesn't use it effectively. It usually appears in adulthood and is linked to genetic and lifestyle factors."
  },
  {
    slug: "glucemia",
    termino: "Glucemia",
    terminoEn: "Blood glucose",
    definicion: "Nivel de glucosa (azúcar) presente en la sangre en un momento dado, habitualmente medido en mg/dL. Es el valor que miden tanto los glucómetros de punción digital como los sensores de monitorización continua.",
    definicionEn: "The level of glucose (sugar) present in the blood at a given moment, usually measured in mg/dL. It's the value measured by both finger-prick glucose meters and continuous monitoring sensors."
  },
  {
    slug: "glp-1",
    termino: "GLP-1 (agonista del receptor de GLP-1)",
    terminoEn: "GLP-1 (GLP-1 receptor agonist)",
    definicion: "Familia de fármacos que imitan una hormona intestinal natural, estimulando la liberación de insulina, ralentizando la digestión y reduciendo el apetito. Se usan tanto para la diabetes tipo 2 como para el control del peso.",
    definicionEn: "A family of drugs that mimic a natural gut hormone, stimulating insulin release, slowing digestion and reducing appetite. They're used both for type 2 diabetes and for weight management."
  },
  {
    slug: "hba1c",
    termino: "HbA1c (hemoglobina glucosilada)",
    terminoEn: "HbA1c (glycated hemoglobin)",
    definicion: "Análisis de sangre que refleja el promedio de los niveles de glucosa de los últimos 2-3 meses, y que se usa habitualmente para valorar el control a medio plazo de la diabetes, a diferencia de una medición puntual de glucosa.",
    definicionEn: "A blood test that reflects average glucose levels over the past 2-3 months, commonly used to assess mid-term diabetes control, unlike a single glucose reading."
  },
  {
    slug: "hiperglucemia",
    termino: "Hiperglucemia",
    terminoEn: "Hyperglycemia",
    definicion: "Nivel de glucosa en sangre más alto de lo habitual. Si es mantenida en el tiempo, es la responsable de buena parte de las complicaciones a largo plazo de la diabetes.",
    definicionEn: "A blood glucose level higher than normal. If sustained over time, it's responsible for much of diabetes's long-term complications."
  },
  {
    slug: "hipoglucemia",
    termino: "Hipoglucemia",
    terminoEn: "Hypoglycemia",
    definicion: "Bajada de los niveles de glucosa en sangre por debajo del rango normal, que puede causar síntomas como temblor, sudoración o confusión, y que en casos graves requiere actuar con rapidez.",
    definicionEn: "A drop in blood glucose levels below the normal range, which can cause symptoms like shaking, sweating or confusion, and in severe cases requires quick action."
  },
  {
    slug: "indice-glucemico",
    termino: "Índice glucémico",
    terminoEn: "Glycemic index",
    definicion: "Medida que indica con qué rapidez un alimento con carbohidratos eleva la glucosa en sangre en comparación con un alimento de referencia. Los alimentos de índice glucémico bajo elevan la glucosa de forma más lenta y sostenida.",
    definicionEn: "A measure of how quickly a carbohydrate-containing food raises blood glucose compared with a reference food. Low-glycemic-index foods raise glucose more slowly and steadily."
  },
  {
    slug: "insulina-basal",
    termino: "Insulina basal",
    terminoEn: "Basal insulin",
    definicion: 'Insulina de acción lenta o prolongada que mantiene un nivel de fondo estable a lo largo del día, sin relación directa con las comidas. Lo explicamos con más detalle en nuestra <a href="tipos-de-insulina.html">guía de tipos de insulina</a>.',
    definicionEn: 'Slow- or long-acting insulin that maintains a stable background level throughout the day, without direct relation to meals. We explain it in more detail in our <a href="tipos-de-insulina.html">insulin types guide</a>.'
  },
  {
    slug: "insulina-en-bolo",
    termino: "Insulina en bolo",
    terminoEn: "Bolus insulin",
    definicion: 'Insulina de acción rápida que se administra para cubrir la subida de glucosa producida por una comida, a diferencia de la insulina basal. Más contexto en la <a href="tipos-de-insulina.html">guía de tipos de insulina</a>.',
    definicionEn: 'Rapid-acting insulin given to cover the glucose rise caused by a meal, unlike basal insulin. More context in the <a href="tipos-de-insulina.html">insulin types guide</a>.'
  },
  {
    slug: "mcg",
    termino: "MCG (monitorización continua de glucosa)",
    terminoEn: "CGM (continuous glucose monitoring)",
    definicion: 'Sensor que se coloca sobre la piel y mide la glucosa en el líquido intersticial de forma continua, mostrando los datos en un móvil o lector, sin necesidad de pincharse el dedo cada vez. Puedes ver las últimas novedades en nuestra categoría de <a href="categoria/sensores.html">Sensores</a>.',
    definicionEn: 'A sensor worn on the skin that continuously measures glucose in interstitial fluid, showing the data on a phone or reader, without needing a finger prick every time. You can see the latest news in our <a href="categoria/sensores.html">Sensors</a> category.'
  },
  {
    slug: "nefropatia-diabetica",
    termino: "Nefropatía diabética",
    terminoEn: "Diabetic nephropathy",
    definicion: "Daño progresivo en los riñones causado por niveles de glucosa elevados mantenidos en el tiempo, una de las principales complicaciones microvasculares de la diabetes.",
    definicionEn: "Progressive kidney damage caused by elevated glucose levels sustained over time, one of the main microvascular complications of diabetes."
  },
  {
    slug: "neuropatia-diabetica",
    termino: "Neuropatía diabética",
    terminoEn: "Diabetic neuropathy",
    definicion: "Daño en los nervios asociado a la diabetes, que puede reducir la sensibilidad (sobre todo en los pies) y hacer que heridas o irritaciones pasen desapercibidas.",
    definicionEn: "Nerve damage associated with diabetes, which can reduce sensation (especially in the feet) and let wounds or irritation go unnoticed."
  },
  {
    slug: "prediabetes",
    termino: "Prediabetes",
    terminoEn: "Prediabetes",
    definicion: "Situación en la que los niveles de glucosa están por encima de lo normal, pero todavía no lo suficiente como para diagnosticar diabetes tipo 2. Con cambios en la alimentación y el ejercicio, es posible frenar o revertir su progresión.",
    definicionEn: "A state in which glucose levels are higher than normal, but not yet high enough to diagnose type 2 diabetes. With changes in diet and exercise, it's possible to slow or reverse its progression."
  },
  {
    slug: "resistencia-a-la-insulina",
    termino: "Resistencia a la insulina",
    terminoEn: "Insulin resistance",
    definicion: "Situación en la que las células del cuerpo responden peor de lo habitual a la insulina, por lo que el páncreas necesita producir más cantidad para mantener la glucosa en niveles normales. Es una base común de la diabetes tipo 2 y la prediabetes.",
    definicionEn: "A state in which the body's cells respond less well than usual to insulin, so the pancreas needs to produce more of it to keep glucose at normal levels. It's a common basis of type 2 diabetes and prediabetes."
  },
  {
    slug: "retinopatia-diabetica",
    termino: "Retinopatía diabética",
    terminoEn: "Diabetic retinopathy",
    definicion: "Complicación ocular causada por el daño que la glucosa elevada mantenida en el tiempo produce en los vasos sanguíneos de la retina, y una de las principales causas de pérdida de visión evitable.",
    definicionEn: "An eye complication caused by the damage that elevated glucose sustained over time causes to the retina's blood vessels, and one of the leading causes of preventable vision loss."
  },
  {
    slug: "sglt2",
    termino: "SGLT2 (inhibidor del cotransportador sodio-glucosa tipo 2)",
    terminoEn: "SGLT2 (sodium-glucose cotransporter 2 inhibitor)",
    definicion: "Familia de fármacos que actúan a nivel renal, favoreciendo la eliminación de glucosa a través de la orina, usados en el tratamiento de la diabetes tipo 2 y con beneficios adicionales a nivel cardiovascular y renal.",
    definicionEn: "A family of drugs that act at the kidney level, promoting glucose removal through urine, used to treat type 2 diabetes and with added cardiovascular and kidney benefits."
  },
  {
    slug: "sindrome-cardio-renal-metabolico",
    termino: "Síndrome cardio-renal-metabólico (CKM)",
    terminoEn: "Cardio-kidney-metabolic syndrome (CKM)",
    definicion: "Concepto que describe cómo el tejido adiposo, la diabetes tipo 2, la enfermedad renal crónica y las enfermedades cardiovasculares están conectados entre sí, y que refuerza la idea de tratar estos problemas de forma conjunta en lugar de por separado.",
    definicionEn: "A concept describing how fat tissue, type 2 diabetes, chronic kidney disease and cardiovascular disease are all connected, reinforcing the idea of treating these problems together rather than separately."
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

// Textos de interfaz (no de contenido) que se repiten en varias páginas,
// en los dos idiomas del sitio. El contenido propio de cada artículo/guía
// vive en su campo `en` correspondiente en js/data.js o en este archivo.
const STRINGS = {
  es: {
    home: "Portada",
    guidePractical: "Guía práctica",
    pumps: "Bombas de insulina",
    insulinTypes: "Tipos de insulina",
    glossary: "Glosario",
    navMainLabel: "Navegación principal",
    navGuidesLabel: "Guías y páginas de referencia",
    breadcrumbLabel: "Ruta de navegación",
    readMore: "Leer más →",
    latestNews: "Última noticia",
    footerAbout: "Quiénes somos",
    footerFaq: "Preguntas frecuentes",
    footerContact: "Contacto",
    footerAboutLabel: "Sobre DiabetesHoy",
    footerTagline: "Solo novedades sobre diabetes.",
    footerDisclaimer: "Contenido informativo, no sustituye el consejo médico profesional.",
    moreFrom: "Más noticias de",
    originalSource: "Fuente original:",
    alsoLike: "También te puede interesar:",
    minRead: "min de lectura",
    share: "Compartir:",
    searchPlaceholder: "Buscar noticias…",
    searchLabel: "Buscar noticias",
    disclaimerGeneric:
      "Este sitio recopila y resume información publicada por otros medios y fuentes especializadas con fines informativos. No constituye consejo médico: consulta siempre con tu equipo de salud antes de tomar decisiones sobre tratamiento, medicación o dieta.",
    langSwitchLabel: "English"
  },
  en: {
    home: "Home",
    guidePractical: "Practical guide",
    pumps: "Insulin pumps",
    insulinTypes: "Types of insulin",
    glossary: "Glossary",
    navMainLabel: "Main navigation",
    navGuidesLabel: "Guides and reference pages",
    breadcrumbLabel: "Breadcrumb",
    readMore: "Read more →",
    latestNews: "Latest news",
    footerAbout: "About us",
    footerFaq: "FAQ",
    footerContact: "Contact",
    footerAboutLabel: "About DiabetesHoy",
    footerTagline: "Just diabetes news.",
    footerDisclaimer: "Informational content, not a substitute for professional medical advice.",
    moreFrom: "More news from",
    originalSource: "Original source:",
    alsoLike: "You might also like:",
    minRead: "min read",
    share: "Share:",
    searchPlaceholder: "Search news…",
    searchLabel: "Search news",
    disclaimerGeneric:
      "This site collects and summarizes information published by other media outlets and specialized sources for informational purposes. It is not medical advice: always consult your healthcare team before making decisions about treatment, medication or diet.",
    langSwitchLabel: "Español"
  }
};

// Cálculo aproximado del tiempo de lectura (~200 palabras/minuto), usado en
// las tarjetas y en la página de cada artículo, y como wordCount en el
// JSON-LD de NewsArticle.
function wordCount(paragraphs) {
  return paragraphs.reduce((sum, p) => sum + p.trim().split(/\s+/).filter(Boolean).length, 0);
}

function readingTimeMinutes(paragraphs) {
  return Math.max(1, Math.round(wordCount(paragraphs) / 200));
}

function formatFecha(iso, lang = "es") {
  const d = new Date(iso + "T00:00:00");
  return lang === "en"
    ? d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    : d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

// Las versiones ES y EN de cada página comparten exactamente la misma
// estructura de carpetas (la versión EN vive bajo /en/), así que una URL
// absoluta solo cambia por ese prefijo de idioma.
function urlFor(pagePath, lang = "es") {
  const base = lang === "en" ? `${SITE_URL}/en/` : `${SITE_URL}/`;
  return pagePath === "index.html" ? base : `${base}${pagePath}`;
}

function articleUrl(article, absolute, lang = "es") {
  const pagePath = `articulos/${article.id}.html`;
  return absolute ? urlFor(pagePath, lang) : pagePath;
}

function homeUrl(absolute, lang = "es") {
  return absolute ? urlFor("index.html", lang) : "index.html";
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
function renderBreadcrumbsNav(items, lang = "es") {
  const t = STRINGS[lang];
  const parts = items.map((it, i) => {
    if (i === items.length - 1) return `<span aria-current="page">${escapeHtml(it.name)}</span>`;
    return `<a href="${it.href}">${escapeHtml(it.name)}</a>`;
  });
  return `<nav class="breadcrumbs" aria-label="${t.breadcrumbLabel}">${parts.join('<span class="crumb-sep" aria-hidden="true">/</span>')}</nav>`;
}

// pagePath identifica la página actual dentro de su árbol de idioma (p. ej.
// "index.html", "articulos/foo.html"): como las versiones ES y EN comparten
// la misma estructura de carpetas, sirve tanto para construir el enlace al
// selector de idioma como, en renderHead, las URLs alternativas hreflang.
function renderHeader(prefix, activeCat, lang = "es", pagePath = "index.html") {
  const t = STRINGS[lang];
  const guideLinks = [
    { href: `${prefix}dietas-y-ejercicio.html`, label: t.guidePractical, cat: "guia" },
    { href: `${prefix}bombas-de-insulina.html`, label: t.pumps, cat: "bombas" },
    { href: `${prefix}tipos-de-insulina.html`, label: t.insulinTypes, cat: "tipos-insulina" },
    { href: `${prefix}glosario.html`, label: t.glossary, cat: "glosario" }
  ];

  const renderLink = (l, extraClass) =>
    `<a href="${l.href}" class="${[extraClass, l.cat === activeCat ? "active" : ""].filter(Boolean).join(" ")}">${l.label}</a>`;

  const guideHtml = guideLinks.map(l => renderLink(l, "nav-link--guide")).join("\n        ");

  const otherLang = lang === "es" ? "en" : "es";
  const langSwitchHref = lang === "es" ? `${prefix}en/${pagePath}` : `${prefix}../${pagePath}`;

  return `  <header class="site-header">
    <div class="header-inner">
      <a href="${prefix}index.html" class="logo"><span>Diabetes<span class="dot">Hoy</span></span></a>
      <nav class="main-nav" aria-label="${t.navMainLabel}">
        <a href="${prefix}index.html"${activeCat === "inicio" ? ' class="active"' : ""}>${t.home}</a>

        <span class="nav-group nav-group--guides" role="group" aria-label="${t.navGuidesLabel}">
          ${guideHtml}
        </span>
        <a href="${langSwitchHref}" class="lang-switch" lang="${otherLang}" hreflang="${otherLang}">${t.langSwitchLabel}</a>
      </nav>
    </div>
  </header>`;
}

function renderFooter(prefix, lang = "es") {
  const t = STRINGS[lang];
  const year = new Date().getFullYear();
  return `  <footer class="site-footer">
    <div class="container">
      <span>&copy; ${year} ${SITE_NAME}. ${t.footerTagline}</span>
      <nav class="footer-nav" aria-label="${t.footerAboutLabel}">
        <a href="${prefix}quienes-somos.html">${t.footerAbout}</a>
        <a href="${prefix}faq.html">${t.footerFaq}</a>
        <a href="${prefix}contacto.html">${t.footerContact}</a>
      </nav>
      <span>${t.footerDisclaimer}</span>
    </div>
  </footer>`;
}

// Enlaces de compartir en redes: son <a> normales con las URLs de intent de
// cada red, sin JavaScript, para que funcionen igual con o sin JS activado.
function renderShareLinks(url, title, lang = "es") {
  const t = STRINGS[lang];
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const links = [
    { label: "X", icon: "🐦", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: "WhatsApp", icon: "💬", href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}` },
    { label: "LinkedIn", icon: "💼", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Facebook", icon: "📘", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` }
  ];
  const linksHtml = links
    .map(l => `<a href="${l.href}" class="share-link" target="_blank" rel="noopener noreferrer" aria-label="${l.label}"><span aria-hidden="true">${l.icon}</span> ${l.label}</a>`)
    .join("\n      ");
  return `    <div class="share-box">
      <span class="share-label">${t.share}</span>
      ${linksHtml}
    </div>`;
}

function renderCard(article, prefix, options = {}, lang = "es") {
  const t = STRINGS[lang];
  const cat = CATEGORIAS[article.categoria];
  const catName = lang === "en" ? cat.nombreEn : cat.nombre;
  const titulo = lang === "en" ? article.en.titulo : article.titulo;
  const resumen = lang === "en" ? article.en.resumen : article.resumen;
  const cuerpo = lang === "en" ? article.en.cuerpo : article.cuerpo;
  const readingTime = readingTimeMinutes(cuerpo);
  const cardClass = ["card reveal", options.featured ? "card--featured" : ""].filter(Boolean).join(" ");
  const eyebrow = options.featured ? `<span class="card-eyebrow">${t.latestNews}</span>` : "";

  return `      <a class="${cardClass}" href="${prefix}${articleUrl(article)}" data-cat="${article.categoria}">
        <div class="card-banner" style="background:${cat.color}">
          <span class="card-icon" aria-hidden="true">${cat.icono}</span>${catName}
        </div>
        <div class="card-body">
          ${eyebrow}
          <div class="card-meta">
            <time class="card-date" datetime="${article.fecha}">${formatFecha(article.fecha, lang)}</time>
            <span class="reading-time">${readingTime} ${t.minRead}</span>
          </div>
          <h3 class="card-title">${escapeHtml(titulo)}</h3>
          <p class="card-summary">${escapeHtml(resumen)}</p>
          <span class="card-link">${t.readMore}</span>
        </div>
      </a>`;
}

function renderHead({
  title,
  description,
  url,
  type,
  prefix,
  assetPrefix,
  extraMeta = "",
  jsonLdBlocks = [],
  robots = "index, follow",
  ogImage = OG_IMAGE_URL,
  lang = "es",
  pagePath = null
}) {
  const jsonLdHtml = jsonLdBlocks
    .map(obj => `  <script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join("\n");

  // El JSON-LD conserva la descripción completa; solo se recorta la que ve
  // el buscador en el <title>/meta description/redes sociales.
  const metaDescription = truncateForMeta(description);
  const assets = assetPrefix != null ? assetPrefix : prefix;

  // pagePath es la misma ruta relativa en ambos idiomas (solo cambia el
  // prefijo /en/), así que sirve para calcular las dos URLs hreflang.
  const alternateLinks =
    pagePath !== null
      ? `  <link rel="alternate" hreflang="es" href="${urlFor(pagePath, "es")}" />
  <link rel="alternate" hreflang="en" href="${urlFor(pagePath, "en")}" />
  <link rel="alternate" hreflang="x-default" href="${urlFor(pagePath, "es")}" />
`
      : "";

  return `  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(metaDescription)}" />
  <meta name="robots" content="${robots}" />
  <link rel="canonical" href="${url}" />
${alternateLinks}
  <meta property="og:type" content="${type}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(metaDescription)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:locale" content="${lang === "en" ? "en_US" : "es_ES"}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
${extraMeta}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(metaDescription)}" />
  <meta name="twitter:image" content="${ogImage}" />

  <link rel="icon" href="${assets}favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="${assets}css/style.css" />
  <link rel="preconnect" href="https://www.googletagmanager.com" />
  <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}"
     crossorigin="anonymous"></script>
  ${VERCEL_ANALYTICS_SCRIPT}
${jsonLdHtml}`;
}

function renderIndexPage(articles, lang = "es") {
  const t = STRINGS[lang];
  const assetPrefix = lang === "en" ? "../" : "";
  const sorted = [...articles].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const cardsHtml = sorted
    .map((a, i) => renderCard(a, "", { featured: i === 0 }, lang))
    .join("\n");
  const url = homeUrl(true, lang);
  const title = lang === "en" ? `${SITE_NAME} · Diabetes news` : `${SITE_NAME} · Novedades sobre diabetes`;
  const description = lang === "en" ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION;

  const filterAllLabel = lang === "en" ? "All" : "Todas";
  const filterButtons = [
    `      <button class="filter-btn" data-filtro="todas">🗞️ ${filterAllLabel}</button>`,
    ...Object.entries(CATEGORIAS).map(
      ([slug, cat]) => `      <button class="filter-btn" data-filtro="${slug}">${cat.icono} ${lang === "en" ? cat.nombreEn : cat.nombre}</button>`
    )
  ].join("\n");

  const totalFuentes = new Set(articles.map(a => a.fuenteNombre)).size;
  const stats =
    lang === "en"
      ? [
          { valor: articles.length, etiqueta: "News published" },
          { valor: Object.keys(CATEGORIAS).length, etiqueta: "Categories" },
          { valor: totalFuentes, etiqueta: "Verified sources" }
        ]
      : [
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
    url: urlFor("index.html", lang),
    description,
    inLanguage: lang,
    publisher: ORG_JSONLD
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "website",
    prefix: "",
    assetPrefix,
    jsonLdBlocks: [jsonLd],
    lang,
    pagePath: "index.html"
  });

  const heroP =
    lang === "en"
      ? "Sensors, medication, clinical studies, diet, exercise and complications: a clear summary of the latest news, always linked to the original source."
      : "Sensores, medicación, estudios clínicos, dietas, ejercicio y complicaciones: un resumen claro de lo último, siempre con enlace a la fuente original.";

  const disclaimer =
    lang === "en"
      ? `${t.disclaimerGeneric} More details on our <a href="quienes-somos.html">about us</a> page and in the <a href="faq.html">FAQ</a>.`
      : `${t.disclaimerGeneric} Más detalles en <a href="quienes-somos.html">quiénes somos</a> y en las <a href="faq.html">preguntas frecuentes</a>.`;

  const emptyState = lang === "en" ? "There are no articles in this category yet." : "No hay artículos en esta categoría todavía.";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", "inicio", lang, "index.html")}

  <main class="container">
    <section class="hero">
      <div class="hero-blob hero-blob--1" aria-hidden="true"></div>
      <div class="hero-blob hero-blob--2" aria-hidden="true"></div>
      <h1>${lang === "en" ? "Diabetes news" : "Novedades sobre diabetes"}</h1>
      <p>${heroP}</p>
      <div class="stats-bar">
${statsHtml}
      </div>
    </section>

    <div class="search-box">
      <label for="search-input" class="sr-only">${t.searchLabel}</label>
      <span class="search-icon" aria-hidden="true">🔍</span>
      <input type="search" id="search-input" placeholder="${t.searchPlaceholder}" autocomplete="off" />
    </div>

    <div class="filters" role="group" aria-label="${lang === "en" ? "Filter by category" : "Filtrar por categoría"}">
${filterButtons}
    </div>

    <div class="grid" id="grid">
${cardsHtml}
    </div>
    <p class="empty-state" id="empty-state" hidden>${emptyState}</p>

    <div class="disclaimer">
      ${disclaimer}
    </div>
  </main>

${renderFooter("", lang)}

  <script src="${assetPrefix}js/filter.js"></script>
  <script src="${assetPrefix}js/motion.js"></script>
</body>
</html>
`;
}

function renderArticlePage(article, allArticles, lang = "es") {
  const t = STRINGS[lang];
  const assetPrefix = lang === "en" ? "../../" : "../";
  const cat = CATEGORIAS[article.categoria];
  const catName = lang === "en" ? cat.nombreEn : cat.nombre;
  const titulo = lang === "en" ? article.en.titulo : article.titulo;
  const tituloSeo = lang === "en" ? article.en.tituloSeo || article.en.titulo : article.tituloSeo || article.titulo;
  const resumen = lang === "en" ? article.en.resumen : article.resumen;
  const cuerpo = lang === "en" ? article.en.cuerpo : article.cuerpo;
  const pagePath = `articulos/${article.id}.html`;
  const url = urlFor(pagePath, lang);
  const title = `${tituloSeo} · ${SITE_NAME}`;
  const bodyHtml = cuerpo.map(p => `      <p>${escapeHtml(p)}</p>`).join("\n");
  const ogImage = ogImageForArticle(article);
  const readingTime = readingTimeMinutes(cuerpo);

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: titulo,
    description: resumen,
    datePublished: article.fecha,
    dateModified: article.fecha,
    inLanguage: lang,
    articleSection: catName,
    image: ogImage,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isBasedOn: article.fuenteUrl,
    author: ORG_JSONLD,
    wordCount: wordCount(cuerpo),
    publisher: ORG_JSONLD
  };

  const breadcrumbItems = [
    { name: t.home, href: "../index.html", url: urlFor("index.html", lang) },
    { name: catName, href: `../categoria/${article.categoria}.html`, url: urlFor(`categoria/${article.categoria}.html`, lang) },
    { name: titulo, url }
  ];
  const jsonLdBreadcrumb = breadcrumbJsonLd(breadcrumbItems);

  const extraMeta = `  <meta property="article:published_time" content="${article.fecha}" />
  <meta property="article:section" content="${escapeHtml(catName)}" />
`;

  const head = renderHead({
    title,
    description: resumen,
    url,
    type: "article",
    prefix: "../",
    assetPrefix,
    extraMeta,
    jsonLdBlocks: [jsonLdArticle, jsonLdBreadcrumb],
    ogImage,
    lang,
    pagePath
  });

  const related = allArticles
    .filter(a => a.categoria === article.categoria && a.id !== article.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 3);

  const relatedHtml = related.length
    ? `  <section class="related-articles">
    <div class="article-wrap">
      <h2>${t.moreFrom} ${escapeHtml(catName)}</h2>
      <ul>
${related
        .map(a => {
          const relTitulo = lang === "en" ? a.en.titulo : a.titulo;
          return `        <li><a href="${a.id}.html">${escapeHtml(relTitulo)}</a> <time datetime="${a.fecha}">${formatFecha(a.fecha, lang)}</time></li>`;
        })
        .join("\n")}
      </ul>
    </div>
  </section>`
    : "";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("../", article.categoria, lang, pagePath)}

  <main class="article-wrap">
    ${renderBreadcrumbsNav(breadcrumbItems, lang)}
    <span class="badge" style="background:${cat.color}">${cat.icono} ${catName}</span>
    <h1>${escapeHtml(titulo)}</h1>
    <p class="article-meta">
      <time datetime="${article.fecha}">${formatFecha(article.fecha, lang)}</time>
      <span class="reading-time">${readingTime} ${t.minRead}</span>
    </p>
    <div class="article-body">
${bodyHtml}
    </div>
    <div class="source-box">
      ${t.originalSource} <a href="${article.fuenteUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(article.fuenteNombre)}</a>
    </div>
${renderShareLinks(url, titulo, lang)}
  </main>

${relatedHtml}

${renderFooter("../", lang)}
  <script src="${assetPrefix}js/motion.js"></script>
</body>
</html>
`;
}

function renderAboutPage(lang = "es") {
  const assetPrefix = lang === "en" ? "../" : "";
  const pagePath = "quienes-somos.html";
  const title = lang === "en" ? `About us · ${SITE_NAME}` : `Quiénes somos · ${SITE_NAME}`;
  const description =
    lang === "en"
      ? "What DiabetesHoy is, how we select the diabetes news we publish, and why it doesn't replace professional medical advice."
      : "Qué es DiabetesHoy, cómo seleccionamos las noticias sobre diabetes que publicamos y por qué no sustituyen el consejo médico profesional.";
  const url = urlFor(pagePath, lang);
  const pageName = lang === "en" ? "About us" : "Quiénes somos";

  const breadcrumbItems = [
    { name: STRINGS[lang].home, href: "index.html", url: urlFor("index.html", lang) },
    { name: pageName, url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: pageName,
    url,
    description,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: urlFor("index.html", lang) }
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "website",
    prefix: "",
    assetPrefix,
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)],
    lang,
    pagePath
  });

  const body =
    lang === "en"
      ? `    <h1>About us</h1>
    <p class="lead">DiabetesHoy is an independent project that summarizes public news about diabetes and always links to the original source of each one.</p>

    <div class="article-body">
      <h2>What DiabetesHoy is</h2>
      <p>DiabetesHoy isn't a media outlet or a healthcare institution. It's a content curation project that follows public news about glucose sensors, medication, clinical studies, diet, exercise and diabetes-related complications, and summarizes them in a short, clear format.</p>

      <h2>How we select the news</h2>
      <p>We prioritize public and specialized sources: scientific societies, regulatory agencies, media outlets specializing in diabetes and medical publications. Every article links directly to the original source used to write it, so you can check the full information and verify it.</p>

      <h2>Our commitment to health information</h2>
      <p>Health-related topics require special care. That's why all of DiabetesHoy's content is informational and educational, isn't written by medical professionals, and never replaces the diagnosis, treatment or advice of a healthcare professional. If you have any doubts about your health, always consult your medical team.</p>

      <h2>Corrections and suggestions</h2>
      <p>If you spot an error in an article or want to suggest a topic, you can write to us on the <a href="contacto.html">contact</a> page.</p>
    </div>`
      : `    <h1>Quiénes somos</h1>
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
    </div>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", null, lang, pagePath)}

  <main class="article-wrap">
    ${renderBreadcrumbsNav(breadcrumbItems, lang)}
${body}
  </main>

${renderFooter("", lang)}
  <script src="${assetPrefix}js/motion.js"></script>
</body>
</html>
`;
}

function renderFaqPage(lang = "es") {
  const assetPrefix = lang === "en" ? "../" : "";
  const pagePath = "faq.html";
  const title = lang === "en" ? `FAQ · ${SITE_NAME}` : `Preguntas frecuentes · ${SITE_NAME}`;
  const description =
    lang === "en"
      ? "We answer the most common questions about DiabetesHoy: what it is, how we select the news and whether it replaces medical advice."
      : "Resolvemos las dudas más habituales sobre DiabetesHoy: qué es, cómo seleccionamos las noticias y si sustituye el consejo médico.";
  const url = urlFor(pagePath, lang);
  const pageName = lang === "en" ? "FAQ" : "Preguntas frecuentes";

  const breadcrumbItems = [
    { name: STRINGS[lang].home, href: "index.html", url: urlFor("index.html", lang) },
    { name: pageName, url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(item => ({
      "@type": "Question",
      name: lang === "en" ? item.preguntaEn : item.pregunta,
      acceptedAnswer: { "@type": "Answer", text: lang === "en" ? item.respuestaEn : item.respuesta }
    }))
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "website",
    prefix: "",
    assetPrefix,
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)],
    lang,
    pagePath
  });

  const faqHtml = FAQ_ITEMS.map(
    item => `      <h2>${escapeHtml(lang === "en" ? item.preguntaEn : item.pregunta)}</h2>
      <p>${escapeHtml(lang === "en" ? item.respuestaEn : item.respuesta)}</p>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", null, lang, pagePath)}

  <main class="article-wrap">
    ${renderBreadcrumbsNav(breadcrumbItems, lang)}
    <h1>${pageName}</h1>
    <p class="lead">${lang === "en" ? "Common questions about DiabetesHoy and its content." : "Dudas habituales sobre DiabetesHoy y su contenido."}</p>

    <div class="article-body">
${faqHtml}
    </div>
  </main>

${renderFooter("", lang)}
  <script src="${assetPrefix}js/motion.js"></script>
</body>
</html>
`;
}

function renderContactPage(lang = "es") {
  const assetPrefix = lang === "en" ? "../" : "";
  const pagePath = "contacto.html";
  const title = lang === "en" ? `Contact · ${SITE_NAME}` : `Contacto · ${SITE_NAME}`;
  const description =
    lang === "en"
      ? "How to get in touch with DiabetesHoy to correct an error or suggest a topic. This isn't a medical consultation channel."
      : "Cómo ponerte en contacto con DiabetesHoy para corregir un error o sugerir un tema. No es un canal de consulta médica.";
  const url = urlFor(pagePath, lang);
  const pageName = lang === "en" ? "Contact" : "Contacto";

  const breadcrumbItems = [
    { name: STRINGS[lang].home, href: "index.html", url: urlFor("index.html", lang) },
    { name: pageName, url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: pageName,
    url,
    description
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "website",
    prefix: "",
    assetPrefix,
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)],
    lang,
    pagePath
  });

  const body =
    lang === "en"
      ? `    <h1>Contact</h1>
    <p class="lead">Spotted an error in a story or want to suggest a topic? Get in touch.</p>

    <div class="article-body">
      <p>You can contact DiabetesHoy by writing to <a href="mailto:contacto@diabeteshoy.com">contacto@diabeteshoy.com</a>.</p>
      <p>This channel is for corrections, questions about the site itself, or story suggestions. It isn't a medical consultation channel: for any questions about your health, contact your medical team.</p>
    </div>`
      : `    <h1>Contacto</h1>
    <p class="lead">¿Has visto un error en una noticia o quieres sugerir un tema? Escríbenos.</p>

    <div class="article-body">
      <p>Puedes contactar con DiabetesHoy escribiendo a <a href="mailto:contacto@diabeteshoy.com">contacto@diabeteshoy.com</a>.</p>
      <p>Este canal es para correcciones, dudas sobre el propio sitio o sugerencias de noticias. No es un canal de consulta médica: para cualquier duda sobre tu salud, contacta con tu equipo médico.</p>
    </div>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", null, lang, pagePath)}

  <main class="article-wrap">
    ${renderBreadcrumbsNav(breadcrumbItems, lang)}
${body}
  </main>

${renderFooter("", lang)}
  <script src="${assetPrefix}js/motion.js"></script>
</body>
</html>
`;
}

function renderGuidePage(lang = "es") {
  const assetPrefix = lang === "en" ? "../" : "";
  const pagePath = "dietas-y-ejercicio.html";
  const title = lang === "en" ? `Daily diet and exercise for diabetes · ${SITE_NAME}` : `Dietas y ejercicio diario para la diabetes · ${SITE_NAME}`;
  const description =
    lang === "en"
      ? "A sample healthy plate and meal ideas, plus a weekly exercise routine (walking, strength training and stretching) designed for people with diabetes."
      : "Ejemplo de plato saludable e ideas de comidas, junto con una rutina semanal de ejercicio (caminar, fuerza y estiramientos) pensada para personas con diabetes.";
  const url = urlFor(pagePath, lang);
  const pageName = lang === "en" ? "Practical guide" : "Guía práctica";

  const breadcrumbItems = [
    { name: STRINGS[lang].home, href: "index.html", url: urlFor("index.html", lang) },
    { name: pageName, url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: lang === "en" ? "Daily diet and exercise for diabetes: a practical guide" : "Dietas y ejercicio diario para la diabetes: guía práctica",
    description,
    inLanguage: lang,
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
    assetPrefix,
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)],
    lang,
    pagePath
  });

  const body =
    lang === "en"
      ? `    <h1>Daily diet and exercise for diabetes</h1>
    <p class="lead">A sample plate and a simple weekly routine, based on the general guidelines covered in our <a href="categoria/dietas.html">Diet</a> and <a href="categoria/ejercicio.html">Exercise</a> news.</p>

    <div class="disclaimer">
      This guide is general and for orientation only: it doesn't replace a personalized diet or exercise plan. Before changing your diet or starting a new routine, talk to your doctor, endocrinologist or diabetes educator, especially if you use insulin or another medication that can cause hypoglycemia.
    </div>

    <div class="article-body">
      <h2>A sample plate for main meals</h2>
      <img class="guide-image reveal" src="img/plato-alimentacion.png" width="832" height="548" loading="lazy" alt="Plate divided into 50% vegetables, 25% protein and 25% grains or carbohydrates, with a fork and knife on the sides" />
      <p>A simple way to organize lunch and dinner is to divide the plate into three parts: half with vegetables, a quarter with whole grains or low-glycemic-index carbohydrates (brown rice, legumes, potato with skin) and the last quarter with a lean protein source (fish, egg, legumes or lean meat). More context in our story on the <a href="articulos/nice-2026-nutricion.html">2026 NICE guideline</a> and on <a href="articulos/dieta-base-vegetal.html">plant-based dietary patterns</a>.</p>

      <h2>Everyday ideas</h2>
      <ul>
        <li>Choose whole fruit over juice, since it provides more fiber and causes a slower glucose rise.</li>
        <li>Swap refined grains or bread for whole-grain versions whenever you can.</li>
        <li>Include legumes several times a week as a source of protein and fiber.</li>
        <li>Cut back on ultra-processed foods and sugary drinks, which sneak into many routines without us noticing.</li>
      </ul>
      <p>These ideas summarize the general messages from our story on <a href="articulos/perdida-peso-control-metabolico.html">weight loss and metabolic control</a>.</p>

      <h2>Weekly routine: aerobic activity</h2>
      <p>General guidelines recommend around 150 weekly minutes of moderate aerobic activity: brisk walking, swimming, cycling or dancing are good options that can be split into 20-30 minute sessions on most days. More information in our story on <a href="articulos/ejercicio-prevencion-diabetes-58.html">exercise and type 2 diabetes prevention</a>.</p>

      <h2>Weekly routine: strength</h2>
      <p>Adding 2 weekly strength-training sessions (using body weight, resistance bands or weights) to aerobic exercise is linked to added improvements in glycemic control. You can start with short sets and gradually increase intensity. More details in our story on <a href="articulos/entrenamiento-fuerza-hba1c.html">strength training and HbA1c</a>.</p>

      <h2>Active breaks and stretching</h2>
      <p>Beyond planned exercise, try to break up long periods of sitting every 30 minutes: getting up to walk for a moment or doing some gentle stretches helps improve glucose levels throughout the day. We explain this in more detail in our story on <a href="articulos/sedentarismo-cada-30-minutos.html">breaking up sedentary time</a>.</p>
    </div>

    <div class="disclaimer">
      Remember: this guide is general, educational information, not a personalized medical or nutritional plan. Always consult a healthcare professional before making major changes to your diet or physical activity. More context on our <a href="quienes-somos.html">about us</a> page.
    </div>`
      : `    <h1>Dietas y ejercicio diario para la diabetes</h1>
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
    </div>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", "guia", lang, pagePath)}

  <main class="article-wrap">
    ${renderBreadcrumbsNav(breadcrumbItems, lang)}
${body}
  </main>

${renderFooter("", lang)}
  <script src="${assetPrefix}js/motion.js"></script>
</body>
</html>
`;
}

function renderPumpsPage(lang = "es") {
  const assetPrefix = lang === "en" ? "../" : "";
  const pagePath = "bombas-de-insulina.html";
  const title = lang === "en" ? `Insulin pump comparison · ${SITE_NAME}` : `Comparativa de bombas de insulina · ${SITE_NAME}`;
  const description =
    lang === "en"
      ? "A comparison of the leading insulin pumps (Omnipod 5, MiniMed 780G, t:slim X2, YpsoPump and iLet Bionic Pancreas): type, compatible sensors and what sets them apart."
      : "Comparativa de las principales bombas de insulina (Omnipod 5, MiniMed 780G, t:slim X2, YpsoPump e iLet Bionic Pancreas): tipo, sensores compatibles y qué las diferencia.";
  const url = urlFor(pagePath, lang);
  const pageName = lang === "en" ? "Insulin pumps" : "Bombas de insulina";
  const headline = lang === "en" ? "Insulin pump comparison" : "Comparativa de bombas de insulina";

  const breadcrumbItems = [
    { name: STRINGS[lang].home, href: "index.html", url: urlFor("index.html", lang) },
    { name: pageName, url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: lang,
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
    assetPrefix,
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)],
    lang,
    pagePath
  });

  const tableRows = PUMPS.map(
    p => `        <tr>
          <td>${escapeHtml(p.modelo)}</td>
          <td>${escapeHtml(p.fabricante)}</td>
          <td>${escapeHtml(lang === "en" ? p.tipoEn : p.tipo)}</td>
          <td>${escapeHtml(lang === "en" ? p.sensoresEn : p.sensores)}</td>
          <td>${escapeHtml(lang === "en" ? p.destacadoEn : p.destacado)}</td>
        </tr>`
  ).join("\n");

  const sourceLabel = lang === "en" ? "Source" : "Fuente";
  const detailBlocks = PUMPS.map(
    p => `      <h3>${escapeHtml(p.modelo)} <span class="text-muted">— ${escapeHtml(p.fabricante)}</span></h3>
      <p>${escapeHtml(lang === "en" ? p.detalleEn : p.detalle)} ${sourceLabel}: <a href="${p.fuenteUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.fuenteNombre)}</a>.</p>`
  ).join("\n\n");

  const lead =
    lang === "en"
      ? "A quick look at some of the insulin pumps currently available, and their main differences."
      : "Un vistazo rápido a algunas de las bombas de insulina disponibles actualmente, con sus principales diferencias.";
  const disclaimer1 =
    lang === "en"
      ? "This comparison is for guidance only and isn't exhaustive: availability, sensor pairings and funding conditions vary by country and health system. Choosing an insulin pump should always be done with your medical team or diabetes educator, who can assess which one best fits your case."
      : "Esta comparativa es orientativa y no exhaustiva: la disponibilidad, las combinaciones con sensores y las condiciones de financiación varían según el país y el sistema de salud. La elección de una bomba de insulina debe hacerse siempre con tu equipo médico o educador en diabetes, que puede valorar cuál se ajusta mejor a tu caso.";
  const detailHeading = lang === "en" ? "Each pump in more detail" : "Cada bomba, con más detalle";
  const disclaimer2 =
    lang === "en"
      ? 'Remember: this page doesn\'t replace medical advice. Check with your diabetes team which option best fits your treatment, lifestyle and health coverage. More context on our <a href="quienes-somos.html">about us</a> page.'
      : 'Recuerda: esta página no sustituye el consejo médico. Consulta con tu equipo de diabetes qué opción se adapta mejor a tu tratamiento, tu estilo de vida y tu cobertura sanitaria. Más contexto en <a href="quienes-somos.html">quiénes somos</a>.';
  const tableHeaders =
    lang === "en"
      ? ["Pump", "Manufacturer", "Type", "Compatible sensors", "Highlights"]
      : ["Bomba", "Fabricante", "Tipo", "Sensores compatibles", "Lo más destacado"];

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", "bombas", lang, pagePath)}

  <main class="article-wrap article-wrap--wide">
    ${renderBreadcrumbsNav(breadcrumbItems, lang)}
    <h1>${headline}</h1>
    <p class="lead">${lead}</p>

    <div class="disclaimer">
      ${disclaimer1}
    </div>

    <div class="table-scroll reveal">
      <table class="compare-table">
        <thead>
          <tr>
            <th>${tableHeaders[0]}</th>
            <th>${tableHeaders[1]}</th>
            <th>${tableHeaders[2]}</th>
            <th>${tableHeaders[3]}</th>
            <th>${tableHeaders[4]}</th>
          </tr>
        </thead>
        <tbody>
${tableRows}
        </tbody>
      </table>
    </div>

    <div class="article-body">
      <h2>${detailHeading}</h2>
${detailBlocks}
    </div>

    <div class="disclaimer">
      ${disclaimer2}
    </div>
  </main>

${renderFooter("", lang)}
  <script src="${assetPrefix}js/motion.js"></script>
</body>
</html>
`;
}

function renderInsulinTypesPage(lang = "es") {
  const assetPrefix = lang === "en" ? "../" : "";
  const pagePath = "tipos-de-insulina.html";
  const title = lang === "en" ? `Types of insulin: a simple guide · ${SITE_NAME}` : `Tipos de insulina: guía sencilla · ${SITE_NAME}`;
  const description =
    lang === "en"
      ? "Rapid, short, intermediate, long-acting, ultra-long-acting and premixed insulin explained in plain language: when each one starts working, how long it lasts and what it's used for."
      : "Insulina rápida, corta, intermedia, prolongada, ultraprolongada y premezclada explicadas en palabras sencillas: cuándo empiezan a actuar, cuánto duran y para qué se usa cada una.";
  const url = urlFor(pagePath, lang);
  const pageName = lang === "en" ? "Types of insulin" : "Tipos de insulina";
  const headline = lang === "en" ? "Types of insulin: a simple guide to how they work" : "Tipos de insulina: guía sencilla de cómo actúan";

  const breadcrumbItems = [
    { name: STRINGS[lang].home, href: "index.html", url: urlFor("index.html", lang) },
    { name: pageName, url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: lang,
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
    assetPrefix,
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)],
    lang,
    pagePath
  });

  const tableRows = INSULIN_TYPES.map(
    t => `        <tr>
          <td>${escapeHtml(lang === "en" ? t.tipoEn : t.tipo)}</td>
          <td>${escapeHtml(lang === "en" ? t.ejemplosEn : t.ejemplos)}</td>
          <td>${escapeHtml(lang === "en" ? t.inicioEn : t.inicio)}</td>
          <td>${escapeHtml(lang === "en" ? t.picoEn : t.pico)}</td>
          <td>${escapeHtml(lang === "en" ? t.duracionEn : t.duracion)}</td>
        </tr>`
  ).join("\n");

  const whenUsedLabel = lang === "en" ? "When is it used?" : "¿Cuándo se usa?";
  const detailBlocks = INSULIN_TYPES.map(t => {
    const heading = lang === "en" ? `${t.tipoEn} insulin` : `Insulina ${t.tipo.toLowerCase()}`;
    return `      <h3>${escapeHtml(heading)}</h3>
      <p>${escapeHtml(lang === "en" ? t.detalleEn : t.detalle)} <strong>${whenUsedLabel}</strong> ${escapeHtml(lang === "en" ? t.usoEn : t.uso)}</p>`;
  }).join("\n\n");

  const body =
    lang === "en"
      ? `    <h1>${headline}</h1>
    <p class="lead">We explain, in plain language with no jargon, the main types of insulin and how they differ.</p>

    <div class="disclaimer">
      This guide is educational and general: it isn't meant for adjusting doses or replacing the regimen your doctor or diabetes educator has prescribed. The type, dose and timing of insulin should always be decided with your medical team, on an individual basis.
    </div>

    <div class="article-body">
      <h2>The basic idea: "basal" insulin and "bolus" insulin</h2>
      <p>A normally functioning pancreas releases insulin in two ways: a little continuously throughout the day (to keep glucose stable between meals and overnight) and a lot more all at once when eating (to handle the glucose rise from that meal). Insulin treatments try to mimic that same pattern by combining two types of insulin with different profiles: a slow-acting insulin that acts as "basal insulin" (the background level) and a fast-acting insulin that acts as "bolus insulin" (the one that covers meals). The rest of the insulin types are, essentially, variations on these two profiles.</p>

      <h2>Quick comparison of insulin types</h2>
    </div>

    <div class="table-scroll reveal">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Examples</th>
            <th>Onset</th>
            <th>Peak</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
${tableRows}
        </tbody>
      </table>
    </div>
    <p class="table-note">These times are approximate: they can vary from person to person and depending on where on the body the injection is given. Data based on the CDC's <a href="https://www.cdc.gov/diabetes/about/how-to-use-insulin.html" target="_blank" rel="noopener noreferrer">types of insulin</a> (U.S. Centers for Disease Control and Prevention).</p>

    <div class="article-body">
      <h2>Each type of insulin, explained in more detail</h2>
${detailBlocks}

      <h2>Common questions</h2>

      <h3>Why are there so many different types of insulin?</h3>
      <p>Because each person needs a different combination of "background" insulin and "mealtime" insulin, depending on their routine, schedule and type of diabetes. Having several types with different speeds and durations makes it possible to tailor treatment to each case.</p>

      <h3>What's the difference between human insulin and insulin analogs?</h3>
      <p>Human insulin (like regular or NPH) has a structure identical to the one the human body produces. Analogs (like lispro, aspart, glargine or degludec) are insulins slightly modified in the lab so they act faster or for longer, depending on the case. Both types are real insulins that have been used safely under medical prescription for decades.</p>

      <h3>Can different types of insulin be mixed in the same syringe or pen?</h3>
      <p>It depends on the specific type of insulin: some combinations are designed to be mixed (like premixed insulins) while others shouldn't be mixed together. This should always be indicated by the medical team, since mixing insulins incorrectly can change how they work.</p>

      <h3>Is all insulin given the same way?</h3>
      <p>The most common way is subcutaneous injection (with a pen, syringe or insulin pump), though the device and injection site can slightly affect how quickly it acts. You can see how insulin pumps work, using rapid-acting insulin continuously, in our <a href="bombas-de-insulina.html">insulin pump comparison</a>.</p>
    </div>

    <div class="disclaimer">
      Remember: the goal of this page is to help you better understand how your treatment (or a loved one's) works, not to replace your medical team. Any change in insulin type, dose or timing should always be made under professional supervision. More context on our <a href="quienes-somos.html">about us</a> page.
    </div>`
      : `    <h1>${headline}</h1>
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
    </div>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", "tipos-insulina", lang, pagePath)}

  <main class="article-wrap article-wrap--wide">
    ${renderBreadcrumbsNav(breadcrumbItems, lang)}
${body}
  </main>

${renderFooter("", lang)}
  <script src="${assetPrefix}js/motion.js"></script>
</body>
</html>
`;
}

function renderCategoryPage(slug, articles, lang = "es") {
  const t = STRINGS[lang];
  const assetPrefix = lang === "en" ? "../../" : "../";
  const cat = CATEGORIAS[slug];
  const catName = lang === "en" ? cat.nombreEn : cat.nombre;
  const description = lang === "en" ? cat.descripcionEn : cat.descripcion;
  const articulosCategoria = articles
    .filter(a => a.categoria === slug)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const pagePath = `categoria/${slug}.html`;
  const heading = lang === "en" ? `${catName}: diabetes news` : `${catName}: novedades sobre diabetes`;
  const title = `${heading} · ${SITE_NAME}`;
  const url = urlFor(pagePath, lang);

  const breadcrumbItems = [
    { name: t.home, href: "../index.html", url: urlFor("index.html", lang) },
    { name: catName, url }
  ];

  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: heading,
    description,
    url,
    inLanguage: lang,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: urlFor("index.html", lang) },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articulosCategoria.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: articleUrl(a, true, lang),
        name: lang === "en" ? a.en.titulo : a.titulo
      }))
    }
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "website",
    prefix: "../",
    assetPrefix,
    jsonLdBlocks: [jsonLdCollection, breadcrumbJsonLd(breadcrumbItems)],
    lang,
    pagePath
  });

  const cardsHtml = articulosCategoria.map(a => renderCard(a, "../", {}, lang)).join("\n");

  const relatedGuidesHtml = cat.guiasRelacionadas.length
    ? `    <div class="callout">
      <strong>${t.alsoLike}</strong>
      ${cat.guiasRelacionadas.map(g => `<a href="../${g.href}">${escapeHtml(lang === "en" ? g.labelEn : g.label)}</a>`).join(" · ")}
    </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("../", null, lang, pagePath)}

  <main class="container">
    ${renderBreadcrumbsNav(breadcrumbItems, lang)}
    <section class="hero hero--compact">
      <span class="badge" style="background:${cat.color}">${cat.icono} ${catName}</span>
      <h1>${heading}</h1>
      <p>${escapeHtml(description)}</p>
    </section>

${relatedGuidesHtml}

    <div class="grid">
${cardsHtml}
    </div>

    <div class="disclaimer">
      ${t.disclaimerGeneric}
    </div>
  </main>

${renderFooter("../", lang)}
  <script src="${assetPrefix}js/motion.js"></script>
</body>
</html>
`;
}

function renderGlossaryPage(lang = "es") {
  const assetPrefix = lang === "en" ? "../" : "";
  const pagePath = "glosario.html";
  const title = lang === "en" ? `Diabetes glossary · ${SITE_NAME}` : `Glosario de términos sobre diabetes · ${SITE_NAME}`;
  const description =
    lang === "en"
      ? "A simple dictionary of common diabetes terms: HbA1c, basal and bolus insulin, hypoglycemia, insulin resistance, CGM and more, explained in plain language."
      : "Diccionario sencillo de términos habituales sobre diabetes: HbA1c, insulina basal y en bolo, hipoglucemia, resistencia a la insulina, MCG y más, explicados en palabras claras.";
  const url = urlFor(pagePath, lang);
  const pageName = lang === "en" ? "Glossary" : "Glosario";
  const heading = lang === "en" ? "Diabetes glossary" : "Glosario de términos sobre diabetes";

  const breadcrumbItems = [
    { name: STRINGS[lang].home, href: "index.html", url: urlFor("index.html", lang) },
    { name: pageName, url }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: heading,
    description,
    url,
    inLanguage: lang,
    hasDefinedTerm: GLOSSARY_ITEMS.map(item => ({
      "@type": "DefinedTerm",
      name: lang === "en" ? item.terminoEn : item.termino,
      description: stripTags(lang === "en" ? item.definicionEn : item.definicion),
      url: `${url}#${item.slug}`
    }))
  };

  const head = renderHead({
    title,
    description,
    url,
    type: "website",
    prefix: "",
    assetPrefix,
    jsonLdBlocks: [jsonLd, breadcrumbJsonLd(breadcrumbItems)],
    lang,
    pagePath
  });

  const tocHtml = GLOSSARY_ITEMS.map(
    item => `<a href="#${item.slug}">${escapeHtml(lang === "en" ? item.terminoEn : item.termino)}</a>`
  ).join("\n        ");

  const termsHtml = GLOSSARY_ITEMS.map(
    item => `      <h2 id="${item.slug}">${escapeHtml(lang === "en" ? item.terminoEn : item.termino)}</h2>
      <p>${lang === "en" ? item.definicionEn : item.definicion}</p>`
  ).join("\n\n");

  const lead =
    lang === "en"
      ? "A short, plain-language dictionary of the terms that come up most often when talking about diabetes."
      : "Un diccionario breve, en palabras sencillas, de los términos que más se repiten al hablar de diabetes.";
  const disclaimer =
    lang === "en"
      ? "These definitions are general and educational: they don't replace the information your medical team gives you about your specific case."
      : "Estas definiciones son generales y divulgativas: no sustituyen la información que te dé tu equipo médico sobre tu caso concreto.";
  const tocLabel = lang === "en" ? "Table of contents" : "Índice de términos";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", "glosario", lang, pagePath)}

  <main class="article-wrap">
    ${renderBreadcrumbsNav(breadcrumbItems, lang)}
    <h1>${heading}</h1>
    <p class="lead">${lead}</p>

    <div class="disclaimer">
      ${disclaimer}
    </div>

    <nav class="glossary-toc" aria-label="${tocLabel}">
        ${tocHtml}
    </nav>

    <div class="article-body">
${termsHtml}
    </div>
  </main>

${renderFooter("", lang)}
  <script src="${assetPrefix}js/motion.js"></script>
</body>
</html>
`;
}

// Genera un sitemap con las URLs de ambos idiomas: cada página aparece dos
// veces (una por idioma), con anotaciones xhtml:link "alternate" que enlazan
// cada versión con su par, tal y como recomienda Google para sitios
// multilingües con URLs separadas por idioma.
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

  const categoryPages = Object.keys(CATEGORIAS).map(slug => {
    const articulosCategoria = articles.filter(a => a.categoria === slug);
    const lastmod = articulosCategoria.reduce((max, a) => (a.fecha > max ? a.fecha : max), articulosCategoria[0].fecha);
    return { pagePath: `categoria/${slug}.html`, lastmod };
  });

  const entries = [
    { pagePath: "index.html", lastmod: articles.reduce((max, a) => (a.fecha > max ? a.fecha : max), articles[0].fecha) },
    ...articles.map(a => ({ pagePath: `articulos/${a.id}.html`, lastmod: a.fecha, image: ogImageForArticle(a) })),
    ...staticPages.map(p => ({ pagePath: p, lastmod: STATIC_PAGES_LASTMOD })),
    ...categoryPages
  ];

  const urlBlocks = [];
  for (const entry of entries) {
    const esUrl = urlFor(entry.pagePath, "es");
    const enUrl = urlFor(entry.pagePath, "en");
    const imageTag = entry.image ? `\n    <image:image><image:loc>${entry.image}</image:loc></image:image>` : "";
    for (const loc of [esUrl, enUrl]) {
      urlBlocks.push(
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}" />\n    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />${imageTag}\n  </url>`
      );
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urlBlocks.join("\n")}\n</urlset>\n`;
}

function renderRobotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function renderNotFoundPage(lang = "es") {
  const assetPrefix = lang === "en" ? "../" : "";
  const pagePath = "404.html";
  const title = lang === "en" ? `Page not found · ${SITE_NAME}` : `Página no encontrada · ${SITE_NAME}`;
  const description =
    lang === "en"
      ? "The page you're looking for doesn't exist or has moved. Head back to the DiabetesHoy homepage to see the latest news."
      : "La página que buscas no existe o se ha movido. Vuelve a la portada de DiabetesHoy para ver las últimas noticias.";
  const url = urlFor(pagePath, lang);

  // noindex: es una página de error, no debe aparecer en los resultados de búsqueda.
  const head = renderHead({ title, description, url, type: "website", prefix: "", assetPrefix, robots: "noindex, follow", lang });

  const body =
    lang === "en"
      ? `    <h1>Page not found</h1>
    <p class="lead">Sorry, the page you're looking for doesn't exist or has moved.</p>

    <div class="article-body">
      <p>You can go back to the <a href="index.html">homepage</a>, check the <a href="dietas-y-ejercicio.html">practical guide</a>, the <a href="bombas-de-insulina.html">insulin pump comparison</a> or the <a href="tipos-de-insulina.html">types of insulin</a>, or browse the <a href="faq.html">FAQ</a>.</p>
    </div>`
      : `    <h1>Página no encontrada</h1>
    <p class="lead">Lo sentimos, la página que buscas no existe o se ha movido.</p>

    <div class="article-body">
      <p>Puedes volver a la <a href="index.html">portada</a>, consultar la <a href="dietas-y-ejercicio.html">guía práctica</a>, la <a href="bombas-de-insulina.html">comparativa de bombas de insulina</a> o los <a href="tipos-de-insulina.html">tipos de insulina</a>, o revisar las <a href="faq.html">preguntas frecuentes</a>.</p>
    </div>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${GTM_SCRIPT}
${head}
</head>
<body>
${GTM_NOSCRIPT}
${renderHeader("", null, lang, pagePath)}

  <main class="article-wrap">
${body}
  </main>

${renderFooter("", lang)}
  <script src="${assetPrefix}js/motion.js"></script>
</body>
</html>
`;
}

function main() {
  const CATEGORY_DIR = path.join(ROOT, "categoria");
  const EN_ROOT = path.join(ROOT, "en");
  const EN_ARTICLES_DIR = path.join(EN_ROOT, "articulos");
  const EN_CATEGORY_DIR = path.join(EN_ROOT, "categoria");

  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  fs.mkdirSync(CATEGORY_DIR, { recursive: true });
  fs.mkdirSync(EN_ARTICLES_DIR, { recursive: true });
  fs.mkdirSync(EN_CATEGORY_DIR, { recursive: true });

  // Páginas estáticas: se genera una versión ES en la raíz y una versión EN
  // bajo en/, con la misma estructura de subcarpetas en ambas.
  const staticPageWriters = [
    ["index.html", renderIndexPage, [ARTICLES]],
    ["dietas-y-ejercicio.html", renderGuidePage, []],
    ["bombas-de-insulina.html", renderPumpsPage, []],
    ["tipos-de-insulina.html", renderInsulinTypesPage, []],
    ["glosario.html", renderGlossaryPage, []],
    ["quienes-somos.html", renderAboutPage, []],
    ["faq.html", renderFaqPage, []],
    ["contacto.html", renderContactPage, []],
    ["404.html", renderNotFoundPage, []]
  ];

  for (const [filename, renderFn, args] of staticPageWriters) {
    fs.writeFileSync(path.join(ROOT, filename), renderFn(...args, "es"));
    fs.writeFileSync(path.join(EN_ROOT, filename), renderFn(...args, "en"));
  }

  for (const article of ARTICLES) {
    fs.writeFileSync(path.join(ARTICLES_DIR, `${article.id}.html`), renderArticlePage(article, ARTICLES, "es"));
    fs.writeFileSync(path.join(EN_ARTICLES_DIR, `${article.id}.html`), renderArticlePage(article, ARTICLES, "en"));
  }

  for (const slug of Object.keys(CATEGORIAS)) {
    fs.writeFileSync(path.join(CATEGORY_DIR, `${slug}.html`), renderCategoryPage(slug, ARTICLES, "es"));
    fs.writeFileSync(path.join(EN_CATEGORY_DIR, `${slug}.html`), renderCategoryPage(slug, ARTICLES, "en"));
  }

  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), renderSitemap(ARTICLES));
  fs.writeFileSync(path.join(ROOT, "robots.txt"), renderRobotsTxt());

  console.log(
    `Generadas ${ARTICLES.length * 2} páginas de artículo (ES+EN) + 2 portadas + ${Object.keys(CATEGORIAS).length * 2} páginas de categoría (ES+EN) + guía práctica, bombas, tipos de insulina, glosario y 3 páginas de apoyo (×2 idiomas cada una) + sitemap.xml + robots.txt`
  );
}

main();
