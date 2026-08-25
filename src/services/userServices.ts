import bcrypt from "bcrypt";
import * as userRepository from "../repositories/userRepository";
import { User, CreateUserDTO, UpdateUserDTO } from "../models/userModel";

export const getAllStudents = async (): Promise<User[]> => {
  return await userRepository.findAllStudents();
};

export const createStudentAccount = async (
  data: CreateUserDTO,
): Promise<User> => {
  const existingUser = await userRepository.findUserByEmail(data.email);
  if (existingUser) {
    const error: any = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await userRepository.createUser({
    ...data,
    password: hashedPassword,
    role: "student",
  });
};

export const updateStudentProfile = async (
  id: number,
  data: UpdateUserDTO,
): Promise<User> => {
  const updatedUser = await userRepository.updateUser(id, data);
  if (!updatedUser) {
    const error: any = new Error("Student not found.");
    error.statusCode = 404;
    throw error;
  }
  return updatedUser;
};

export const deactivateStudentAccount = async (id: number): Promise<void> => {
  const success = await userRepository.deactivateUser(id);
  if (!success) {
    const error: any = new Error("Student not found or already inactive.");
    error.statusCode = 404;
    throw error;
  }
};
