import { getAllExamsRepo, getExamByIdRepo } from '../Repositories/examRepositorie.js';
import { getQuestionsByExamIdRepo } from '../Repositories/questionRepositorie.js';
import { checkExistingAttemptRepo, saveAttemptRepo, getAttemptsByStudentRepo, getAttemptsByExamRepo } from '../Repositories/attemptRepositorie.js';
import { pool } from '../config/db.js';

export const getAvailableExamsService = async () => {
  const exams = await getAllExamsRepo();
  const now = new Date();
  return exams.filter(e => new Date(e.start_time) <= now && new Date(e.end_time) >= now);
};

export const getExamForStudentService = async (examId: number, studentId: number) => {
  const exam = await getExamByIdRepo(examId);
  if (!exam) throw { status: 404, message: 'Exam not found.' };

  const now = new Date();
  if (new Date(exam.start_time) > now || new Date(exam.end_time) < now) {
    throw { status: 403, message: 'Exam is not currently available (RG-03).' };
  }

  const existingAttempt = await checkExistingAttemptRepo(examId, studentId);
  if (existingAttempt) {
    throw { status: 409, message: 'Exam already attempted (RG-02).' };
  }

  const questions = await getQuestionsByExamIdRepo(examId, true);
  return { exam, questions };
};

export const submitExamService = async (examId: number, studentId: number, answers: { question_id: number; choice_id: number }[]) => {
  const existingAttempt = await checkExistingAttemptRepo(examId, studentId);
  if (existingAttempt) {
    throw { status: 409, message: 'Exam already submitted.' };
  }

  const exam = await getExamByIdRepo(examId);
  if (!exam) throw { status: 404, message: 'Exam not found.' };

  const now = new Date();
  if (new Date(exam.start_time) > now || new Date(exam.end_time) < now) {
    throw { status: 403, message: 'Exam window closed.' };
  }

  let score = 0;
  const questions = await getQuestionsByExamIdRepo(examId, false);

  for (const q of questions) {
    const studentAnswer = answers.find(a => a.question_id === q.id);
    if (studentAnswer) {
      const selectedChoice = q.choices?.find(c => c.id === studentAnswer.choice_id);
      if (selectedChoice && selectedChoice.is_correct) {
        score += q.points;
      }
    }
  }

  const attempt = await saveAttemptRepo(examId, studentId, score, answers);
  return { attempt, score };
};

export const getStudentResultsService = async (studentId: number) => {
  return await getAttemptsByStudentRepo(studentId);
};

export const getExamResultsAdminService = async (examId: number) => {
  const attempts = await getAttemptsByExamRepo(examId);
  const avgQuery = await pool.query('SELECT AVG(score) as average FROM attempts WHERE exam_id = $1', [examId]);
  const average = avgQuery.rows[0].average || 0;
  return { attempts_count: attempts.length, average_score: average, attempts };
};