// src/repositories/examRepository.ts
import { pool } from '../config/database';

export class ExamRepository {
  static async findAll() {
    const query = `
      SELECT e.*, c.name as course_name, c.code as course_code 
      FROM exams e 
      JOIN courses c ON e.course_id = c.id 
      ORDER BY e.id DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: number) {
    const query = `
      SELECT e.*, c.name as course_name, c.code as course_code 
      FROM exams e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(courseId: number, title: string, description: string, startTime: string, endTime: string, durationMinutes: number) {
    const query = `
      INSERT INTO exams (course_id, title, description, start_time, end_time, duration_minutes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [courseId, title, description, startTime, endTime, durationMinutes]);
    return result.rows[0];
  }

  static async update(id: number, courseId: number, title: string, description: string, startTime: string, endTime: string, durationMinutes: number) {
    const query = `
      UPDATE exams 
      SET course_id = $1, title = $2, description = $3, start_time = $4, end_time = $5, duration_minutes = $6
      WHERE id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [courseId, title, description, startTime, endTime, durationMinutes, id]);
    return result.rows[0];
  }

  static async delete(id: number) {
    const query = 'DELETE FROM exams WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async hasAttempts(examId: number) {
    const query = 'SELECT COUNT(*) FROM exam_attempts WHERE exam_id = $1';
    const result = await pool.query(query, [examId]);
    return parseInt(result.rows[0].count, 10) > 0;
  }

  static async findAvailableForStudent(studentId: number) {
    const query = `
      SELECT e.*, c.name as course_name, c.code as course_code 
      FROM exams e 
      JOIN courses c ON e.course_id = c.id
      WHERE NOW() BETWEEN e.start_time AND e.end_time
      AND e.id NOT IN (
        SELECT exam_id FROM exam_attempts WHERE student_id = $1
      )
      ORDER BY e.end_time ASC
    `;
    const result = await pool.query(query, [studentId]);
    return result.rows;
  }

  static async getExamResults(examId: number) {
    const query = `
      SELECT ea.*, u.first_name, u.last_name, u.email, u.matricule
      FROM exam_attempts ea
      JOIN users u ON ea.student_id = u.id
      WHERE ea.exam_id = $1
      ORDER BY ea.submitted_at DESC
    `;
    const result = await pool.query(query, [examId]);
    return result.rows;
  }
}