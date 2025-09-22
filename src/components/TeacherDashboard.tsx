import React, { useState } from "react";
import { User, Trophy, Award, BookOpen, CheckCircle } from "lucide-react";
import { User as UserType, Assignment } from "../types";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLanguage } from "../contexts/LanguageContext";

interface TeacherDashboardProps {
  currentUser: UserType;
  users: UserType[];
  assignments: Assignment[];
  setCurrentPage: (page: string) => void;
  setUsers: (users: UserType[]) => void;
  addNotification?: (message: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser, users, assignments, setCurrentPage, setUsers, addNotification }) => {
  const students = (users || []).filter((u) => u.userType === "student");
  const { t } = useLanguage();
  const totalStudents = students.length;

  const [rollLookup, setRollLookup] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);

  const avgProgress =
    students.length > 0
      ? Math.round(
          students.reduce(
            (sum, s) => sum + (s.progress?.completedLessons || 0),
            0
          ) / students.length
        )
      : 0;

  const avgScore =
    students.length > 0
      ? Math.round(
          students.reduce(
            (sum, s) => sum + (s.progress?.totalScore || 0),
            0
          ) / students.length
        )
      : 0;

  const fetchStudentByRoll = async () => {
    if (!rollLookup.trim()) return;
    try {
      setLoadingLookup(true);
      const q = query(collection(db, "users"), where("rollNumber", "==", rollLookup.trim()));
      const snap = await getDocs(q);
      if (snap.empty) {
        addNotification?.("No student found with that roll number");
        return;
      }
      const docData = snap.docs[0].data() as UserType;
      if (!users.find(u => u.id === (docData as any).id)) {
        setUsers([...users, docData]);
      }
      addNotification?.("Student added to your list");
      setRollLookup("");
    } catch (e) {
      addNotification?.("Failed to fetch student by roll number");
    } finally {
      setLoadingLookup(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {t('teacher.title')}
        </h2>
        <p className="text-gray-600">
          {t('teacher.welcome')}, {currentUser?.profile?.name || currentUser.username}!
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <User className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('teacher.total_students')}</h3>
          <p className="text-2xl font-bold">{totalStudents}</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <Trophy className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('teacher.avg_progress')}</h3>
          <p className="text-2xl font-bold">{avgProgress}/5</p>
          <p className="text-sm opacity-90">{t('teacher.lessons')}</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <Award className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('teacher.avg_score')}</h3>
          <p className="text-2xl font-bold">{avgScore}%</p>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <BookOpen className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('teacher.assignments')}</h3>
          <p className="text-2xl font-bold">{assignments.length}</p>
          <p className="text-sm opacity-90">{t('teacher.active')}</p>
        </div>
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">{t('teacher.recent_activity')}</h3>
          <div className="space-y-4">
            {students.slice(0, 5).map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{student.profile?.name || student.username}</p>
                    <p className="text-sm text-gray-600">
                      {student.progress?.completedLessons || 0} {t('teacher.completed_lessons')}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    (student.progress?.totalScore || 0) >= 80
                      ? "bg-green-100 text-green-700"
                      : (student.progress?.totalScore || 0) >= 60
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {student.progress?.totalScore || 0}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">{t('teacher.quick_actions')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentPage("create-quiz")}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <CheckCircle className="w-8 h-8 text-blue-600 mb-2" />
              <span className="font-medium text-center">{t('teacher.create_quiz')}</span>
            </button>

            <button
              onClick={() => setCurrentPage("assignments")}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <BookOpen className="w-8 h-8 text-green-600 mb-2" />
              <span className="font-medium text-center">{t('teacher.assignments')}</span>
            </button>

            <button
              onClick={() => setCurrentPage("attendance")}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <User className="w-8 h-8 text-purple-600 mb-2" />
              <span className="font-medium text-center">{t('teacher.attendance')}</span>
            </button>

            <button
              onClick={() => setCurrentPage("students")}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Trophy className="w-8 h-8 text-orange-600 mb-2" />
              <span className="font-medium text-center">{t('teacher.view_students')}</span>
            </button>
          </div>

          {/* Roll number add */}
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('teacher.add_by_roll')}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={rollLookup}
                onChange={(e) => setRollLookup(e.target.value)}
                placeholder={t('teacher.enter_roll')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={fetchStudentByRoll}
                disabled={loadingLookup}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
              >
                {loadingLookup ? t('teacher.adding') : t('teacher.add_student')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
