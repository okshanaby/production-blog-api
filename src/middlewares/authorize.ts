import User from "@/models/v1/userModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req;

    try {
      // find user by id
      const user = await User.findById(userId).select("role").exec();

      // check if user exists
      if (!user) {
        throw new ErrorHandler("User not found", 404, "authorize", "NotFound");
      }

      // check if user has the required role
      if (!roles.includes(user.role)) {
        throw new ErrorHandler("Access denied, User not authorized", 403, "authorize", "Forbidden");
      }

      // authorize user
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorize;
