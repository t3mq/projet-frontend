import { evaluateGuess } from "../logic/evaluate.js";
import { STATUS_CLASSES } from "../logic/color.js";

export default function WordGrid({
  guesses,
  current,
  solution,
  maxGuesses,
  rejectCount,
  invalid,
}) {
  // On reconstruit les 6 lignes : les validées, puis celle en cours, puis les vides.
  const lignes = [...guesses];
  if (lignes.length < maxGuesses) lignes.push(current);
  while (lignes.length < maxGuesses) lignes.push("");

  const indexLigneActive = guesses.length;

  return (
    <div className="flex flex-col gap-3 items-center mt-6">
      {lignes.map((motDeLaLigne, indexLigne) => {
        const estValidee = indexLigne < guesses.length;
        const estActive = indexLigne === indexLigneActive;

        // ! logique de couleur pour le clavier => calculée par evaluate.js
        const couleurs = estValidee
          ? evaluateGuess(motDeLaLigne, solution)
          : [];

        return (
          <div
            // ! clé modifier à chaque refus => React recrée la ligne et le tremblement rejoue.
            key={estActive ? `active-${rejectCount}` : indexLigne}
            className={`grid grid-cols-5 gap-3 w-fit ${estActive && rejectCount > 0 ? "animate-shake" : ""}`}
          >
            {[0, 1, 2, 3, 4].map((indexCase) => {
              const lettre = motDeLaLigne[indexCase] || "";

              let couleurCase = "bg-white border-slate-300 text-black"; // ? ligne vide ou en cours
              if (estValidee) {
                couleurCase = `${STATUS_CLASSES[couleurs[indexCase]]} animate-flip`;
              } else if (estActive && invalid) {
                couleurCase = "bg-white border-red-500 text-black"; // ? mot refusé
              }

              return (
                <div
                  key={indexCase}
                  className={`w-14 h-14 border-2 flex items-center justify-center font-bold text-2xl uppercase ${couleurCase}`}
                  // ? chaque case se retourne 300 ms après la précédente
                  style={
                    estValidee
                      ? { animationDelay: `${indexCase * 300}ms` }
                      : undefined
                  }
                >
                  {lettre}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
