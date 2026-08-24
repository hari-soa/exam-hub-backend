export interface Question {
    id: number;
    exam_id: number;
    statement: string;
    points: number;
    position: number;
    created_at: Date;
}
