// src/controllers/adminExamController.ts
import { Request, Response, NextFunction } from "express";
import { ExamService } from "../services/examService";

export class AdminExamController {
  static async listExams(req: Request, res: Response, next: NextFunction) {
    try {
      const exams = await ExamService.getAllExams();
      res.json(exams);
    } catch (err) {
      next(err);
    }
  }

  static async createExam(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await ExamService.createExam(req.body);
      res.status(201).json(exam);
    } catch (err) {
      next(err);
    }
  }

  static async getExamDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const exam = await ExamService.getExamById(id);
      res.json(exam);
    } catch (err) {
      next(err);
    }
  }

  static async updateExam(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const exam = await ExamService.updateExam(id, req.body);
      res.json(exam);
    } catch (err) {
      next(err);
    }
  }

  static async deleteExam(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await ExamService.deleteExam(id);
      res.json({ message: "Exam deleted successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async getExamResults(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const results = await ExamService.getExamResults(id);
      res.json(results);
    } catch (err) {
      next(err);
    }
  }
}
