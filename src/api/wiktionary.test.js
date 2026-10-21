import { describe, it, expect } from "vitest";
import { findFrenchWord } from "./wiktionary.js";

const FR = [{ title: "Catégorie:français" }];

describe("findFrenchWord", () => {
  it("retrouve un mot accentué à partir d'une saisie sans accents", () => {
    const pages = [
      { title: "école maternelle", categories: FR },
      { title: "école", categories: FR },
    ];
    expect(findFrenchWord(pages, "ECOLE")).toBe("école");
  });

  it("refuse un mot qui n'est pas français", () => {
    const pages = [{ title: "think" }];
    expect(findFrenchWord(pages, "THINK")).toBe(null);
  });

  it("refuse un nom propre", () => {
    const pages = [{ title: "Paris", categories: FR }];
    expect(findFrenchWord(pages, "PARIS")).toBe(null);
  });

  it("refuse quand aucune page ne correspond", () => {
    expect(findFrenchWord([], "ZZZZZ")).toBe(null);
  });
});