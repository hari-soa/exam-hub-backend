import { Request, Response, NextFunction } from "express";
import { CourseService } from "../services/courseService";

export class AdminCourseController {
  static async listCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await CourseService.getAllCourses();
      res.json(courses);
    } catch (err) {
      next(err);
    }
  }

  static async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name, description } = req.body;
      const course = await CourseService.createCourse({
        code,
        name,
        description,
      });
      res.status(201).json(course);
    } catch (err) {
      next(err);
    }
  }

  static async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const course = await CourseService.updateCourse(id, req.body);
      res.json(course);
    } catch (err) {
      next(err);
    }
  }

  static async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await CourseService.deleteCourse(id); // Vérifier RG-09 dans le service
      res.json({ message: "Course deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}
