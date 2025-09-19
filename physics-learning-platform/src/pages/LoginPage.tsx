import React, { useState } from "react";
import { Target } from "lucide-react";
import { User, Notification } from "../types";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

interface LoginPageProps {
  setCurrentUser: (user: User | null) => void;
  setCurrentPage: (page: string) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  setNotifications: (notifications: Notification[]) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  setCurrentUser,
  setCurrentPage,
  users,
  setUsers,
  setNotifications,
}) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  // signup fields
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [classSection, setClassSection] = useState("");
  const [grade, setGrade] = useState("");

  // 🔹 Firebase-powered login/signup
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!loginData.email.trim() || !loginData.password.trim()) {
        alert("Please enter both email and password");
        setLoading(false);
        return;
      }

      if (isSignup) {
        // Validate signup fields
        if (!fullName.trim() || !rollNumber.trim() || !grade.trim()) {
          alert("Please fill Full Name, Roll Number and Grade");
          setLoading(false);
          return;
        }
        // Ensure unique roll number
        const q = query(collection(db, "users"), where("rollNumber", "==", rollNumber.trim()));
        const existing = await getDocs(q);
        if (!existing.empty) {
          alert("This roll number is already registered.");
          setLoading(false);
          return;
        }
        // Signup → Firebase auth + Firestore profile
        const userCred = await createUserWithEmailAndPassword(
          auth,
          loginData.email.trim(),
          loginData.password
        );

        const newUser: User = {
          id: userCred.user.uid,
          username: fullName.trim(),
          email: loginData.email.trim(),
          password: loginData.password,
          userType: "student",
          rollNumber: rollNumber.trim(),
          classSection: classSection.trim() || undefined,
          progress: { completedLessons: 0, quizScores: [], totalScore: 0 },
          profile: {
            name: fullName.trim(),
            email: loginData.email.trim(),
            grade: grade.trim() || "",
          },
        };

        await setDoc(doc(db, "users", newUser.id), newUser);

        setCurrentUser(newUser);
        setCurrentPage("dashboard");
        setNotifications([
          {
            id: Date.now(),
            message: "Welcome! Account created successfully.",
            timestamp: new Date(),
          },
        ]);
        alert("Account created successfully! Welcome to Vidya Verse!");
      } else {
        // Login → Firebase auth + fetch profile
        const userCred = await signInWithEmailAndPassword(
          auth,
          loginData.email.trim(),
          loginData.password
        );

        const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setCurrentUser(userData);
          setCurrentPage(
            userData.userType === "teacher" ? "teacher-dashboard" : "dashboard"
          );
          setNotifications([
            { id: Date.now(), message: "Welcome back!", timestamp: new Date() },
          ]);
          alert("Login successful!");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Demo login (student)
  const handleDemoLogin = (): void => {
    const demoUser: User = {
      id: String(Date.now()),
      username: "demo",
      email: "demo@example.com",
      password: "demo123",
      userType: "student",
      progress: { completedLessons: 2, quizScores: [80, 90], totalScore: 85 },
      profile: { name: "Demo Student", email: "demo@example.com", grade: "10th" },
    };

    setUsers([...users, demoUser]);
    setCurrentUser(demoUser);
    setCurrentPage("dashboard");
    alert("Demo login successful!");
  };

  // Demo login (teacher)
  const handleTeacherDemo = (): void => {
    const teacherUser: User = {
      id: String(Date.now()),
      username: "teacher",
      email: "teacher@school.com",
      password: "teacher123",
      userType: "teacher",
      profile: { name: "Ms. Johnson", email: "teacher@school.com", grade: "Teacher" },
    };

    const demoStudents: User[] = [
      {
        id: String(Date.now() + 1),
        username: "alice",
        email: "alice@student.com",
        password: "alice123",
        userType: "student",
        progress: { completedLessons: 3, quizScores: [85, 92, 78], totalScore: 85 },
        profile: { name: "Alice Smith", email: "alice@student.com", grade: "10th" },
      },
      {
        id: String(Date.now() + 2),
        username: "bob",
        email: "bob@student.com",
        password: "bob123",
        userType: "student",
        progress: { completedLessons: 2, quizScores: [70, 88], totalScore: 79 },
        profile: { name: "Bob Johnson", email: "bob@student.com", grade: "10th" },
      },
      {
        id: String(Date.now() + 3),
        username: "carol",
        email: "carol@student.com",
        password: "carol123",
        userType: "student",
        progress: { completedLessons: 4, quizScores: [95, 87, 91, 89], totalScore: 90 },
        profile: { name: "Carol Davis", email: "carol@student.com", grade: "10th" },
      },
    ];

    setUsers([...users, teacherUser, ...demoStudents]);
    setCurrentUser(teacherUser);
    setCurrentPage("teacher-dashboard");
    alert("Teacher demo login successful!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20 relative z-10">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Vidya Verse</h1>
          <p className="text-white/80 text-lg">Learn anything through interactive animations</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {isSignup && (
            <>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">Roll Number</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                    placeholder="Unique roll number"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">Class Section (optional)</label>
                  <input
                    type="text"
                    value={classSection}
                    onChange={(e) => setClassSection(e.target.value)}
                    className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                    placeholder="e.g. 10-A"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">Grade</label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                  placeholder="e.g. 10th"
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">Email</label>
            <input
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">Password</label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl transition-all duration-300 font-semibold text-lg transform hover:scale-105 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl"
            } text-white`}
            disabled={loading}
          >
            {loading ? "Processing..." : isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-white/80 hover:text-white text-sm mb-6 transition-colors duration-300"
            disabled={loading}
          >
            {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="border-t border-white/20 pt-6 space-y-3">
          <div className="text-center mb-4">
            <p className="text-white/70 text-sm">Try our demo accounts</p>
          </div>
          <button
            onClick={handleDemoLogin}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
            disabled={loading}
          >
            🎓 Student Demo Login
          </button>
          <button
            onClick={handleTeacherDemo}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
            disabled={loading}
          >
            👨‍🏫 Teacher Demo Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
