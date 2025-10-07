import { sanitizeContent } from "@/helpers/validationHelpers";
import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, { error: "Content is required" })
    .max(500, { error: "Content must be less than 500 characters" })
    .transform(sanitizeContent),
});

export const getCommentByIdSchema = z.object({
  commentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid comment ID (MongoDB ObjectId)"),
});
