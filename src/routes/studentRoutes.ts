import { Router } from "express";
import { StudentExamController } from "../controllers/studentExamController";
import { StudentHistoryController } from "../controllers/studentHistoryController";
import { authenticateToken, requireRole } from "../middlewares/authMiddleWarre";

const router = Router();

router.use(authenticateToken, requireRole("student"));

router.get("/my/exams", StudentExamController.listAvailable);
router.get("/my/exams/:id", StudentExamController.getOne);
router.post("/my/exams/:id/submit", StudentExamController.submit);
router.get("/my/results", StudentHistoryController.getHistory);

export default router;
