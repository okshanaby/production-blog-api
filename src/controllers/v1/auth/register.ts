// Node Modules -------------------------------------------------------
import type { NextFunction, Request, Response } from "express";

// Local Modules -------------------------------------------------------
import config from "@/config";
import { AUTH_CONSTANTS } from "@/constants";
import { generateUsername, parseUserAgent } from "@/helpers/authHelpers";
import logger from "@/lib/winston";
import Session from "@/models/v1/sessionModel";
import User, { UserType } from "@/models/v1/userModel";
import { generateAccessToken, generateRefreshToken } from "@/modules/authModule";
import ErrorHandler from "@/utils/errorHandler";

// Types ---------------------------------------------------------------
type UserData = Pick<UserType, "email" | "password" | "role" | "username">;

// =========================================================================
// REGISTER CONTROLLER =====================================================
// =========================================================================
const register = async (req: Request, res: Response, next: NextFunction) => {
  // Get the body
  const { email, password, role, username } = req.body as UserData;

  // check admin role if email is whitelisted
  if (role === "admin" && !config.WHITELISTED_ADMIN_EMAILS.includes(email)) {
    logger.warn(`User ${email} tried to register as an admin but is not whitelisted`);

    throw new ErrorHandler("You cannot register as an admin", 403, "register", "AuthorizationError");
  }

  try {
    // check user if exists
    const user = await User.findOne({ email }).lean().exec();

    if (user) {
      throw new ErrorHandler("User already exists", 400, "register", "BadRequest");
    }

    // generate username
    const generatedUsername = username || generateUsername();

    // hash password on pre save hook

    // create user
    const newUser = await User.create({ email, password, role, username: generatedUsername });

    // generate tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // store refresh token in db
    await Session.create({
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
    next(error);
  }
};
 
export default register;
