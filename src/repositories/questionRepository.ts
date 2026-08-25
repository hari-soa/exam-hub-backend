import { pool } from "../config/database";
import { Question } from "../models/examModel";

export const QuestionRepository = {
  async findByExamId(examId: number): Promise<Question[]> {
    const { rows } = await pool.query<Question>(
      "SELECT * FROM questions WHERE exam_id = $1 ORDER BY id ASC",
      [examId],
    );
    return rows;
  },

  async findById(id: number): Promise<Question | null> {
    const { rows } = await pool.query<Question>(
      "SELECT * FROM questions WHERE id = $1",
      [id],
    );
    return rows[0] || null;
  },
};
