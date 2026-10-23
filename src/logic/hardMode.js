import { evaluateGuess, CORRECT, PRESENT } from "./evaluate.js";

// Mode difficile : chaque indice révélé doit être réutilisé.
// Renvoie null si la proposition est valide, sinon le message à afficher.
export function checkHardMode(guess, previousGuesses, solution) {
  for (const previous of previousGuesses) {
    const result = evaluateGuess(previous, solution);

    // 1. Une lettre verte doit rester à sa place.
    for (let i = 0; i < previous.length; i++) {
      if (result[i] === CORRECT && guess[i] !== previous[i]) {
        return `La lettre n°${i + 1} doit être ${previous[i]}.`;
      }
    }

    // 2. Chaque lettre verte ou jaune doit revenir au moins autant de fois qu'elle a été révélée.
    const revealed = {};
    for (let i = 0; i < previous.length; i++) {
      if (result[i] === CORRECT || result[i] === PRESENT) {
        revealed[previous[i]] = (revealed[previous[i]] || 0) + 1;
      }
    }
    for (const letter in revealed) {
      const needed = revealed[letter];
      const count = guess.split("").filter((l) => l === letter).length;
      if (count < needed) {
        return needed === 1
          ? `La proposition doit contenir la lettre ${letter}.`
          : `La proposition doit contenir ${needed} fois la lettre ${letter}.`;
      }
    }
  }
  return null;
}
