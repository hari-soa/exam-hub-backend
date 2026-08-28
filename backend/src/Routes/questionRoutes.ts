import { Router } from 'express';
import { createQuestionController, getQuestionsController, deleteQuestionController } from '../Controller/questionController.js';
import { authenticateToken, requireAdmin } from '../Security/authMiddleware.js';

const router = Router();
router.use(authenticateToken);

router.get('/exams/:id/questions', requireAdmin, getQuestionsController);
router.post('/exams/:id/questions', requireAdmin, createQuestionController);
router.delete('/questions/:id', requireAdmin, deleteQuestionController);

export default router;