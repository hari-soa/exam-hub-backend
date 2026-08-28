import bcrypt from 'bcrypt';
import { createUser, getAllStudentsRepo, updateUserStatus, updatePassword, findUserById } from '../Repositories/userRepositorie.js';

export const createStudentService = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await createUser(email, hashedPassword, 'student');
};

export const getAllStudentsService = async () => {
  return await getAllStudentsRepo();
};

export const deactivateStudentService = async (id: number) => {
  const student = await findUserById(id);
  if (!student) {
    throw { status: 404, message: 'Student not found.' };
  }
  return await updateUserStatus(id, false);
};

export const resetPasswordService = async (id: number, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updatePassword(id, hashedPassword);
};