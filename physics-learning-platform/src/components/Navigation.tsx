import React from "react";
import { Target, Trophy, User, CheckCircle, BookOpen, Settings, Play, Bell } from "lucide-react";
import { User as UserType, Notification } from "../types";

interface NavigationProps {
  currentUser: UserType | null;
  setCurrentPage: (page: string) => void;
  currentPage: string;
  notifications: Notification[];
  setCurrentUser: (user: UserType | null) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentUser, setCurrentPage, currentPage, notifications, setCurrentUser }) => (
  <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl border-b border-purple-200">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">Physics Motion Lab</h1>
          <span className="text-sm bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/30">
            {currentUser?.userType === "teacher" ? "👨‍🏫 Teacher" : "🎓 Student"}
          </span>
        </div>

        <div className="flex items-center space-x-6">
          {currentUser?.userType === "teacher" ? (
            // Teacher Navigation
            <>
              {["teacher-dashboard", "students", "create-quiz", "assignments", "attendance", "teacher-profile"].map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      currentPage === page
                        ? "bg-white/30 backdrop-blur-sm text-white shadow-lg border border-white/30"
                        : "text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm"
                    }`}
                  >
                    {page === "teacher-dashboard" && <Trophy className="w-5 h-5" />}
                    {page === "students" && <User className="w-5 h-5" />}
                    {page === "create-quiz" && <CheckCircle className="w-5 h-5" />}
                    {page === "assignments" && <BookOpen className="w-5 h-5" />}
                    {page === "attendance" && <CheckCircle className="w-5 h-5" />}
                    {page === "teacher-profile" && <Settings className="w-5 h-5" />}
                    <span className="capitalize">{page.replace("-", " ")}</span>
                  </button>
                )
              )}
            </>
          ) : (
            // Student Navigation
            <>
              {["dashboard", "lessons", "quiz", "notes", "profile"].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    currentPage === page 
                      ? "bg-white/30 backdrop-blur-sm text-white shadow-lg border border-white/30" 
                      : "text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  {page === "dashboard" && <Trophy className="w-5 h-5" />}
                  {page === "lessons" && <Play className="w-5 h-5" />}
                  {page === "quiz" && <CheckCircle className="w-5 h-5" />}
                  {page === "notes" && <BookOpen className="w-5 h-5" />}
                  {page === "profile" && <User className="w-5 h-5" />}
                  <span className="capitalize">{page}</span>
                </button>
              ))}
            </>
          )}

          <button
            onClick={() => setCurrentPage("notifications")}
            className="relative p-3 text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentUser(null);
              setCurrentPage("login");
            }}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Navigation;
