function parisTime(date) {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type) => Number(parts.find((p) => p.type === type).value);
  return { hours: get("hour"), minutes: get("minute"), seconds: get("second") };
}

export function secondsUntilParisMidnight(date) {
  const { hours, minutes, seconds } = parisTime(date);
  return 24 * 3600 - (hours * 3600 + minutes * 60 + seconds);
}

export function formatCountdown(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}