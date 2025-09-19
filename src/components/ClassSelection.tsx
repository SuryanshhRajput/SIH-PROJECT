import React from "react";
import { ChevronRight, GraduationCap, BookOpen, Calculator, Atom, Globe, Palette } from "lucide-react";
import { Class } from "../types";

interface ClassSelectionProps {
  onClassSelect: (classId: number) => void;
  currentUser: any;
}

const classes: Class[] = [
  {
    id: 6,
    name: "Class 6",
    grade: 6,
    theme: {
      primary: "from-blue-500 to-cyan-500",
      secondary: "from-blue-600 to-cyan-600",
      icon: "🎓"
    }
  },
  {
    id: 7,
    name: "Class 7",
    grade: 7,
    theme: {
      primary: "from-green-500 to-emerald-500",
      secondary: "from-green-600 to-emerald-600",
      icon: "📘"
    }
  },
  {
    id: 8,
    name: "Class 8",
    grade: 8,
    theme: {
      primary: "from-purple-500 to-violet-500",
      secondary: "from-purple-600 to-violet-600",
      icon: "📚"
    }
  },
  {
    id: 9,
    name: "Class 9",
    grade: 9,
    theme: {
      primary: "from-orange-500 to-red-500",
      secondary: "from-orange-600 to-red-600",
      icon: "🔬"
    }
  },
  {
    id: 10,
    name: "Class 10",
    grade: 10,
    theme: {
      primary: "from-pink-500 to-rose-500",
      secondary: "from-pink-600 to-rose-600",
      icon: "⚗️"
    }
  },
  {
    id: 11,
    name: "Class 11",
    grade: 11,
    theme: {
      primary: "from-indigo-500 to-blue-500",
      secondary: "from-indigo-600 to-blue-600",
      icon: "🧮"
    }
  },
  {
    id: 12,
    name: "Class 12",
    grade: 12,
    theme: {
      primary: "from-red-500 to-pink-500",
      secondary: "from-red-600 to-pink-600",
      icon: "🎯"
    }
  }
];

const ClassSelection: React.FC<ClassSelectionProps> = ({ onClassSelect, currentUser }) => {
  const getSubjectIcons = (grade: number) => {
    const icons = [
      <BookOpen className="w-6 h-6" />,
      <Calculator className="w-6 h-6" />,
      <Atom className="w-6 h-6" />,
      <Globe className="w-6 h-6" />,
      <Palette className="w-6 h-6" />
    ];
    return icons;
  };

  const getGradeDescription = (grade: number) => {
    const descriptions = {
      6: "Foundation building with fun activities",
      7: "Exploring the world around us",
      8: "Diving deeper into concepts",
      9: "Preparing for board exams",
      10: "Board exam preparation",
      11: "Specialized streams begin",
      12: "Final year preparation"
    };
    return descriptions[grade as keyof typeof descriptions] || "Advanced learning";
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 text-center">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
            Welcome to VidyaVerse! 🚀
          </h1>
          <p className="text-xl text-white/90 mb-2">
            Choose your class to start your learning journey
          </p>
          <p className="text-lg text-white/80">
            Interactive learning with AI-powered assistance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            onClick={() => onClassSelect(classItem.id)}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className={`bg-gradient-to-br ${classItem.theme.primary} rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-transparent hover:border-white/20`}>
              {/* Class Icon and Name */}
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{classItem.theme.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-2">{classItem.name}</h2>
                <p className="text-white/90 text-sm">{getGradeDescription(classItem.grade)}</p>
              </div>

              {/* Subject Icons Preview */}
              <div className="flex justify-center space-x-3 mb-4">
                {getSubjectIcons(classItem.grade).map((icon, index) => (
                  <div key={index} className="p-2 bg-white/20 rounded-lg">
                    {icon}
                  </div>
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="mb-4">
                <div className="flex justify-between text-white/80 text-sm mb-1">
                  <span>Progress</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-0 transition-all duration-500"></div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-center space-x-2 text-white group-hover:text-white/90">
                <span className="font-semibold">Enter Class</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">What you'll get:</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🤖</span>
              <span>AI Tutor</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🎮</span>
              <span>Mini Games</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🏆</span>
              <span>XP & Badges</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">📊</span>
              <span>Progress Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSelection;
