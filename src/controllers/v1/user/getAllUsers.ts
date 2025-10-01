import { PAGINATION_CONSTANTS } from "@/constants";
import User from "@/models/v1/userModel";
import { NextFunction, Request, Response } from "express";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const limit = req.query.limit as string;
  const offset = req.query.offset as string;

  const query = {
    limit: parseInt(limit) || PAGINATION_CONSTANTS.DEFAULT_LIMIT,
    offset: parseInt(offset) || PAGINATION_CONSTANTS.DEFAULT_OFFSET,
  };

  try {
    const total = await User.countDocuments().lean().exec();
    const users = await User.find().select("-__v").limit(query.limit).skip(query.offset).lean().exec();

    res.json({
      success: true,
      status: "OK",
      message: "Users fetched successfully",
      data: {
        users,
        total,
        limit: query.limit,
        offset: query.offset,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getAllUsers;
