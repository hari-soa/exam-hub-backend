// src/controllers/examController.ts
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../security/authMiddleware";
import { ExamService } from "../services/examService";

export class ExamController {
  static async getAll(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const exams = await ExamService.getAllExams();
      res.status(200).json(exams);
    } catch (error) {
      next(error);
    }
  }

  static async getExamsHistory(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const history = await ExamService.getExamsHistory();
      res.status(200).json(history);
    } catch (error) {
      next(error);
    }
  }

  static async getById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const exam = await ExamService.getExamById(id);
      res.status(200).json(exam);
    } catch (error) {
      next(error);
    }
  }

  static async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const {
        course_id,
        title,
        description,
        start_time,
        end_time,
        duration_minutes,
      } = req.body;
      if (
        !course_id ||
        !title ||
        !start_time ||
        !end_time ||
        !duration_minutes
      ) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const exam = await ExamService.createExam({
        course_id,
        title,
        description,
        start_time,
        end_time,
        duration_minutes,
      });
      res.status(201).json(exam);
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const {
        course_id,
        title,
        description,
        start_time,
        end_time,
        duration_minutes,
      } = req.body;

      const exam = await ExamService.updateExam(id, {
        course_id,
        title,
        description,
        start_time,
        end_time,
        duration_minutes,
      });
      res.status(200).json(exam);
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = parseInt(req.params.id as string, 10);
      await ExamService.deleteExam(id);
      res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async getResults(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const results = await ExamService.getExamResults(id);
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  static async submitExam(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id;
      const examId = parseInt(req.params.id as string, 10);
      const { answers } = req.body;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized: User ID missing" });
        return;
      }

      if (!Array.isArray(answers)) {
        res
          .status(400)
          .json({ message: "Invalid format: answers must be an array" });
        return;
      }

      const result = await ExamService.submitExam(userId, examId, answers);
      res.status(201).json({
        message: "Exam submitted successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}
