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
  // On reconstruit toutes les lignes (maxGuesses) : les validées, puis celle en cours, puis les vides.
  const lignes = [...guesses];
  if (lignes.length < maxGuesses) lignes.push(current);
  while (lignes.length < maxGuesses) lignes.push("");

  const indexLigneActive = guesses.length;

  // Une case par lettre du mot : 5, 6 ou 7 colonnes.
  const indexCases = Array.from({ length: solution.length }, (_, i) => i);

  // Cases plus petites pour les mots longs : 7 cases doivent tenir sur un écran de téléphone.
  let tailleCase = "w-14 h-14 text-2xl";
  if (solution.length === 6) tailleCase = "w-12 h-12 text-2xl";
  if (solution.length >= 7) tailleCase = "w-10 h-10 text-xl";

  return (
    <div className="flex flex-col gap-2 items-center mt-6">
      {lignes.map((motDeLaLigne, indexLigne) => {
        const estValidee = indexLigne < guesses.length;
        const estActive = indexLigne === indexLigneActive;

        // ! logique de couleur pour le clavier => calculée par evaluate.js ( fonction evaluateGuess)
        const couleurs = estValidee
          ? evaluateGuess(motDeLaLigne, solution)
          : [];

        return (
          <div
            // ! clé modifier à chaque refus => React recrée la ligne et le tremblement rejoue.
            key={estActive ? `active-${rejectCount}` : indexLigne}
            className={`flex gap-2 w-fit ${estActive && rejectCount > 0 ? "animate-shake" : ""}`}
          >
            {indexCases.map((indexCase) => {
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
                  className={`${tailleCase} border-2 flex items-center justify-center font-bold uppercase ${couleurCase}`}
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
