// Les classements ne sont jamais stockés : ils sont recalculés depuis l'historique.

// Plus de points d'abord ; à égalité, la partie la plus ancienne passe devant.
function byPointsThenDate(a, b) {
  return b.points - a.points || a.date.localeCompare(b.date);
}

// Meilleures parties, avec filtres optionnels sur la longueur et le mode difficile.
// Les anciennes parties sans `length` / `hard` comptent comme 5 lettres / normal.
export function getTopScores(history, { length, hard } = {}, limit = 10) {
  return history
    .filter((game) => length === undefined || (game.length ?? 5) === length)
    .filter((game) => hard === undefined || (game.hard ?? false) === hard)
    .sort(byPointsThenDate)
    .slice(0, limit);
}

// Classement du mot du jour : à égalité de points, le plus rapide passe devant.
export function getDailyRanking(history, day, limit = 10) {
  return history
    .filter((game) => game.mode === "jour" && game.day === day)
    .sort((a, b) => b.points - a.points || a.durationMs - b.durationMs)
    .slice(0, limit);
}
