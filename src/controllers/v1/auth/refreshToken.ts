import config from "@/config";
import { AUTH_CONSTANTS } from "@/constants";
import Session from "@/models/v1/sessionModel";
import { generateAccessToken, verifyRefreshToken } from "@/modules/authModule";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";

// Access the errors as properties of the imported 'jwt' object
const { JsonWebTokenError, TokenExpiredError } = jwt; 

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ErrorHandler("Refresh token is required", 401, "refreshToken", "Unauthorized");
  }

  try {
    // check if token exists in db
    const token = await Session.exists({ token: refreshToken }); // returns only _id or null

    if (!token) {
      throw new ErrorHandler("Refresh token is invalid", 401, "refreshToken", "AuthenticationError");
    }

    // verify refresh token
    const decodedPayload = verifyRefreshToken(refreshToken) as { userId: Types.ObjectId };

    // generate new access token
    const accessToken = generateAccessToken(decodedPayload.userId);

    // set cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "strict",
      maxAge: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_MS,
    });

    // send response
    res.json({
      message: "New access token generated successfully",
      success: true,
      status: "OK",
      code: "OK",
      accessToken,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new ErrorHandler("Refresh token expired, Please login again", 401, "refreshToken", "AuthenticationError");
    }

    if (error instanceof JsonWebTokenError) {
      throw new ErrorHandler(
        "Refresh token is invalid, Please login again",
        401,
        "refreshToken",
        "AuthenticationError",
      );
    }

    next(error);
  }
};

export default refreshToken;
