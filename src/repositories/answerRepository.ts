import { PoolClient } from "pg";
import { pool } from "../config/database";
import { Answer } from "../models/userModel";

export const AnswerRepository = {
  async create(
    client: PoolClient,
    attemptId: string,
    questionId: string,
    choiceId: string | null,
  ): Promise<Answer> {
    const { rows } = await client.query<Answer>(
      `INSERT INTO answers (attempt_id, question_id, choice_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
      [attemptId, questionId, choiceId],
    );
    return rows[0];
  },

  async findByAttemptId(attemptId: string): Promise<Answer[]> {
    const { rows } = await pool.query<Answer>(
      "SELECT * FROM answers WHERE attempt_id = $1",
      [attemptId],
    );
    return rows;
  },
};
