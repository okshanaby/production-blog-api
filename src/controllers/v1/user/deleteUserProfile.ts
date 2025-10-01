import User from "@/models/v1/userModel";
import { NextFunction, Request, Response } from "express";

const deleteUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;

  try {
    await User.deleteOne({ _id: userId }).lean().exec();

    res.json({
      success: true,
      status: "OK",
      message: "User profile deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default deleteUserProfile;
