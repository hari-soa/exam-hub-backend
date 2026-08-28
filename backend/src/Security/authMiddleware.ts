import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: number; email: string; role: 'admin' | 'student'; is_active: boolean };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Authentication token missing.' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
    if (err) {
      res.status(401).json({ message: 'Invalid or expired token.' });
      return;
    }
    req.user = user;
    next();
  });
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
    return;
  }
  next();
};

export const requireStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user || req.user.role !== 'student') {
    res.status(403).json({ message: 'Access denied. Student role required.' });
    return;
  }
  next();
};