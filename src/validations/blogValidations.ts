import { sanitizeContent } from "@/helpers/validationHelpers";
import { z } from "zod";

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(1, { error: "Title is required" })
    .max(100, { error: "Title must be less than 100 characters" })
    .transform(sanitizeContent),
  content: z
    .string()
    .min(1, { error: "Content is required" })
    .max(5000, { error: "Content must be less than 5000 characters" })
    .transform(sanitizeContent),
  author: z
    .string()
    .min(1, { error: "Author is required" })
    .max(50, { error: "Author must be less than 50 characters" }),
});
