// src/repositories/courseRepository.ts
import { pool } from '../config/database';

export class CourseRepository {
  static async findAll() {
    const query = 'SELECT * FROM courses ORDER BY id DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: number) {
    const query = 'SELECT * FROM courses WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCode(code: string) {
    const query = 'SELECT * FROM courses WHERE code = $1';
    const result = await pool.query(query, [code]);
    return result.rows[0];
  }

  static async create(code: string, name: string, description: string, professorName: string, credits: number, semester: string) {
    const query = `
      INSERT INTO courses (code, name, description, professor_name, credits, semester)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [code, name, description, professorName, credits, semester]);
    return result.rows[0];
  }

  static async update(id: number, code: string, name: string, description: string, professorName: string, credits: number, semester: string) {
    const query = `
      UPDATE courses 
      SET code = $1, name = $2, description = $3, professor_name = $4, credits = $5, semester = $6
      WHERE id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [code, name, description, professorName, credits, semester, id]);
    return result.rows[0];
  }

  static async delete(id: number) {
    const query = 'DELETE FROM courses WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}