import React, { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { User, Notification, Assignment, Quiz, AttendanceRecord, AnimationState, PhysicsQuestion, QuizAnswers, StudyNote } from "./types";

// Pages
import LoginPage from "./pages/LoginPage";

// Student Components
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import LessonsPage from "./components/LessonsPage";
import QuizPage from "./components/QuizPage";
import NotesPage from "./components/NotesPage";
import ProfilePage from "./components/ProfilePage";
import NotificationsPage from "./components/NotificationsPage";

// Teacher Components
import TeacherDashboard from "./components/TeacherDashboard";
import CreateQuizPage from "./components/CreateQuizPage";
import AssignmentsPage from "./components/AssignmentsPage";
import AttendancePage from "./components/AttendancePage";
import StudentsPage from "./components/StudentsPage";
import { getDoc } from "firebase/firestore";
import AIChat from "./components/AIChat";
import AIChatPage from "./components/AIChatPage";
import ClassSelection from "./components/ClassSelection";
import SubjectDashboard from "./components/SubjectDashboard";
import ChapterView from "./components/ChapterView";
import GamificationSystem from "./components/GamificationSystem";
import { Class, Subject, UserProgress } from "./types";

const PhysicsLearningPlatform = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState("login");
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [customQuizzes, setCustomQuizzes] = useState<Quiz[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [studyNotes] = useState<StudyNote[]>([]);
  
  // Hierarchical Navigation State
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [navigationStack, setNavigationStack] = useState<string[]>([]);
  
  // Animation state for lessons
  const [animationState, setAnimationState] = useState<AnimationState>({
    selectedDemo: 'freefall',
    isPlaying: false,
    time: 0
  });

  // Quiz state
  const [physicsQuestions] = useState<PhysicsQuestion[]>([
    {
      id: 1,
      question: "What is the acceleration due to gravity on Earth?",
      options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11 m/s²"],
      correct: 0,
      explanation: "The standard acceleration due to gravity on Earth is approximately 9.8 m/s².",
      topic: "Gravity"
    },
    {
      id: 2,
      question: "Which equation represents Newton's second law?",
      options: ["F = ma", "E = mc²", "v = u + at", "s = ut + ½at²"],
      correct: 0,
      explanation: "Newton's second law states that force equals mass times acceleration (F = ma).",
      topic: "Newton's Laws"
    },
    {
      id: 3,
      question: "What is the unit of force in the SI system?",
      options: ["Joule", "Newton", "Watt", "Pascal"],
      correct: 1,
      explanation: "Force is measured in Newtons (N) in the SI system.",
      topic: "Units"
    }
  ]);

  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Add notification helper
  const addNotification = (message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      timestamp: new Date(),
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  // Hierarchical Navigation Handlers
  const handleClassSelect = (classId: number) => {
    const classes: Class[] = [
      { id: 6, name: "Class 6", grade: 6, theme: { primary: "from-blue-500 to-cyan-500", secondary: "from-blue-600 to-cyan-600", icon: "🎓" } },
      { id: 7, name: "Class 7", grade: 7, theme: { primary: "from-green-500 to-emerald-500", secondary: "from-green-600 to-emerald-600", icon: "📘" } },
      { id: 8, name: "Class 8", grade: 8, theme: { primary: "from-purple-500 to-violet-500", secondary: "from-purple-600 to-violet-600", icon: "📚" } },
      { id: 9, name: "Class 9", grade: 9, theme: { primary: "from-orange-500 to-red-500", secondary: "from-orange-600 to-red-600", icon: "🔬" } },
      { id: 10, name: "Class 10", grade: 10, theme: { primary: "from-pink-500 to-rose-500", secondary: "from-pink-600 to-rose-600", icon: "⚗️" } },
      { id: 11, name: "Class 11", grade: 11, theme: { primary: "from-indigo-500 to-blue-500", secondary: "from-indigo-600 to-blue-600", icon: "🧮" } },
      { id: 12, name: "Class 12", grade: 12, theme: { primary: "from-red-500 to-pink-500", secondary: "from-red-600 to-pink-600", icon: "🎯" } }
    ];
    
    const selectedClass = classes.find(c => c.id === classId);
    if (selectedClass) {
      setSelectedClass(selectedClass);
      setCurrentPage("subject-dashboard");
      setNavigationStack(["class-selection"]);
    }
  };

  const handleSubjectSelect = (subjectId: number) => {
    const subjects: Subject[] = [
      { id: 1, name: "Mathematics", classId: selectedClass?.id || 6, icon: "🧮", color: "from-blue-500 to-indigo-600", description: "Numbers, shapes, and problem solving" },
      { id: 2, name: "Science", classId: selectedClass?.id || 6, icon: "🔬", color: "from-green-500 to-emerald-600", description: "Explore the world around us" },
      { id: 3, name: "English", classId: selectedClass?.id || 6, icon: "📚", color: "from-purple-500 to-violet-600", description: "Language and literature" },
      { id: 4, name: "Social Studies", classId: selectedClass?.id || 6, icon: "🌍", color: "from-orange-500 to-red-600", description: "History, geography, and civics" },
      { id: 5, name: "Art & Craft", classId: selectedClass?.id || 6, icon: "🎨", color: "from-pink-500 to-rose-600", description: "Creative expression and skills" },
      { id: 6, name: "Physical Education", classId: selectedClass?.id || 6, icon: "⚽", color: "from-yellow-500 to-orange-600", description: "Sports and physical fitness" }
    ];
    
    const selectedSubject = subjects.find(s => s.id === subjectId);
    if (selectedSubject) {
      setSelectedSubject(selectedSubject);
      setCurrentPage("chapter-view");
      setNavigationStack(prev => [...prev, "subject-dashboard"]);
    }
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setCurrentPage("class-selection");
    setNavigationStack([]);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setCurrentPage("subject-dashboard");
    setNavigationStack(prev => prev.slice(0, -1));
  };

  const handleChapterComplete = (chapterId: number, xp: number) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        progress: {
          completedLessons: currentUser.progress?.completedLessons || 0,
          totalScore: currentUser.progress?.totalScore || 0,
          quizScores: currentUser.progress?.quizScores || [],
          xp: (currentUser.progress?.xp || 0) + xp,
          level: Math.floor(((currentUser.progress?.xp || 0) + xp) / 1000) + 1,
          badges: currentUser.progress?.badges || [],
          completedChapters: [...(currentUser.progress?.completedChapters || []), chapterId],
          completedQuizzes: currentUser.progress?.completedQuizzes || [],
          completedGames: currentUser.progress?.completedGames || [],
          streak: currentUser.progress?.streak || 0,
          lastActiveDate: currentUser.progress?.lastActiveDate || new Date().toISOString()
        }
      };
      setCurrentUser(updatedUser);
      addNotification(`Great job! You earned ${xp} XP for completing the chapter! 🎉`);
    }
  };
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // fetch Firestore profile
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data() as User);
          setCurrentPage(
            userDoc.data().userType === "teacher" ? "teacher-dashboard" : "dashboard"
          );
        }
        // load users list
        const usersSnap = await getDocs(collection(db, "users"));
        const allUsers: User[] = usersSnap.docs.map((d) => d.data() as User);
        setUsers(allUsers);
        // load attendance
        const attendanceSnap = await getDocs(collection(db, "attendance"));
        const allAttendance: AttendanceRecord[] = attendanceSnap.docs.map((d) => d.data() as AttendanceRecord);
        setAttendance(allAttendance);
      } else {
        setCurrentUser(null);
        setCurrentPage("login");
      }
    });

    return () => unsub(); // cleanup
  }, []);

  // Show Login if not logged in
  if (!currentUser) {
    return (
      <LoginPage
        setCurrentUser={setCurrentUser}
        setCurrentPage={setCurrentPage}
        users={users}
        setUsers={setUsers}
        setNotifications={setNotifications}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-x-hidden">
      {/* Navbar */}
      <Navigation
        currentUser={currentUser}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        notifications={notifications}
        setCurrentUser={setCurrentUser}
      />

      {/* Student Pages */}
      {currentUser.userType === "student" && (
        <>
          {/* Hierarchical Navigation Pages */}
          {currentPage === "class-selection" && (
            <ClassSelection 
              onClassSelect={handleClassSelect} 
              currentUser={currentUser} 
            />
          )}
          {currentPage === "subject-dashboard" && selectedClass && (
            <SubjectDashboard 
              selectedClass={selectedClass}
              onSubjectSelect={handleSubjectSelect}
              onBack={handleBackToClasses}
              currentUser={currentUser}
            />
          )}
          {currentPage === "chapter-view" && selectedClass && selectedSubject && (
            <ChapterView 
              selectedClass={selectedClass}
              selectedSubject={selectedSubject}
              onBack={handleBackToSubjects}
              currentUser={currentUser}
              onChapterComplete={handleChapterComplete}
            />
          )}
          
          {/* Original Dashboard and Pages */}
          {currentPage === "dashboard" && (
            <div className="space-y-6">
              <Dashboard currentUser={currentUser} setCurrentPage={setCurrentPage} />
              <div className="max-w-7xl mx-auto p-6">
                <GamificationSystem 
                  currentUser={currentUser} 
                  onProgressUpdate={(progress) => {
                    if (currentUser) {
                      setCurrentUser({
                        ...currentUser,
                        progress: { 
                          completedLessons: currentUser.progress?.completedLessons || 0,
                          totalScore: currentUser.progress?.totalScore || 0,
                          quizScores: currentUser.progress?.quizScores || [],
                          ...progress
                        }
                      });
                    }
                  }}
                />
              </div>
            </div>
          )}
          {currentPage === "lessons" && (
            <LessonsPage
              animationState={animationState}
              setAnimationState={setAnimationState}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              users={users}
              setUsers={setUsers}
              addNotification={addNotification}
            />
          )}
          {currentPage === "quiz" && (
            <QuizPage
              physicsQuestions={physicsQuestions}
              quizAnswers={quizAnswers}
              setQuizAnswers={setQuizAnswers}
              currentQuiz={currentQuiz}
              setCurrentQuiz={setCurrentQuiz}
              showResults={showResults}
              setShowResults={setShowResults}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              users={users}
              setUsers={setUsers}
              addNotification={addNotification}
            />
          )}
          {currentPage === "ai" && (
            <AIChatPage />
          )}
          {currentPage === "notes" && (
            <NotesPage studyNotes={studyNotes} addNotification={addNotification} />
          )}
          {currentPage === "profile" && (
            <ProfilePage
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              users={users}
              setUsers={setUsers}
              addNotification={addNotification}
              attendance={attendance}
            />
          )}
          {currentPage === "notifications" && (
            <NotificationsPage
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )}
        </>
      )}

      {/* Teacher Pages */}
      {currentUser.userType === "teacher" && (
        <>
          {currentPage === "teacher-dashboard" && (
            <TeacherDashboard
              currentUser={currentUser}
              users={users}
              assignments={assignments}
              setCurrentPage={setCurrentPage}
              setUsers={setUsers}
              addNotification={addNotification}
            />
          )}
          {currentPage === "create-quiz" && (
            <CreateQuizPage
              currentUser={currentUser}
              setCustomQuizzes={setCustomQuizzes}
              addNotification={addNotification}
            />
          )}
          {currentPage === "students" && (
            <StudentsPage
              currentUser={currentUser}
              users={users}
              setUsers={setUsers}
              addNotification={addNotification}
            />
          )}
          {currentPage === "assignments" && (
            <AssignmentsPage
              currentUser={currentUser}
              assignments={assignments}
              setAssignments={setAssignments}
              addNotification={addNotification}
            />
          )}
          {currentPage === "attendance" && (
            <AttendancePage
              currentUser={currentUser}
              users={users}
              attendance={attendance}
              setAttendance={setAttendance}
              addNotification={addNotification}
            />
          )}
          {currentPage === "teacher-profile" && (
            <ProfilePage
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              users={users}
              setUsers={setUsers}
              addNotification={addNotification}
              attendance={attendance}
            />
          )}
          {currentPage === "notifications" && (
            <NotificationsPage
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )}
        </>
      )}
      <AIChat />
    </div>
  );
};

export default PhysicsLearningPlatform;
