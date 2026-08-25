import { ExamTakingService } from "../services/examTakingService";
import { StudentHistoryService } from "../services/studentHistoryService";
import { SubmittedAnswer } from "../services/studentExamService";

export const attemptService = {
 
    async getAvailableExams(studentId: string) {
        return await ExamTakingService.listAvailable(studentId);
    },

    async getExamDetailsForStudent(examId: string, studentId: string) {
        return await ExamTakingService.getExamForStudent(studentId, examId);
    },

    async submitExamAttempt(examId: string, studentId: string, answers: SubmittedAnswer[]) {
        return await ExamTakingService.submit(studentId, examId, answers);
    },

    async getStudentResultHistory(studentId: string) {
        return await StudentHistoryService.getStudentHistory(studentId);
    },
};