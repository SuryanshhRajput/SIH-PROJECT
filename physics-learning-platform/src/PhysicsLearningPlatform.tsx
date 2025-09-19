import React, { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc,  } from "firebase/firestore";
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
          {currentPage === "dashboard" && (
            <Dashboard currentUser={currentUser} setCurrentPage={setCurrentPage} />
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
    </div>
  );
};

export default PhysicsLearningPlatform;
