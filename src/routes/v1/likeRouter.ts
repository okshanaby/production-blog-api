import likeBlogPost from "@/controllers/v1/like/likeBlogPost";
import unlikeBlogPost from "@/controllers/v1/like/unlikeBlogPost";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { routeParamsValidator } from "@/middlewares/routeParamsValidator";
import { getBlogPostByIdSchema } from "@/validations/blogValidations";
import { Router } from "express";

const likeRouter = Router();

likeRouter.post(
  "/blog/:blogPostId",
  authenticate,
  authorize(["admin", "user"]),
  routeParamsValidator(getBlogPostByIdSchema),
  likeBlogPost,
);

likeRouter.delete(
  "/blog/:blogPostId",
  authenticate,
  authorize(["admin", "user"]),
  routeParamsValidator(getBlogPostByIdSchema),
  unlikeBlogPost,
);

export default likeRouter;
