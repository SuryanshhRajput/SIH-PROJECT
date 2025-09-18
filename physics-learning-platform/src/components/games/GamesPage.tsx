// GamesPage.tsx
import React, { useState } from "react";
import ProjectileGame from "./ProjectileGame";
import FormulaMatch from "./FormulaMatch";

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState("menu");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Physics Games 🎮</h2>

      {selectedGame === "menu" && (
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setSelectedGame("projectile")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition"
          >
            🚀 Projectile Motion
          </button>

          <button
            onClick={() => setSelectedGame("formula")}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition"
          >
            📐 Formula Match
          </button>
        </div>
      )}

      {selectedGame === "projectile" && <ProjectileGame goBack={() => setSelectedGame("menu")} />}
      {selectedGame === "formula" && <FormulaMatch goBack={() => setSelectedGame("menu")} />}
    </div>
  );
};

export default GamesPage;
