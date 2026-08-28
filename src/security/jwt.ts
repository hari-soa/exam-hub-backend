import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  id: number;
  role: 'admin' | 'student';
  email: string;
}

const JWT_SECRET: string = process.env.JWT_SECRET || 'votre_secret_key';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '24h';

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};