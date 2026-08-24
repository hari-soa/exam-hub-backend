import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.status;
  const message = err.message;

  res.status(statusCode).json({ message });
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
  if (!token) {
    res.status(401).json({ message: "Authentication token required" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err || !decoded || typeof decoded === "string") {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }
    (req as any).user = {
      id: (decoded as any).id,
      role: (decoded as any).role,
    };
    next();
  });
};

export const requireRole = (role: "admin" | "student") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user || user.role !== role) {
      res
        .status(403)
        .json({ message: "Access forbidden: Insufficient permissions" });
      return;
    }
    next();
  };
};
