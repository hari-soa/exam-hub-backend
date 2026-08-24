export interface Exam {
    id: number;
    course_id: number;
    title: string;
    description: string | null;
    start_at: Date;
    end_at: Date;
    created_at: Date;
}
