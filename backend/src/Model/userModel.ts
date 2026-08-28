export interface User {
  id: number;
  email: string;
  password?: string;
  role: 'admin' | 'student';
  is_active: boolean;
  created_at: Date;
}