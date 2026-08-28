import { pool } from '../config/db.js';
import { User } from '../Model/userModel.js';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const findUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query('SELECT id, email, role, is_active, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

export const createUser = async (email: string, hashedPassword: string, role: 'admin' | 'student'): Promise<User> => {
  const result = await pool.query(
    'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, is_active, created_at',
    [email, hashedPassword, role]
  );
  return result.rows[0];
};

export const updateUserStatus = async (id: number, isActive: boolean): Promise<User | null> => {
  const result = await pool.query(
    'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, email, role, is_active, created_at',
    [isActive, id]
  );
  return result.rows[0];
};

export const updatePassword = async (id: number, hashedPassword: string): Promise<void> => {
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
};

export const getAllStudentsRepo = async (): Promise<User[]> => {
  const result = await pool.query("SELECT id, email, role, is_active, created_at FROM users WHERE role = 'student'");
  return result.rows;
};