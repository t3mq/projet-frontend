import { useEffect, useState } from "react";

export default function Tableau() {
  const [lignes, setLignes] = useState(["", "", "", "", "", ""]); // pour avoir les 6 lignes vides de départ

  const [ligneActive, setLigneActive] = useState(0); // l'index de la ligne en cours d'utilisation

  // ! logique des trois cas ( ajouter, effacer, valider) (utilisation d'IA pour créer la logique )
  useEffect(() => {
    const gererClavier = (evenement) => {
      if (ligneActive >= 6) return;

      const touche = evenement.key.toUpperCase();
      const motActuel = lignes[ligneActive];

      // ? Ajouter une lettre
      if (/^[A-Z]$/.test(touche) && motActuel.length < 5) {
        const nouvellesLignes = [...lignes];
        nouvellesLignes[ligneActive] = motActuel + touche;
        setLignes(nouvellesLignes);
      }

      // ? Effacer une lettre
      if (evenement.key === "Backspace" && motActuel.length > 0) {
        const nouvellesLignes = [...lignes];
        nouvellesLignes[ligneActive] = motActuel.slice(0, -1);
        setLignes(nouvellesLignes);
      }

      // ? Valider le mot
      if (evenement.key === "Enter" && motActuel.length === 5) {
        setLigneActive((precedente) => precedente + 1);
      }
    };

    window.addEventListener("keydown", gererClavier);
    return () => window.removeEventListener("keydown", gererClavier);
  }, [lignes, ligneActive]);

  return (
    // ! Affichage de la grille
    <div className="flex flex-col gap-2 items-center">
      {lignes.map((motDeLaLigne, indexLigne) => (
        <div key={indexLigne} className="grid grid-cols-5 gap-3 w-fit">
          {[0, 1, 2, 3, 4].map((indexCase) => {
            const lettre = motDeLaLigne[indexCase] || "";

            return (
              <div
                key={indexCase}
                className="w-14 h-14 border-2 border-slate-300 flex items-center justify-center font-bold text-2xl uppercase"
              >
                {lettre}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
