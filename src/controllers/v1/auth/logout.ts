import Session from "@/models/v1/sessionModel";
import { NextFunction, Request, Response } from "express";

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (refreshToken) {
      // Single operation: delete the current session
      await Session.deleteOne({ token: refreshToken });
    }

    // clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // send response
    res.json({
      message: "Logout successful",
      success: true,
      status: "OK",
      code: "OK",
    });
  } catch (error) {
    next(error);
  }
};

export default logout;
