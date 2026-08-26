import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import { pool } from "../config/database";
import * as userRepository from "../repositories/userRepository";

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env file");
    }
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const existingAdmin = await userRepository.findUserByEmail(adminEmail);
    if (!existingAdmin) {
      await pool.query(
        `INSERT INTO users (first_name, last_name, email, password, role, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ["System", "Admin", adminEmail, hashedPassword, "admin", true],
      );
      console.log(`Admin account created successfully (${adminEmail}).`);
    } else {
      await pool.query(
        `UPDATE users 
         SET password = $1, is_active = true 
         WHERE email = $2`,
        [hashedPassword, adminEmail],
      );
      console.log(`Admin password and status updated for ${adminEmail}.`);
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await pool.end();
  }
};

seedAdmin();
