import deleteUserProfile from "@/controllers/v1/user/deleteUserProfile";
import getAllUsers from "@/controllers/v1/user/getAllUsers";
import getUserProfile from "@/controllers/v1/user/getUserProfile";
import updateUserProfile from "@/controllers/v1/user/updateUserProfile";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { inputValidator } from "@/middlewares/inputValidator";
import { queryParamsValidator } from "@/middlewares/queryParamsValidator";
import { getAllUsersSchema, updateUserProfileSchema } from "@/validations/userValidations";
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
userRouter.delete("/profile", authenticate, authorize(["admin", "user"]), deleteUserProfile);
userRouter.get("/", authenticate, authorize(["admin"]), queryParamsValidator(getAllUsersSchema), getAllUsers);

export default userRouter;
