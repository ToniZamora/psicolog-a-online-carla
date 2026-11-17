import { createContext, useContext } from "react";

export type ConsentChoice = "accepted" | "rejected";

export type CookieConsentContextValue = {
  allowExternalServices: boolean;
  openPreferences: () => void;
};

export const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function useCookieConsentContext() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("Cookie consent components must be used within CookieConsentProvider.");
  }
  return context;
}

export function useExternalServicesConsent() {
  return useCookieConsentContext().allowExternalServices;
}
