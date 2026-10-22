import Tile from "./Tile.jsx";

export default function Row({ letters, statuses, length, shake, invalid }) {
  return (
    <div className={`flex justify-center gap-1.5 ${shake ? "animate-shake" : ""}`}>
      {Array.from({ length }, (_, i) => (
        <Tile
          key={i}
          letter={letters[i] ?? ""}
          status={statuses?.[i]}
          delay={i * 300}
          invalid={invalid}
        />
      ))}
    </div>
  );
}