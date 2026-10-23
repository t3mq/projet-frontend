import { Link } from "react-router";
import { POINTS } from "../logic/scoring.js";
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
        <p>Trouvez le mot mystère de cinq lettres en six essais au maximum.</p>
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
        <h2 className="text-xl font-bold">Points</h2>
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
      </section>

      <Link to="/" className="inline-block underline">
        Retour à l'accueil
      </Link>
    </main>
  );
}