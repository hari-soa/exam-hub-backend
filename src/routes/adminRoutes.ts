import { Router } from "express";
import { AdminStudentController } from "../controllers/adminStudentController";
import { AdminCourseController } from "../controllers/adminCourseController";
import { AdminExamController } from "../controllers/adminExamController";
import { authenticateToken, requireRole } from "../middlewares/authMiddleWare";

const router = Router();

router.use(authenticateToken, requireRole("admin"));

router.get("/students", AdminStudentController.listStudents);
router.post("/students", AdminStudentController.createStudent);
router.put("/students/:id", AdminStudentController.updateStudent);
router.patch(
  "/students/:id/deactivate",
  AdminStudentController.deactivateStudent,
);

router.get("/courses", AdminCourseController.listCourses);
router.post("/courses", AdminCourseController.createCourse);
router.put("/courses/:id", AdminCourseController.updateCourse);
router.delete("/courses/:id", AdminCourseController.deleteCourse);

router.get("/exams", AdminExamController.listExams);
router.post("/exams", AdminExamController.createExam);
router.get("/exams/:id", AdminExamController.getExamDetails);
router.put("/exams/:id", AdminExamController.updateExam);
router.delete("/exams/:id", AdminExamController.deleteExam);
router.get("/exams/:id/results", AdminExamController.getExamResults);

export default router;
