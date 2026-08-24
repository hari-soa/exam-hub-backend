import { Router } from "express";
import { authenticateToken, requireRole } from "../security/errorMiddleware";
import * as studentController from "../controllers/studentController";
import * as courseController from "../controllers/courseController";
import * as examController from "../controllers/examController";
import * as questionController from "../controllers/questionController";

const router = Router();

router.use(authenticateToken, requireRole("admin"));

router.get("/students", studentController.getAllStudents);
router.post("/students", studentController.createStudent);
router.put("/students/:id", studentController.updateStudent);
router.delete("/students/:id", studentController.deactivateStudent);

router.get("/courses", courseController.getAllCourses);
router.post("/courses", courseController.createCourse);
router.put("/courses/:id", courseController.updateCourse);
router.delete("/courses/:id", courseController.deleteCourse);

router.get("/exams", examController.getAllExams);
router.post("/exams", examController.createExam);
router.get("/exams/:id", examController.getExamById);
router.put("/exams/:id", examController.updateExam);
router.delete("/exams/:id", examController.deleteExam);
router.get("/exams/:id/results", examController.getExamResults);

router.get("/exams/:id/questions", questionController.getQuestionsByExam);
router.post("/exams/:id/questions", questionController.createQuestion);
router.put("/questions/:id", questionController.updateQuestion);
router.delete("/questions/:id", questionController.deleteQuestion);

export default router;
