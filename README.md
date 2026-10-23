# By Antoine & Clément
# Changements depuis la présentation du 23/10

Ce document résume le travail réalisé après la présentation orale : la fin du palier 3, puis les paliers 4 (mot du jour) et 5 (variantes).

## Résumé

| Palier | Avant la présentation | Maintenant |
|---|---|---|
| 1. Le jeu | Presque terminé | Terminé |
| 2. Le dictionnaire | Mot sans accents en fin de partie | Terminé |
| 3. Le confort de jeu | Pas de scores ni de statistiques, animations invisibles | Terminé |
| 4. Le mot du jour | Seulement le compte à rebours, non affiché | Terminé |
| 5. Les variantes | Rien | Terminé |

## 1. Logique (`src/logic/`)

Toutes ces fonctions sont pures (sans React) et testées.

### Nouveaux fichiers

**`daily.js`** : le mot du jour
- `parisDateKey(date)` : la date du jour à Paris au format `2026-10-23`, quel que soit le fuseau de l'ordinateur.
- `dayNumber(date)` : le nombre de jours écoulés depuis le 1er janvier 2026.
- `getDailyWord(words, date)` : choisit le mot du jour à partir de ce numéro. Même date, même mot, sur tous les ordinateurs. Le mot change à minuit heure de Paris.

**`share.js`** : le partage
- `buildShareText(...)` : construit le texte à copier, avec la date, le score et une ligne d'emojis par essai (vert, jaune, noir), sans jamais révéler les lettres.

**`hardMode.js`** : le mode difficile
- `checkHardMode(guess, previousGuesses, solution)` : vérifie qu'une proposition respecte les règles. Une lettre verte doit rester à sa place, une lettre jaune doit être réutilisée. Renvoie un message précis si la règle n'est pas respectée.

**`scores.js`** : les classements
- `getTopScores(history, filtres)` : les 10 meilleures parties, triées par points puis par date, filtrables par longueur et par mode difficile.
- `getDailyRanking(history, jour)` : le classement du mot du jour, trié par points puis par temps de résolution.

**`stats.js`** : les statistiques
- `computeStats(history, pseudo)` : parties jouées, pourcentage de victoires, série en cours, meilleure série, total des points, répartition des victoires par nombre d'essais.

### Fichiers modifiés

**`gameReducer.js`**
- Nouvelle fonction `maxGuessesFor(length)` : le nombre d'essais dépend de la longueur du mot (6 essais pour 5 lettres, 7 pour 6, 8 pour 7).
- Le nombre d'essais est maintenant stocké dans l'état de la partie.

**`scoring.js`**
- `getPoints` prend en compte la longueur et le mode : × 1,5 pour 6 lettres, × 2 pour 7 lettres, × 1,5 en mode difficile. Les bonus se cumulent.
- Le barème de base est généralisé à 100 points par essai restant, pour fonctionner avec 7 et 8 essais.

## 2. Stockage (`src/storage/`)

- `storage.js` : `readJSON` et `writeJSON`. Toute lecture du navigateur passe par `readJSON`, qui renvoie une valeur par défaut si la donnée est absente ou abîmée, au lieu de faire planter la page.
- `history.js` : chaque partie terminée est ajoutée à un historique. Les classements et les statistiques ne sont jamais stockés : ils sont recalculés à partir de cet historique.

## 3. Interface

### Pages

| Route | Page | Changement |
|---|---|---|
| `/` | Accueil | Titre corrigé, pseudo pré-rempli, réglages (longueur et mode difficile), liens vers toutes les pages |
| `/jour` | Mot du jour | **Nouvelle.** Reprise après rechargement, non rejouable, compte à rebours et partage en fin de partie |
| `/partie/:longueur` | Partie libre | La longueur du mot est dans l'adresse |
| `/scores` | Tableau des scores | **Nouvelle.** Filtres par longueur et mode, classement du mot du jour séparé |
| `/stats` | Statistiques | **Nouvelle** |
| `/regles` | Règles | Mode difficile, nombre d'essais selon la longueur, bonus de points |

Le mot du jour et la partie libre utilisent **la même page `Game`**, avec une option `mode`, pour ne pas dupliquer le code.

### Composants

- `WordGrid` : la grille s'adapte à la longueur du mot (5, 6 ou 7 cases) et au nombre d'essais.
- Les animations (retournement des cases, tremblement au refus) sont maintenant visibles : les keyframes manquaient dans `index.css`.
- Une seule table de couleurs, partagée par la grille, le clavier et les règles.

## 4. Données

- `mots-6.json` et `mots-7.json` : nouvelles listes de mots courants de 6 et 7 lettres, avec leurs accents.
- La liste fournie (5 lettres) n'a pas d'accents. En fin de partie, le mot est recherché sur le Wiktionnaire pour afficher sa version accentuée et un lien valide.

## 5. Corrections

- Résolution des conflits de fusion entre les branches.
- Lint à zéro erreur.
- `vercel.json` ajouté : toutes les adresses fonctionnent en ligne, même en rafraîchissant la page.
- `npm test` se termine maintenant (`vitest run`) au lieu de rester en mode surveillance.
- Suppression des fichiers inutiles du modèle Vite, des `alert`, des blocs de test commentés.
- Fautes corrigées (« Prochain mot », « mystère », titre de l'onglet en français).

## 6. Tests

Nouveaux tests sur : le mot du jour (changement à minuit heure de Paris), le partage, le mode difficile, les classements et leurs filtres, les statistiques, les points avec bonus, le nombre d'essais selon la longueur, et la validité des listes de 6 et 7 lettres.

