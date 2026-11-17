import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const close = () => setOpen(false);
  const links = (
    <>
      <Button asChild variant="ghost" className="justify-start px-3" onClick={close}>
        <Link to="/" aria-current={pathname === "/" ? "page" : undefined}>
          Inicio
        </Link>
      </Button>
      <Button asChild variant="ghost" className="justify-start px-3" onClick={close}>
        <Link to="/sobre-mi" aria-current={pathname === "/sobre-mi" ? "page" : undefined}>
          Sobre mí
        </Link>
      </Button>
      <Button asChild variant="ghost" className="justify-start px-3" onClick={close}>
        <Link to="/ambitos" aria-current={pathname === "/ambitos" ? "page" : undefined}>
          Ámbitos de intervención
        </Link>
      </Button>
      <Button asChild variant="ghost" className="justify-start px-3" onClick={close}>
        <Link to="/formacion" aria-current={pathname === "/formacion" ? "page" : undefined}>
          Mi formación
        </Link>
      </Button>
      <Button asChild variant="ghost" className="justify-start px-3" onClick={close}>
        <Link to="/tarifas" aria-current={pathname === "/tarifas" ? "page" : undefined}>
          Tarifas
        </Link>
      </Button>
      <Button asChild variant="ghost" className="justify-start px-3" onClick={close}>
        <Link to="/contacto" aria-current={pathname === "/contacto" ? "page" : undefined}>
          Contacto
        </Link>
      </Button>
    </>
  );
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          to="/"
          onClick={close}
          aria-label="ConCiencia Psicología, inicio"
          className="shrink-0 font-display text-2xl leading-tight text-primary"
        >
          ConCiencia
          <span className="mt-1 block font-body text-[10px] font-medium uppercase">Psicología</span>
        </Link>
        <nav aria-label="Navegación principal" className="hidden items-center gap-0 md:flex">
          {links}
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Navegación móvil"
          className="flex flex-col gap-1 border-t border-border px-6 pb-5 pt-3 md:hidden"
        >
          {links}
        </nav>
      )}
    </header>
  );
}
