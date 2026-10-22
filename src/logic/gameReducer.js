import { normalizeWord } from "./normalize.js";


export const MAX_GUESSES = 6;

// Tire un mot au hasard dans la liste des solutions.
export function pickRandomWord(wordList) {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

// Crée l'état de départ d'une partie à partir d'un mot avec accents.
export function createGame(word) {
  return {
    solution: normalizeWord(word),
    display: word,
    guesses: [],
    current: "",
    status: "playing",
  };
}

export function gameReducer(state, action) {
  // Partie terminé : on ignore tout sauf nouvelle partie
  if (state.status !== "playing" && action.type !== "NEW_GAME") {
    return state;
  }

  switch (action.type) {
    case "ADD_LETTER":
      const isLetter = /^[a-zA-Z]$/.test(action.letter);
      const isFull = state.current.length >= state.solution.length;
      if (!isLetter || isFull) return state;
      return { ...state, current: state.current + action.letter };
    case "REMOVE_LETTER":
      return { ...state, current: state.current.slice(0, -1) };
    case "SUBMIT":
      if (state.current.length !== state.solution.length) return state;

      const guesses = [...state.guesses, state.current];
      let status = "playing";
      if (state.current === state.solution) status = "won";
      else if (guesses.length >= MAX_GUESSES) status = "lost";

      return { ...state, guesses, current: "", status };
    case "NEW_GAME":
      return createGame(action.word);
    default:
      return state;
  }
}
