import { Request, Response } from 'express';
import { createStudentService, getAllStudentsService, deactivateStudentService, resetPasswordService } from '../Service/studentService.js';

export const createStudentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const student = await createStudentService(email, password);
    res.status(201).json(student);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
  }
};

export const getAllStudentsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await getAllStudentsService();
    res.status(200).json(students);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deactivateStudentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await deactivateStudentService(id);
    res.status(200).json({ message: 'Student deactivated successfully.' });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const resetStudentPasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { password } = req.body;
    await resetPasswordService(id, password);
    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};