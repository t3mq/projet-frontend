import { describe, it, expect } from "vitest";
import { getKeyStatuses } from "../keyboard.js";

describe("getKeyStatuses", () => {
  it("aucune touche colorée au départ", () => {
    expect(getKeyStatuses([], "ARBRE")).toEqual({});
  });

  it("le vert l'emporte sur le gris pour une même lettre", () => {
    const statuses = getKeyStatuses(["ERRER"], "ARBRE");
    expect(statuses.R).toBe("correct");
    expect(statuses.E).toBe("present");
  });

  it("une lettre jaune puis verte devient verte", () => {
    const statuses = getKeyStatuses(["RARES", "ARBRE"], "ARBRE");
    expect(statuses.A).toBe("correct");
  });

  it("une lettre absente est grise", () => {
    expect(getKeyStatuses(["STYLO"], "ARBRE").S).toBe("absent");
  });
});