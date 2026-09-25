export const CONTACT = {
  email: "aida.gallegos@pragassi.com",
  phone: "+52 55 4659 1720",
  phoneHref: "tel:+525546591720",
  whatsappNumber: "525546591720",
  facebook: "https://www.facebook.com/Pragassi/",
  instagram: "https://www.instagram.com/pragassi",
  privacy: "https://pragassi.com/privacy-policy",
};

export const whatsappLink = (text: string) =>
  `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`;

export const STATS = [
  { value: 15, prefix: "", suffix: " años", label: "De operación continua en México, con historial verificable en el sector seguridad privada." },
  { value: 500, prefix: "+", suffix: "", label: "Empresas atendidas con estudios socioeconómicos y procesos de contratación auditados." },
  { value: 7, prefix: "", suffix: " estudios", label: "Tipos de verificación: laboral, crediticio, escolar, telefónico, socioeconómico y más." },
  { value: null, text: "Nacional", prefix: "", suffix: "", label: "Cobertura nacional sin subcontratar etapas críticas del proceso de verificación." },
];

export const CLIENTS = ["Grupo GSI", "Cometra", "Seguritec", "Tecnoval", "Seguridad Robri"];

export const PLANS = [
  {
    name: "Básicos",
    kicker: "Estudio socioeconómico",
    description: "Información esencial para procesos de selección y confianza.",
    price: "$580",
    features: ["Verificación de datos generales", "Verificación telefónica", "Entorno habitacional", "Referencias personales y vecinales", "Informe ejecutivo"],
    cta: "Solicitar estudio básico",
    message: "Hola Pragassi, me interesa el Estudio Socioeconómico Básico (desde $580 MXN).",
  },
  {
    name: "Presenciales",
    kicker: "Estudio socioeconómico",
    description: "Evaluación completa con visita domiciliaria y análisis detallado.",
    price: "$850",
    features: ["Visita domiciliaria", "Entrevista a referencias", "Análisis socioeconómico detallado", "Informe completo y confiable"],
    cta: "Solicitar estudio presencial",
    message: "Hola Pragassi, me interesa el Estudio Socioeconómico Presencial (desde $850 MXN).",
    featured: true,
    tag: "Con visita domiciliaria",
  },
  {
    name: "Especializados",
    kicker: "Investigación",
    description: "Investigaciones específicas para casos que requieren mayor profundidad.",
    price: null,
    features: ["Investigaciones a profundidad", "Verificación de antecedentes", "Reporte personalizado", "Información 100% confidencial"],
    cta: "Cotizar estudio",
    message: "Hola Pragassi, quiero cotizar un Estudio Especializado.",
  },
];

export const GUARANTEES = [
  "Información 100% confidencial",
  "Entregas rápidas y puntuales",
  "Personal capacitado y profesional",
  "Calidad y confiabilidad garantizadas",
];

export const STUDY_TYPES = ["Laboral", "Crediticio", "Escolar", "Telefónico", "Socioeconómico", "y más"];

export const SERVICES = [
  {
    id: "antecedentes",
    title: "Estudios Socioeconómicos",
    subtitle: "Siete tipos de estudio integrados",
    body: "Verificación laboral, crediticia, escolar, telefónica y socioeconómica. Procesos sin atajos aplicados a candidatos del sector seguridad y logística, con cobertura nacional y entrega en plazos acordados desde el primer encargo.",
  },
  {
    id: "capacitacion",
    title: "Capacitación Empresarial",
    subtitle: "Formación para el sector seguridad",
    body: "Liderazgo operativo, clima laboral y normatividad legal. Formación orientada a cumplimiento regulatorio, no a talleres genéricos de motivación.",
    newCourse: { title: "Integración de la IA en el trabajo administrativo", body: "Curso práctico para que tu equipo administrativo use la inteligencia artificial en sus tareas diarias." },
  },
  {
    id: "reclutamiento",
    title: "Reclutamiento y Selección",
    subtitle: "Filtros de cumplimiento desde el inicio",
    body: "Perfiles técnicos y operativos para empresas de seguridad privada. Cada candidato pasa por nuestros propios estudios antes de llegar a su mesa.",
  },
];

export const REASONS = [
  {
    title: "Especialización sectorial",
    body: "15 años trabajando con empresas de seguridad privada y logística. Conocemos la normatividad, los riesgos y los perfiles que su operación exige.",
  },
  {
    title: "Plazos pactados contractualmente",
    body: "Los tiempos de entrega quedan escritos en el contrato. No estimaciones ni promesas verbales: fechas que se cumplen sin reducir la profundidad del estudio.",
  },
  {
    title: "Confidencialidad como requisito operativo",
    body: "Los datos de sus candidatos se tratan con los mismos controles que exige la industria. No es un argumento de venta: es la condición mínima para operar en este sector.",
  },
];

export const STEPS = [
  {
    n: "01",
    tag: "Contacto",
    title: "Primer contacto",
    body: "Nos describe su necesidad: tipo de estudio, volumen de candidatos y urgencia. Confirmamos viabilidad y asignamos ejecutivo de cuenta en menos de 24 horas.",
  },
  {
    n: "02",
    tag: "Diagnóstico",
    title: "Diagnóstico de riesgos",
    body: "Revisamos su proceso actual de contratación e identificamos las fisuras específicas: qué estudios faltan, qué datos son insuficientes y dónde está el riesgo real.",
  },
  {
    n: "03",
    tag: "Estudio",
    title: "Ejecución del estudio",
    body: "Ejecutamos los estudios acordados —laborales, crediticios, escolares, telefónicos o socioeconómicos— con cobertura nacional y protocolos de confidencialidad estrictos.",
  },
  {
    n: "04",
    tag: "Entrega",
    title: "Resultados con interpretación",
    body: "Entregamos informe con análisis aplicado: no solo datos, sino una lectura clara de lo que significan para su decisión de contratación. Listo para actuar.",
  },
];

export const TESTIMONIALS = [
  { quote: "Entrega en tiempo, excelente calidad en el servicio.", author: "Seguridad Robri", role: "Cliente del sector seguridad" },
  { quote: "Personas súper profesionales, cumplen con lo pactado y con muy buenos resultados. Los recomiendo cada vez que puedo.", author: "Omar Rodríguez", role: "Cliente" },
];

export const VERIFICA = {
  appUrl: "https://verifica.pragassi.com/app.php",
  steps: [
    { title: "Creas la invitación", body: "Registras al candidato y el puesto. Verifica genera un enlace privado." },
    { title: "El candidato responde", body: "Acepta el aviso de privacidad y contesta 35 situaciones laborales, desde su celular o computadora." },
    { title: "Recibes el reporte", body: "Un índice de 1 a 10, seis áreas de análisis y las señales a validar. Listo para imprimir o guardar en PDF." },
    { title: "Decides con contexto", body: "Lo combinas con la entrevista y las referencias. La decisión final siempre es tuya." },
  ],
  areas: [
    { name: "Responsabilidad y cumplimiento", score: 8.6 },
    { name: "Apego a procedimientos", score: 7.9 },
    { name: "Manejo de recursos", score: 8.4 },
    { name: "Confidencialidad", score: 8.7 },
    { name: "Criterio bajo presión", score: 7.5 },
    { name: "Manejo de errores", score: 8.3 },
  ],
  features: [
    { title: "Índice general", body: "Calificación de 1 a 10 con clasificación clara." },
    { title: "Seis áreas", body: "Responsabilidad, procedimientos, recursos, confidencialidad, criterio y errores." },
    { title: "Señales a validar", body: "Puntos específicos para preguntar en la entrevista." },
    { title: "Reporte imprimible", body: "Con la fecha de aceptación del aviso de privacidad." },
  ],
  trust: [
    { title: "Consentimiento informado", body: "Aviso de privacidad de tu empresa aceptado antes de responder." },
    { title: "Datos separados", body: "Cada empresa ve solo a sus propios candidatos." },
    { title: "Apoyo, no veredicto", body: "No decide por ti ni sustituye a la entrevista." },
    { title: "Sin datos sensibles", body: "No pide salud, religión, origen ni preferencias." },
  ],
  idealFor: ["Tiendas y retail", "Logística y almacenes", "Restaurantes", "Seguridad privada", "PyMEs con alta rotación"],
  plans: [
    {
      name: "Test individual",
      price: "$400",
      unit: "por candidato",
      description: "Evalúa a un candidato puntual antes de la entrevista.",
      features: ["35 situaciones laborales reales", "Respuesta en 10 minutos desde un enlace", "Reporte con índice y seis áreas", "Señales a validar en la entrevista"],
      cta: "Solicitar un test",
      message: "Hola Pragassi, me interesa el test de confianza Verifica (desde $400 MXN).",
    },
    {
      name: "Paquetes mensuales",
      price: "$750",
      unit: "al mes",
      description: "Para empresas que contratan de forma continua, con paquetes para diferentes puestos: operativos, comerciales y más.",
      features: ["Evaluaciones para distintos puestos", "Ideal para alta rotación", "Espacio de trabajo para tu empresa", "Reportes listos para imprimir o PDF"],
      cta: "Cotizar paquete mensual",
      message: "Hola Pragassi, me interesan los paquetes mensuales de Verifica (desde $750 MXN).",
      featured: true,
    },
  ],
};