import { register } from "@/controllers/v1/authController";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", register);

export default authRouter;
