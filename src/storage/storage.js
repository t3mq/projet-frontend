export const PSEUDO_KEY = "joueur";

export function readJSON(key, defaultValue) {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? defaultValue: JSON.parse(raw);
    } catch (e) {
        return defaultValue;
    }
}

export function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}