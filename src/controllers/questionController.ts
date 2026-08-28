import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../security/authMiddleware';
import { QuestionService } from '../services/questionService';

export class QuestionController {
  static async getByExam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const examId = parseInt(req.params.id as string, 10);
      const questions = await QuestionService.getQuestionsByExamId(examId);
      res.status(200).json(questions);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const examId = parseInt(req.params.id as string, 10);
      const { question_text, points, choices } = req.body;

      if (!question_text || !choices) {
        res.status(400).json({ message: 'Question text and choices are required' });
        return;
      }

      const question = await QuestionService.addQuestionToExam(examId, { question_text, points, choices });
      res.status(201).json(question);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const questionId = parseInt(req.params.id as string, 10);
      await QuestionService.deleteQuestion(questionId);
      res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}