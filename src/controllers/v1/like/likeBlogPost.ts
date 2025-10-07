import Blog from "@/models/v1/blogModel";
import Like from "@/models/v1/likeModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

// ==================================================================================
// LIKE BLOG POST CONTROLLER =================================================
// ==================================================================================
const likeBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  const { blogPostId } = req.params;
  const { userId } = req;

  try {
    // check if blog post exists
    const blogPost = await Blog.findById(blogPostId).select("+likesCount").exec();

    if (!blogPost) {
      throw new ErrorHandler("Blog post not found", 404, "likeBlogPost", "NotFound");
    }

    // check if user has already liked this blog post
    const existingLike = await Like.findOne({ userId, blogPostId }).select("+id").exec();
    if (existingLike) {
      throw new ErrorHandler("You have already liked this blog post", 400, "likeBlogPost", "BadRequest");
    }

    // create like
    const like = await Like.create({ userId, blogPostId })

    // update blog post likes count
    blogPost.likesCount++;
    await blogPost.save();

    // RESPONSE ------------------------------------------------------------------
    res.json({
      success: true,
      status: "OK",
      message: "Blog post liked successfully",
      data: like,
    });
  } catch (error) {
    next(error);
  }
};

export default likeBlogPost;
