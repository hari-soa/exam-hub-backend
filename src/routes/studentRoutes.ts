import express from 'express';
import { StudentController } from '../controllers/studentController';
import { authenticateToken, requireAdmin } from '../security/authMiddleware';

const router = express.Router();

router.use(authenticateToken);
router.get('/', requireAdmin, StudentController.getAll);
router.post('/', requireAdmin, StudentController.create);
router.put('/:id', requireAdmin, StudentController.update);
router.put('/:id/reset-password', requireAdmin, StudentController.resetPassword);
router.delete('/:id', requireAdmin, StudentController.deactivate);

export default router;