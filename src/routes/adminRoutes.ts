import { Router } from "express";
import studentManagementRoutes from "./studentRoutes";
import courseRoutes from "./courseRoutes";
import questionRoutes from "./questionRoutes";
import examRoutes from "./examRoutes";
import { authenticateToken, requireAdmin } from "../security/authMiddleware";
import { DashboardController } from "../controllers/dashboardController";

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get("/dashboard", DashboardController.getStats);

router.use("/students", studentManagementRoutes);
router.use("/courses", courseRoutes);
router.use("/questions", questionRoutes);
router.use("/exams", examRoutes);

export default router;
