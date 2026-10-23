import { useState } from "react";
import { Link } from "react-router";
import { loadHistory } from "../storage/history.js";
import { getTopScores, getDailyRanking } from "../logic/scores.js";
import { parisDateKey } from "../logic/daily.js";
import { LENGTHS } from "../data/words.js";

// Valeurs des listes déroulantes -> filtres de getTopScores ("tous" = pas de filtre).
const HARD_FILTERS = { tous: undefined, normal: false, difficile: true };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });
}

function formatMode(game) {
  const mode = game.mode === "jour" ? "Mot du jour" : "Libre";
  return game.hard ? `${mode} · difficile` : mode;
}

function ScoreTable({ games }) {
  if (games.length === 0) {
    return <p className="text-center">Aucune partie pour l'instant.</p>;
  }

  return (
    // overflow-x-auto : le tableau défile sur mobile au lieu de déborder de la page
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-1">Rang</th>
            <th className="p-1">Pseudo</th>
            <th className="p-1">Mot</th>
            <th className="p-1">Essais</th>
            <th className="p-1">Points</th>
            <th className="p-1">Date</th>
            <th className="p-1">Longueur</th>
            <th className="p-1">Mode</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, i) => (
            <tr key={`${game.date}-${i}`} className="border-b">
              <td className="p-1">{i + 1}</td>
              <td className="p-1">{game.pseudo}</td>
              <td className="p-1">{game.word}</td>
              <td className="p-1">{game.status === "won" ? game.attempts : "X"}</td>
              <td className="p-1 font-bold">{game.points}</td>
              <td className="p-1">{formatDate(game.date)}</td>
              <td className="p-1">{game.length ?? 5}</td>
              <td className="p-1">{formatMode(game)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Scores() {
  const [onglet, setOnglet] = useState("general");
  const [longueur, setLongueur] = useState("tous");
  const [difficulte, setDifficulte] = useState("tous");

  // Classements recalculés à chaque affichage depuis l'historique.
  const history = loadHistory();
  const top = getTopScores(history, {
    length: longueur === "tous" ? undefined : Number(longueur),
    hard: HARD_FILTERS[difficulte],
  });
  const daily = getDailyRanking(history, parisDateKey(new Date()));

  const ongletClasses = (nom) =>
    `flex-1 rounded px-3 py-2 font-bold ${onglet === nom ? "bg-green-600 text-white" : "bg-gray-200"}`;

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="text-center text-2xl font-bold">Scores</h1>

      <div className="flex gap-2">
        <button type="button" className={ongletClasses("general")} onClick={() => setOnglet("general")}>
          Classement général
        </button>
        <button type="button" className={ongletClasses("jour")} onClick={() => setOnglet("jour")}>
          Mot du jour
        </button>
      </div>

      {onglet === "general" ? (
        <section className="space-y-3">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              Longueur :
              <select
                value={longueur}
                onChange={(e) => setLongueur(e.target.value)}
                className="rounded border border-slate-400 px-2 py-1"
              >
                <option value="tous">Toutes</option>
                {LENGTHS.map((n) => (
                  <option key={n} value={n}>
                    {n} lettres
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2">
              Mode :
              <select
                value={difficulte}
                onChange={(e) => setDifficulte(e.target.value)}
                className="rounded border border-slate-400 px-2 py-1"
              >
                <option value="tous">Tous</option>
                <option value="normal">Normal</option>
                <option value="difficile">Difficile</option>
              </select>
            </label>
          </div>
          <ScoreTable games={top} />
        </section>
      ) : (
        <section className="space-y-3">
          <p className="text-center">Classement du mot d'aujourd'hui (à égalité, le plus rapide gagne).</p>
          <ScoreTable games={daily} />
        </section>
      )}

      <p className="text-center">
        <Link to="/" className="underline">
          Retour à l'accueil
        </Link>
      </p>
    </main>
  );
}
