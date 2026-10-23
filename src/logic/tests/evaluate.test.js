import { describe, expect, it } from "vitest";
import { evaluateGuess, CORRECT as V, PRESENT as J, ABSENT as G } from "../evaluate";

describe("evaluateGuess", () => {
    it("mot trouvé : tout vert", () => {
        expect(evaluateGuess("ARBRE", "ARBRE")).toEqual([V, V, V, V, V]);
    });
    it("aucune lettre commune : tout gris", () => {
        expect(evaluateGuess("STYLO", "ARBRE")).toEqual([G, G, G, G, G]);
    });
    it("lettre en double : ERRER contre ARBRE (exemple du sujet)", () => {
        expect(evaluateGuess("ERRER", "ARBRE")).toEqual([J, V, J, G, G]);
    });
    it("lettre en double dans la proposition, une seule dans le mot", () => {
        expect(evaluateGuess("ELEVE", "CHIEN")).toEqual([J, G, G, G, G]);
    });
    it("un vert plus loin passe avant un jaune plus tôt", () => {
        expect(evaluateGuess("RRRRR", "TERRE")).toEqual([G, G, V, V, G]);
    });
    it("plusieurs jaune sur des lettres en doubles", () => {
        expect(evaluateGuess("RARES", "ARBRE")).toEqual([J, J, J, J, G]);
    });
});