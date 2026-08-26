import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../security/jwt";
import { ApiError } from "../utils/ApiError";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "admin" | "student";
      };
    }
  }
}

export const authenticateToken = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    throw ApiError.unauthorized("Authentication token is missing");
  }

  try {
    const payload = verifyToken(token) as {
      id: string;
      email: string;
      role: "admin" | "student";
    };
    req.user = payload;
    next();
  } catch (error) {
    throw ApiError.unauthorized("Invalid or expired token");
  }
};

export const requireRole = (requiredRole: "admin" | "student") => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    if (req.user.role !== requiredRole) {
      throw ApiError.forbidden("Access denied: insufficient permissions");
    }

    next();
  };
};
