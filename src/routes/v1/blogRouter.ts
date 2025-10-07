import { Router } from "express";

// Controller ------------------------------------------------------------------
import createBlog from "@/controllers/v1/blog/createBlog";
import getAllBlogs from "@/controllers/v1/blog/getAllBlogs";
import getBlogPostById from "@/controllers/v1/blog/getBlogPostById";
import getUserBlogs from "@/controllers/v1/blog/getUserBlogs";

// Middleware ------------------------------------------------------------------
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { inputValidator } from "@/middlewares/inputValidator";
import { queryParamsValidator } from "@/middlewares/queryParamsValidator";
import { routeParamsValidator } from "@/middlewares/routeParamsValidator";
import uploadBlogBanner, { upload } from "@/middlewares/uploadBlogBanner";

// Validation ------------------------------------------------------------------
import updateBlogPost from "@/controllers/v1/blog/updateBlogPost";
import { createBlogSchema, getBlogPostByIdSchema, updateBlogSchema } from "@/validations/blogValidations";
import { getAllContentSchema, getContentByIdSchema } from "@/validations/userValidations";
import deleteBlog from "@/controllers/v1/blog/deleteBlog";

const blogRouter = Router();

// Routes ------------------------------------------------------------------
blogRouter.post(
  "/create",
  authenticate,
  authorize(["admin"]),
  upload.single("banner_image"),
  inputValidator(createBlogSchema),
  uploadBlogBanner("post"),
  createBlog,
);

blogRouter.get("/", authenticate, authorize(["admin", "user"]), queryParamsValidator(getAllContentSchema), getAllBlogs);

blogRouter.get(
  "/user/:userId",
  authenticate,
  authorize(["admin", "user"]),
  queryParamsValidator(getAllContentSchema),
  routeParamsValidator(getContentByIdSchema),
  getUserBlogs,
);

blogRouter.get(
  "/:blogPostId",
  authenticate,
  authorize(["admin", "user"]),
  routeParamsValidator(getBlogPostByIdSchema),
  getBlogPostById,
);

blogRouter.put(
  "/:blogPostId",
  authenticate,
  authorize(["admin"]),
  routeParamsValidator(getBlogPostByIdSchema),
  upload.single("banner_image"),
  inputValidator(updateBlogSchema),
  uploadBlogBanner("put"),
  updateBlogPost,
);

blogRouter.delete(
  "/:blogPostId",
  authenticate,
  authorize(["admin"]),
  routeParamsValidator(getBlogPostByIdSchema),
  deleteBlog,
);

export default blogRouter;
