import { Router } from 'express';
import { createExamController, getAllExamsController, deleteExamController } from '../Controller/examController.js';
import { authenticateToken, requireAdmin } from '../Security/authMiddleware.js';

const router = Router();
router.use(authenticateToken, requireAdmin);

router.get('/', getAllExamsController);
router.post('/', createExamController);
router.delete('/:id', deleteExamController);

export default router;