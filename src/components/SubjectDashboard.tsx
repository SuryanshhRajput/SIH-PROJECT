import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { ChevronRight, ArrowLeft, BookOpen, Calculator, Atom, Globe, Palette, Dumbbell } from "lucide-react";
import { Subject, Class } from "../types";

interface SubjectDashboardProps {
  selectedClass: Class;
  onSubjectSelect: (subjectId: number) => void;
  onBack: () => void;
  currentUser: any;
}

const subjects: Subject[] = [
  {
    id: 1,
    name: "Mathematics",
    classId: 6,
    icon: "🧮",
    color: "from-blue-500 to-indigo-600",
    description: "Numbers, shapes, and problem solving"
  },
  {
    id: 2,
    name: "Science",
    classId: 6,
    icon: "🔬",
    color: "from-green-500 to-emerald-600",
    description: "Explore the world around us"
  },
  {
    id: 3,
    name: "English",
    classId: 6,
    icon: "📚",
    color: "from-purple-500 to-violet-600",
    description: "Language and literature"
  },
  {
    id: 4,
    name: "Social Studies",
    classId: 6,
    icon: "🌍",
    color: "from-orange-500 to-red-600",
    description: "History, geography, and civics"
  },
  {
    id: 5,
    name: "Art & Craft",
    classId: 6,
    icon: "🎨",
    color: "from-pink-500 to-rose-600",
    description: "Creative expression and skills"
  },
  {
    id: 6,
    name: "Physical Education",
    classId: 6,
    icon: "⚽",
    color: "from-yellow-500 to-orange-600",
    description: "Sports and physical fitness"
  }
];

const SubjectDashboard: React.FC<SubjectDashboardProps> = ({ 
  selectedClass, 
  onSubjectSelect, 
  onBack, 
  currentUser 
}) => {
  const { t } = useLanguage();

  const getSubjectIcon = (subjectName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "Mathematics": <Calculator className="w-8 h-8" />,
      "Science": <Atom className="w-8 h-8" />,
      "English": <BookOpen className="w-8 h-8" />,
      "Social Studies": <Globe className="w-8 h-8" />,
      "Art & Craft": <Palette className="w-8 h-8" />,
      "Physical Education": <Dumbbell className="w-8 h-8" />
    };
    return iconMap[subjectName] || <BookOpen className="w-8 h-8" />;
  };

  const getClassSpecificSubjects = (classId: number) => {
    // For now, return all subjects, but this could be filtered based on class
    return subjects.map(subject => ({ ...subject, classId }));
  };

  const classSubjects = getClassSpecificSubjects(selectedClass.id);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('subject.back_classes')}</span>
        </button>
        
        <div className={`bg-gradient-to-r ${selectedClass.theme.primary} rounded-2xl p-8 text-white shadow-2xl`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-6xl">{selectedClass.theme.icon}</div>
            <div>
              <h1 className="text-4xl font-bold drop-shadow-lg">{selectedClass.name}</h1>
              <p className="text-xl text-white/90">{t('subject.choose')}</p>
            </div>
          </div>
          
          {/* Class Progress Overview */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-white/80">{t('subject.chapters_completed')}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-white/80">{t('subject.xp_earned')}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-white/80">{t('subject.badges')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classSubjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => onSubjectSelect(subject.id)}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className={`bg-gradient-to-br ${subject.color} rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-transparent hover:border-white/20`}>
              {/* Subject Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  {getSubjectIcon(subject.name)}
                </div>
                <div className="text-4xl">{subject.icon}</div>
              </div>

              {/* Subject Info */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">{subject.name}</h3>
                <p className="text-white/90 text-sm">{subject.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-white/80 text-sm mb-1">
                  <span>{t('subject.progress')}</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-0 transition-all duration-500"></div>
                </div>
              </div>

              {/* Chapter Count */}
              <div className="flex items-center justify-between text-white/80 text-sm mb-4">
                <span>{t('subject.chapters_available')}</span>
                <span className="font-semibold">5</span>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-center space-x-2 text-white group-hover:text-white/90">
                <span className="font-semibold">{t('subject.enter')}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">{t('subject.journey')}</h3>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white/20 rounded-lg">
              <div className="text-3xl font-bold text-gray-800">0</div>
              <div className="text-sm text-gray-600">{t('subject.total_xp')}</div>
            </div>
            <div className="p-4 bg-white/20 rounded-lg">
              <div className="text-3xl font-bold text-gray-800">Level 1</div>
              <div className="text-sm text-gray-600">{t('subject.current_level')}</div>
            </div>
            <div className="p-4 bg-white/20 rounded-lg">
              <div className="text-3xl font-bold text-gray-800">0</div>
              <div className="text-sm text-gray-600">{t('subject.streak_days')}</div>
            </div>
            <div className="p-4 bg-white/20 rounded-lg">
              <div className="text-3xl font-bold text-gray-800">0</div>
              <div className="text-sm text-gray-600">{t('subject.badges_earned')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDashboard;
