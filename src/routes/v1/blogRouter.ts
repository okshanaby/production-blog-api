import { Router } from "express";

// Controller ------------------------------------------------------------------
import createBlog from "@/controllers/v1/blog/createBlog";
import getAllBlogs from "@/controllers/v1/blog/getAllBlogs";

// Middleware ------------------------------------------------------------------
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { inputValidator } from "@/middlewares/inputValidator";
import { queryParamsValidator } from "@/middlewares/queryParamsValidator";
import uploadBlogBanner, { upload } from "@/middlewares/uploadBlogBanner";

// Validation ------------------------------------------------------------------
import { createBlogSchema } from "@/validations/blogValidations";
import { getAllContentSchema } from "@/validations/userValidations";

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

export default blogRouter;
