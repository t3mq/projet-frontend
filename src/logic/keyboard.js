import { evaluateGuess, CORRECT, PRESENT, ABSENT } from "./evaluate.js";

const PRIORITY = { [ABSENT]: 1, [PRESENT]: 2, [CORRECT]: 3 };

// Renvoie l'état connu de chaque lettre déjà jouée : { A : "correct", R : "present", ...}
export function getKeyStatuses(guesses, solution) {
    const statuses = {};

    for (const guess of guesses) {
        const result = evaluateGuess(guess, solution);
        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            const status = result[i];
            if (!statuses[letter] || PRIORITY[status] > PRIORITY[statuses[letter]]) {
                statuses[letter] = status;
            }
        }
    }

    return statuses;
}