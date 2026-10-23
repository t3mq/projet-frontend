const START_DATE = Date.UTC(2026, 0, 1);
const DAY_MS = 24 * 60 * 60 * 1000;

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

export function dayNumber(date) {
    const [year, month, day] = parisDateKey(date).split("-").map(Number);
    return Math.round((Date.UTC(year, month - 1, day) - START_DATE) / DAY_MS) + 1;
}

export function getDailyWord(words, date) {
    const n = dayNumber(date);
    const index = ((n % words.length) + words.length) + words.length;
    return words[index];
}