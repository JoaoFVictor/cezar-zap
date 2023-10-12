declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET_KEY: string;
        JWT_SECRET_TIME: string;
        DB_HOST: string;
        DB_PORT: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;
        DB_DATABASE: string;
    }
  }
