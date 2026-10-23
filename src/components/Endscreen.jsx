import { wiktionaryUrl } from "../api/wiktionary.js";
import Countdown from "./Countdown.jsx";

// Affichage seulement : les points et le texte à partager sont calculés par la page Game.
export default function EndScreen({ state, points, mode, onNewGame, onShare, shareMessage }) {
  const won = state.status === "won";
  const attempts = state.guesses.length;

  return (
    <div className="space-y-3 text-center">
      <p className="text-xl font-bold">
        {won
          ? `Bravo, trouvé en ${attempts} essai${attempts > 1 ? "s" : ""} !`
          : "Perdu !"}
      </p>
      <p>
        Le mot était{" "}
        <a
          href={wiktionaryUrl(state.display)}
          target="_blank"
          rel="noreferrer"
          className="font-bold underline"
        >
          {state.display}
        </a>
      </p>
      <p>{points} points</p>

      {mode === "jour" ? (
        // Mot du jour : pas de nouvelle partie, on partage et on attend le prochain mot.
        <>
          <button
            type="button"
            onClick={onShare}
            className="rounded bg-green-600 px-4 py-2 font-bold text-white"
          >
            Partager
          </button>
          <p className="min-h-6">{shareMessage}</p>
          <Countdown />
        </>
      ) : (
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onNewGame}
            className="rounded bg-green-600 px-4 py-2 font-bold text-white"
          >
            Nouvelle partie
          </button>
        </div>
      )}
    </div>
  );
}
