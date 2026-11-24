export const SESSION_MINUTES = 50;
const TZ = "Europe/Madrid";

export type Slot = { id: string; starts_at: string; ends_at?: string; is_booked: boolean };

/** Genera sesiones de 50 min, una por hora, entre dos horas locales de un día. */
export function generateSlots(date: string, from: string, to: string) {
  const [fh = 0, fm = 0] = from.split(":").map(Number);
  const [th = 0, tm = 0] = to.split(":").map(Number);
  const [y = 0, mo = 1, d = 1] = date.split("-").map(Number);
  const out: { starts_at: string; ends_at: string }[] = [];
  let cur = new Date(y, mo - 1, d, fh, fm);
  const limit = new Date(y, mo - 1, d, th, tm);
  while (cur.getTime() + SESSION_MINUTES * 60000 <= limit.getTime()) {
    const end = new Date(cur.getTime() + SESSION_MINUTES * 60000);
    out.push({ starts_at: cur.toISOString(), ends_at: end.toISOString() });
    cur = new Date(cur.getTime() + 60 * 60000);
  }
  return out;
}

export const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: TZ,
  });

export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: TZ });

export const dayKey = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ }); // AAAA-MM-DD

export function groupByDay<T extends { starts_at: string }>(rows: T[]): T[][] {
  const m = new Map<string, T[]>();
  for (const r of rows) {
    const k = dayKey(r.starts_at);
    m.set(k, [...(m.get(k) ?? []), r]);
  }
  return [...m.values()];
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
