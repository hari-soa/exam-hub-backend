import { pool } from '../configuration/database';
import { Course } from '../models/userModel';

export class CourseRepository {
  static async findAll(): Promise<Course[]> {
    const query = `
      SELECT c.id, c.code, c.title, c.description, c.instructor_id, c.created_at,
             u.first_name AS instructor_first_name, u.last_name AS instructor_last_name
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: string): Promise<Course | undefined> {
    const query = `SELECT * FROM courses WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(course: Omit<Course, 'id' | 'created_at'>): Promise<Course> {
    const query = `
      INSERT INTO courses (code, title, description, instructor_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, code, title, description, instructor_id, created_at
    `;
    const values = [course.code, course.title, course.description || null, course.instructor_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id: string, course: Partial<Course>): Promise<Course | undefined> {
    const query = `
      UPDATE courses
      SET code = COALESCE($1, code),
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          instructor_id = COALESCE($4, instructor_id)
      WHERE id = $5
      RETURNING id, code, title, description, instructor_id, created_at
    `;
    const values = [course.code, course.title, course.description, course.instructor_id, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM courses WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}