import { ExamRepository } from "../repositories/examRepository";
import { Exam } from "../models/examModel";
import { ApiError } from "../utils/ApiError";

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
    if (!exam) {
      throw ApiError.notFound("Examen introuvable.");
    }

    const now = new Date();
    const start = new Date(exam.starts_at || exam.start_time);
    const end = new Date(exam.ends_at || exam.end_time);
    if (now < start || now > end) {
      throw ApiError.forbidden(
        "Cet examen n'est pas disponible pour le moment.",
      );
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
};
