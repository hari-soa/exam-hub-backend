import { Router } from 'express';
import { createStudentController, getAllStudentsController, deactivateStudentController, resetStudentPasswordController } from '../Controller/studentController.js';
import { authenticateToken, requireAdmin } from '../Security/authMiddleware.js';

const router = Router();
router.use(authenticateToken, requireAdmin);

router.get('/', getAllStudentsController);
router.post('/', createStudentController);
router.put('/:id', resetStudentPasswordController);
router.delete('/:id', deactivateStudentController);

export default router;