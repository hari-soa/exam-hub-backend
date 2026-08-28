import { pool } from '../config/db.js';

export const saveAttemptRepo = async (examId: number, studentId: number, score: number, answers: { question_id: number; choice_id: number }[]) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const attemptRes = await client.query(
      'INSERT INTO attempts (exam_id, student_id, score) VALUES ($1, $2, $3) RETURNING *',
      [examId, studentId, score]
    );
    const attempt = attemptRes.rows[0];

    for (const ans of answers) {
      await client.query(
        'INSERT INTO answers (attempt_id, question_id, choice_id) VALUES ($1, $2, $3)',
        [attempt.id, ans.question_id, ans.choice_id]
      );
    }

    await client.query('COMMIT');
    return attempt;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getAttemptsByStudentRepo = async (studentId: number) => {
  const result = await pool.query('SELECT * FROM attempts WHERE student_id = $1', [studentId]);
  return result.rows;
};

export const getAttemptsByExamRepo = async (examId: number) => {
  const result = await pool.query(
    'SELECT a.*, u.email as student_email FROM attempts a JOIN users u ON a.student_id = u.id WHERE a.exam_id = $1',
    [examId]
  );
  return result.rows;
};

export const checkExistingAttemptRepo = async (examId: number, studentId: number) => {
  const result = await pool.query('SELECT * FROM attempts WHERE exam_id = $1 AND student_id = $2', [examId, studentId]);
  return result.rows[0];
};