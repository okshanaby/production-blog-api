import Blog, { BlogType } from "@/models/v1/blogModel";
import User from "@/models/v1/userModel";
import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

// Types ---------------------------------------------------------------------
type UpdateBlogPostData = Partial<Pick<BlogType, "title" | "content" | "isPublished" | "banner">>;

// ==================================================================================
// UPDATE BLOG POST CONTROLLER =================================================
// ==================================================================================
const updateBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  const { blogPostId } = req.params;
  const { userId } = req;

  const { title, content, isPublished, banner } = req.body as UpdateBlogPostData;

  try {
    // // get user role
    // const user = await User.findById(userId).select("role").lean().exec();

    // if (user?.role === "user") {
    //   throw new ErrorHandler("You don't have permission to update this blog post", 403, "updateBlogPost", "Forbidden");
    // } - removed this because we are using authorize middleware, for admin only

    // get blog post
    const blogPost = await Blog.findById(blogPostId).select("-banner.publicId -__v").exec();

    // check if blog post exists
    if (!blogPost) {
      throw new ErrorHandler("Blog post not found", 404, "updateBlogPost", "NotFound");
    }

    if (blogPost.author.toString() !== userId?.toString()) {
      throw new ErrorHandler("You don't have permission to update this blog post", 403, "updateBlogPost", "Forbidden");
    }

    if (title) blogPost.title = title;
    if (content) blogPost.content = content;
    if (typeof isPublished !== "undefined") blogPost.isPublished = isPublished;
    if (banner) blogPost.banner = banner;

    await blogPost.save();

    // RESPONSE ------------------------------------------------------------------
    res.json({
      success: true,
      status: "OK",
      message: "Blog post updated successfully",
      data: blogPost,
    });
  } catch (error) {
    next(error);
  }
};

export default updateBlogPost;
