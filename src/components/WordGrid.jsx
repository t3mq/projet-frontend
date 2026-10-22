import { useEffect, useState } from "react";
import Keyboard from "./Keyboard";
import { evaluateGuess } from "../logic/evaluate";
import { STATUS_CLASSES } from "../logic/color";

export default function Tableau() {
  const [lignes, setLignes] = useState(["", "", "", "", "", ""]); // pour avoir les 6 lignes vides de départ

  const [ligneActive, setLigneActive] = useState(0); // l'index de la ligne en cours d'utilisation

  // ! ----------------fonction pour la logique du clavier virtuel/physique----------

  // ? Fonction pour ajouter une lettre
  const ajouterLettre = (lettre) => {
    if (ligneActive >= 6) return; // Sécurité
    const motActuel = lignes[ligneActive];

    if (motActuel.length < 5) {
      const nouvellesLignes = [...lignes];
      nouvellesLignes[ligneActive] = motActuel + lettre;
      setLignes(nouvellesLignes);
    }
  };

  // ? Fonction pour effacer
  const effacerLettre = () => {
    if (ligneActive >= 6) return;
    const motActuel = lignes[ligneActive];

    if (motActuel.length > 0) {
      const nouvellesLignes = [...lignes];
      nouvellesLignes[ligneActive] = motActuel.slice(0, -1);
      setLignes(nouvellesLignes);
    }
  };

  // ? Fonction pour valider
  const validerMot = () => {
    if (ligneActive >= 6) return;
    const motActuel = lignes[ligneActive];

    if (motActuel.length === 5) {
      setLigneActive((precedente) => precedente + 1);
    }
  };
  // ! ------------------------------------------------------------

  // ! logique des trois cas ( ajouter, effacer, valider) en appelant les fonctions défini plus haut
  useEffect(() => {
    const gererClavier = (evenement) => {
      const touche = evenement.key.toUpperCase();

      // On appelle les fonctions défini plus tot

      // ? ajouter
      if (/^[A-Z]$/.test(touche)) {
        ajouterLettre(touche);
      }
      // ? supprimer
      if (evenement.key === "Backspace") {
        effacerLettre();
      }
      // ? valider
      if (evenement.key === "Enter") {
        validerMot();
      }
    };

    window.addEventListener("keydown", gererClavier);
    return () => window.removeEventListener("keydown", gererClavier);
  }, [lignes, ligneActive]);

  return (
    // ! Affichage de la grille
    <div className="flex flex-col gap-6 items-center mt-6">
      {/* // ? la grille */}
      {lignes.map((motDeLaLigne, indexLigne) => (
        <div key={indexLigne} className="grid grid-cols-5 gap-3 w-fit">
          {[0, 1, 2, 3, 4].map((indexCase) => {
            const lettre = motDeLaLigne[indexCase] || "";

            // ! Logique de couleur de cellule
            let couleurCase = "bg-white border-slate-300 text-black"; // Couleur par défaut (ligne en cours ou vide)
            if (indexLigne < ligneActive) {
              // TODO: Remplacer ce test basique par la vraie logique de comparaison avec le mot mystère
              if (lettre === "A") {
                couleurCase = "bg-green-500 border-green-500 text-white"; // ? Correct
              } else if (lettre === "E") {
                couleurCase = "bg-yellow-500 border-yellow-500 text-white"; // ? correct mais mal placé
              } else {
                couleurCase = "bg-gray-500 border-gray-500 text-white"; // ? pas présente
              }
            }

            return (
              <div
                key={indexCase}
                className={`w-14 h-14 border-2 border-slate-300 flex items-center justify-center font-bold text-2xl uppercase ${couleurCase}`}
              >
                {lettre}
              </div>
            );
          })}
        </div>
      ))}
      {/* // ? le clavier virtuel */}
      <Keyboard
        onLetter={ajouterLettre}
        onDelete={effacerLettre}
        onEnter={validerMot}
        statuses={{}} // pour la couleur de chauqe touche
        disabled={ligneActive >= 6}
      />
    </div>
  );
}
