import { MAX_GUESSES } from "./gameReducer.js";

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

    const distribution = Array(MAX_GUESSES).fill(0);
    for (const game of wins) {
        distribution[game.attempts - 1]++;
    }

    return {
        played: games.length,
        winRate: games.length === 0 ? 0 : Math.round((wins.length / games.length) * 100),
        currentStreak: streak,
        bestStreak,
        totalPoints: games.reduce((sum, game) => sum + game.points, 0)
        distribution,
    };
}