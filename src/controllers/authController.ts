import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/userRepository";
import { CustomError } from "../middlewares/errorMiddleware";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error: CustomError = new Error("Email and password are required");
      error.statusCode = 400;
      return next(error);
    }

    const user = await userRepository.findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const error: CustomError = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" },
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (error) {
    next(error);
  }
};
