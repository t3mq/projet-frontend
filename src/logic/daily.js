const START_DATE = Date.UTC(2026, 0, 1);
const DAY_MS = 24 * 60 * 60 * 1000;

// Date à Paris au format AAAA-MM-JJ.
// On passe par Intl et pas par toISOString() (UTC) ni getHours() (fuseau de l'ordinateur) :
// le mot doit changer à minuit heure de Paris, où que soit le joueur.
export function parisDateKey(date) {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

// Nombre de jours depuis le 1er janvier 2026 (jour 0), d'après la date à Paris.
// Date.UTC évite les décalages d'une heure aux changements d'heure.
export function dayNumber(date) {
  const [year, month, day] = parisDateKey(date).split("-").map(Number);
  return Math.round((Date.UTC(year, month - 1, day) - START_DATE) / DAY_MS);
}

// Même mot pour tout le monde le même jour. Le double modulo gère les jours négatifs.
export function getDailyWord(words, date) {
  const n = dayNumber(date);
  const len = words.length;
  return words[((n % len) + len) % len];
}
