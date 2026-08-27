import { PoolClient } from "pg";
import { pool } from "../config/database";
import { Question } from "../models/examModel";

export interface QuestionData {
  exam_id: number;
  question_text: string;
  points: number;
}

export interface ChoiceData {
  choice_text: string;
  is_correct: boolean;
}

export interface IQuestionRepository {
  findById(id: number): Promise<Question | null>;
  findByExamId(examId: number): Promise<Question[]>;
  create(data: QuestionData, client?: PoolClient): Promise<Question>;
  createQuestionWithChoices(
    examId: number,
    questionText: string,
    points: number,
    choices: ChoiceData[],
  ): Promise<Question>;
  update(id: number, data: Partial<QuestionData>): Promise<Question | null>;
  delete(id: number): Promise<boolean>;
}

export const QuestionRepository: IQuestionRepository = {
  async findById(id: number) {
    const { rows } = await pool.query<Question>(
      "SELECT * FROM questions WHERE id = $1;",
      [id],
    );
    return rows[0] || null;
  },

  async findByExamId(examId: number) {
    const { rows } = await pool.query<Question>(
      "SELECT * FROM questions WHERE exam_id = $1 ORDER BY id ASC;",
      [examId],
    );
    return rows;
  },

  async create(data: QuestionData, client?: PoolClient) {
    const dbClient = client || pool;
    const { rows } = await dbClient.query<Question>(
      `INSERT INTO questions (exam_id, question_text, points)
       VALUES ($1, $2, $3)
       RETURNING *;`,
      [data.exam_id, data.question_text, data.points],
    );
    return rows[0];
  },

  async createQuestionWithChoices(
    examId: number,
    questionText: string,
    points: number,
    choices: ChoiceData[],
  ) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const questionResult = await client.query<Question>(
        `INSERT INTO questions (exam_id, question_text, points)
         VALUES ($1, $2, $3)
         RETURNING *;`,
        [examId, questionText, points],
      );
      const question = questionResult.rows[0];

      for (const choice of choices) {
        await client.query(
          `INSERT INTO choices (question_id, choice_text, is_correct)
           VALUES ($1, $2, $3);`,
          [question.id, choice.choice_text, choice.is_correct],
        );
      }

      await client.query("COMMIT");
      return question;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async update(id: number, data: Partial<QuestionData>) {
    const { rows } = await pool.query<Question>(
      `UPDATE questions
       SET question_text = COALESCE($1, question_text),
           points = COALESCE($2, points)
       WHERE id = $3
       RETURNING *;`,
      [data.question_text, data.points, id],
    );
    return rows[0] || null;
  },

  async delete(id: number) {
    const result = await pool.query("DELETE FROM questions WHERE id = $1;", [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  },
};
