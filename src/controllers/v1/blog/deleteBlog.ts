import { deleteFromCloudinary } from "@/lib/cloudinary";
import Blog from "@/models/v1/blogModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

// ==================================================================================
// DELETE BLOG POST CONTROLLER =================================================
// ==================================================================================
const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogPostId } = req.params;
  const { userId } = req;

  try {
    // get blog post
    const blogPost = await Blog.findById(blogPostId).exec();

    if (!blogPost) {
      throw new ErrorHandler("Blog post not found", 404, "deleteBlog", "NotFound");
    }

    // check if user has permission to delete this blog post
    if (blogPost.author.toString() !== userId?.toString()) {
      throw new ErrorHandler("You don't have permission to delete this blog post", 403, "deleteBlog", "Forbidden");
    }

    // delete banner from cloudinary
    await deleteFromCloudinary(blogPost.banner.publicId);

    // delete blog post from db
    await blogPost.deleteOne();

    // RESPONSE ------------------------------------------------------------------
    res.json({
      success: true,
      status: "OK",
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default deleteBlog;
