import { Request, Response, NextFunction } from "express";
import { QuestionRepository } from "../repositories/questionRepository.js";

export const getQuestionsByExam = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const examId = parseInt(req.params.id as string, 10);
    const questions = await QuestionRepository.findByExamId(examId);
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const examId = parseInt(req.params.id as string, 10);
    const { statement, points, choices } = req.body;
    if (!statement || !choices || !Array.isArray(choices)) {
      res
        .status(400)
        .json({ message: "Invalid question data or choices array missing" });
      return;
    }

    const question = await QuestionRepository.createQuestionWithChoices(
      examId,
      statement,
      points || 1,
      choices,
    );
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const questionId = parseInt(req.params.id as string, 10);
    const deleted = await QuestionRepository.delete(questionId);

    if (!deleted) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    next(error);
  }
};
