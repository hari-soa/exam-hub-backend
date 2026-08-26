export type UserRole = "admin" | "student";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  matricule?: string;
  password?: string;
  role: UserRole;
  is_active: boolean;
  created_at?: Date;
}

export type CreateUserDTO = Omit<User, "id" | "is_active" | "created_at">;
export type UpdateUserDTO = Partial<
  Pick<User, "first_name" | "last_name" | "email">
>;
