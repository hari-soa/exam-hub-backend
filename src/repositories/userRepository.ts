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

export const findUserById = async (id: string): Promise<User | undefined> => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const { first_name, last_name, email, password, role } = user;
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, first_name, last_name, email, role`,
    [first_name, last_name, email, password, role],
  );
  return result.rows[0];
};
