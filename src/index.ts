import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import studentRoutes from "./routes/studentRoutes";
import { errorHandler } from "./security/errorMiddleware";

const app = express();
const PORT = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Exam Hub API is working!");
});

app.use(authRoutes);
app.use(adminRoutes);
app.use(studentRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
