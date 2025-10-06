import { PAGINATION_CONSTANTS } from "@/constants";
import Blog from "@/models/v1/blogModel";
import User from "@/models/v1/userModel";
import { NextFunction, Request, Response } from "express";

// =====================================================================================
// GET ALL BLOGS CONTROLLER ==========================================================
// =====================================================================================
const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
  const limit = req.query.limit as string;
  const offset = req.query.offset as string;

  const { userId } = req;

  // get query
  const query = {
    limit: parseInt(limit) || PAGINATION_CONSTANTS.DEFAULT_LIMIT,
    offset: parseInt(offset) || PAGINATION_CONSTANTS.DEFAULT_OFFSET,
  };

  // get filter
  const filter = {
    isPublished: false,
  };

  try {
    // get user
    const user = await User.findById(userId).select("-__v").lean().exec();

    // show only published blogs to normal user
    if (user?.role === "user") {
      filter.isPublished = true;
    }

    // get total blogs
    const total = await Blog.countDocuments(filter).lean().exec();

    // get blogs
    const blogs = await Blog.find(filter)
      .select("-banner.publicId -__v")
      .populate("author", "-createdAt -updatedAt -__v")
      .limit(query.limit)
      .skip(query.offset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // RESPONSE ----------------------------------------------------------------------
    res.json({
      success: true,
      status: "OK",
      message: "Blogs fetched successfully",
      data: {
        blogs,
        total,
        limit: query.limit,
        offset: query.offset,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getAllBlogs;
