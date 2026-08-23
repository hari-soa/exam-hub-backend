export type UserRole = "admin" | "student";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role: UserRole;
  is_default_password?: boolean;
}
