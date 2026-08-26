import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import studentRoutes from "./routes/studentRoutes";
import { errorHandler, notFoundHandler } from "./security/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const clientUrl = process.env.CLIENT_URL;
app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Exam Hub API running.");
});

app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
