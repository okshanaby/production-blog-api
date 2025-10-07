import createComment from "@/controllers/v1/comment/createComment";
import deleteComment from "@/controllers/v1/comment/deleteComment";
import getBlogComments from "@/controllers/v1/comment/getBlogComments";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { inputValidator } from "@/middlewares/inputValidator";
import { routeParamsValidator } from "@/middlewares/routeParamsValidator";
import { getBlogPostByIdSchema } from "@/validations/blogValidations";
import { createCommentSchema, getCommentByIdSchema } from "@/validations/commentValidations";
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

commentRouter.get(
  "/blog/:blogPostId",
  authenticate,
  authorize(["admin", "user"]),
  routeParamsValidator(getBlogPostByIdSchema),
  getBlogComments,
);

commentRouter.delete(
  "/blog/:commentId",
  authenticate,
  authorize(["admin"]),
  routeParamsValidator(getCommentByIdSchema),
  deleteComment,
);

export default commentRouter;
