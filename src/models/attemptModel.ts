export interface ExamAttempt {
  id: number;
  exam_id: number;
  student_id: number;
  submitted_at: Date;
  tab_switch_count: number;
  penalty_points: number;
  raw_score: number;
  final_score_over_20: number;
  is_submitted: boolean;
}

export interface StudentAnswer {
  id: number;
  attempt_id: number;
  question_id: number;
  selected_choice_id: number | null;
  is_correct: boolean;
  points_awarded: number;
}
