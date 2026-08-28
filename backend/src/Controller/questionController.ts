import { Request, Response } from 'express';
import { createQuestionService, deleteQuestionService, getQuestionsService } from '../Service/questionService.js';

export const createQuestionController = async (req: Request, res: Response): Promise<void> => {
  try {
    const examId = parseInt(req.params.id, 10);
    const { statement, points, choices } = req.body;
    const question = await createQuestionService(examId, statement, points, choices);
    res.status(201).json(question);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getQuestionsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const examId = parseInt(req.params.id, 10);
    const questions = await getQuestionsService(examId, false);
    res.status(200).json(questions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteQuestionController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await deleteQuestionService(id);
    res.status(200).json({ message: 'Question deleted successfully.' });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};