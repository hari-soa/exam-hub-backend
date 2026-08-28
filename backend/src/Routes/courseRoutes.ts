import { Router } from 'express';
import { createCourseController, getAllCoursesController, deleteCourseController } from '../Controller/courseController.js';
import { authenticateToken, requireAdmin } from '../Security/authMiddleware.js';

const router = Router();
router.use(authenticateToken, requireAdmin);

router.get('/', getAllCoursesController);
router.post('/', createCourseController);
router.delete('/:id', deleteCourseController);

export default router;