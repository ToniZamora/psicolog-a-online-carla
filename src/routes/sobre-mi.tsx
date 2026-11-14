import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { Button } from "@/components/ui/button";

// ============================================================
// ✏️ EDITA AQUÍ — Textos de «Sobre mí»
// ============================================================
const PARRAFOS = [
  "Soy Carla. Me considero una persona cálida y cercana, con una gran sensibilidad para comprender y empatizar con los demás. Escuchar y ayudar, en la medida de mis posibilidades, siempre ha formado parte de mi manera de relacionarme con las personas.",
  "En consulta, esa forma de ser se traduce en una escucha atenta y en el deseo de que puedas sentirte a gusto, sin juicios y sin tener que encontrar las palabras perfectas. Me importa conocer tu historia, respetar tus tiempos y acompañarte desde la cercanía y el cuidado.",
  "Fuera de la consulta, disfruto leyendo y estando en contacto con la naturaleza. Me gusta compartir tiempo con mi familia y mis amigos, pero también reservar momentos para estar sola, cuidarme y volver a conectar conmigo.",
  "También me encanta viajar y descubrir lugares nuevos, aunque en los viajes suelo echar de menos mi rutina y mi casa: esa zona segura a la que siempre me gusta volver. Encuentro bienestar tanto en explorar lo desconocido como en disfrutar de las pequeñas cosas de cada día.",
  "Creo que esa combinación de curiosidad, sensibilidad y cuidado está presente en mi forma de acompañar: con interés genuino por cada persona y por aquello que necesita en su momento vital.",
];

export const Route = createFileRoute("/sobre-mi")({
  head: () => ({
    meta: [
      { title: "Sobre mí · ConCiencia Psicología" },
      {
        name: "description",
        content:
          "Conoce a Carla Castellano Ayuso, psicóloga de ConCiencia Psicología en Benisanó, Sagunto, Valencia y online.",
      },
      { property: "og:title", content: "Sobre mí · ConCiencia Psicología" },
      {
        property: "og:description",
        content: "Conoce a la psicóloga detrás de ConCiencia Psicología.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SobreMi,
});

function SobreMi() {
  return (
    <main>
      <PageIntro label="Sobre mí" title="Carla Castellano Ayuso">
        <p>Psicóloga</p>
      </PageIntro>
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <figure className="mb-10 overflow-hidden rounded-md border border-border">
            <img
              src="/carla_naturaleza.jpg"
              alt="Carla disfrutando de un paseo en la montaña, rodeada de árboles"
              width={1024}
              height={768}
              className="aspect-[4/3] w-full object-cover"
            />
          </figure>
          {PARRAFOS.map((texto, i) => (
            <p
              key={i}
              className={`${i ? "mt-5 " : ""}text-left md:text-justify leading-relaxed text-muted-foreground`}
            >
              {texto}
            </p>
          ))}
          <Button asChild variant="link" className="mt-10 px-0">
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
