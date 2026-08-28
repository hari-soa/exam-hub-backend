import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import myRoutes from "./routes/myRoutes";
import studentRoutes from "./routes/studentRoutes";
import courseRoutes from "./routes/courseRoutes";
import examRoutes from "./routes/examRoutes"; // 👈 1. Import du routeur des examens
import { errorHandler, notFoundHandler } from "./security/errorHandler";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT);

if (!PORT || isNaN(PORT)) {
  throw new Error("PORT manquant ou invalide dans le fichier .env");
}

app.use(express.json());

// 🛡️ SÉCURITÉ : Intercepte les erreurs de body-parser (JSON invalide / Token brut)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    console.error("❌ Erreur de parsing JSON : Format de requête invalide.");
    return res.status(400).json({
      message: "Format de requête invalide. Un objet JSON était attendu.",
    });
  }
  next(err);
});

app.get("/", (_req: Request, res: Response) => {
  res.send("Exam Hub API running.");
});

// Enregistrement des routes de l'API
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", myRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exams", examRoutes); // 👈 2. Montage sur /api/exams

// Middlewares d'erreur (Toujours en dernier)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});