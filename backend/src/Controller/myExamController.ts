import { Response } from 'express';
import { AuthRequest } from '../Security/authMiddleware.js';
import { getAvailableExamsService, getExamForStudentService, submitExamService, getStudentResultsService, getExamResultsAdminService } from '../Service/myExamService.js';

export const getAvailableExamsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exams = await getAvailableExamsService();
    res.status(200).json(exams);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExamForStudentController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const examId = parseInt(req.params.id, 10);
    const studentId = req.user!.id;
    const result = await getExamForStudentService(examId, studentId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const submitExamController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const examId = parseInt(req.params.id, 10);
    const studentId = req.user!.id;
    const { answers } = req.body;
    const result = await submitExamService(examId, studentId, answers);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getStudentResultsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id;
    const results = await getStudentResultsService(studentId);
    res.status(200).json(results);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExamResultsAdminController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const examId = parseInt(req.params.id, 10);
    const results = await getExamResultsAdminService(examId);
    res.status(200).json(results);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};