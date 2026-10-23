import { Link } from "react-router";
import { loadHistory } from "../storage/history.js";
import { readJSON, PSEUDO_KEY } from "../storage/storage.js";
import { computeStats } from "../logic/stats.js";

function StatBox({ label, value }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default function Stats() {
  const pseudo = readJSON(PSEUDO_KEY, "");

  if (!pseudo) {
    return (
      <main className="mx-auto max-w-lg space-y-4 p-4 text-center">
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <p>Choisissez d'abord un pseudo sur la page d'accueil.</p>
        <Link to="/" className="underline">
          Retour à l'accueil
        </Link>
      </main>
    );
  }

  // Statistiques recalculées à chaque affichage depuis l'historique.
  const stats = computeStats(loadHistory(), pseudo);
  // Largeur des barres proportionnelle à la plus grande valeur (au moins 1 pour éviter /0).
  const max = Math.max(1, ...stats.distribution);

  return (
    <main className="mx-auto max-w-lg space-y-6 p-4">
      <h1 className="text-center text-2xl font-bold">Statistiques de {pseudo}</h1>

      <div className="flex flex-wrap gap-2">
        <StatBox label="Parties" value={stats.played} />
        <StatBox label="Victoires (%)" value={stats.winRate} />
        <StatBox label="Série en cours" value={stats.currentStreak} />
        <StatBox label="Meilleure série" value={stats.bestStreak} />
        <StatBox label="Points" value={stats.totalPoints} />
      </div>

      <section className="space-y-1">
        <h2 className="text-xl font-bold">Victoires par nombre d'essais</h2>
        {stats.distribution.map((count, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-4 text-right">{i + 1}</span>
            <div
              className="bg-green-600 px-2 text-right font-bold text-white"
              style={{ width: `${Math.max(8, (count / max) * 100)}%` }}
            >
              {count}
            </div>
          </div>
        ))}
      </section>

      <p className="text-center">
        <Link to="/" className="underline">
          Retour à l'accueil
        </Link>
      </p>
    </main>
  );
}
