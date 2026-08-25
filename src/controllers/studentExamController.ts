import { Request, Response, NextFunction } from "express";
import * as examService from "../services/examService";
import * as attemptService from "../services/attemptService";

export const StudentExamController = {
  async listAvailable(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = (req as any).user.id;
      const exams = await examService.getAvailableExamsForStudent(studentId);
      res.status(200).json(exams);
    } catch (error) {
      next(error);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const examId = parseInt(req.params.id, 10);
      const examDetails = await examService.getExamForStudent(examId);
      res.status(200).json(examDetails);
    } catch (error) {
      next(error);
    }
  },

  async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const examId = parseInt(req.params.id, 10);
      const studentId = (req as any).user.id;
      const { answers, tab_switch_count } = req.body;

      const result = await attemptService.submitExamAttempt({
        exam_id: examId,
        student_id: studentId,
        answers,
        tab_switch_count: tab_switch_count || 0,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
