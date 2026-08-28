import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../Repositories/userRepositorie.js';

export const loginService = async (email: string, pass: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw { status: 401, message: 'Invalid email or password.' };
  }

  if (!user.is_active) {
    throw { status: 403, message: 'Account is deactivated.' };
  }

  const validPassword = await bcrypt.compare(pass, user.password || '');
  if (!validPassword) {
    throw { status: 401, message: 'Invalid email or password.' };
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, is_active: user.is_active },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' }
  );

  return { token, role: user.role };
};