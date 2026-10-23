import { useEffect, useReducer, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { gameReducer, createGame, pickRandomWord } from "../logic/gameReducer.js";
import { getKeyStatuses } from "../logic/keyboard.js";
import { getPoints } from "../logic/scoring.js";
import { checkHardMode } from "../logic/hardMode.js";
import { getDailyWord, parisDateKey } from "../logic/daily.js";
import { buildShareText } from "../logic/share.js";
import { checkWord } from "../api/wiktionary.js";
import { SOLUTIONS, LENGTHS, getWordList } from "../data/words.js";
import { readJSON, writeJSON, PSEUDO_KEY } from "../storage/storage.js";
import { loadSettings } from "../storage/settings.js";
import { addGame } from "../storage/history.js";
import { useKeyboard } from "../hooks/useKeyboard.js";
import WordGrid from "../components/WordGrid.jsx";
import Keyboard from "../components/Keyboard.jsx";
import EndScreen from "../components/Endscreen.jsx";

// Une seule page pour les deux modes :
// - "jour" : mot du jour, 5 lettres, mode normal, sauvegardé et non rejouable ;
// - "libre" : longueur lue dans l'adresse (/partie/6), mode difficile selon les réglages.
export default function Game({ mode }) {
  const { longueur } = useParams();
  const length = mode === "jour" ? 5 : Number(longueur);

  // Longueur invalide dans l'adresse (/partie/9, /partie/abc) : retour à 5 lettres.
  if (!LENGTHS.includes(length)) return <Navigate to="/partie/5" replace />;

  const hard = mode === "jour" ? false : loadSettings().hard;

  // key : si le mode ou la longueur change, React repart d'une partie neuve.
  return <Board key={`${mode}-${length}`} mode={mode} length={length} hard={hard} />;
}

function Board({ mode, length, hard }) {
  // Jour de la partie (heure de Paris) : sert de clé de sauvegarde du mot du jour.
  const [day] = useState(() => parisDateKey(new Date()));
  const dailyKey = `jour-${day}`;

  // 1. L'état de la partie vient du reducer (lazy init : calculé une seule fois).
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    if (mode === "jour") {
      // Partie du jour déjà commencée ou finie : on la reprend telle quelle.
      const saved = readJSON(dailyKey, null);
      return saved?.solution ? saved : createGame(getDailyWord(SOLUTIONS, new Date()));
    }
    return createGame(pickRandomWord(getWordList(length)));
  });

  // 2. Ce qui ne concerne que l'affichage reste en useState.
  const [checking, setChecking] = useState(false); // vérification Wiktionnaire en cours
  const [message, setMessage] = useState("");
  const [rejectCount, setRejectCount] = useState(0); // relance le tremblement
  const [invalid, setInvalid] = useState(false); // ligne en cours refusée
  const [shareMessage, setShareMessage] = useState("");
  const [pseudo] = useState(() => readJSON(PSEUDO_KEY, ""));

  // Mot du jour : sauvegarde à chaque changement pour reprendre après un rechargement.
  useEffect(() => {
    if (mode === "jour") writeJSON(dailyKey, state);
  }, [mode, dailyKey, state]);

  // Proposition refusée : message, ligne en rouge et tremblement. L'essai n'est pas consommé.
  function reject(text) {
    setMessage(text);
    setInvalid(true);
    setRejectCount((count) => count + 1);
  }

  // 3. Valider : on vérifie le mot AVANT de dispatcher SUBMIT.
  async function handleSubmit() {
    if (checking || state.status !== "playing") return;
    if (state.current.length !== state.solution.length) {
      setMessage("Le mot est incomplet.");
      return;
    }

    // Mode difficile vérifié avant l'API : pas d'appel inutile pour un essai refusé.
    if (hard) {
      const error = checkHardMode(state.current, state.guesses, state.solution);
      if (error) {
        reject(error);
        return;
      }
    }

    setChecking(true);
    setMessage("");
    let title = null; // le mot avec ses accents, renvoyé par le Wiktionnaire
    try {
      title = await checkWord(state.current);
      if (!title) {
        reject("Ce mot n'est pas dans le dictionnaire.");
        setChecking(false);
        return;
      }
    } catch {
      // Dictionnaire injoignable : on accepte le mot pour ne pas bloquer le joueur.
      setMessage("Dictionnaire injoignable : mot accepté sans vérification.");
    }

    // On calcule l'état suivant avec le même reducer pour savoir si la partie se termine.
    const action = { type: "SUBMIT" };
    const next = gameReducer(state, action);
    dispatch(action);
    if (next.status !== "playing") await finishGame(next, title);
    setChecking(false);
  }

  // 4. Fin de partie : on récupère le mot avec ses accents, puis on enregistre la partie.
  // Appelé une seule fois, depuis handleSubmit, au moment où la partie se termine.
  async function finishGame(final, title) {
    // Gagné : le dernier mot validé est la solution, son titre accentué est déjà connu.
    let word = title;
    if (final.status === "lost") {
      try {
        word = await checkWord(final.solution);
      } catch {
        word = null; // API injoignable : on garde le mot de la liste
      }
    }
    const display = word || final.display;
    dispatch({ type: "REVEAL", word: display });

    const attempts = final.guesses.length;
    addGame({
      pseudo: pseudo || "Anonyme",
      word: display,
      attempts,
      points: getPoints(final.status, attempts, { length, hard }),
      status: final.status,
      date: new Date().toISOString(),
      durationMs: Date.now() - final.startedAt,
      mode,
      day,
      length,
      hard,
    });
  }

  // 5. Un seul point d'entrée pour toutes les touches (clavier physique et clavier écran).
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
    dispatch({ type: "NEW_GAME", word: pickRandomWord(getWordList(length)) });
    setMessage("");
    setInvalid(false);
    setRejectCount(0);
  }

  // Copie le résultat (couleurs seulement) dans le presse-papiers.
  async function handleShare() {
    const text = buildShareText({
      guesses: state.guesses,
      solution: state.solution,
      status: state.status,
      maxGuesses: state.maxGuesses,
      date: new Date(state.startedAt),
    });
    try {
      await navigator.clipboard.writeText(text);
      setShareMessage("Résultat copié, il ne reste plus qu'à le coller !");
    } catch {
      // Presse-papiers refusé ou indisponible (page non sécurisée, permission refusée).
      setShareMessage("Le navigateur a refusé la copie : impossible de partager.");
    }
  }

  useKeyboard(handleKey);

  // 6. L'affichage : on passe des données aux composants, ils dessinent.
  return (
    <main className="mx-auto max-w-lg space-y-4 p-4">
      <h1 className="text-center text-2xl font-bold">Le Mot Mystère</h1>
      <p className="text-center">
        {mode === "jour" ? "Mot du jour" : `Partie libre · ${length} lettres`}
        {hard && " · mode difficile"}
        {" · "}Joueur : {pseudo || "Anonyme"}
      </p>

      <WordGrid
        guesses={state.guesses}
        current={state.current}
        solution={state.solution}
        maxGuesses={state.maxGuesses}
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
        <EndScreen
          state={state}
          points={getPoints(state.status, state.guesses.length, { length, hard })}
          mode={mode}
          onNewGame={handleNewGame}
          onShare={handleShare}
          shareMessage={shareMessage}
        />
      )}

      <p className="text-center">
        <Link to="/" className="underline">
          Retour à l'accueil
        </Link>
      </p>
    </main>
  );
}
