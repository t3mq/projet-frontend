import { evaluateGuess } from "./evaluate.js";

const EMOJIS = { correct: "🟩", present: "🟨", absent: "⬛" };

function formatDay(date) {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Europe/Paris"
    }).format(date);
}

export function buildShareText({ guesses, solution, status, maxGuesses, date }) {
    const score = status === "won" ? guesses.length : "X";
    const header = `Le Mot Mystère ${formatDay(date)} | ${score}/${maxGuesses}`;

    const lines = guesses.map((guess) =>
        evaluateGuess(guess, solution)
            .map((color) => EMOJIS[color])
            .join("")
    );

    return [header, ...lines].join("\n");
}

