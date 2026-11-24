import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Una página por ámbito de intervención: src/content/ambitos/<id>.md
// El nombre del fichero debe coincidir con el `id` de SERVICIOS en src/data/site.ts.
const ambitos = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/ambitos" }),
  schema: z.object({
    /** Título visible (h1). */
    titulo: z.string(),
    /** <title> para Google: máx. ~60 caracteres. */
    seoTitulo: z.string().max(65),
    /** Descripción para Google: 120–160 caracteres. */
    descripcion: z.string().min(80).max(170),
    /** Solo se publica cuando Carla lo ha revisado. En `pnpm dev` se ven también los borradores. */
    publicado: z.boolean().default(false),
    /** Preguntas frecuentes propias del ámbito (se muestran y van a los datos estructurados). */
    preguntas: z.array(z.object({ p: z.string(), r: z.string() })).default([]),
  }),
});

export const collections = { ambitos };
