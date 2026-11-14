import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export function PageIntro({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="editorial-intro pb-14 pt-8 md:pb-20 md:pt-10">
      <div className="mx-auto max-w-6xl px-6">
        <Button asChild variant="link" className="h-auto px-0 py-2">
          <Link to="/">
            <ArrowLeft />
            Volver al inicio
          </Link>
        </Button>
        <div className="mx-auto mt-10 max-w-3xl text-center md:mt-12">
          <p className="text-sm font-semibold uppercase text-primary">{label}</p>
          <h1 className="mt-5 font-display text-4xl font-normal leading-tight md:text-5xl">
            {title}
          </h1>
          <div className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
