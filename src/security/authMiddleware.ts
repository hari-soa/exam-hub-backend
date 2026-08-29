import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: "admin" | "student";
    email: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token d'authentification manquant" });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token invalide ou expiré" });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "admin") {
    res
      .status(403)
      .json({ message: "Accès refusé : rôle Administrateur requis" });
    return;
  }
  next();
};

export const requireStudent = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "student") {
    res.status(403).json({ message: "Accès refusé : rôle Étudiant requis" });
    return;
  }
  next();
};
