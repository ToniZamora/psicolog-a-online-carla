// ============================================================
// ✏️ Todos los textos y datos editables de la web están aquí.
// ============================================================

export const SITE = {
  nombre: "ConCiencia Psicología",
  url: "https://www.concienciapsico.com",
  descripcion:
    "Carla Castellano, psicóloga sanitaria. Atención presencial en Valencia, Sagunto y Benisanó, además de sesiones online. Terapia integrativa cercana y adaptada a ti.",
};

// SEO: rellena lo que vayas teniendo. Lo vacío no se publica.
export const SEO = {
  // Código de verificación de Google Search Console (meta "google-site-verification").
  googleSiteVerification: "",
  // Perfiles públicos de Carla (Doctoralia, buscador del COPCV, Google Business Profile, Instagram…).
  // Google los usa para relacionar la web con esas fichas.
  perfiles: [] as string[],
};

export const CARLA = {
  nombre: "Carla Castellano Ayuso",
  nombreCorto: "Carla Castellano",
  cargo: "Psicóloga General Sanitaria",
  colegiada: "CV20445",
};

export const CONTACTO = {
  email: "carlatupsico@gmail.com",
  telefono: "+34 746 068 771",
  telefonoEnlace: "+34746068771",
  whatsapp: "34746068771",
  horario: "Lunes a viernes, de 8:00 a 15:00 y de 16:00 a 21:00",
  modalidades: "Online, Benisanó, Sagunto y Valencia",
};

const WHATSAPP_MENSAJE = "Hola, me gustaría pedir una primera cita. ¿Me puedes dar más información?";
export const whatsappUrl = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`;
export const emailUrl = `mailto:${CONTACTO.email}?subject=${encodeURIComponent(
  "Consulta desde la web",
)}&body=${encodeURIComponent("Hola, Carla: me gustaría hacerte una consulta.")}`;

// Datos del titular para el aviso legal y la política de privacidad.
// Deja la cadena vacía si aún no los tienes: la web mostrará «Pendiente de completar».
export const TITULAR = {
  nombre: CARLA.nombre,
  nif: "",
  domicilio: "",
  colegio: "Col·legi Oficial de Psicologia de la Comunitat Valenciana (COPCV)",
  colegiada: CARLA.colegiada,
  titulacion: "Máster en Psicología General Sanitaria (Universidad Europea)",
};

export const NAV = [
  { href: "/", texto: "Inicio" },
  { href: "/sobre-mi/", texto: "Sobre mí" },
  { href: "/ambitos/", texto: "Ámbitos" },
  { href: "/formacion/", texto: "Formación" },
  { href: "/tarifas/", texto: "Tarifas" },
  { href: "/contacto/", texto: "Contacto" },
];

export const SERVICIOS = [
  {
    id: "ansiedad-depresion",
    icono: "lucide:heart",
    titulo: "Ansiedad, depresión y otros problemas emocionales",
    texto:
      "Un espacio para comprender lo que sientes y desarrollar recursos para afrontar el malestar emocional.",
  },
  {
    id: "estimulacion-cognitiva",
    icono: "lucide:brain",
    titulo: "Estimulación cognitiva",
    texto:
      "Trabajo adaptado a tus necesidades para estimular la memoria, la atención y otras capacidades cognitivas.",
  },
  {
    id: "solucion-problemas",
    icono: "lucide:puzzle",
    titulo: "Solución de problemas",
    texto:
      "Exploramos alternativas y herramientas para tomar decisiones y afrontar las dificultades de tu día a día.",
  },
  {
    id: "infantojuvenil",
    icono: "lucide:sprout",
    titulo: "Psicología infantojuvenil",
    texto:
      "Tratamiento y acompañamiento a niños y adolescentes, atendiendo a su etapa de desarrollo y a su contexto personal y familiar. Se realizan evaluaciones psicológicas.",
  },
  {
    id: "relaciones",
    icono: "lucide:users",
    titulo: "Relaciones personales",
    texto:
      "Un espacio para explorar tus vínculos, cuidar la comunicación y establecer límites saludables.",
  },
  {
    id: "enfermedades-graves",
    icono: "lucide:hand-heart",
    titulo: "Acompañamiento en enfermedades graves",
    texto:
      "Apoyo psicológico para transitar el impacto emocional, la incertidumbre y los cambios que puede traer una enfermedad grave.",
  },
  {
    id: "trauma",
    icono: "lucide:fingerprint",
    titulo: "Trauma",
    texto:
      "Acompañamiento respetuoso para abordar experiencias difíciles, cuidando tus tiempos y tu sensación de seguridad.",
  },
  {
    id: "autoestima",
    icono: "lucide:flower-2",
    titulo: "Autoestima y crecimiento",
    texto:
      "Un proceso de autoconocimiento para cuidar la relación contigo, reconocer tus recursos y construir confianza.",
  },
  {
    id: "perfeccionismo",
    icono: "lucide:shield-check",
    titulo: "Autoexigencias y perfeccionismo",
    texto:
      "Un espacio para comprender la presión que te impones, flexibilizar tus expectativas y construir una relación más amable contigo, sin que todo tenga que ser perfecto.",
  },
];

export const FORMACION = [
  {
    titulo: "Máster de Especialización en Trauma desde un enfoque integrador",
    centro: "Origen",
    texto:
      "Formación especializada en la comprensión y el abordaje del trauma, desde una perspectiva integradora y respetuosa con los tiempos de cada persona.",
  },
  {
    titulo: "Máster en Psicología General Sanitaria",
    centro: "Universidad Europea",
    texto: "Formación sanitaria habilitante para el ejercicio de la psicología clínica.",
  },
  {
    titulo: "Máster en Psicología Infantil y Juvenil",
    centro: "Universidad Europea",
    texto:
      "Especialización en la evaluación e intervención psicológica con niños, niñas y adolescentes.",
  },
  {
    titulo: "Grado en Psicología",
    centro: "Universidad Camilo José Cela · Mención educativa",
    texto:
      "Base científica y profesional de la psicología, con formación específica en el ámbito educativo.",
  },
];

export const TARIFAS = [
  {
    ubicacion: "Benisanó, Sagunto y online",
    precios: [
      { concepto: "Primera sesión", precio: "70 €" },
      { concepto: "Sesiones siguientes", precio: "60 €" },
    ],
  },
  {
    ubicacion: "Valencia",
    precios: [{ concepto: "Todas las sesiones", precio: "70 €" }],
  },
];

export const UBICACIONES = [
  {
    slug: "psicologa-benisano",
    nombre: "Benisanó",
    tarifa: 0,
    centro: "Gema Almela Psicología",
    query: "Gema Almela Psicología, Benisanó, Valencia, España",
    placeId: "ChIJNyTvfmALB6oR_D4LMRSE7ds",
  },
  {
    slug: "psicologa-sagunto",
    nombre: "Sagunto",
    tarifa: 0,
    centro: "Clínica Donet y Luque",
    query: "Donet y Luque Sagunt",
    placeId: "ChIJxzStSgAVYA0Reu5salMUYFk",
  },
  {
    slug: "psicologa-valencia",
    nombre: "Valencia",
    tarifa: 1,
    centro: "Etheria · Psicología Integrativa",
    query: "Etheria Psicología Integrativa, Valencia, España",
    placeId: "ChIJRagZKAg0ZkoRRFrWiFzf9L0",
  },
];

// Índice de TARIFAS que aplica en cada sitio (0 = Benisanó, Sagunto y online; 1 = Valencia).
export const ONLINE = { slug: "psicologia-online", nombre: "Online", tarifa: 0 };

export const PREGUNTAS = [
  {
    p: "¿Cuánto dura una sesión?",
    r: "Cada sesión dura 50 minutos.",
  },
  {
    p: "¿Cuánto cuesta una sesión de psicología?",
    r: "En Benisanó, Sagunto y online, la primera sesión cuesta 70 € y las siguientes 60 €. En Valencia, todas las sesiones cuestan 70 €.",
  },
  {
    p: "¿Dónde pasas consulta?",
    r: "Atiendo de forma presencial en Benisanó (Gema Almela Psicología), Sagunto (Clínica Donet y Luque) y Valencia (Etheria · Psicología Integrativa), y también hago sesiones online.",
  },
  {
    p: "¿Haces terapia online?",
    r: "Sí. Las sesiones online tienen la misma duración y tarifa que las presenciales en Benisanó y Sagunto, y puedes hacerlas desde donde estés.",
  },
  {
    p: "¿Atiendes a niños y adolescentes?",
    r: "Sí. Trabajo en psicología infantojuvenil, teniendo en cuenta la etapa de desarrollo y el contexto personal y familiar, y también realizo evaluaciones psicológicas. Tengo un Máster en Psicología Infantil y Juvenil.",
  },
  {
    p: "¿Qué enfoque terapéutico utilizas?",
    r: "Trabajo desde una mirada integradora basada en la evidencia: principalmente terapia cognitivo-conductual, terapias de tercera generación y sistémica, con perspectiva de trauma.",
  },
  {
    p: "¿Cómo pido una primera cita?",
    r: "Escríbeme por WhatsApp o por correo electrónico y te respondo personalmente, sin compromiso. Atiendo mensajes de lunes a viernes, de 8:00 a 15:00 y de 16:00 a 21:00.",
  },
  {
    p: "¿Estás colegiada?",
    r: "Sí. Soy Psicóloga General Sanitaria, colegiada en el Col·legi Oficial de Psicologia de la Comunitat Valenciana con el número CV20445.",
  },
  {
    p: "¿Y si lo que me pasa no es de tu ámbito?",
    r: "Escríbeme igualmente. Si lo que necesitas queda fuera de mis competencias, te ayudo a encontrar un profesional que sí pueda acompañarte.",
  },
  {
    p: "¿Lo que cuente en consulta es confidencial?",
    r: "Sí. Todo lo que compartes en consulta está protegido por el secreto profesional y la normativa de protección de datos sanitarios.",
  },
];

export const mapsSearchUrl = (u: (typeof UBICACIONES)[number]) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(u.query)}&query_place_id=${u.placeId}`;
export const mapsEmbedUrl = (u: (typeof UBICACIONES)[number]) =>
  `https://www.google.com/maps?q=${encodeURIComponent(u.query)}&z=16&output=embed`;
