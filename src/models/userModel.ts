export type UserRole = "admin" | "student";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role: UserRole;
  is_active: boolean;
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
  choices: Choice[];
}

export interface Exam {
  id: string;
  course_id: string;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
}

export interface ExamAttempt {
  id: string;
  exam_id: string;
  student_id: string;
  score: number;
  total_points: number;
  submitted_at: Date;
}
