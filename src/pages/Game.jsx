import { useState, useEffect } from "react";
import Tableau from "../components/WordGrid";
import Countdown from "../components/Countdown";



export default function Game() {
  const [pseudo, setPseudo] = useState(""); // pour stocker le pseudo qui provient du local storage 

  useEffect(() => {
    // ? Lire le texte brut enregistré sous la clé "joueur" dans le local storage 
    const texteSauvegarde = localStorage.getItem("joueur");

    // vérifier qu'il y a bien quelque chose
    if (texteSauvegarde) {
      //  Reconvertir le texte JSON en véritable objet JS
      const donnees = JSON.parse(texteSauvegarde);

      // Mettre à jour le state avec le nom venant du local storage
      setPseudo(donnees.nom);
    }
  }, []);
  
  return (
    <>
      <div>test</div>
      <div>Votre pseudo est : {pseudo}</div>
      <div>Votre nombre de point est : </div>{" "}      {/* // ! à initialiser plus tard  */}
      <Countdown/>
      <Tableau/>
    </>
  );
}
