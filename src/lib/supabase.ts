import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

/**
 * Cliente de Supabase con la clave publishable. Todo lo que puede hacer está limitado por
 * las políticas RLS y las funciones de `supabase/migrations`.
 * `persistSession` solo importa en el panel: las visitas nunca inician sesión.
 */
export function supabase(): SupabaseClient {
  if (!client) {
    const url = import.meta.env.PUBLIC_SUPABASE_URL;
    const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error("Faltan PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    client = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    });
  }
  return client;
}

// Mensajes que lanzan nuestras funciones SQL a propósito. Cualquier otro error se muestra
// con un texto genérico para no enseñar detalles técnicos.
const MENSAJES_CONOCIDOS = [
  "Nombre no válido",
  "Email no válido",
  "Teléfono no válido",
  "Este horario ya no está disponible",
  "Ese horario ya no está disponible",
  "No se puede cancelar esta cita",
  "No se puede cambiar esta cita",
  "Ya tienes citas pendientes",
  "Ahora mismo hay muchas reservas",
];

export function mensajeError(error: { message?: string } | null | undefined): string {
  const msg = error?.message ?? "";
  const conocido = MENSAJES_CONOCIDOS.find((m) => msg.startsWith(m));
  return conocido ? msg : "Algo no ha ido bien. Inténtalo de nuevo o escríbeme por WhatsApp.";
}
