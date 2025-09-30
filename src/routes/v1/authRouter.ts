import login from "@/controllers/v1/auth/login";
import register from "@/controllers/v1/auth/register";
import { inputValidator } from "@/middlewares";
import { loginSchema, registerSchema } from "@/validations/authValidations";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", inputValidator(registerSchema), register);
authRouter.post("/login", inputValidator(loginSchema), login);

export default authRouter;
