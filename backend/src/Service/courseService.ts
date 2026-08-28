import { createCourseRepo, getAllCoursesRepo, getCourseByIdRepo, deleteCourseRepo } from '../Repositories/courseRepositorie.js';
import { pool } from '../config/db.js';

export const createCourseService = async (code: string, name: string, description: string) => {
  return await createCourseRepo(code, name, description);
};

export const getAllCoursesService = async () => {
  return await getAllCoursesRepo();
};

export const deleteCourseService = async (id: number) => {
  const course = await getCourseByIdRepo(id);
  if (!course) {
    throw { status: 404, message: 'Course not found.' };
  }
  
  const examsCheck = await pool.query('SELECT COUNT(*) FROM exams WHERE course_id = $1', [id]);
  if (parseInt(examsCheck.rows[0].count, 10) > 0) {
    throw { status: 409, message: 'Cannot delete course containing exams.' };
  }

  return await deleteCourseRepo(id);
};