import { pool } from "../config/database";
import { ExamRepository } from "../repositories/examRepository";
import { QuestionRepository } from "../repositories/questionRepository";
import { ChoiceRepository } from "../repositories/choiceRepository";
import { AttemptRepository } from "../repositories/attemptRepository";
import { AnswerRepository } from "../repositories/answerRepository";
import { ApiError } from "../utils/ApiError";
import { Exam, Question, Choice } from "../models/examModel";
import { gradeExam, SubmittedAnswer } from "../utils/graderExam";

export interface QuestionForStudent {
  id: number;
  prompt: string;
  points: number;
  choices: Omit<Choice, "is_correct">[];
}

export interface ExamForStudent {
  exam: Exam;
  questions: QuestionForStudent[];
}

function isWindowOpen(exam: any): boolean {
  const now = new Date();
  const startDate = new Date(exam.starts_at || exam.start_time);
  const endDate = new Date(exam.ends_at || exam.end_time);
  return now >= startDate && now <= endDate;
}

export const ExamTakingService = {
  async listAvailable(studentId: number): Promise<Exam[]> {
    const exams = await ExamRepository.findAll();
    const availableExams: Exam[] = [];

    for (const exam of exams) {
      if (isWindowOpen(exam)) {
        const alreadyTaken = await AttemptRepository.findByStudentAndExam(
          studentId,
          exam.id,
        );
        if (!alreadyTaken) {
          availableExams.push(exam);
        }
      }
    }
    return availableExams;
  },

  async getExamForStudent(
    studentId: number,
    examId: number,
  ): Promise<ExamForStudent> {
    const exam = await ExamRepository.findByIdWithQuestions(examId);
    if (!exam) throw ApiError.notFound("Exam not found");

    if (!isWindowOpen(exam)) {
      throw ApiError.forbidden("This exam is not available at the moment");
    }

    const already = await AttemptRepository.findByStudentAndExam(
      studentId,
      examId,
    );
    if (already) {
      throw ApiError.conflict("You have already taken this exam");
    }

    const rawQuestions = await QuestionRepository.findByExamId(examId);
    const questions: Question[] = rawQuestions.map((q: any) => ({
      id: Number(q.id),
      exam_id: Number(q.exam_id),
      question_text: q.question_text || q.statement || q.prompt,
      points: Number(q.points),
    }));

    const questionIds = questions.map((q) => q.id);
    const rawChoices = await ChoiceRepository.findByQuestionIds(questionIds);
    const choices: Choice[] = rawChoices.map((c: any) => ({
      id: Number(c.id),
      question_id: Number(c.question_id),
      choice_text: c.choice_text || c.text || c.label,
      is_correct: Boolean(c.is_correct),
    }));

    const questionsForStudent: QuestionForStudent[] = questions.map((q) => ({
      id: q.id,
      prompt: q.question_text,
      points: Number(q.points),
      choices: choices
        .filter((c) => c.question_id === q.id)
        .map(({ is_correct, ...rest }) => rest),
    }));

    return { exam, questions: questionsForStudent };
  },

  async submit(studentId: number, examId: number, answers: SubmittedAnswer[]) {
    const exam = await ExamRepository.findByIdWithQuestions(examId);
    if (!exam) throw ApiError.notFound("Exam not found");
    if (!isWindowOpen(exam)) {
      throw ApiError.forbidden(
        "The availability window for this exam is closed",
      );
    }

    const already = await AttemptRepository.findByStudentAndExam(
      studentId,
      examId,
    );
    if (already) {
      throw ApiError.conflict("You have already taken this exam");
    }
    if (!Array.isArray(answers)) {
      throw ApiError.badRequest("Invalid answers format");
    }

    const rawQuestions = await QuestionRepository.findByExamId(examId);
    if (rawQuestions.length === 0) {
      throw ApiError.conflict("This exam contains no questions");
    }

    const questions: Question[] = rawQuestions.map((q: any) => ({
      id: Number(q.id),
      exam_id: Number(q.exam_id),
      question_text: q.question_text || q.statement || q.prompt,
      points: Number(q.points),
      choices: [],
    }));

    const questionIds = questions.map((q) => q.id);
    const rawChoices = await ChoiceRepository.findByQuestionIds(questionIds);
    const allChoices: Choice[] = rawChoices.map((c: any) => ({
      id: Number(c.id),
      question_id: Number(c.question_id),
      choice_text: c.choice_text || c.text || c.label,
      is_correct: Boolean(c.is_correct),
    }));

    const choicesByQuestion = new Map<number, Choice[]>();
    for (const q of questions) {
      choicesByQuestion.set(
        q.id,
        allChoices.filter((c) => c.question_id === q.id),
      );
    }

    const validQuestionIds = new Set(questions.map((q) => q.id));
    const sanitizedAnswers: SubmittedAnswer[] = answers
      .filter((a) => a && validQuestionIds.has(Number(a.question_id)))
      .map((a) => ({
        question_id: Number(a.question_id),
        choice_id:
          a.choice_id === null || a.choice_id === undefined
            ? null
            : Number(a.choice_id),
      }));

    const grading = gradeExam(questions, choicesByQuestion, sanitizedAnswers);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const attempt = await AttemptRepository.create(
        client,
        studentId,
        examId,
        grading.score,
        grading.total_points,
      );
      for (const line of grading.correction) {
        await AnswerRepository.create(
          client,
          attempt.id!,
          line.question_id,
          line.student_choice_id,
          line.is_correct,
          line.is_correct ? line.points : 0,
        );
      }

      await client.query("COMMIT");
      return {
        score: grading.score,
        total_points: grading.total_points,
        correction: grading.correction,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
};
