import config from "@/config";
import logger from "@/lib/winston";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Sever Error";
  err.success = err.success || false;

  logger.error("💥 Error caught:", {
    message: err.message,
    from: err.from,
    statusCode: err.statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
    errors: err.errors,
  });

  res.status(err.statusCode).json({
    code: err.code,
    status: err.status,
    success: err.success,
    message: err.message,
    stack: config.NODE_ENV === "production" ? "🥞" : err.stack,
    errors: err.errors,
  });
};

export default globalErrorHandler;
