import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Trophy, Award, Star, Play, CheckCircle, ChevronRight } from "lucide-react";
import { User } from "../types";

interface DashboardProps {
  currentUser: User;
  setCurrentPage: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, setCurrentPage }) => {
  const { t } = useLanguage();
  return (
  <div className="max-w-7xl mx-auto p-6">
    <div className="mb-8">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
        <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">
          {t('dashboard.welcome_back')}, {currentUser?.username}! 👋
        </h2>
        <p className="text-xl text-white/90">{t('dashboard.subtitle')}</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 text-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <Trophy className="w-10 h-10" />
          <div className="text-right">
            <p className="text-4xl font-bold">
              {currentUser?.progress?.completedLessons || 0}/5
            </p>
            <p className="text-sm opacity-90">{t('dashboard.lessons_completed')}</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{t('dashboard.progress')}</h3>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${((currentUser?.progress?.completedLessons || 0) / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <Award className="w-10 h-10" />
          <div className="text-right">
            <p className="text-4xl font-bold">
              {currentUser?.progress?.totalScore || 0}%
            </p>
            <p className="text-sm opacity-90">{t('dashboard.average_score')}</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{t('dashboard.quiz_performance')}</h3>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${currentUser?.progress?.totalScore || 0}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 text-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <Star className="w-10 h-10" />
          <div className="text-right">
            <p className="text-4xl font-bold">
              {currentUser?.progress?.quizScores?.length || 0}
            </p>
            <p className="text-sm opacity-90">{t('dashboard.quizzes_taken')}</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{t('dashboard.achievements')}</h3>
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < (currentUser?.progress?.quizScores?.length || 0) ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">{t('dashboard.quick_actions')}</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => setCurrentPage("class-selection")}
          className="group flex items-center justify-between p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="text-left">
              <span className="text-xl font-semibold block">{t('dashboard.start_learning')}</span>
              <span className="text-purple-100 text-sm">{t('dashboard.choose_class_subject')}</span>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => setCurrentPage("lessons")}
          className="group flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Play className="w-8 h-8" />
            </div>
            <div className="text-left">
              <span className="text-xl font-semibold block">{t('dashboard.continue_learning')}</span>
              <span className="text-blue-100 text-sm">{t('dashboard.interactive_lessons')}</span>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => setCurrentPage("quiz")}
          className="group flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="text-left">
              <span className="text-xl font-semibold block">{t('dashboard.take_quiz')}</span>
              <span className="text-emerald-100 text-sm">{t('dashboard.test_knowledge')}</span>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
);
}

export default Dashboard;
