import React, { useState } from "react";
import { User, Quiz } from "../types";

interface CreateQuizPageProps {
  currentUser: User;
  setCustomQuizzes: (quizzes: Quiz[] | ((prev: Quiz[]) => Quiz[])) => void;
  addNotification: (message: string) => void;
}

const CreateQuizPage: React.FC<CreateQuizPageProps> = ({ currentUser, setCustomQuizzes, addNotification }) => {
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    questions: [{ question: "", options: ["", "", "", ""], correct: 0 }],
  });

  const addQuestion = () => {
    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: "", options: ["", "", "", ""], correct: 0 },
      ],
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === oIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const saveQuiz = () => {
    if (!quizData.title || quizData.questions.some((q) => !q.question)) {
      alert("Please fill in all required fields");
      return;
    }

    const newQuiz = {
      id: Date.now(),
      ...quizData,
      teacherId: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    setCustomQuizzes((prev) => [...prev, newQuiz]);
    addNotification(`Quiz "${quizData.title}" created successfully!`);
    setQuizData({
      title: "",
      description: "",
      questions: [{ question: "", options: ["", "", "", ""], correct: 0 }],
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Quiz</h2>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Quiz Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Title
            </label>
            <input
              type="text"
              value={quizData.title}
              onChange={(e) =>
                setQuizData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quiz title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={quizData.description}
              onChange={(e) =>
                setQuizData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description"
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Questions</h3>

          {quizData.questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question {qIndex + 1}
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(qIndex, "question", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter question"
                />
              </div>

              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                {question.options.map((option, oIndex) => (
                  <div
                    key={oIndex}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={question.correct === oIndex}
                      onChange={() =>
                        updateQuestion(qIndex, "correct", oIndex)
                      }
                      className="text-blue-600"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        updateOption(qIndex, oIndex, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${oIndex + 1}`}
                    />
                  </div>
                ))}
              </div>

              {quizData.questions.length > 1 && (
                <button
                  onClick={() =>
                    setQuizData((prev) => ({
                      ...prev,
                      questions: prev.questions.filter(
                        (_, i) => i !== qIndex
                      ),
                    }))
                  }
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={addQuestion}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Add Question
          </button>

          <button
            onClick={saveQuiz}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
