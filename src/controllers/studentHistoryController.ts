import { Request, Response } from "express";
import { StudentHistoryService } from "../services/studentHistoryService";
import { asyncHandler } from "../middlewares/errorHandler";
import { ApiError } from "../middlewares/ApiError";

export const StudentHistoryController = {
    getHistory: asyncHandler(async (req: Request, res: Response) => {
        const studentId = req.user?.id;
        if (!studentId) throw ApiError.unauthorized("Unauthorized");

        const history = await StudentHistoryService.getStudentHistory(studentId);
        res.json(history);
    }),
};