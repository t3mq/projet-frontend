import { describe, expect, it } from "vitest";
import { normalizeWord } from "./normalize";

describe("normalizeWord", () => {
    it("retire les accents", () => {
        expect(normalizeWord("école")).toBe("ECOLE");
        expect(normalizeWord("Noël")).toBe("NOEL");
    });
    it("replace la signature œ", () => {
        expect(normalizeWord("cœur")).toBe("COEUR");
    })
})