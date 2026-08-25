import { PoolClient } from "pg";
import { pool } from "../config/database";
import { ExamAttempt } from "../models/userModel";

export const AttemptRepository = {
  async findByStudentAndExam(
    studentId: string,
    examId: string,
  ): Promise<ExamAttempt | null> {
    const { rows } = await pool.query<ExamAttempt>(
      "SELECT * FROM attempts WHERE student_id = $1 AND exam_id = $2",
      [studentId, examId],
    );
    return rows[0] || null;
  },

  async findById(id: string): Promise<ExamAttempt | null> {
    const { rows } = await pool.query<ExamAttempt>(
      "SELECT * FROM attempts WHERE id = $1",
      [id],
    );
    return rows[0] || null;
  },

  async findByExamId(examId: string): Promise<ExamAttempt[]> {
    const { rows } = await pool.query<ExamAttempt>(
      "SELECT * FROM attempts WHERE exam_id = $1 ORDER BY submitted_at DESC",
      [examId],
    );
    return rows;
  },

  async findByStudentId(studentId: string): Promise<ExamAttempt[]> {
    const { rows } = await pool.query<ExamAttempt>(
      "SELECT * FROM attempts WHERE student_id = $1 ORDER BY submitted_at DESC",
      [studentId],
    );
    return rows;
  },

  async existsForExam(examId: string): Promise<boolean> {
    const { rows } = await pool.query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM attempts WHERE exam_id = $1",
      [examId],
    );
    return parseInt(rows[0].count, 10) > 0;
  },

  async create(
    client: PoolClient,
    studentId: string,
    examId: string,
    score: number,
    totalPoints: number,
  ): Promise<ExamAttempt> {
    const { rows } = await client.query<ExamAttempt>(
      `INSERT INTO attempts (student_id, exam_id, score, total_points)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
      [studentId, examId, score, totalPoints],
    );
    return rows[0];
  },
};
