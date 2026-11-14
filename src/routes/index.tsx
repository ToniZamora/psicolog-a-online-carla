import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Heart,
  Brain,
  Users,
  Puzzle,
  Sprout,
  HandHeart,
  Fingerprint,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GmailButton, WhatsAppButton } from "@/components/site-contact";
import { ConsultationMap } from "@/components/consultation-map";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ConCiencia Psicología · Terapia integrativa en Benisanó, Sagunto y Valencia" },
      {
        name: "description",
        content:
          "ConCiencia Psicología: un espacio de escucha y terapia integrativa centrado en tus necesidades. Atención presencial en Benisanó, Sagunto y Valencia, y online.",
      },
      { property: "og:title", content: "ConCiencia Psicología · Un espacio para escucharte" },
      {
        property: "og:description",
        content:
          "Acompañamiento psicológico cercano y sin juicios, adaptado a tu historia, tus necesidades y tu momento vital.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

export const servicios = [
  {
    icono: Heart,
    titulo: "Ansiedad, depresión y otros problemas emocionales",
    texto:
      "Un espacio para comprender lo que sientes y desarrollar recursos para afrontar el malestar emocional.",
  },
  {
    icono: Brain,
    titulo: "Estimulación cognitiva",
    texto:
      "Trabajo adaptado a tus necesidades para estimular la memoria, la atención y otras capacidades cognitivas.",
  },
  {
    icono: Puzzle,
    titulo: "Solución de problemas",
    texto:
      "Exploramos alternativas y herramientas para tomar decisiones y afrontar las dificultades de tu día a día.",
  },
  {
    icono: Sprout,
    titulo: "Psicología infantojuvenil",
    texto:
      "Tratamiento y acompañamiento a niños y adolescentes, atendiendo a su etapa de desarrollo y a su contexto personal y familiar. Se realizan evaluaciones psicológicas.",
  },
  {
    icono: Users,
    titulo: "Relaciones personales",
    texto:
      "Un espacio para explorar tus vínculos, cuidar la comunicación y establecer límites saludables.",
  },
  {
    icono: HandHeart,
    titulo: "Acompañamiento en enfermedades graves",
    texto:
      "Apoyo psicológico para transitar el impacto emocional, la incertidumbre y los cambios que puede traer una enfermedad grave.",
  },
  {
    icono: Fingerprint,
    titulo: "Trauma",
    texto:
      "Acompañamiento respetuoso para abordar experiencias difíciles, cuidando tus tiempos y tu sensación de seguridad.",
  },
  {
    icono: Heart,
    titulo: "Autoestima y crecimiento",
    texto:
      "Un proceso de autoconocimiento para cuidar la relación contigo, reconocer tus recursos y construir confianza.",
  },
  {
    icono: ShieldCheck,
    titulo: "Autoexigencias y perfeccionismo",
    texto:
      "Un espacio para comprender la presión que te impones, flexibilizar tus expectativas y construir una relación más amable contigo, sin que todo tenga que ser perfecto.",
  },
];

function Index() {
  return (
    <main>
      <section className="brand-hero border-b border-border" aria-labelledby="inicio-title">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <div className="grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
            <div>
              <h1
                id="inicio-title"
                className="fade-up-delay-1 text-center font-display text-5xl font-normal leading-tight text-primary sm:text-6xl"
              >
                ConCiencia
              </h1>
              <p className="fade-up-delay-2 mt-5 text-center font-display text-2xl italic leading-snug">
                &quot;Un lugar donde encontrar apoyo para comprenderte y avanzar hacia aquello que
                necesitas&quot;.
              </p>
              <div className="fade-up-delay-2 mt-8 border-t border-border pt-7">
                <p className="text-left lg:text-justify leading-relaxed text-foreground">
                  En ConCiencia Psicología encontrarás un espacio de confianza, cercano y acogedor,
                  donde poder hablar de lo que te preocupa y abordar tus dificultades con respeto,
                  comprensión y sin juicios.
                </p>
                <p className="mt-4 text-left lg:text-justify leading-relaxed text-muted-foreground">
                  La terapia es una oportunidad para comprender mejor lo que estás viviendo,
                  identificar qué necesitas y desarrollar herramientas que te permitan afrontar las
                  dificultades de otra manera. A través de un acompañamiento adaptado a cada
                  persona, buscamos favorecer tu bienestar y ayudarte a construir una vida más
                  satisfactoria.
                </p>
              </div>
              <div className="fade-up-delay-3 mt-8 flex flex-wrap gap-3">
                <Button asChild className="h-auto px-5 py-3">
                  <Link to="/" hash="mirada-profesional">
                    Mi mirada profesional
                    <ArrowUpRight />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto px-5 py-3">
                  <Link to="/ambitos">Ámbitos de intervención</Link>
                </Button>
              </div>
            </div>
            <figure className="fade-up-delay-2 mx-auto w-full max-w-xs md:max-w-sm">
              <div className="portrait-frame overflow-hidden rounded-t-full rounded-b-md border border-border bg-secondary p-2">
                <img
                  src="/carla.jpg"
                  alt="Carla Castellano Ayuso, psicóloga de ConCiencia"
                  width={1440}
                  height={1920}
                  className="aspect-[3/4] w-full rounded-t-full rounded-b-sm object-cover"
                />
              </div>
              <figcaption className="mt-5 text-center text-xs font-semibold uppercase text-muted-foreground">
                Carla Castellano Ayuso · Psicóloga
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section
        id="mirada-profesional"
        className="bg-card py-16 md:py-20"
        aria-labelledby="mirada-title"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-center gap-4">
            <p className="text-xs font-semibold uppercase text-primary">Mi mirada profesional</p>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="mx-auto max-w-3xl">
            <div>
              <h2 id="mirada-title" className="sr-only">
                Mi mirada profesional
              </h2>
              <div>
                <p className="text-left md:text-justify leading-relaxed text-muted-foreground">
                  Entiendo la psicología como un proceso de comprensión y cambio, en el que cada
                  persona necesita encontrar su propio camino.
                </p>
                <p className="mt-4 text-left md:text-justify leading-relaxed text-muted-foreground">
                  Por eso, mi forma de trabajar parte de una mirada integradora, que combina
                  diferentes enfoques y herramientas psicológicas para ofrecer un acompañamiento
                  adaptado a las necesidades, circunstancias y momento vital de cada persona.
                </p>
                <p className="mt-4 text-left md:text-justify leading-relaxed text-muted-foreground">
                  Mis intervenciones se basan principalmente en la terapia cognitivo-conductual, las
                  terapias de tercera generación y sistémica, incorporando también una perspectiva
                  de trauma. Esto me permite tener en cuenta no solo lo que pensamos, sentimos y
                  hacemos, sino también nuestra historia, las experiencias que hemos vivido y el
                  contexto en el que nos desenvolvemos.
                </p>
                <p className="mt-4 text-left md:text-justify leading-relaxed text-muted-foreground">
                  Trabajo desde una base científica, apoyándome en estrategias y herramientas
                  respaldadas por la evidencia. Sin embargo, creo que la psicología va más allá de
                  aplicar técnicas o seguir un protocolo: implica comprender a cada persona en su
                  conjunto, identificar qué necesita y encontrar la manera de acompañarla en su
                  proceso.
                </p>
                <p className="mt-4 text-left md:text-justify leading-relaxed text-muted-foreground">
                  Mi objetivo es ayudarte a comprender lo que estás viviendo, reconocer tus propios
                  recursos y desarrollar nuevas herramientas que te permitan afrontar las
                  dificultades y generar cambios significativos en las diferentes áreas de tu vida.
                </p>
                <Button asChild variant="link" className="mt-4 h-auto px-0 py-2">
                  <Link to="/formacion">
                    Conoce mi formación
                    <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-y border-border bg-accent/30 py-12 md:mt-20 md:py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <span className="mx-auto block h-px w-12 bg-primary" />
            <blockquote className="mt-6 font-display text-2xl italic leading-relaxed md:text-3xl">
              “No tienes que tenerlo todo claro para empezar. Solo necesitas un lugar donde poder
              ser tú.”
            </blockquote>
            <p className="mt-6 text-xs font-semibold uppercase text-muted-foreground">
              Carla Castellano Ayuso
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-6 pt-14 text-center md:pt-16">
          <p className="text-xs font-semibold uppercase text-primary">Un primer encuentro</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">¿Hablamos?</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Escríbeme por WhatsApp o, si prefieres no compartir tu número personal, por correo. Te
            respondo personalmente, sin compromiso.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <WhatsAppButton />
            <GmailButton />
          </div>
        </div>
      </section>
      <ConsultationMap />
    </main>
  );
}
