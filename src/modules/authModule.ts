// Node Modules ------------------------------------------------------------
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Local Modules
import config from "@/config";
import { AUTH_CONSTANTS } from "@/constants";

// Types ---------------------------------------------------------------
import { Types } from "mongoose";

// =========================================================================
// FUNCTIONS ==============================================================
// =========================================================================
// Hash Password
export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hash(password, salt);
};

// Compare Password
export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate Access Token
export const generateAccessToken = (userId: Types.ObjectId) => {
  if (!config.JWT_ACCESS_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const accessToken = jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
    subject: "accessToken",
  });

  return accessToken;
};

// Generate Refresh Token
export const generateRefreshToken = (userId: Types.ObjectId) => {
  if (!config.JWT_REFRESH_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const refreshToken = jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN,
    subject: "refreshToken",
  });

  return refreshToken;
};
