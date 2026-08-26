import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../security/jwt";
import { ApiError } from "../utils/ApiError";

export const authenticateToken = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return next(ApiError.unauthorized("No token provided"));
  }
  try {
    const payload = verifyToken(token) as JwtPayload;
    req.user = payload;
    return next();
  } catch (error) {
    return next(ApiError.unauthorized("Invalid or expired token"));
  }
};

export const requireRole = (requiredRole: "admin" | "student") => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized("No token provided"));
    }

    if (req.user.role !== requiredRole) {
      const message =
        requiredRole === "admin"
          ? "Admin access required"
          : "Student access required";
      return next(ApiError.forbidden(message));
    }

    return next();
  };
};
