// Enhanced validation schema
import { sanitizeString } from "@/helpers/validationHelpers";
import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email").max(50, { message: "Email must be less than 50 characters" }).toLowerCase().trim(),

  password: z
    .string()
    .min(8, { error: "Password must be greater than 8 characters" })
    .max(30, { error: "Password must be less than 30 characters" })
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^a-zA-Z0-9]/, "Must contain special character"),

  username: z
    .string()
    .min(3, { error: "Username must be greater than 3 characters" })
    .max(20, { error: "Username must be less than 20 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, "Only alphanumeric, underscore, and hyphen allowed")
    .transform(sanitizeString)
    .optional(),

  role: z.enum(["admin", "user"]).optional(),
});

export const loginSchema = z.object({
  email: z.email("Invalid email").max(50, { error: "Email must be less than 50 characters" }).toLowerCase().trim(),
  password: z
    .string("Password is required")
    .min(8, { error: "Password must be greater than 8 characters" })
    .max(30, { error: "Password must be less than 30 characters" }),
});
