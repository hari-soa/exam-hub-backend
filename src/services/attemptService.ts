import * as attemptRepository from "../repositories/attemptRepository";
import * as examRepository from "../repositories/examRepository";

interface SubmitPayload {
  exam_id: number;
  student_id: number;
  answers: Array<{ question_id: number; selected_choice_id: number }>;
  tab_switch_count: number;
}

export const submitExamAttempt = async (payload: SubmitPayload) => {
  const { exam_id, student_id, answers, tab_switch_count } = payload;

  const existingAttempt = await attemptRepository.findAttemptByStudentAndExam(
    student_id,
    exam_id,
  );
  if (existingAttempt) {
    const error: any = new Error("You have already submitted this exam.");
    error.statusCode = 409;
    throw error;
  }

  const exam = await examRepository.findExamWithCorrectChoices(exam_id);
  if (!exam) {
    const error: any = new Error("Exam not found.");
    error.statusCode = 404;
    throw error;
  }

  let rawScore = 0;
  let totalPossiblePoints = 0;

  exam.questions?.forEach((q) => {
    totalPossiblePoints += Number(q.points);
    const studentAnswer = answers.find((a) => a.question_id === q.id);
    if (studentAnswer) {
      const correctChoice = q.choices?.find((c) => c.is_correct);
      if (
        correctChoice &&
        correctChoice.id === studentAnswer.selected_choice_id
      ) {
        rawScore += Number(q.points);
      }
    }
  });

  const penaltyPoints = tab_switch_count * 2;
  const scoreAfterPenalty = Math.max(0, rawScore - penaltyPoints);

  const finalScoreOver20 =
    totalPossiblePoints > 0
      ? Math.round((scoreAfterPenalty / totalPossiblePoints) * 20 * 100) / 100
      : 0;

  const attempt = await attemptRepository.createAttempt({
    exam_id,
    student_id,
    tab_switch_count,
    penalty_points: penaltyPoints,
    raw_score: rawScore,
    final_score_over_20: finalScoreOver20,
    is_submitted: true,
  });

  if (answers && answers.length > 0) {
    await attemptRepository.saveStudentAnswers(attempt.id, answers);
  }

  return {
    attempt_id: attempt.id,
    final_score_over_20: finalScoreOver20,
    tab_switch_count,
    penalty_points: penaltyPoints,
  };
};

export const startExamAttempt = async (examId: number, studentId: number) => {
  const existingAttempt = await attemptRepository.findAttemptByStudentAndExam(
    studentId,
    examId,
  );
  if (existingAttempt) {
    const error: any = new Error("You have already taken this exam.");
    error.statusCode = 409;
    throw error;
  }
  return { status: "started", exam_id: examId, student_id: studentId };
};

export const incrementTabSwitch = async (
  attemptId: number,
  studentId: number,
) => {
  return await attemptRepository.incrementTabSwitchCount(attemptId);
};

export const getStudentAttemptHistory = async (studentId: number) => {
  return await attemptRepository.findAttemptsByStudentId(studentId);
};
