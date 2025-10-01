import User from "@/models/v1/userModel";
import { NextFunction, Request, Response } from "express";

// ============================================================================
// DELETE USER BY ID CONTROLLER ==================================================
// ============================================================================
const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    // delete user from db
    await User.deleteOne({ _id: userId }).lean().exec();

    // send response
    res.json({
      success: true,
      status: "OK",
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default deleteUserById;
