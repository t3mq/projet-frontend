// Statistiques d'un joueur, recalculées depuis l'historique (jamais stockées).
// L'historique est dans l'ordre chronologique : la série en cours est celle de la fin.
export function computeStats(history, pseudo) {
  const games = history.filter((game) => game.pseudo === pseudo);
  const wins = games.filter((game) => game.status === "won");

  let streak = 0;
  let bestStreak = 0;
  for (const game of games) {
    if (game.status === "won") {
      streak++;
      bestStreak = Math.max(bestStreak, streak);
    } else {
      streak = 0;
    }
  }

  // Au moins 6 colonnes, plus si une victoire a pris 7 ou 8 essais (mots de 6 ou 7 lettres).
  const columns = Math.max(6, ...wins.map((game) => game.attempts));
  const distribution = Array(columns).fill(0);
  for (const game of wins) {
    distribution[game.attempts - 1]++;
  }

  return {
    played: games.length,
    winRate: games.length === 0 ? 0 : Math.round((wins.length / games.length) * 100),
    currentStreak: streak,
    bestStreak,
    totalPoints: games.reduce((sum, game) => sum + (game.points ?? 0), 0),
    distribution,
  };
}
