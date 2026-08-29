CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS attempt_answers CASCADE;
DROP TABLE IF EXISTS attempts CASCADE;
DROP TABLE IF EXISTS choices CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'student')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT check_exam_dates CHECK (ends_at > starts_at)
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    points INTEGER DEFAULT 1 CHECK (points >= 1),
    position INTEGER DEFAULT 1
);

CREATE TABLE choices (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE attempts (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE RESTRICT,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    score INTEGER NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_exam UNIQUE (exam_id, student_id)
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    attempt_id INTEGER NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    choice_id INTEGER NOT NULL REFERENCES choices(id) ON DELETE CASCADE,
    CONSTRAINT unique_attempt_question UNIQUE (attempt_id, question_id)
);

INSERT INTO users (name, email, password, role, is_active)
VALUES 
    ('Administrateur', 'admin@examhub.local', crypt('admin123', gen_salt('bf', 10)), 'admin', true),
    ('Jean Dupont', 'jean.dupont@examhub.local', crypt('student123', gen_salt('bf', 10)), 'student', true),
    ('Marie Curie', 'marie.curie@examhub.local', crypt('student123', gen_salt('bf', 10)), 'student', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO courses (code, name, description) VALUES
    ('MATH101', 'Mathématiques Appliquées', 'Calcul matriciel, probabilités et algèbre linéaire'),
    ('DEV202', 'Développement Web Fullstack', 'Introduction à Node.js, Express, React et PostgreSQL'),
    ('SEC303', 'Sécurité Informatique', 'Notions fondamentales de cryptographie, JWT et sécurité des API')
ON CONFLICT (code) DO NOTHING;

INSERT INTO exams (course_id, title, description, starts_at, ends_at) VALUES
    ((SELECT id FROM courses WHERE code = 'MATH101'), 'Examen Final - Algèbre', 'Évaluation de fin de semestre sur les matrices', NOW() - INTERVAL '1 day', NOW() + INTERVAL '7 days'),
    ((SELECT id FROM courses WHERE code = 'DEV202'), 'Quiz Express - Node.js & REST API', 'Test rapide sur la création de serveurs Express', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '24 hours'),
    ((SELECT id FROM courses WHERE code = 'SEC303'), 'Évaluation Sécurité & JWT', 'QCM sur l authentification basée sur les jetons', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day');

INSERT INTO questions (exam_id, statement, points, position) VALUES
    ((SELECT id FROM exams WHERE title = 'Quiz Express - Node.js & REST API'), 'Quel statut HTTP signale une erreur d authentification (Non autorisé) ?', 2, 1),
    ((SELECT id FROM exams WHERE title = 'Quiz Express - Node.js & REST API'), 'Quelle méthode HTTP est utilisée pour mettre à jour une ressource existante ?', 2, 2);

INSERT INTO choices (question_id, text, is_correct) VALUES
    ((SELECT id FROM questions WHERE statement LIKE 'Quel statut HTTP%'), '200 OK', false),
    ((SELECT id FROM questions WHERE statement LIKE 'Quel statut HTTP%'), '401 Unauthorized', true),
    ((SELECT id FROM questions WHERE statement LIKE 'Quel statut HTTP%'), '404 Not Found', false),
    ((SELECT id FROM questions WHERE statement LIKE 'Quel statut HTTP%'), '500 Internal Server Error', false),
    ((SELECT id FROM questions WHERE statement LIKE 'Quelle méthode HTTP%'), 'GET', false),
    ((SELECT id FROM questions WHERE statement LIKE 'Quelle méthode HTTP%'), 'POST', false),
    ((SELECT id FROM questions WHERE statement LIKE 'Quelle méthode HTTP%'), 'PUT', true),
    ((SELECT id FROM questions WHERE statement LIKE 'Quelle méthode HTTP%'), 'DELETE', false);