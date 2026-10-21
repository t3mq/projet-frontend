export function normalizeWord(word) {
    return word
        .replace(/œ/g, "oe")
        .replace(/Œ/g, "OE")
        .replace(/æ/g, "ae")
        .replace(/Æ/g, "AE")
        .normalize("NFD") // sépare la lettre de son accent: "é" devient "e" + "´"
        .replace(/[\u0300-\u036f]/g, "") // supprime les accents
        .toUpperCase();
}