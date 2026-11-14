import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { GmailButton, WhatsAppButton } from "@/components/site-contact";

// Completa estos datos cuando tengas la información definitiva.
const DATOS_CONTACTO = {
  correo: "carlatupsico@gmail.com",
  telefono: "(+34 633 866 952)",
  horario: "Lunes a viernes, de 9:00 a 14:00 y de 16:00 a 20:00",
  direcciones: "Online, Benisanó, Sagunto y Valencia",
};

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto · ConCiencia Psicología" },
      {
        name: "description",
        content:
          "Contacta con ConCiencia Psicología por correo o WhatsApp. Atención online y presencial en Benisanó, Sagunto y Valencia.",
      },
      { property: "og:title", content: "Contacto · ConCiencia Psicología" },
      {
        property: "og:description",
        content:
          "Un primer contacto cercano y sin compromiso, por el medio con el que te sientas más a gusto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contacto,
});

function Contacto() {
  const detalles = [
    { icono: Mail, titulo: "Correo electrónico", valor: DATOS_CONTACTO.correo },
    { icono: Phone, titulo: "Teléfono", valor: DATOS_CONTACTO.telefono },
    { icono: Clock, titulo: "Horario de atención", valor: DATOS_CONTACTO.horario },
    { icono: MapPin, titulo: "Direcciones de consulta", valor: DATOS_CONTACTO.direcciones },
  ];

  return (
    <main>
      <PageIntro label="Contacto" title="Un espacio para hablar contigo">
        <p>
          Si quieres consultar tus dudas o dar un primer paso, puedes escribirme por el medio con el
          que te sientas más a gusto.
        </p>
      </PageIntro>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <dl className="grid gap-x-14 sm:grid-cols-2">
            {detalles.map(({ icono: Icon, titulo, valor }) => (
              <div key={titulo} className="border-b border-border py-8">
                <dt className="flex items-center gap-3 font-display text-xl text-primary">
                  <Icon className="size-5 shrink-0" strokeWidth={1.5} />
                  {titulo}
                </dt>
                <dd className="mt-4 break-words leading-relaxed text-muted-foreground">
                  {valor || "Pendiente de completar"}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-center leading-relaxed text-muted-foreground">
            Atención online y presencial en Benisanó, Sagunto y Valencia.
          </p>
        </div>
      </section>
      <section className="border-t border-border bg-secondary py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl text-foreground">¿Hablamos?</h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-foreground">
            No necesitas tenerlo todo claro para contactar conmigo. Si prefieres no utilizar tu
            número personal de WhatsApp, puedes escribirme por correo.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <WhatsAppButton />
            <GmailButton />
          </div>
        </div>
      </section>
    </main>
  );
}
