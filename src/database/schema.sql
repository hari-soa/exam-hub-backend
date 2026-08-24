CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'student')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exams (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    course_id VARCHAR(36) NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    exam_id VARCHAR(36) NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    points INT NOT NULL CHECK (points > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE choices (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    question_id VARCHAR(36) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exam_attempts (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    exam_id VARCHAR(36) NOT NULL REFERENCES exams(id) ON DELETE RESTRICT,
    student_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    score INT NOT NULL DEFAULT 0,
    total_points INT NOT NULL DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_exam_attempt UNIQUE (exam_id, student_id)
);

CREATE TABLE attempt_answers (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    attempt_id VARCHAR(36) NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id VARCHAR(36) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    choice_id VARCHAR(36) REFERENCES choices(id) ON DELETE SET NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);