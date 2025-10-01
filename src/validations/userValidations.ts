import { sanitizeString } from "@/helpers/validationHelpers";
import { z } from "zod";

export const updateUserProfileSchema = z.object({
  username: z
    .string()
    .min(3, { error: "Username must be greater than 3 characters" })
    .max(20, { error: "Username must be less than 20 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, "Only alphanumeric, underscore, and hyphen allowed")
    .transform(sanitizeString)
    .optional(),

  firstName: z.string().max(10, { error: "First name must be less than 10 characters" }).optional(),
  lastName: z.string().max(10, { error: "Last name must be less than 10 characters" }).optional(),
  profilePicture: z.url().max(100, { error: "Profile picture must be less than 100 characters" }).optional(),
  bio: z
    .string()
    .max(200, { error: "Bio must be less than 200 characters" })
    .optional()
    .transform((val) => (val ? sanitizeString(val) : val)),
  website: z.url().max(50, { error: "Website must be less than 50 characters" }).optional(),
  socialMedia: z
    .object({
      x: z.url().max(50, { error: "X must be less than 50 characters" }).optional(),
      instagram: z.url().max(50, { error: "Instagram must be less than 50 characters" }).optional(),
      linkedin: z.url().max(50, { error: "Linkedin must be less than 50 characters" }).optional(),
    })
    .optional(),
});

export const getAllUsersSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .pipe(
      z
        .number()
        .min(1, { message: "Limit must be greater than 0" })
        .max(50, { message: "Limit must be less than 50" })
        .optional(),
    ),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().min(0, { message: "Offset must be greater than or equal to 0" }).optional()),
});

export const getUserByIdSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID (MongoDB ObjectId)"),
});
