# ConCiencia Psicología

Web de Carla Castellano, psicóloga sanitaria. Hecha con [Astro](https://astro.build): genera HTML
estático, se publica en GitHub Pages y usa Supabase para las reservas y el panel privado.

## Desarrollo

Requiere Node.js 22.23 o superior y pnpm.

```sh
cp .env.example .env   # y rellena los datos públicos de Supabase
pnpm install
pnpm dev               # http://localhost:4321
pnpm check             # comprobación de tipos
pnpm build             # genera dist/
```

## Dónde se edita cada cosa

| Qué | Dónde |
| --- | --- |
| Contacto, ámbitos, formación, tarifas, ubicaciones | `src/data/site.ts` |
| Datos del titular para el aviso legal (NIF y domicilio opcionales) | `TITULAR` en `src/data/site.ts` |
| Textos de «Sobre mí» | `src/pages/sobre-mi.astro` |
| Colores y tipografía | `src/styles/global.css` |
| Fotos | `src/assets/` (Astro genera versiones AVIF/WebP) |
| Imagen para redes sociales | `pnpm og-image` → `public/og.jpg` |

## Páginas

- Públicas: `/`, `/sobre-mi/`, `/ambitos/`, `/formacion/`, `/tarifas/`, `/contacto/`,
  `/aviso-legal/`, `/privacidad/`, `/cookies/`.
- Reserva: `/reservar/` (no está enlazada en el menú, igual que en la web anterior).
- Gestión de cita: `/cita/#<token>`. Los enlaces antiguos `/cita/<token>` se redirigen solos.
- Privadas: `/acceso/` (inicio de sesión, sin registro) y `/panel/`.

## SEO

- **Páginas por localidad:** `/psicologa-valencia/`, `/psicologa-sagunto/`, `/psicologa-benisano/` y
  `/psicologia-online/`, generadas con los datos reales de `src/data/site.ts`.
- **Páginas por ámbito:** `src/content/ambitos/*.md`, una por ámbito, con sus preguntas frecuentes.
  Para ocultar una sin borrarla, pon `publicado: false`.
- **Preguntas frecuentes** (`PREGUNTAS` en `src/data/site.ts`): página propia y bloque en la portada.
- **Datos estructurados:** profesional, consulta, servicios con precios, preguntas frecuentes,
  migas de pan y página de perfil.
- **Pendiente de rellenar** en `SEO` (`src/data/site.ts`): el código de Google Search Console y los
  enlaces a sus perfiles (Doctoralia, COPCV, Google Business Profile…).

## Tests

```sh
pnpm test      # lógica de horarios (Vitest)
pnpm test:db   # migraciones + 29 comprobaciones de seguridad en un Postgres desechable (Docker)
```

## Seguridad

- **CSP estricta** generada por Astro (`security.csp` en `astro.config.mjs`): solo se ejecutan
  los scripts propios, verificados por hash; las conexiones solo pueden ir a Supabase y los
  iframes solo a Google Maps. Sin `unsafe-inline`.
- **Sin recursos de terceros:** fuentes e iconos van dentro de la web; Google Maps solo se carga
  si la persona lo acepta.
- **Sin XSS:** los datos de la base de datos se pintan con `textContent`, nunca con `innerHTML`.
- **El enlace de cita va en el `#`**, así no llega a ningún servidor ni a la cabecera Referer.
- **Base de datos** (`supabase/migrations/20261124000000_seguridad.sql`):
  - registrarse ya no da rol de admin;
  - `has_role` e `is_admin` no se pueden llamar sin sesión;
  - límite de 2 citas futuras por correo o teléfono y de 10 reservas nuevas por hora;
  - bloqueo de fila al cambiar de hora;
  - borrado automático de huecos y reservas 90 días después de la cita (con `pg_cron`).
- **`.env` está en `.gitignore`.** Solo debe contener la URL y la clave *publishable*. La clave
  `service_role` / `sb_secret_` nunca va en este proyecto.

## Puesta en marcha (pendiente)

1. **Supabase.** El proyecto `elzbxyeylcgkrdqflrth` que usaba la web anterior ya no resuelve en
   DNS (el 24-11-2026), así que las reservas no funcionan ni en la web publicada. Hay que
   crear un proyecto propio en supabase.com, **en región UE (Frankfurt o París)**, y luego:
   - aplicar las tres migraciones de `supabase/migrations/` por orden (SQL Editor o
     `supabase db push`);
   - activar la extensión `pg_cron` (Database → Extensions) **antes** de la última migración,
     para que el borrado a los 90 días quede programado;
   - en Authentication, desactivar «Allow new users to sign up», crear a mano el usuario de
     Carla y darle el rol: `insert into public.user_roles (user_id, role) values ('<uuid>', 'admin');`
   - activar la protección contra contraseñas filtradas y aceptar el DPA de Supabase.
2. **GitHub.** El workflow usa los secrets que ya existen: `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_PUBLISHABLE_KEY`. Con el Supabase nuevo, basta con actualizar sus valores.
   En Settings → Pages, origen «GitHub Actions». Activar «Enforce HTTPS».
3. **Textos legales.** El NIF y el domicilio no se muestran mientras estén vacíos en `TITULAR`, pero la
   LSSI los exige en el aviso legal: conviene añadirlos.
4. **Opcional:** Cloudflare Turnstile en la reserva, mediante una Edge Function, para frenar
   bots que roten correos y teléfonos.
