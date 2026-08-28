import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './Routes/authRoutes.js';
import studentRoutes from './Routes/studentRoutes.js';
import courseRoutes from './Routes/courseRoutes.js';
import examRoutes from './Routes/examRoutes.js';
import questionRoutes from './Routes/questionRoutes.js';
import myExamRoutes from './Routes/myExamRoutes.js';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/exams', examRoutes);
app.use('/api', questionRoutes);
app.use('/api', myExamRoutes);

export default app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on port${PORT}`);
});