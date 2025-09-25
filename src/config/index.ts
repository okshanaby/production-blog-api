import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:8080",
  MONGO_DB_URI: process.env.MONGO_DB_URI,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || "blog-db",
  APP_NAME: process.env.APP_NAME,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};

export default config;
