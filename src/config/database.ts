import { Pool } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const initAdminUser = async (): Promise<void> => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return;
  try {
    const existingAdmin = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [adminEmail],
    );
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    if (existingAdmin.rowCount === 0) {
      await pool.query(
        `INSERT INTO users (first_name, last_name, email, password, role, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ["System", "Admin", adminEmail, hashedPassword, "admin", true],
      );
      console.log(`[SEED] Initial Admin created: ${adminEmail}`);
    } else {
      await pool.query(
        `UPDATE users SET password = $1, is_active = true WHERE email = $2`,
        [hashedPassword, adminEmail],
      );
    }
  } catch (error) {
    console.error("[DATABASE] Error initializing admin user:", error);
  }
};
