import { describe, it, expect } from "vitest";
import { secondsUntilParisMidnight, formatCountdown } from "../countdown.js";

describe("secondsUntilParisMidnight", () => {
  it("heure d'été : 21h59 UTC = 23h59 à Paris, il reste 60 s", () => {
    expect(secondsUntilParisMidnight(new Date("2026-10-21T21:59:00Z"))).toBe(60);
  });

  it("heure d'hiver : 22h00 UTC = 23h00 à Paris, il reste 1 h", () => {
    expect(secondsUntilParisMidnight(new Date("2026-12-01T22:00:00Z"))).toBe(3600);
  });

  it("juste après minuit à Paris, il reste presque 24 h", () => {
    expect(secondsUntilParisMidnight(new Date("2026-10-21T22:00:01Z"))).toBe(24 * 3600 - 1);
  });
});

describe("formatCountdown", () => {
  it("formate en HH:MM:SS", () => {
    expect(formatCountdown(3661)).toBe("01:01:01");
    expect(formatCountdown(0)).toBe("00:00:00");
  });
});