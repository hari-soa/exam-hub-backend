// src/services/courseService.ts
import { CourseRepository } from '../repositories/courseRepository';

export class CourseService {
  static async getAllCourses() {
    return await CourseRepository.findAll();
  }

  static async getCourseById(id: number) {
    const course = await CourseRepository.findById(id);
    if (!course) {
      const error: any = new Error('Course not found');
      error.status = 404;
      throw error;
    }
    return course;
  }

  static async createCourse(data: { code: string; name: string; description?: string; professor_name?: string; credits?: number; semester?: string }) {
    const existing = await CourseRepository.findByCode(data.code);
    if (existing) {
      const error: any = new Error('Course code already exists');
      error.status = 409;
      throw error;
    }

    return await CourseRepository.create(
      data.code,
      data.name,
      data.description || '',
      data.professor_name || '',
      data.credits || 4,
      data.semester || 'Semester 1'
    );
  }

  static async updateCourse(id: number, data: { code: string; name: string; description?: string; professor_name?: string; credits?: number; semester?: string }) {
    const course = await CourseRepository.findById(id);
    if (!course) {
      const error: any = new Error('Course not found');
      error.status = 404;
      throw error;
    }

    return await CourseRepository.update(
      id,
      data.code,
      data.name,
      data.description || '',
      data.professor_name || '',
      data.credits || 4,
      data.semester || 'Semester 1'
    );
  }

  static async deleteCourse(id: number) {
    const course = await CourseRepository.findById(id);
    if (!course) {
      const error: any = new Error('Course not found');
      error.status = 404;
      throw error;
    }

    try {
      return await CourseRepository.delete(id);
    } catch (error: any) {
      if (error.code === '23503') {
        const customError: any = new Error('Cannot delete course because it has associated exams (RG-09)');
        customError.status = 409;
        throw customError;
      }
      throw error;
    }
  }
}