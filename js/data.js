// Base de datos de artículos de DiabetesHoy
// Cada artículo incluye su fuente original para verificación.
const ARTICLES = [
  {
    id: "perdida-peso-no-siempre-previene-diabetes",
    categoria: "estudios",
    titulo: "La pérdida de peso no siempre previene la diabetes tipo 2, según un nuevo estudio",
    tituloSeo: "Perder peso no siempre evita la diabetes",
    resumen: "Un estudio alemán encontró que, incluso tras mantener un 8% de pérdida de peso durante 9 años, un grupo de personas de alto riesgo metabólico siguió viendo subir su glucosa y cayó su secreción de insulina.",
    fecha: "2026-07-28",
    fuenteNombre: "Cadena 3 Argentina",
    fuenteUrl: "https://www.cadena3.com/noticia/ciencia/la-perdida-de-peso-no-siempre-previene-la-diabetes-tipo-2-segun-nuevo-estudio_577938",
    cuerpo: [
      "Un nuevo estudio de investigadores del Centro Alemán de Investigación en Diabetes (DZD), el Hospital Universitario de Tubinga y Helmholtz Múnich matiza uno de los mensajes más repetidos en la prevención de la diabetes tipo 2: que perder peso y mantenerlo es suficiente para evitarla en cualquier caso.",
      "Los investigadores siguieron durante 9 años a personas que habían logrado una pérdida de peso sustancial y la habían mantenido en el tiempo, con una reducción media del 8% del peso corporal. Sin embargo, dentro de un subgrupo de mayor riesgo metabólico (identificado como \"cluster 5\" en el estudio), la glucosa en sangre siguió aumentando y la secreción de insulina se redujo, manteniéndose un riesgo persistentemente alto de desarrollar diabetes tipo 2.",
      "Los propios autores insisten en que esto no resta valor a la pérdida de peso como herramienta de prevención, que sigue funcionando bien para la mayoría de las personas, tal y como recogíamos en nuestra noticia sobre pérdida de peso y control metabólico. El hallazgo apunta más bien a que, en un grupo concreto especialmente vulnerable, hacen falta además otras estrategias de seguimiento y tratamiento, y no basta con vigilar solo la báscula."
    ]
  },
  {
    id: "urv-huella-bioquimica-mortalidad-diabetes",
    categoria: "estudios",
    titulo: "Una huella bioquímica en sangre identifica a las personas con mayor riesgo de mortalidad por diabetes",
    tituloSeo: "Huella en sangre y riesgo de mortalidad",
    resumen: "Investigadores de la URV, el IRB-CatSud y el CIBEROBN han identificado 9 metabolitos en sangre, comunes a la diabetes tipo 2 y a la resistencia a la insulina, asociados a un mayor riesgo de mortalidad.",
    fecha: "2026-07-22",
    fuenteNombre: "Diari Digital de la URV",
    fuenteUrl: "https://diaridigital.urv.cat/es/huella-bioquimica-diabetes-resistencia-insulina-mortalidad/",
    cuerpo: [
      "Un estudio internacional con participación de la Universitat Rovira i Virgili (URV), el Institut de Recerca Biomèdica Catalunya Sud (IRB-CatSud) y el CIBEROBN ha identificado patrones moleculares en sangre capaces de anticipar el riesgo de mortalidad en personas con alteraciones metabólicas relacionadas con la diabetes.",
      "La investigación analizó muestras de plasma de casi 700 personas mayores con alto riesgo metabólico. Mediante técnicas analíticas avanzadas, el equipo identificó 31 metabolitos vinculados a la diabetes tipo 2 y otros 105 asociados a la resistencia a la insulina, con los que construyeron dos firmas biológicas distintas.",
      "Al cruzar ambas firmas, los investigadores encontraron 9 metabolitos comunes estrechamente relacionados con el riesgo de mortalidad: las personas en las que estas señales biológicas eran más marcadas presentaron un riesgo significativamente mayor de fallecer durante el periodo de seguimiento del estudio."
    ]
  },
  {
    id: "fda-aprueba-awiqli-insulina-semanal",
    categoria: "medicacion",
    titulo: "La FDA aprueba Awiqli, la primera insulina semanal para la diabetes tipo 2",
    tituloSeo: "FDA aprueba la primera insulina semanal",
    resumen: "La insulina icodec, comercializada como Awiqli, se convierte en la primera insulina basal de una sola inyección semanal para adultos con diabetes tipo 2, con resultados comparables a las insulinas diarias.",
    fecha: "2026-03-26",
    fuenteNombre: "Canal Diabetes",
    fuenteUrl: "https://canaldiabetes.com/insulina-semanal-diabetes-tipo-2-aprobada-por-la-fda/",
    cuerpo: [
      "La agencia estadounidense FDA ha aprobado Awiqli (insulina icodec), la primera insulina basal de administración semanal para adultos con diabetes tipo 2, un cambio relevante frente a las insulinas basales que hasta ahora requerían una inyección diaria.",
      "La aprobación se basó en el programa de ensayos clínicos de fase 3a ONWARDS, formado por cuatro estudios aleatorizados y controlados frente a insulinas basales de administración diaria. Los resultados mostraron reducciones de la hemoglobina glucosilada (HbA1c) comparables o superiores a las de las insulinas diarias, con un perfil de seguridad similar.",
      "Al pasar de una inyección diaria a una semanal, este tipo de insulina busca simplificar el tratamiento y reducir la carga de pinchazos para las personas con diabetes tipo 2. Novo Nordisk, la farmacéutica responsable del fármaco, prevé comenzar su comercialización en Estados Unidos durante la segunda mitad de 2026."
    ]
  },
  {
    id: "celulas-piel-insulina-diabetes-tipo1",
    categoria: "estudios",
    titulo: "Un proyecto genera células productoras de insulina a partir de piel humana para la diabetes tipo 1",
    tituloSeo: "Células de la piel para producir insulina",
    resumen: "Una investigación cofinanciada por la Fundación DiabetesCERO ha logrado generar, a partir de piel humana, células cada vez más parecidas a las células beta del páncreas, capaces de producir insulina.",
    fecha: "2026-01-15",
    fuenteNombre: "La Jornada",
    fuenteUrl: "https://www.jornada.com.mx/noticia/2026/01/15/ciencias/un-proyecto-avanza-en-la-cura-para-la-diabetes-tipo-1-genera-celulas-productoras-de-insulina-a-partir-de-piel-humana",
    cuerpo: [
      "Un proyecto de investigación cofinanciado por la Fundación DiabetesCERO ha conseguido generar, a partir de piel humana, células con una funcionalidad cada vez más parecida a la de las células beta del páncreas, las encargadas de producir insulina en el organismo.",
      "Según lo publicado, las células obtenidas muestran características cada vez más cercanas a las de las células beta originales, incluyendo la capacidad de producir insulina y una mayor expresión de los genes asociados a su secreción, un paso relevante en la búsqueda de células de repuesto para la diabetes tipo 1.",
      "Esta línea de trabajo se suma a otras vías de investigación que ya hemos recogido en DiabetesHoy, como la terapia con células madre de Sana Biotechnology, dentro del mismo objetivo a largo plazo: sustituir las células beta que el organismo ha perdido en la diabetes tipo 1 de larga evolución."
    ]
  },
  {
    id: "rinon-sensor-precoz-riesgo-cardiovascular",
    categoria: "complicaciones",
    titulo: "El riñón, un \"sensor precoz\" del riesgo cardiovascular en la diabetes, según Vithas",
    tituloSeo: "El riñón, aviso precoz de riesgo cardiaco",
    resumen: "Especialistas de Vithas alertan de que la enfermedad renal en la diabetes no es solo una complicación aislada, sino un amplificador del riesgo cardiovascular, con el calor y la deshidratación del verano como factor añadido.",
    fecha: "2026-07-27",
    fuenteNombre: "Hoy Lunes",
    fuenteUrl: "https://www.hoylunes.com/2026/07/27/enfermedad-renal-riesgo-cardiovascular-vithas/",
    cuerpo: [
      "Especialistas de Vithas han alertado de que la enfermedad renal crónica asociada a la diabetes no debería entenderse solo como una complicación aislada del riñón, sino como un auténtico amplificador del riesgo cardiovascular: cuando el riñón empieza a fallar, aumenta también la probabilidad de sufrir infartos, ictus u otras patologías vasculares.",
      "Según esta alerta, el riñón puede actuar como una especie de \"sensor precoz\" del estado de las arterias, de modo que un deterioro de la función renal puede ser una señal temprana de un mayor riesgo cardiovascular general, incluso antes de que aparezcan síntomas cardíacos evidentes.",
      "En estas fechas de verano, los especialistas añaden un factor de riesgo adicional: el calor y la deshidratación pueden sobrecargar todavía más un riñón ya afectado por la diabetes, por lo que recomiendan prestar especial atención a la hidratación y al control médico habitual durante los meses más calurosos."
    ]
  },
  {
    id: "orforglipron-foundayz-achieve3",
    categoria: "medicacion",
    titulo: "Orforglipron ya tiene nombre comercial: Foundayz, la pastilla de Lilly para la diabetes tipo 2",
    tituloSeo: "Foundayz: la pastilla de Lilly ya tiene nombre",
    resumen: "El fármaco oral de Eli Lilly, ya autorizado en México, mostró en el ensayo ACHIEVE-3 una reducción de hasta 2,2 puntos de HbA1c y una pérdida media del 9,2% del peso corporal en 52 semanas.",
    fecha: "2026-07-20",
    fuenteNombre: "Publimetro México",
    fuenteUrl: "https://www.publimetro.com.mx/noticias/2026/07/20/nuevo-medicamento-para-diabetes-tipo-2-busca-mejorar-control-glucemico-en-mexico/",
    cuerpo: [
      "El tratamiento oral de Eli Lilly conocido hasta ahora por su nombre químico, orforglipron, ya cuenta con nombre comercial: Foundayz. Se trata de un medicamento que activa el receptor del péptido similar al glucagón tipo 1 (GLP-1) y que, a diferencia de otros tratamientos de la misma familia, se toma por vía oral y sin condiciones específicas relacionadas con el horario de las comidas.",
      "En el ensayo clínico ACHIEVE-3, centrado en personas con diabetes tipo 2, los participantes lograron reducciones de hasta 2,2 puntos en su hemoglobina glucosilada (HbA1c) y perdieron en promedio un 9,2% de su peso corporal (unos 8,9 kg) a lo largo de 52 semanas de tratamiento.",
      "Eli Lilly ha indicado que el medicamento estará disponible en puntos de venta autorizados en México durante los próximos meses. De forma paralela, el laboratorio Teva México ha anunciado que incorporará próximamente un tratamiento de combinación a dosis fija de liberación prolongada para el control glucémico en diabetes tipo 2."
    ]
  },
  {
    id: "isaac-sensor-aliento-preevnt",
    categoria: "sensores",
    titulo: "Isaac, el sensor que promete medir la glucosa a través del aliento y sin pinchazos",
    tituloSeo: "Isaac: medir la glucosa a través del aliento",
    resumen: "Presentado en el CES 2026, este dispositivo del tamaño de una moneda desarrollado por PreEvnt busca medir el azúcar en sangre de forma no invasiva, analizando el aliento del usuario.",
    fecha: "2026-01-08",
    fuenteNombre: "NotiPress",
    fuenteUrl: "https://notipress.mx/vida/presentan-en-ces-2026-sensor-que-mide-glucosa-por-aliento-34680",
    cuerpo: [
      "En el CES 2026 de Las Vegas, la empresa PreEvnt presentó Isaac, un dispositivo portátil que promete medir los niveles de azúcar en sangre sin necesidad de pinchazos, analizando en su lugar el aliento de la persona que lo usa.",
      "El sensor, del tamaño aproximado de una moneda, está pensado para llevarse colgado del cuello o guardado en un bolso, apostando por una tecnología no invasiva que se aleja tanto de la punción digital tradicional como de los sensores que se colocan sobre la piel.",
      "Se trata todavía de una tecnología emergente presentada en un evento de tecnología de consumo, por lo que habrá que esperar a estudios clínicos y a una posible aprobación regulatoria para saber si cumple con la precisión necesaria para un uso médico habitual."
    ]
  },
  {
    id: "rutina-ejercicio-62-por-ciento-riesgo",
    categoria: "ejercicio",
    titulo: "La rutina de ejercicio que se asocia con un menor riesgo de diabetes tipo 2, según un estudio",
    tituloSeo: "Ejercicio: 62% menos riesgo de diabetes",
    resumen: "Un análisis con datos del Nurses' Health Study y el Health Professionals Follow-up Study encontró una asociación entre una rutina de ejercicio regular y un riesgo hasta un 62% menor de desarrollar diabetes tipo 2.",
    fecha: "2026-06-22",
    fuenteNombre: "Infobae",
    fuenteUrl: "https://www.infobae.com/salud/ciencia/2026/06/22/la-rutina-de-ejercicio-que-se-asocia-con-menor-riesgo-de-diabetes-tipo-2-segun-un-estudio/",
    cuerpo: [
      "Un estudio que utilizó datos a largo plazo del Nurses' Health Study, el Nurses' Health Study II y el Health Professionals Follow-up Study encontró una asociación entre mantener una rutina de ejercicio regular a lo largo de los años y un riesgo hasta un 62% menor de desarrollar diabetes tipo 2.",
      "Los autores señalan que la combinación de actividad aeróbica regular con sesiones de entrenamiento de fuerza parece aportar un beneficio adicional frente a practicar un único tipo de ejercicio, en línea con las recomendaciones generales de las guías de actividad física.",
      "Este tipo de estudios de cohortes, con seguimientos de varios años, refuerza la idea de que no se trata de una rutina puntual, sino de mantener el hábito de forma sostenida en el tiempo para notar una reducción real del riesgo de desarrollar la enfermedad."
    ]
  },
  {
    id: "css-panama-sensores-ninos",
    categoria: "sensores",
    titulo: "Panamá reparte sensores de glucosa gratuitos a niños con diabetes",
    tituloSeo: "Panamá reparte sensores de glucosa a niños",
    resumen: "La Caja de Seguro Social panameña ha comenzado a entregar sensores de monitorización continua de 14 días de duración a menores con diabetes, con alertas antes de una bajada peligrosa de glucosa.",
    fecha: "2026-07-27",
    fuenteNombre: "CSS Noticias (Panamá)",
    fuenteUrl: "https://prensa.css.gob.pa/2026/01/19/css-coloca-70-sensores-de-monitoreo-continuo-de-glucosa-a-ninos-con-diabetes/",
    cuerpo: [
      "La Caja de Seguro Social (CSS) de Panamá ha comenzado a entregar y colocar sensores de monitorización continua de glucosa a niños y niñas con diagnóstico de diabetes, dentro de un programa público de acceso a esta tecnología.",
      "Los sensores entregados tienen una vida útil de 14 días y una de sus funciones más valoradas por las familias es la capacidad de emitir alertas cuando los niveles de glucosa empiezan a bajar, antes de que el menor pierda el estado de conciencia o sufra convulsiones por una hipoglucemia grave.",
      "Este tipo de iniciativas públicas buscan reducir la brecha de acceso a la monitorización continua, una tecnología que hasta hace poco quedaba fuera del alcance de muchas familias por su coste, especialmente en la población pediátrica, donde las alertas tempranas son especialmente valiosas."
    ]
  },
  {
    id: "cofepris-orforglipron-oral",
    categoria: "medicacion",
    titulo: "México autoriza la primera pastilla contra la diabetes tipo 2 con doble aprobación para la obesidad",
    tituloSeo: "México aprueba pastilla oral para diabetes",
    resumen: "COFEPRIS autorizó un nuevo tratamiento oral de Eli Lilly que en ensayos de fase 3 logró reducciones de hasta 2,2 puntos de HbA1c y una pérdida media del 12,4% del peso corporal.",
    fecha: "2026-07-27",
    fuenteNombre: "Saludiario",
    fuenteUrl: "https://www.saludiario.com/cofepris-autoriza-un-tratamiento-oral-contra-la-obesidad-y-diabetes-es-el-primer-pais-del-mundo-con-una-doble-aprobacion/",
    cuerpo: [
      "La Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) de México autorizó un nuevo tratamiento en pastilla desarrollado por el laboratorio Eli Lilly, indicado tanto para la obesidad como para la diabetes tipo 2.",
      "La autorización se basó en dos programas de ensayos clínicos de fase 3: en el estudio centrado en obesidad, los participantes perdieron en promedio un 12,4% de su peso corporal, mientras que en el estudio centrado en diabetes tipo 2 se lograron reducciones de hasta 2,2 puntos en la hemoglobina glucosilada (HbA1c), un indicador clave del control glucémico a medio plazo.",
      "Según lo informado, se trata de la primera autorización de este tipo a nivel mundial con una doble indicación (obesidad y diabetes tipo 2) para este tratamiento oral, lo que lo sitúa como una alternativa a considerar junto a los tratamientos inyectables ya existentes de la misma familia."
    ]
  },
  {
    id: "actualizacion-2026-cardiorrenal-diabetes",
    categoria: "estudios",
    titulo: "La actualización de 2026 para cardiólogos prioriza el beneficio cardiorrenal al elegir tratamiento en diabetes tipo 2",
    tituloSeo: "Diabetes tipo 2: enfoque cardiorrenal 2026",
    resumen: "La revisión más reciente refuerza un cambio de enfoque: elegir los fármacos según su beneficio cardiovascular y renal, incluso cuando el control de la glucosa ya es aceptable.",
    fecha: "2026-07-27",
    fuenteNombre: "Cardioteca",
    fuenteUrl: "https://www.cardioteca.com/blog-diabetes/7763-actualizacion-2026-en-diabetes-tipo-2-para-cardiologos-enfoque-cardiorrenal-y-terapias-prioritarias.html",
    cuerpo: [
      "Una actualización dirigida a cardiólogos sobre el manejo de la diabetes tipo 2 en 2026 refuerza un cambio de enfoque que lleva años consolidándose: elegir el tratamiento farmacológico también en función de su beneficio cardiovascular y renal, y no solo de su capacidad para bajar la glucosa.",
      "Esto significa que, incluso en personas cuyo control glucémico ya es aceptable, puede recomendarse añadir o mantener determinados fármacos (como los inhibidores de SGLT2 o los agonistas del receptor de GLP-1) por su efecto protector sobre el corazón y los riñones, dos de los órganos más afectados a largo plazo por la diabetes.",
      "La revisión también insiste en ajustar la estrategia de tratamiento según el fenotipo clínico de cada persona: no es lo mismo priorizar la protección cardiorrenal en alguien con antecedentes cardiovasculares que en alguien sin ellos, de ahí la importancia de una valoración individualizada por parte del equipo médico."
    ]
  },
  {
    id: "ada-2026-prediabetes-perdida-peso",
    categoria: "dietas",
    titulo: "Los estándares ADA 2026 refuerzan la pérdida de peso del 5-7% y la dieta mediterránea frente a la prediabetes",
    tituloSeo: "ADA 2026: pérdida de peso y prediabetes",
    resumen: "La actualización de la Asociación Americana de Diabetes reafirma el seguimiento estructurado de la prediabetes, con más peso para los programas de pérdida de peso, la dieta mediterránea y la telemedicina.",
    fecha: "2026-07-27",
    fuenteNombre: "Nutrinfo",
    fuenteUrl: "https://nutrinfo.com/recursos/actualizacion-2026-de-los-estandares-de-atencion-en-diabetes-de-la-ada",
    cuerpo: [
      "La actualización 2026 de los Estándares de Atención en Diabetes de la Asociación Americana de Diabetes (ADA) refuerza el seguimiento estructurado de las personas con prediabetes, con el objetivo de frenar su progresión hacia una diabetes tipo 2 ya establecida.",
      "Entre las herramientas que ganan peso en esta actualización están los programas de pérdida de peso de entre un 5% y un 7% del peso corporal, la dieta mediterránea como patrón de referencia, el apoyo por telemedicina para facilitar el seguimiento, y el uso selectivo de metformina en las personas con mayor riesgo.",
      "El documento también refuerza la educación terapéutica en diabetes, la atención a la nutrición individualizada, el ejercicio, el sueño y el abandono del tabaco o el vapeo, además de recomendar un cribado sistemático de la angustia asociada a vivir con diabetes."
    ]
  },
  {
    id: "ejercicio-movilidad-diabetes-2026",
    categoria: "ejercicio",
    titulo: "Cómo el ejercicio ayuda a recuperar movilidad y mejorar el control de la diabetes",
    tituloSeo: "Ejercicio y movilidad en la diabetes",
    resumen: "Un programa de ejercicio dirigido a personas con diabetes mostró mejoras en la fuerza muscular, el dolor, la rigidez, el equilibrio y el riesgo de caídas, además de reforzar la autonomía en el día a día.",
    fecha: "2026-07-27",
    fuenteNombre: "Diario Huemul",
    fuenteUrl: "https://elhuemul.cl/2026/07/14/como-recuperar-la-movilidad-y-mejorar-el-control-de-la-diabetes-con-ejercicios/",
    cuerpo: [
      "Un reportaje reciente recoge cómo una intervención estructurada de ejercicio físico puede ayudar a las personas con diabetes a recuperar movilidad, además de mejorar el control de la enfermedad. Los participantes mostraron mejoras en la fuerza muscular y una reducción del dolor y la rigidez articular.",
      "El programa también se asoció a una mejor movilidad y equilibrio, lo que en la práctica se traduce en un menor riesgo de caídas, un aspecto especialmente relevante en personas mayores con diabetes o con complicaciones que afectan a la sensibilidad de los pies.",
      "Los autores destacan que este tipo de intervenciones no solo inciden en el control glucémico, sino que ayudan a prevenir complicaciones crónicas y a fortalecer la autonomía para las actividades del día a día, un objetivo tan importante como el propio control de la glucosa."
    ]
  },
  {
    id: "ada-2026-retinopatia-neuropatia-pie",
    categoria: "complicaciones",
    titulo: "Los estándares ADA 2026 refuerzan el control glucémico y de presión arterial para frenar la retinopatía",
    tituloSeo: "ADA 2026: control glucémico y retinopatía",
    resumen: "El capítulo dedicado a retinopatía, neuropatía y cuidado del pie en los Estándares de Atención en Diabetes 2026 insiste en alcanzar los objetivos de glucosa, presión arterial y lípidos para reducir estas complicaciones.",
    fecha: "2026-07-27",
    fuenteNombre: "American Diabetes Association (Standards of Care in Diabetes—2026)",
    fuenteUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12690177/",
    cuerpo: [
      "El capítulo dedicado a retinopatía, neuropatía y cuidado del pie de los Estándares de Atención en Diabetes 2026 de la Asociación Americana de Diabetes (ADA) recuerda que estas complicaciones microvasculares están estrechamente ligadas tanto a la duración de la diabetes como al grado de hiperglucemia crónica mantenida en el tiempo.",
      "El documento recomienda implementar estrategias que ayuden a las personas con diabetes a alcanzar sus objetivos de glucosa, presión arterial y lípidos, ya que este control conjunto es lo que más contribuye a reducir el riesgo de aparición o a frenar la progresión de la retinopatía diabética.",
      "También se insiste en el cuidado del pie como parte de esta misma familia de complicaciones: la neuropatía puede reducir la sensibilidad y hacer que heridas o irritaciones pasen desapercibidas, por lo que la revisión periódica de los pies sigue siendo una recomendación central para prevenir úlceras."
    ]
  },
  {
    id: "diabetes-enfermedad-inflamatoria",
    categoria: "estudios",
    titulo: "Por qué cada vez se entiende también la diabetes tipo 2 como una enfermedad inflamatoria",
    tituloSeo: "Diabetes tipo 2 como enfermedad inflamatoria",
    resumen: "Cada vez hay más consenso en que, además de un problema de regulación de la glucosa, la diabetes tipo 2 implica una inflamación crónica de bajo grado que retroalimenta la resistencia a la insulina.",
    fecha: "2026-06-18",
    fuenteNombre: "MedChannel Network",
    fuenteUrl: "https://network.medchannel.org/blogs/143/nueva-cara-diabetes-enfermedad-inflamatoria",
    cuerpo: [
      "En los últimos años ha cobrado fuerza una visión renovada de la diabetes tipo 2: además de un problema de regulación de la glucosa, cada vez se entiende más como una enfermedad inflamatoria crónica de bajo grado, con una activación persistente de mecanismos inmunometabólicos que afectan al tejido adiposo, el hígado, el músculo esquelético, el páncreas y el sistema vascular.",
      "El mecanismo señalado por los especialistas parte del exceso de grasa abdominal, que libera hormonas y ácidos grasos capaces de mantener activado el sistema inmunitario de forma prolongada. Esa activación constante dificulta la señalización celular de la insulina, alimentando un círculo que refuerza la resistencia a la insulina y la hiperinsulinemia.",
      "La buena noticia es que este proceso puede ser reversible si se detecta a tiempo, especialmente en fases tempranas como la prediabetes: los cambios en la alimentación, el ejercicio y la reducción de la grasa abdominal pueden ayudar a revertir la resistencia a la insulina en cuestión de semanas o meses."
    ]
  },
  {
    id: "sensor-2026-panorama",
    categoria: "sensores",
    titulo: "Sensores de glucosa 2026: menos calibraciones y más precisión",
    tituloSeo: "Sensores de glucosa 2026: qué cambia",
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
    tituloSeo: "Abbott: sensor que mide glucosa y cetonas",
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
    tituloSeo: "MiniMed Simplera Sync: sensor desechable",
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
    tituloSeo: "Chile aprueba la tirzepatida para diabetes",
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
    tituloSeo: "FDA aprueba la bexagliflozina para diabetes",
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
    tituloSeo: "CagriSema y orforglipron: lo más esperado",
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
    tituloSeo: "Terapia génica para regular la glucosa",
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
    tituloSeo: "Células madre sin inmunosupresión",
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
    tituloSeo: "Semaglutida reduce el riesgo renal",
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
    tituloSeo: "Microbiota intestinal y diabetes tipo 2",
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
    tituloSeo: "Guía NICE 2026: asesoramiento nutricional",
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
    tituloSeo: "Dietas de base vegetal y diabetes tipo 2",
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
    tituloSeo: "Perder peso mejora el control metabólico",
    resumen: "Un plan de alimentación saludable combinado con ejercicio regular puede tener un impacto relevante en la glucosa, la tensión arterial y el perfil lipídico.",
    fecha: "2026-02-05",
    fuenteNombre: "Elsevier - Endocrinología, Diabetes y Nutrición",
    fuenteUrl: "https://www.elsevier.es/es-revista-endocrinologia-diabetes-nutricion-13-articulo-resumen-ejecutivo-actualizacion-el-tratamiento-S2530016421000057",
    cuerpo: [
      "La evidencia recogida en distintas actualizaciones sobre diabetes tipo 2 coincide en un mensaje claro: las personas que logran reducir entre un 5% y un 10% de su peso corporal, combinando un plan de alimentación saludable con porciones adecuadas y un programa de ejercicio regular, suelen lograr un mejor control metabólico.",
      "Este tipo de cambios en el estilo de vida se ha relacionado no solo con mejoras en los niveles de glucosa, sino también con una mejor presión arterial y un perfil lipídico más favorable, dos factores clave en la prevención de complicaciones cardiovasculares.",
      "Los especialistas recuerdan que estos objetivos son más sostenibles cuando se plantean de forma gradual y se acompañan de seguimiento profesional, en lugar de dietas restrictivas de corta duración."
    ]
  },
  {
    id: "entrenamiento-fuerza-hba1c",
    categoria: "ejercicio",
    titulo: "El entrenamiento de fuerza mejora el control glucémico en diabetes tipo 2",
    tituloSeo: "Entrenamiento de fuerza mejora la HbA1c",
    resumen: "Distintos estudios apuntan a una disminución significativa de la HbA1c en personas con diabetes tipo 2 que incorporan ejercicios de fuerza a su rutina.",
    fecha: "2026-03-04",
    fuenteNombre: "Canal Diabetes",
    fuenteUrl: "https://canaldiabetes.com/fitness-ayuda-a-tu-diabetes-2026/",
    cuerpo: [
      "La actividad física continúa consolidándose como uno de los pilares del tratamiento de la diabetes tipo 2, junto a la alimentación y la medicación. Distintos estudios recientes han apuntado un efecto positivo significativo del entrenamiento de fuerza sobre el control glucémico a medio plazo.",
      "En concreto, se ha observado una disminución relevante de los niveles de hemoglobina glucosilada (HbA1c) en personas que incorporan ejercicios de fuerza de forma regular, un indicador clave que refleja el control de la glucosa en los últimos meses.",
      "Los especialistas recomiendan combinar este tipo de entrenamiento con actividad aeróbica moderada, como caminar, nadar o bailar, siempre adaptando la intensidad a la condición física de cada persona y con supervisión profesional al iniciar una nueva rutina."
    ]
  },
  {
    id: "sedentarismo-cada-30-minutos",
    categoria: "ejercicio",
    titulo: "Interrumpir el sedentarismo cada 30 minutos ayuda a controlar la glucemia",
    tituloSeo: "Romper el sedentarismo cada 30 minutos",
    resumen: "Pequeñas pausas activas a lo largo del día, como levantarse a caminar unos minutos, se asocian a mejoras en los niveles de glucosa en personas con diabetes.",
    fecha: "2026-04-14",
    fuenteNombre: "Sociedad Española de Diabetes (SED)",
    fuenteUrl: "https://www.sediabetes.org/wp-content/uploads/3.SED_Ejercicio-fisico-en-la-diabetes.pdf",
    cuerpo: [
      "Además del ejercicio programado, cada vez hay más evidencia sobre el impacto de los pequeños movimientos repartidos a lo largo del día. Las recomendaciones actuales aconsejan interrumpir la sedestación prolongada cada 30 minutos para obtener beneficios adicionales sobre la glucemia.",
      "Actividades sencillas como levantarse a caminar unos minutos, hacer tareas domésticas o subir escaleras pueden marcar una diferencia real quienes pasan gran parte del día sentados, ya sea por trabajo o por otras circunstancias.",
      "Estas pausas activas se plantean como un complemento, no un sustituto, del ejercicio físico regular recomendado para las personas con diabetes tipo 1 y tipo 2."
    ]
  },
  {
    id: "ejercicio-prevencion-diabetes-58",
    categoria: "ejercicio",
    titulo: "150 minutos de ejercicio moderado a la semana redujeron un 58% el riesgo de diabetes tipo 2",
    tituloSeo: "Ejercicio: -58% riesgo de diabetes tipo 2",
    resumen: "Un programa de tres años que combinó dieta baja en grasa y actividad física moderada mostró una reducción notable del riesgo en personas con predisposición a desarrollar la enfermedad.",
    fecha: "2026-05-08",
    fuenteNombre: "SEMERGEN",
    fuenteUrl: "https://semergen.es/files/docs/grupos/diabetes/preescripcionEjercicioFisicoDiabetes.pdf",
    cuerpo: [
      "Uno de los datos más citados sobre la prevención de la diabetes tipo 2 proviene de un seguimiento de tres años a personas con alto riesgo de desarrollar la enfermedad. El grupo que siguió una dieta baja en grasa combinada con 150 minutos semanales de ejercicio moderado redujo en un 58% su riesgo de desarrollar diabetes tipo 2.",
      "Los investigadores señalan que la pérdida de peso fue el principal factor asociado a esa reducción de riesgo, aunque el ejercicio también aportó beneficios propios sobre la sensibilidad a la insulina, independientemente del peso perdido.",
      "Este tipo de resultados refuerza los mensajes de salud pública que sitúan la actividad física regular, junto con la alimentación, como una de las herramientas más eficaces y accesibles para la prevención de la diabetes tipo 2."
    ]
  },
  {
    id: "educacion-paciente-cribado-retinopatia",
    categoria: "complicaciones",
    titulo: "La educación del paciente aumenta el cribado de retinopatía y neuropatía diabética",
    tituloSeo: "Educación del paciente y cribado ocular",
    resumen: "Programas de educación sanitaria se asocian a un incremento del 33% en las revisiones de retinopatía y del 38% en las de neuropatía diabética.",
    fecha: "2026-02-27",
    fuenteNombre: "redGDPS",
    fuenteUrl: "https://www.redgdps.org/gestor/upload/file/GuiaRETINOLAB.pdf",
    cuerpo: [
      "La detección precoz sigue siendo la mejor herramienta frente a las complicaciones crónicas de la diabetes, especialmente las de tipo microvascular: retinopatía, nefropatía y neuropatía diabética. Distintos programas de educación sanitaria han mostrado un impacto claro en las tasas de cribado.",
      "En concreto, se ha observado un aumento del 33% en las revisiones de retinopatía diabética y del 38% en las de neuropatía diabética entre pacientes que participaron en programas educativos sobre su enfermedad.",
      "El mensaje de fondo es que informar bien a las personas con diabetes sobre por qué y cada cuánto deben revisarse la vista, los pies o la función renal tiene un efecto medible en la prevención de complicaciones graves a largo plazo."
    ]
  },
  {
    id: "control-glucemico-neuropatia",
    categoria: "complicaciones",
    titulo: "El control glucémico estricto sigue siendo la estrategia más eficaz frente a la neuropatía diabética",
    tituloSeo: "Control glucémico frente a la neuropatía",
    resumen: "Las revisiones más recientes confirman que el manejo integral de los factores de riesgo cardiovascular es la base de la prevención, mientras avanzan nuevas técnicas de neuromodulación.",
    fecha: "2026-04-03",
    fuenteNombre: "Ocronos - Revista Médica",
    fuenteUrl: "https://revistamedica.com/neuropatia-diabetica-actualizacion-conclusion-clinica/",
    cuerpo: [
      "La neuropatía diabética es una de las complicaciones crónicas más frecuentes, y su frecuencia varía según el contexto sociodemográfico, afectando especialmente a los adultos mayores. Las revisiones más recientes coinciden en que la prevención primaria sigue siendo la estrategia más eficaz.",
      "Esa prevención se basa en un control glucémico estricto combinado con la modificación integral de otros factores de riesgo cardiovascular, como la hipertensión o el colesterol elevado, más que en tratamientos aplicados una vez que el daño nervioso ya se ha producido.",
      "Al mismo tiempo, el desarrollo de nuevos tratamientos farmacológicos y de técnicas de neuromodulación abre un horizonte prometedor para mejorar el pronóstico de las personas que ya conviven con esta complicación."
    ]
  },
  {
    id: "prevencion-retinopatia-control-glucosa",
    categoria: "complicaciones",
    titulo: "Prevenir la retinopatía diabética pasa por el control de la glucosa y la tensión arterial",
    tituloSeo: "Prevenir la retinopatía: glucosa y tensión",
    resumen: "Los especialistas insisten en que la mejor estrategia frente a esta complicación ocular sigue siendo la prevención, más que su tratamiento una vez desarrollada.",
    fecha: "2026-05-12",
    fuenteNombre: "SciELO",
    fuenteUrl: "https://scielo.isciii.es/scielo.php?script=sci_arttext&pid=S1137-66272008000600003",
    cuerpo: [
      "La retinopatía diabética es una de las causas más comunes de pérdida de visión evitable en personas adultas. Los especialistas coinciden en que el mejor tratamiento sigue siendo la prevención, mediante un control adecuado de los niveles de glucosa en sangre.",
      "Junto al control glucémico, el manejo de la hipertensión arterial, una dieta saludable y la práctica de ejercicio regular completan las principales medidas preventivas recomendadas para reducir el riesgo de desarrollar esta complicación.",
      "La buena educación sanitaria del paciente también juega un papel central: entender por qué son importantes las revisiones oftalmológicas periódicas ayuda a detectar cambios en una fase temprana, cuando el tratamiento es más eficaz."
    ]
  }
];

const CATEGORIAS = {
  sensores: {
    nombre: "Sensores",
    color: "#2563eb",
    icono: "📡",
    descripcion: "Novedades sobre sensores de monitorización continua de glucosa (MCG), parches, lectores y otros dispositivos para medir la glucosa sin pincharse el dedo cada vez.",
    guiasRelacionadas: [{ label: "Tipos de insulina", href: "tipos-de-insulina.html" }]
  },
  medicacion: {
    nombre: "Medicación",
    color: "#059669",
    icono: "💊",
    descripcion: "Aprobaciones, nuevos fármacos y actualizaciones sobre tratamientos para la diabetes tipo 1 y tipo 2, desde insulinas hasta agonistas de GLP-1 e inhibidores de SGLT2.",
    guiasRelacionadas: [
      { label: "Tipos de insulina", href: "tipos-de-insulina.html" },
      { label: "Comparativa de bombas de insulina", href: "bombas-de-insulina.html" }
    ]
  },
  estudios: {
    nombre: "Estudios",
    color: "#7c3aed",
    icono: "🔬",
    descripcion: "Investigación y estudios clínicos que ayudan a entender mejor la diabetes: desde la genética y la microbiota hasta nuevas terapias en fase de ensayo.",
    guiasRelacionadas: []
  },
  dietas: {
    nombre: "Dietas",
    color: "#d97706",
    icono: "🥗",
    descripcion: "Noticias sobre alimentación y diabetes: guías nutricionales, patrones de dieta y su relación con el control de la glucosa y el peso corporal.",
    guiasRelacionadas: [{ label: "Guía práctica de dietas y ejercicio", href: "dietas-y-ejercicio.html" }]
  },
  ejercicio: {
    nombre: "Ejercicio",
    color: "#0d9488",
    icono: "🏃",
    descripcion: "Cómo la actividad física ayuda a prevenir y controlar la diabetes: estudios sobre rutinas de ejercicio, movilidad y su efecto sobre la glucemia.",
    guiasRelacionadas: [{ label: "Guía práctica de dietas y ejercicio", href: "dietas-y-ejercicio.html" }]
  },
  complicaciones: {
    nombre: "Complicaciones",
    color: "#dc2626",
    icono: "⚠️",
    descripcion: "Prevención y manejo de las complicaciones asociadas a la diabetes: retinopatía, neuropatía, nefropatía y riesgo cardiovascular.",
    guiasRelacionadas: []
  }
};

// Permite reutilizar estos datos desde build.js (Node) sin duplicarlos.
if (typeof module !== "undefined") {
  module.exports = { ARTICLES, CATEGORIAS };
}
