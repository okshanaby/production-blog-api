import createComment from "@/controllers/v1/comment/createComment";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { inputValidator } from "@/middlewares/inputValidator";
import { routeParamsValidator } from "@/middlewares/routeParamsValidator";
import { getBlogPostByIdSchema } from "@/validations/blogValidations";
import { createCommentSchema } from "@/validations/commentValidations";
import { Router } from "express";

const commentRouter = Router();

commentRouter.post(
  "/blog/:blogPostId",
  authenticate,
  authorize(["admin", "user"]),
  routeParamsValidator(getBlogPostByIdSchema),
  inputValidator(createCommentSchema),
  createComment,
);

export default commentRouter;
