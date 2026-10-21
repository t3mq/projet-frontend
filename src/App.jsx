import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Rules from "./pages/Rules";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/partie" element={<Game />} />
      <Route path="/regles" element={<Rules />} />
    </Routes>
  )
}