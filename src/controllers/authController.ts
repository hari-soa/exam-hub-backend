// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/database";
import { generateToken } from "../security/jwt";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      let user = null;
      let role: "admin" | "student" = "admin";

      const adminResult = await pool.query(
        "SELECT * FROM admins WHERE LOWER(email) = LOWER($1)",
        [email.trim()],
      );

      if (adminResult.rows.length > 0) {
        user = adminResult.rows[0];
        role = "admin";
      } else {
        const studentResult = await pool.query(
          "SELECT * FROM students WHERE LOWER(email) = LOWER($1)",
          [email.trim()],
        );
        if (studentResult.rows.length > 0) {
          user = studentResult.rows[0];
          role = "student";
        }
      }

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (user.is_active === false) {
        return res.status(401).json({ message: "Account disabled" });
      }

      const passwordField: string = user.password_hash || user.password;

      if (!passwordField) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      let isPasswordValid = false;
      if (
        passwordField.startsWith("$2b$") ||
        passwordField.startsWith("$2a$")
      ) {
        isPasswordValid = await bcrypt.compare(password, passwordField);
      } else {
        isPasswordValid = passwordField === password;
      }

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken({ id: user.id, role, email: user.email });
      const displayName: string =
        user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim();

      console.log(
        "✅ Login réussi pour:",
        user.email,
        "| rôle:",
        role,
        "| id:",
        user.id,
      );

      return res.status(200).json({
        token,
        user: { id: user.id, name: displayName, role },
      });
    } catch (error) {
      console.error("❌ Erreur login:", error);
      next(error);
    }
  }
}
