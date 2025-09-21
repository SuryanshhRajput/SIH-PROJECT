import React, { useState, useEffect } from "react";
import { RotateCcw, CheckCircle, XCircle, Star, Target } from "lucide-react";

interface DragItem {
  id: number;
  text: string;
  correctTarget: number;
  isPlaced: boolean;
  placedTarget?: number;
}

interface DropTarget {
  id: number;
  label: string;
  isCorrect: boolean;
  hasItem: boolean;
}

interface DragDropGameProps {
  items: { item: string; target: string }[];
  onComplete: (xp: number) => void;
  onClose: () => void;
}

const DragDropGame: React.FC<DragDropGameProps> = ({ items, onComplete, onClose }) => {
  const [dragItems, setDragItems] = useState<DragItem[]>([]);
  const [dropTargets, setDropTargets] = useState<DropTarget[]>([]);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [, setGameComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize game
  useEffect(() => {
    const newDragItems: DragItem[] = items.map((item, index) => ({
      id: index,
      text: item.item,
      correctTarget: index,
      isPlaced: false
    }));

    const newDropTargets: DropTarget[] = items.map((item, index) => ({
      id: index,
      label: item.target,
      isCorrect: false,
      hasItem: false
    }));

    setDragItems(newDragItems);
    setDropTargets(newDropTargets);
  }, [items]);

  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    setMoves(prev => prev + 1);

    // Update drag item
    setDragItems(prev => prev.map(item => 
      item.id === draggedItem.id 
        ? { ...item, isPlaced: true, placedTarget: targetId }
        : item
    ));

    // Update drop target
    setDropTargets(prev => prev.map(target => 
      target.id === targetId 
        ? { ...target, hasItem: true, isCorrect: draggedItem.correctTarget === targetId }
        : target
    ));

    setDraggedItem(null);

    // Check if game is complete
    const allPlaced = dragItems.every(item => item.isPlaced);
    if (allPlaced) {
      setGameComplete(true);
      setTimeout(() => setShowResult(true), 500);
    }
  };

  const resetGame = () => {
    setDragItems(prev => prev.map(item => ({ ...item, isPlaced: false, placedTarget: undefined })));
    setDropTargets(prev => prev.map(target => ({ ...target, isCorrect: false, hasItem: false })));
    setDraggedItem(null);
    setGameComplete(false);
    setShowResult(false);
    setMoves(0);
  };

  const calculateScore = () => {
    const correctPlacements = dropTargets.filter(target => target.isCorrect).length;
    const accuracy = (correctPlacements / items.length) * 100;
    const baseXP = 150;
    const bonusXP = Math.floor(accuracy / 10) * 10;
    return Math.min(baseXP + bonusXP, 200);
  };

  const getTargetStyle = (target: DropTarget) => {
    if (target.hasItem) {
      return target.isCorrect 
        ? "bg-green-100 border-green-300 text-green-800"
        : "bg-red-100 border-red-300 text-red-800";
    }
    return "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200";
  };

  const getItemStyle = (item: DragItem) => {
    if (item.isPlaced) {
      return "bg-blue-100 border-blue-300 text-blue-800 cursor-default";
    }
    return "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 cursor-move";
  };

  if (showResult) {
    const score = calculateScore();
    const correctPlacements = dropTargets.filter(target => target.isCorrect).length;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Well Done!</h2>
          <p className="text-gray-600 mb-4">You completed the drag & drop game!</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{moves}</div>
              <div className="text-sm text-blue-600">Moves</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{correctPlacements}/{items.length}</div>
              <div className="text-sm text-green-600">Correct</div>
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
      <div className="bg-white rounded-2xl p-6 max-w-6xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Drag & Drop Game</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Correct: {dropTargets.filter(t => t.isCorrect).length}/{items.length}
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Drag Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Drag these items:</h3>
            <div className="space-y-3">
              {dragItems.map((item) => (
                <div
                  key={item.id}
                  draggable={!item.isPlaced}
                  onDragStart={(e) => handleDragStart(e, item)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${getItemStyle(item)} ${
                    item.isPlaced ? 'opacity-50' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {!item.isPlaced && <Target className="w-5 h-5" />}
                    <span className="font-semibold">{item.text}</span>
                    {item.isPlaced && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drop Targets */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Drop them here:</h3>
            <div className="space-y-3">
              {dropTargets.map((target) => (
                <div
                  key={target.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, target.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${getTargetStyle(target)} ${
                    !target.hasItem ? 'hover:shadow-md' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{target.label}</span>
                    {target.hasItem && (
                      target.isCorrect ? 
                        <CheckCircle className="w-5 h-5 text-green-500" /> :
                        <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Drag the items from the left column to their correct targets on the right. Match each item with its corresponding description or category.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DragDropGame;
