import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  CookieConsentContext,
  useCookieConsentContext,
  type ConsentChoice,
} from "@/components/cookie-consent-context";

const COOKIE_PREFERENCE_KEY = "conciencia-cookie-consent-v1";

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(COOKIE_PREFERENCE_KEY);
      if (saved === "accepted" || saved === "rejected") {
        setChoice(saved);
      } else {
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Could not read the cookie preference from local storage.", error);
      setIsOpen(true);
    } finally {
      setReady(true);
    }
  }, []);

  function choose(nextChoice: ConsentChoice) {
    try {
      window.localStorage.setItem(COOKIE_PREFERENCE_KEY, nextChoice);
    } catch (error) {
      console.error("Could not save the cookie preference to local storage.", error);
      toast.error("No se pudo guardar tu preferencia; se aplicará durante esta visita.");
    }
    setChoice(nextChoice);
    setIsOpen(false);
  }

  const value = {
    allowExternalServices: choice === "accepted",
    openPreferences: () => setIsOpen(true),
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {ready && isOpen && (
        <aside
          role="region"
          aria-label="Aviso de cookies"
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-2xl md:p-6"
        >
          <h2 className="font-display text-xl font-semibold">Tu privacidad importa</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Usamos almacenamiento técnico necesario para el funcionamiento de la web. El mapa de
            Google solo se carga si aceptas los servicios externos opcionales. Puedes rechazarlos y
            seguir usando el sitio.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="/cookies"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              Más información
            </a>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => choose("rejected")}>
                Solo necesarias
              </Button>
              <Button type="button" onClick={() => choose("accepted")}>
                Aceptar servicios externos
              </Button>
            </div>
          </div>
        </aside>
      )}
    </CookieConsentContext.Provider>
  );
}

export function CookiePreferencesButton() {
  const context = useCookieConsentContext();
  return (
    <button
      type="button"
      className="underline underline-offset-4"
      onClick={context.openPreferences}
    >
      Preferencias de cookies
    </button>
  );
}
