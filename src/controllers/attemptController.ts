import { Request, Response, NextFunction } from "express";
import * as attemptService from "../services/attemptService";

export const getAvailableExams = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const studentId = req.user!.id;
    const exams = await attemptService.getAvailableExamsForStudent(studentId);
    res.json(exams);
  } catch (error) {
    next(error);
  }
};

export const getExamForStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const examId = req.params.id;
    const studentId = req.user!.id;
    const exam = await attemptService.getExamDetailsForStudent(
      examId,
      studentId,
    );
    res.json(exam);
  } catch (error) {
    next(error);
  }
};

export const submitExam = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const examId = req.params.id;
    const studentId = req.user!.id;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      res.status(400).json({ message: "Answers must be an array" });
      return;
    }

    const result = await attemptService.submitExamAttempt(
      examId,
      studentId,
      answers,
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getStudentResults = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const studentId = req.user!.id;
    const results = await attemptService.getStudentResultHistory(studentId);
    res.json(results);
  } catch (error) {
    next(error);
  }
};
