import { useState } from "react";
import { useNavigate } from "react-router";

export default function Home() {
  const [pseudo, setPseudo] = useState(""); // un useState initialisé vide
  const naviguer = useNavigate(); // ! Hook pour changer de page

  //mettre a jour la variable a chaque lettre tapé
  const SavePseudo = (e) => {
    setPseudo(e.target.value); // va contenir le texte tapé
  };

  const validerFormulaire = (evenement) => {
    evenement.preventDefault(); // pour bloquer le rechargement de la page

    // pour pas jouer un pseudo vide
    if (pseudo.trim() === "") {
      alert("Veuillez entrer un pseudo");
      return;
    }

    const PseudoJoueur = {
      nom: pseudo.trim(), // trim va supp les espaces inutiles (début et à la fin)
    };

    // ? FORMATAGE des données
    const FormatageDonnees = JSON.stringify(PseudoJoueur); // formater la donnée au format json pour le stocké dans le fichier usersData.json
    localStorage.setItem("joueur", FormatageDonnees); // pour enregistrer dans le NAVIGATEUR


    // ---------------TEST---------------------------------
    //  relit ce qui a été stocké
    // const donneesSauvegardees = localStorage.getItem("joueur");
    // On transforme le texte JSON en objet JS
    // const joueurRecupere = JSON.parse(donneesSauvegardees);

    // alert(`mon pseudo est : ${joueurRecupere.nom}`); // test pour regarder si le pseudo est bien save

    // ----------------------------------------------------
    
    // ? changer de page
    naviguer("/partie");
  };

  return (
    <>
      <h1 className="">Daily Word guess</h1>
      <h2>Trouvez le mot mystere avec 6 essais max</h2>
      <h2>Entrez votre pseudo</h2>
      <form onSubmit={validerFormulaire} className="flex flex-col gap-5 w-fit">
        <input
          type="text"
          value={pseudo}
          onChange={SavePseudo}
          className="border border-black-600"
          name="PseudoInput"
        />
        <button type="submit" className="border border-blue-500">
          Jouer
        </button>
      </form>
    </>
  );
}
