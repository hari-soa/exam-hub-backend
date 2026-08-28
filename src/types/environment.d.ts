// src/types/environment.d.ts
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DB_HOST?: string;
      DB_PORT?: string;
      DB_USER?: string;
      DB_PASSWORD?: string;
      DB_NAME?: string;
      JWT_SECRET?: string;
      ADMIN_EMAIL?: string;
      ADMIN_PASSWORD?: string;
    }
  }
}