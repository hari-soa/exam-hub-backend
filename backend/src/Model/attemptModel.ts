export interface Attempt {
  id: number;
  exam_id: number;
  student_id: number;
  score: number;
  submitted_at: Date;
}

export interface AnswerPayload {
  question_id: number;
  choice_id: number;
}