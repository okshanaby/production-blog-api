// Node Modules -------------------------------------------------------
import type { Request, Response } from "express";

// Local Modules -------------------------------------------------------
import config from "@/config";
import { AUTH_CONSTANTS } from "@/constants";
import { generateUsername, parseUserAgent } from "@/helpers/authHelpers";
import logger from "@/lib/winston";
import sessionModel from "@/models/v1/sessionModel";
import userModel, { UserType } from "@/models/v1/userModel";
import { generateAccessToken, generateRefreshToken } from "@/modules/authModule";

// Types ---------------------------------------------------------------
type UserData = Pick<UserType, "email" | "password" | "role">;

// =========================================================================
// REGISTER CONTROLLER =====================================================
// =========================================================================
export const register = async (req: Request, res: Response) => {
  // TODO: Validate on middleware first

  // Get the body
  const { email, password, role } = req.body as UserData;

  // check admin role if email is whitelisted
  if (role === "admin" && !config.WHITELISTED_ADMIN_EMAILS.includes(email)) {
    logger.warn(`User ${email} tried to register as an admin but is not whitelisted`);

    return res.status(403).json({
      message: "You cannot register as an admin",
      success: false,
      status: "ERROR",
      code: "AuthorizationError",
    });
  }

  try {
    // check user if exists
    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
        status: "ERROR",
        code: "BadRequest",
      });
    }

    // generate username
    const username = generateUsername();

    // hash password on pre save hook

    // create user
    const newUser = await userModel.create({ email, password, role, username });

    // generate tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // store refresh token in db
    await sessionModel.create({
      userId: newUser._id,
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
    res.status(201).json({
      message: "New user registered successfully",
      success: true,
      status: "OK",
      data: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
  } catch (error) {
    logger.error("Error registering user", error);

    res.status(500).json({
      message: "Register failed",
      success: false,
      status: "ERROR",
      code: "InternalServerError",
    });
  }
};
