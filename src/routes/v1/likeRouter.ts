import likeBlogPost from "@/controllers/v1/like/likeBlogPost";
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

export default likeRouter;
