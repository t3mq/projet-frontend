# Le Mot Mystère

Lien en ligne : à compléter

Jeu de lettres façon Wordle en React : trouver un mot français en un nombre limité d'essais, avec vérification des mots par le Wiktionnaire.

## Binôme

- à compléter (Prénom Nom)
- à compléter (Prénom Nom)

## Palier visé : 5

État constaté dans le code (lint, tests et build passent ; les points ci-dessous sont à confirmer par le test manuel dans le navigateur) :

| Palier | Contenu | État |
| --- | --- | --- |
| 1 | Grille, couleurs (lettres en double gérées), clavier physique et écran, vérification Wiktionnaire, animations | Fait |
| 2 | Écran de fin, mot affiché avec ses accents et lien vers le Wiktionnaire, pseudo enregistré et pré-rempli | Fait |
| 3 | Historique des parties, classement (`/scores`), statistiques (`/stats`) | Fait |
| 4 | Mot du jour (heure de Paris), reprise après rechargement, non rejouable, compte à rebours, partage, classement du jour | Fait |
| 5 | Mots de 6 et 7 lettres, mode difficile, réglages enregistrés, filtres du classement | Fait |

## Installation et commandes

```bash
npm install
npm run dev      # lance le site en local
npm test         # lance les tests une fois
npm run test:watch  # relance les tests à chaque modification
npm run build    # version de production dans dist/
npm run lint     # vérifie le code
```

## Bibliothèques ajoutées

- **React Router** (imposé) : une page par adresse (`/`, `/jour`, `/partie/:longueur`, `/scores`, `/stats`, `/regles`). `vercel.json` renvoie toutes les adresses vers `index.html` pour que l'accès direct à `/scores` ou `/partie/6` fonctionne une fois en ligne.
- **Tailwind CSS** : mise en forme directement dans le JSX, sans fichier CSS par composant. Les animations (retournement des cases, tremblement) sont déclarées dans `src/index.css`.
- **Vitest** : tests des fonctions de logique, intégré à Vite, sans configuration supplémentaire.

## Choix techniques

- **Logique séparée en fonctions pures testées** (`src/logic/`) : coloration, clavier, reducer, points, mode difficile, mot du jour, partage, classements, statistiques. Elles ne connaissent pas React, on peut donc les tester seules. Les composants (`src/components/`) ne font qu'afficher ; les pages (`src/pages/`) tiennent l'état et appellent la logique.
- **Coloration en deux passages** (`evaluateGuess`) : d'abord les lettres bien placées (vert), puis, avec les lettres restantes du mot, les lettres mal placées (jaune). C'est ce qui gère correctement les lettres en double.
- **`useReducer`** pour l'état de la partie : toutes les transitions (ajouter une lettre, valider, nouvelle partie) sont dans une seule fonction pure, testée sans navigateur.
- **Un seul fichier qui appelle l'API** (`src/api/wiktionary.js`). Un mot est accepté s'il existe une page du Wiktionnaire en minuscules (pas de nom propre) qui appartient à la **catégorie « français »** et qui, sans accents, correspond à la proposition. La fonction renvoie le titre exact, donc le mot avec ses accents.
- **Si l'API ne répond pas** (réseau coupé, délai de 5 s dépassé, erreur serveur), le mot est accepté avec un message d'avertissement : une panne du Wiktionnaire ne doit pas empêcher de jouer, et le joueur ne peut pas tricher sur la solution puisque les couleurs sont calculées localement.
- **Heure de Paris pour le mot du jour** : la date est calculée avec `Intl.DateTimeFormat` et le fuseau `Europe/Paris`, jamais avec `toISOString()` (UTC) ou `getHours()` (fuseau de l'ordinateur). Tout le monde a le même mot, qui change à minuit à Paris. Le numéro du jour utilise `Date.UTC` pour ne pas être décalé par les changements d'heure.
- **Un historique unique** dans le `localStorage` : chaque partie terminée y est ajoutée une fois. Le classement et les statistiques ne sont jamais stockés, ils sont recalculés depuis l'historique à l'affichage. Toutes les lectures passent par `readJSON` (avec `try/catch` et valeur par défaut) pour qu'une donnée abîmée ne fasse pas planter le site.
- **Une seule page `Game`** pour le mot du jour et la partie libre, avec une prop `mode`. Le mot du jour est sauvegardé à chaque changement sous la clé `jour-AAAA-MM-JJ` et rechargé au démarrage : une partie finie s'affiche directement sur l'écran de fin.
- **Nombre d'essais = longueur + 1** (6 pour 5 lettres, 7 pour 6, 8 pour 7) : un mot plus long donne plus d'indices par essai, mais demande un essai de plus.
- **Barème généralisé** : 100 points par essai restant, plus 100 (ce qui redonne exactement 600, 500… 100 pour 5 lettres), puis × 1,5 pour 6 lettres, × 2 pour 7 lettres et × 1,5 en mode difficile.
- **Mode difficile** vérifié avant l'appel à l'API : une proposition qui oublie un indice est refusée sans requête inutile, et l'essai n'est pas consommé.

## Listes de 6 et 7 lettres

La liste fournie (`mots_solutions.json`) ne contient que des mots de 5 lettres. Nous avons écrit `mots-6.json` et `mots-7.json` à la main : des mots français courants (noms communs, adjectifs, verbes à l'infinitif), avec leurs accents, sans noms propres, sans pluriels ni mots composés. Un test (`src/data/words.test.js`) vérifie que chaque mot a la bonne longueur une fois les accents retirés, qu'il ne contient que des lettres et qu'il n'y a pas de doublon.

## Difficultés rencontrées

- **Logique écrite mais pas branchée à l'interface** : au début, les fonctions (`evaluateGuess`, le reducer…) existaient et passaient leurs tests, mais la page affichait une grille qui ne les utilisait pas. Nous avons corrigé en faisant de la page `Game` le seul endroit qui tient l'état (`useReducer`) et en passant les résultats aux composants `WordGrid` et `Keyboard`, qui ne font plus qu'afficher.
- **Les lettres en double** : colorier chaque lettre indépendamment donne des résultats faux, par exemple deux E jaunes pour un mot qui n'en contient qu'un. La coloration en deux passages, avec un compteur des lettres restantes, règle le problème ; les cas difficiles (ERRER contre ARBRE, RRRRR contre TERRE) sont dans les tests. Le même compteur sert au mode difficile (« doit contenir 2 fois la lettre R »).
- **Les accents de la liste fournie** : la liste est sans accents (« ecole »), alors que le mot doit s'afficher correctement en fin de partie et que le lien vers le Wiktionnaire doit pointer vers la bonne page (« école »). À la fin de la partie, nous réutilisons le titre renvoyé par le Wiktionnaire (le dernier mot validé en cas de victoire, un appel pour la solution en cas de défaite) ; si l'API ne répond pas, on affiche le mot de la liste.
- **Conflits de fusion** : un `git stash pop` a laissé des marqueurs de conflit dans `Game.jsx` et un fichier de logique a été déplacé par erreur dans le dossier des tests ; nous avons fusionné les deux versions en gardant les fonctionnalités de chacune.
