import { describe, it, expect } from "vitest";
import { parisDateKey, dayNumber, getDailyWord } from "../daily.js";

const WORDS = ["arbre", "balle", "chien"];

describe("parisDateKey", () => {
  it("23h59 à Paris est encore le 22", () => {
    expect(parisDateKey(new Date("2026-10-22T21:59:00Z"))).toBe("2026-10-22");
  });

  it("minuit à Paris est déjà le 23", () => {
    expect(parisDateKey(new Date("2026-10-22T22:00:00Z"))).toBe("2026-10-23");
  });
});

describe("dayNumber", () => {
  it("le 1er janvier 2026 est le jour 0, le 2 le jour 1", () => {
    expect(dayNumber(new Date("2026-01-01T12:00:00Z"))).toBe(0);
    expect(dayNumber(new Date("2026-01-02T12:00:00Z"))).toBe(1);
  });
});

describe("getDailyWord", () => {
  it("même mot toute la journée", () => {
    const morning = getDailyWord(WORDS, new Date("2026-10-22T06:00:00Z"));
    const evening = getDailyWord(WORDS, new Date("2026-10-22T21:00:00Z"));
    expect(morning).toBe(evening);
  });

  it("change à minuit heure de Paris", () => {
    const before = getDailyWord(WORDS, new Date("2026-10-22T21:59:00Z"));
    const after = getDailyWord(WORDS, new Date("2026-10-22T22:00:00Z"));
    expect(before).not.toBe(after);
  });

  it("fonctionne avant la date de départ", () => {
    expect(getDailyWord(WORDS, new Date("2025-12-31T12:00:00Z"))).toBe("chien");
  });
});