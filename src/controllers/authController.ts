import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/userRepository";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identifier, password } = req.body; // identifier = email ou STD

    if (!identifier || !password) {
      const error: any = new Error("Identifier and password are required");
      error.statusCode = 400;
      return next(error);
    }

    const user = await userRepository.findUserByIdentifier(identifier);

    if (
      !user ||
      !(await bcrypt.compare(password, user.password)) ||
      !user.is_active
    ) {
      const error: any = new Error("Invalid credentials or inactive account");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        mustChangePassword: user.must_change_password,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" },
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        matricule: user.matricule,
        email: user.email,
        role: user.role,
        must_change_password: user.must_change_password,
      },
    });
  } catch (error) {
    next(error);
  }
};
