import { register } from "@/controllers/v1/authController";
import { inputValidator } from "@/middlewares";
import { registerSchema } from "@/validations/authValidations";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", inputValidator(registerSchema), register);

export default authRouter;
