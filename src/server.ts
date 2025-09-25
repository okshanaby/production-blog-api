// Local Modules
import config from "@/config";
import expressRateLimiter from "@/lib/expressRateLimiter";

// Node Modules
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

const app = express();

/**
 * MIDDLEWARE ====================================================
 */

// Cors middleware
app.use(
  cors({
    origin: ["http://localhost:8080"], // Allow this frontend
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
    app.get("/", (_, res) => {
      res.json({ message: "Hello World" });
    });

    // Server listening
    app.listen(config.port, () => {
      console.log(`Server is running on port http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Error starting server", error);

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();
