// Controller ------------------------------------------------------------------
import deleteUserProfile from "@/controllers/v1/user/deleteUserProfile";
import getAllUsers from "@/controllers/v1/user/getAllUsers";
import getUserById from "@/controllers/v1/user/getUserById";
import getUserProfile from "@/controllers/v1/user/getUserProfile";
import updateUserProfile from "@/controllers/v1/user/updateUserProfile";

// Middleware ------------------------------------------------------------------
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { inputValidator } from "@/middlewares/inputValidator";
import { queryParamsValidator } from "@/middlewares/queryParamsValidator";
import { routeParamsValidator } from "@/middlewares/routeParamsValidator";

// Validation ------------------------------------------------------------------
import { getAllUsersSchema, getUserByIdSchema, updateUserProfileSchema } from "@/validations/userValidations";

// Router ------------------------------------------------------------------
import { Router } from "express";

const userRouter = Router();

// USER ROUTES =============================================================
userRouter.get("/profile", authenticate, authorize(["admin", "user"]), getUserProfile);
userRouter.put(
  "/profile",
  authenticate,
  authorize(["admin", "user"]),
  inputValidator(updateUserProfileSchema),
  updateUserProfile,
);
userRouter.delete("/profile", authenticate, authorize(["admin", "user"]), deleteUserProfile);

// ADMIN ROUTES =============================================================
userRouter.get("/", authenticate, authorize(["admin"]), queryParamsValidator(getAllUsersSchema), getAllUsers);
userRouter.get("/:id", authenticate, authorize(["admin"]), routeParamsValidator(getUserByIdSchema), getUserById);

export default userRouter;
