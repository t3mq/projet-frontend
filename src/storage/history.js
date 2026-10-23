import { readJSON, writeJSON } from "./storage.js";

const HISTORY_KEY = "history";

export function loadHistory() {
    const history = readJSON(HISTORY_KEY, []);
    return Array.isArray(history) ? history : [];
}

export function addGame(game) {
    writeJSON(HISTORY_KEY, [...loadHistory(), game]);
}