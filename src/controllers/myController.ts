import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../security/authMiddleware';
import { MyService } from '../services/myService';

export class MyController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.id;
      const profile = await MyService.getStudentProfile(studentId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  static async getExams(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.id;
      const exams = await MyService.getAvailableExams(studentId);
      res.status(200).json(exams);
    } catch (error) {
      next(error);
    }
  }

  static async getExamById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.id;
      const examId = parseInt(req.params.id as string, 10);
      const exam = await MyService.getExamForStudent(studentId, examId);
      res.status(200).json(exam);
    } catch (error) {
      next(error);
    }
  }

  static async submitExam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.id;
      const examId = parseInt(req.params.id as string, 10);
      const { answers, tab_switch_count } = req.body;
      if (!answers || !Array.isArray(answers)) {
        res.status(400).json({ message: 'Answers array is required' });
        return;
      }
      const result = await MyService.submitExam(studentId, examId, answers, tab_switch_count || 0);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getResults(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.id;
      const results = await MyService.getStudentResults(studentId);
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  static async getAttemptCorrection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.id;
      const attemptId = parseInt(req.params.attemptId as string, 10);
      const correction = await MyService.getAttemptCorrection(studentId, attemptId);
      res.status(200).json(correction);
    } catch (error) {
      next(error);
    }
  }
}