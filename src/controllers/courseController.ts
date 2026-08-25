import { Request, Response, NextFunction } from 'express';
import { CourseRepository } from '../repositories/courseRepository';

export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await CourseRepository.findAll();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, title, description, instructor_id } = req.body;
    if (!code || !title || !instructor_id) {
      res.status(400).json({ message: 'Missing required fields: code, title, and instructor_id are required' });
      return;
    }
    const course = await CourseRepository.create({ code, title, description, instructor_id: Number(instructor_id) });
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const updatedCourse = await CourseRepository.update(id, req.body);
    if (!updatedCourse) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const deleted = await CourseRepository.delete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};