import { pool } from "../config/database";

export class UserRepository {
  static async findAllStudents() {
    const query = `
      SELECT id, first_name, last_name, email, matricule, role, is_active, created_at 
      FROM users 
      WHERE role = 'student' 
      ORDER BY id DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: number) {
    const query = `
      SELECT id, first_name, last_name, email, matricule, role, is_active, created_at 
      FROM users 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email: string) {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async createStudent(
    firstName: string,
    lastName: string,
    email: string,
    matricule: string,
    hashedPassword: string,
  ) {
    const query = `
      INSERT INTO users (first_name, last_name, email, matricule, password, role, is_active)
      VALUES ($1, $2, $3, $4, $5, 'student', true)
      RETURNING id, first_name, last_name, email, matricule, role, is_active, created_at
    `;
    const result = await pool.query(query, [
      firstName,
      lastName,
      email,
      matricule,
      hashedPassword,
    ]);
    return result.rows[0];
  }

  static async updateStudent(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    matricule: string,
  ) {
    const query = `
      UPDATE users 
      SET first_name = $1, last_name = $2, email = $3, matricule = $4 
      WHERE id = $5 AND role = 'student'
      RETURNING id, first_name, last_name, email, matricule, role, is_active, created_at
    `;
    const result = await pool.query(query, [
      firstName,
      lastName,
      email,
      matricule,
      id,
    ]);
    return result.rows[0];
  }

  static async updatePassword(id: number, hashedPassword: string) {
    const query = `
      UPDATE users 
      SET password = $1 
      WHERE id = $2
      RETURNING id
    `;
    const result = await pool.query(query, [hashedPassword, id]);
    return result.rows[0];
  }

  static async deactivate(id: number) {
    const query = `
      UPDATE users 
      SET is_active = false 
      WHERE id = $1 AND role = 'student'
      RETURNING id, is_active
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}
