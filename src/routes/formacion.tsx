import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ArrowLeft } from "lucide-react";

// ============================================================
// ✏️ EDITA AQUÍ — Formación de Carla
// ============================================================
const FORMACION_ACADEMICA = [
  {
    titulo: "Máster de Especialización en Trauma desde un enfoque integrador. Origen.",
    centro: "",
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

// ============================================================

export const Route = createFileRoute("/formacion")({
  head: () => ({
    meta: [
      { title: "Formación · ConCiencia Psicología" },
      {
        name: "description",
        content:
          "Formación académica de Carla Castellano Ayuso: Psicología General Sanitaria, Psicología Infantojuvenil, especialización en trauma y Grado en Psicología.",
      },
      { property: "og:title", content: "Formación · ConCiencia Psicología" },
      {
        property: "og:description",
        content:
          "Máster en Psicología General Sanitaria, Psicología Infantil y Juvenil y máster de especialización en trauma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Formacion,
});

function Formacion() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Intro */}
      <section className="editorial-intro pt-10 pb-16 md:pt-14 md:pb-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="fade-up flex items-center justify-center gap-3 text-xs font-semibold uppercase text-primary">
            <span className="h-px w-10 bg-primary" />
            Formación
            <span className="h-px w-10 bg-primary" />
          </p>
          <h1 className="fade-up-delay-1 mt-6 font-display text-4xl font-normal leading-tight sm:text-5xl">
            Formación profesional,
            <span className="mt-4 block text-xl italic text-primary sm:text-2xl">
              al servicio de cada persona.
            </span>
          </h1>
          <p className="fade-up-delay-2 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            La psicología se aprende también formándose de forma continua. Esta es la base académica
            con la que trabajo cada día.
          </p>
        </div>
      </section>

      {/* Formación académica */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="border-t border-border">
            {FORMACION_ACADEMICA.map(({ titulo, centro, texto }) => (
              <article key={titulo} className="border-b border-border py-8 md:py-10">
                <div className="flex items-start gap-5">
                  <div className="mt-1 inline-flex shrink-0 text-primary">
                    <GraduationCap className="size-6" strokeWidth={1.4} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-medium leading-snug">{titulo}</h2>
                    {centro && (
                      <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-primary">
                        {centro}
                      </p>
                    )}
                    <p className="mt-3 text-left lg:text-justify leading-relaxed text-muted-foreground">
                      {texto}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Volver */}
      <section className="bg-card py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            <ArrowLeft className="size-4" />
            Volver al inicio
          </Link>
        </div>
      </section>
    </div>
  );
}
