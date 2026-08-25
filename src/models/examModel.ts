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
