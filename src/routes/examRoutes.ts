import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../security/authMiddleware';
import { ExamController } from '../controllers/examController';
import { QuestionController } from '../controllers/questionController';

const router = Router();

// Tout le monde doit être authentifié pour accéder aux examens
router.use(authenticateToken);

// -------------------------------------------------------------
// ROUTES ÉTUDIANTS & ADMINS (Lecture / Soumission)
// -------------------------------------------------------------
router.get('/', ExamController.getAll);
router.get('/:id', ExamController.getById);
router.get('/:id/questions', QuestionController.getByExam);
router.get('/:id/results', ExamController.getResults);

// -------------------------------------------------------------
// ROUTES STRICTEMENT ADMIN (Création / Modification / Suppression)
// -------------------------------------------------------------
router.get('/history', requireAdmin, ExamController.getExamsHistory);
router.post('/', requireAdmin, ExamController.create);
router.put('/:id', requireAdmin, ExamController.update);
router.delete('/:id', requireAdmin, ExamController.delete);
router.post('/:id/questions', requireAdmin, QuestionController.create);

export default router;