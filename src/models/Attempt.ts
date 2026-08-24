export interface Attempt {
    id: number;
    student_id: number;
    exam_id: number;
    submitted_at: Date;
    score: number;
    max_score: number;
}
