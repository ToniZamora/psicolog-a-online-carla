import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { dayKey, fmtDay, fmtTime, generateSlots } from "@/lib/slots";

export const Route = createFileRoute("/_authenticated/panel")({
  head: () => ({
    meta: [
      { title: "Panel de horarios · Carla Castellano" },
      { name: "description", content: "Gestiona tus horarios disponibles y tus citas." },
      { property: "og:title", content: "Panel de horarios · Carla Castellano" },
      { property: "og:description", content: "Gestiona tus horarios disponibles y tus citas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Panel,
});

type Row = {
  id: string;
  starts_at: string;
  is_booked: boolean;
  bookings: { id: string; name: string; email: string; phone: string } | null;
};

function Panel() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [date, setDate] = useState("");
  const [from, setFrom] = useState("10:00");
  const [to, setTo] = useState("14:00");

  async function load() {
    const { data } = await supabase
      .from("slots")
      .select("id, starts_at, is_booked, bookings(id, name, email, phone)")
      .gt("starts_at", new Date(Date.now() - 86400000).toISOString())
      .order("starts_at");
    setRows((data as unknown as Row[]) ?? []);
  }

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.rpc("has_role", { _user_id: u.user!.id, _role: "admin" });
      setIsAdmin(!!data);
      if (data) load();
    })();
  }, []);

  const days = useMemo(() => {
    const m = new Map<string, Row[]>();
    rows.forEach((r) => m.set(dayKey(r.starts_at), [...(m.get(dayKey(r.starts_at)) ?? []), r]));
    return [...m.values()];
  }, [rows]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const list = generateSlots(date, from, to);
    if (!list.length) {
      toast.error("El rango es demasiado corto");
      return;
    }
    const { error } = await supabase
      .from("slots")
      .upsert(list, { onConflict: "starts_at", ignoreDuplicates: true });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${list.length} horarios añadidos`);
    load();
  }

  async function removeSlot(r: Row) {
    if (r.is_booked && !confirm(`Esta hora la tiene ${r.bookings?.name}. ¿Cancelar y borrar?`))
      return;
    await supabase.from("slots").delete().eq("id", r.id);
    load();
  }

  async function cancelBooking(r: Row) {
    if (!r.bookings || !confirm(`¿Cancelar la cita de ${r.bookings.name}? El hueco quedará libre.`))
      return;
    await supabase.from("bookings").delete().eq("id", r.bookings.id);
    load();
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (isAdmin === false) {
    return (
      <div className="p-10 text-center">
        Esta cuenta no tiene acceso al panel.{" "}
        <Link to="/" className="text-primary underline">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl font-medium">Mis horarios</h1>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <LogOut className="size-4" /> Salir
          </button>
        </div>

        <form
          onSubmit={add}
          className="mt-8 flex flex-wrap items-end gap-4 rounded-3xl bg-card p-6 shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium">Día</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 rounded-xl border border-input bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Desde</label>
            <input
              type="time"
              required
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 rounded-xl border border-input bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hasta</label>
            <input
              type="time"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 rounded-xl border border-input bg-background px-3 py-2"
            />
          </div>
          <button className="rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground">
            Añadir horarios
          </button>
          <p className="w-full text-xs text-muted-foreground">
            Se crean sesiones de 50 min cada hora. Repite para añadir tarde u otros días.
          </p>
        </form>

        <div className="mt-8 space-y-6">
          {days.length === 0 && <p className="text-muted-foreground">No hay horarios próximos.</p>}
          {days.map((list) => (
            <div key={list[0]!.id} className="rounded-3xl bg-card p-6 shadow-sm">
              <h2 className="font-display text-2xl font-semibold capitalize">
                {fmtDay(list[0]!.starts_at)}
              </h2>
              <ul className="mt-3 divide-y divide-border">
                {list.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center gap-4 py-3">
                    <span className="w-16 font-semibold">{fmtTime(r.starts_at)}</span>
                    {r.bookings ? (
                      <span className="flex-1 text-sm">
                        <strong>{r.bookings.name}</strong> · {r.bookings.email} · {r.bookings.phone}
                        <button
                          onClick={() => cancelBooking(r)}
                          className="ml-3 text-xs text-primary hover:underline"
                        >
                          Cancelar cita
                        </button>
                      </span>
                    ) : (
                      <span className="flex-1 text-sm text-muted-foreground">Libre</span>
                    )}
                    <button
                      onClick={() => removeSlot(r)}
                      aria-label="Borrar horario"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
