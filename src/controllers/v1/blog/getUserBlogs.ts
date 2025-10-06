import { PAGINATION_CONSTANTS } from "@/constants";
import Blog from "@/models/v1/blogModel";
import User from "@/models/v1/userModel";
import { NextFunction, Request, Response } from "express";

// =========================================================================
// GET USER BLOGS CONTROLLER =================================================
// =========================================================================
const getUserBlogs = async (req: Request, res: Response, next: NextFunction) => {
  const limit = req.query.limit as string;
  const offset = req.query.offset as string;

  const { userId } = req.params;
  const { userId: currentUserId } = req;

  // get query
  const query = {
    limit: parseInt(limit) || PAGINATION_CONSTANTS.DEFAULT_LIMIT,
    offset: parseInt(offset) || PAGINATION_CONSTANTS.DEFAULT_OFFSET,
  };

  // get filter
  const filter = {
    author: userId,
    isPublished: false,
  };

  try {
    // get user role
    const user = await User.findById(currentUserId).select("role").lean().exec();

    // show only published blogs to normal user
    if (user?.role === "user") {
      filter.isPublished = true;
    }

    // get total user blogs
    const total = await Blog.countDocuments(filter).lean().exec();

    // get blogs
    const blogs = await Blog.find(filter)
      .select("-banner.publicId -__v")
      .limit(query.limit)
      .skip(query.offset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // RESPONSE ----------------------------------------------------------------------
    res.json({
      success: true,
      status: "OK",
      message: "User blogs fetched successfully",
      data: {
        total,
        limit: query.limit,
        offset: query.offset,
        blogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getUserBlogs;
