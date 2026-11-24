import { getCollection } from "astro:content";

/** Ámbitos con página propia: los publicados y, en `pnpm dev`, también los borradores. */
export async function ambitosVisibles() {
  return getCollection("ambitos", (e) => e.data.publicado || import.meta.env.DEV);
}
