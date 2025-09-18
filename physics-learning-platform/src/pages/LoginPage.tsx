import React, { useState } from "react";
import { Target } from "lucide-react";
import { User, Notification } from "../types";

interface LoginPageProps {
  setCurrentUser: (user: User | null) => void;
  setCurrentPage: (page: string) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  setNotifications: (notifications: Notification[]) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentUser, setCurrentPage, users, setUsers, setNotifications }) => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      try {
        if (!loginData.username.trim() || !loginData.password.trim()) {
          alert("Please enter both username and password");
          setLoading(false);
          return;
        }

        if (isSignup) {
          const existingUser = users.find((u) => u.username === loginData.username.trim());
          if (existingUser) {
            alert("Username already exists. Please choose a different one.");
            setLoading(false);
            return;
          }

          const newUser: User = {
            id: Date.now(),
            username: loginData.username.trim(),
            email: `${loginData.username.trim()}@example.com`,
            password: loginData.password,
            userType: "student",
            progress: { completedLessons: 0, quizScores: [], totalScore: 0 },
            profile: { name: loginData.username.trim(), email: `${loginData.username.trim()}@example.com`, grade: "10th" },
          };

          setUsers([...users, newUser]);
          setCurrentUser(newUser);
          setNotifications([
            {
              id: Date.now(),
              message: "Welcome! Your account has been created successfully.",
              timestamp: new Date(),
            },
          ]);
          setCurrentPage("dashboard");
          alert("Account created successfully! Welcome to Physics Motion Lab!");
        } else {
          const user = users.find(
            (u) => u.username === loginData.username.trim() && u.password === loginData.password
          );
          if (user) {
            setCurrentUser(user);
            setNotifications([
              {
                id: Date.now(),
                message: "Welcome back!",
                timestamp: new Date(),
              },
            ]);
            setCurrentPage(user.userType === "teacher" ? "teacher-dashboard" : "dashboard");
            alert("Login successful!");
          } else {
            alert("Invalid credentials. Please try again or sign up for a new account.");
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred. Please try again.");
      }
      setLoading(false);
    }, 100);
  };

  // Demo login (student)
  const handleDemoLogin = (): void => {
    const demoUser: User = {
      id: Date.now(),
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
      id: Date.now(),
      username: "teacher",
      email: "teacher@school.com",
      password: "teacher123",
      userType: "teacher",
      profile: { name: "Ms. Johnson", email: "teacher@school.com", grade: "Teacher" },
    };

    const demoStudents: User[] = [
      {
        id: Date.now() + 1,
        username: "alice",
        email: "alice@student.com",
        password: "alice123",
        userType: "student",
        progress: { completedLessons: 3, quizScores: [85, 92, 78], totalScore: 85 },
        profile: { name: "Alice Smith", email: "alice@student.com", grade: "10th" },
      },
      {
        id: Date.now() + 2,
        username: "bob",
        email: "bob@student.com",
        password: "bob123",
        userType: "student",
        progress: { completedLessons: 2, quizScores: [70, 88], totalScore: 79 },
        profile: { name: "Bob Johnson", email: "bob@student.com", grade: "10th" },
      },
      {
        id: Date.now() + 3,
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
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Physics Motion Lab</h1>
          <p className="text-white/80 text-lg">Learn physics through interactive animations</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">Username</label>
            <input
              type="text"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
              placeholder="Enter your username"
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
