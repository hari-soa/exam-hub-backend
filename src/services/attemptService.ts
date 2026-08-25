// src/services/attemptService.ts
import { pool } from "../config/database";
import { ApiError } from "../utils/ApiError";

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

      // 1. Vérifier si l'examen existe et si la fenêtre est ouverte
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

      // 2. Vérifier si l'étudiant n'a pas déjà soumis (RG-02)
      const attemptCheck = await client.query(
        "SELECT id FROM attempts WHERE student_id = $1 AND exam_id = $2",
        [studentId, examId],
      );
      if (attemptCheck.rows.length > 0) {
        throw ApiError.conflict("Exam already taken");
      }

      // 3. Charger toutes les questions et leurs choix corrects
      const questionsRes = await client.query(
        `
        SELECT q.id as question_id, q.statement, q.points, q.position,
               c.id as correct_choice_id
        FROM questions q
        JOIN choices c ON c.question_id = q.id
        WHERE q.exam_id = $1 AND c.is_correct = true
        ORDER BY q.position ASC
      `,
        [examId],
      );

      const questions = questionsRes.rows;
      let totalPoints = 0;
      let studentScore = 0;
      const correction = [];

      // Mappe des réponses fournies par l'étudiant
      const answersMap = new Map<number, number>();
      for (const ans of submittedAnswers) {
        if (answersMap.has(ans.question_id)) {
          throw ApiError.badRequest(
            "Duplicate question response in submission",
          );
        }
        answersMap.set(ans.question_id, ans.choice_id);
      }

      // 4. Évaluer chaque question
      for (const q of questions) {
        totalPoints += q.points;
        const studentChoiceId = answersMap.get(q.question_id) ?? null;
        const isCorrect = studentChoiceId === q.correct_choice_id;

        if (isCorrect) {
          studentScore += q.points;
        }

        correction.push({
          question_id: q.question_id,
          statement: q.statement,
          points: q.points,
          student_choice_id: studentChoiceId,
          correct_choice_id: q.correct_choice_id,
          is_correct: isCorrect,
        });
      }

      // 5. Enregistrer la tentative en base
      await client.query(
        `INSERT INTO attempts (student_id, exam_id, score, total_points, submitted_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [studentId, examId, studentScore, totalPoints],
      );

      await client.query("COMMIT");

      // 6. Retourner la réponse exactement comme décrite dans OpenAPI
      return {
        score: studentScore,
        total_points: totalPoints,
        correction,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
