import { Request, Response } from 'express';
import { loginService } from '../Service/authService.js';

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
  }
};