import { Request, Response, NextFunction } from 'express';
import { QuestionRepository } from '../repositories/questionRepository.js';

export const getQuestionsByExam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const questions = await QuestionRepository.findByExamId(id);
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { statement, points, choices } = req.body;
    if (!statement || !choices || !Array.isArray(choices)) {
      res.status(400).json({ message: 'Invalid question data or choices array missing' });
      return;
    }
    const question = await QuestionRepository.createQuestionWithChoices(id, statement, points || 1, choices);
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await QuestionRepository.deleteQuestion(id);
    if (!deleted) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
};