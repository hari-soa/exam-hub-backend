import { Request, Response, NextFunction } from "express";
import * as rawAttemptService from "../services/attemptService";

const attemptService = rawAttemptService as any;

export const AttemptController = {
  async startAttempt(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const examId = parseInt(req.params.examId as string, 10);
      const studentId = (req as any).user.id;

      const attempt = await attemptService.startExamAttempt(examId, studentId);
      res.status(201).json(attempt);
    } catch (error) {
      next(error);
    }
  },

  async recordTabSwitch(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const attemptId = parseInt(req.params.attemptId as string, 10);
      const studentId = (req as any).user.id;

      const updatedCount = await attemptService.incrementTabSwitch(
        attemptId,
        studentId,
      );
      res.status(200).json({
        message: "Tab switch penalty recorded.",
        tab_switch_count: updatedCount,
      });
    } catch (error) {
      next(error);
    }
  },

  async submitAttempt(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const examId = parseInt(req.params.examId as string, 10);
      const studentId = (req as any).user.id;
      const { answers, tab_switch_count } = req.body;

      const result = await attemptService.submitExamAttempt({
        exam_id: examId,
        student_id: studentId,
        answers,
        tab_switch_count: tab_switch_count || 0,
      });

      res.status(200).json({
        message: "Exam submitted successfully.",
        result,
      });
    } catch (error) {
      next(error);
    }
  },
};
