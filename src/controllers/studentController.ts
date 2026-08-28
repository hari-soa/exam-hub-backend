// src/controllers/studentController.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../security/authMiddleware';
import { StudentService } from '../services/studentService';

export class StudentController {
  static async getAll(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const students = await StudentService.getAllStudents();
      res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
      }

      const newStudent = await StudentService.createStudent({ name, email, password });
      res.status(201).json(newStudent);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { name, email, is_active } = req.body;

      const updated = await StudentService.updateStudent(id, { name, email, is_active });
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { password } = req.body;

      if (!password) {
        res.status(400).json({ message: 'Password is required' });
        return;
      }

      await StudentService.resetPassword(id, password);
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async deactivate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      await StudentService.deactivateStudent(id);
      res.status(200).json({ message: 'Student deactivated successfully' });
    } catch (error) {
      next(error);
    }
  }
}