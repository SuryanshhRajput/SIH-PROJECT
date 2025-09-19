import React, { useState, useEffect } from "react";
import { X, Star, Lightbulb, Trophy, Zap } from "lucide-react";
import { AINotification } from "../types";

interface AINotificationSystemProps {
  currentChapter?: string;
  currentSubject?: string;
  onNotificationAdd: (notification: AINotification) => void;
}

const AINotificationSystem: React.FC<AINotificationSystemProps> = ({
  currentChapter,
  currentSubject,
  onNotificationAdd
}) => {
  const [notifications, setNotifications] = useState<AINotification[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<AINotification | null>(null);

  // Fun facts and motivational messages
  const funFacts = {
    "Motion": [
      "Did you know that astronauts feel weightless because they are in free fall? 🚀",
      "The fastest human-made object is the Parker Solar Probe, traveling at 430,000 mph! 🌟",
      "A cheetah can run at 70 mph, but only for short bursts! 🐆"
    ],
    "Mathematics": [
      "Pizza is the best way to understand fractions! 🍕",
      "The number zero was invented in India around the 5th century! 🔢",
      "There are more possible games of chess than atoms in the observable universe! ♟️"
    ],
    "Science": [
      "Honey never spoils! Archaeologists have found edible honey in ancient Egyptian tombs! 🍯",
      "A group of flamingos is called a 'flamboyance'! 🦩",
      "Octopuses have three hearts and blue blood! 🐙"
    ],
    "English": [
      "The shortest sentence in English is 'I am.' 📝",
      "Shakespeare invented over 1,700 words still used today! ✍️",
      "The word 'set' has the most definitions in the English language! 📚"
    ]
  };

  const motivationalMessages = [
    "You're doing amazing! Keep up the great work! 🌟",
    "Every expert was once a beginner. You're on the right track! 🚀",
    "Learning is a treasure that will follow you everywhere! 💎",
    "The more you learn, the more you earn! Keep going! 💪",
    "You're building your future one lesson at a time! 🏗️",
    "Great minds think alike, but greater minds think differently! 🧠",
    "Success is the sum of small efforts repeated day in and day out! ⭐",
    "You're not just learning, you're growing! 🌱"
  ];

  // Generate random notifications
  useEffect(() => {
    const generateNotification = () => {
      const notificationTypes: AINotification['type'][] = ['fact', 'motivation', 'achievement'];
      const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      
      let title = "";
      let message = "";

      switch (randomType) {
        case 'fact':
          title = "Did You Know? 🤔";
          const subjectFacts = currentSubject ? funFacts[currentSubject as keyof typeof funFacts] : Object.values(funFacts).flat();
          message = subjectFacts[Math.floor(Math.random() * subjectFacts.length)];
          break;
        case 'motivation':
          title = "Keep Going! 💪";
          message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
          break;
        case 'achievement':
          title = "Achievement Unlocked! 🏆";
          message = "You're making great progress! Every step counts!";
          break;
      }

      const notification: AINotification = {
        id: Date.now(),
        type: randomType,
        title,
        message,
        chapterId: currentChapter ? 1 : undefined,
        subjectId: currentSubject ? 1 : undefined,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      setCurrentNotification(notification);
      setShowNotification(true);
      onNotificationAdd(notification);
    };

    // Show notification every 30-60 seconds
    const interval = setInterval(generateNotification, Math.random() * 30000 + 30000);
    
    return () => clearInterval(interval);
  }, [currentChapter, currentSubject, onNotificationAdd]);

  const handleCloseNotification = () => {
    setShowNotification(false);
    setCurrentNotification(null);
  };

  const getNotificationIcon = (type: AINotification['type']) => {
    switch (type) {
      case 'fact':
        return <Lightbulb className="w-6 h-6 text-yellow-500" />;
      case 'motivation':
        return <Zap className="w-6 h-6 text-blue-500" />;
      case 'achievement':
        return <Trophy className="w-6 h-6 text-orange-500" />;
      default:
        return <Star className="w-6 h-6 text-purple-500" />;
    }
  };

  const getNotificationColor = (type: AINotification['type']) => {
    switch (type) {
      case 'fact':
        return "from-yellow-400 to-orange-500";
      case 'motivation':
        return "from-blue-400 to-indigo-500";
      case 'achievement':
        return "from-orange-400 to-red-500";
      default:
        return "from-purple-400 to-pink-500";
    }
  };

  return (
    <>
      {/* Notification Toast */}
      {showNotification && currentNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`bg-gradient-to-r ${getNotificationColor(currentNotification.type)} rounded-2xl p-4 shadow-2xl max-w-sm border border-white/20`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getNotificationIcon(currentNotification.type)}
              </div>
              <div className="flex-1 text-white">
                <h4 className="font-bold text-sm mb-1">{currentNotification.title}</h4>
                <p className="text-sm text-white/90">{currentNotification.message}</p>
              </div>
              <button
                onClick={handleCloseNotification}
                className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Popup for New Chapters */}
      {currentChapter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to {currentChapter}!
            </h2>
            <p className="text-gray-600 mb-6">
              {funFacts[currentSubject as keyof typeof funFacts]?.[0] || 
               "Let's start learning together! I'll be here to help you along the way."}
            </p>
            <button
              onClick={() => setShowNotification(false)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              Let's Start! 🚀
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AINotificationSystem;
