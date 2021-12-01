import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  app: {
    port: process.env.APP_PORT || 3000,
  },
  db: {
    connection: process.env.DB_CONNECTION,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },

  jwtSecret: process.env.JWT_SECRET || '',
};

export default config;
