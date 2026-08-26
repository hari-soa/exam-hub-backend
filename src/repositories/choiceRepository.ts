import { PoolClient } from "pg";
import { pool } from "../config/database";
import { Choice } from "../models/examModel";

export const ChoiceRepository = {
  async findByQuestionId(questionId: number): Promise<Choice[]> {
    const { rows } = await pool.query<Choice>(
      "SELECT * FROM choices WHERE question_id = $1",
      [questionId],
    );
    return rows;
  },

  async findByQuestionIds(questionIds: number[]): Promise<Choice[]> {
    if (questionIds.length === 0) return [];
    const { rows } = await pool.query<Choice>(
      "SELECT * FROM choices WHERE question_id = ANY($1::int[])",
      [questionIds],
    );
    return rows;
  },

  async findById(id: number): Promise<Choice | null> {
    const { rows } = await pool.query<Choice>(
      "SELECT * FROM choices WHERE id = $1",
      [id],
    );
    return rows[0] || null;
  },

  async create(
    questionId: number,
    choiceText: string,
    isCorrect: boolean,
    client?: PoolClient,
  ): Promise<Choice> {
    const dbClient = client || pool;
    const { rows } = await dbClient.query<Choice>(
      `INSERT INTO choices (question_id, choice_text, is_correct)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [questionId, choiceText, isCorrect],
    );
    return rows[0];
  },

  async deleteByQuestionId(
    questionId: number,
    client?: PoolClient,
  ): Promise<void> {
    const dbClient = client || pool;
    await dbClient.query("DELETE FROM choices WHERE question_id = $1", [
      questionId,
    ]);
  },
};
