import { pool } from "../config/database";
import { ExamRepository } from "../repositories/examRepository";
import { QuestionRepository } from "../repositories/questionRepository";
import { ChoiceRepository } from "../repositories/choiceRepository";
import { AttemptRepository } from "../repositories/attemptRepository";
import { Exam, Question, Choice } from "../models/examModel";
import { ApiError } from "../utils/ApiError";

const questionRepo = QuestionRepository as any;

export const ExamService = {
  async getAvailableExamsForStudent(_studentId: number): Promise<Exam[]> {
    const now = new Date();
    const exams = await ExamRepository.findAll();
    return exams.filter((exam: any) => {
      const start = new Date(exam.starts_at || exam.start_time);
      const end = new Date(exam.ends_at || exam.end_time);
      return now >= start && now <= end;
    });
  },

  async getExamForStudent(examId: number): Promise<Exam> {
    const exam = await ExamRepository.findByIdWithQuestions(examId);
    if (!exam) throw ApiError.notFound("Exam not found.");

    const now = new Date();
    const start = new Date(exam.starts_at || exam.start_time);
    const end = new Date(exam.ends_at || exam.end_time);
    if (now < start || now > end) {
      throw ApiError.forbidden("This exam is not available at the moment.");
    }
    if (exam.questions) {
      exam.questions.forEach((q: any) => {
        if (q.choices) {
          q.choices.forEach((c: any) => {
            delete c.is_correct;
          });
        }
      });
    }
    return exam;
  },

  async getAllExams(): Promise<Exam[]> {
    return await ExamRepository.findAll();
  },

  async getExamById(id: number): Promise<Exam> {
    const exam = await ExamRepository.findByIdWithQuestions(id);
    if (!exam) throw ApiError.notFound("Exam not found");
    return exam;
  },

  async createExam(data: {
    course_id: number;
    title: string;
    description?: string;
    starts_at: string;
    ends_at: string;
  }): Promise<Exam> {
    if (!data.course_id || !data.title || !data.starts_at || !data.ends_at) {
      throw ApiError.badRequest("Incomplete exam data");
    }
    return await ExamRepository.create(data);
  },

  async updateExam(id: number, data: Partial<Exam>): Promise<Exam> {
    const exam = await ExamRepository.findById(id);
    if (!exam) throw ApiError.notFound("Exam not found");

    const attempts = await AttemptRepository.findByExamId(id);
    if (attempts.length > 0) {
      throw ApiError.conflict(
        "Cannot update an exam that already has student attempts.",
      );
    }

    return await ExamRepository.update(id, data);
  },

  async deleteExam(id: number): Promise<void> {
    const exam = await ExamRepository.findById(id);
    if (!exam) throw ApiError.notFound("Exam not found");

    const attempts = await AttemptRepository.findByExamId(id);
    if (attempts.length > 0) {
      throw ApiError.conflict(
        "Cannot delete an exam that has existing student attempts.",
      );
    }

    await ExamRepository.delete(id);
  },

  async getExamResults(examId: number) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) throw ApiError.notFound("Exam not found");

    const attempts = await AttemptRepository.findByExamId(examId);
    const totalAttempts = attempts.length;

    const averageScore =
      totalAttempts > 0
        ? attempts.reduce(
            (acc: number, curr: any) => acc + Number(curr.final_score_over_20),
            0,
          ) / totalAttempts
        : 0;

    return {
      exam_id: examId,
      total_attempts: totalAttempts,
      average_score: Math.round(averageScore * 100) / 100,
      attempts,
    };
  },

  async addQuestionToExam(
    examId: number,
    data: { question_text: string; points: number; choices: Choice[] },
  ): Promise<Question> {
    const attempts = await AttemptRepository.findByExamId(examId);
    if (attempts.length > 0) {
      throw ApiError.conflict(
        "Cannot add a question: this exam already has student attempts.",
      );
    }

    if (!data.choices || data.choices.length < 2 || data.choices.length > 6) {
      throw ApiError.badRequest(
        "A question must have between 2 and 6 choices.",
      );
    }

    const correctChoicesCount = data.choices.filter((c) => c.is_correct).length;
    if (correctChoicesCount !== 1) {
      throw ApiError.badRequest(
        "A question must have exactly one correct choice.",
      );
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const question = await questionRepo.create(
        {
          exam_id: examId,
          question_text: data.question_text,
          points: data.points,
        },
        client,
      );
      for (const choice of data.choices) {
        await ChoiceRepository.create(
          question.id,
          choice.choice_text,
          Boolean(choice.is_correct),
          client,
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

  async updateQuestion(
    questionId: number,
    data: Partial<Question>,
  ): Promise<Question> {
    const question = await questionRepo.findById(questionId);
    if (!question) throw ApiError.notFound("Question not found");

    const attempts = await AttemptRepository.findByExamId(question.exam_id);
    if (attempts.length > 0) {
      throw ApiError.conflict(
        "Cannot update a question in an exam with existing attempts.",
      );
    }

    const updated = await questionRepo.update(questionId, data);
    if (!updated) throw ApiError.notFound("Question not found");

    return updated;
  },

  async deleteQuestion(questionId: number): Promise<void> {
    const question = await questionRepo.findById(questionId);
    if (!question) throw ApiError.notFound("Question not found");

    const attempts = await AttemptRepository.findByExamId(question.exam_id);
    if (attempts.length > 0) {
      throw ApiError.conflict(
        "Cannot delete a question in an exam with existing attempts.",
      );
    }

    await questionRepo.delete(questionId);
  },
};
