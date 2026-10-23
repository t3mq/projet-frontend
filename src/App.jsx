import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Rules from "./pages/Rules";
import Scores from "./pages/Scores";
import Stats from "./pages/Stats";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jour" element={<Game mode="jour" />} />
      <Route path="/partie/:longueur" element={<Game mode="libre" />} />
      {/* Ancienne adresse sans longueur : 5 lettres par défaut */}
      <Route path="/partie" element={<Navigate to="/partie/5" replace />} />
      <Route path="/regles" element={<Rules />} />
      <Route path="/scores" element={<Scores />} />
      <Route path="/stats" element={<Stats />} />
      {/* Adresse inconnue : retour à l'accueil */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
