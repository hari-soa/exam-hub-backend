import { Router } from "express";
import { authenticateToken, requireAdmin } from "../security/authMiddleware";
import { ExamController } from "../controllers/examController";
import { QuestionController } from "../controllers/questionController";

const router = Router();

router.use(authenticateToken);

router.get("/", ExamController.getAll);
router.get("/:id", ExamController.getById);
router.get("/:id/questions", QuestionController.getByExam);
router.get("/:id/results", ExamController.getResults);

router.get("/history", requireAdmin, ExamController.getExamsHistory);
router.post("/", requireAdmin, ExamController.create);
router.put("/:id", requireAdmin, ExamController.update);
router.delete("/:id", requireAdmin, ExamController.delete);
router.post("/:id/questions", requireAdmin, QuestionController.create);

export default router;
