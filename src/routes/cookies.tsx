import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/page-intro";
import { CookiePreferencesButton } from "@/components/cookie-consent";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Política de cookies · ConCiencia Psicología" },
      {
        name: "description",
        content:
          "Información sobre las cookies técnicas, el mapa de Google y cómo cambiar las preferencias en ConCiencia Psicología.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Cookies,
});

function Cookies() {
  return (
    <main>
      <PageIntro label="Privacidad" title="Política de cookies">
        <p>
          Esta información explica qué almacenamiento utiliza la web y cómo puedes elegir si cargar
          servicios externos.
        </p>
      </PageIntro>
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl space-y-8 px-6 leading-relaxed text-muted-foreground">
          <article>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Almacenamiento técnico
            </h2>
            <p className="mt-3">
              El panel privado puede utilizar una cookie técnica para recordar el estado de su menú.
              La elección de preferencias de esta página se guarda en el almacenamiento local del
              navegador. No usamos estas tecnologías para publicidad ni analítica.
            </p>
          </article>
          <article>
            <h2 className="font-display text-2xl font-semibold text-foreground">Google Maps</h2>
            <p className="mt-3">
              El mapa incrustado de Google permanece desactivado hasta que aceptes los servicios
              externos opcionales. Si los aceptas, Google puede recibir datos de navegación y
              aplicar sus propias tecnologías según su política de privacidad.
            </p>
            <a
              href="https://policies.google.com/privacy?hl=es"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-medium text-primary underline underline-offset-4"
            >
              Política de privacidad de Google
            </a>
          </article>
          <article>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Cambiar tu elección
            </h2>
            <p className="mt-3">
              Puedes aceptar o rechazar los servicios externos opcionales y cambiar tu decisión
              cuando quieras desde el pie de página.
            </p>
            <div className="mt-3 text-primary">
              <CookiePreferencesButton />
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
