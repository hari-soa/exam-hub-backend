import { Request, Response, NextFunction } from "express";
import { pool } from "../config/database";

export class DashboardController {
  static async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const studentsCount = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
      const coursesCount = await pool.query("SELECT COUNT(*) FROM courses");
      const examsCount = await pool.query("SELECT COUNT(*) FROM exams");

      return res.status(200).json({
        students: parseInt(studentsCount.rows[0].count, 10),
        courses: parseInt(coursesCount.rows[0].count, 10),
        exams: parseInt(examsCount.rows[0].count, 10),
      });
    } catch (error) {
      next(error);
    }
  }
}