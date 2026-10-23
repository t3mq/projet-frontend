import { normalizeWord } from "./normalize.js";

// Nombre d'essais selon la longueur : 6 pour 5 lettres, 7 pour 6, 8 pour 7.
export function maxGuessesFor(length) {
  return length + 1;
}

// Tire un mot au hasard dans la liste des solutions.
export function pickRandomWord(wordList) {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

// Crée l'état de départ d'une partie à partir d'un mot avec accents.
// startedAt sert à mesurer la durée de la partie (classement du mot du jour).
export function createGame(word, startedAt = Date.now()) {
  const solution = normalizeWord(word);
  return {
    solution,
    display: word,
    guesses: [],
    current: "",
    status: "playing",
    maxGuesses: maxGuessesFor(solution.length),
    startedAt,
  };
}

export function gameReducer(state, action) {
  // Partie terminée : on ignore tout sauf nouvelle partie et affichage du mot accentué.
  const allowedAfterEnd = action.type === "NEW_GAME" || action.type === "REVEAL";
  if (state.status !== "playing" && !allowedAfterEnd) {
    return state;
  }

  switch (action.type) {
    case "ADD_LETTER": {
      const isLetter = /^[a-zA-Z]$/.test(action.letter);
      const isFull = state.current.length >= state.solution.length;
      if (!isLetter || isFull) return state;
      return { ...state, current: state.current + action.letter };
    }
    case "REMOVE_LETTER": {
      return { ...state, current: state.current.slice(0, -1) };
    }
    case "SUBMIT": {
      if (state.current.length !== state.solution.length) return state;

      const guesses = [...state.guesses, state.current];
      let status = "playing";
      if (state.current === state.solution) status = "won";
      else if (guesses.length >= state.maxGuesses) status = "lost";

      return { ...state, guesses, current: "", status };
    }
    case "REVEAL": {
      // Fin de partie : on remplace le mot de la liste (sans accents) par celui du Wiktionnaire.
      return { ...state, display: action.word };
    }
    case "NEW_GAME": {
      return createGame(action.word);
    }
    default:
      return state;
  }
}
