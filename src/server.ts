// Local Modules
import config from "@/config";
import expressRateLimiter from "@/lib/expressRateLimiter";

// Node Modules
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { connectToDatabase, disconnectFromDatabase } from "./lib/mongoose";
import logger from "./lib/winston";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import apiV1Router from "./routes/v1";

const app = express();

/**
 * MIDDLEWARE ====================================================
 */

// Cors middleware
app.use(
  cors({
    origin: [config.FRONTEND_URL], // Allow this frontend
    credentials: true, // Allow cookies
  }),
);

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (form data)
app.use(cookieParser()); // Let express parse/read cookies
app.use(helmet()); // Secure HTTP headers
// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, // only compress responses larger than 1KB
  }),
);

// Rate limiter middleware
app.use(expressRateLimiter);

/**
 * START SERVER ====================================================
 */

(async () => {
  try {
    await connectToDatabase();

    app.use("/api/v1", apiV1Router);

    // Error handler LAST (catches anything thrown above)
    app.use(globalErrorHandler); // middleware for handling errors

    // Server listening
    app.listen(config.PORT, () => {
      logger.info(`Server is running on port http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server", error);

    if (process.env.NODE_ENV === "production") {
      process.exit(1); // Exit the process if in production or trigger restart
    }
  }
})();

// Handle server shutdown: cleanup operations before exiting
// like closing database connections, releasing resources, etc.
const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn("Server is shutting down...");
    process.exit(0);
  } catch (error) {
    logger.error("Error shutting down server", error);
  }
};

// listen for termination signals and gracefully shutdown the server
// SIGINT triggered when user interrupts the process (e.g. Ctrl+C)
// SIGTERM triggered when the process is terminated by the system (e.g. kill command)
process.on("SIGINT", handleServerShutdown);
process.on("SIGTERM", handleServerShutdown);
