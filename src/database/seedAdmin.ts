import bcrypt from "bcrypt";
import { pool } from "../configuration/database";
import * as userRepository from "../repositories/userRepository";

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL!;
    const existingAdmin = await userRepository.findUserByEmail(adminEmail);

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
      await pool.query(
        `INSERT INTO users (first_name, last_name, email, password, role)
         VALUES ($1, $2, $3, $4, $5)`,
        ["System", "Admin", adminEmail, hashedPassword, "admin"],
      );
      console.log("Initial admin account created successfully.");
    } else {
      console.log("Admin account already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await pool.end();
  }
};

seedAdmin();
