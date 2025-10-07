import Blog from "@/models/v1/blogModel";
import Comment from "@/models/v1/commentModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

// ==================================================================================
// DELETE COMMENT CONTROLLER =======================================================
// ==================================================================================
const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  const { commentId } = req.params;
  const { userId } = req;

  try {
    // check if comment exists
    const comment = await Comment.findById(commentId).exec();

    if (!comment) {
      throw new ErrorHandler("Comment not found", 404, "deleteComment", "NotFound");
    }

    // check if user has permission to delete this comment
    if (comment.userId.toString() !== userId?.toString()) {
      throw new ErrorHandler("You don't have permission to delete this comment", 403, "deleteComment", "Forbidden");
    }

    // delete comment
    await comment.deleteOne();

    // update blog post comments count
    const blogPost = await Blog.findById(comment.blogPostId).select("+commentsCount").exec();

    if (!blogPost) {
      throw new ErrorHandler("Blog post not found", 404, "deleteComment", "NotFound");
    }

    blogPost.commentsCount--;
    await blogPost.save();

    // RESPONSE ------------------------------------------------------------------
    res.json({
      success: true,
      status: "OK",
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default deleteComment;
