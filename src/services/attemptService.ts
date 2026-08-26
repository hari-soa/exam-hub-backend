import { pool } from "../config/database";
import { ApiError } from "../utils/ApiError";
import { gradeExam, SubmittedAnswer } from "../utils/graderExam";

export interface SubmitAnswerDTO {
  question_id: number;
  choice_id: number;
}

export class AttemptService {
  static async submitExam(
    studentId: number,
    examId: number,
    submittedAnswers: SubmitAnswerDTO[],
  ) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const examRes = await client.query(
        "SELECT id, starts_at, ends_at FROM exams WHERE id = $1",
        [examId],
      );
      if (examRes.rows.length === 0) throw ApiError.notFound("Exam not found");
      const exam = examRes.rows[0];
      const now = new Date();
      if (now < new Date(exam.starts_at) || now > new Date(exam.ends_at)) {
        throw ApiError.forbidden("Exam is not available");
      }

      const attemptCheck = await client.query(
        "SELECT id FROM attempts WHERE student_id = $1 AND exam_id = $2",
        [studentId, examId],
      );
      if (attemptCheck.rows.length > 0) {
        throw ApiError.conflict("Exam already taken");
      }

      const questionsRes = await client.query(
        `SELECT id, question_text, points FROM questions WHERE exam_id = $1 ORDER BY position ASC`,
        [examId],
      );
      const questions = questionsRes.rows;

      const choicesRes = await client.query(
        `SELECT c.id, c.question_id, c.choice_text as text, c.is_correct 
         FROM choices c 
         JOIN questions q ON q.id = c.question_id 
         WHERE q.exam_id = $1`,
        [examId],
      );

      const choicesByQuestion = new Map<number, any[]>();
      for (const choice of choicesRes.rows) {
        if (!choicesByQuestion.has(choice.question_id)) {
          choicesByQuestion.set(choice.question_id, []);
        }
        choicesByQuestion.get(choice.question_id)!.push(choice);
      }

      const gradingResult = gradeExam(
        questions,
        choicesByQuestion,
        submittedAnswers as SubmittedAnswer[],
      );

      await client.query(
        `INSERT INTO attempts (student_id, exam_id, score, total_points, submitted_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [studentId, examId, gradingResult.score, gradingResult.total_points],
      );

      await client.query("COMMIT");
      return gradingResult;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
