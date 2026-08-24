import { Request, Response } from "express";
import { ExamTakingService } from "../services/examTakingService";
import { asyncHandler } from "../middlewares/errorHandler";
import { ApiError } from "../middlewares/ApiError";

export const StudentExamController = {
    listAvailable: asyncHandler(async (req: Request, res: Response) => {
        const studentId = req.user?.id;
        if (!studentId) throw ApiError.unauthorized("Unauthorized");

        const exams = await ExamTakingService.listAvailable(studentId);
        res.json(exams);
    }),

    getOne: asyncHandler(async (req: Request, res: Response) => {
        const studentId = req.user?.id;
        if (!studentId) throw ApiError.unauthorized("Unauthorized");

        const examId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!examId) throw ApiError.badRequest("Invalid exam ID");

        const result = await ExamTakingService.getExamForStudent(studentId, examId);
        res.json(result);
    }),

    submit: asyncHandler(async (req: Request, res: Response) => {
        const studentId = req.user?.id;
        if (!studentId) throw ApiError.unauthorized("Unauthorized");

        const examId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!examId) throw ApiError.badRequest("Invalid exam ID");

        const { answers } = req.body;
        if (!Array.isArray(answers)) {
            throw ApiError.badRequest("Answers must be an array");
        }

        const result = await ExamTakingService.submit(studentId, examId, answers);
        res.status(201).json(result);
    }),
};