import { describe, it, expect } from "vitest";
import { generateSlots } from "./slots";

describe("generateSlots", () => {
  it("creates 50-minute sessions every hour that fit in the range", () => {
    const s = generateSlots("2030-01-07", "10:00", "14:00");
    expect(s).toHaveLength(4);
    const first = s[0]!;
    expect((new Date(first.ends_at).getTime() - new Date(first.starts_at).getTime()) / 60000).toBe(
      50,
    );
  });
  it("skips a session that would end past the closing time", () => {
    expect(generateSlots("2030-01-07", "10:00", "10:40")).toHaveLength(0);
  });
});
