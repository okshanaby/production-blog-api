import { Router } from "express";

// Controller ------------------------------------------------------------------
import createBlog from "@/controllers/v1/blog/createBlog";

// Middleware ------------------------------------------------------------------
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { inputValidator } from "@/middlewares/inputValidator";
import uploadBlogBanner, { upload } from "@/middlewares/uploadBlogBanner";

// Validation ------------------------------------------------------------------
import { createBlogSchema } from "@/validations/blogValidations";

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

export default blogRouter;
