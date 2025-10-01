import { verifyAccessToken } from "@/modules/authModule";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// Access the errors as properties of the imported 'jwt' object
const { JsonWebTokenError, TokenExpiredError } = jwt;

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ErrorHandler("Access token is required", 401, "authenticate", "Unauthorized");
  }

  try {
    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      throw new ErrorHandler("Access token is required", 401, "authenticate", "Unauthorized");
    }

    // verify token
    const decodedPayload = verifyAccessToken(accessToken) as { userId: Types.ObjectId };

    // add user to request
    req.userId = decodedPayload.userId;

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new ErrorHandler("Access token expired, Please login again", 401, "authenticate", "AuthenticationError");
    }

    if (error instanceof JsonWebTokenError) {
      throw new ErrorHandler(
        "Access token is invalid, Please login again",
        401,
        "authenticate",
        "AuthenticationError",
      );
    }

    next(error);
  }
};

export default authenticate;
