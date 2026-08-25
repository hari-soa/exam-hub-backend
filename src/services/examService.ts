import * as examRepository from "../repositories/examRepository";
import { Exam } from "../models/examModel";

export const getAvailableExamsForStudent = async (
  studentId: number,
): Promise<Exam[]> => {
  const now = new Date();
  const exams = await examRepository.findAllExams();
  return exams.filter((exam) => {
    const start = new Date(exam.start_time);
    const end = new Date(exam.end_time);
    return now >= start && now <= end;
  });
};

export const getExamForStudent = async (examId: number): Promise<Exam> => {
  const exam = await examRepository.findExamById(examId);
  if (!exam) {
    const error: any = new Error("Exam not found.");
    error.statusCode = 404;
    throw error;
  }
  const now = new Date();
  if (now < new Date(exam.start_time) || now > new Date(exam.end_time)) {
    const error: any = new Error("This exam is not currently available.");
    error.statusCode = 403;
    throw error;
  }
  if (exam.questions) {
    exam.questions.forEach((q) => {
      if (q.choices) {
        q.choices.forEach((c) => {
          delete c.is_correct;
        });
      }
    });
  }
  return exam;
};
