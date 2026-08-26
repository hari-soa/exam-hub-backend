import { PoolClient } from "pg";
import { pool } from "../config/database";
import { ExamAttempt } from "../models/examModel";

export const AttemptRepository = {
  async findByStudentAndExam(
    studentId: number,
    examId: number,
  ): Promise<ExamAttempt | null> {
    const query = `
      SELECT * FROM exam_attempts 
      WHERE student_id = $1 AND exam_id = $2;
    `;
    const { rows } = await pool.query(query, [studentId, examId]);
    return rows[0] || null;
  },

  async findById(attemptId: number): Promise<ExamAttempt | null> {
    const query = `SELECT * FROM exam_attempts WHERE id = $1;`;
    const { rows } = await pool.query(query, [attemptId]);
    return rows[0] || null;
  },

  async findByStudentId(studentId: number): Promise<ExamAttempt[]> {
    const query = `
      SELECT a.*, e.title as exam_title 
      FROM exam_attempts a
      JOIN exams e ON a.exam_id = e.id
      WHERE a.student_id = $1
      ORDER BY a.submitted_at DESC;
    `;
    const { rows } = await pool.query(query, [studentId]);
    return rows;
  },

  async findByExamId(examId: number): Promise<any[]> {
    const query = `
      SELECT 
        a.id AS attempt_id,
        a.exam_id,
        a.student_id,
        a.raw_score,
        a.penalty_points,
        a.final_score_over_20,
        a.tab_switch_count,
        a.submitted_at,
        u.first_name,
        u.last_name,
        u.email
      FROM exam_attempts a
      JOIN users u ON a.student_id = u.id
      WHERE a.exam_id = $1 AND a.is_submitted = true
      ORDER BY a.submitted_at DESC;
    `;
    const { rows } = await pool.query(query, [examId]);
    return rows;
  },

  async createAttempt(
    client: PoolClient,
    data: Omit<ExamAttempt, "id" | "submitted_at">,
  ): Promise<ExamAttempt> {
    const query = `
      INSERT INTO exam_attempts 
        (exam_id, student_id, tab_switch_count, penalty_points, raw_score, final_score_over_20, is_submitted)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (exam_id, student_id) 
      DO UPDATE SET 
        tab_switch_count = EXCLUDED.tab_switch_count,
        penalty_points = EXCLUDED.penalty_points,
        raw_score = EXCLUDED.raw_score,
        final_score_over_20 = EXCLUDED.final_score_over_20,
        is_submitted = EXCLUDED.is_submitted,
        submitted_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [
      data.exam_id,
      data.student_id,
      data.tab_switch_count,
      data.penalty_points,
      data.raw_score,
      data.final_score_over_20,
      data.is_submitted,
    ];
    const { rows } = await client.query(query, values);
    return rows[0];
  },

  async create(
    client: PoolClient,
    studentId: number,
    examId: number,
    rawScore: number,
    totalPoints: number,
    tabSwitchCount: number = 0,
    penaltyPoints: number = 0,
  ): Promise<ExamAttempt> {
    const finalScore = Math.max(
      0,
      (rawScore / (totalPoints || 1)) * 20 - penaltyPoints,
    );
    return this.createAttempt(client, {
      exam_id: examId,
      student_id: studentId,
      tab_switch_count: tabSwitchCount,
      penalty_points: penaltyPoints,
      raw_score: rawScore,
      final_score_over_20: Math.round(finalScore * 100) / 100,
      is_submitted: true,
    });
  },

  async incrementTabSwitch(
    attemptId: number,
    studentId: number,
  ): Promise<number> {
    const query = `
      UPDATE exam_attempts 
      SET tab_switch_count = tab_switch_count + 1 
      WHERE id = $1 AND student_id = $2 AND is_submitted = false
      RETURNING tab_switch_count;
    `;
    const { rows } = await pool.query(query, [attemptId, studentId]);
    return rows[0] ? rows[0].tab_switch_count : 0;
  },
};
