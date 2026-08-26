import { PoolClient } from "pg";
import { pool } from "../config/database";

export const AnswerRepository = {
  async create(
    client: PoolClient,
    attemptId: number,
    questionId: number,
    selectedChoiceId: number | null,
    isCorrect: boolean,
    pointsAwarded: number,
  ): Promise<void> {
    const query = `
      INSERT INTO student_answers 
        (attempt_id, question_id, selected_choice_id, is_correct, points_awarded)
      VALUES ($1, $2, $3, $4, $5);
    `;
    await client.query(query, [
      attemptId,
      questionId,
      selectedChoiceId,
      isCorrect,
      pointsAwarded,
    ]);
  },

  async findByAttemptId(attemptId: number): Promise<any[]> {
    const query = `
      SELECT 
        sa.id,
        sa.question_id,
        sa.selected_choice_id,
        sa.is_correct,
        sa.points_awarded,
        q.question_text,
        q.points AS question_points
      FROM student_answers sa
      JOIN questions q ON sa.question_id = q.id
      WHERE sa.attempt_id = $1;
    `;
    const { rows } = await pool.query(query, [attemptId]);
    return rows;
  },
};
