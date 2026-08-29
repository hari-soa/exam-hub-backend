# Exam Hub — Backend API

A RESTful backend API built with **Node.js**, **Express**, and **TypeScript**, using **PostgreSQL** as the primary database. This backend powers the Exam Hub web application, providing automated grading, exam window management, and strict rule enforcement for multiple-choice exams.

---

## Features & Business Rules Enforcement

- **Role-Based Access Control (RBAC):** Distinct roles for `ADMIN` and `STUDENT` using JWT authentication.
- **Server-Side Grading:** Answers and correct option flags are strictly isolated on the server. Grades are calculated server-side based only on submitted choice IDs.
- **Single Attempt Guarantee:** Enforced by both a database `UNIQUE` constraint on `(user_id, exam_id)` and server-side validation.
- **Exam Availability Window:** Exams can only be fetched or submitted within their active start/end timestamps.
- **Immutability Protection:** Questions and options become locked once an exam has at least one attempt. Courses with active exams or exams with submissions cannot be deleted.
- **Soft Delete for Students:** Student accounts are deactivated rather than deleted. Deactivated accounts receive an explicit `403 Forbidden` response upon login.
- **Standardized Error Handling:** Uniform JSON response structure `{ "message": "..." }` paired with standard HTTP status codes (`400`, `401`, `403`, `404`, `409`).

---

## Tech Stack

- **Runtime & Language:** Node.js, TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (running in Docker)
- **Database Client:** `pg` (Raw SQL queries with parameterized inputs — No ORM used)
- **Authentication & Security:** `jsonwebtoken` (JWT), `bcrypt`
- **Containerization:** Docker & Docker Compose

---

## Architecture

The project follows a strict multi-tiered architecture to ensure separation of concerns:

```text
src/
├── controllers/    # Handles HTTP requests, extracts parameters, sends responses
├── services/       # Implements business rules, validation, and core logic
├── repositories/   # Direct database interactions using parameterized raw SQL queries
├── models/         # TypeScript interfaces and type definitions
├── security/       # JWT authentication and authorization middlewares
├── config/         # Database connection pool and environment variables
└── db/             # Database initialization and seed scripts
```
## Prerequisites
Ensure you have the following installed on your local machine:
- Node.js (v18 or higher)
- npm

Getting Started
1. Clone the Repository

```bash
git clone https://github.com/hari-soa/exam-hub-backend.git
cd exam-hub-backend
```

2. Configure Environment Variables
Copy the provided `.env.example` file to create your own `.env` configuration file:

```bash
cp .env.example .env
```

Adjust the values inside `.env` if necessary:

```text
PORT=5000
NODE_ENV=development

# Database Settings
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=exam_hub

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
```

3. Install Dependencies

```bash
npm install
```

4. Initialize the Database & Seed Data
Run the database migration and seed script (enforces RG-01 by creating the initial admin account):

```bash
npm run db:seed
```

5. Run the Application
Development Mode (with hot-reloading)

```bash
npm run dev
```

The server will start listening at `http://localhost:3000`.
