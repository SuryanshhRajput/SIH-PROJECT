import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Trophy, Star, Award, Crown, Medal } from "lucide-react";
import { UserProgress, Badge, LeaderboardEntry } from "../types";

interface GamificationSystemProps {
  currentUser: any;
  onProgressUpdate: (progress: UserProgress) => void;
}

const GamificationSystem: React.FC<GamificationSystemProps> = ({ 
  currentUser, 
  onProgressUpdate 
}) => {
  const [progress, setProgress] = useState<UserProgress>({
    xp: currentUser?.progress?.xp || 0,
    level: currentUser?.progress?.level || 1,
    badges: currentUser?.progress?.badges || [],
    completedChapters: currentUser?.progress?.completedChapters || [],
    completedQuizzes: currentUser?.progress?.completedQuizzes || [],
    completedGames: currentUser?.progress?.completedGames || [],
    streak: currentUser?.progress?.streak || 0,
    lastActiveDate: currentUser?.progress?.lastActiveDate || new Date().toISOString()
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [leaderboard] = useState<LeaderboardEntry[]>([]);
  const [showBadges, setShowBadges] = useState(false);

  // Calculate level from XP
  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 1000) + 1;
  };

  // Calculate XP needed for next level
  const getXPForNextLevel = (currentLevel: number) => {
    return currentLevel * 1000;
  };

  // Calculate progress to next level
  const getProgressToNextLevel = (xp: number, level: number) => {
    const currentLevelXP = (level - 1) * 1000;
    const nextLevelXP = level * 1000;
    const progressXP = xp - currentLevelXP;
    const totalNeeded = nextLevelXP - currentLevelXP;
    return (progressXP / totalNeeded) * 100;
  };

  // Available badges
  const availableBadges: Omit<Badge, 'earnedAt'>[] = useMemo(() => [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first chapter",
      icon: "👶",
      category: "chapter"
    },
    {
      id: 2,
      name: "Quiz Master",
      description: "Complete 5 quizzes",
      icon: "🧠",
      category: "quiz"
    },
    {
      id: 3,
      name: "Game Champion",
      description: "Complete 10 games",
      icon: "🎮",
      category: "game"
    },
    {
      id: 4,
      name: "Streak Master",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      category: "streak"
    },
    {
      id: 5,
      name: "Math Genius",
      description: "Complete all math chapters",
      icon: "➗",
      category: "special"
    },
    {
      id: 6,
      name: "Science Explorer",
      description: "Complete all science chapters",
      icon: "🔬",
      category: "special"
    },
    {
      id: 7,
      name: "Level 10 Hero",
      description: "Reach level 10",
      icon: "🏆",
      category: "special"
    },
    {
      id: 8,
      name: "Perfect Score",
      description: "Get 100% on a quiz",
      icon: "💯",
      category: "quiz"
    }
  ], []);

  // Check for new badges
  const checkForNewBadges = useCallback((newProgress: UserProgress) => {
    const newBadges: Badge[] = [];
    
    // First Steps
    if (newProgress.completedChapters.length >= 1 && !progress.badges.find(b => b.id === 1)) {
      newBadges.push({
        ...availableBadges[0],
        earnedAt: new Date().toISOString()
      });
    }
    
    // Quiz Master
    if (newProgress.completedQuizzes.length >= 5 && !progress.badges.find(b => b.id === 2)) {
      newBadges.push({
        ...availableBadges[1],
        earnedAt: new Date().toISOString()
      });
    }
    
    // Game Champion
    if (newProgress.completedGames.length >= 10 && !progress.badges.find(b => b.id === 3)) {
      newBadges.push({
        ...availableBadges[2],
        earnedAt: new Date().toISOString()
      });
    }
    
    // Streak Master
    if (newProgress.streak >= 7 && !progress.badges.find(b => b.id === 4)) {
      newBadges.push({
        ...availableBadges[3],
        earnedAt: new Date().toISOString()
      });
    }
    
    // Level 10 Hero
    if (newProgress.level >= 10 && !progress.badges.find(b => b.id === 7)) {
      newBadges.push({
        ...availableBadges[6],
        earnedAt: new Date().toISOString()
      });
    }

    return newBadges;
  }, [progress.badges, availableBadges]);

  // Add XP and check for level up
  const addXP = useCallback((amount: number, source: 'chapter' | 'quiz' | 'game') => {
    const newXP = progress.xp + amount;
    const newLevel = calculateLevel(newXP);
    const levelUp = newLevel > progress.level;
    
    const newProgress: UserProgress = {
      ...progress,
      xp: newXP,
      level: newLevel,
      lastActiveDate: new Date().toISOString()
    };

    // Check for new badges
    const newBadges = checkForNewBadges(newProgress);
    if (newBadges.length > 0) {
      newProgress.badges = [...progress.badges, ...newBadges];
    }

    setProgress(newProgress);
    onProgressUpdate(newProgress);

    // Show level up notification
    if (levelUp) {
      // You could show a level up modal here
      console.log(`Level up! You're now level ${newLevel}!`);
    }

    // Show new badge notification
    if (newBadges.length > 0) {
      newBadges.forEach(badge => {
        console.log(`New badge earned: ${badge.name}!`);
      });
    }
  }, [progress, onProgressUpdate, checkForNewBadges]);

  // Complete chapter
  const completeChapter = useCallback((chapterId: number) => {
    if (!progress.completedChapters.includes(chapterId)) {
      const newProgress = {
        ...progress,
        completedChapters: [...progress.completedChapters, chapterId]
      };
      setProgress(newProgress);
      onProgressUpdate(newProgress);
      addXP(50, 'chapter');
    }
  }, [progress, onProgressUpdate, addXP]);

  // Complete quiz
  const completeQuiz = useCallback((quizId: number) => {
    if (!progress.completedQuizzes.includes(quizId)) {
      const newProgress = {
        ...progress,
        completedQuizzes: [...progress.completedQuizzes, quizId]
      };
      setProgress(newProgress);
      onProgressUpdate(newProgress);
      addXP(100, 'quiz');
    }
  }, [progress, onProgressUpdate, addXP]);

  // Complete game
  const completeGame = useCallback((gameId: number) => {
    if (!progress.completedGames.includes(gameId)) {
      const newProgress = {
        ...progress,
        completedGames: [...progress.completedGames, gameId]
      };
      setProgress(newProgress);
      onProgressUpdate(newProgress);
      addXP(150, 'game');
    }
  }, [progress, onProgressUpdate, addXP]);

  // Update streak
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastActive = new Date(progress.lastActiveDate).toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newStreak = progress.streak;
    if (lastActive === yesterdayStr || lastActive === today) {
      if (lastActive === yesterdayStr) {
        newStreak += 1;
      }
    } else {
      newStreak = 1;
    }

    const newProgress = {
      ...progress,
      streak: newStreak,
      lastActiveDate: new Date().toISOString()
    };
    setProgress(newProgress);
    onProgressUpdate(newProgress);
  }, [progress, onProgressUpdate]);

  const getLevelTitle = (level: number) => {
    if (level >= 20) return "Legendary Scholar";
    if (level >= 15) return "Master Learner";
    if (level >= 10) return "Expert Student";
    if (level >= 5) return "Advanced Learner";
    return "Rising Star";
  };

  const getLevelIcon = (level: number) => {
    if (level >= 20) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (level >= 15) return <Medal className="w-6 h-6 text-purple-500" />;
    if (level >= 10) return <Trophy className="w-6 h-6 text-orange-500" />;
    if (level >= 5) return <Award className="w-6 h-6 text-blue-500" />;
    return <Star className="w-6 h-6 text-green-500" />;
  };

  // Expose functions to parent components
  useEffect(() => {
    (window as any).gamificationSystem = {
      completeChapter,
      completeQuiz,
      completeGame,
      addXP,
      updateStreak
    };
  }, [completeChapter, completeQuiz, completeGame, addXP, updateStreak]);

  return (
    <div className="space-y-6">
      {/* Level and XP Display */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getLevelIcon(progress.level)}
            <div>
              <h2 className="text-2xl font-bold">Level {progress.level}</h2>
              <p className="text-white/80">{getLevelTitle(progress.level)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{progress.xp.toLocaleString()}</div>
            <div className="text-white/80">Total XP</div>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm text-white/80 mb-1">
            <span>Progress to Level {progress.level + 1}</span>
            <span>{Math.round(getProgressToNextLevel(progress.xp, progress.level))}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${getProgressToNextLevel(progress.xp, progress.level)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-sm text-white/80">
          {getXPForNextLevel(progress.level) - progress.xp} XP needed for next level
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{progress.completedChapters.length}</div>
          <div className="text-sm text-gray-600">Chapters</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-green-600">{progress.completedQuizzes.length}</div>
          <div className="text-sm text-gray-600">Quizzes</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{progress.completedGames.length}</div>
          <div className="text-sm text-gray-600">Games</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-orange-600">{progress.streak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Badges & Achievements</h3>
          <button
            onClick={() => setShowBadges(!showBadges)}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            {showBadges ? 'Hide' : 'View All'}
          </button>
        </div>
        
        {/* Earned Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {progress.badges.map((badge) => (
            <div key={badge.id} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="text-4xl mb-2">{badge.icon}</div>
              <div className="font-semibold text-gray-800 text-sm">{badge.name}</div>
              <div className="text-xs text-gray-600 mt-1">{badge.description}</div>
            </div>
          ))}
        </div>

        {/* Available Badges */}
        {showBadges && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Available Badges</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableBadges
                .filter(badge => !progress.badges.find(b => b.id === badge.id))
                .map((badge) => (
                <div key={badge.id} className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-60">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div className="font-semibold text-gray-600 text-sm">{badge.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{badge.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default GamificationSystem;
