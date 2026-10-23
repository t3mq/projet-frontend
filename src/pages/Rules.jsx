import { STATUS_CLASSES } from "../logic/color.js";
import { Link } from "react-router";
import { POINTS } from "../logic/scoring.js";

const STATUS_CLASSES = {
  correct: "bg-green-600 text-white border-green-600",
  present: "bg-yellow-500 text-white border-yellow-500",
  absent: "bg-gray-500 text-white border-gray-500",
  empty: "bg-white text-black border-gray-300",
};

const POINTS_ROWS = [
  ...POINTS.map((points, i) => [`${i + 1} essai${i > 0 ? "s" : ""}`, points]),
  ["Perdu", 0],
];

function ExampleRow({ word, highlight, status }) {
  return (
    <div className="flex gap-1">
      {word.split("").map((letter, i) => (
        <div
          key={i}
          className={`flex h-10 w-10 items-center justify-center border-2 font-bold ${
            i === highlight ? STATUS_CLASSES[status] : STATUS_CLASSES.empty
          }`}
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
        <p>
          Chaque proposition doit être un vrai mot français. Les accents ne se
          tapent pas : « école » se joue ECOLE.
        </p>
        <p>
          Après chaque proposition, la couleur des cases indique si vous
          approchez du mot.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Exemples</h2>

        <div className="space-y-1">
          <ExampleRow word="ARBRE" highlight={0} status="correct" />
          <p>
            Le <strong>A</strong> est dans le mot, à la bonne place.
          </p>
        </div>

        <div className="space-y-1">
          <ExampleRow word="PLUIE" highlight={1} status="present" />
          <p>
            Le <strong>L</strong> est dans le mot, mais à une autre place.
          </p>
        </div>

        <div className="space-y-1">
          <ExampleRow word="STYLO" status="absent" />
          <p>
            Le <strong>R</strong> n'est pas dans le mot.
          </p>
        </div>

        <p>
          Une lettre est aussi grise si vous la proposez plus de fois qu'elle
          n'apparaît dans le mot.
        </p>
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
