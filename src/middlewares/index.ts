import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const inputValidator =
  (handlerSchema: z.ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
    const results = handlerSchema.safeParse(req.body);

    if (!results.success) {
      const formattedErrors = results.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));

      res
        .status(400)
        .json({
          success: false,
          message: "Input validation failed",
          status: "ERROR",
          code: "InputValidationError",
          errors: formattedErrors,
        });
      return;
    }

    next();
  };
