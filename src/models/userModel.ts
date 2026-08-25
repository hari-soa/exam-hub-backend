export type UserRole = "admin" | "student";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  matricule?: string;
  password?: string;
  role: UserRole;
  is_active: boolean;
  created_at?: Date;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  created_at?: Date;
}

export interface Choice {
  id: string;
  question_id?: string;
  text: string;
  is_correct?: boolean;
}

export interface Question {
  id: string;
  exam_id?: string;
  prompt: string;
  points: number;
  choices?: Choice[];
}

export interface Exam {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  start_date: Date;
  end_date: Date;
  created_at?: Date;
}

export interface ExamAttempt {
  id: string;
  exam_id: string;
  student_id: string;
  score: number;
  total_points: number;
  submitted_at: Date;
}

export interface Answer {
  id: string;
  attempt_id: string;
  question_id: string;
  choice_id: string | null;
  is_correct: boolean;
}
