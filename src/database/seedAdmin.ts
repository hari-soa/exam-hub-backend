import { pool } from "../config/database";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    const checkQuery = "SELECT * FROM users WHERE email = $1";
    const existing = await pool.query(checkQuery, [email]);

    if (existing.rows.length > 0) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(insertQuery, [
      "Super",
      "Admin",
      email,
      password,
      "admin",
      true,
    ]);

    console.log("Admin user created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
}

seed();
