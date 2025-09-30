import config from "@/config";
import { AUTH_CONSTANTS } from "@/constants";
import { parseUserAgent } from "@/helpers/authHelpers";
import logger from "@/lib/winston";
import sessionModel from "@/models/v1/sessionModel";
import userModel, { UserType } from "@/models/v1/userModel";
import { comparePassword, generateAccessToken, generateRefreshToken } from "@/modules/authModule";
import type { Request, Response } from "express";

// Types ---------------------------------------------------------------
type UserData = Pick<UserType, "email" | "password">;

// =========================================================================
// LOGIN CONTROLLER ========================================================
// =========================================================================
const login = async (req: Request, res: Response) => {
  // Get the body
  const { email, password } = req.body as UserData;

  try {
    // check user if exists
    const user = await userModel.findOne({ email }).select("username email role password").lean().exec();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        status: "ERROR",
        code: "NotFound",
      });
    }

    // compare password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
        status: "ERROR",
        code: "InvalidCredentials",
      });
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
    logger.error("Error logging in user", error);

    res.status(500).json({
      message: "Login failed",
      success: false,
      status: "ERROR",
      code: "InternalServerError",
    });
  }
};

export default login;
