import validator from "validator";

export const sanitizeString = (str: string) => {
  return validator.escape(validator.trim(str));
};
