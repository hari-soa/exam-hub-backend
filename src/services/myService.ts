// src/services/myService.ts
import { ExamRepository } from '../repositories/examRepository';
import { QuestionRepository } from '../repositories/questionRepository';
import { AttemptRepository } from '../repositories/attemptRepository';
import { pool } from '../config/database';

export class MyService {
  static async getStudentProfile(studentId: number) {
    console.log('👤 studentId reçu:', studentId); // ← log temporaire
    const result = await pool.query(
      'SELECT id, name, email, is_active, created_at FROM students WHERE id = $1',
      [studentId]
    );
    if (!result.rows[0]) {
      const error: any = new Error('Student not found');
      error.status = 404;
      throw error;
    }
    return result.rows[0];
  }

  static async getAvailableExams(studentId: number) {
    return await ExamRepository.findAvailableForStudent(studentId);
  }

  static async getExamForStudent(studentId: number, examId: number) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      const error: any = new Error('Exam not found');
      error.status = 404;
      throw error;
    }

    const now = new Date();
    const start = new Date(exam.start_time);
    const end = new Date(exam.end_time);

    if (now < start || now > end) {
      const error: any = new Error('Exam is not currently available (RG-03)');
      error.status = 403;
      throw error;
    }

    const existingAttempt = await AttemptRepository.findAttempt(studentId, examId);
    if (existingAttempt) {
      const error: any = new Error('Exam already submitted (RG-02)');
      error.status = 409;
      throw error;
    }

    // RG-07: Never send is_correct to the student
    const questions = await QuestionRepository.findByExamId(examId, false);
    return { ...exam, questions };
  }

  static async submitExam(
    studentId: number,
    examId: number,
    answers: { question_id: number; choice_id: number | null }[],
    tabSwitchCount: number = 0
  ) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      const error: any = new Error('Exam not found');
      error.status = 404;
      throw error;
    }

    const now = new Date();
    const start = new Date(exam.start_time);
    const end = new Date(exam.end_time);

    if (now < start || now > end) {
      const error: any = new Error('Exam window is closed (RG-03)');
      error.status = 403;
      throw error;
    }

    const existingAttempt = await AttemptRepository.findAttempt(studentId, examId);
    if (existingAttempt) {
      const error: any = new Error('Exam already submitted (RG-02)');
      error.status = 409;
      throw error;
    }

    const questions = await QuestionRepository.findByExamId(examId, true);
    let rawScore = 0;
    let maxPossibleScore = 0;
    const evaluationDetails = [];

    for (const q of questions) {
      maxPossibleScore += parseFloat(q.points);
      const studentAns = answers.find(a => a.question_id === q.id);
      const selectedChoiceId = studentAns ? studentAns.choice_id : null;

      const correctChoice = q.choices.find((c: any) => c.is_correct);
      let isCorrect = false;
      let pointsAwarded = 0;

      if (selectedChoiceId && correctChoice && selectedChoiceId === correctChoice.id) {
        isCorrect = true;
        pointsAwarded = parseFloat(q.points);
        rawScore += pointsAwarded;
      }

      evaluationDetails.push({
        question_id: q.id,
        selected_choice_id: selectedChoiceId,
        is_correct: isCorrect,
        points_awarded: pointsAwarded,
      });
    }

    const penalty = (tabSwitchCount || 0) * 0.5;
    let finalScore = rawScore - penalty;
    if (finalScore < 0) finalScore = 0;

    let finalScoreOver20 = 0;
    if (maxPossibleScore > 0) {
      finalScoreOver20 = (finalScore / maxPossibleScore) * 20;
    }
    if (finalScoreOver20 < 0) finalScoreOver20 = 0;
    if (finalScoreOver20 > 20) finalScoreOver20 = 20;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const attemptQuery = `
        INSERT INTO exam_attempts (exam_id, student_id, raw_score, final_score_over_20, tab_switch_count, penalty_points, is_submitted)
        VALUES ($1, $2, $3, $4, $5, $6, true)
        RETURNING *
      `;
      const attemptRes = await client.query(attemptQuery, [
        examId,
        studentId,
        rawScore,
        finalScoreOver20,
        tabSwitchCount,
        penalty,
      ]);
      const attempt = attemptRes.rows[0];

      for (const ed of evaluationDetails) {
        const answerQuery = `
          INSERT INTO student_answers (attempt_id, question_id, selected_choice_id, is_correct, points_awarded)
          VALUES ($1, $2, $3, $4, $5)
        `;
        await client.query(answerQuery, [
          attempt.id,
          ed.question_id,
          ed.selected_choice_id,
          ed.is_correct,
          ed.points_awarded,
        ]);
      }

      await client.query('COMMIT');

      return {
        attempt_id: attempt.id,
        raw_score: rawScore,
        final_score_over_20: parseFloat(finalScoreOver20.toFixed(2)),
        max_possible_score: maxPossibleScore,
        penalty_points: penalty,
        tab_switch_count: tabSwitchCount,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getStudentResults(studentId: number) {
    return await AttemptRepository.findStudentResults(studentId);
  }

  static async getAttemptCorrection(studentId: number, attemptId: number) {
    const attempt = await AttemptRepository.findAttemptDetails(attemptId, studentId);
    if (!attempt) {
      const error: any = new Error('Attempt not found');
      error.status = 404;
      throw error;
    }

    const answers = await AttemptRepository.findAnswersWithCorrection(attemptId);
    return {
      attempt,
      answers,
    };
  }
}