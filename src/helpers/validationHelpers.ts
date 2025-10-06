import { VALIDATION_CONSTANTS } from "@/constants";
import sanitizeHtml from "sanitize-html";

export const sanitizeContent = (str: string) => {
  return sanitizeHtml(str, {
    allowedTags: VALIDATION_CONSTANTS.ALLOWED_TAGS as string[],
    allowedAttributes: VALIDATION_CONSTANTS.ALLOWED_ATTRIBUTES,
  });
};