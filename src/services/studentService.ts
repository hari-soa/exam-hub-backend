// src/services/studentService.ts
import { pool } from '../config/database';

export class StudentService {
  /**
   * Récupère la liste de tous les étudiants
   */
  static async getAllStudents() {
    const query = `
      SELECT id, name, email, role, is_active, created_at 
      FROM users 
      WHERE role = 'student'
      ORDER BY id ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Crée un nouvel étudiant
   */
  static async createStudent(data: { name: string; email: string; password?: string }) {
    const { name, email, password } = data;
    const defaultPassword = password || 'student123'; // Mot de passe par défaut si non fourni
    
    const query = `
      INSERT INTO users (name, email, password, role, is_active)
      VALUES ($1, $2, $3, 'student', true)
      RETURNING id, name, email, role, is_active, created_at
    `;
    const result = await pool.query(query, [name, email, defaultPassword]);
    return result.rows[0];
  }

  /**
   * Met à jour les informations d'un étudiant
   */
  static async updateStudent(id: number, data: { name?: string; email?: string; is_active?: boolean }) {
    const { name, email, is_active } = data;
    const query = `
      UPDATE users 
      SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        is_active = COALESCE($3, is_active)
      WHERE id = $4 AND role = 'student'
      RETURNING id, name, email, role, is_active, created_at
    `;
    const result = await pool.query(query, [name, email, is_active, id]);
    return result.rows[0];
  }

  /**
   * Réinitialise le mot de passe d'un étudiant
   */
  static async resetPassword(id: number, password: string) {
    const query = `
      UPDATE users 
      SET password = $1
      WHERE id = $2 AND role = 'student'
      RETURNING id, email
    `;
    const result = await pool.query(query, [password, id]);
    return result.rows[0];
  }

  /**
   * Désactive ou supprime un étudiant
   */
  static async deactivateStudent(id: number) {
    const query = `
      UPDATE users 
      SET is_active = false 
      WHERE id = $1 AND role = 'student'
      RETURNING id, name, email, is_active
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}