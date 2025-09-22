import React, { useRef, useEffect, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Play, Pause, RotateCcw } from "lucide-react";
import { User, AnimationState } from "../types";

interface LessonsPageProps {
  animationState: AnimationState;
  setAnimationState: (state: AnimationState | ((prev: AnimationState) => AnimationState)) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  addNotification: (message: string) => void;
}

const LessonsPage: React.FC<LessonsPageProps> = ({ animationState, setAnimationState, currentUser, setCurrentUser, users, setUsers, addNotification }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const animationRef = useRef<number | undefined>(undefined);

  // Draw free fall animation (kid-friendly)
  const drawFreeFall = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const canvas = canvasRef.current!;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw colorful sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 3; i++) {
      const cloudX = 50 + i * 150;
      const cloudY = 30 + Math.sin(time * 0.5 + i) * 5;
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 20, 0, Math.PI * 2);
      ctx.arc(cloudX + 25, cloudY, 25, 0, Math.PI * 2);
      ctx.arc(cloudX + 50, cloudY, 20, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw ground with grass
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, height - 60, width, 60);
    
    // Draw grass details
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    for (let i = 0; i < width; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, height - 60);
      ctx.lineTo(i + 5, height - 80);
      ctx.stroke();
    }
    
    // Calculate ball position (slower physics)
    const gravity = 2.0; // Much slower gravity
    const initialHeight = 80;
    const ballY = initialHeight + (0.5 * gravity * time * time) * 5; // Slower scaling
    const ballX = width / 2;
    
    // Draw ball with face (kid-friendly)
    const ballRadius = 20;
    const ballCenterY = Math.min(ballY, height - 60);
    
    // Ball shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.ellipse(ballX, height - 50, ballRadius + 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ball body
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(ballX, ballCenterY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Ball face
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(ballX - 5, ballCenterY - 5, 3, 0, Math.PI * 2);
    ctx.arc(ballX + 5, ballCenterY - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(ballX - 5, ballCenterY - 5, 1, 0, Math.PI * 2);
    ctx.arc(ballX + 5, ballCenterY - 5, 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Smile
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballCenterY, 8, 0, Math.PI);
    ctx.stroke();
    
    // Draw velocity vector (simplified for kids)
    if (ballY < height - 60) {
      const velocity = gravity * time * 5;
      ctx.strokeStyle = '#4ECDC4';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(ballX, ballCenterY);
      ctx.lineTo(ballX, Math.min(ballCenterY + velocity, height - 60));
      ctx.stroke();
      
      // Arrow head
      ctx.fillStyle = '#4ECDC4';
      ctx.beginPath();
      ctx.moveTo(ballX, Math.min(ballCenterY + velocity, height - 60));
      ctx.lineTo(ballX - 5, Math.min(ballCenterY + velocity - 10, height - 60));
      ctx.lineTo(ballX + 5, Math.min(ballCenterY + velocity - 10, height - 60));
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw info with kid-friendly styling
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`⏰ Time: ${time.toFixed(1)}s`, 15, 35);
    ctx.fillText(`📏 Height: ${Math.max(0, height - 60 - ballY).toFixed(0)}px`, 15, 60);
    ctx.fillText(`🚀 Speed: ${(gravity * time * 5).toFixed(0)} px/s`, 15, 85);
  }, []);

  // Draw projectile motion animation (kid-friendly)
  const drawProjectile = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const canvas = canvasRef.current!;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw colorful sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 4; i++) {
      const cloudX = 30 + i * 120;
      const cloudY = 20 + Math.sin(time * 0.3 + i) * 3;
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 15, 0, Math.PI * 2);
      ctx.arc(cloudX + 20, cloudY, 20, 0, Math.PI * 2);
      ctx.arc(cloudX + 40, cloudY, 15, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw ground with grass
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, height - 60, width, 60);
    
    // Draw grass details
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    for (let i = 0; i < width; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, height - 60);
      ctx.lineTo(i + 3, height - 75);
      ctx.stroke();
    }
    
    // Calculate projectile position (slower physics)
    const initialVelocity = 6; // Slower
    const angle = Math.PI / 4; // 45 degrees
    const gravity = 1.0; // Much slower gravity
    const startX = 50; // Starting position
    const startY = height - 100; // Starting height
    
    // Draw launch pad for rocket
    ctx.fillStyle = '#696969';
    ctx.fillRect(startX - 15, height - 60, 30, 10);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(startX - 10, height - 55, 20, 5);
    
    const x = startX + initialVelocity * Math.cos(angle) * time * 6; // Slower scaling
    const y = startY - (initialVelocity * Math.sin(angle) * time * 6 - 0.5 * gravity * time * time * 6);
    
    // Draw projectile as a cute rocket
    const rocketX = x;
    const rocketY = Math.max(y, height - 60);
    
    // Rocket body
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(rocketX - 8, rocketY - 15, 16, 20);
    
    // Rocket nose
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(rocketX, rocketY - 15);
    ctx.lineTo(rocketX - 8, rocketY - 5);
    ctx.lineTo(rocketX + 8, rocketY - 5);
    ctx.closePath();
    ctx.fill();
    
    // Rocket fins
    ctx.fillStyle = '#4ECDC4';
    ctx.fillRect(rocketX - 12, rocketY + 2, 8, 8);
    ctx.fillRect(rocketX + 4, rocketY + 2, 8, 8);
    
    // Rocket face
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(rocketX - 3, rocketY - 8, 2, 0, Math.PI * 2);
    ctx.arc(rocketX + 3, rocketY - 8, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(rocketX - 3, rocketY - 8, 1, 0, Math.PI * 2);
    ctx.arc(rocketX + 3, rocketY - 8, 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Smile
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(rocketX, rocketY - 3, 4, 0, Math.PI);
    ctx.stroke();
    
    // Draw trajectory path (dotted line)
    ctx.strokeStyle = '#FFB6C1';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    for (let t = 0; t <= time; t += 0.2) {
      const pathX = startX + initialVelocity * Math.cos(angle) * t * 6;
      const pathY = startY - (initialVelocity * Math.sin(angle) * t * 6 - 0.5 * gravity * t * t * 6);
      if (t === 0) {
        ctx.moveTo(pathX, Math.max(pathY, height - 60));
      } else {
        ctx.lineTo(pathX, Math.max(pathY, height - 60));
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw info with emojis
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`⏰ Time: ${time.toFixed(1)}s`, 15, 35);
    ctx.fillText(`➡️ X: ${x.toFixed(0)}px`, 15, 60);
    ctx.fillText(`⬆️ Y: ${Math.max(0, height - 60 - y).toFixed(0)}px`, 15, 85);
  }, []);

  // Draw uniform motion animation (kid-friendly)
  const drawUniform = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const canvas = canvasRef.current!;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw colorful sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
      const cloudX = 40 + i * 100;
      const cloudY = 25 + Math.sin(time * 0.4 + i) * 4;
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 18, 0, Math.PI * 2);
      ctx.arc(cloudX + 22, cloudY, 22, 0, Math.PI * 2);
      ctx.arc(cloudX + 44, cloudY, 18, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw ground with road
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, height - 60, width, 60);
    
    // Draw road
    ctx.fillStyle = '#696969';
    ctx.fillRect(0, height - 40, width, 20);
    
    // Draw road lines
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(0, height - 30);
    ctx.lineTo(width, height - 30);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Calculate object position (slower)
    const velocity = 2; // Much slower
    const x = (velocity * time * 8) % width; // Slower scaling
    const y = height - 50; // Position car on the road
    
    // Draw object as a cute car
    const carX = x;
    const carY = y - 20; // Position car above the road
    
    // Car body
    ctx.fillStyle = '#4ECDC4';
    ctx.fillRect(carX - 20, carY - 10, 40, 20);
    
    // Car roof
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(carX - 15, carY - 15, 30, 10);
    
    // Car wheels
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(carX - 12, carY + 8, 6, 0, Math.PI * 2);
    ctx.arc(carX + 12, carY + 8, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Car windows
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(carX - 12, carY - 12, 8, 6);
    ctx.fillRect(carX + 4, carY - 12, 8, 6);
    
    // Car face
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(carX - 8, carY - 5, 2, 0, Math.PI * 2);
    ctx.arc(carX + 8, carY - 5, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(carX - 8, carY - 5, 1, 0, Math.PI * 2);
    ctx.arc(carX + 8, carY - 5, 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Smile
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(carX, carY, 6, 0, Math.PI);
    ctx.stroke();
    
    // Draw velocity arrow
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(carX + 20, carY);
    ctx.lineTo(carX + 50, carY);
    ctx.stroke();
    
    // Arrow head
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.moveTo(carX + 50, carY);
    ctx.lineTo(carX + 40, carY - 5);
    ctx.lineTo(carX + 40, carY + 5);
    ctx.closePath();
    ctx.fill();
    
    // Draw info with emojis
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`⏰ Time: ${time.toFixed(1)}s`, 15, 35);
    ctx.fillText(`📍 Position: ${x.toFixed(0)}px`, 15, 60);
    ctx.fillText(`🚗 Speed: ${velocity} px/s`, 15, 85);
  }, []);

  // Optimized animation loop (slower for kids)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;
    let animationId: number;
    
    const animate = (currentTime: number) => {
      if (animationState.isPlaying) {
        // Slow down animation - only update every 100ms instead of every frame
        if (currentTime - lastTime > 100) {
          setAnimationState(prev => ({ ...prev, time: prev.time + 0.05 })); // Slower time increment
          lastTime = currentTime;
        }
      }

      // Draw based on selected demo
      switch (animationState.selectedDemo) {
        case 'freefall':
          drawFreeFall(ctx, animationState.time);
          break;
        case 'projectile':
          drawProjectile(ctx, animationState.time);
          break;
        case 'uniform':
          drawUniform(ctx, animationState.time);
          break;
      }

      if (animationState.isPlaying) {
        animationId = requestAnimationFrame(animate);
      }
    };

    // Start animation
    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [animationState.isPlaying, animationState.selectedDemo, animationState.time, setAnimationState]);

  // Draw initial frame when paused
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!animationState.isPlaying) {
      switch (animationState.selectedDemo) {
        case 'freefall':
          drawFreeFall(ctx, animationState.time);
          break;
        case 'projectile':
          drawProjectile(ctx, animationState.time);
          break;
        case 'uniform':
          drawUniform(ctx, animationState.time);
          break;
      }
    }
  }, [animationState.selectedDemo, animationState.time, animationState.isPlaying]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
        <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">{t('lessons.title')}</h2>
        <p className="text-xl text-white/90">{t('lessons.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">{t('lessons.motion_animation')}</h3>

          <div className="mb-6">
            <select
              value={animationState.selectedDemo}
              onChange={(e) => setAnimationState((prev) => ({ ...prev, selectedDemo: e.target.value as 'freefall' | 'projectile' | 'uniform' }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 font-medium"
            >
              <option value="freefall">{t('lessons.free_fall')}</option>
              <option value="projectile">{t('lessons.projectile')}</option>
              <option value="uniform">{t('lessons.uniform')}</option>
            </select>
          </div>

          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            className="border-2 border-gray-200 rounded-2xl mb-6 w-full shadow-lg"
          />

          <div className="flex space-x-4">
            <button
              onClick={() => setAnimationState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
              className="flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              {animationState.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{animationState.isPlaying ? t('lessons.pause') : t('lessons.play')}</span>
            </button>

            <button
              onClick={() => setAnimationState((prev) => ({ ...prev, isPlaying: false, time: 0 }))}
              className="flex items-center space-x-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{t('lessons.reset')}</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">{t('lessons.theory')}</h3>

          {animationState.selectedDemo === "freefall" && (
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Free Fall Motion:</strong> When an object falls under the influence of gravity alone, it
                experiences constant acceleration of 9.8 m/s² downward.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{t('lessons.key_eq')}</h4>
                <ul className="space-y-2 text-sm">
                  <li>• v = u + gt</li>
                  <li>• h = ut + ½gt²</li>
                  <li>• v² = u² + 2gh</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                Where: v = final velocity, u = initial velocity, g = acceleration due to gravity, t = time, h = height
              </p>
            </div>
          )}

          <button
            onClick={() => {
              const updatedUser: User = {
                ...currentUser,
                progress: {
                  completedLessons: Math.min((currentUser.progress?.completedLessons || 0) + 1, 5),
                  totalScore: currentUser.progress?.totalScore || 0,
                  quizScores: currentUser.progress?.quizScores || [],
                  xp: currentUser.progress?.xp || 0,
                  level: currentUser.progress?.level || 1,
                  badges: currentUser.progress?.badges || [],
                  completedChapters: currentUser.progress?.completedChapters || [],
                  completedQuizzes: currentUser.progress?.completedQuizzes || [],
                  completedGames: currentUser.progress?.completedGames || [],
                  streak: currentUser.progress?.streak || 0,
                  lastActiveDate: currentUser.progress?.lastActiveDate || new Date().toISOString(),
                },
              };
              setCurrentUser(updatedUser);
              setUsers((users || []).map((u) => (u.id === updatedUser.id ? updatedUser : u)));
              addNotification(t('lessons.completed_toast'));
            }}
            className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-xl font-semibold text-lg"
          >
            {t('lessons.mark_complete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;
