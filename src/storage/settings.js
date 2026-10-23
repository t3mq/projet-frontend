import { readJSON, writeJSON } from "./storage.js";

const SETTINGS_KEY = "reglages";
const DEFAULT_SETTINGS = { length: 5, hard: false };

// Réglages de la partie libre : longueur du mot et mode difficile.
// On complète avec les valeurs par défaut si un champ manque.
export function loadSettings() {
  return { ...DEFAULT_SETTINGS, ...readJSON(SETTINGS_KEY, {}) };
}

export function saveSettings(settings) {
  writeJSON(SETTINGS_KEY, settings);
}
