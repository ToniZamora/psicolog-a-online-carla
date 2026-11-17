import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/page-intro";

const TARIFAS = [
  {
    ubicacion: "Benisanó, Sagunto y Online",
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

export const Route = createFileRoute("/tarifas")({
  head: () => ({
    meta: [
      { title: "Tarifas de psicología · ConCiencia Psicología" },
      {
        name: "description",
        content:
          "Consulta las tarifas de las sesiones de psicología en Benisanó, Sagunto, Valencia y online.",
      },
      { property: "og:title", content: "Tarifas · ConCiencia Psicología" },
      {
        property: "og:description",
        content: "Precios de las sesiones de psicología en Benisanó, Sagunto, Valencia y online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tarifas,
});

function Tarifas() {
  return (
    <main>
      <PageIntro label="Tarifas" title="Precios claros para cada modalidad">
        <p>Estas son las tarifas de las sesiones de psicología según la ubicación o modalidad.</p>
      </PageIntro>
      <section className="pb-20 md:pb-28">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-2">
          {TARIFAS.map(({ ubicacion, precios }) => (
            <article
              key={ubicacion}
              className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-9"
            >
              <h2 className="font-display text-2xl font-semibold text-primary">{ubicacion}</h2>
              <dl className="mt-6 divide-y divide-border border-y border-border">
                {precios.map(({ concepto, precio }) => (
                  <div key={concepto} className="flex items-center justify-between gap-4 py-5">
                    <dt className="text-muted-foreground">{concepto}</dt>
                    <dd className="font-display text-2xl font-semibold">{precio}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
        <div className="mt-10 px-6 text-center">
          <Link
            to="/reservar"
            className="inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Reservar una cita
          </Link>
        </div>
      </section>
    </main>
  );
}
