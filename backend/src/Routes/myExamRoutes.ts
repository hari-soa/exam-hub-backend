import { Router } from 'express';
import { getAvailableExamsController, getExamForStudentController, submitExamController, getStudentResultsController, getExamResultsAdminController } from '../Controller/myExamController.js';
import { authenticateToken, requireStudent, requireAdmin } from '../Security/authMiddleware.js';

const router = Router();


router.get('/my/exams', authenticateToken, requireStudent, getAvailableExamsController);
router.get('/my/exams/:id', authenticateToken, requireStudent, getExamForStudentController);
router.post('/my/exams/:id/submit', authenticateToken, requireStudent, submitExamController);
router.get('/my/results', authenticateToken, requireStudent, getStudentResultsController);


router.get('/exams/:id/results', authenticateToken, requireAdmin, getExamResultsAdminController);

export default router;