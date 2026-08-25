import { Request, Response, NextFunction } from 'express';
import { ExamRepository } from '../repositories/examRepository.js';

export const getAllExams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const exams = await ExamRepository.findAll();
    res.status(200).json(exams);
  } catch (error) {
    next(error);
  }
};

export const getExamDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const exam = await ExamRepository.findById(id);
    if (!exam) {
      res.status(404).json({ message: 'Exam not found' });
      return;
    }
    res.status(200).json(exam);
  } catch (error) {
    next(error);
  }
};

export const createExam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { course_id, title, instructions, duration_minutes, start_date, end_date } = req.body;
    if (!course_id || !title || !duration_minutes || !start_date || !end_date) {
      res.status(400).json({ message: 'Missing required exam fields' });
      return;
    }
    const newExam = await ExamRepository.create({
      course_id,
      title,
      instructions,
      duration_minutes,
      start_date,
      end_date
    });
    res.status(201).json(newExam);
  } catch (error) {
    next(error);
  }
};

export const updateExam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedExam = await ExamRepository.update(id, req.body);
    if (!updatedExam) {
      res.status(404).json({ message: 'Exam not found' });
      return;
    }
    res.status(200).json(updatedExam);
  } catch (error) {
    next(error);
  }
};

export const deleteExam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await ExamRepository.delete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Exam not found' });
      return;
    }
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    next(error);
  }
};