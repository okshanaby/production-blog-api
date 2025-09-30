import config from "@/config";
import { AUTH_CONSTANTS } from "@/constants";
import { parseUserAgent } from "@/helpers/authHelpers";
import sessionModel from "@/models/v1/sessionModel";
import userModel, { UserType } from "@/models/v1/userModel";
import { comparePassword, generateAccessToken, generateRefreshToken } from "@/modules/authModule";
import ErrorHandler from "@/utils/errorHandler";
import type { NextFunction, Request, Response } from "express";

// Types ---------------------------------------------------------------
type UserData = Pick<UserType, "email" | "password">;

// =========================================================================
// LOGIN CONTROLLER ========================================================
// =========================================================================
const login = async (req: Request, res: Response, next: NextFunction) => {
  // Get the body
  const { email, password } = req.body as UserData;

  try {
    // check user if exists
    const user = await userModel.findOne({ email }).select("username email role password").lean().exec();

    if (!user) {
      throw new ErrorHandler("User not found", 404, "login", "NotFound");
    }

    // compare password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new ErrorHandler("Invalid credentials", 401, "login", "InvalidCredentials");
    }

    // generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // store refresh token in db
    await sessionModel.create({
      userId: user._id,
      token: refreshToken,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      device: parseUserAgent(req.get("User-Agent")),
    });

    // set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "strict",
      maxAge: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_MS,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "strict",
      maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_MS,
    });

    // send response ========================================================
    res.status(200).json({
      message: "Login successful",
      success: true,
      status: "SUCCESS",
      code: "OK",
      data: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
    // Catch Error -------------------------------------------------------------
  } catch (error) {
    next(error);
  }
};

export default login;
