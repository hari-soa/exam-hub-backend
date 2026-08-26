import { pool } from "../config/database";
import { User } from "../models/userModel";

export const StudentRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1 AND role = 'student'",
      [email],
    );
    return rows[0] || null;
  },

  async create(
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string,
  ): Promise<User> {
    const { rows } = await pool.query<User>(
      "INSERT INTO users (first_name, last_name, email, password, role, is_active) VALUES ($1, $2, $3, $4, 'student', true) RETURNING *",
      [firstName, lastName, email, passwordHash],
    );
    return rows[0];
  },
};
