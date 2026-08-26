import { CourseRepository, CourseData } from "../repositories/courseRepository";
import { ApiError } from "../utils/ApiError";

export const CourseService = {
  async getAllCourses() {
    return await CourseRepository.findAll();
  },

  async createCourse(data: CourseData) {
    if (!data.code || !data.name) {
      throw ApiError.badRequest("Code and name are required");
    }

    const existing = await CourseRepository.findByCode(data.code);
    if (existing) {
      throw ApiError.conflict(`Course with code '${data.code}' already exists`);
    }

    return await CourseRepository.create(data);
  },

  async updateCourse(id: number, data: Partial<CourseData>) {
    const course = await CourseRepository.findById(id);
    if (!course) {
      throw ApiError.notFound("Course not found");
    }

    if (data.code && data.code !== course.code) {
      const existing = await CourseRepository.findByCode(data.code);
      if (existing) {
        throw ApiError.conflict(
          `Course with code '${data.code}' already exists`,
        );
      }
    }

    return await CourseRepository.update(id, data);
  },

  async deleteCourse(id: number) {
    const course = await CourseRepository.findById(id);
    if (!course) {
      throw ApiError.notFound("Course not found");
    }

    // Application stricte de RG-09
    const examCount = await CourseRepository.countExamsByCourseId(id);
    if (examCount > 0) {
      throw ApiError.conflict("Cannot delete course that has associated exams");
    }

    await CourseRepository.delete(id);
  },
};
