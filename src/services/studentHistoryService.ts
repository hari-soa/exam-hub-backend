import { ExamRepository } from "../repositories/examRepository";
import { AttemptRepository } from "../repositories/attemptRepository";
import { QuestionRepository } from "../repositories/questionRepository";
import { ChoiceRepository } from "../repositories/choiceRepository";
import { AnswerRepository } from "../repositories/answerRepository";

export const StudentHistoryService = {
    async getStudentHistory(studentId: string) {
        const attempts = await AttemptRepository.findByStudentId(studentId);
        if (attempts.length === 0) return [];

        const results = [];
        for (const attempt of attempts) {
            const exam = await ExamRepository.findByIdWithQuestions(attempt.exam_id);
            const rawQuestions = await QuestionRepository.findByExamId(Number(attempt.exam_id));
            const questions = rawQuestions.map((q: any) => ({
                id: String(q.id),
                prompt: q.prompt || q.statement,
                points: Number(q.points),
            }));

            const rawChoices = await ChoiceRepository.findByQuestionIds(questions.map((q) => q.id));
            const choices = rawChoices.map((c: any) => ({
                id: String(c.id),
                question_id: String(c.question_id),
                text: c.text || c.label,
                is_correct: Boolean(c.is_correct),
            }));

            const answers = await AnswerRepository.findByAttemptId(attempt.id);
            const answerByQuestion = new Map(answers.map((a: any) => [String(a.question_id), a.choice_id ? String(a.choice_id) : null]));

            const details = questions.map((q) => {
                const questionChoices = choices.filter((c) => c.question_id === q.id);
                const correct = questionChoices.find((c) => c.is_correct);
                const selectedChoiceId = answerByQuestion.get(q.id) ?? null;
                return {
                    question_id: q.id,
                    prompt: q.prompt,
                    points: Number(q.points),
                    selected_choice_id: selectedChoiceId,
                    correct_choice_id: correct ? correct.id : "",
                    is_correct: selectedChoiceId !== null && correct?.id === selectedChoiceId,
                    choices: questionChoices.map((c) => ({
                        id: c.id,
                        text: c.text,
                        is_correct: c.is_correct,
                    })),
                };
            });

            results.push({
                attempt_id: attempt.id,
                exam_id: attempt.exam_id,
                exam_title: exam?.title ?? "Deleted exam",
                score: Number(attempt.score),
                total_points: Number(attempt.total_points),
                submitted_at: attempt.submitted_at,
                details,
            });
        }

        return results;
    },
};