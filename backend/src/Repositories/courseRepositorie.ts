import { pool } from '../config/db.js';
import { Course } from '../Model/courseModel.js';

export const createCourseRepo = async (code: string, name: string, description: string): Promise<Course> => {
  const result = await pool.query(
    'INSERT INTO courses (code, name, description) VALUES ($1, $2, $3) RETURNING *',
    [code, name, description]
  );
  return result.rows[0];
};

export const getAllCoursesRepo = async (): Promise<Course[]> => {
  const result = await pool.query('SELECT * FROM courses');
  return result.rows;
};

export const getCourseByIdRepo = async (id: number): Promise<Course | null> => {
  const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
  return result.rows[0];
};

export const deleteCourseRepo = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
  return (result.rowCount ?? 0) > 0;
};