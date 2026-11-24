// Datos estructurados (schema.org) compartidos entre páginas.
import { CARLA, CONTACTO, SEO, SERVICIOS, SITE, UBICACIONES } from "../data/site";

export const ID_CARLA = `${SITE.url}/#carla`;
export const ID_CONSULTA = `${SITE.url}/#consulta`;

export function personaCarla() {
  return {
    "@type": "Person",
    "@id": ID_CARLA,
    name: CARLA.nombre,
    jobTitle: CARLA.cargo,
    url: `${SITE.url}/sobre-mi/`,
    image: `${SITE.url}/og.jpg`,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Número de colegiación profesional (COPCV)",
      value: CARLA.colegiada,
    },
    knowsLanguage: "es",
    worksFor: { "@id": ID_CONSULTA },
    ...(SEO.perfiles.length ? { sameAs: SEO.perfiles } : {}),
  };
}

export function consulta() {
  const franjas = [
    ["08:00", "15:00"],
    ["16:00", "21:00"],
  ];
  return {
    "@type": ["ProfessionalService", "MedicalBusiness"],
    "@id": ID_CONSULTA,
    name: SITE.nombre,
    description: SITE.descripcion,
    url: `${SITE.url}/`,
    image: `${SITE.url}/og.jpg`,
    email: CONTACTO.email,
    telephone: CONTACTO.telefonoEnlace,
    priceRange: "60 € – 70 €",
    currenciesAccepted: "EUR",
    founder: { "@id": ID_CARLA },
    areaServed: UBICACIONES.map((u) => ({ "@type": "City", name: u.nombre })),
    availableService: SERVICIOS.map((s) => ({
      "@type": "MedicalTherapy",
      name: s.titulo,
      url: `${SITE.url}/ambitos/#${s.id}`,
    })),
    openingHoursSpecification: franjas.map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens,
      closes,
    })),
    ...(SEO.perfiles.length ? { sameAs: SEO.perfiles } : {}),
  };
}

export function migasDePan(migas: { nombre: string; href: string }[]) {
  const todas = [{ nombre: "Inicio", href: "/" }, ...migas];
  return {
    "@type": "BreadcrumbList",
    itemListElement: todas.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nombre,
      item: new URL(m.href, SITE.url).href,
    })),
  };
}

export function preguntasFrecuentes(preguntas: { p: string; r: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: preguntas.map(({ p, r }) => ({
      "@type": "Question",
      name: p,
      acceptedAnswer: { "@type": "Answer", text: r },
    })),
  };
}

export const grafo = (...nodos: object[]) => ({ "@context": "https://schema.org", "@graph": nodos });
