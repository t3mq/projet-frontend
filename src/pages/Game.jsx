<<<<<<< Updated upstream
// ! Contient la logique de jeu basé sur les fonctions en js
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
import { Link } from "react-router";

export default function Game() {
  const [state, dispatch] = useReducer(
    gameReducer,
    null,
    () => createGame(pickRandomWord(SOLUTIONS)), // : lazy init => pas relancer a chaque fois que la page est rendu de nouveau
  );
  const [checking, setChecking] = useState(false); // : vérification Wiktionnaire
  const [message, setMessage] = useState("");
  const [rejectCount, setRejectCount] = useState(0); // : pour jouer /relancer le tremblement
  const [invalid, setInvalid] = useState(false); // : si ligne en cours refusé

  // ! verifier si le mot est bon ou non via l'api
=======
import { useReducer, useState } from "react";
import { gameReducer, createGame, pickRandomWord, MAX_GUESSES } from "../logic/gameReducer.js";
import { getKeyStatuses } from "../logic/keyboard.js";
import { checkWord } from "../api/wiktionary.js";
import { SOLUTIONS } from "../data/words.js";
import { useKeyboard } from "../hooks/useKeyboard.js";
import WordGrid from "../components/WordGrid.jsx";
import Keyboard from "../components/Keyboard.jsx";
import EndScreen from "./Endscreen.jsx";

export default function Game() {
  // 1. L'état de la partie vient du reducer.
  const [state, dispatch] = useReducer(gameReducer, null, () =>
    createGame(pickRandomWord(SOLUTIONS))
  );

  // 2. Ce qui ne concerne que l'affichage reste en useState.
  const [checking, setChecking] = useState(false); // vérification Wiktionnaire en cours
  const [message, setMessage] = useState("");
  const [rejectCount, setRejectCount] = useState(0); // relance le tremblement
  const [invalid, setInvalid] = useState(false); // ligne en cours refusée

  // 3. Valider : on vérifie le mot AVANT de dispatcher SUBMIT.
>>>>>>> Stashed changes
  async function handleSubmit() {
    if (checking || state.status !== "playing") return;
    if (state.current.length !== state.solution.length) {
      setMessage("Le mot est incomplet."); // : si mot < 5 charactères
      return;
    }

    setChecking(true);
    setMessage("");
    try {
      const word = await checkWord(state.current);
      if (word) {
        // : si mot n'est pas dans le dictionnaire
        dispatch({ type: "SUBMIT" });
      } else {
        setMessage("Ce mot n'est pas dans le dictionnaire.");
        setInvalid(true);
        setRejectCount((count) => count + 1);
      }
    } catch {
      // : si impossibilité de joindre le dictionnaire via l'api
      setMessage("Dictionnaire injoignable : mot accepté sans vérification.");
      dispatch({ type: "SUBMIT" });
    } finally {
      setChecking(false);
    }
  }
<<<<<<< Updated upstream
  // ! action lorsque l'on tape au clavier
=======

  // 4. Un seul point d'entrée pour toutes les touches (clavier physique et clavier écran).
>>>>>>> Stashed changes
  function handleKey(key) {
    if (checking) return;
    if (key === "ENTER") {
      handleSubmit(); // : on verifie le mot via la fonction ( mot valide/ dans le dictionnaire etc)
      return;
    }
    setInvalid(false);
    setMessage("");
    if (key === "DELETE") dispatch({ type: "REMOVE_LETTER" });
    else dispatch({ type: "ADD_LETTER", letter: key });
  }
  // ! nouvelle partie
  function handleNewGame() {
    dispatch({ type: "NEW_GAME", word: pickRandomWord(SOLUTIONS) });
    setMessage("");
    setInvalid(false);
    setRejectCount(0);
  }

  // ! Partie pseudo

  const [pseudo, setPseudo] = useState(""); // pour stocker le pseudo qui provient du local storage

  useEffect(() => {
    // : Lire le texte brut enregistré sous la clé "joueur" dans le local storage
    const texteSauvegarde = localStorage.getItem("joueur");

    // vérifier qu'il y a bien quelque chose
    if (texteSauvegarde) {
      //  Reconvertir le texte JSON en objet JS
      const donnees = JSON.parse(texteSauvegarde);

      // Mettre à jour le state avec le nom venant du local storage
      setPseudo(donnees.nom);
    }
  }, []);

  useKeyboard(handleKey);
<<<<<<< Updated upstream
  // ! Return
  return (
    <>
      <div>
        <div>
          <main className="mx-auto max-w-lg space-y-6 p-4">
            <h1 className="text-center text-2xl font-bold">Le Mot Mystère</h1>
            // ! affichage du pseudo
            <div>Votre pseudo est : {pseudo}</div>
            {/* // ! countdown avant prochain mot */}
            <Countdown />
            {/* // ! Grille de lettre */}
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
            {/* // ! keyboard virtuel */}
            {state.status === "playing" ? (
              <Keyboard
                statuses={getKeyStatuses(state.guesses, state.solution)}
                onLetter={(letter) => handleKey(letter)}
                onDelete={() => handleKey("DELETE")}
                onEnter={() => handleKey("ENTER")}
                disabled={checking}
              />
            ) : (
              // ! endscreen ( que si condition playing est vraie)
              <EndScreen state={state} onNewGame={handleNewGame} />
            )}
          </main>
        </div>
        <div className="flex justify-center mt-4 pb-12">
          <Link
            to="/"
            className=" text-2xl inline-block underline justify-center"
          >
            Retour à l'accueil
          </Link>
          <br />
          <br />
          <br />
        </div>
      </div>
    </>
=======

  // 5. L'affichage : on passe des données aux composants, ils dessinent.
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

      <p className="min-h-6 text-center">{checking ? "Vérification du mot..." : message}</p>

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
>>>>>>> Stashed changes
  );
}