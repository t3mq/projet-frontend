import { describe, it, expect } from "vitest";
import { checkHardMode } from "../hardMode.js";

describe("checkHardMode", () => {
  it("accepte le premier essai", () => {
    expect(checkHardMode("STYLO", [], "ARBRE")).toBe(null);
  });

  it("accepte une proposition qui réutilise tous les indices", () => {
    // TIGRE contre ARBRE : R et E verts.
    expect(checkHardMode("ORGRE", ["TIGRE"], "ARBRE")).toBe(null);
  });

  it("refuse une lettre verte déplacée", () => {
    // TIGRE : R vert en position 4.
    expect(checkHardMode("RAREE", ["TIGRE"], "ARBRE")).toBe("La lettre n°4 doit être R.");
  });

  it("refuse une lettre jaune oubliée", () => {
    // ELEVE contre CHIEN : un E jaune.
    expect(checkHardMode("STYLO", ["ELEVE"], "CHIEN")).toBe(
      "La proposition doit contenir la lettre E."
    );
  });

  it("compte les lettres révélées plusieurs fois", () => {
    // ERRER contre ARBRE : un R vert et un R jaune, donc deux R ; R vert en position 2.
    expect(checkHardMode("ARBIE", ["ERRER"], "ARBRE")).toBe(
      "La proposition doit contenir 2 fois la lettre R."
    );
  });

  it("vérifie chaque essai précédent", () => {
    // Le premier essai est respecté, pas le second (A vert en position 1).
    expect(checkHardMode("ORGRE", ["TIGRE", "ABIME"], "ARBRE")).toBe(
      "La lettre n°1 doit être A."
    );
  });
});
