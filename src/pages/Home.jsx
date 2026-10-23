import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { readJSON, writeJSON, PSEUDO_KEY } from "../storage/storage.js";
import { loadSettings, saveSettings } from "../storage/settings.js";
import { LENGTHS } from "../data/words.js";

export default function Home() {
  // ? pré-rempli avec le pseudo enregistré lors de la dernière visite
  const [pseudo, setPseudo] = useState(() => readJSON(PSEUDO_KEY, ""));
  const [erreur, setErreur] = useState("");
  const [reglages, setReglages] = useState(loadSettings);
  const naviguer = useNavigate(); // ? Hook pour changer de page

  // ? mettre à jour la variable à chaque lettre tapée
  const SavePseudo = (e) => {
    setPseudo(e.target.value);
    setErreur("");
  };

  // ? réglages enregistrés dès qu'ils changent, pour les retrouver au prochain chargement
  const changerReglages = (nouveaux) => {
    const suivants = { ...reglages, ...nouveaux };
    setReglages(suivants);
    saveSettings(suivants);
  };

  // ? enregistre le pseudo puis va sur la page demandée
  const jouer = (destination) => {
    // ! pour ne pas jouer avec un pseudo vide
    if (pseudo.trim() === "") {
      setErreur("Veuillez entrer un pseudo.");
      return;
    }
    writeJSON(PSEUDO_KEY, pseudo.trim()); // ? trim supprime les espaces au début et à la fin
    naviguer(destination);
  };

  // ? Entrée dans le champ = partie libre
  const validerFormulaire = (evenement) => {
    evenement.preventDefault(); // ? pour bloquer le rechargement de la page
    jouer(`/partie/${reglages.length}`);
  };

  return (
    <main className="mx-auto max-w-lg space-y-6 p-4">
      <h1 className="text-center text-3xl font-bold">Le Mot Mystère</h1>
      <p className="text-center">
        Trouvez le mot mystère en quelques essais. Après chaque proposition, les couleurs
        vous indiquent les lettres bien placées, mal placées ou absentes.
      </p>

      <form onSubmit={validerFormulaire} className="flex flex-col gap-3">
        <label htmlFor="pseudo" className="font-bold">
          Votre pseudo
        </label>
        <input
          id="pseudo"
          type="text"
          value={pseudo}
          onChange={SavePseudo}
          className="rounded border border-slate-400 px-3 py-2"
          name="PseudoInput"
        />
        <p className="min-h-6 text-red-600">{erreur}</p>

        <fieldset className="space-y-2 rounded border border-slate-300 p-3">
          <legend className="px-1 font-bold">Réglages de la partie libre</legend>
          <label className="flex items-center gap-2">
            Longueur du mot :
            <select
              value={reglages.length}
              onChange={(e) => changerReglages({ length: Number(e.target.value) })}
              className="rounded border border-slate-400 px-2 py-1"
            >
              {LENGTHS.map((longueur) => (
                <option key={longueur} value={longueur}>
                  {longueur} lettres
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={reglages.hard}
              onChange={(e) => changerReglages({ hard: e.target.checked })}
            />
            Mode difficile
          </label>
        </fieldset>

        <div className="flex gap-3">
          {/* // ? bouton pour le mot du jour (5 lettres, mode normal) */}
          <button
            type="button"
            onClick={() => jouer("/jour")}
            className="flex-1 rounded bg-green-600 px-4 py-2 font-bold text-white"
          >
            Mot du jour
          </button>
          {/* // ? bouton pour une partie libre avec les réglages */}
          <button
            type="submit"
            className="flex-1 rounded bg-blue-600 px-4 py-2 font-bold text-white"
          >
            Partie libre
          </button>
        </div>
      </form>

      {/* // ? les liens restent en dehors du formulaire */}
      <nav className="flex justify-center gap-4">
        <Link to="/scores" className="underline">
          Scores
        </Link>
        <Link to="/stats" className="underline">
          Statistiques
        </Link>
        <Link to="/regles" className="underline">
          Règles
        </Link>
      </nav>
    </main>
  );
}
