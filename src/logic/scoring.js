export const POINTS = [600, 500, 400, 300, 200, 100];

export function getPoints(status, attempts) {
    if (status !== "won") return 0;
    return POINTS[attempts - 1];
}