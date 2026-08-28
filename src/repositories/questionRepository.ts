// src/repositories/questionRepository.ts
import { pool } from '../config/database';

export class QuestionRepository {
  static async findByExamId(examId: number, includeCorrect: boolean = true) {
    const questionsQuery = 'SELECT * FROM questions WHERE exam_id = $1 ORDER BY id ASC';
    const qResult = await pool.query(questionsQuery, [examId]);
    const questions = qResult.rows;

    for (const q of questions) {
      let choicesQuery = 'SELECT id, choice_text FROM choices WHERE question_id = $1 ORDER BY id ASC';
      if (includeCorrect) {
        choicesQuery = 'SELECT id, choice_text, is_correct FROM choices WHERE question_id = $1 ORDER BY id ASC';
      }
      const cResult = await pool.query(choicesQuery, [q.id]);
      q.choices = cResult.rows;
    }

    return questions;
  }

  static async createQuestion(examId: number, questionText: string, points: number) {
    const query = 'INSERT INTO questions (exam_id, question_text, points) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [examId, questionText, points]);
    return result.rows[0];
  }

  static async createChoice(questionId: number, choiceText: string, isCorrect: boolean) {
    const query = 'INSERT INTO choices (question_id, choice_text, is_correct) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [questionId, choiceText, isCorrect]);
    return result.rows[0];
  }

  static async deleteQuestion(questionId: number) {
    const query = 'DELETE FROM questions WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [questionId]);
    return result.rows[0];
  }

  static async findQuestionById(questionId: number) {
    const query = 'SELECT * FROM questions WHERE id = $1';
    const result = await pool.query(query, [questionId]);
    return result.rows[0];
  }
}