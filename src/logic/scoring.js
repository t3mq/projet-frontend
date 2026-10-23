import { maxGuessesFor } from "./gameReducer.js";

// Barème de base pour 5 lettres (affiché dans les règles).
export const POINTS = [600, 500, 400, 300, 200, 100];

// Multiplicateurs : un mot plus long ou le mode difficile rapportent plus.
export const LENGTH_MULTIPLIERS = { 5: 1, 6: 1.5, 7: 2 };
export const HARD_MULTIPLIER = 1.5;

// 100 points par essai restant + 100 : 600 en 1 essai sur 6, 100 au dernier essai.
// Même règle que POINTS, généralisée à 7 ou 8 essais.
export function basePoints(attempts, maxGuesses) {
  return (maxGuesses - attempts + 1) * 100;
}

export function getPoints(status, attempts, { length = 5, hard = false } = {}) {
  if (status !== "won") return 0;
  let points = basePoints(attempts, maxGuessesFor(length)) * LENGTH_MULTIPLIERS[length];
  if (hard) points *= HARD_MULTIPLIER;
  return Math.round(points);
}
