import { describe, it, expect } from "vitest";
import { getTopScores, getDailyRanking } from "./scores.js";

function game(points, date, extra = {}) {
  return { pseudo: "A", points, date, ...extra };
}

describe("getTopScores", () => {
  it("trie par points décroissants", () => {
    const top = getTopScores([game(100, "2026-10-01"), game(500, "2026-10-02"), game(300, "2026-10-03")]);
    expect(top.map((g) => g.points)).toEqual([500, 300, 100]);
  });

  it("à égalité de points, la partie la plus ancienne passe devant", () => {
    const top = getTopScores([game(400, "2026-10-05"), game(400, "2026-10-01")]);
    expect(top.map((g) => g.date)).toEqual(["2026-10-01", "2026-10-05"]);
  });

  it("garde seulement les dix meilleures", () => {
    const history = Array.from({ length: 15 }, (_, i) => game(i * 10, `2026-10-${10 + i}`));
    expect(getTopScores(history)).toHaveLength(10);
  });

  it("ne modifie pas l'historique d'origine", () => {
    const history = [game(100, "2026-10-01"), game(500, "2026-10-02")];
    getTopScores(history);
    expect(history[0].points).toBe(100);
  });

  it("filtre par longueur et par mode difficile", () => {
    const history = [
      game(600, "2026-10-01"),
      game(900, "2026-10-02", { length: 6 }),
      game(750, "2026-10-03", { hard: true }),
    ];
    expect(getTopScores(history, { length: 6 }).map((g) => g.points)).toEqual([900]);
    expect(getTopScores(history, { hard: true }).map((g) => g.points)).toEqual([750]);
    expect(getTopScores(history, { length: 5 }).map((g) => g.points)).toEqual([750, 600]);
  });
});

describe("getDailyRanking", () => {
  const history = [
    game(400, "2026-10-23T08:00", { mode: "jour", day: "2026-10-23", durationMs: 90000 }),
    game(400, "2026-10-23T09:00", { mode: "jour", day: "2026-10-23", durationMs: 30000 }),
    game(600, "2026-10-22T09:00", { mode: "jour", day: "2026-10-22", durationMs: 10000 }),
    game(600, "2026-10-23T10:00", { mode: "libre" }),
  ];

  it("ne garde que les parties du jour demandé en mode mot du jour", () => {
    expect(getDailyRanking(history, "2026-10-23")).toHaveLength(2);
  });

  it("à égalité de points, le plus rapide passe devant", () => {
    const ranking = getDailyRanking(history, "2026-10-23");
    expect(ranking.map((g) => g.durationMs)).toEqual([30000, 90000]);
  });
});