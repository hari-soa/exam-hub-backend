import { Request, Response, NextFunction } from "express";
import * as rawResultService from "../services/resultService";

const resultService = rawResultService as any;

export const ResultController = {
  async getStudentHistory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = (req as any).user.id;
      const history = await resultService.getStudentResults(studentId);
      res.status(200).json(history);
    } catch (error) {
      next(error);
    }
  },

  async getStudentExamResult(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const attemptId = parseInt(req.params.attemptId as string, 10);
      const studentId = (req as any).user.id;

      const resultDetails = await resultService.getDetailedResultForStudent(
        attemptId,
        studentId,
      );
      res.status(200).json(resultDetails);
    } catch (error) {
      next(error);
    }
  },

  async getAdminExamResults(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const examId = parseInt(req.params.examId as string, 10);
      const adminResults = await resultService.getExamResultsForAdmin(examId);
      res.status(200).json(adminResults);
    } catch (error) {
      next(error);
    }
  },
};
