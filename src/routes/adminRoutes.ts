// src/routes/adminRoutes.ts
import { Router } from "express";
import studentManagementRoutes from "./studentRoutes";
import courseRoutes from "./courseRoutes";
import questionRoutes from "./questionRoutes";
import examRoutes from "./examRoutes"; // 👈 1. Import requis
import { authenticateToken, requireAdmin } from "../security/authMiddleware";
import { DashboardController } from "../controllers/dashboardController";

const router = Router();

// Middleware d'authentification global pour toutes les routes admin
router.use(authenticateToken, requireAdmin);

// Route pour les statistiques du tableau de bord
router.get("/dashboard", DashboardController.getStats);

// Sous-routes
router.use("/students", studentManagementRoutes);
router.use("/courses", courseRoutes);
router.use("/questions", questionRoutes);
router.use("/exams", examRoutes); // 👈 2. Montage requis pour /api/admin/exams/*

export default router;