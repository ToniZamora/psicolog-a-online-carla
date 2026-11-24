// Preferencia sobre servicios externos opcionales (hoy, solo el mapa de Google).
// Se guarda en localStorage del navegador; no se envía a ningún servidor.

export type Consent = "accepted" | "rejected";

const KEY = "conciencia-cookie-preference";
export const CONSENT_EVENT = "conciencia:consent";

export function getConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Consent) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    /* almacenamiento bloqueado: la elección dura solo esta visita */
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: value }));
}

export function onConsentChange(cb: (value: Consent) => void) {
  window.addEventListener(CONSENT_EVENT, (e) => cb((e as CustomEvent<Consent>).detail));
}

