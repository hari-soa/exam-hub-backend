import { Question, Choice } from "../models/userModel";

export interface SubmittedAnswer {
    question_id: string;
    choice_id: string | null;
}

export interface GradedQuestion {
    question_id: string;
    prompt: string;
    points: number;
    selected_choice_id: string | null;
    correct_choice_id: string;
    is_correct: boolean;
    points_earned: number;
    choices: { id: string; text: string; is_correct?: boolean }[];
}

export interface GradingResult {
    score: number;
    total_points: number;
    details: GradedQuestion[];
}

export function gradeExam(
    questions: Question[],
    choicesByQuestion: Map<string, Choice[]>,
    submittedAnswers: SubmittedAnswer[]
): GradingResult {
    const answerMap = new Map<string, string | null>();
    for (const a of submittedAnswers) {
        answerMap.set(a.question_id, a.choice_id);
    }

    let score = 0;
    let totalPoints = 0;
    const details: GradedQuestion[] = [];

    for (const q of questions) {
        totalPoints += Number(q.points);
        const choices = choicesByQuestion.get(q.id) || [];
        const correctChoice = choices.find((c) => c.is_correct);

        const selectedChoiceId = answerMap.has(q.id) ? answerMap.get(q.id) ?? null : null;
        const selectedIsValid =
            selectedChoiceId !== null && choices.some((c) => c.id === selectedChoiceId);

        const isCorrect =
            selectedIsValid && correctChoice !== undefined && selectedChoiceId === correctChoice.id;
        const pointsEarned = isCorrect ? Number(q.points) : 0;
        score += pointsEarned;

        details.push({
            question_id: q.id,
            prompt: q.prompt,
            points: Number(q.points),
            selected_choice_id: selectedIsValid ? selectedChoiceId : null,
            correct_choice_id: correctChoice ? correctChoice.id : "",
            is_correct: isCorrect,
            points_earned: pointsEarned,
            choices: choices.map((c) => ({ id: c.id, text: c.text, is_correct: c.is_correct })),
        });
    }

    return { score, total_points: totalPoints, details };
}