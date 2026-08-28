import { Request, Response } from 'express';
import { createCourseService, getAllCoursesService, deleteCourseService } from '../Service/courseService.js';

export const createCourseController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, description } = req.body;
    const course = await createCourseService(code, name, description);
    res.status(201).json(course);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getAllCoursesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await getAllCoursesService();
    res.status(200).json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourseController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await deleteCourseService(id);
    res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};