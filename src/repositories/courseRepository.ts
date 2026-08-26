import { pool } from "../config/database";

export interface CourseData {
  code: string;
  name: string;
  description?: string;
}

export const CourseRepository = {
  async findAll() {
    const { rows } = await pool.query(
      "SELECT * FROM courses ORDER BY code ASC;",
    );
    return rows;
  },

  async findById(id: number) {
    const { rows } = await pool.query("SELECT * FROM courses WHERE id = $1;", [
      id,
    ]);
    return rows[0] || null;
  },

  async findByCode(code: string) {
    const { rows } = await pool.query(
      "SELECT * FROM courses WHERE code = $1;",
      [code],
    );
    return rows[0] || null;
  },

  async countExamsByCourseId(courseId: number): Promise<number> {
    const { rows } = await pool.query(
      "SELECT COUNT(*) as count FROM exams WHERE course_id = $1;",
      [courseId],
    );
    return Number(rows[0].count);
  },

  async create(data: CourseData) {
    const { rows } = await pool.query(
      "INSERT INTO courses (code, name, description) VALUES ($1, $2, $3) RETURNING *;",
      [data.code, data.name, data.description || null],
    );
    return rows[0];
  },

  async update(id: number, data: Partial<CourseData>) {
    const { rows } = await pool.query(
      `UPDATE courses 
       SET code = COALESCE($1, code), 
           name = COALESCE($2, name), 
           description = COALESCE($3, description) 
       WHERE id = $4 RETURNING *;`,
      [data.code, data.name, data.description, id],
    );
    return rows[0] || null;
  },

  async delete(id: number) {
    await pool.query("DELETE FROM courses WHERE id = $1;", [id]);
  },
};
