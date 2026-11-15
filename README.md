# ConCiencia Psicología

Aplicación con TanStack Start. El sitio se genera de forma estática y se publica en GitHub Pages desde GitHub Actions.

## Development

Requiere Node.js 22 y npm.

```sh
npm ci
npm run dev
```

Para generar la compilación de producción:

```sh
npm run build
```

## Despliegue en GitHub Pages

El workflow `.github/workflows/deploy.yml` compila y publica el sitio al hacer push a `main`. Configura estos secretos en **Settings → Secrets and variables → Actions** del repositorio:

- `VITE_SUPABASE_URL`: URL del proyecto Supabase.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: clave pública de Supabase.

En **Settings → Pages**, selecciona **GitHub Actions** como origen. El workflow conserva las rutas de la aplicación mediante una página de fallback para GitHub Pages.

## Dominio personalizado

El archivo `public/CNAME` publica `www.concienciapsico.com` como dominio personalizado de GitHub Pages. En el proveedor DNS, configura `www` como CNAME a `ToniZamora.github.io` y apunta el dominio raíz a las direcciones IP de GitHub Pages. Si el DNS está en Cloudflare, deja esos registros en modo **DNS only**.
