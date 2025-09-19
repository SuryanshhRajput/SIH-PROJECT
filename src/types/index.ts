export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  userType: 'student' | 'teacher';
  // New student metadata
  rollNumber?: string; // unique per institution
  classSection?: string; // optional, e.g. "10-A"
  classId?: number; // selected class for hierarchical navigation
  contactNumber?: string; // for teachers
  progress?: {
    completedLessons: number;
    totalScore: number;
    quizScores: number[];
    // New gamification progress
    xp: number;
    level: number;
    badges: Badge[];
    completedChapters: number[];
    completedQuizzes: number[];
    completedGames: number[];
    streak: number;
    lastActiveDate: string;
  };
  profile?: {
    name: string; // full name
    email: string;
    grade: string; // e.g. "10th" or "Teacher"
  };
}

export interface Notification {
  id: number;
  message: string;
  timestamp: Date;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  teacherId: string;
  createdAt: string;
  // New targeting + resources
  targetGrades?: string[]; // grades that should see the assignment
  fileUrl?: string; // optional uploaded document URL
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  teacherId: string;
  createdAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface AnimationState {
  selectedDemo: 'freefall' | 'projectile' | 'uniform';
  isPlaying: boolean;
  time: number;
}

export interface PhysicsQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  topic: string;
}

export interface QuizAnswers {
  [questionId: number]: number;
}

export interface StudyNote {
  id: number;
  title: string;
  content: string;
  topic: string;
  createdAt: string;
}

// New hierarchical structure types
export interface Class {
  id: number;
  name: string;
  grade: number;
  theme: {
    primary: string;
    secondary: string;
    icon: string;
  };
}

export interface Subject {
  id: number;
  name: string;
  classId: number;
  icon: string;
  color: string;
  description: string;
}

export interface Chapter {
  id: number;
  title: string;
  subjectId: number;
  description: string;
  notes: ChapterNote[];
  quizzes: ChapterQuiz[];
  games: ChapterGame[];
  aiFacts: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ChapterNote {
  id: number;
  title: string;
  content: string;
  type: 'pdf' | 'text' | 'video';
  url?: string;
}

export interface ChapterQuiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  xpReward: number;
}

export interface ChapterGame {
  id: number;
  title: string;
  type: 'matching' | 'drag-drop' | 'quiz-battle';
  description: string;
  xpReward: number;
}

// Gamification types
export interface UserProgress {
  xp: number;
  level: number;
  badges: Badge[];
  completedChapters: number[];
  completedQuizzes: number[];
  completedGames: number[];
  streak: number;
  lastActiveDate: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'quiz' | 'game' | 'streak' | 'chapter' | 'special';
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  xp: number;
  level: number;
  classId: number;
  rank: number;
}

export interface AINotification {
  id: number;
  type: 'welcome' | 'fact' | 'motivation' | 'achievement';
  title: string;
  message: string;
  chapterId?: number;
  subjectId?: number;
  timestamp: string;
  isRead: boolean;
}