import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "admin" | "student";
  };
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({ message });
};

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Authentication token required" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }
    req.user = user as { id: string; role: "admin" | "student" };
    next();
  });
};

export const requireRole = (role: "admin" | "student") => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user || req.user.role !== role) {
      res
        .status(403)
        .json({ message: "Access forbidden: Insufficient permissions" });
      return;
    }
    next();
  };
};
