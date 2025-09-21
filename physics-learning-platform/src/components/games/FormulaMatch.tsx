// components/games/FormulaMatch.tsx
import React, { useState } from "react";

interface FormulaMatchProps {
  goBack: () => void;
}

const FormulaMatch: React.FC<FormulaMatchProps> = ({ goBack }) => {
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
  const [matches, setMatches] = useState<{[key: string]: string}>({});

  const formulas = [
    { id: "fma", formula: "F = ma", description: "Newton's Second Law" },
    { id: "ke", formula: "KE = ½mv²", description: "Kinetic Energy" },
    { id: "pe", formula: "PE = mgh", description: "Potential Energy" },
    { id: "v2u2", formula: "v² = u² + 2as", description: "Kinematic Equation" },
    { id: "p", formula: "p = mv", description: "Momentum" },
    { id: "w", formula: "W = Fd", description: "Work" },
  ];

  const handleFormulaClick = (formulaId: string) => {
    if (selectedFormula === null) {
      setSelectedFormula(formulaId);
    } else if (selectedFormula === formulaId) {
      setSelectedFormula(null);
    } else {
      // Check for match
      const formula = formulas.find(f => f.id === formulaId);
      const selectedFormulaObj = formulas.find(f => f.id === selectedFormula);
      
      if (formula && selectedFormulaObj) {
        if (formula.id === selectedFormulaObj.id) {
          setMatches(prev => ({ ...prev, [formulaId]: selectedFormulaObj.description }));
          setScore(prev => prev + 10);
          setSelectedFormula(null);
        } else {
          setSelectedFormula(formulaId);
        }
      }
    }
  };

  const handleDescriptionClick = (description: string) => {
    if (selectedDescription === null) {
      setSelectedDescription(description);
    } else if (selectedDescription === description) {
      setSelectedDescription(null);
    } else {
      // Check for match
      const formula = formulas.find(f => f.description === description);
      const selectedFormulaObj = formulas.find(f => f.description === selectedDescription);
      
      if (formula && selectedFormulaObj) {
        if (formula.description === selectedFormulaObj.description) {
          setMatches(prev => ({ ...prev, [formula.id]: description }));
          setScore(prev => prev + 10);
          setSelectedDescription(null);
        } else {
          setSelectedDescription(description);
        }
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentLevel(1);
    setSelectedFormula(null);
    setSelectedDescription(null);
    setMatches({});
  };

  const isMatched = (formulaId: string) => {
    return matches[formulaId] !== undefined;
  };

  const isDescriptionMatched = (description: string) => {
    return Object.values(matches).includes(description);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Formula Match Game</h2>
        <div className="flex space-x-4">
          <span className="text-lg font-semibold">Score: {score}</span>
          <button
            onClick={resetGame}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Reset
          </button>
          <button
            onClick={goBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Games
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            Match each physics formula with its correct description!
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(matches).length / formulas.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {Object.keys(matches).length} / {formulas.length} matches found
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulas Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Physics Formulas</h3>
            <div className="space-y-3">
              {formulas.map((formula) => (
                <button
                  key={formula.id}
                  onClick={() => handleFormulaClick(formula.id)}
                  disabled={isMatched(formula.id)}
                  className={`w-full p-4 rounded-lg border-2 transition ${
                    selectedFormula === formula.id
                      ? "border-blue-500 bg-blue-50"
                      : isMatched(formula.id)
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 hover:border-gray-400"
                  } disabled:cursor-not-allowed`}
                >
                  <div className="text-xl font-mono">{formula.formula}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Descriptions Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Descriptions</h3>
            <div className="space-y-3">
              {formulas.map((formula) => (
                <button
                  key={formula.id}
                  onClick={() => handleDescriptionClick(formula.description)}
                  disabled={isDescriptionMatched(formula.description)}
                  className={`w-full p-4 rounded-lg border-2 transition ${
                    selectedDescription === formula.description
                      ? "border-blue-500 bg-blue-50"
                      : isDescriptionMatched(formula.description)
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 hover:border-gray-400"
                  } disabled:cursor-not-allowed`}
                >
                  <div className="text-sm">{formula.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {Object.keys(matches).length === formulas.length && (
          <div className="mt-8 text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">🎉 Congratulations!</h3>
              <p>You've matched all formulas correctly!</p>
              <p className="text-sm mt-2">Final Score: {score} points</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulaMatch;
