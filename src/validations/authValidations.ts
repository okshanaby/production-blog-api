// Enhanced validation schema
import { sanitizeString } from "@/helpers/validationHelpers";
import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email").max(50).toLowerCase().trim(),

  password: z
    .string()
    .min(8)
    .max(30) // Allow longer passwords
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^a-zA-Z0-9]/, "Must contain special character"),

  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/, "Only alphanumeric, underscore, and hyphen allowed")
    .transform(sanitizeString)
    .optional(),

  role: z.enum(["admin", "user"]).optional(),
});

// export const updateProfileSchema = z.object({
//   bio: z
//     .string()
//     .max(200)
//     .optional()
//     .transform((val) => (val ? sanitizeString(val) : val)),

//   website: z
//     .url()
//     .max(100)
//     .optional()
//     .refine(
//       (val) =>
//         !val ||
//         validator.isURL(val, {
//           protocols: ["http", "https"],
//           require_protocol: true,
//         }),
//     ),
// });
