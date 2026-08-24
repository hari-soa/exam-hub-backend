import { db } from "../configuration/database";

export class AttemptRepository {
  static async hasAttempts(examId: string): Promise<boolean> {
    const query = `SELECT COUNT(*) FROM exam_attempts WHERE exam_id = $1`;
    const result = await db.query(query, [examId]);
    return parseInt(result.rows[0].count, 10) > 0;
  }

  static async hasStudentAttempted(
    examId: string,
    studentId: string,
  ): Promise<boolean> {
    const query = `SELECT id FROM exam_attempts WHERE exam_id = $1 AND student_id = $2`;
    const result = await db.query(query, [examId, studentId]);
    return result.rows.length > 0;
  }

  static async createAttempt(
    examId: string,
    studentId: string,
    score: number,
    totalPoints: number,
  ): Promise<string> {
    const query = `
      INSERT INTO exam_attempts (exam_id, student_id, score, total_points)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const result = await db.query(query, [
      examId,
      studentId,
      score,
      totalPoints,
    ]);
    return result.rows[0].id;
  }

  static async recordAnswer(
    attemptId: string,
    questionId: string,
    choiceId: string | null,
    isCorrect: boolean,
  ): Promise<void> {
    const query = `
      INSERT INTO attempt_answers (attempt_id, question_id, choice_id, is_correct)
      VALUES ($1, $2, $3, $4)
    `;
    await db.query(query, [attemptId, questionId, choiceId, isCorrect]);
  }
}
