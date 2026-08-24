import { pool } from "../configuration/database";
import { User } from "../models/userModel";

export const findUserByEmail = async (
  email: string,
): Promise<User | undefined> => {
  const result = await pool.query(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
    [email],
  );
  return result.rows[0];
};

export const findUserByIdentifier = async (identifier: string) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1 OR matricule = $1`,
    [identifier],
  );
  return result.rows[0] || null;
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const createUser = async (
  user: Omit<User, "id" | "is_active" | "created_at">,
): Promise<User> => {
  const { first_name, last_name, email, password, role } = user;
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, first_name, last_name, email, role, is_active, created_at`,
    [first_name, last_name, email, password, role],
  );
  return result.rows[0];
};

export const findAllStudents = async (): Promise<User[]> => {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, role, is_active, created_at 
     FROM users 
     WHERE role = 'student' 
     ORDER BY created_at DESC`,
  );
  return result.rows;
};

export const updateUser = async (
  id: string,
  user: Partial<Pick<User, "first_name" | "last_name" | "email">>,
): Promise<User | undefined> => {
  const { first_name, last_name, email } = user;
  const result = await pool.query(
    `UPDATE users 
     SET first_name = COALESCE($1, first_name), 
         last_name = COALESCE($2, last_name), 
         email = COALESCE($3, email) 
     WHERE id = $4 AND role = 'student'
     RETURNING id, first_name, last_name, email, role, is_active`,
    [first_name, last_name, email, id],
  );
  return result.rows[0];
};

export const updatePassword = async (
  id: string,
  hashedPassword: string,
): Promise<void> => {
  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
    hashedPassword,
    id,
  ]);
};

export const deactivateUser = async (id: string): Promise<boolean> => {
  const result = await pool.query(
    "UPDATE users SET is_active = false WHERE id = $1 AND role = 'student' RETURNING id",
    [id],
  );
  return (result.rowCount ?? 0) > 0;
};
