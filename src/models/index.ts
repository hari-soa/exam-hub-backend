// ==========================================
// 1. UTILISATEURS & ÉTUDIANTS
// ==========================================
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'student';
  is_active: boolean;
  created_at?: string | Date;
}

export interface StudentResponse {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

// ==========================================
// 2. COURS
// ==========================================
export interface Course {
  id: number;
  code: string;
  name: string;
  description: string | null;
  exam_count?: number;
}

// ==========================================
// 3. EXAMENS
// ==========================================
export interface ExamInput {
  course_id: number;
  title: string;
  description?: string | null;
  starts_at: string;
  ends_at: string;
}

export interface ExamResponse {
  id: number;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  course: {
    id: number;
    code: string;
    name: string;
  };
  question_count: number;
  attempt_count: number;
}

export interface ExamResultResponse {
  exam: {
    id: number;
    title: string;
  };
  total_points: number;
  average: number | null;
  attempt_count: number;
  results: {
    student_id: number;
    name: string;
    score: number;
    submitted_at: string;
  }[];
}

// ==========================================
// 4. QUESTIONS & CHOIX
// ==========================================
export interface ChoiceInput {
  text: string;
  is_correct: boolean;
}

export interface ChoiceResponse {
  id: number;
  text: string;
  is_correct: boolean;
}

export interface QuestionInput {
  statement: string;
  points?: number;
  position?: number;
  choices: ChoiceInput[];
}

export interface QuestionResponse {
  id: number;
  exam_id: number;
  statement: string;
  points: number;
  position: number;
  choices: ChoiceResponse[];
}

// ==========================================
// 5. TENTATIVES & RÉSULTATS (ATTEMPTS)
// ==========================================
export interface SubmitAnswerInput {
  question_id: number;
  choice_id: number;
}

export interface SubmitAnswersDTO {
  answers: SubmitAnswerInput[];
}

export interface CorrectionLine {
  question_id: number;
  statement: string;
  points: number;
  student_choice_id: number | null;
  correct_choice_id: number;
  is_correct: boolean;
}

export interface SubmissionResponse {
  score: number;
  total_points: number;
  correction: CorrectionLine[];
}

export interface StudentResultHistory {
  exam_id: number;
  title: string;
  course_code: string;
  score: number;
  total_points: number;
  submitted_at: string;
}