import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  BookOpen, 
  Play, 
  Trophy, 
  Gamepad2, 
  Bot, 
  FileText, 
  Clock,
  Star,
  CheckCircle,
  Lock
} from "lucide-react";
import { Chapter, Subject, Class, AINotification } from "../types";
import AIChat from "./AIChat";

interface ChapterViewProps {
  selectedClass: Class;
  selectedSubject: Subject;
  onBack: () => void;
  currentUser: any;
  onChapterComplete: (chapterId: number, xp: number) => void;
}

// Mock data for chapters
const mockChapters: Chapter[] = [
  {
    id: 1,
    title: "Introduction to Motion",
    subjectId: 1,
    description: "Learn about different types of motion and their characteristics",
    difficulty: "easy",
    notes: [
      {
        id: 1,
        title: "What is Motion?",
        content: "Motion is the change in position of an object with respect to time...",
        type: "text"
      },
      {
        id: 2,
        title: "Types of Motion",
        content: "There are three main types of motion: linear, circular, and oscillatory...",
        type: "text"
      }
    ],
    quizzes: [
      {
        id: 1,
        title: "Motion Basics Quiz",
        questions: [],
        xpReward: 100,
        timeLimit: 10
      }
    ],
    games: [
      {
        id: 1,
        title: "Motion Matching Game",
        type: "matching",
        description: "Match motion types with their examples",
        xpReward: 150
      }
    ],
    aiFacts: [
      "Did you know that astronauts feel weightless because they are in free fall? 🚀",
      "The fastest human-made object is the Parker Solar Probe, traveling at 430,000 mph! 🌟",
      "A cheetah can run at 70 mph, but only for short bursts! 🐆"
    ]
  },
  {
    id: 2,
    title: "Speed and Velocity",
    subjectId: 1,
    description: "Understanding the difference between speed and velocity",
    difficulty: "medium",
    notes: [
      {
        id: 3,
        title: "Speed vs Velocity",
        content: "Speed is a scalar quantity, while velocity is a vector quantity...",
        type: "text"
      }
    ],
    quizzes: [
      {
        id: 2,
        title: "Speed and Velocity Quiz",
        questions: [],
        xpReward: 120,
        timeLimit: 15
      }
    ],
    games: [
      {
        id: 2,
        title: "Speed Calculator",
        type: "drag-drop",
        description: "Calculate speed using the formula s = d/t",
        xpReward: 180
      }
    ],
    aiFacts: [
      "Light travels at 186,000 miles per second - that's 7 times around Earth in one second! ⚡",
      "The speed of sound is about 767 mph at sea level! 🔊"
    ]
  }
];

const ChapterView: React.FC<ChapterViewProps> = ({ 
  selectedClass, 
  selectedSubject, 
  onBack, 
  currentUser,
  onChapterComplete 
}) => {
  const [chapters] = useState<Chapter[]>(mockChapters);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [aiNotifications, setAiNotifications] = useState<AINotification[]>([]);

  // Show welcome popup when a chapter is selected
  useEffect(() => {
    if (selectedChapter) {
      setShowWelcomePopup(true);
      // Add AI notification
      const welcomeNotification: AINotification = {
        id: Date.now(),
        type: "welcome",
        title: `Welcome to ${selectedChapter.title}! 🎉`,
        message: selectedChapter.aiFacts[0] || "Let's start learning together!",
        chapterId: selectedChapter.id,
        subjectId: selectedSubject.id,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setAiNotifications(prev => [welcomeNotification, ...prev]);
    }
  }, [selectedChapter, selectedSubject.id]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "from-green-500 to-emerald-500";
      case "medium": return "from-yellow-500 to-orange-500";
      case "hard": return "from-red-500 to-pink-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "🟢";
      case "medium": return "🟡";
      case "hard": return "🔴";
      default: return "⚪";
    }
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
  };

  const handleCompleteActivity = (xp: number) => {
    onChapterComplete(selectedChapter!.id, xp);
  };

  if (selectedChapter) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Chapter Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToChapters}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Chapters</span>
          </button>
          
          <div className={`bg-gradient-to-r ${getDifficultyColor(selectedChapter.difficulty)} rounded-2xl p-8 text-white shadow-2xl`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold drop-shadow-lg mb-2">{selectedChapter.title}</h1>
                <p className="text-xl text-white/90 mb-4">{selectedChapter.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{getDifficultyIcon(selectedChapter.difficulty)}</span>
                  <span className="text-lg capitalize">{selectedChapter.difficulty} Level</span>
                </div>
              </div>
              <div className="text-6xl">{selectedSubject.icon}</div>
            </div>
          </div>
        </div>

        {/* Chapter Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notes Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Study Notes</h2>
              </div>
              <div className="space-y-4">
                {selectedChapter.notes.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-800 mb-2">{note.title}</h3>
                    <p className="text-gray-600 text-sm">{note.content}</p>
                    <div className="mt-2 flex items-center space-x-2 text-blue-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quizzes Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-800">Quizzes</h2>
              </div>
              <div className="space-y-4">
                {selectedChapter.quizzes.map((quiz) => (
                  <div key={quiz.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{quiz.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{quiz.timeLimit} min</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{quiz.xpReward} XP</span>
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCompleteActivity(quiz.xpReward)}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
                      >
                        Start Quiz
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Games Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <Gamepad2 className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800">Mini Games</h2>
              </div>
              <div className="space-y-4">
                {selectedChapter.games.map((game) => (
                  <div key={game.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{game.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{game.description}</p>
                        <div className="flex items-center space-x-1 text-sm text-purple-600 mt-1">
                          <Star className="w-4 h-4" />
                          <span>{game.xpReward} XP</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCompleteActivity(game.xpReward)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                      >
                        Play Game
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Chat */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <Bot className="w-8 h-8 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-800">AI Helper</h2>
              </div>
              <AIChat mode="page" topic={selectedChapter.title} />
            </div>

            {/* Fun Facts */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Did You Know? 🤔</h3>
              <div className="space-y-3">
                {selectedChapter.aiFacts.map((fact, index) => (
                  <div key={index} className="bg-white/20 rounded-lg p-3 text-sm">
                    {fact}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Notes Read</span>
                  <span>0/{selectedChapter.notes.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quizzes Completed</span>
                  <span>0/{selectedChapter.quizzes.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Games Played</span>
                  <span>0/{selectedChapter.games.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Popup */}
        {showWelcomePopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome to {selectedChapter.title}!
                </h2>
                <p className="text-gray-600 mb-6">
                  {selectedChapter.aiFacts[0] || "Let's start learning together!"}
                </p>
                <button
                  onClick={() => setShowWelcomePopup(false)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                >
                  Let's Start! 🚀
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Subjects</span>
        </button>
        
        <div className={`bg-gradient-to-r ${selectedSubject.color} rounded-2xl p-8 text-white shadow-2xl`}>
          <div className="flex items-center space-x-4">
            <div className="text-6xl">{selectedSubject.icon}</div>
            <div>
              <h1 className="text-4xl font-bold drop-shadow-lg">{selectedSubject.name}</h1>
              <p className="text-xl text-white/90">Choose a chapter to start learning</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            onClick={() => handleChapterSelect(chapter)}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              {/* Chapter Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-800">Chapter {index + 1}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getDifficultyColor(chapter.difficulty)}`}>
                    {chapter.difficulty}
                  </span>
                </div>
                <div className="text-3xl">{getDifficultyIcon(chapter.difficulty)}</div>
              </div>

              {/* Chapter Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{chapter.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{chapter.description}</p>

              {/* Chapter Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs text-gray-500">
                <div>
                  <div className="font-semibold">{chapter.notes.length}</div>
                  <div>Notes</div>
                </div>
                <div>
                  <div className="font-semibold">{chapter.quizzes.length}</div>
                  <div>Quizzes</div>
                </div>
                <div>
                  <div className="font-semibold">{chapter.games.length}</div>
                  <div>Games</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-center space-x-2 text-indigo-600 group-hover:text-indigo-700">
                <span className="font-semibold">Start Learning</span>
                <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterView;
