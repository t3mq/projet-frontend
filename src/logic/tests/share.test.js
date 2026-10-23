import { describe, it, expect } from "vitest";
import { buildShareText } from "../share.js";

const DATE = new Date("2026-10-21T10:00:00Z");

describe("buildShareText", () => {
  it("affiche la date, le score et les couleurs", () => {
    const text = buildShareText({
      guesses: ["ERRER", "ARBRE"],
      solution: "ARBRE",
      status: "won",
      maxGuesses: 6,
      date: DATE,
    });
    expect(text).toBe("Le Mot Mystère 21/10 · 2/6\n🟨🟩🟨⬛⬛\n🟩🟩🟩🟩🟩");
  });

  it("affiche X en cas de défaite", () => {
    const text = buildShareText({
      guesses: Array(6).fill("STYLO"),
      solution: "ARBRE",
      status: "lost",
      maxGuesses: 6,
      date: DATE,
    });
    expect(text.split("\n")[0]).toBe("Le Mot Mystère 21/10 · X/6");
  });

  it("ne révèle aucune lettre", () => {
    const text = buildShareText({
      guesses: ["ERRER", "ARBRE"],
      solution: "ARBRE",
      status: "won",
      maxGuesses: 6,
      date: DATE,
    });
    expect(text).not.toContain("ARBRE");
    expect(text).not.toContain("ERRER");
  });
});