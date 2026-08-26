import { Request, Response, NextFunction } from "express";
import { ExamService } from "../services/examService";

export class AdminExamController {
  static async listExams(_req: Request, res: Response, next: NextFunction) {
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

  static async addQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const examId = Number(req.params.id);
      const question = await ExamService.addQuestionToExam(examId, req.body);
      res.status(201).json(question);
    } catch (err) {
      next(err);
    }
  }

  static async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = Number(req.params.id);
      const question = await ExamService.updateQuestion(questionId, req.body);
      res.json(question);
    } catch (err) {
      next(err);
    }
  }

  static async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = Number(req.params.id);
      await ExamService.deleteQuestion(questionId);
      res.json({ message: "Question deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}
