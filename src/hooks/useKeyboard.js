import { useEffect } from "react";
import { normalizeWord } from "../logic/normalize.js";

export function useKeyboard(onKey) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return; // raccourcis du navigateur

      if (e.key === "Enter") onKey("ENTER");
      else if (e.key === "Backspace") onKey("DELETE");
      else {
        const letter = normalizeWord(e.key); // "é" tapé en AZERTY devient "E"
        if (/^[A-Z]$/.test(letter)) onKey(letter);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onKey]);
}