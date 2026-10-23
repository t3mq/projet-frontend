import { Link } from "react-router";
import { POINTS, LENGTH_MULTIPLIERS, HARD_MULTIPLIER } from "../logic/scoring.js";
import { maxGuessesFor } from "../logic/gameReducer.js";
import { LENGTHS } from "../data/words.js";
import { evaluateGuess } from "../logic/evaluate.js";
import { STATUS_CLASSES } from "../logic/color.js";

const EXAMPLE_SOLUTION = "ARBRE";

// Lignes du barème : [libellé, points], construites depuis scoring.js.
const POINTS_ROWS = [
  ...POINTS.map((points, i) => [`${i + 1} essai${i > 0 ? "s" : ""}`, points]),
  ["Perdu", 0],
];

// Une proposition colorée contre le mot mystère d'exemple.
function ExampleRow({ word }) {
  const statuses = evaluateGuess(word, EXAMPLE_SOLUTION);

  return (
    <div className="flex gap-1">
      {word.split("").map((letter, i) => (
        <div
          key={i}
          className={`flex h-10 w-10 items-center justify-center border-2 font-bold ${STATUS_CLASSES[statuses[i]]}`}
        >
          {letter}
        </div>
      ))}
    </div>
  );
}

export default function Rules() {
  return (
    <main className="mx-auto max-w-lg space-y-6 p-4">
      <h1 className="text-2xl font-bold">Règles du jeu</h1>

      <section className="space-y-2">
        <p>Trouvez le mot mystère en un nombre limité d'essais : un essai de plus que le nombre de lettres.</p>
        <ul className="list-disc pl-6">
          {LENGTHS.map((length) => (
            <li key={length}>
              {length} lettres : {maxGuessesFor(length)} essais
            </li>
          ))}
        </ul>
        <p>Le mot du jour fait toujours 5 lettres, se joue une seule fois par jour et change à minuit (heure de Paris).</p>
        <p>Chaque proposition doit être un vrai mot français. Les accents ne se tapent pas : « école » se joue ECOLE.</p>
        <p>Après chaque proposition, chaque case change de couleur :</p>
        <ul className="list-disc pl-6">
          <li><strong>vert</strong> : la lettre est dans le mot, à la bonne place ;</li>
          <li><strong>jaune</strong> : la lettre est dans le mot, mais à une autre place ;</li>
          <li><strong>gris</strong> : la lettre n'est pas dans le mot, ou pas autant de fois que proposé.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Exemple</h2>
        <p>Le mot mystère est <strong>{EXAMPLE_SOLUTION}</strong>.</p>

        <div className="space-y-1">
          <ExampleRow word="TIGRE" />
          <p>T, I et G sont gris : ils ne sont pas dans ARBRE. R et E sont verts : ils sont à la bonne place.</p>
        </div>

        <div className="space-y-1">
          <ExampleRow word="ERRER" />
          <p>
            Le premier E est jaune : ARBRE contient un E, mais à une autre place. Le deuxième E est gris :
            ARBRE n'a qu'un seul E. Le premier R est vert, le deuxième jaune, le troisième gris : ARBRE n'a
            que deux R.
          </p>
        </div>

        <div className="space-y-1">
          <ExampleRow word="ARBRE" />
          <p>Toutes les cases sont vertes : le mot est trouvé.</p>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Mode difficile</h2>
        <p>À activer dans les réglages de la partie libre. Chaque indice révélé doit être réutilisé :</p>
        <ul className="list-disc pl-6">
          <li>une lettre verte doit rester à la même place ;</li>
          <li>une lettre jaune doit être reprise dans les propositions suivantes.</li>
        </ul>
        <p>Une proposition qui ne respecte pas ces règles est refusée et ne compte pas comme un essai.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Points</h2>
        <p>Barème de base pour un mot de 5 lettres :</p>
        <table className="w-full border-collapse">
          <tbody>
            {POINTS_ROWS.map(([label, points]) => (
              <tr key={label} className="border-b">
                <td className="py-1">{label}</td>
                <td className="py-1 text-right font-bold">{points}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Pour 6 et 7 lettres, on compte 100 points par essai restant, plus 100 (le dernier essai
          rapporte toujours 100). On multiplie ensuite :
        </p>
        <ul className="list-disc pl-6">
          {LENGTHS.map((length) => (
            <li key={length}>
              {length} lettres : × {String(LENGTH_MULTIPLIERS[length]).replace(".", ",")}
            </li>
          ))}
          <li>mode difficile : × {String(HARD_MULTIPLIER).replace(".", ",")} en plus</li>
        </ul>
      </section>

      <Link to="/" className="inline-block underline">
        Retour à l'accueil
      </Link>
    </main>
  );
}