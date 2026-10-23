import { describe, it, expect } from "vitest";
import { getPoints } from "../scoring.js";

describe("getPoints", () => {
  it("donne 600 points en un essai", () => {
    expect(getPoints("won", 1)).toBe(600);
  });

  it("donne 100 points en six essais", () => {
    expect(getPoints("won", 6)).toBe(100);
  });

  it("donne 0 point en cas de défaite", () => {
    expect(getPoints("lost", 6)).toBe(0);
  });
});