import { describe, it, expect } from "vitest";
import { getWordList, LENGTHS } from "./words.js";
import { normalizeWord } from "../logic/normalize.js";

describe.each(LENGTHS)("liste des mots de %i lettres", (length) => {
  const list = getWordList(length);

  it("chaque mot a la bonne longueur une fois normalisé", () => {
    const wrong = list.filter((word) => normalizeWord(word).length !== length);
    expect(wrong).toEqual([]);
  });

  it("ne contient que des lettres", () => {
    const wrong = list.filter((word) => !/^[A-Z]+$/.test(normalizeWord(word)));
    expect(wrong).toEqual([]);
  });

  it("ne contient pas de doublon", () => {
    const normalized = list.map(normalizeWord);
    expect(new Set(normalized).size).toBe(normalized.length);
  });
});
