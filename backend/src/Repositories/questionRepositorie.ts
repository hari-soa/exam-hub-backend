import { pool } from '../config/db.js';
import { Question, Choice } from '../Model/questionModel.js';

export const createQuestionRepo = async (examId: number, statement: string, points: number, choices: Choice[]): Promise<Question> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const qRes = await client.query(
      'INSERT INTO questions (exam_id, statement, points) VALUES ($1, $2, $3) RETURNING *',
      [examId, statement, points]
    );
    const question: Question = qRes.rows[0];
    question.choices = [];

    for (const choice of choices) {
      const cRes = await client.query(
        'INSERT INTO choices (question_id, statement, is_correct) VALUES ($1, $2, $3) RETURNING *',
        [question.id, choice.statement, choice.is_correct]
      );
      question.choices.push(cRes.rows[0]);
    }

    await client.query('COMMIT');
    return question;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getQuestionsByExamIdRepo = async (examId: number, hideCorrect: boolean = false): Promise<Question[]> => {
  const qResult = await pool.query('SELECT * FROM questions WHERE exam_id = $1', [examId]);
  const questions: Question[] = qResult.rows;

  for (const q of questions) {
    const cResult = await pool.query('SELECT id, statement, is_correct FROM choices WHERE question_id = $1', [q.id]);
    q.choices = cResult.rows.map(c => ({
      id: c.id,
      statement: c.statement,
      is_correct: hideCorrect ? false : c.is_correct
    }));
  }
  return questions;
};

export const deleteQuestionRepo = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM questions WHERE id = $1 RETURNING *', [id]);
  return (result.rowCount ?? 0) > 0;
};