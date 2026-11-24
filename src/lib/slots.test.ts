import { describe, expect, it } from "vitest";
import { SESSION_MINUTES, UUID_RE, dayKey, fmtTime, generateSlots, groupByDay } from "./slots";

// Los tests se ejecutan con TZ=Europe/Madrid (ver package.json), como el navegador de Carla.

describe("generateSlots", () => {
  it("crea una sesión de 50 minutos cada hora dentro del rango", () => {
    const slots = generateSlots("2026-12-01", "10:00", "14:00");
    expect(slots.map((s) => fmtTime(s.starts_at))).toEqual(["10:00", "11:00", "12:00", "13:00"]);
    for (const s of slots) {
      expect(new Date(s.ends_at).getTime() - new Date(s.starts_at).getTime()).toBe(SESSION_MINUTES * 60_000);
    }
  });

  it("no crea una sesión que no cabe entera antes de la hora final", () => {
    expect(generateSlots("2026-12-01", "10:00", "10:49")).toEqual([]);
    expect(generateSlots("2026-12-01", "10:00", "10:50")).toHaveLength(1);
  });

  it("devuelve vacío si el rango está invertido", () => {
    expect(generateSlots("2026-12-01", "14:00", "10:00")).toEqual([]);
  });

  it("guarda las horas en UTC respetando el horario de verano", () => {
    expect(generateSlots("2026-07-01", "10:00", "11:00")[0]?.starts_at).toBe("2026-07-01T08:00:00.000Z");
    expect(generateSlots("2026-12-01", "10:00", "11:00")[0]?.starts_at).toBe("2026-12-01T09:00:00.000Z");
  });
});

describe("dayKey y groupByDay", () => {
  it("agrupa por día en hora de Madrid, no en UTC", () => {
    // 23:30 UTC del 1 de diciembre son las 00:30 del día 2 en Madrid.
    expect(dayKey("2026-12-01T23:30:00Z")).toBe("2026-12-02");
    const grupos = groupByDay([
      { starts_at: "2026-12-01T09:00:00Z" },
      { starts_at: "2026-12-01T10:00:00Z" },
      { starts_at: "2026-12-01T23:30:00Z" },
    ]);
    expect(grupos.map((g) => g.length)).toEqual([2, 1]);
  });
});

describe("UUID_RE", () => {
  it("solo acepta tokens con forma de UUID", () => {
    expect(UUID_RE.test("0f8fad5b-d9cb-469f-a165-70867728950e")).toBe(true);
    expect(UUID_RE.test("abc123")).toBe(false);
    expect(UUID_RE.test("0f8fad5b-d9cb-469f-a165-70867728950e' or 1=1")).toBe(false);
  });
});
