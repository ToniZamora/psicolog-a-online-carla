// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// En local se lee .env; en GitHub Actions las variables ya vienen del entorno.
try {
  process.loadEnvFile();
} catch {
  /* sin .env */
}
const supabaseUrl = (process.env.PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");

if (!supabaseUrl) {
  throw new Error(
    "Falta PUBLIC_SUPABASE_URL. Copia .env.example a .env y rellena los datos de Supabase.",
  );
}

// Páginas que no deben aparecer en Google ni en el sitemap.
const PRIVADAS = ["/reservar/", "/cita/", "/acceso/", "/panel/", "/404"];

export default defineConfig({
  site: "https://www.concienciapsico.com",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "never" },
  // Sin recursos incrustados como data: (fuentes incluidas), para mantener la CSP estricta.
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [
    icon(),
    sitemap({
      filter: (page) => !PRIVADAS.some((p) => new URL(page).pathname.startsWith(p)),
    }),
  ],
  security: {
    // Astro genera la cabecera CSP (como <meta>) con los hashes de cada script y estilo.
    csp: {
      directives: [
        "default-src 'self'",
        `connect-src 'self' ${supabaseUrl}`,
        "img-src 'self' data:",
        "font-src 'self'",
        "frame-src https://www.google.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
});
