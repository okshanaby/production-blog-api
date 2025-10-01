import User from "@/models/v1/userModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId).select("-__v").lean().exec();

    if (!user) {
      throw new ErrorHandler("User not found", 404, "getUser", "NotFound");
    }

    res.json({
      success: true,
      status: "OK",
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export default getUser;
