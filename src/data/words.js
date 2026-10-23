import words from "./mots_solutions.json";
import words6 from "./mots-6.json";
import words7 from "./mots-7.json";

// Liste fournie (5 lettres, sans accents) : utilisée aussi pour le mot du jour.
export const SOLUTIONS = words;

// Longueurs proposées dans les réglages.
export const LENGTHS = [5, 6, 7];

const WORDS_BY_LENGTH = { 5: words, 6: words6, 7: words7 };

// Liste des mots possibles pour une longueur donnée.
export function getWordList(length) {
  return WORDS_BY_LENGTH[length];
}
