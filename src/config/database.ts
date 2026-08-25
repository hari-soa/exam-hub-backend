import { Pool } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const initAdminUser = async (): Promise<void> => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD!;
  const adminName = process.env.ADMIN_NAME;

  try {
    const existingAdmin = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [adminEmail],
    );
    if (existingAdmin.rowCount === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        "INSERT INTO users (full_name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5)",
        [adminName, adminEmail, hashedPassword, "admin", true],
      );
      console.log(`[SEED] Initial Admin created: ${adminEmail}`);
    }
  } catch (error) {
    console.error("[DATABASE] Error initializing admin user:", error);
  }
};
