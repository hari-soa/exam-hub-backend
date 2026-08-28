// src/routes/myRoutes.ts
import { Router } from 'express';
import { authenticateToken, requireStudent } from '../security/authMiddleware';
import { MyController } from '../controllers/myController';

const router = Router();

router.use(authenticateToken, requireStudent);

router.get('/profile', MyController.getProfile);
router.get('/exams', MyController.getExams);
router.get('/exams/:id', MyController.getExamById);
router.post('/exams/:id/submit', MyController.submitExam);
router.get('/results', MyController.getResults);
router.get('/history', MyController.getResults);

export default router;