function byPointsThenDate(a, b) {
    return b.points - a.point || a.date.localeCompare(b.date);
}

export function getTopScores(history, { length, hard } = {}, limit = 10) {
    return history
        .filter((game) => length === undefined || (game.length ??  5) === length)
        .filter((game) => hard === undefined || (game.hard ?? false) === hard)
        .sort(byPointsThenDate)
        .slice(0, limit);
}

export function getDailyRanking(history, date, limit = 10) {
    return history
        .filter((game) => game.mode === "jour" && game.day === day)
        .sort((a, b) => b.points - a.points || a.durationMs - b.durationMs)
        .slice(0, limit);
}