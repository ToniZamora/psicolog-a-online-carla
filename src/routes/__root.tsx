import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  useLocation,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";
import { emailUrl, whatsappUrl } from "@/components/site-contact";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ConCiencia Psicología | Psicóloga en Valencia, Sagunto y Benisanó" },
      {
        name: "description",
        content:
          "Carla Castellano, psicóloga sanitaria. Atención presencial en Valencia, Sagunto y Benisanó, además de sesiones online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { pathname } = useLocation();
  const isPublicContent = ["/", "/sobre-mi", "/formacion", "/ambitos", "/contacto"].includes(
    pathname,
  );

  return (
    <QueryClientProvider client={queryClient}>
      {isPublicContent && <SiteHeader />}
      <Outlet />
      {isPublicContent && (
        <>
          <footer className="border-t border-border bg-background py-8">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-6 sm:flex-row sm:items-center">
              <Link to="/" className="font-display text-xl text-primary">
                ConCiencia Psicología
              </Link>
              <p className="text-base sm:text-lg text-muted-foreground font-medium">
                Online · Benisanó · Sagunto · Valencia
              </p>
            </div>
          </footer>
          <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="size-12 rounded-full bg-background"
              title="Escríbeme por correo"
            >
              <a href={emailUrl} aria-label="Escríbeme por correo">
                <Mail />
              </a>
            </Button>
            <Button
              asChild
              size="icon"
              className="size-12 rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
              title="Escríbeme por WhatsApp"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir chat de WhatsApp"
              >
                <MessageCircle />
              </a>
            </Button>
          </div>
        </>
      )}
      <Toaster />
    </QueryClientProvider>
  );
}
