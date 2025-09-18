export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  userType: 'student' | 'teacher';
  progress?: {
    completedLessons: number;
    totalScore: number;
    quizScores: number[];
  };
  profile?: {
    name: string;
    email: string;
    grade: string;
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
  teacherId: number;
  createdAt: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  teacherId: number;
  createdAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface AttendanceRecord {
  studentId: number;
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
