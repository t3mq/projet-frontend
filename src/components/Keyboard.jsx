const ROWS = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["ENTER", "W", "X", "C", "V", "B", "N", "DELETE"],
];

const LABELS = { ENTER: "Entrée", DELETE: "⌫" };

// Couleur de la touche selon l'état connu de la lettre.
const STATUS_CLASSES = {
  correct: "bg-green-600 text-white",
  present: "bg-yellow-500 text-white",
  absent: "bg-gray-500 text-white",
};

export default function Keyboard({
  statuses,
  onLetter,
  onEnter,
  onDelete,
  disabled,
}) {
  function handleClick(key) {
    if (key === "ENTER") onEnter();
    else if (key === "DELETE") onDelete();
    else onLetter(key);
  }

  return (
    <div className="mx-auto flex max-w-3xl w-full px-2 flex-col gap-2">
      {ROWS.map((row, i) => (
        <div className="flex justify-center gap-1.5" key={i}>
          {row.map((key) => {
            const color = STATUS_CLASSES[statuses[key]] ?? "bg-gray-300";
            const width = LABELS[key] ? "flex-[1.5] text-xs" : "flex-1";

            return (
              <button
                key={key}
                type="button"
                className={`h-14 rounded font-bold ${color} ${width} disabled:cursor-wait disabled:opacity-70`}
                onClick={() => handleClick(key)}
                onMouseDown={(e) => e.preventDefault()}
                disabled={disabled}
              >
                {LABELS[key] ?? key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
