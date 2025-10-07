import Blog from "@/models/v1/blogModel";
import Comment from "@/models/v1/commentModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

// ==================================================================================
// GET BLOG COMMENTS CONTROLLER ===================================================
// ==================================================================================
const getBlogComments = async (req: Request, res: Response, next: NextFunction) => {
  const { blogPostId } = req.params;

  try {
    // check if blog post exists
    const blogPost = await Blog.findById(blogPostId).select("+commentsCount").lean().exec();

    if (!blogPost) {
      throw new ErrorHandler("Blog post not found", 404, "getBlogComments", "NotFound");
    }

    // get comments
    const comments = await Comment.find({ blogPostId })
      .sort({ createdAt: -1 })
      .select("-__v")
      .populate("userId", "_id username")
      .lean()
      .exec();

    // Rename userId to user in the response
    const commentsWithUser = comments.map((comment) => ({
      ...comment,
      user: comment.userId,
      userId: undefined,
    }));

    // RESPONSE ------------------------------------------------------------------
    res.status(200).json({
      success: true,
      status: "OK",
      message: "Comments fetched successfully",
      data: commentsWithUser,
    });
  } catch (error) {
    next(error);
  }
};
export default getBlogComments;
