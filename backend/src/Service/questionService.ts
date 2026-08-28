import { createQuestionRepo, deleteQuestionRepo, getQuestionsByExamIdRepo } from '../Repositories/questionRepositorie.js';
import { countExamAttemptsRepo } from '../Repositories/examRepositorie.js';
import { Choice } from '../Model/questionModel.js';

export const createQuestionService = async (examId: number, statement: string, points: number, choices: Choice[]) => {
  const attempts = await countExamAttemptsRepo(examId);
  if (attempts > 0) {
    throw { status: 409, message: 'Cannot modify exam with existing attempts (RG-08).' };
  }

  if (choices.length < 2 || choices.length > 6) {
    throw { status: 400, message: 'A question must have between 2 and 6 choices (RG-04).' };
  }

  const correctCount = choices.filter(c => c.is_correct).length;
  if (correctCount !== 1) {
    throw { status: 400, message: 'A question must have exactly one correct choice (RG-04).' };
  }

  return await createQuestionRepo(examId, statement, points, choices);
};

export const deleteQuestionService = async (questionId: number) => {
  return await deleteQuestionRepo(questionId);
};

export const getQuestionsService = async (examId: number, hideCorrect: boolean = false) => {
  return await getQuestionsByExamIdRepo(examId, hideCorrect);
};