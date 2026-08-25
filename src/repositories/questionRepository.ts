import { pool } from '../configuration/database.js';
import { Question, Choice } from '../models/userModel.js';

export class QuestionRepository {
  static async findByExamId(examId: string): Promise<Question[]> {
    const query = `SELECT * FROM questions WHERE exam_id = $1 ORDER BY id ASC`;
    const result = await pool.query(query, [examId]);
    return result.rows;
  }

  static async createQuestionWithChoices(
    examId: string,
    statement: string,
    points: number,
    choices: Array<{ content: string; is_correct: boolean }>
  ): Promise<Question> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const questionRes = await client.query(
        `INSERT INTO questions (exam_id, statement, points) VALUES ($1, $2, $3) RETURNING *`,
        [examId, statement, points]
      );
      const question: Question = questionRes.rows[0];

      for (const choice of choices) {
        await client.query(
          `INSERT INTO choices (question_id, content, is_correct) VALUES ($1, $2, $3)`,
          [question.id, choice.content, choice.is_correct]
        );
      }

      await client.query('COMMIT');
      return question;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async deleteQuestion(questionId: string): Promise<boolean> {
    const query = `DELETE FROM questions WHERE id = $1`;
    const result = await pool.query(query, [questionId]);
    return (result.rowCount ?? 0) > 0;
  }
}
