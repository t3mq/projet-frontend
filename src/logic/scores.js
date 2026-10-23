export function getTopScores(history, limit = 10) {
    return [...history]
        .sort((a, b) => b.points - a.points || a.date.localeCompare(b.date))
        .slice(0, limit);
}