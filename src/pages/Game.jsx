import { useState, useEffect, useReducer } from "react";
import Tableau from "../components/WordGrid";
import Countdown from "../components/Countdown";
import {
  gameReducer,
  createGame,
  pickRandomWord,
  MAX_GUESSES,
} from "../logic/gameReducer";
import { getKeyStatuses } from "../logic/keyboard";
import { checkWord } from "../api/wiktionary";
import { SOLUTIONS } from "../data/words";
import { useKeyboard } from "../hooks/useKeyboard";
import WordGrid from "../components/WordGrid";
import Keyboard from "../components/Keyboard";
import EndScreen from "../pages/Endscreen";

export default function Game() {
  const [state, dispatch] = useReducer(gameReducer, null, () =>
    createGame(pickRandomWord(SOLUTIONS)),
  );
  const [checking, setChecking] = useState(false); // ? vérification Wiktionnaire
  const [message, setMessage] = useState("");
  const [rejectCount, setRejectCount] = useState(0); // ? pour jouer /relancer le tremblement
  const [invalid, setInvalid] = useState(false); // ? si ligne en cours refusé

  async function handleSubmit() {
    if (checking || state.status !== "playing") return;
    if (state.current.length !== state.solution.length) {
      setMessage("Le mot est incomplet.");
      return;
    }

    setChecking(true);
    setMessage("");
    try {
      const word = await checkWord(state.current);
      if (word) {
        dispatch({ type: "SUBMIT" });
      } else {
        setMessage("Ce mot n'est pas dans le dictionnaire.");
        setInvalid(true);
        setRejectCount((count) => count + 1);
      }
    } catch {
      setMessage("Dictionnaire injoignable : mot accepté sans vérification.");
      dispatch({ type: "SUBMIT" });
    } finally {
      setChecking(false);
    }
  }
  function handleKey(key) {
    if (checking) return;
    if (key === "ENTER") {
      handleSubmit();
      return;
    }
    setInvalid(false);
    setMessage("");
    if (key === "DELETE") dispatch({ type: "REMOVE_LETTER" });
    else dispatch({ type: "ADD_LETTER", letter: key });
  }

  function handleNewGame() {
    dispatch({ type: "NEW_GAME", word: pickRandomWord(SOLUTIONS) });
    setMessage("");
    setInvalid(false);
    setRejectCount(0);
  }

  useKeyboard(handleKey);
  return (
    <main className="mx-auto max-w-lg space-y-6 p-4">
      <h1 className="text-center text-2xl font-bold">Le Mot Mystère</h1>

      <WordGrid
        guesses={state.guesses}
        current={state.current}
        solution={state.solution}
        maxGuesses={MAX_GUESSES}
        rejectCount={rejectCount}
        invalid={invalid}
      />

      <p className="min-h-6 text-center">
        {checking ? "Vérification du mot..." : message}
      </p>

      {state.status === "playing" ? (
        <Keyboard
          statuses={getKeyStatuses(state.guesses, state.solution)}
          onLetter={(letter) => handleKey(letter)}
          onDelete={() => handleKey("DELETE")}
          onEnter={() => handleKey("ENTER")}
          disabled={checking}
        />
      ) : (
        <EndScreen state={state} onNewGame={handleNewGame} />
      )}
    </main>
  );
}
