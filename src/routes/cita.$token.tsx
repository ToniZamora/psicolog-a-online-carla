import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { dayKey, fmtDay, fmtTime } from "@/lib/slots";

export const Route = createFileRoute("/cita/$token")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gestionar mi cita · Carla Castellano, Psicóloga" },
      { name: "description", content: "Cancela o cambia la hora de tu cita." },
      { property: "og:title", content: "Gestionar mi cita · Carla Castellano" },
      { property: "og:description", content: "Cancela o cambia la hora de tu cita." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Gestionar,
});

type Slot = { id: string; starts_at: string; is_booked: boolean };

function Gestionar() {
  const { token } = Route.useParams();
  const [cita, setCita] = useState<{ name: string; starts_at: string } | null | undefined>(
    undefined,
  );
  const [cancelada, setCancelada] = useState(false);
  const [cambiando, setCambiando] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);

  async function load() {
    const valid = /^[0-9a-f-]{36}$/i.test(token);
    if (!valid) return setCita(null);
    const { data } = await supabase.rpc("get_booking_by_token", { _token: token });
    setCita(data?.[0] ?? null);
  }
  useEffect(() => {
    load();
  }, [token]);

  async function openChange() {
    const { data } = await supabase
      .from("slots")
      .select("id, starts_at, is_booked")
      .gt("starts_at", new Date().toISOString())
      .eq("is_booked", false)
      .order("starts_at");
    setSlots(data ?? []);
    setCambiando(true);
  }

  async function cancel() {
    if (!confirm("¿Seguro que quieres cancelar tu cita?")) return;
    const { error } = await supabase.rpc("cancel_booking_by_token", { _token: token });
    if (error) {
      toast.error(error.message);
      return;
    }
    setCancelada(true);
  }

  async function move(s: Slot) {
    const { error } = await supabase.rpc("reschedule_booking", {
      _token: token,
      _new_slot_id: s.id,
    });
    if (error) {
      toast.error(error.message);
      openChange();
      return;
    }
    toast.success("Cita cambiada");
    setCambiando(false);
    load();
  }

  const days = useMemo(() => {
    const m = new Map<string, Slot[]>();
    slots.forEach((s) => m.set(dayKey(s.starts_at), [...(m.get(dayKey(s.starts_at)) ?? []), s]));
    return [...m.values()];
  }, [slots]);

  const futura = cita && new Date(cita.starts_at) > new Date();

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/60 px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl bg-card p-8 shadow-xl md:p-10">
        <CalendarCheck className="size-10 text-primary" />
        {cita === undefined && <p className="mt-4 text-muted-foreground">Cargando…</p>}
        {cita === null && !cancelada && (
          <p className="mt-4 text-lg">Este enlace no es válido o la cita ya fue cancelada.</p>
        )}
        {cancelada && (
          <>
            <h1 className="mt-4 font-display text-4xl font-medium">Cita cancelada</h1>
            <p className="mt-3 text-muted-foreground">Cuando quieras, puedes reservar otra.</p>
            <Link
              to="/reservar"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              Reservar de nuevo
            </Link>
          </>
        )}
        {cita && !cancelada && (
          <>
            <h1 className="mt-4 font-display text-4xl font-medium">
              Hola, {cita.name.split(" ")[0]}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Tu cita es el{" "}
              <strong className="capitalize text-foreground">{fmtDay(cita.starts_at)}</strong> a las{" "}
              <strong className="text-foreground">{fmtTime(cita.starts_at)}</strong>.
            </p>
            {futura ? (
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={openChange}
                  className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
                >
                  Cambiar hora
                </button>
                <button
                  onClick={cancel}
                  className="rounded-full border border-border px-6 py-3 font-semibold text-muted-foreground hover:text-destructive"
                >
                  Cancelar cita
                </button>
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">Esta cita ya ha pasado.</p>
            )}
            {cambiando && (
              <div className="mt-8 space-y-5">
                {days.length === 0 && (
                  <p className="text-muted-foreground">No hay otros huecos libres ahora mismo.</p>
                )}
                {days.map((list) => (
                  <div key={list[0]!.id}>
                    <h2 className="font-display text-xl font-semibold capitalize">
                      {fmtDay(list[0]!.starts_at)}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {list.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => move(s)}
                          className="rounded-full border border-primary px-4 py-1.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          {fmtTime(s.starts_at)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
