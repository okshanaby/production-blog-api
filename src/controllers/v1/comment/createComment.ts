import Blog from "@/models/v1/blogModel";
import Comment, { CommentType } from "@/models/v1/commentModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

type CommentData = Pick<CommentType, "content">;

// ==================================================================================
// CREATE COMMENT CONTROLLER =======================================================
// ==================================================================================
const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const { blogPostId } = req.params;
  const { userId } = req;
  const { content } = req.body as CommentData;

  try {
    // check if blog post exists
    const blogPost = await Blog.findById(blogPostId).select("_id commentsCount").exec();

    if (!blogPost) {
      throw new ErrorHandler("Blog post not found", 404, "createComment", "NotFound");
    }

    // create comment
    const comment = await Comment.create({ userId, blogPostId, content });

    // update blog post comments count
    blogPost.commentsCount++;
    await blogPost.save();

    // RESPONSE ------------------------------------------------------------------
    res.status(201).json({
      success: true,
      status: "OK",
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export default createComment;
