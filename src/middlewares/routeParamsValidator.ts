import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const routeParamsValidator =
  (handlerSchema: z.ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
    const results = handlerSchema.safeParse(req.params);

    if (!results.success) {
      const formattedErrors = results.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));

      throw new ErrorHandler(
        "Route params validation failed",
        400,
        "routeParamsValidator",
        "RouteParamsValidationError",
        formattedErrors,
      );
    }

    next();
  };
