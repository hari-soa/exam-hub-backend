import { Request, Response } from "express";
import { ResultsService } from "../services/studentHistoryService";
import { asyncHandler } from "../middlewares/errorHandler";
import { ApiError } from "../middlewares/ApiError";

export const ResultsController = {
    getExamResults: asyncHandler(async (req: Request, res: Response) => {
        const examId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!examId) throw ApiError.badRequest("Invalid exam ID");

        const results = await ResultsService.getExamResults(examId);
        res.json(results);
    }),

    getMyResults: asyncHandler(async (req: Request, res: Response) => {
        const studentId = req.user?.id;
        if (!studentId) throw ApiError.badRequest("Unauthorized");

        const results = await ResultsService.getStudentHistory(studentId);
        res.json(results);
    }),
};     // CORRECTION : Utilisation de Number(examId) exigée par le repository