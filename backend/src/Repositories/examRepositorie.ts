import { pool } from '../config/db.js';
import { Exam } from '../Model/examModel.js';

export const createExamRepo = async (courseId: number, title: string, description: string, startTime: string, endTime: string): Promise<Exam> => {
  const result = await pool.query(
    'INSERT INTO exams (course_id, title, description, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [courseId, title, description, startTime, endTime]
  );
  return result.rows[0];
};

export const getAllExamsRepo = async (): Promise<Exam[]> => {
  const result = await pool.query('SELECT * FROM exams');
  return result.rows;
};

export const getExamByIdRepo = async (id: number): Promise<Exam | null> => {
  const result = await pool.query('SELECT * FROM exams WHERE id = $1', [id]);
  return result.rows[0];
};

export const deleteExamRepo = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM exams WHERE id = $1 RETURNING *', [id]);
  return (result.rowCount ?? 0) > 0;
};

export const countExamAttemptsRepo = async (examId: number): Promise<number> => {
  const result = await pool.query('SELECT COUNT(*) FROM attempts WHERE exam_id = $1', [examId]);
  return parseInt(result.rows[0].count, 10);
};