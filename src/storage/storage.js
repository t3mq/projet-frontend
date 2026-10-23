// Clé du pseudo (une simple chaîne). On n'utilise plus l'ancienne clé "joueur"
// qui contenait un objet { nom } : changer de clé évite de lire un ancien format.
export const PSEUDO_KEY = "pseudo";

// Lit une valeur JSON. Renvoie la valeur par défaut si rien n'est stocké,
// si le JSON est abîmé ou si le localStorage est bloqué par le navigateur.
export function readJSON(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? defaultValue : JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

// Écrit une valeur en JSON. Si le stockage est plein ou bloqué, on ne casse pas le jeu.
export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // rien à faire : la partie continue, elle ne sera simplement pas sauvegardée
  }
}
