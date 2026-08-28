import { createExamRepo, getAllExamsRepo, getExamByIdRepo, deleteExamRepo, countExamAttemptsRepo } from '../Repositories/examRepositorie.js';

export const createExamService = async (courseId: number, title: string, description: string, startTime: string, endTime: string) => {
  return await createExamRepo(courseId, title, description, startTime, endTime);
};

export const getAllExamsService = async () => {
  return await getAllExamsRepo();
};

export const getExamByIdService = async (id: number) => {
  const exam = await getExamByIdRepo(id);
  if (!exam) throw { status: 404, message: 'Exam not found.' };
  return exam;
};

export const deleteExamService = async (id: number) => {
  const attempts = await countExamAttemptsRepo(id);
  if (attempts > 0) {
    throw { status: 409, message: 'Cannot delete exam with existing attempts (RG-09).' };
  }
  return await deleteExamRepo(id);
};