import { Router } from "express";
import { AdminStudentController } from "../controllers/adminStudentController";
import { AdminCourseController } from "../controllers/adminCourseController";
import { AdminExamController } from "../controllers/adminExamController";
import { authenticateToken, requireRole } from "../middlewares/authMiddleWarre";

const router = Router();

router.use(authenticateToken, requireRole("admin"));

router.get("/admin/students", AdminStudentController.listStudents);
router.post("/admin/students", AdminStudentController.createStudent);
router.put("/admin/students/:id", AdminStudentController.updateStudent);
router.patch(
  "/admin/students/:id/deactivate",
  AdminStudentController.deactivateStudent,
);

router.get("/admin/courses", AdminCourseController.listCourses);
router.post("/admin/courses", AdminCourseController.createCourse);
router.put("/admin/courses/:id", AdminCourseController.updateCourse);
router.delete("/admin/courses/:id", AdminCourseController.deleteCourse);

router.get("/admin/exams", AdminExamController.listExams);
router.post("/admin/exams", AdminExamController.createExam);
router.get("/admin/exams/:id", AdminExamController.getExamDetails);
router.put("/admin/exams/:id", AdminExamController.updateExam);
router.delete("/admin/exams/:id", AdminExamController.deleteExam);
router.get("/admin/exams/:id/results", AdminExamController.getExamResults);

export default router;
