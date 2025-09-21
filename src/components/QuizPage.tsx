import React, { useState } from "react";
import { Award } from "lucide-react";
import { User, PhysicsQuestion, Quiz, QuizAnswers } from "../types";

interface QuizPageProps {
  physicsQuestions: PhysicsQuestion[];
  quizAnswers: QuizAnswers;
  setQuizAnswers: (answers: QuizAnswers) => void;
  currentQuiz: Quiz | null;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  addNotification: (message: string) => void;
}

const QuizPage: React.FC<QuizPageProps> = ({
  physicsQuestions,
  quizAnswers,
  setQuizAnswers,
  currentQuiz,
  setCurrentQuiz,
  showResults,
  setShowResults,
  currentUser,
  setCurrentUser,
  users,
  setUsers,
  addNotification,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const handleQuizSubmit = () => {
    const correctAnswers = physicsQuestions.filter(
      (q, index) => quizAnswers[q.id] === q.correct
    ).length;
    const score = Math.round((correctAnswers / physicsQuestions.length) * 100);

    const updatedUser: User = {
      ...currentUser,
      progress: {
        completedLessons: currentUser.progress?.completedLessons || 0,
        totalScore: score,
        quizScores: [...(currentUser.progress?.quizScores || []), score],
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
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setShowResults(true);
    addNotification(`Quiz completed! You scored ${score}%`);
  };

  if (showResults) {
    const score = currentUser.progress?.totalScore || 0;
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                score >= 80 ? "bg-green-100" : score >= 60 ? "bg-yellow-100" : "bg-red-100"
              }`}
            >
              <Award
                className={`w-12 h-12 ${
                  score >= 80
                    ? "text-green-600"
                    : score >= 60
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            <p className="text-xl text-gray-600">Your Score: {score}%</p>
          </div>

          <div className="space-y-4 mb-6">
            {physicsQuestions.map((q, index) => (
              <div
                key={q.id}
                className={`p-4 rounded-lg ${
                  quizAnswers[q.id] === q.correct
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p className="font-medium">{q.question}</p>
                <p
                  className={`text-sm ${
                    quizAnswers[q.id] === q.correct ? "text-green-700" : "text-red-700"
                  }`}
                >
                  Your answer: {q.options[quizAnswers[q.id]] || "Not answered"}
                </p>
                {quizAnswers[q.id] !== q.correct && (
                  <p className="text-sm text-green-700">Correct: {q.options[q.correct]}</p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setShowResults(false);
              setQuizAnswers({});
              setCurrentQuestionIndex(0);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
        <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">Physics Quiz 🧠</h2>
        <p className="text-xl text-white/90">Test your physics knowledge with interactive questions</p>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold">
              Question {currentQuestionIndex + 1} of {physicsQuestions.length}
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl font-semibold">
              Topic: {physicsQuestions[currentQuestionIndex]?.topic}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${((currentQuestionIndex + 1) / physicsQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-8 text-gray-800">
            {physicsQuestions[currentQuestionIndex]?.question}
          </h3>

          <div className="space-y-4">
            {physicsQuestions[currentQuestionIndex]?.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => setQuizAnswers({ ...quizAnswers, [physicsQuestions[currentQuestionIndex].id]: index })}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  quizAnswers[physicsQuestions[currentQuestionIndex].id] === index
                    ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-lg"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                    quizAnswers[physicsQuestions[currentQuestionIndex].id] === index
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-8 py-3 border-2 border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 font-semibold"
          >
            ← Previous
          </button>

          {currentQuestionIndex === physicsQuestions.length - 1 ? (
            <button
              onClick={handleQuizSubmit}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              Submit Quiz 🚀
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(Math.min(physicsQuestions.length - 1, currentQuestionIndex + 1))}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
