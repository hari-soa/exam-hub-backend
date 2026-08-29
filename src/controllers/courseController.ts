import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../security/authMiddleware";
import { CourseService } from "../services/courseService";

export class CourseController {
  static async getAll(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const courses = await CourseService.getAllCourses();
      res.status(200).json(courses);
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
      const course = await CourseService.getCourseById(id);
      res.status(200).json(course);
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
      const { code, name, description, professor_name, credits, semester } =
        req.body;
      if (!code || !name) {
        res.status(400).json({ message: "Code and name are required" });
        return;
      }

      const course = await CourseService.createCourse({
        code,
        name,
        description,
        professor_name,
        credits,
        semester,
      });
      res.status(201).json(course);
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
      const { code, name, description, professor_name, credits, semester } =
        req.body;

      const course = await CourseService.updateCourse(id, {
        code,
        name,
        description,
        professor_name,
        credits,
        semester,
      });
      res.status(200).json(course);
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
      await CourseService.deleteCourse(id);
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
