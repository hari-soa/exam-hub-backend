import { pool } from "../configuration/database";
import { Exam } from "../models/userModel";

export const ExamRepository = {
    async findAll(): Promise<Exam[]> {
        const query = `SELECT id, course_id, title, description, start_date, end_date FROM exams`;
        const result = await pool.query<Exam>(query);
        return result.rows;
    },

    async findByIdWithQuestions(examId: string): Promise<any> {
        const examQuery = `SELECT id, course_id, title, description, start_date, end_date FROM exams WHERE id = $1`;
        const examResult = await pool.query(examQuery, [examId]);
        if (examResult.rows.length === 0) return null;

        const questionsQuery = `SELECT id, exam_id, prompt, points FROM questions WHERE exam_id = $1`;
        const questionsResult = await pool.query(questionsQuery, [examId]);

        const questions = [];
        for (const q of questionsResult.rows) {
            const choicesQuery = `SELECT id, question_id, text FROM choices WHERE question_id = $1`;
            const choicesResult = await pool.query(choicesQuery, [q.id]);
            questions.push({
                ...q,
                choices: choicesResult.rows
            });
        }

        return {
            ...examResult.rows[0],
            questions
        };
    },
};