import { Router } from "express";
import { authenticateToken, requireRole } from "../security/errorMiddleware";
import * as attemptController from "../controllers/attemptController";

const router = Router();

router.use(authenticateToken, requireRole("student"));

router.get("/my/exams", attemptController.getAvailableExams);
router.get("/my/exams/:id", attemptController.getExamForStudent);
router.post("/my/exams/:id/submit", attemptController.submitExam);
router.get("/my/results", attemptController.getStudentResults);

export default router;
