import { Question, Choice } from "../models/examModel";

export interface SubmittedAnswer {
  question_id: number;
  choice_id: number | null;
}

export interface CorrectionLine {
  question_id: number;
  statement: string;
  points: number;
  student_choice_id: number | null;
  correct_choice_id: number;
  is_correct: boolean;
}

export interface GradingResult {
  score: number;
  total_points: number;
  correction: CorrectionLine[];
}

export const gradeExam = (
  questions: Question[],
  choicesByQuestion: Map<number, Choice[]>,
  submittedAnswers: SubmittedAnswer[],
): GradingResult => {
  const answerMap = new Map<number, number | null>();
  for (const a of submittedAnswers) {
    answerMap.set(a.question_id, a.choice_id);
  }

  let score = 0;
  let totalPoints = 0;
  const correction: CorrectionLine[] = [];

  for (const q of questions) {
    const qPoints = Number(q.points);
    totalPoints += qPoints;

    const choices = choicesByQuestion.get(q.id) || [];
    const correctChoice = choices.find((c) => c.is_correct);

    const selectedChoiceId = answerMap.has(q.id)
      ? (answerMap.get(q.id) ?? null)
      : null;
    const selectedIsValid =
      selectedChoiceId !== null &&
      choices.some((c) => c.id === selectedChoiceId);

    const isCorrect =
      selectedIsValid &&
      correctChoice !== undefined &&
      selectedChoiceId === correctChoice.id;

    if (isCorrect) {
      score += qPoints;
    }

    correction.push({
      question_id: q.id,
      statement: q.question_text,
      points: qPoints,
      student_choice_id: selectedIsValid ? selectedChoiceId : null,
      correct_choice_id: correctChoice ? correctChoice.id : 0,
      is_correct: isCorrect,
    });
  }

  return { score, total_points: totalPoints, correction };
};
