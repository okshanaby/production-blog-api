import Blog from "@/models/v1/blogModel";
import Like from "@/models/v1/likeModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

// ==================================================================================
// UNLIKE BLOG POST CONTROLLER =================================================
// ==================================================================================
const unlikeBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  const { blogPostId } = req.params;
  const { userId } = req;

  try {
    // check if blog post exists
    const blogPost = await Blog.findById(blogPostId).select("+likesCount").exec();

    if (!blogPost) {
      throw new ErrorHandler("Blog post not found", 404, "unlikeBlogPost", "NotFound");
    }

    // check if user has liked this blog post
    const existingLike = await Like.findOne({ userId, blogPostId }).select("+id").exec();
    if (!existingLike) {
      throw new ErrorHandler("You have not liked this blog post", 400, "unlikeBlogPost", "BadRequest");
    }

    // delete like
    await existingLike.deleteOne();

    // update blog post likes count
    blogPost.likesCount--;
    await blogPost.save();

    // RESPONSE ------------------------------------------------------------------
    res.json({
      success: true,
      status: "OK",
      message: "Blog post unliked successfully",
      data: existingLike,
    });
  } catch (error) {
    next(error);
  }
};

export default unlikeBlogPost;
