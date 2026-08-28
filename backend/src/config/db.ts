import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const initDb = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'student')),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS exams (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE RESTRICT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
        statement TEXT NOT NULL,
        points INTEGER NOT NULL CHECK (points > 0)
      );

      CREATE TABLE IF NOT EXISTS choices (
        id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
        statement TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL
      );

      CREATE TABLE IF NOT EXISTS attempts (
        id SERIAL PRIMARY KEY,
        exam_id INTEGER REFERENCES exams(id) ON DELETE RESTRICT,
        student_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
        score NUMERIC(5, 2) NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_student_exam_attempt UNIQUE (exam_id, student_id)
      );

      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        attempt_id INTEGER REFERENCES attempts(id) ON DELETE CASCADE,
        question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
        choice_id INTEGER REFERENCES choices(id) ON DELETE CASCADE
      );
    `);
    console.log('Database tables initialized successfully.');
  } finally {
    client.release();
  }
};