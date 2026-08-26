declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      CLIENT_URL?: string;
      DB_HOST?: string;
      DB_PORT?: string;
      DB_USER?: string;
      DB_PASSWORD?: string;
      DB_NAME?: string;
      ADMIN_EMAIL?: string;
      ADMIN_PASSWORD?: string;
      ADMIN_NAME?: string;
      JWT_SECRET?: string;
      JWT_EXPIRES_IN?: string;
    }
  }
}

export {};
