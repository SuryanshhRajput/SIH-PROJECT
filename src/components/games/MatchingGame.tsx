import React, { useState, useEffect } from "react";
import { RotateCcw, XCircle, Star } from "lucide-react";

interface MatchingItem {
  id: number;
  text: string;
  matched: boolean;
  flipped: boolean;
}

interface MatchingGameProps {
  items: { left: string; right: string }[];
  onComplete: (xp: number) => void;
  onClose: () => void;
}

const MatchingGame: React.FC<MatchingGameProps> = ({ items, onComplete, onClose }) => {
  const [gameItems, setGameItems] = useState<MatchingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [, setGameComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Initialize game items
  useEffect(() => {
    const leftItems = items.map((item, index) => ({
      id: index * 2,
      text: item.left,
      matched: false,
      flipped: false
    }));
    
    const rightItems = items.map((item, index) => ({
      id: index * 2 + 1,
      text: item.right,
      matched: false,
      flipped: false
    }));

    const allItems = [...leftItems, ...rightItems].sort(() => Math.random() - 0.5);
    setGameItems(allItems);
  }, [items]);

  const handleItemClick = (itemId: number) => {
    if (selectedItems.length >= 2 || gameItems.find(item => item.id === itemId)?.flipped) {
      return;
    }

    const newSelectedItems = [...selectedItems, itemId];
    setSelectedItems(newSelectedItems);

    // Flip the item
    setGameItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, flipped: true } : item
    ));

    if (newSelectedItems.length === 2) {
      setMoves(prev => prev + 1);
      
      // Check for match
      const [firstId, secondId] = newSelectedItems;
      const firstItem = gameItems.find(item => item.id === firstId);
      const secondItem = gameItems.find(item => item.id === secondId);
      
      if (firstItem && secondItem) {
        const firstOriginalIndex = Math.floor(firstId / 2);
        const secondOriginalIndex = Math.floor(secondId / 2);
        
        if (firstOriginalIndex === secondOriginalIndex) {
          // Match found!
          setMatches(prev => prev + 1);
          setGameItems(prev => prev.map(item => 
            item.id === firstId || item.id === secondId 
              ? { ...item, matched: true }
              : item
          ));
          
          if (matches + 1 === items.length) {
            setGameComplete(true);
            setTimeout(() => setShowResult(true), 500);
          }
        } else {
          // No match, flip back after delay
          setTimeout(() => {
            setGameItems(prev => prev.map(item => 
              item.id === firstId || item.id === secondId 
                ? { ...item, flipped: false }
                : item
            ));
          }, 1000);
        }
      }
      
      setSelectedItems([]);
    }
  };

  const resetGame = () => {
    setGameItems(prev => prev.map(item => ({ ...item, flipped: false, matched: false })));
    setSelectedItems([]);
    setMatches(0);
    setMoves(0);
    setGameComplete(false);
    setShowResult(false);
  };

  const calculateScore = () => {
    const accuracy = (matches / moves) * 100;
    const baseXP = 150;
    const bonusXP = Math.floor(accuracy / 10) * 10;
    return Math.min(baseXP + bonusXP, 200);
  };

  const getItemStyle = (item: MatchingItem) => {
    if (item.matched) {
      return "bg-green-100 border-green-300 text-green-800";
    }
    if (item.flipped) {
      return "bg-blue-100 border-blue-300 text-blue-800";
    }
    return "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200";
  };

  if (showResult) {
    const score = calculateScore();
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Great Job!</h2>
          <p className="text-gray-600 mb-4">You completed the matching game!</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{moves}</div>
              <div className="text-sm text-blue-600">Moves</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{matches}</div>
              <div className="text-sm text-green-600">Matches</div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold text-yellow-600">{score} XP Earned!</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={() => {
                onComplete(score);
                onClose();
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Matching Game</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Matches: {matches}/{items.length}
            </div>
            <div className="text-sm text-gray-600">
              Moves: {moves}
            </div>
            <button
              onClick={resetGame}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gameItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              disabled={item.matched || item.flipped}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${getItemStyle(item)} ${
                item.matched ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="text-center">
                {item.flipped || item.matched ? (
                  <div className="font-semibold">{item.text}</div>
                ) : (
                  <div className="text-2xl">?</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Click on two cards to flip them. Match the items on the left with their corresponding items on the right. Complete all matches to win!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchingGame;
