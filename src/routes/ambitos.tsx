import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { servicios } from "./index";
import { PageIntro } from "@/components/page-intro";
import { Button } from "@/components/ui/button";
import { GmailButton, WhatsAppButton } from "@/components/site-contact";

export const Route = createFileRoute("/ambitos")({
  head: () => ({
    meta: [
      { title: "Ámbitos de intervención · ConCiencia Psicología" },
      {
        name: "description",
        content:
          "Terapia integrativa para ansiedad, depresión, trauma, autoestima, relaciones personales, infancia y otras necesidades en ConCiencia Psicología.",
      },
      { property: "og:title", content: "Ámbitos de intervención · ConCiencia Psicología" },
      {
        property: "og:description",
        content:
          "Distintas necesidades, una misma mirada: comprender tu historia y generar cambio adaptándome siempre a ti.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Ambitos,
});

function Ambitos() {
  return (
    <main>
      <PageIntro label="Ámbitos de intervención" title="¿En qué puedo ayudarte?">
        <p>
          Distintas necesidades, una misma mirada: comprender tu historia y generar cambio
          adaptándome siempre a ti.
        </p>
      </PageIntro>
      <section className="py-12 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-x-14 px-6 sm:grid-cols-2">
          {servicios.map(({ icono: Icon, titulo, texto }, i) => (
            <article key={titulo} className="border-b border-border py-8 md:py-10">
              <div className="flex items-center justify-between text-primary">
                <Icon className="size-7" strokeWidth={1.4} />
                <span className="font-display text-sm text-muted-foreground">0{i + 1}</span>
              </div>
              <h2 className="mt-5 font-display text-2xl leading-snug">{titulo}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{texto}</p>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-14 max-w-3xl px-6">
          <div className="rounded-[var(--radius)] border border-border bg-secondary/60 px-7 py-10 text-center md:px-12">
            <p className="font-display text-2xl leading-snug text-foreground md:text-[1.75rem]">
              ¿No tienes claro qué necesitas?
            </p>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-foreground">
              Escríbeme sin compromiso: hablamos de lo que te está pasando y vemos si puedo
              ayudarte. Y si lo tuyo queda fuera de mis competencias, te ayudo a encontrar un
              profesional que sí pueda acompañarte.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <WhatsAppButton />
              <GmailButton />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl px-6">
          <Button asChild variant="link" className="px-0">
            <Link to="/">
              <ArrowLeft />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
