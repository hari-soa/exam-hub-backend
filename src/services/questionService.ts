// src/services/questionService.ts
import { ExamRepository } from '../repositories/examRepository';
import { QuestionRepository } from '../repositories/questionRepository';

export class QuestionService {
  static async getQuestionsByExamId(examId: number) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      const error: any = new Error('Exam not found');
      error.status = 404;
      throw error;
    }
    return await QuestionRepository.findByExamId(examId, true);
  }

  static async addQuestionToExam(examId: number, data: { question_text: string; points?: number; choices: { choice_text: string; is_correct: boolean }[] }) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      const error: any = new Error('Exam not found');
      error.status = 404;
      throw error;
    }

    const hasAttempts = await ExamRepository.hasAttempts(examId);
    if (hasAttempts) {
      const error: any = new Error('Cannot modify questions because exam has attempts (RG-08)');
      error.status = 409;
      throw error;
    }

    if (!data.choices || data.choices.length < 2 || data.choices.length > 6) {
      const error: any = new Error('A question must have between 2 and 6 choices (RG-04)');
      error.status = 400;
      throw error;
    }

    const correctCount = data.choices.filter(c => c.is_correct).length;
    if (correctCount !== 1) {
      const error: any = new Error('A question must have exactly one correct choice (RG-04)');
      error.status = 400;
      throw error;
    }

    const question = await QuestionRepository.createQuestion(examId, data.question_text, data.points || 1.00);

    const createdChoices = [];
    for (const choice of data.choices) {
      const c = await QuestionRepository.createChoice(question.id, choice.choice_text, choice.is_correct);
      createdChoices.push(c);
    }

    return { ...question, choices: createdChoices };
  }

  static async deleteQuestion(questionId: number) {
    const question = await QuestionRepository.findQuestionById(questionId);
    if (!question) {
      const error: any = new Error('Question not found');
      error.status = 404;
      throw error;
    }

    const hasAttempts = await ExamRepository.hasAttempts(question.exam_id);
    if (hasAttempts) {
      const error: any = new Error('Cannot delete question because exam has attempts (RG-08)');
      error.status = 409;
      throw error;
    }

    return await QuestionRepository.deleteQuestion(questionId);
  }
}