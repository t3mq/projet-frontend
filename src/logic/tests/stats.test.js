import { describe, it, expect } from "vitest";
import { computeStats } from "../stats.js";

function game(status, attempts, points, pseudo = "A") {
  return { pseudo, status, attempts, points };
}

describe("computeStats", () => {
  it("joueur sans partie", () => {
    expect(computeStats([], "A")).toEqual({
      played: 0,
      winRate: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalPoints: 0,
      distribution: [0, 0, 0, 0, 0, 0],
    });
  });

  it("ne compte que les parties du joueur", () => {
    const history = [game("won", 2, 500), game("won", 1, 600, "B")];
    expect(computeStats(history, "A").played).toBe(1);
  });

  it("calcule le taux de victoire arrondi et les points", () => {
    const history = [game("won", 3, 400), game("lost", 6, 0), game("won", 1, 600)];
    const stats = computeStats(history, "A");
    expect(stats.winRate).toBe(67);
    expect(stats.totalPoints).toBe(1000);
  });

  it("calcule la série en cours et la meilleure série", () => {
    const history = [
      game("won", 3, 400),
      game("won", 3, 400),
      game("won", 3, 400),
      game("lost", 6, 0),
      game("won", 2, 500),
    ];
    const stats = computeStats(history, "A");
    expect(stats.currentStreak).toBe(1);
    expect(stats.bestStreak).toBe(3);
  });

  it("répartition des victoires par nombre d'essais", () => {
    const history = [game("won", 2, 500), game("won", 2, 500), game("won", 4, 300)];
    expect(computeStats(history, "A").distribution).toEqual([0, 2, 0, 1, 0, 0]);
  });

  it("ajoute des colonnes pour les victoires en 7 ou 8 essais", () => {
    const history = [game("won", 8, 200)];
    expect(computeStats(history, "A").distribution).toHaveLength(8);
  });
});
