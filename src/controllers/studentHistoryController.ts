import { Request, Response, NextFunction } from "express";
import * as rawAttemptService from "../services/attemptService";

const attemptService = (rawAttemptService.AttemptService ||
  rawAttemptService) as any;

export const StudentHistoryController = {
  async getHistory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = (req as any).user.id;
      const history = await attemptService.getStudentAttemptHistory(studentId);
      res.status(200).json(history);
    } catch (error) {
      next(error);
    }
  },
};
