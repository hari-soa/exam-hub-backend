import { Router } from "express";
import { StudentExamController } from "../controllers/studentExamController";
import { StudentHistoryController } from "../controllers/studentHistoryController";
import { AttemptController } from "../controllers/attemptController";
import { authenticateToken, requireRole } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateToken, requireRole("student"));

router.get("/my/exams", StudentExamController.listAvailable);
router.get("/my/exams/:id", StudentExamController.getOne);
router.get("/my/results", StudentHistoryController.getHistory);

router.post("/exams/:examId/start", AttemptController.startAttempt);
router.patch(
  "/attempts/:attemptId/tab-switch",
  AttemptController.recordTabSwitch,
);
router.post("/exams/:examId/submit", StudentExamController.submit);

export default router;
