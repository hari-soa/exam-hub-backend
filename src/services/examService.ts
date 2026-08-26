import { ExamRepository } from "../repositories/examRepository";
import { Exam } from "../models/examModel";
import { ApiError } from "../utils/ApiError";

export const getAvailableExamsForStudent = async (
  _studentId: number,
): Promise<Exam[]> => {
  const now = new Date();
  const exams = await ExamRepository.findAll();
  return exams.filter((exam) => {
    const start = new Date(exam.start_time);
    const end = new Date(exam.end_time);
    return now >= start && now <= end;
  });
};

export const getExamForStudent = async (examId: number): Promise<Exam> => {
  const exam = await ExamRepository.findByIdWithQuestions(examId);
  if (!exam) {
    throw ApiError.notFound("Examen introuvable.");
  }

  const now = new Date();
  if (now < new Date(exam.start_time) || now > new Date(exam.end_time)) {
    throw ApiError.forbidden("Cet examen n'est pas disponible pour le moment.");
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
};
