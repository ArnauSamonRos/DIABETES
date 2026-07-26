// Base de datos de artículos de DiabetesHoy
// Cada artículo incluye su fuente original para verificación.
const ARTICLES = [
  {
    id: "sensor-2026-panorama",
    categoria: "sensores",
    titulo: "Sensores de glucosa 2026: menos calibraciones y más precisión",
    resumen: "La nueva generación de monitores continuos de glucosa (MCG) reduce la necesidad de pinchazos para calibrar y avanza hacia sistemas más inteligentes y conectados.",
    fecha: "2026-02-03",
    fuenteNombre: "Diabetes con Empatía",
    fuenteUrl: "https://diabetesconempatia.org/nuevos-sensores-glucosa-2026/",
    cuerpo: [
      "Los sensores de monitorización continua de glucosa (MCG) que llegan al mercado en 2026 están cambiando la manera en la que millones de personas gestionan su diabetes en el día a día. La tendencia general apunta hacia dispositivos más discretos, con inserciones menos invasivas y una dependencia cada vez menor de la calibración manual mediante punción digital.",
      "Entre las novedades más comentadas están los sensores implantables de mayor duración, pensados para quienes buscan minimizar los cambios frecuentes de dispositivo, así como mejoras en los algoritmos de filtrado de señal que reducen las lecturas erróneas en momentos de cambios bruscos de glucosa, como después de comer o durante el ejercicio.",
      "Los fabricantes coinciden en que el objetivo ya no es solo medir con precisión, sino anticipar: los nuevos sistemas incorporan modelos que proyectan hacia dónde se dirige la glucosa en los próximos minutos, dando más margen de reacción a los usuarios."
    ]
  },
  {
    id: "abbott-glucosa-cetonas",
    categoria: "sensores",
    titulo: "Abbott presenta un sensor capaz de medir glucosa y cetonas a la vez",
    resumen: "La compañía mostró en un congreso internacional de tecnología en diabetes un sensor dual pensado para prevenir la cetoacidosis diabética de forma más temprana.",
    fecha: "2026-03-10",
    fuenteNombre: "Canal Diabetes",
    fuenteUrl: "https://canaldiabetes.com/novedades-tecnologicas-presentadas-en-ada-2026/",
    cuerpo: [
      "En el marco de los principales congresos de tecnología en diabetes de 2026, Abbott presentó avances sobre un sensor capaz de monitorizar simultáneamente los niveles de glucosa y de cetonas en el líquido intersticial.",
      "Esta función es especialmente relevante para la prevención precoz de la cetoacidosis diabética, una complicación grave que puede desarrollarse rápidamente, sobre todo en personas con diabetes tipo 1. Poder ver ambos valores en un mismo dispositivo, sin necesidad de pruebas adicionales, facilitaría una respuesta más temprana ante señales de alarma.",
      "Por su parte, Dexcom también compartió nuevos datos clínicos que respaldan la integración de sus sensores con sistemas automatizados de administración de insulina, reforzando la tendencia hacia los llamados sistemas de \"asa cerrada\"."
    ]
  },
  {
    id: "simplera-sync-desechable",
    categoria: "sensores",
    titulo: "MiniMed Simplera Sync: un sensor desechable todo en uno",
    resumen: "El nuevo sensor de Medtronic elimina la cinta adhesiva adicional y simplifica el proceso de inserción a solo dos pasos.",
    fecha: "2026-01-22",
    fuenteNombre: "Diabetes con Empatía",
    fuenteUrl: "https://diabetesconempatia.org/nuevos-sensores-glucosa-2026/",
    cuerpo: [
      "Simplera Sync, de MiniMed (Medtronic), se presenta como un sensor de glucosa totalmente desechable y todo en uno. A diferencia de generaciones anteriores, no requiere cinta protectora adicional, lo que reduce el número de pasos necesarios para colocarlo.",
      "El proceso de inserción se ha simplificado a dos pasos, pensado para hacerlo más accesible tanto a personas que empiezan a usar tecnología para la diabetes como a quienes ya llevan años monitorizando su glucosa.",
      "Este tipo de dispositivos forma parte de una tendencia más amplia: hacer que la tecnología de monitorización sea cada vez menos visible y más fácil de integrar en la rutina diaria."
    ]
  },
  {
    id: "tirzepatida-chile",
    categoria: "medicacion",
    titulo: "Chile aprueba la tirzepatida para diabetes tipo 2 y control del peso",
    resumen: "El Instituto de Salud Pública (ISP) autorizó este fármaco de Lilly, que actúa sobre dos mecanismos hormonales relacionados con la glucosa y el apetito.",
    fecha: "2026-01-27",
    fuenteNombre: "Cooperativa.cl",
    fuenteUrl: "https://www.cooperativa.cl/noticias/pais/salud/medicamentos/isp-aprobo-nuevo-medicamento-para-tratar-obesidad-y-diabetes-tipo-2/2026-01-27/101548.html",
    cuerpo: [
      "El Instituto de Salud Pública de Chile (ISP) aprobó el uso de tirzepatida, un medicamento del laboratorio estadounidense Eli Lilly indicado para el tratamiento de la diabetes tipo 2 y el control del peso corporal.",
      "El fármaco actúa sobre dos mecanismos hormonales implicados en la regulación de la glucosa y del apetito, combinando efectos que hasta ahora se conseguían por separado con otros tratamientos.",
      "Según lo informado, su comercialización en el país comenzó de forma progresiva, sumándose a la lista de opciones terapéuticas disponibles para profesionales y pacientes en la región."
    ]
  },
  {
    id: "bexagliflozina-fda",
    categoria: "medicacion",
    titulo: "La FDA aprueba la bexagliflozina (Brenzavvy) para diabetes tipo 2",
    resumen: "Se trata de un nuevo inhibidor del cotransportador sodio-glucosa tipo 2 (SGLT2) desarrollado por TheracosBio para mejorar el control glucémico.",
    fecha: "2026-02-14",
    fuenteNombre: "CONSULTORSALUD",
    fuenteUrl: "https://consultorsalud.com/bexagliflozina-nuevo-medicamento-aprobado-para-la-diabetes-tipo-2/",
    cuerpo: [
      "La agencia estadounidense FDA aprobó la bexagliflozina, un medicamento perteneciente a la familia de los inhibidores del cotransportador sodio-glucosa tipo 2 (SGLT2), cuyo nombre comercial en Estados Unidos es Brenzavvy™.",
      "Este grupo de fármacos actúa a nivel renal, favoreciendo la eliminación de glucosa a través de la orina y ayudando así a mejorar el control glucémico en personas con diabetes tipo 2.",
      "La incorporación de nuevas moléculas dentro de esta familia terapéutica amplía las alternativas disponibles junto a otros inhibidores de SGLT2 ya utilizados en la práctica clínica habitual."
    ]
  },
  {
    id: "cagrisema-orforglipron",
    categoria: "medicacion",
    titulo: "CagriSema y orforglipron, los tratamientos más esperados de 2026",
    resumen: "Novo Nordisk y Eli Lilly avanzan en nuevas combinaciones y en un agonista oral de GLP-1 para la obesidad y la diabetes tipo 2.",
    fecha: "2026-01-15",
    fuenteNombre: "El Global Farma",
    fuenteUrl: "https://elglobalfarma.com/industria/diez-lanzamientos-medicamentos-mas-esperados-2026/",
    cuerpo: [
      "Entre los lanzamientos farmacéuticos más seguidos de 2026 está CagriSema, de Novo Nordisk, una combinación de semaglutida (2,4 mg) y cagrilintida pensada para el tratamiento de la obesidad y la diabetes tipo 2.",
      "Por su parte, Eli Lilly continúa el desarrollo de orforglipron, un agonista oral del receptor de GLP-1. A diferencia de los tratamientos inyectables ya conocidos, su formulación en pastilla podría facilitar el acceso a este tipo de terapias para muchos pacientes.",
      "Lilly ha señalado que espera la evaluación de las autoridades regulatorias estadounidenses para este fármaco durante 2026, lo que ha generado gran expectación en la comunidad médica y entre asociaciones de pacientes."
    ]
  },
  {
    id: "terapia-genica-kriya",
    categoria: "estudios",
    titulo: "Terapia génica: un ensayo clínico busca enseñar a los músculos a regular la glucosa",
    resumen: "La biotecnológica Kriya Therapeutics introduce genes de insulina y glucocinasa en el músculo esquelético mediante una única inyección intramuscular.",
    fecha: "2026-04-02",
    fuenteNombre: "AARP",
    fuenteUrl: "https://www.aarp.org/espanol/salud/enfermedades-y-tratamientos/info-2026/diabetes-nuevos-avances-medicos.html",
    cuerpo: [
      "Uno de los enfoques más novedosos en investigación sobre diabetes es la terapia génica desarrollada por Kriya Therapeutics, que consiste en introducir los genes de la insulina y de la glucocinasa directamente en el músculo esquelético.",
      "La idea es que, tras una única inyección intramuscular, las propias células musculares aprendan a colaborar en la regulación de los niveles de glucosa en sangre, complementando o reduciendo la necesidad de insulina externa.",
      "El primer ensayo clínico en humanos con esta tecnología está previsto que comience durante 2026, un paso considerado clave para evaluar su seguridad y eficacia real en personas con diabetes."
    ]
  },
  {
    id: "sana-biotechnology-celulas-madre",
    categoria: "estudios",
    titulo: "Células madre sin inmunosupresión: Sana Biotechnology inicia un ensayo de fase 1",
    resumen: "La compañía biotecnológica avanza con una terapia celular derivada de células madre que busca evitar el uso de fármacos inmunosupresores.",
    fecha: "2026-03-18",
    fuenteNombre: "AARP",
    fuenteUrl: "https://www.aarp.org/espanol/salud/enfermedades-y-tratamientos/info-2026/diabetes-nuevos-avances-medicos.html",
    cuerpo: [
      "Sana Biotechnology anunció el inicio de un ensayo clínico de fase 1 con una terapia celular derivada de células madre, diseñada específicamente para no requerir el uso de fármacos inmunosupresores.",
      "Uno de los grandes obstáculos de los trasplantes de células productoras de insulina ha sido siempre la necesidad de suprimir el sistema inmunitario del receptor para evitar el rechazo, lo que conlleva riesgos importantes a largo plazo.",
      "Si los resultados de este ensayo son favorables, podría abrir la puerta a terapias celulares más seguras y accesibles para personas con diabetes tipo 1, aunque los propios investigadores insisten en que se trata de fases muy tempranas de investigación."
    ]
  },
  {
    id: "semaglutida-riesgo-renal",
    categoria: "estudios",
    titulo: "Un gran estudio asocia la semaglutida con menor riesgo renal y cardiovascular",
    resumen: "En un ensayo con más de 3.500 participantes se observó una reducción del 24% en un compuesto de eventos renales graves y muerte cardiovascular.",
    fecha: "2026-02-20",
    fuenteNombre: "Yucatán.com.mx",
    fuenteUrl: "https://www.yucatan.com.mx/salud/2026/05/26/glucosa-bajo-investigacion-avances-en-el-estudio-de-enfermedades-como-diabetes.html",
    cuerpo: [
      "Un estudio realizado con 3.533 participantes con diabetes tipo 2 encontró que el uso de semaglutida se asoció con una reducción del 24% en un compuesto de eventos renales mayores y muerte de causa cardiovascular, en comparación con el grupo control.",
      "Este tipo de resultados refuerza el papel de los agonistas del receptor de GLP-1 más allá del control glucémico, situándolos también como una herramienta relevante en la protección renal y cardiovascular de las personas con diabetes tipo 2.",
      "Los autores señalan que hacen falta más datos a largo plazo, pero consideran estos resultados un argumento sólido para ampliar el uso de este tipo de fármacos en pacientes con alto riesgo cardiorrenal."
    ]
  },
  {
    id: "microbiota-diabetes",
    categoria: "estudios",
    titulo: "La microbiota intestinal, una nueva pista para entender la diabetes tipo 2",
    resumen: "Investigadores identifican una relación entre la composición de la microbiota y la regulación del metabolismo de la glucosa.",
    fecha: "2026-05-26",
    fuenteNombre: "Yucatán.com.mx",
    fuenteUrl: "https://www.yucatan.com.mx/salud/2026/05/26/glucosa-bajo-investigacion-avances-en-el-estudio-de-enfermedades-como-diabetes.html",
    cuerpo: [
      "Un estudio reciente ha identificado una relación entre la composición de la microbiota intestinal y la regulación del metabolismo de la glucosa, abriendo nuevas vías de investigación sobre el origen y la evolución de la diabetes tipo 2.",
      "La microbiota, formada por billones de microorganismos que habitan en el intestino, participa en procesos como la digestión, la inflamación y la sensibilidad a la insulina, por lo que su estudio se considera un campo con gran potencial.",
      "Aunque todavía es un área de investigación en desarrollo, los científicos esperan que comprender mejor esta relación permita, en el futuro, diseñar intervenciones dietéticas o terapéuticas más personalizadas."
    ]
  },
  {
    id: "nice-2026-nutricion",
    categoria: "dietas",
    titulo: "La guía NICE 2026 pide un asesoramiento nutricional individualizado",
    resumen: "La actualización británica sobre diabetes tipo 2 insiste en una atención centrada en la persona también en materia de alimentación.",
    fecha: "2026-02-01",
    fuenteNombre: "Cardioteca",
    fuenteUrl: "https://www.cardioteca.com/guia-express/7922-guiaexpress-nice-2026-diabetes-tipo-2-parte-1-evaluacion-educacion-dieta-y-monitorizacion.html",
    cuerpo: [
      "La actualización de febrero de 2026 de la guía NICE NG28 sobre el manejo de la diabetes tipo 2 en adultos refuerza un modelo de atención centrado en la persona, también en lo relativo a la alimentación.",
      "El documento recomienda que el asesoramiento nutricional sea individualizado, continuo en el tiempo y ofrecido por profesionales con formación específica en nutrición, en lugar de recomendaciones genéricas iguales para todos los pacientes.",
      "En cuanto al tipo de alimentación, la guía sigue las pautas generales de una dieta saludable: hidratos de carbono con alto contenido en fibra e índice glucémico bajo, como frutas, verduras, cereales integrales y legumbres, además de lácteos bajos en grasa, pescado azul y control de las grasas saturadas y trans."
    ]
  },
  {
    id: "dieta-base-vegetal",
    categoria: "dietas",
    titulo: "Los patrones alimentarios de base vegetal ganan peso en las guías de diabetes",
    resumen: "La evidencia disponible relaciona las dietas ricas en fibra y bajas en grasas saturadas con una menor expresión de factores de riesgo cardiovascular.",
    fecha: "2026-02-05",
    fuenteNombre: "Elsevier - Endocrinología, Diabetes y Nutrición",
    fuenteUrl: "https://www.elsevier.es/es-revista-endocrinologia-diabetes-nutricion-13-articulo-resumen-ejecutivo-actualizacion-el-tratamiento-S2530016421000057",
    cuerpo: [
      "Distintas revisiones sobre tratamiento dietético en prediabetes y diabetes tipo 2 destacan que los patrones alimentarios de base vegetal, bajos en ácidos grasos saturados, colesterol y sodio, y con un alto contenido en fibra, potasio y ácidos grasos insaturados, se asocian a beneficios metabólicos y cardiovasculares.",
      "Entre los modelos concretos más mencionados están la dieta mediterránea, la dieta DASH, los patrones bajos en hidratos de carbono y las dietas vegano-vegetarianas, todos ellos compatibles con un buen control de la diabetes tipo 2 cuando se adaptan a cada persona.",
      "Los expertos insisten en que no existe una única dieta válida para todo el mundo: la elegida debe ajustarse a las preferencias culturales, económicas y de salud de cada paciente, siempre con supervisión profesional."
    ]
  },
  {
    id: "perdida-peso-control-metabolico",
    categoria: "dietas",
    titulo: "Perder entre un 5% y un 10% del peso mejora el control metabólico",
    resumen: "Un plan de alimentación saludable combinado con ejercicio regular puede tener un impacto relevante en la glucosa, la tensión arterial y el perfil lipídico.",
    fecha: "2026-02-05",
    fuenteNombre: "Elsevier - Endocrinología, Diabetes y Nutrición",
    fuenteUrl: "https://www.elsevier.es/es-revista-endocrinologia-diabetes-nutricion-13-articulo-resumen-ejecutivo-actualizacion-el-tratamiento-S2530016421000057",
    cuerpo: [
      "La evidencia recogida en distintas actualizaciones sobre diabetes tipo 2 coincide en un mensaje claro: las personas que logran reducir entre un 5% y un 10% de su peso corporal, combinando un plan de alimentación saludable con porciones adecuadas y un programa de ejercicio regular, suelen lograr un mejor control metabólico.",
      "Este tipo de cambios en el estilo de vida se ha relacionado no solo con mejoras en los niveles de glucosa, sino también con una mejor presión arterial y un perfil lipídico más favorable, dos factores clave en la prevención de complicaciones cardiovasculares.",
      "Los especialistas recuerdan que estos objetivos son más sostenibles cuando se plantean de forma gradual y se acompañan de seguimiento profesional, en lugar de dietas restrictivas de corta duración."
    ]
  }
];

const CATEGORIAS = {
  sensores: { nombre: "Sensores", color: "#2563eb" },
  medicacion: { nombre: "Medicación", color: "#059669" },
  estudios: { nombre: "Estudios", color: "#7c3aed" },
  dietas: { nombre: "Dietas", color: "#d97706" }
};

// Permite reutilizar estos datos desde build.js (Node) sin duplicarlos.
if (typeof module !== "undefined") {
  module.exports = { ARTICLES, CATEGORIAS };
}
