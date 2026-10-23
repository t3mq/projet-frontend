import { Link } from "react-router";
import { getPoints } from "../logic/scoring.js";
import { wiktionaryUrl } from "../api/wiktionary.js";

export default function EndScreen({ state, onNewGame }) {
  const won = state.status === "won";
  const attempts = state.guesses.length;
  const points = getPoints(state.status, attempts);

  return (
    <div className="space-y-3 text-center">
      <p className="text-xl font-bold">
        {won
          ? `Bravo, trouvé en ${attempts} essai${attempts > 1 ? "s" : ""} !`
          : "Perdu !"}
      </p>
      {/* // ! mot du jour */}
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
      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={onNewGame}
          className="rounded bg-green-600 px-4 py-2 font-bold text-white"
        >
          Nouvelle partie
        </button>
      </div>
    </div>
  );
}
