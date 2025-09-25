import config from "@/config";
import winston from "winston";

const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;

// define transports array to hold different logging targets
const transports: winston.transport[] = [];

// if development mode, add console transport
if (config.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        // align(),
        printf((info) => {
          const { timestamp, level, message, ...meta } = info;
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : "";

          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        }),
      ),
    }),
  );
}

// create a logger instance
const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: config.NODE_ENV === "test",
});

export default logger;
