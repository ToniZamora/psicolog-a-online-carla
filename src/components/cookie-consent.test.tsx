import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { CookieConsentProvider } from "@/components/cookie-consent";
import { ConsultationMap } from "@/components/consultation-map";

const storage = new Map<string, string>();
const localStorageMock: Storage = {
  get length() {
    return storage.size;
  },
  clear: () => storage.clear(),
  getItem: (key) => storage.get(key) ?? null,
  key: (index) => [...storage.keys()][index] ?? null,
  removeItem: (key) => storage.delete(key),
  setItem: (key, value) => storage.set(key, value),
};

beforeEach(() => {
  storage.clear();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: localStorageMock,
  });
});

describe("Cookie consent", () => {
  it("loads the Google map only after optional services are accepted", async () => {
    render(
      <CookieConsentProvider>
        <ConsultationMap />
      </CookieConsentProvider>,
    );

    expect(await screen.findByRole("region", { name: "Aviso de cookies" })).toBeInTheDocument();
    expect(
      screen.queryByTitle("Mapa de Gema Almela Psicología en Benisanó"),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Aceptar servicios externos" }));

    expect(screen.getByTitle("Mapa de Gema Almela Psicología en Benisanó")).toBeInTheDocument();
  });

  it("keeps the Google map blocked when optional services are rejected", async () => {
    render(
      <CookieConsentProvider>
        <ConsultationMap />
      </CookieConsentProvider>,
    );

    expect(await screen.findByRole("region", { name: "Aviso de cookies" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Solo necesarias" }));

    expect(
      screen.queryByTitle("Mapa de Gema Almela Psicología en Benisanó"),
    ).not.toBeInTheDocument();
  });
});
