import { useState } from "react";
import { ArrowUpRight, MapPin, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CookiePreferencesButton } from "@/components/cookie-consent";
import { useExternalServicesConsent } from "@/components/cookie-consent-context";

const locations = [
  {
    name: "Benisanó",
    clinic: "Gema Almela Psicología",
    query: "Gema Almela Psicología, Benisanó, Valencia, España",
    placeId: "ChIJNyTvfmALB6oR_D4LMRSE7ds",
  },
  {
    name: "Sagunto",
    clinic: "Clínica Donet y Luque",
    query: "Donet y Luque Sagunt",
    placeId: "ChIJxzStSgAVYA0Reu5salMUYFk",
  },
  {
    name: "Valencia",
    clinic: "Etheria · Psicología Integrativa",
    query: "Etheria Psicología Integrativa, Valencia, España",
    placeId: "ChIJRagZKAg0ZkoRRFrWiFzf9L0",
  },
];

export function ConsultationMap() {
  const [selected, setSelected] = useState(0);
  const allowExternalServices = useExternalServicesConsent();
  const location = locations[selected] ?? locations[0];
  if (!location) return null;

  return (
    <section
      className="border-t border-border bg-secondary/50 py-16 md:py-20"
      aria-labelledby="consultas-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase text-primary">Ubicaciones</p>
            <h2
              id="consultas-title"
              className="mt-4 font-display text-3xl leading-tight md:text-4xl"
            >
              Más cerca de ti.
            </h2>
            <p className="mt-5 text-left xl:text-justify leading-relaxed text-muted-foreground">
              Atención presencial en Benisanó, Sagunto y Valencia, y sesiones online desde donde
              estés.
            </p>
            <div className="mt-8 divide-y divide-border border-y border-border">
              <div className="flex items-center gap-3 py-5">
                <Video className="text-primary" />
                <span>Online</span>
              </div>
              {locations.map((place) => (
                <Button
                  key={place.name}
                  asChild
                  variant="ghost"
                  className="h-auto w-full justify-between rounded-none px-0 py-5 hover:bg-transparent"
                >
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}&query_place_id=${place.placeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${place.clinic} en ${place.name} en Google Maps`}
                  >
                    <span className="flex items-center gap-3">
                      <MapPin className="text-primary" />
                      {place.name}
                    </span>
                    <ArrowUpRight className="text-primary" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 flex gap-2" aria-label="Localidad del mapa">
              {locations.map((place, i) => (
                <Button
                  key={place.name}
                  size="sm"
                  variant={selected === i ? "default" : "outline"}
                  aria-pressed={selected === i}
                  onClick={() => setSelected(i)}
                >
                  {place.name}
                </Button>
              ))}
            </div>
            <div className="relative h-80 overflow-hidden rounded-md border border-border bg-muted md:h-96">
              {allowExternalServices ? (
                <iframe
                  title={`Mapa de ${location.clinic} en ${location.name}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(location.query)}&z=16&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="max-w-sm text-sm text-muted-foreground">
                    El mapa de Google solo se carga si aceptas los servicios externos opcionales.
                  </p>
                  <CookiePreferencesButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
