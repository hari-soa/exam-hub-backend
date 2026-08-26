import { Request, Response, NextFunction } from "express";
import * as rawUserService from "../services/userService";

const userService = rawUserService as any;

export const AdminStudentController = {
  async listStudents(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const students = await userService.getAllStudents();
      res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  },

  async createStudent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { first_name, last_name, email, password } = req.body;
      if (!first_name || !last_name || !email || !password) {
        const error: any = new Error("Missing required fields.");
        error.statusCode = 400;
        return next(error);
      }

      const newStudent = await userService.createStudentAccount({
        first_name,
        last_name,
        email,
        password,
        role: "student",
      });
      res.status(201).json(newStudent);
    } catch (error) {
      next(error);
    }
  },

  async updateStudent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = parseInt(req.params.id as string, 10);
      const updatedStudent = await userService.updateStudentProfile(
        studentId,
        req.body,
      );
      res.status(200).json(updatedStudent);
    } catch (error) {
      next(error);
    }
  },

  async deactivateStudent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = parseInt(req.params.id as string, 10);
      await userService.deactivateStudentAccount(studentId);
      res
        .status(200)
        .json({ message: "Student account successfully deactivated." });
    } catch (error) {
      next(error);
    }
  },
};
