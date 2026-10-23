import { describe, it, expect } from "vitest";
import { gameReducer, createGame, maxGuessesFor } from "../gameReducer";

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
describe("nombre d'essais selon la longueur", () => {
  it("longueur + 1 essais", () => {
    expect(maxGuessesFor(5)).toBe(6);
    expect(maxGuessesFor(6)).toBe(7);
    expect(maxGuessesFor(7)).toBe(8);
  });

  it("createGame stocke maxGuesses", () => {
    expect(createGame("arbre").maxGuesses).toBe(6);
    expect(createGame("cheval").maxGuesses).toBe(7);
  });

  it("un mot de 6 lettres n'est perdu qu'après 7 essais", () => {
    let state = createGame("cheval");
    for (let i = 0; i < 6; i++) state = play(state, "BATEAU");
    expect(state.status).toBe("playing");
    state = play(state, "BATEAU");
    expect(state.status).toBe("lost");
  });
});

describe("REVEAL", () => {
  it("remplace le mot affiché une fois la partie finie", () => {
    let state = play(createGame("ecole"), "ECOLE");
    state = gameReducer(state, { type: "REVEAL", word: "école" });
    expect(state.display).toBe("école");
  });
});
