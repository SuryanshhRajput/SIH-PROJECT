import React, { useState } from "react";
import { User, GraduationCap } from "lucide-react";
import { User as UserType } from "../types";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

interface StudentsPageProps {
  currentUser: UserType;
  users: UserType[];
  setUsers: (users: UserType[]) => void;
  addNotification: (message: string) => void;
}

const StudentsPage: React.FC<StudentsPageProps> = ({ 
  currentUser, 
  users, 
  setUsers, 
  addNotification 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("username");
  const [gradeFilter, setGradeFilter] = useState("");
  const [rollLookup, setRollLookup] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);

  const students = users.filter(user => user.userType === "student");
  
  const filteredStudents = students
    .filter(student =>
      student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(student =>
      gradeFilter ? (student.profile?.grade || "").toLowerCase() === gradeFilter.toLowerCase() : true
    );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "username":
        return a.username.localeCompare(b.username);
      case "progress":
        return (b.progress?.completedLessons || 0) - (a.progress?.completedLessons || 0);
      case "score":
        return (b.progress?.totalScore || 0) - (a.progress?.totalScore || 0);
      default:
        return 0;
    }
  });

  const fetchStudentByRoll = async () => {
    if (!rollLookup.trim()) return;
    try {
      setLoadingLookup(true);
      const q = query(collection(db, "users"), where("rollNumber", "==", rollLookup.trim()));
      const snap = await getDocs(q);
      if (snap.empty) {
        addNotification("No student found with that roll number");
        return;
      }
      const docData = snap.docs[0].data() as UserType;
      // merge into local list if not present
      if (!users.find(u => u.id === (docData as any).id)) {
        setUsers([...users, docData]);
      }
      addNotification("Student loaded by roll number");
    } catch (e) {
      addNotification("Failed to fetch student by roll number");
    } finally {
      setLoadingLookup(false);
    }
  };

  const updateStudentProgress = (studentId: string, field: string, value: any) => {
    setUsers(users.map(user => 
      user.id === studentId 
        ? {
            ...user,
            progress: {
              completedLessons: user.progress?.completedLessons || 0,
              totalScore: user.progress?.totalScore || 0,
              quizScores: user.progress?.quizScores || [],
              xp: user.progress?.xp || 0,
              level: user.progress?.level || 1,
              badges: user.progress?.badges || [],
              completedChapters: user.progress?.completedChapters || [],
              completedQuizzes: user.progress?.completedQuizzes || [],
              completedGames: user.progress?.completedGames || [],
              streak: user.progress?.streak || 0,
              lastActiveDate: user.progress?.lastActiveDate || new Date().toISOString(),
              [field]: value
            }
          }
        : user
    ));
    addNotification(`Updated ${field} for student`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Management</h2>
        <p className="text-gray-600">View and manage student progress and information</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="username">Sort by Name</option>
              <option value="progress">Sort by Progress</option>
              <option value="score">Sort by Score</option>
            </select>
          </div>
        <div>
          <input
            type="text"
            placeholder="Filter by grade (e.g. 10th)"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Roll number"
              value={rollLookup}
              onChange={(e) => setRollLookup(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchStudentByRoll}
              disabled={loadingLookup}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
            >
              {loadingLookup ? "Loading..." : "Find by Roll"}
            </button>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{student.username}</h3>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium">
                  {student.progress?.completedLessons || 0}/5 lessons
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${((student.progress?.completedLessons || 0) / 5) * 100}%` 
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Score</span>
                <span className="text-sm font-medium">
                  {student.progress?.totalScore || 0}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quizzes Taken</span>
                <span className="text-sm font-medium">
                  {student.progress?.quizScores?.length || 0}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => updateStudentProgress(student.id, 'completedLessons', 
                    Math.min((student.progress?.completedLessons || 0) + 1, 5)
                  )}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700"
                >
                  +1 Lesson
                </button>
                <button
                  onClick={() => updateStudentProgress(student.id, 'totalScore', 
                    Math.min((student.progress?.totalScore || 0) + 10, 100)
                  )}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700"
                >
                  +10 Score
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedStudents.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No students found</h3>
          <p className="text-gray-500">
            {searchTerm ? "Try adjusting your search terms" : "No students are registered yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
