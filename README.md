# ConCiencia Psicología

Aplicación con TanStack Start. El despliegue se realiza en Cloudflare Workers desde GitHub Actions.

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

## Despliegue desde GitHub

El workflow `.github/workflows/deploy.yml` compila y publica en Cloudflare Workers al hacer push a `main`. Configura estos secretos en **Settings → Secrets and variables → Actions** del repositorio:

- `CLOUDFLARE_API_TOKEN`: token de Cloudflare con permiso para desplegar Workers.
- `CLOUDFLARE_ACCOUNT_ID`: ID de la cuenta de Cloudflare.
- `VITE_SUPABASE_URL`: URL del proyecto Supabase.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: clave pública de Supabase.

También se puede desplegar manualmente después de compilar con `npm run deploy`.

## Dominio personalizado

Añade `concienciapsico.com` a Cloudflare y configura en Namecheap los nameservers que Cloudflare indique. Tras desplegar el Worker, añade `www.concienciapsico.com` como dominio personalizado en **Workers & Pages → Worker → Settings → Domains & Routes**. No configures registros DNS distintos de los que indiquen Cloudflare y Namecheap.
