import { ExamRepository } from "../repositories/examRepository";
import { QuestionRepository } from "../repositories/questionRepository";
import { pool } from "../config/database";

export class ExamService {
  static async getAllExams() {
    return await ExamRepository.findAll();
  }

  static async getExamsHistory() {
    if (typeof (ExamRepository as any).findHistory === "function") {
      return await (ExamRepository as any).findHistory();
    }
    return await ExamRepository.findAll();
  }

  static async getExamById(id: number) {
    const exam = await ExamRepository.findById(id);
    if (!exam) {
      const error: any = new Error("Exam not found");
      error.status = 404;
      throw error;
    }
    const questions = await QuestionRepository.findByExamId(id, true);
    return { ...exam, questions };
  }

  static async createExam(data: {
    course_id: number;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
  }) {
    return await ExamRepository.create(
      data.course_id,
      data.title,
      data.description || "",
      data.start_time,
      data.end_time,
      data.duration_minutes,
    );
  }

  static async updateExam(
    id: number,
    data: {
      course_id: number;
      title: string;
      description?: string;
      start_time: string;
      end_time: string;
      duration_minutes: number;
    },
  ) {
    const exam = await ExamRepository.findById(id);
    if (!exam) {
      const error: any = new Error("Exam not found");
      error.status = 404;
      throw error;
    }

    const hasAttempts = await ExamRepository.hasAttempts(id);
    if (hasAttempts) {
      const error: any = new Error(
        "Cannot modify exam because it has attempts (RG-08)",
      );
      error.status = 409;
      throw error;
    }

    return await ExamRepository.update(
      id,
      data.course_id,
      data.title,
      data.description || "",
      data.start_time,
      data.end_time,
      data.duration_minutes,
    );
  }

  static async deleteExam(id: number) {
    const exam = await ExamRepository.findById(id);
    if (!exam) {
      const error: any = new Error("Exam not found");
      error.status = 404;
      throw error;
    }

    const hasAttempts = await ExamRepository.hasAttempts(id);
    if (hasAttempts) {
      const error: any = new Error(
        "Cannot delete exam because it has attempts (RG-09)",
      );
      error.status = 409;
      throw error;
    }

    try {
      return await ExamRepository.delete(id);
    } catch (error: any) {
      if (error.code === "23503") {
        const customError: any = new Error(
          "Cannot delete exam due to existing dependencies (RG-09)",
        );
        customError.status = 409;
        throw customError;
      }
      throw error;
    }
  }

  static async getExamResults(examId: number) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      const error: any = new Error("Exam not found");
      error.status = 404;
      throw error;
    }

    const attempts = await ExamRepository.getExamResults(examId);
    let totalScore = 0;
    attempts.forEach(
      (a: any) => (totalScore += parseFloat(a.final_score_over_20)),
    );
    const average = attempts.length > 0 ? totalScore / attempts.length : 0;

    return {
      exam,
      attempts_count: attempts.length,
      average_score: parseFloat(average.toFixed(2)),
      attempts,
    };
  }

  static async submitExam(
    userId: number,
    examId: number,
    answers: Array<{
      questionId: number;
      selectedChoiceId?: number;
      textAnswer?: string;
    }>,
  ) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      const error: any = new Error("Exam not found");
      error.status = 404;
      throw error;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const attemptQuery = `
        INSERT INTO exam_attempts (user_id, exam_id, status)
        VALUES ($1, $2, 'soumis')
        RETURNING id;
      `;
      const attemptResult = await client.query(attemptQuery, [userId, examId]);
      const attemptId = attemptResult.rows[0].id;

      let totalScore = 0;

      if (Array.isArray(answers)) {
        for (const ans of answers) {
          const { questionId, selectedChoiceId, textAnswer } = ans;

          let isCorrect = false;
          let pointsAwarded = 0;

          if (selectedChoiceId) {
            const choiceCheck = await client.query(
              "SELECT is_correct FROM choices WHERE id = $1",
              [selectedChoiceId],
            );
            if (choiceCheck.rows.length > 0) {
              isCorrect = choiceCheck.rows[0].is_correct;
              pointsAwarded = isCorrect ? 1 : 0;
            }
          }

          totalScore += pointsAwarded;

          await client.query(
            `INSERT INTO student_answers (attempt_id, question_id, selected_choice_id, text_answer, is_correct, points_awarded)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              attemptId,
              questionId,
              selectedChoiceId || null,
              textAnswer || null,
              isCorrect,
              pointsAwarded,
            ],
          );
        }
      }

      await client.query("UPDATE exam_attempts SET score = $1 WHERE id = $2", [
        totalScore,
        attemptId,
      ]);

      await client.query("COMMIT");
      return { attemptId, score: totalScore };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
