import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso de Carla · Panel de horarios" },
      { name: "description", content: "Acceso privado para gestionar horarios y citas." },
      { property: "og:title", content: "Acceso de Carla · Panel de horarios" },
      { property: "og:description", content: "Acceso privado para gestionar horarios y citas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        toast.error("Email o contraseña incorrectos");
        return;
      }
      navigate({ to: "/panel" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Revisa tu correo para confirmar la cuenta");
      setMode("login");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/60 px-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-xl">
        <h1 className="font-display text-3xl font-medium">
          {mode === "login" ? "Entrar al panel" : "Crear cuenta"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Zona privada para gestionar horarios.</p>
        <label className="mt-6 block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5"
        />
        <label className="mt-4 block text-sm font-medium">Contraseña</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5"
        />
        <button
          disabled={loading}
          className="mt-6 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? "..." : mode === "login" ? "Entrar" : "Crear cuenta"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-sm text-primary hover:underline"
        >
          {mode === "login" ? "¿Primera vez? Crear cuenta" : "Ya tengo cuenta"}
        </button>
        <Link
          to="/"
          className="mt-2 block text-center text-xs text-muted-foreground hover:underline"
        >
          ← Volver a la web
        </Link>
      </form>
    </div>
  );
}
