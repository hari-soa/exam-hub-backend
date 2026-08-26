import bcrypt from "bcrypt";
import * as userRepository from "../repositories/userRepository";
import { User, CreateUserDTO, UpdateUserDTO } from "../models/userModel";
import { ApiError } from "../utils/ApiError";

export const getAllStudents = async (): Promise<User[]> => {
  return await userRepository.findAllStudents();
};

export const createStudentAccount = async (
  data: CreateUserDTO,
): Promise<User> => {
  const existingUser = await userRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw ApiError.conflict("Un compte avec cet email existe déjà.");
  }

  const hashedPassword = await bcrypt.hash(data.password!, 10);

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
    throw ApiError.notFound("Étudiant introuvable.");
  }
  return updatedUser;
};

export const deactivateStudentAccount = async (id: number): Promise<void> => {
  const success = await userRepository.deactivateUser(id);
  if (!success) {
    throw ApiError.notFound("Étudiant introuvable ou déjà inactif.");
  }
};
