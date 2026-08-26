export interface Choice {
  id: number;
  question_id?: number;
  choice_text: string;
  is_correct?: boolean;
}

export interface Question {
  id: number;
  exam_id?: number;
  question_text: string;
  points: number;
  choices?: Choice[];
}

export interface Exam {
  id: number;
  course_id: number;
  title: string;
  description?: string | null;
  start_time: Date;
  end_time: Date;
  duration_minutes: number;
  created_at?: Date;
  questions?: Question[];
}

export interface ExamAttempt {
  id?: number;
  exam_id: number;
  student_id: number;
  tab_switch_count: number;
  penalty_points: number;
  raw_score: number;
  final_score_over_20: number;
  is_submitted: boolean;
  submitted_at?: Date | string;
}
