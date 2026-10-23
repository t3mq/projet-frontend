import { describe, it, expect } from "vitest";
import { getPoints, basePoints, POINTS } from "../scoring.js";

describe("getPoints", () => {
  it("donne 600 points en un essai", () => {
    expect(getPoints("won", 1)).toBe(600);
  });

  it("donne 100 points en six essais", () => {
    expect(getPoints("won", 6)).toBe(100);
  });

  it("donne 0 point en cas de défaite", () => {
    expect(getPoints("lost", 6)).toBe(0);
    expect(getPoints("lost", 8, { length: 7, hard: true })).toBe(0);
  });

  it("le barème de base retrouve POINTS pour 5 lettres", () => {
    expect(POINTS.map((_, i) => basePoints(i + 1, 6))).toEqual(POINTS);
  });

  it("multiplie selon la longueur", () => {
    expect(getPoints("won", 1, { length: 6 })).toBe(1050); // 700 × 1,5
    expect(getPoints("won", 8, { length: 7 })).toBe(200); // 100 × 2
  });

  it("multiplie par 1,5 en mode difficile", () => {
    expect(getPoints("won", 1, { hard: true })).toBe(900);
    expect(getPoints("won", 1, { length: 7, hard: true })).toBe(2400); // 800 × 2 × 1,5
  });
});
