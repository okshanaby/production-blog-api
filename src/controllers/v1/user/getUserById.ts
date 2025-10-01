import User from "@/models/v1/userModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

// ============================================================================
// GET USER BY ID CONTROLLER ==================================================
// ============================================================================
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    // get user from db
    const user = await User.findById(userId).select("-__v").lean().exec();

    // check if user exists
    if (!user) {  
      throw new ErrorHandler("User not found", 404, "getUserById", "NotFound");
    }

    // send response
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

export default getUserById;
