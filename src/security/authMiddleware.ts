import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../security/jwt";
import { ApiError } from "./ApiError";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(ApiError.unauthorized("Token d'authentification manquant"));
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return next(ApiError.unauthorized("Token invalide ou expiré"));
  }
};

export const requireRole = (requiredRole: "admin" | "student") => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized("Accès non autorisé"));
    }

    if (req.user.role !== requiredRole) {
      return next(ApiError.forbidden("Permissions insuffisantes"));
    }

    next();
  };
};
