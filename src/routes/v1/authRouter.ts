import login from "@/controllers/v1/auth/login";
import refreshToken from "@/controllers/v1/auth/refreshToken";
import register from "@/controllers/v1/auth/register";
import { inputValidator } from "@/middlewares/inputValidator";
import { loginSchema, registerSchema } from "@/validations/authValidations";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", inputValidator(registerSchema), register);
authRouter.post("/login", inputValidator(loginSchema), login);
authRouter.post("/refresh-token", refreshToken);

export default authRouter;
