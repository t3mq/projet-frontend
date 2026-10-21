export const CORRECT = "correct";
export const PRESENT = "present";
export const ABSENT = "absent";

// Compare une proposition au mot mystère 
// Renvoie un tableau d'états, un par lettre
export function evaluateGuess(guess, solution) {
    const result = Array(guess.length).fill(ABSENT);
    const remaining = {};

    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === solution[i]) {
            result[i] = CORRECT;
        } else {
            remaining[solution[i]] = (remaining[solution[i]] || 0) + 1;
        }
    }

    for (let i = 0; i <guess.length; i++) {
        if (result[i] !== CORRECT && remaining[guess[i]] > 0) {
            result[i] = PRESENT;
            remaining[guess[i]]--;
        }
    }

    return result;
}