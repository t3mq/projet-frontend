import { evaluateGuess } from "./evaluate.js";

const EMOJIS = { correct: "🟩", present: "🟨", absent: "⬛" };

// "23/10" : jour et mois à Paris.
function formatDay(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Paris",
  }).format(date);
}

// Texte à partager : seulement des couleurs, aucune lettre pour ne rien dévoiler.
export function buildShareText({ guesses, solution, status, maxGuesses, date }) {
  const score = status === "won" ? guesses.length : "X";
  const header = `Le Mot Mystère ${formatDay(date)} · ${score}/${maxGuesses}`;

  const lines = guesses.map((guess) =>
    evaluateGuess(guess, solution)
      .map((color) => EMOJIS[color])
      .join("")
  );

  return [header, ...lines].join("\n");
}
