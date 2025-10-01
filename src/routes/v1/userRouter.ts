import getUser from "@/controllers/v1/user/getUser";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/profile", authenticate, authorize(["admin", "user"]), getUser);

export default userRouter;
