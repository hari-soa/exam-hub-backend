export interface Course {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  professor_name?: string;
  credits?: number;
  semester?: string;
  created_at?: Date;
}
