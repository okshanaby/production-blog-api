import Blog from "@/models/v1/blogModel";
import User from "@/models/v1/userModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

// ==================================================================================
// GET BLOG POST BY ID CONTROLLER =================================================
// ==================================================================================
const getBlogPostById = async (req: Request, res: Response, next: NextFunction) => {
  const { blogPostId } = req.params;
  const { userId } = req;

  try {
    // get user role
    const user = await User.findById(userId).select("role").lean().exec();

    // get blog post
    const blogPost = await Blog.findById(blogPostId)
      .select("-banner.publicId -__v")
      .populate("author", "-createdAt -updatedAt -__v")
      .lean()
      .exec();

    // check if blog post exists
    if (!blogPost) {
      throw new ErrorHandler("Blog post not found", 404, "getBlogPostById", "NotFound");
    }

    // check if user can view this blog post
    if (user?.role === "user" && !blogPost.isPublished) {
      throw new ErrorHandler("You don't have permission to view this blog post", 403, "getBlogPostById", "Forbidden");
    }

    // check if blog post is published
    if (blogPost.isPublished && blogPost.author.toString() !== userId?.toString() && user?.role === "user") {
      // can implement a non duplicate views count using redis
      // update views count
      await Blog.findByIdAndUpdate(blogPostId, { $inc: { viewsCount: 1 } }, { new: true })
        .lean()
        .exec();
    }

    // send response ------------------------------------------------------------------
    res.json({
      success: true,
      status: "OK",
      message: "Blog post fetched successfully",
      data: blogPost,
    });
  } catch (error) {
    next(error);
  }
};

export default getBlogPostById;
