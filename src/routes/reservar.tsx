import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { dayKey, fmtDay, fmtTime } from "@/lib/slots";

export const Route = createFileRoute("/reservar")({
  head: () => ({
    meta: [
      { title: "Reservar cita · Carla Castellano, Psicóloga" },
      {
        name: "description",
        content: "Consulta los horarios disponibles y reserva tu sesión con Carla Castellano.",
      },
      { property: "og:title", content: "Reservar cita · Carla Castellano, Psicóloga" },
      {
        property: "og:description",
        content: "Elige el horario que mejor te venga y reserva tu sesión en un minuto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reservar,
});

type Slot = { id: string; starts_at: string; ends_at: string; is_booked: boolean };

const schema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre").max(100),
  email: z.string().trim().email("Email no válido").max(255),
  phone: z.string().trim().min(9, "Teléfono no válido").max(30),
});

function Reservar() {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Slot | null>(null);
  const [token, setToken] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("slots")
      .select("id, starts_at, ends_at, is_booked")
      .gt("starts_at", new Date().toISOString())
      .order("starts_at");
    setSlots(data ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  const days = useMemo(() => {
    const m = new Map<string, Slot[]>();
    (slots ?? []).forEach((s) => {
      const k = dayKey(s.starts_at);
      m.set(k, [...(m.get(k) ?? []), s]);
    });
    return [...m.values()];
  }, [slots]);

  async function book(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Revisa los datos");
      return;
    }
    setSending(true);
    const { data: tok, error } = await supabase.rpc("book_slot", {
      _slot_id: selected.id,
      _name: parsed.data.name,
      _email: parsed.data.email,
      _phone: parsed.data.phone,
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      load();
      setSelected(null);
      return;
    }
    setToken(tok as string);
    setDone(selected);
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/60 px-6">
        <div className="max-w-md rounded-3xl bg-card p-10 text-center shadow-xl">
          <CheckCircle2 className="mx-auto size-14 text-primary" />
          <h1 className="mt-4 font-display text-4xl font-medium">¡Cita reservada!</h1>
          <p className="mt-3 text-muted-foreground">
            Te esperamos el <strong className="text-foreground">{fmtDay(done.starts_at)}</strong> a
            las <strong className="text-foreground">{fmtTime(done.starts_at)}</strong>.
          </p>
          {token && (
            <div className="mt-6 rounded-2xl bg-secondary p-4 text-sm">
              <p>Guarda este enlace para cancelar o cambiar tu cita:</p>
              <Link
                to="/cita/$token"
                params={{ token }}
                className="mt-1 block break-all font-semibold text-primary underline"
              >
                {`${window.location.origin}/cita/${token}`}
              </Link>
            </div>
          )}
          <Link
            to="/"
            className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Volver a la web
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> Volver
        </Link>
        <h1 className="mt-6 font-display text-5xl font-medium">Reserva tu cita</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Sesiones de 50 minutos. Elige un hueco libre.
        </p>
        <div className="mt-4 flex gap-5 text-sm">
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-primary" /> Libre
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-muted" /> Ocupado
          </span>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            {slots === null && <p className="text-muted-foreground">Cargando horarios…</p>}
            {slots?.length === 0 && (
              <div className="rounded-3xl bg-card p-8 text-center shadow-sm">
                <CalendarCheck className="mx-auto size-10 text-primary" />
                <p className="mt-3 text-muted-foreground">
                  Aún no hay horarios publicados. Vuelve pronto o escríbeme por WhatsApp.
                </p>
              </div>
            )}
            {days.map((list) => (
              <div key={list[0]!.id}>
                <h2 className="font-display text-2xl font-semibold capitalize">
                  {fmtDay(list[0]!.starts_at)}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {list.map((s) => (
                    <button
                      key={s.id}
                      disabled={s.is_booked}
                      onClick={() => setSelected(s)}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        s.is_booked
                          ? "cursor-not-allowed bg-muted text-muted-foreground line-through"
                          : selected?.id === s.id
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/30"
                            : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      {fmtTime(s.starts_at)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={book}
            className="h-fit rounded-3xl bg-card p-8 shadow-lg lg:sticky lg:top-8"
          >
            <h3 className="font-display text-2xl font-semibold">Tus datos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {selected ? (
                <>
                  Hora elegida:{" "}
                  <strong className="capitalize text-foreground">
                    {fmtDay(selected.starts_at)}, {fmtTime(selected.starts_at)}
                  </strong>
                </>
              ) : (
                "Primero elige un horario"
              )}
            </p>
            {(["name", "email", "phone"] as const).map((f) => (
              <div key={f} className="mt-4">
                <label className="text-sm font-medium">
                  {{ name: "Nombre", email: "Email", phone: "Teléfono" }[f]}
                </label>
                <input
                  type={f === "email" ? "email" : f === "phone" ? "tel" : "text"}
                  required
                  value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5"
                />
              </div>
            ))}
            <button
              disabled={!selected || sending}
              className="mt-6 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50"
            >
              {sending ? "Reservando…" : "Confirmar cita"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
