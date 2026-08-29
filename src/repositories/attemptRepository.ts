import { pool } from "../config/database";

export class AttemptRepository {
  static async findAttempt(studentId: number, examId: number) {
    const query =
      "SELECT * FROM exam_attempts WHERE student_id = $1 AND exam_id = $2";
    const result = await pool.query(query, [studentId, examId]);
    return result.rows[0];
  }

  static async createAttempt(
    studentId: number,
    examId: number,
    rawScore: number,
    finalScore: number,
    tabSwitchCount: number,
    penalty: number,
  ) {
    const query = `
      INSERT INTO exam_attempts (student_id, exam_id, raw_score, final_score_over_20, tab_switch_count, penalty_points, is_submitted)
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING *
    `;
    const result = await pool.query(query, [
      studentId,
      examId,
      rawScore,
      finalScore,
      tabSwitchCount,
      penalty,
    ]);
    return result.rows[0];
  }

  static async createStudentAnswer(
    attemptId: number,
    questionId: number,
    selectedChoiceId: number | null,
    isCorrect: boolean,
    pointsAwarded: number,
  ) {
    const query = `
      INSERT INTO student_answers (attempt_id, question_id, selected_choice_id, is_correct, points_awarded)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [
      attemptId,
      questionId,
      selectedChoiceId,
      isCorrect,
      pointsAwarded,
    ]);
  }

  static async findStudentResults(studentId: number) {
    const query = `
      SELECT ea.*, e.title as exam_title, c.name as course_name, c.code as course_code
      FROM exam_attempts ea
      JOIN exams e ON ea.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE ea.student_id = $1
      ORDER BY ea.submitted_at DESC
    `;
    const result = await pool.query(query, [studentId]);
    return result.rows;
  }

  static async findAttemptDetails(attemptId: number, studentId: number) {
    const query = `
      SELECT ea.*, e.title as exam_title, e.description as exam_description
      FROM exam_attempts ea
      JOIN exams e ON ea.exam_id = e.id
      WHERE ea.id = $1 AND ea.student_id = $2
    `;
    const result = await pool.query(query, [attemptId, studentId]);
    return result.rows[0];
  }

  static async findAnswersWithCorrection(attemptId: number) {
    const query = `
      SELECT sa.*, q.question_text, q.points as max_points, 
             sc.choice_text as selected_choice_text,
             cc.id as correct_choice_id, cc.choice_text as correct_choice_text
      FROM student_answers sa
      JOIN questions q ON sa.question_id = q.id
      LEFT JOIN choices sc ON sa.selected_choice_id = sc.id
      JOIN choices cc ON q.id = cc.question_id AND cc.is_correct = true
      WHERE sa.attempt_id = $1
    `;
    const result = await pool.query(query, [attemptId]);
    return result.rows;
  }
}
