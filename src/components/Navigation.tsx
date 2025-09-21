import React, { useState } from "react";
import { Target, Trophy, User, CheckCircle, BookOpen, Settings, Play, Bell, Menu, X } from "lucide-react";
import { User as UserType, Notification } from "../types";

interface NavigationProps {
  currentUser: UserType | null;
  setCurrentPage: (page: string) => void;
  currentPage: string;
  notifications: Notification[];
  setCurrentUser: (user: UserType | null) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentUser, setCurrentPage, currentPage, notifications, setCurrentUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = currentUser?.userType === "teacher" 
    ? ["teacher-dashboard", "students", "create-quiz", "assignments", "attendance", "ai", "teacher-profile"]
    : ["dashboard", "lessons", "quiz", "ai", "notes", "profile"];

  const getIcon = (page: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "teacher-dashboard": <Trophy className="w-5 h-5" />,
      "dashboard": <Trophy className="w-5 h-5" />,
      "students": <User className="w-5 h-5" />,
      "create-quiz": <CheckCircle className="w-5 h-5" />,
      "assignments": <BookOpen className="w-5 h-5" />,
      "attendance": <CheckCircle className="w-5 h-5" />,
      "lessons": <Play className="w-5 h-5" />,
      "quiz": <CheckCircle className="w-5 h-5" />,
      "ai": <Play className="w-5 h-5" />,
      "notes": <BookOpen className="w-5 h-5" />,
      "profile": <User className="w-5 h-5" />,
      "teacher-profile": <Settings className="w-5 h-5" />
    };
    return iconMap[page] || <Play className="w-5 h-5" />;
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg">Vidya Verse</h1>
            <span className="hidden sm:inline text-sm bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/30">
              {currentUser?.userType === "teacher" ? "👨‍🏫 Teacher" : "🎓 Student"}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navigationItems.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  currentPage === page
                    ? "bg-white/30 backdrop-blur-sm text-white shadow-lg border border-white/30"
                    : "text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm"
                }`}
              >
                {getIcon(page)}
                <span className="capitalize text-sm">{page.replace("-", " ")}</span>
              </button>
            ))}

            <button
              onClick={() => setCurrentPage("notifications")}
              className="relative p-3 text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setCurrentUser(null);
                setCurrentPage("login");
              }}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage("notifications")}
              className="relative p-2 text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center shadow-lg animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/20">
            <div className="space-y-2">
              {navigationItems.map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    currentPage === page
                      ? "bg-white/30 backdrop-blur-sm text-white shadow-lg border border-white/30"
                      : "text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  {getIcon(page)}
                  <span className="capitalize">{page.replace("-", " ")}</span>
                </button>
              ))}
              
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentPage("login");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-lg mt-4"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
