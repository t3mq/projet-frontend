import { STATUS_CLASSES } from "./statusClasses.js";

export default function Tile({ letter, status, delay, invalid }) {
  let color = "border-gray-300";
  if (status) color = `${STATUS_CLASSES[status]} animate-flip`;
  else if (invalid) color = "border-red-500";
  else if (letter) color = "border-gray-500";

  return (
    <div
      className={`flex h-14 w-14 items-center justify-center border-2 text-2xl font-bold ${color}`}
      style={status ? { animationDelay: `${delay}ms` } : undefined}
    >
      {letter}
    </div>
  );
}