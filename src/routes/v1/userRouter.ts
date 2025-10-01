import getUserProfile from "@/controllers/v1/user/getUserProfile";
import updateUserProfile from "@/controllers/v1/user/updateUserProfile";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { inputValidator } from "@/middlewares/inputValidator";
import { updateUserProfileSchema } from "@/validations/userValidations";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/profile", authenticate, authorize(["admin", "user"]), getUserProfile);
userRouter.put(
  "/profile",
  authenticate,
  authorize(["admin", "user"]),
  inputValidator(updateUserProfileSchema),
  updateUserProfile,
);

export default userRouter;
