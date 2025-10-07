import Blog, { BlogType } from "@/models/v1/blogModel";
import { NextFunction, Request, Response } from "express";

// Types ---------------------------------------------------------------------
type BlogData = Pick<BlogType, "title" | "content" | "banner" | "isPublished">;

// =========================================================================
// CREATE BLOG CONTROLLER ==================================================
// =========================================================================
const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { title, content, banner, isPublished } = req.body as BlogData;
  const author = req.userId;

  try {
    const blog = await Blog.create({ title, content, author, banner, isPublished, slug: title });

    res.status(201).json({
      message: "Blog created successfully",
      success: true,
      status: "CREATED",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

export default createBlog;
