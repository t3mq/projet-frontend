import { describe, it, expect } from "vitest";
import { gameReducer, createGame } from "./gameReducer";

// Petit utilitaire : tape un mot complet puis valide.
function play(state, word) {
  for (const letter of word) {
    state = gameReducer(state, { type: "ADD_LETTER", letter });
  }
  return gameReducer(state, { type: "SUBMIT" });
}

describe("gameReducer", () => {
  it("crée une partie avec le mot normalisé", () => {
    const state = createGame("école");
    expect(state.solution).toBe("ECOLE");
    expect(state.display).toBe("école");
  });

  it("ne dépasse pas la longueur du mot", () => {
    let state = createGame("arbre");
    for (const letter of "ARBRES") {
      state = gameReducer(state, { type: "ADD_LETTER", letter });
    }
    expect(state.current).toBe("ARBRE");
  });

  it("ignore ce qui n'est pas une lettre", () => {
    const state = gameReducer(createGame("arbre"), { type: "ADD_LETTER", letter: "1" });
    expect(state.current).toBe("");
  });

  it("efface la dernière lettre", () => {
    let state = createGame("arbre");
    state = gameReducer(state, { type: "ADD_LETTER", letter: "A" });
    state = gameReducer(state, { type: "REMOVE_LETTER" });
    expect(state.current).toBe("");
  });

  it("refuse une ligne incomplète", () => {
    let state = createGame("arbre");
    state = gameReducer(state, { type: "ADD_LETTER", letter: "A" });
    state = gameReducer(state, { type: "SUBMIT" });
    expect(state.guesses).toEqual([]);
  });

  it("détecte la victoire", () => {
    const state = play(createGame("arbre"), "ARBRE");
    expect(state.status).toBe("won");
  });

  it("détecte la défaite après 6 essais", () => {
    let state = createGame("arbre");
    for (let i = 0; i < 6; i++) state = play(state, "STYLO");
    expect(state.status).toBe("lost");
  });

  it("bloque la saisie une fois la partie finie", () => {
    let state = play(createGame("arbre"), "ARBRE");
    state = gameReducer(state, { type: "ADD_LETTER", letter: "A" });
    expect(state.current).toBe("");
  });
});