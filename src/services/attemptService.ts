import { AttemptRepository } from "../repositories/attemptRepository";
import { QuestionRepository } from "../repositories/questionRepository";
import { ExamRepository } from "../repositories/examRepository";

export class AttemptService {
  static async submitExam(
    examId: string,
    studentId: string,
    answers: { question_id: string; choice_id: string }[],
  ) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw { status: 404, message: "Exam not found" };
    }
    const now = new Date();
    if (now < new Date(exam.start_date) || now > new Date(exam.end_date)) {
      throw { status: 403, message: "Exam availability window is closed" };
    }

    const alreadySubmitted = await AttemptRepository.hasStudentAttempted(
      examId,
      studentId,
    );
    if (alreadySubmitted) {
      throw { status: 409, message: "You have already completed this exam" };
    }

    const questions =
      await QuestionRepository.findByExamIdWithCorrectChoices(examId);
    let totalScore = 0;
    let totalPoints = 0;
    const answerRecords: {
      questionId: string;
      choiceId: string | null;
      isCorrect: boolean;
    }[] = [];

    for (const q of questions) {
      totalPoints += q.points;
      const studentAnswer = answers.find((a) => a.question_id === q.id);

      if (!studentAnswer || !studentAnswer.choice_id) {
        answerRecords.push({
          questionId: q.id,
          choiceId: null,
          isCorrect: false,
        });
      } else {
        const correctChoice = q.choices.find((c: any) => c.is_correct);
        const isCorrect = correctChoice
          ? correctChoice.id === studentAnswer.choice_id
          : false;
        if (isCorrect) {
          totalScore += q.points;
        }
        answerRecords.push({
          questionId: q.id,
          choiceId: studentAnswer.choice_id,
          isCorrect,
        });
      }
    }

    const attemptId = await AttemptRepository.createAttempt(
      examId,
      studentId,
      totalScore,
      totalPoints,
    );
    for (const record of answerRecords) {
      await AttemptRepository.recordAnswer(
        attemptId,
        record.questionId,
        record.choiceId,
        record.isCorrect,
      );
    }

    return { score: totalScore, totalPoints };
  }
}
