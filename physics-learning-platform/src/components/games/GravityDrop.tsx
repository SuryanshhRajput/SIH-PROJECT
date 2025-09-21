// components/games/GravityDrop.tsx
import React, { useRef, useEffect, useState } from "react";

interface GravityDropProps {
  goBack: () => void;
}

const GravityDrop: React.FC<GravityDropProps> = ({ goBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [height, setHeight] = useState(100);
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw ground
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
      
      // Draw ball
      const ballX = canvas.width / 2;
      const ballY = canvas.height - 20 - height;
      
      ctx.fillStyle = "#FF6B6B";
      ctx.beginPath();
      ctx.arc(ballX, ballY, 15, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw trajectory
      ctx.strokeStyle = "#4ECDC4";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX + velocity * 2, ballY + height);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw info
      ctx.fillStyle = "#333";
      ctx.font = "14px Arial";
      ctx.fillText(`Height: ${height.toFixed(1)}m`, 10, 30);
      ctx.fillText(`Velocity: ${velocity.toFixed(1)} m/s`, 10, 50);
      ctx.fillText(`Time: ${time.toFixed(1)}s`, 10, 70);
    };

    draw();
  }, [height, velocity, time]);

  useEffect(() => {
    let animationId: number;
    
    if (isPlaying) {
      const animate = () => {
        setTime(prev => {
          const newTime = prev + 0.016; // ~60fps
          const g = 9.8; // gravity
          const newHeight = Math.max(0, 100 - 0.5 * g * newTime * newTime);
          const newVelocity = g * newTime;
          
          setHeight(newHeight);
          setVelocity(newVelocity);
          
          if (newHeight <= 0) {
            setIsPlaying(false);
            return 0;
          }
          
          return newTime;
        });
        
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setHeight(100);
    setVelocity(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gravity Drop Simulation</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={reset}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Reset
          </button>
          <button
            onClick={goBack}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Games
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            Watch how gravity affects a falling object! The ball starts at 100m height.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Height</h3>
            <p className="text-2xl font-bold text-blue-600">{height.toFixed(1)}m</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Velocity</h3>
            <p className="text-2xl font-bold text-green-600">{velocity.toFixed(1)} m/s</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Time</h3>
            <p className="text-2xl font-bold text-purple-600">{time.toFixed(1)}s</p>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Physics Concepts:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>Free Fall:</strong> Object falling under gravity alone</li>
            <li>• <strong>Acceleration:</strong> Constant 9.8 m/s² downward</li>
            <li>• <strong>Equations:</strong> h = h₀ - ½gt², v = gt</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GravityDrop;
