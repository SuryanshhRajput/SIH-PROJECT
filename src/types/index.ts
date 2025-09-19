export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  userType: 'student' | 'teacher';
  // New student metadata
  rollNumber?: string; // unique per institution
  classSection?: string; // optional, e.g. "10-A"
  progress?: {
    completedLessons: number;
    totalScore: number;
    quizScores: number[];
  };
  profile?: {
    name: string; // full name
    email: string;
    grade: string; // e.g. "10th"
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
