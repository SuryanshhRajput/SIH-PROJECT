import React, { useRef } from "react";
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
  const canvasRef = useRef(null);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
        <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">Interactive Physics Lessons 🎯</h2>
        <p className="text-xl text-white/90">Learn physics through hands-on animations and simulations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Motion Animation</h3>

          <div className="mb-6">
            <select
              value={animationState.selectedDemo}
              onChange={(e) => setAnimationState((prev) => ({ ...prev, selectedDemo: e.target.value as 'freefall' | 'projectile' | 'uniform' }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 font-medium"
            >
              <option value="freefall">Free Fall Motion</option>
              <option value="projectile">Projectile Motion</option>
              <option value="uniform">Uniform Motion</option>
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
              <span>{animationState.isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              onClick={() => setAnimationState((prev) => ({ ...prev, isPlaying: false, time: 0 }))}
              className="flex items-center space-x-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Theory</h3>

          {animationState.selectedDemo === "freefall" && (
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Free Fall Motion:</strong> When an object falls under the influence of gravity alone, it
                experiences constant acceleration of 9.8 m/s² downward.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Key Equations:</h4>
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
                },
              };
              setCurrentUser(updatedUser);
              setUsers((users || []).map((u) => (u.id === updatedUser.id ? updatedUser : u)));
              addNotification("Lesson completed! Great job!");
            }}
            className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-xl font-semibold text-lg"
          >
            ✅ Mark as Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;
