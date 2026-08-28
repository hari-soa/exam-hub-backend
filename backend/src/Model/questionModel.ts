export interface Choice {
  id?: number;
  question_id?: number;
  statement: string;
  is_correct: boolean;
}

export interface Question {
  id: number;
  exam_id: number;
  statement: string;
  points: number;
  choices?: Choice[];
}