import { pool } from '../configuration/database.js';
import { Exam } from '../models/userModel.js';

export class ExamRepository {
  static async findAll(): Promise<Exam[]> {
    const query = `SELECT * FROM exams ORDER BY created_at DESC`;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: string): Promise<Exam | undefined> {
    const query = `SELECT * FROM exams WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(exam: Omit<Exam, 'id'>): Promise<Exam> {
    const query = `
      INSERT INTO exams (course_id, title, instructions, duration_minutes, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, course_id, title, instructions, duration_minutes, start_time, end_time
    `;
    const values = [
      exam.course_id,
      exam.title,
      exam.instructions || null,
      exam.duration_minutes,
      exam.start_date,
      exam.end_date
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id: string, exam: Partial<Exam>): Promise<Exam | undefined> {
    const query = `
      UPDATE exams
      SET course_id = COALESCE($1, course_id),
          title = COALESCE($2, title),
          instructions = COALESCE($3, instructions),
          duration_minutes = COALESCE($4, duration_minutes),
          start_time = COALESCE($5, start_time),
          end_time = COALESCE($6, end_time)
      WHERE id = $7
      RETURNING id, course_id, title, instructions, duration_minutes, start_time, end_time
    `;
    const values = [
      exam.course_id,
      exam.title,
      exam.instructions,
      exam.duration_minutes,
      exam.start_date,
      exam.end_date,
      id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM exams WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
