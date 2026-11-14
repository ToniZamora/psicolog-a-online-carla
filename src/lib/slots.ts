export const SESSION_MINUTES = 50;

/** Generates session start/end pairs every hour between two local times on a date. */
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
  new Date(iso).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
export const dayKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};
