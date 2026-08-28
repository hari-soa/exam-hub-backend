import { Request, Response } from 'express';
import { createExamService, getAllExamsService, deleteExamService } from '../Service/examService.js';

export const createExamController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { course_id, title, description, start_time, end_time } = req.body;
    const exam = await createExamService(course_id, title, description, start_time, end_time);
    res.status(201).json(exam);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getAllExamsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const exams = await getAllExamsService();
    res.status(200).json(exams);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExamController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await deleteExamService(id);
    res.status(200).json({ message: 'Exam deleted successfully.' });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};