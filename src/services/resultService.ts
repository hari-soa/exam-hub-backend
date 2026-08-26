import { AttemptRepository } from "../repositories/attemptRepository";
import { ExamRepository } from "../repositories/examRepository";
import { AnswerRepository } from "../repositories/answerRepository";
import { ApiError } from "../utils/ApiError";

export const getStudentResults = async (studentId: number) => {
  return await AttemptRepository.findByStudentId(studentId);
};

export const getDetailedResultForStudent = async (
  attemptId: number,
  studentId: number,
) => {
  const attempt = await AttemptRepository.findById(attemptId);
  if (!attempt || attempt.student_id !== studentId) {
    throw ApiError.notFound("Exam result record not found.");
  }

  const exam = await ExamRepository.findByIdWithQuestions(attempt.exam_id);
  const now = new Date();

  const showCorrection = exam ? now > new Date(exam.end_time) : false;
  const answers = await AnswerRepository.findByAttemptId(attemptId);

  return {
    attempt,
    show_correction: showCorrection,
    answers: showCorrection ? answers : [],
  };
};

export const getExamResultsForAdmin = async (examId: number) => {
  const attempts = await AttemptRepository.findByExamId(examId);

  const totalAttempts = attempts.length;
  const averageScore =
    totalAttempts > 0
      ? attempts.reduce(
          (acc, curr) => acc + Number(curr.final_score_over_20),
          0,
        ) / totalAttempts
      : 0;

  const passingCount = attempts.filter(
    (a) => Number(a.final_score_over_20) >= 10,
  ).length;
  const successRate =
    totalAttempts > 0 ? (passingCount / totalAttempts) * 100 : 0;

  return {
    exam_id: examId,
    total_attempts: totalAttempts,
    average_score_over_20: Math.round(averageScore * 100) / 100,
    success_rate_percentage: Math.round(successRate * 100) / 100,
    student_results: attempts,
  };
};
