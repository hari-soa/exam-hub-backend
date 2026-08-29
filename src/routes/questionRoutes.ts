import { Router } from "express";
import { authenticateToken, requireAdmin } from "../security/authMiddleware";
import { QuestionController } from "../controllers/questionController";

const router = Router();

router.use(authenticateToken, requireAdmin);

router.delete("/:id", QuestionController.delete);

export default router;
