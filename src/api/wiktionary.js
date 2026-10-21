import { normalizeWord } from "../logic/normalize.js";

const API_URL = "https://fr.wiktionary.org/w/api.php";
const USER_AGENT = "LeMotMystere/1.0 (projet etudiant; contact: clemvanker@gmail.com)";
const TIMEOUT_MS = 5000;

// Lien vers la page d'un mot (pour l'écran de fin).
export function wiktionaryUrl(word) {
    return `https://fr.wiktionary.org/wiki/${encodeURIComponent(word)}`;
}

// Trouve un mot français qui correspond à la proposition.
export function findFrenchWord(pages, guess) {
    const match = pages.find(
        (page) =>
            page.title === page.title.toLowerCase() &&
            normalizeWord(page.title) === guess &&
            page.categories?.length > 0
    );
    return match ? match.title : null;
}

// Vérifie une proposition auprès du Wiktionnaire.
// Renvoie le mot avec ses accents ("école") ou null si refusé.
// Lance une erreur si l'API ne répond pas (réseau, timeout, erreur serveur).
export async function checkWord(guess) {
    const params = new URLSearchParams({
        action: "query",
        generator: "search",
        gsrsearch: `intitle:${guess.toLowerCase()}`,
        gsrnamespace: "0",
        gsrlimit: "50",
        prop: "categories",
        clcategories: "Catégorie:français",
        cllimit: "max",
        format: "json",
        formatversion: "2",
        origin: "*",
    });

    const response = await fetch(`${API_URL}?${params}`, {
        headers: { "Api-User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
        throw new Error(`Wiktionnaire : erreur ${response.status}`);
    }

    const data = await response.json();
    const pages = data.query?.pages ?? [];
    return findFrenchWord(pages, guess);
}