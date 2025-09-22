// components/games/ProjectileGame.tsx
import React, { useRef, useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface ProjectileGameProps {
  goBack: () => void;
}

const ProjectileGame: React.FC<ProjectileGameProps> = ({ goBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const g = 9.8;
    const rad = (angle * Math.PI) / 180;
    const vx = speed * Math.cos(rad);
    const vy = speed * Math.sin(rad);

    const animate = () => {
      if (!isPlaying) return;
      setTime((t) => t + 0.1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#654321";
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

      const x = vx * time;
      const y = vy * time - 0.5 * g * time * time;

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x + 50, canvas.height - (y + 20), 10, 0, 2 * Math.PI);
      ctx.fill();

      if (y >= 0) requestAnimationFrame(animate);
    };

    animate();
  }, [isPlaying, time, angle, speed]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{t('projectile.title')}</h3>
      <canvas ref={canvasRef} width={600} height={400} className="border mb-4" />

      <div className="flex space-x-4 mb-4">
        <label>
          {t('projectile.angle')}: 
          <input type="range" min="10" max="80" value={angle} onChange={(e) => setAngle(+e.target.value)} />
        </label>
        <label>
          {t('projectile.speed')}: 
          <input type="range" min="10" max="100" value={speed} onChange={(e) => setSpeed(+e.target.value)} />
        </label>
      </div>

      <button onClick={() => { setIsPlaying(true); setTime(0); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        {t('projectile.launch')}
      </button>
      <button onClick={goBack} className="ml-4 bg-gray-600 text-white px-4 py-2 rounded-lg">
        {t('projectile.back')}
      </button>
    </div>
  );
};

export default ProjectileGame;
